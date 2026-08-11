import { describe, it, expect } from 'vitest';
import { pickVideoMime, videoMimeSupport } from '../reveal/renderRevealVideo';
import { frameTimestamps } from '../reveal/renderRevealOffline';
import { outputSize } from '../reveal/revealCompose';
import {
  garbleReveal,
  fitRect,
  hexToRgba,
  labelTint,
  deltaBandColour,
  deltaBandName,
  captionText,
  recipeSteps,
  buildRevealSpec,
} from '../reveal/revealCompose';
import { frameState } from '../reveal/revealTimeline';
import { buildRevealCaptions } from '../reveal/revealCaptions';
import type { Color, PaintRecipe } from '../types';

describe('pickVideoMime', () => {
  // Intent: MP4/H.264 is the widely-accepted master; WebM is refused by
  // Instagram's uploader and won't play on iOS. The first export shipped as VP8
  // WebM because the bare `avc1` shorthand fails isTypeSupported in Chrome — the
  // candidate list must lead with FULL profile strings.
  it('prefers a fully-specified mp4 profile when supported', () => {
    expect(pickVideoMime(() => true)).toBe('video/mp4;codecs="avc1.640028,mp4a.40.2"');
  });
  it('tries every mp4 form before falling back to webm', () => {
    // a browser that only accepts the bare mp4 type must still get mp4
    expect(pickVideoMime((m) => m === 'video/mp4')).toBe('video/mp4');
  });
  it('offers Opus-paired mp4 for browsers that cannot encode AAC (Chrome)', () => {
    // Chrome-like: rejects anything naming AAC, accepts H.264+Opus in mp4.
    const chromeLike = (m: string) => !m.includes('mp4a') && m.startsWith('video/mp4;codecs="avc1');
    expect(pickVideoMime(chromeLike)).toBe('video/mp4;codecs="avc1.640028,opus"');
  });
  it('falls back to webm/vp9 when no mp4 form is supported', () => {
    expect(pickVideoMime((m) => m.startsWith('video/webm'))).toBe('video/webm;codecs="vp9,opus"');
  });
  it('returns null when nothing is recordable', () => {
    expect(pickVideoMime(() => false)).toBeNull();
  });
});

describe('videoMimeSupport', () => {
  // Intent: two device exports in a row landed on VP8 WebM with no way to know
  // why — the telemetry map must cover every candidate so a single real export
  // settles what that browser can record.
  it('reports a verdict for every candidate', () => {
    const map = videoMimeSupport((m) => m === 'video/webm');
    const keys = Object.keys(map);
    expect(keys.length).toBeGreaterThanOrEqual(9);
    expect(keys.some((k) => k.includes('opus') && k.startsWith('video/mp4'))).toBe(true);
    expect(map['video/webm']).toBe(true);
    expect(map['video/mp4']).toBe(false);
  });
});

describe('frameTimestamps', () => {
  // Intent: the offline renderer emits an exact CFR timeline. MediaRecorder's
  // real-time capture dropped to 5 fps on mobile because it drops frames it
  // can't encode in time; here the count is fixed and the spacing is exact.
  it('emits exactly duration × fps frames at exact intervals', () => {
    const ts = frameTimestamps(13000, 30);
    expect(ts.length).toBe(390);
    expect(ts[0]).toBe(0);
    for (let i = 1; i < ts.length; i++) {
      expect(ts[i] - ts[i - 1]).toBeCloseTo(1000 / 30, 9);
    }
  });

  // Intent: the seam. Frame N would BE frame 0 (the clip loops), so rendering
  // it would duplicate a frame and stall the loop for one tick.
  it('stops one interval short of the duration so the wrap is the seam', () => {
    const ts = frameTimestamps(13000, 30);
    expect(ts[ts.length - 1]).toBeCloseTo(13000 - 1000 / 30, 6);
    expect(ts[ts.length - 1]).toBeLessThan(13000);
  });

  it('never emits an empty timeline', () => {
    expect(frameTimestamps(0, 30).length).toBe(1);
  });
});

describe('outputSize', () => {
  // Intent: the MediaRecorder fallback renders at 720×1280 because its software
  // encoder is the bottleneck — composition still happens in logical 1080×1920.
  it('scales the physical canvas while keeping 9:16', () => {
    expect(outputSize(1)).toEqual({ width: 1080, height: 1920 });
    expect(outputSize(2 / 3)).toEqual({ width: 720, height: 1280 });
  });
});

describe('garbleReveal', () => {
  it('is fully resolved at progress 1 and stable', () => {
    expect(garbleReveal('MEPHISTON RED', 1)).toBe('MEPHISTON RED');
  });
  it('resolves left-to-right and preserves spaces', () => {
    const mid = garbleReveal('BLOOD RED', 0.5);
    expect(mid.slice(0, 4)).toBe('BLOO'); // first ~half resolved
    expect(mid).toContain(' '); // space preserved
    expect(mid.length).toBe('BLOOD RED'.length);
  });

  // Intent: real exports rendered CYSJ, SCGRBP, MAGENR9, BLASH, REB — plausible
  // fake WORDS, held long enough to read at 30 fps. A product selling measured
  // accuracy cannot look like it can't spell. Symbols make that impossible by
  // construction: every unresolved character is a non-letter.
  it('never emits a letter that is not the true prefix', () => {
    for (const word of ['CYAN', 'SILVER', 'MAGENTA', 'BLACK', 'DARK GREY']) {
      for (let p = 0; p <= 1.0001; p += 0.02) {
        const out = garbleReveal(word, p);
        const resolved = Math.floor(Math.min(1, p) * word.length);
        for (let i = 0; i < out.length; i++) {
          if (i < resolved || word[i] === ' ') {
            expect(out[i]).toBe(word[i]);
          } else {
            // unresolved → must be a symbol, never A–Z or 0–9
            expect(out[i]).not.toMatch(/[A-Z0-9]/i);
          }
        }
      }
    }
  });
});

describe('fitRect', () => {
  it('contains the image within the box, centred', () => {
    const box = { x: 100, y: 200, w: 900, h: 1000 };
    const r = fitRect(2000, 1000, box); // wide image → width-limited
    expect(r.w).toBeLessThanOrEqual(box.w + 1e-6);
    expect(r.h).toBeLessThanOrEqual(box.h + 1e-6);
    // centred horizontally
    expect(r.x + r.w / 2).toBeCloseTo(box.x + box.w / 2, 5);
  });
});

describe('hexToRgba', () => {
  // Intent: the sweep used to be hard-coded imperial green even on the purple
  // Warp skin; it now fades the active accent, which needs rgba from a hex.
  it('converts a hex accent to an alpha-carrying rgba', () => {
    expect(hexToRgba('#00FF41', 0.5)).toBe('rgba(0, 255, 65, 0.5)');
    expect(hexToRgba('#A78BFA', 1)).toBe('rgba(167, 139, 250, 1)');
  });
});

describe('labelTint', () => {
  // Intent: on the real marine scan the BLACK and BROWN callouts were invisible
  // — label text in the region's own hex fails for dark families. Dark hexes
  // get lifted to a readable floor; light ones pass through untouched.
  it('lifts dark hexes to the readable floor', () => {
    const tinted = labelTint('#1a1a1a');
    expect(tinted).not.toBe('#1a1a1a');
    const m = tinted.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/)!;
    const luma = 0.2126 * parseInt(m[1], 16) + 0.7152 * parseInt(m[2], 16) + 0.0722 * parseInt(m[3], 16);
    expect(luma).toBeGreaterThanOrEqual(139);
  });

  // Intent: the return value gets fed back into hexToRgba to build glows and
  // rims. It used to come back as `rgb(...)`, which parses as NaN there and
  // fell through to the imperial-green fallback — every warp orb rim rendered
  // green regardless of its colour. The FORMAT is load-bearing, not cosmetic.
  it('always returns a #rrggbb string that hexToRgba can parse', () => {
    for (const hex of ['#1a1a1a', '#000000', '#8a3a3a', '#e8c56a']) {
      const tinted = labelTint(hex);
      expect(tinted, `${hex} -> ${tinted}`).toMatch(/^#[0-9a-f]{6}$/i);
      expect(hexToRgba(tinted, 0.5)).not.toBe('rgba(0,255,65,0.5)');
    }
  });
  it('leaves already-readable hexes exactly as they are', () => {
    expect(labelTint('#e8c56a')).toBe('#e8c56a'); // light yellow
    expect(labelTint('#00FF41')).toBe('#00FF41'); // neon green
  });
});

describe('deltaBandName', () => {
  // Intent: "ΔE 0.8" means nothing to someone who has never used the product.
  // The word is computed from the value — never hardcoded — so the clip can
  // never claim a band the number does not support.
  it('maps the fixed vocabulary at every boundary', () => {
    expect(deltaBandName(2.0)).toBe('PERFECT');
    expect(deltaBandName(2.01)).toBe('CLOSE');
    expect(deltaBandName(5.0)).toBe('CLOSE');
    expect(deltaBandName(5.01)).toBe('FAIR');
    expect(deltaBandName(10.0)).toBe('FAIR');
    expect(deltaBandName(10.01)).toBe('DISTANT');
  });
});

describe('paint-count copy', () => {
  // Intent: a hardcoded count is a stale claim waiting to happen — the database
  // changes and a number burned into an exported video can never be corrected.
  // The honest claim ("physically measured") survives; the figure does not.
  it('no reveal-surface string quotes a paint count', () => {
    const caps = buildRevealCaptions({ colourCount: 5, topFamily: 'Red', brandLabel: 'Citadel' });
    for (const text of [caps.tiktok, caps.reels, caps.shorts]) {
      expect(text).not.toMatch(/\d[\d,]{2,}\s*(measured\s+)?paints?/i);
    }
  });
});

describe('deltaBandColour', () => {
  // Intent: the badge is the brand's honesty signal — its colour must follow the
  // app's band vocabulary, not flatter every match with green.
  it('maps the app ΔE bands', () => {
    expect(deltaBandColour(1.2)).toBe('#00FF41'); // perfect
    expect(deltaBandColour(3.4)).toBe('#A3E635'); // close
    expect(deltaBandColour(8.2)).toBe('#F59E0B'); // fair
    expect(deltaBandColour(14)).toBe('#EF4444'); // distant
  });
});

describe('recipeSteps', () => {
  const recipe = {
    citadel: {
      base: { name: 'Mephiston Red', hex: '#9a1115', type: 'base', deltaE: 1.84 },
      shade: { name: 'Nuln Oil', hex: '#111', type: 'shade' },
      highlight: null,
      wash: { name: 'Carroburg Crimson', hex: '#600', type: 'wash' },
    },
  } as unknown as PaintRecipe;

  // Intent: the clip teaches the sequence the painter will follow at the desk,
  // so it must match the app's recipe card order, not invent its own.
  it('emits present steps in base→highlight→shade→wash order, skipping nulls', () => {
    const steps = recipeSteps(recipe, 'citadel');
    expect(steps.map((s) => s.role)).toEqual(['base', 'shade', 'wash']);
    expect(steps[0].name).toBe('Mephiston Red');
  });
  // Intent: the ΔE badge is the brand's honesty signal — it has to survive the
  // trip from the match into the clip.
  it('carries the base match ΔE through to the outro', () => {
    expect(recipeSteps(recipe, 'citadel')[0].deltaE).toBe(1.84);
  });
  it('returns empty when the brand recipe is missing', () => {
    expect(recipeSteps(recipe, 'vallejo')).toEqual([]);
  });
});

describe('buildRevealCaptions', () => {
  const caps = buildRevealCaptions({ colourCount: 5, topFamily: 'Red', brandLabel: 'Citadel' });

  it('gives each platform DIFFERENT copy (identical cross-posts get penalised)', () => {
    expect(caps.tiktok).not.toBe(caps.reels);
    expect(caps.reels).not.toBe(caps.shorts);
  });
  it('routes to the site per platform convention and never claims a spectrophotometer', () => {
    // TikTok/Shorts allow a URL; IG Reels convention is "link in bio".
    expect(caps.tiktok).toContain('schemestealer.com');
    expect(caps.shorts).toContain('schemestealer.com');
    expect(caps.reels.toLowerCase()).toContain('bio');
    for (const text of [caps.tiktok, caps.reels, caps.shorts]) {
      expect(text.toLowerCase()).not.toContain('spectrophotometer');
    }
  });
  it('uses British spelling (colour, not color)', () => {
    for (const text of [caps.tiktok, caps.reels, caps.shorts]) {
      expect(text).not.toMatch(/\bcolor\b/i);
    }
  });

  // Intent: the two clips are for different posts by different people — a
  // painter showing off their own model, versus someone who found a scheme they
  // want to steal. Reusing the miniature copy on an inspiration clip promises a
  // model that is not in the video.
  describe('inspiration variant', () => {
    const warp = buildRevealCaptions({
      colourCount: 6,
      topFamily: 'Teal',
      brandLabel: 'Citadel',
      mode: 'inspiration',
    });

    it('is distinct from the miniature copy on every platform', () => {
      expect(warp.tiktok).not.toBe(caps.tiktok);
      expect(warp.reels).not.toBe(caps.reels);
      expect(warp.shorts).not.toBe(caps.shorts);
    });

    it('is distinct per platform, as the miniature copy is', () => {
      expect(warp.tiktok).not.toBe(warp.reels);
      expect(warp.reels).not.toBe(warp.shorts);
    });

    it('never claims a model, a spectrophotometer, or a paint count', () => {
      for (const text of [warp.tiktok, warp.reels, warp.shorts]) {
        const lower = text.toLowerCase();
        expect(lower).not.toContain('spectrophotometer');
        expect(lower).not.toContain('my mini');
        expect(lower).not.toContain('this model');
        // A count of paints in the database changes; a caption outlives it.
        expect(lower).not.toMatch(/[0-9,]+\s+(measured\s+)?paints\b/);
      }
    });

    it('uses British spelling and routes per platform convention', () => {
      for (const text of [warp.tiktok, warp.reels, warp.shorts]) {
        expect(text).not.toMatch(/\bcolor\b/i);
      }
      expect(warp.tiktok).toContain('schemestealer.com');
      expect(warp.shorts).toContain('schemestealer.com');
      expect(warp.reels.toLowerCase()).toContain('bio');
    });
  });
});

describe('buildRevealSpec', () => {
  function colour(hex: string, y: number, withMask: boolean, pct = 0): Color {
    return {
      rgb: [0, 0, 0],
      lab: [0, 0, 0],
      hex,
      family: 'red',
      percentage: pct,
      position: { x: 0.5, y },
      mask: withMask ? 'AAAA' : null,
    };
  }

  it('drops regions with no mask; percentage ties fall back to top→bottom order', () => {
    const colors = [colour('#a', 0.8, true), colour('#b', 0.2, true), colour('#c', 0.5, false)];
    const spec = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000);
    // only the two with masks, tied percentage → ordered by y (0.2 before 0.8)
    expect(spec.regions.map((r) => r.index)).toEqual([1, 0]);
    expect(spec.colourCount).toBe(2);
  });

  // Intent: quick wins escalate to the dominant colour igniting last — the
  // reveal order is coverage, smallest first.
  it('orders regions smallest coverage first, dominant last', () => {
    const colors = [colour('#a', 0.2, true, 60), colour('#b', 0.5, true, 10), colour('#c', 0.8, true, 30)];
    const spec = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000);
    expect(spec.regions.map((r) => r.index)).toEqual([1, 2, 0]);
  });

  // Intent: five regions get called out but only one gets a recipe — the outro
  // has to name which, so the viewer isn't left asking "what about the cyan?".
  it('maps the recipe colour onto its position in the reveal order', () => {
    const colors = [colour('#a', 0.8, true, 60), colour('#b', 0.2, true, 10)];
    // colour index 0 is dominant → reveals LAST → region index 1
    expect(buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000, 0).recipeRegionIndex).toBe(1);
    expect(buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000, 1).recipeRegionIndex).toBe(0);
  });
  it('reports -1 when the recipe colour has no revealed region', () => {
    const colors = [colour('#a', 0.8, true), colour('#b', 0.5, false)];
    expect(buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000, 1).recipeRegionIndex).toBe(-1);
  });
});

describe('captionText', () => {
  const colors: Color[] = [0.2, 0.5, 0.8].map((y, i) => ({
    rgb: [0, 0, 0] as [number, number, number],
    lab: [0, 0, 0] as [number, number, number],
    hex: `#00ff4${i}`,
    family: 'green',
    percentage: 10 * (i + 1),
    position: { x: 0.5, y },
    mask: 'AAAA',
  }));
  const spec = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000, 0);
  const at = (f: number) => captionText(spec, frameState(spec.durationMs * f, spec));

  // Intent: the opening sells the RESULT, not the process. The old
  // "CAN THE MACHINE READ THIS PAINT JOB?" was a yes/no question whose answer
  // the viewer already assumed, so it bought no attention.
  it('opens on a result, not a question', () => {
    const opener = at(0);
    expect(opener).toBe('THE EXACT PAINTS ON THIS MODEL');
    expect(opener).not.toMatch(/\?$/);
  });

  // Intent: a static "IDENTIFIED IN 5 COLOURS" from second one gives a viewer
  // nothing to watch for. The count climbs, then pays off.
  it('counts up during the reveal and resolves to the total', () => {
    expect(at(0.24)).toBe('SCANNING…'); // sweep
    expect(at(0.35)).toMatch(/^READING… \d\/3 COLOURS$/); // region locks
    // Intent: never announce that nothing has happened yet.
    for (let f = 0.273; f < 0.455; f += 0.002) {
      expect(at(f), `counter showed 0/ at f=${f.toFixed(3)}`).not.toMatch(/READING… 0\//);
    }
    expect(at(0.8)).toBe('3 COLOURS IDENTIFIED'); // payoff hold
  });

  // Intent: presets must never assert what the engine cannot know. It detects
  // colours, not factions — an auto-generated chapter name would be fabrication.
  it('honours the fixed result presets without inventing facts', () => {
    const mk = (p: 'never-guess' | 'exact-paints' | 'measured' | 'none') =>
      buildRevealSpec(colors, [{ role: 'base', name: 'X', hex: '#111', deltaE: 1.8 }], 'Citadel', 'imperial', p, 11000, 0);
    const ng = mk('never-guess');
    expect(captionText(ng, frameState(0, ng))).toBe('NEVER GUESS A RECIPE AGAIN');
    const ep = mk('exact-paints');
    expect(captionText(ep, frameState(6000, ep))).toBe('THE EXACT PAINTS ON THIS MODEL');
    // ΔE copy uses the REAL measured number or drops the claim entirely.
    const me = mk('measured');
    expect(captionText(me, frameState(0, me))).toBe('ΔE 1.8. MEASURED, NOT GUESSED.');
    const noDelta = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'measured', 11000, 0);
    expect(captionText(noDelta, frameState(0, noDelta))).toBe('MEASURED, NOT GUESSED.');
    const none = mk('none');
    expect(captionText(none, frameState(6000, none))).toBeNull();
  });
});
