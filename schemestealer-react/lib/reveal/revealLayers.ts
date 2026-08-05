/**
 * Shared Auspex reveal canvas primitives.
 *
 * Extracted verbatim from AuspexReveal so the LIVE results reveal and the
 * offscreen video exporter (Engine A) share ONE implementation of the look —
 * dim/greyscale base, real-image region clipping, corner brackets. Divergence
 * here would make an exported clip stop matching what the user saw on screen.
 *
 * All functions work in IMAGE space (canvas sized to the source image); the
 * exporter fits the resulting layers into its 1080×1920 portrait composition.
 */

import type { MaskFrame } from '../types';
import { maskDestRect } from '../maskGeometry';

/** Decode a base64 PNG (the RGBA mask whose alpha channel is the region). */
export async function decodeMask(base64: string): Promise<ImageBitmap | null> {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'image/png' });
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
}

/** How hard the greyscale base is knocked back. The on-screen reveal is viewed
 *  up close on a dark screen; the exported clip is viewed thumbnail-sized on a
 *  bright feed, where the app's dimming reads as a muddy blob. Same look, two
 *  viewing distances — so the level is a parameter, not a fork. */
export interface BaseDim {
  /** brightness() multiplier applied with the greyscale filter */
  brightness: number;
  /** opacity of the void veil painted over the model pixels */
  veil: number;
}
export const SCREEN_BASE_DIM: BaseDim = { brightness: 0.5, veil: 0.45 };
export const VIDEO_BASE_DIM: BaseDim = { brightness: 0.85, veil: 0.15 };

/** Mean luma (0–255) of a layer's OPAQUE pixels, sampled via a small offscreen
 *  readback. Transparent background (the removed backdrop) is excluded. */
export function measureMeanLuma(layer: HTMLCanvasElement): number {
  const S = 64;
  const probe = document.createElement('canvas');
  probe.width = S;
  probe.height = S;
  const ctx = probe.getContext('2d', { willReadFrequently: true });
  if (!ctx) return 128;
  ctx.drawImage(layer, 0, 0, S, S);
  const { data } = ctx.getImageData(0, 0, S, S);
  let sum = 0;
  let count = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 32) continue;
    sum += 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    count++;
  }
  return count > 0 ? sum / count : 128;
}

/**
 * Fixed dimming failed on real schemes: a red marine converts to ~35% luma and
 * reads as a black silhouette for the whole scan phase (the pink test mini only
 * looked right because pink is light). Scale the greyscale brightness so every
 * model lands near the same visible grey, whatever it was painted.
 */
export function adaptiveVideoDim(meanLuma: number): BaseDim {
  const TARGET = 150;
  const brightness = Math.min(2.4, Math.max(0.8, TARGET / Math.max(1, meanLuma)));
  return { brightness, veil: VIDEO_BASE_DIM.veil };
}

/**
 * The model dimmed IN PLACE. `source-atop` keeps the RGBA background
 * transparent so the backdrop shows through; adds CRT scanlines.
 */
export function buildBaseLayer(
  img: CanvasImageSource,
  w: number,
  h: number,
  greyscale: boolean,
  dim: BaseDim = SCREEN_BASE_DIM,
): HTMLCanvasElement | null {
  const layer = document.createElement('canvas');
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return null;
  if (greyscale) {
    ctx.filter = `grayscale(1) brightness(${dim.brightness})`;
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
  } else {
    ctx.drawImage(img, 0, 0);
  }
  ctx.globalCompositeOperation = 'source-atop'; // model pixels only
  ctx.fillStyle = greyscale ? `rgba(4, 8, 6, ${dim.veil})` : 'rgba(5, 12, 10, 0.72)';
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
    ctx.fillRect(0, y, w, 1);
  }
  return layer;
}

/**
 * The model exactly as the painter shot it — no greyscale, no veil, no
 * scanlines. This is the export's opening frame AND its loop target: the hook
 * is their paint job, and the clip dissolves back onto it.
 */
export function buildHeroLayer(img: CanvasImageSource, w: number, h: number): HTMLCanvasElement | null {
  const layer = document.createElement('canvas');
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  return layer;
}

/**
 * The user's REAL image clipped to one region (alpha-keyed mask drawn into
 * its crop rect). No tinting — the point is showing actual paint.
 */
export function buildRegionLayer(
  img: CanvasImageSource,
  mask: ImageBitmap,
  w: number,
  h: number,
  maskFrame: MaskFrame | undefined,
): HTMLCanvasElement | null {
  const dst = maskDestRect(maskFrame, w, h);
  const layer = document.createElement('canvas');
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(img, 0, 0);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(mask, 0, 0, mask.width, mask.height, dst.x, dst.y, dst.w, dst.h);
  return layer;
}

/**
 * A hollow contour ring around one region, in that region's colour.
 *
 * The export used to glow by shadow-blurring the whole region layer, which
 * bloomed a wash of hex over the photograph and flattened the blending the
 * painter actually did. The glow belongs on the OUTLINE: dilate the mask,
 * punch the original back out, and let this ring carry the light while the
 * region pixels stay untouched.
 *
 * The mask is smoothed through a ¼-scale round-trip first: real grabCut masks
 * are full of pinhole speckle, and rimming the raw mask traced every hole —
 * the model looked scribbled over with crayon.
 */
export function buildRegionRimLayer(
  mask: ImageBitmap,
  w: number,
  h: number,
  maskFrame: MaskFrame | undefined,
  hex: string,
  thickness = 5,
): HTMLCanvasElement | null {
  const dst = maskDestRect(maskFrame, w, h);

  // Smooth: mask → quarter-scale canvas (bilinear down) → stretched back up.
  const sw = Math.max(1, Math.round(w / 4));
  const sh = Math.max(1, Math.round(h / 4));
  const small = document.createElement('canvas');
  small.width = sw;
  small.height = sh;
  const sctx = small.getContext('2d');
  if (!sctx) return null;
  sctx.drawImage(mask, 0, 0, mask.width, mask.height, dst.x / 4, dst.y / 4, dst.w / 4, dst.h / 4);

  const layer = document.createElement('canvas');
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return null;

  // Dilate: stamp the smoothed silhouette around a ring of offsets.
  const t = thickness;
  const offsets: [number, number][] = [
    [-t, 0], [t, 0], [0, -t], [0, t],
    [-t, -t], [t, -t], [-t, t], [t, t],
  ];
  for (const [dx, dy] of offsets) {
    ctx.drawImage(small, 0, 0, sw, sh, dx, dy, w, h);
  }
  // Colourise the dilated silhouette, then punch the smoothed interior out.
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = hex;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.drawImage(small, 0, 0, sw, sh, 0, 0, w, h);
  return layer;
}

/** Neon corner brackets, scaled to the target size. Used by the exporter. */
export function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  colour = '#00ff41',
  inset = 24,
): void {
  const size = Math.max(28, Math.min(w, h) * 0.05);
  ctx.save();
  ctx.strokeStyle = colour;
  ctx.lineWidth = 3;
  ctx.shadowColor = colour;
  ctx.shadowBlur = 10;
  // TL
  ctx.beginPath();
  ctx.moveTo(inset, inset + size);
  ctx.lineTo(inset, inset);
  ctx.lineTo(inset + size, inset);
  ctx.stroke();
  // TR
  ctx.beginPath();
  ctx.moveTo(w - inset - size, inset);
  ctx.lineTo(w - inset, inset);
  ctx.lineTo(w - inset, inset + size);
  ctx.stroke();
  // BL
  ctx.beginPath();
  ctx.moveTo(inset, h - inset - size);
  ctx.lineTo(inset, h - inset);
  ctx.lineTo(inset + size, h - inset);
  ctx.stroke();
  // BR
  ctx.beginPath();
  ctx.moveTo(w - inset - size, h - inset);
  ctx.lineTo(w - inset, h - inset);
  ctx.lineTo(w - inset, h - inset - size);
  ctx.stroke();
  ctx.restore();
}

export type RevealSkin = 'imperial' | 'warp';

/**
 * Re-draw the `.auspex-backdrop` cogitator look directly in canvas — capture
 * only sees the canvas, so the CSS backdrop must be painted here. Mirrors the
 * gradient stops in app/globals.css `.auspex-backdrop`.
 */
export function paintBackdrop(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  skin: RevealSkin = 'imperial',
): void {
  const line = skin === 'warp' ? 'rgba(139, 92, 246, 0.05)' : 'rgba(0, 255, 65, 0.045)';
  const halo = skin === 'warp' ? 'rgba(139, 92, 246, 0.08)' : 'rgba(0, 255, 65, 0.07)';

  // base radial: dark-gothic → void-black
  const base = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
  base.addColorStop(0, '#0d0b14');
  base.addColorStop(0.88, '#05070a');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);

  // faint targeting grid (26px like the CSS)
  ctx.fillStyle = line;
  for (let x = 0; x < w; x += 26) ctx.fillRect(x, 0, 1, h);
  for (let y = 0; y < h; y += 26) ctx.fillRect(0, y, w, 1);

  // soft accent halo, upper-centre
  const glow = ctx.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, w * 0.7);
  glow.addColorStop(0, halo);
  glow.addColorStop(0.65, 'transparent');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // vignette
  const vig = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.7);
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
}
