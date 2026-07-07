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
