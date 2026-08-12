import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SOFT_BLUR_MAX_PX, SOFT_BLUR_PX, SOFT_MAX_MIX } from '../reveal/warpCompose';

/**
 * Guards the fix for: 1.6 s of the shipped warp-cast sat at 44-47% of its own
 * median sharpness (t=2.27-3.83s, measured on the 2026-08-12 device export).
 * That is 11% of the runtime, in the window where a viewer decides whether to
 * keep watching, on a product whose entire claim is colour accuracy.
 *
 * A constant alone would not hold the line — someone can always write the blur
 * inline again — so this also reads the source and asserts the filter string is
 * still driven by the constant.
 */
describe('warp transition defocus', () => {
  it('keeps the soft-focus blur inside its bound', () => {
    expect(SOFT_BLUR_PX).toBeLessThanOrEqual(SOFT_BLUR_MAX_PX);
    expect(SOFT_BLUR_PX).toBeGreaterThan(0);
  });

  /**
   * Intent: reducing the blur radius alone CANNOT clear the gate, and that is
   * the trap this test exists to close. Measured on the shipped export, the
   * photo carries ~70% of the frame's gradient energy, and a 2px blur still
   * leaves the photo at ~51% of sharp — so at full mix the frame sits near 0.66
   * of its median, under the 0.70 gate. The cross-fade has to stop short of
   * fully replacing the hero.
   */
  it('caps how much of the sharp hero the soft twin may replace', () => {
    expect(SOFT_MAX_MIX).toBeLessThanOrEqual(0.7);
    expect(SOFT_MAX_MIX).toBeGreaterThan(0.3);

    // The model the constant was derived from, kept here so the arithmetic is
    // checkable rather than folded into a comment.
    const photoShareOfGradient = 0.697;
    const photoRatioAtFullBlur = 0.506; // 2px on real device content
    const frameRatio =
      photoShareOfGradient * (1 - SOFT_MAX_MIX * (1 - photoRatioAtFullBlur)) +
      (1 - photoShareOfGradient);
    expect(frameRatio).toBeGreaterThan(0.75);
  });

  // Intent: the bound is only meaningful while the constant is what actually
  // reaches the canvas. A future edit that hard-codes blur(9px) would leave
  // every assertion above passing and re-open the defect.
  it('drives the canvas filter from the constant, not a literal', () => {
    const src = readFileSync(
      resolve(__dirname, '..', 'reveal', 'warpCompose.ts'),
      'utf-8'
    );
    expect(src).toContain('blur(${SOFT_BLUR_PX}px)');
    expect(src).toContain('state.soften * SOFT_MAX_MIX');

    const inlineBlur = src.match(/blur\((\d+(?:\.\d+)?)px\)/g) ?? [];
    expect(
      inlineBlur,
      `hard-coded blur radii found: ${inlineBlur.join(', ')}`
    ).toHaveLength(0);
  });

  // Intent: the drain must still READ. The pack's instruction is that if the
  // transition needs the image to recede, it recedes by luminance and
  // saturation rather than defocus of the photograph.
  it('still drains colour and luminance from the soft twin', () => {
    const src = readFileSync(
      resolve(__dirname, '..', 'reveal', 'warpCompose.ts'),
      'utf-8'
    );
    const filter = src.match(/blur\(\$\{SOFT_BLUR_PX\}px\)[^`]*/)?.[0] ?? '';
    const sat = Number(filter.match(/saturate\(([\d.]+)\)/)?.[1] ?? 1);
    const bright = Number(filter.match(/brightness\(([\d.]+)\)/)?.[1] ?? 1);
    expect(sat).toBeLessThan(0.7);
    expect(bright).toBeLessThan(0.8);
  });
});
