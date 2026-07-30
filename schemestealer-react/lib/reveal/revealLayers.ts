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

/**
 * The model dimmed IN PLACE. `source-atop` keeps the RGBA background
 * transparent so the backdrop shows through; adds CRT scanlines.
 */
export function buildBaseLayer(
  img: CanvasImageSource,
  w: number,
  h: number,
  greyscale: boolean,
): HTMLCanvasElement | null {
  const layer = document.createElement('canvas');
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return null;
  if (greyscale) {
    ctx.filter = 'grayscale(1) brightness(0.5)';
    ctx.drawImage(img, 0, 0);
    ctx.filter = 'none';
  } else {
    ctx.drawImage(img, 0, 0);
  }
  ctx.globalCompositeOperation = 'source-atop'; // model pixels only
  ctx.fillStyle = greyscale ? 'rgba(4, 8, 6, 0.45)' : 'rgba(5, 12, 10, 0.72)';
  ctx.fillRect(0, 0, w, h);
  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
    ctx.fillRect(0, y, w, 1);
  }
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
