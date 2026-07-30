import { describe, it, expect } from 'vitest';
import { pickVideoMime } from '../reveal/renderRevealVideo';
import { garbleReveal, fitRect, recipeSteps, buildRevealSpec } from '../reveal/revealCompose';
import { buildRevealCaptions } from '../reveal/revealCaptions';
import type { Color, PaintRecipe } from '../types';

describe('pickVideoMime', () => {
  // Intent: MP4/avc1 is the widely-accepted master; only fall to WebM when MP4
  // recording isn't supported. A wrong preference posts an unplayable file.
  it('prefers mp4 when supported', () => {
    expect(pickVideoMime(() => true)).toBe('video/mp4;codecs=avc1');
  });
  it('falls back to webm/vp9 when mp4 is unsupported', () => {
    expect(pickVideoMime((m) => m.startsWith('video/webm'))).toBe('video/webm;codecs=vp9');
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

describe('recipeSteps', () => {
  const recipe = {
    citadel: {
      base: { name: 'Mephiston Red', hex: '#9a1115', type: 'base' },
      shade: { name: 'Nuln Oil', hex: '#111', type: 'shade' },
      highlight: null,
      wash: { name: 'Carroburg Crimson', hex: '#600', type: 'wash' },
    },
  } as unknown as PaintRecipe;

  it('emits present steps in base→shade→highlight→wash order, skipping nulls', () => {
    const steps = recipeSteps(recipe, 'citadel');
    expect(steps.map((s) => s.role)).toEqual(['base', 'shade', 'wash']);
    expect(steps[0].name).toBe('Mephiston Red');
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
});
