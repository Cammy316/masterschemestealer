import { describe, it, expect } from 'vitest';
import { pickVideoMime } from '../reveal/renderRevealVideo';
import {
  garbleReveal,
  fitRect,
  hexToRgba,
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
  it('falls back to webm/vp9 when no mp4 form is supported', () => {
    expect(pickVideoMime((m) => m.startsWith('video/webm'))).toBe('video/webm;codecs="vp9,opus"');
  });
  it('returns null when nothing is recordable', () => {
    expect(pickVideoMime(() => false)).toBeNull();
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
});

describe('buildRevealSpec', () => {
  function colour(hex: string, y: number, withMask: boolean): Color {
    return {
      rgb: [0, 0, 0],
      lab: [0, 0, 0],
      hex,
      family: 'red',
      position: { x: 0.5, y },
      mask: withMask ? 'AAAA' : null,
    };
  }

  it('drops regions with no mask and orders the rest top→bottom', () => {
    const colors = [colour('#a', 0.8, true), colour('#b', 0.2, true), colour('#c', 0.5, false)];
    const spec = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000);
    // only the two with masks, ordered by y (0.2 before 0.8)
    expect(spec.regions.map((r) => r.index)).toEqual([1, 0]);
    expect(spec.colourCount).toBe(2);
  });

  // Intent: five regions get called out but only one gets a recipe — the outro
  // has to name which, so the viewer isn't left asking "what about the cyan?".
  it('maps the recipe colour onto its position in the reveal order', () => {
    const colors = [colour('#a', 0.8, true), colour('#b', 0.2, true)];
    // colour index 0 sorts SECOND (y 0.8), so the region index is 1
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
    rgb: [0, 0, 0],
    lab: [0, 0, 0],
    hex: `#00ff4${i}`,
    family: 'green',
    position: { x: 0.5, y },
    mask: 'AAAA',
  }));
  const spec = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'colours', 13000, 0);
  const at = (f: number) => captionText(spec, frameState(spec.durationMs * f, spec));

  // Intent: the hook frame is the model alone — a caption over it competes with
  // the paint job for the two seconds that decide the scroll.
  it('keeps the hero frame clean', () => {
    expect(at(0)).toBeNull();
  });

  // Intent: a static "IDENTIFIED IN 5 COLOURS" from second one gives a viewer
  // nothing to watch for. The count climbs, then pays off.
  it('counts up during the reveal and resolves to the total', () => {
    expect(at(0.18)).toBe('SCANNING…');
    expect(at(0.4)).toMatch(/^READING… \d\/3 COLOURS$/);
    expect(at(0.85)).toBe('3 COLOURS IDENTIFIED');
  });

  it('honours the other presets', () => {
    const ms = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'machine-spirit', 13000, 0);
    expect(captionText(ms, frameState(6000, ms))).toBe('THE MACHINE SPIRIT KNOWS YOUR RECIPE');
    const none = buildRevealSpec(colors, [], 'Citadel', 'imperial', 'none', 13000, 0);
    expect(captionText(none, frameState(6000, none))).toBeNull();
  });
});
