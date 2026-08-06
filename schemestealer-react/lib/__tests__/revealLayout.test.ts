import { describe, it, expect } from 'vitest';
import {
  CANVAS_H,
  CHIP_GAP,
  CHIP_H,
  COMPACT_BOX,
  FULL_BOX,
  LAYOUT,
  SAFE_RECT,
  insideSafeArea,
  modelHeightFraction,
  recipeRowY,
} from '../reveal/revealLayout';

describe('revealLayout — platform safe area', () => {
  // Intent: on a shipped export the SHADE and WASH rows sat ENTIRELY inside
  // TikTok's caption zone, the ΔE badge sat under the like/comment/share rail,
  // and the watermark — the only persistent branding in the clip — was at
  // y≈1880 where no viewer has ever seen it. Every element that carries
  // information must be inside the safe area, checked mechanically, because
  // eyeballing a 1080×1920 still does not reveal what the platform covers.
  it('every information element lies inside SAFE_RECT', () => {
    for (const [name, rect] of Object.entries(LAYOUT)) {
      expect(insideSafeArea(rect), `${name} ${JSON.stringify(rect)} escapes SAFE_RECT`).toBe(true);
    }
  });

  // Intent: the right-hand action rail was missed entirely in the previous pass
  // — only the bottom was considered — which is how the ΔE badge ended up at
  // x≈944 underneath the share button.
  it('nothing reaches into the action rail', () => {
    const railX = SAFE_RECT.x + SAFE_RECT.w;
    for (const [name, rect] of Object.entries(LAYOUT)) {
      expect(rect.x + rect.w, `${name} crosses the action rail at x=${railX}`).toBeLessThanOrEqual(railX);
    }
  });

  // Intent: all four recipe rows are the payoff. If the last one lands outside
  // the safe area the viewer never sees the wash.
  it('all four recipe rows fit inside the declared block and the safe area', () => {
    const block = LAYOUT.recipeRows;
    for (let i = 0; i < 4; i++) {
      const y = recipeRowY(i);
      expect(y, `row ${i} starts above the block`).toBeGreaterThanOrEqual(block.y);
      expect(y + CHIP_H, `row ${i} overflows the block`).toBeLessThanOrEqual(block.y + block.h);
      expect(insideSafeArea({ x: block.x, y, w: block.w, h: CHIP_H }), `row ${i} escapes SAFE_RECT`).toBe(true);
    }
    // the four rows plus their gaps must actually be what the block reserves
    expect(4 * CHIP_H + 3 * CHIP_GAP).toBeLessThanOrEqual(block.h);
  });

  // Intent: the model is the reason anyone posts this. It shrank to 29.6% of
  // frame height on a shipped export, which reads as the app being the subject
  // rather than their painting.
  it('the model never drops below 40% of frame height', () => {
    expect(modelHeightFraction(COMPACT_BOX)).toBeGreaterThanOrEqual(0.4);
    expect(modelHeightFraction(FULL_BOX)).toBeGreaterThanOrEqual(0.4);
  });

  // Intent: artwork may bleed outside the safe area — only information may not.
  // This records that as deliberate so nobody "fixes" it later.
  it('model boxes are allowed outside the safe area, and are', () => {
    expect(insideSafeArea(FULL_BOX)).toBe(false);
    expect(FULL_BOX.h).toBeLessThanOrEqual(CANVAS_H);
  });

  // Intent: ~280 px of dead black sat between the model's base and the recipe
  // header on a shipped export.
  it('leaves no dead vertical band between the model and the recipe block', () => {
    const gap = LAYOUT.recipeHeading.y - (COMPACT_BOX.y + COMPACT_BOX.h);
    expect(gap, `dead band of ${gap}px above the recipe`).toBeLessThanOrEqual(120);
  });
});
