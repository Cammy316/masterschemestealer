/**
 * In-browser background removal for miniature scans.
 *
 * IMPORTANT: the backend miniature endpoint REQUIRES the background to be removed
 * client-side — it expects an RGBA PNG (precomputed_rgba) and does NOT run
 * server-side removal. So we must never upload a plain RGB image for a miniature
 * scan; if removal can't produce an alpha PNG we throw, and the caller surfaces
 * the error (with the local-auspex fallback) instead of a 500.
 *
 * @imgly/background-removal is imported statically (it spawns a Web Worker, which
 * does not load reliably when the library is code-split in the production build).
 */

import { removeBackground } from '@imgly/background-removal';
import { resizeImage } from './imageUtils';

const MAX_DIMENSION = 1024;
const FALLBACK_DIMENSION = 768;
const UPLOAD_LIMIT_BYTES = 8 * 1024 * 1024; // safety margin under the backend's 10MB

/** Progressively scale a PNG down (preserving alpha) until it's under the limit. */
async function shrinkPngUnderLimit(png: File): Promise<File> {
  if (png.size <= UPLOAD_LIMIT_BYTES) return png;
  let dim = FALLBACK_DIMENSION;
  let out = await resizeImage(png, dim, 'image/png', 1);
  while (out.size > UPLOAD_LIMIT_BYTES && dim > 256) {
    dim = Math.round(dim * 0.8);
    out = await resizeImage(png, dim, 'image/png', 1);
  }
  return out;
}

export interface PrepareMiniatureOptions {
  /** Called with 0–100 during model download, then null when done. */
  onProgress?: (percent: number | null) => void;
}

/**
 * Returns the bg-removed RGBA PNG to upload for a miniature scan. Resizes the
 * original to ≤1024px first (faster model + bounded upload), runs in-browser
 * removal (with progress), and guarantees the PNG is under the 8MB margin.
 * Throws if removal fails — the caller must not upload a plain RGB image.
 */
export async function prepareMiniatureImage(
  file: File,
  options: PrepareMiniatureOptions = {}
): Promise<File> {
  const { onProgress } = options;

  // Resize first: faster model, smaller upload either way.
  const resized = await resizeImage(file, MAX_DIMENSION, 'image/jpeg', 0.85);

  try {
    const blob = await removeBackground(resized, {
      progress: (_key: string, current: number, total: number) => {
        if (onProgress && total > 0) onProgress(Math.round((current / total) * 100));
      },
    });
    onProgress?.(null);
    const pngName = file.name.replace(/\.[^.]+$/, '') + '.png';
    const png = new File([blob], pngName, { type: 'image/png' });
    return await shrinkPngUnderLimit(png);
  } catch (err) {
    onProgress?.(null);
    // Re-throw: the backend can't process a plain RGB miniature, so the scan must
    // surface an error (offering the local fallback) rather than upload RGB.
    throw err instanceof Error ? err : new Error('Background removal failed');
  }
}
