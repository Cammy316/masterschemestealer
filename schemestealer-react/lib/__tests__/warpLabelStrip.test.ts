import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LABEL_STRIP_H, posterLayout, swatchRect } from '../reveal/warpCompose';
import { SAFE_RECT } from '../reveal/revealLayout';
import { WARP_DURATION_MS, warpFrameState } from '../reveal/warpTimeline';

/**
 * The register's rule, applied to the warp path for the first time: ARTWORK MAY
 * LEAVE THE SAFE AREA, INFORMATION MAY NOT.
 *
 * `SAFE_RECT` containment was unit-tested on the pict-cast path only. The warp
 * path's wall rows were never subjected to it, and the shipped clip rendered
 * paint names and ΔE at y≈1600-1750 — behind TikTok's caption and username,
 * with the rightmost swatch's label behind the action rail. 15.3% of all detail
 * pixels sat below y=1430 and 9.8% right of x=900.
 *
 * These assertions are geometric rather than pixel-based on purpose: they fail
 * on the LAYOUT, before anything is rendered, so a regression is caught in
 * milliseconds rather than in a 12-second encode.
 */

const SAFE_BOTTOM = SAFE_RECT.y + SAFE_RECT.h; // 1430
const SAFE_RIGHT = SAFE_RECT.x + SAFE_RECT.w; // 900
const N = 6;

describe('warp label strip stays inside the safe area', () => {
  // A 4:5-cropped photo, which is what the reference layout produces.
  const layout = posterLayout(1080, 1350);

  it('ends exactly on the caption line, leaving no sliver', () => {
    const stripBottom = layout.palette.y + LABEL_STRIP_H;
    expect(stripBottom).toBeLessThanOrEqual(SAFE_BOTTOM);
    // Not merely inside — flush. A gap here is a band of frame that is neither
    // type nor artwork, and the first cut left a 4px one that read as
    // information sitting under the caption.
    expect(SAFE_BOTTOM - stripBottom).toBeLessThanOrEqual(1);
  });

  it('puts every swatch BELOW the line, where artwork is allowed', () => {
    for (let i = 0; i < N; i++) {
      const r = swatchRect(i, N, layout.palette);
      expect(r.y, `swatch ${i} starts above the caption line`).toBeGreaterThanOrEqual(
        SAFE_BOTTOM - 1
      );
    }
  });

  /**
   * Intent: this is the assertion that would have caught the shipped defect.
   * The old layout drew the name and ΔE inside the swatch, at
   * `r.y + r.h - 26` — roughly y=1750 for a 6-colour palette. Reinstating that
   * puts the label below SAFE_BOTTOM and fails here.
   */
  it('keeps the label text out of the swatch rects entirely', () => {
    const src = readFileSync(resolve(__dirname, '..', 'reveal', 'warpCompose.ts'), 'utf-8');
    // The rotated in-swatch label is gone: no rotate(-90) around drawText.
    expect(src).not.toContain('ctx.rotate(-Math.PI / 2)');
    // And the strip draws from the palette's own top, not from a swatch rect.
    expect(src).toContain('const cy = palette.y + LABEL_STRIP_H / 2;');
  });

  it('right-aligns the ΔE to the safe edge, not the frame edge', () => {
    const src = readFileSync(resolve(__dirname, '..', 'reveal', 'warpCompose.ts'), 'utf-8');
    expect(src).toContain('SAFE_RECT.x + SAFE_RECT.w - 20');
    // The frame-edge form is what put the ΔE under the action rail at x≈1054.
    expect(src).not.toContain('palette.x + palette.w - 26');
    expect(SAFE_RIGHT).toBe(900);
  });
});

describe('the strip carries information into the frames people keep', () => {
  const at = (ms: number) => warpFrameState(ms, WARP_DURATION_MS, N);

  /**
   * Intent: the finished poster is the frame that gets screenshotted and
   * reposted, and it used to carry no paint name, no ΔE and no reason to visit
   * — every label had faded to nothing by t=11.3s. It is documented as an
   * aesthetic decision and it IS more elegant, but that frame is the marketing.
   */
  it('names a paint at full opacity in the held payoff frame', () => {
    const hold = at(WARP_DURATION_MS * 0.93);
    expect(hold.phase).toBe('hold');
    expect(hold.strip).not.toBeNull();
    expect(hold.strip!.alpha).toBeGreaterThanOrEqual(0.8);
  });

  // Intent: the loop seam is the product — the clip autoplays repeatedly. If
  // the strip named a different paint at f=0 than at f=1, the restart would
  // show a visible text swap.
  it('names the SAME paint at both ends of the loop', () => {
    const first = at(0);
    const last = at(WARP_DURATION_MS);
    expect(first.strip).not.toBeNull();
    expect(last.strip).not.toBeNull();
    expect(first.strip!.index).toBe(last.strip!.index);
    expect(first.strip!.alpha).toBeCloseTo(last.strip!.alpha, 6);
  });

  it('follows the colour that has most recently landed during the pour', () => {
    const early = at(WARP_DURATION_MS * 0.32);
    const late = at(WARP_DURATION_MS * 0.66);
    expect(early.strip).not.toBeNull();
    expect(late.strip).not.toBeNull();
    expect(late.strip!.index).toBeGreaterThan(early.strip!.index);
  });

  it('is readable type, not the 9pt rotated labels it replaced', () => {
    const src = readFileSync(resolve(__dirname, '..', 'reveal', 'warpCompose.ts'), 'utf-8');
    const from = src.indexOf('function drawLabelStrip');
    // Bounded to this function only — an unbounded slice ran on into the
    // watermark's 17px and failed on type that is not the strip's.
    const strip = src.slice(from, src.indexOf('\n}', from));
    const sizes = [...strip.matchAll(/size:\s*(\d+)/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBeGreaterThanOrEqual(2);
    // The name was 25px rotated (~9pt on a phone) and the ΔE 19px (~5pt).
    expect(Math.max(...sizes), 'paint name is too small to read at arm’s length')
      .toBeGreaterThanOrEqual(32);
    expect(Math.min(...sizes), 'ΔE is too small to read').toBeGreaterThanOrEqual(24);
  });
});
