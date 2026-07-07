/**
 * Mask placement geometry for the Auspex Reveal.
 *
 * Backend masks are analysis-resolution and cover only the alpha-bbox CROP
 * of the uploaded frame; `maskFrame` locates that crop (cropX/Y/W/H, frame
 * dims). The production bug drew masks across the WHOLE canvas — the crop
 * offset was dropped and regions bled into the background.
 */

import type { MaskFrame } from './types';

export interface DestRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where the analysis-space mask lands on a w×h canvas: the crop rect
 *  scaled from frame pixels to canvas pixels. Older responses without crop
 *  fields degrade to the full canvas (uncropped inspiration scans). */
export function maskDestRect(
  maskFrame: MaskFrame | undefined,
  canvasW: number,
  canvasH: number
): DestRect {
  const frameW = maskFrame?.frameW ?? maskFrame?.width ?? canvasW;
  const frameH = maskFrame?.frameH ?? maskFrame?.height ?? canvasH;
  const sx = canvasW / frameW;
  const sy = canvasH / frameH;
  return {
    x: (maskFrame?.cropX ?? 0) * sx,
    y: (maskFrame?.cropY ?? 0) * sy,
    w: (maskFrame?.cropW ?? frameW) * sx,
    h: (maskFrame?.cropH ?? frameH) * sy,
  };
}

// ---------------------------------------------------------------------------
// Rail callout layout — numbered chips dock on the left/right frame edges
// with leader lines to their region anchors, instead of sitting on the model
// (five stacked chips used to hide the miniature).
// ---------------------------------------------------------------------------

export interface RailCallout {
  /** index into the original anchors array (== colour index) */
  index: number;
  side: 'left' | 'right';
  /** chip's vertical centre, fraction of frame height (collision-free) */
  railY: number;
  /** the region's anchor point, fractions of the frame */
  anchorX: number;
  anchorY: number;
}

/** Assign each anchor to its nearest side rail and spread the chips
 *  vertically so they can never overlap: per rail, chips start at their
 *  anchor's height (clamped to the padded band), then a forward pass pushes
 *  collisions down and a backward pass pulls the stack up if it overran the
 *  bottom. Anchor order within a rail is preserved top-to-bottom. */
export function layoutRailCallouts(
  anchors: { x: number; y: number }[],
  minGap = 0.12,
  padding = 0.07
): RailCallout[] {
  const callouts: RailCallout[] = anchors.map((a, index) => ({
    index,
    side: a.x < 0.5 ? 'left' : 'right',
    railY: Math.min(1 - padding, Math.max(padding, a.y)),
    anchorX: a.x,
    anchorY: a.y,
  }));

  for (const side of ['left', 'right'] as const) {
    const rail = callouts
      .filter((c) => c.side === side)
      .sort((a, b) => a.anchorY - b.anchorY);
    for (let i = 1; i < rail.length; i++) {
      rail[i].railY = Math.max(rail[i].railY, rail[i - 1].railY + minGap);
    }
    for (let i = rail.length - 1; i >= 0; i--) {
      const ceiling = i === rail.length - 1
        ? 1 - padding
        : rail[i + 1].railY - minGap;
      rail[i].railY = Math.min(rail[i].railY, ceiling);
    }
  }
  return callouts;
}
