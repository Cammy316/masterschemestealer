/**
 * Smart in-browser background removal for miniature scans.
 *
 * Flow: resize the original to ≤1024px JPEG FIRST (fast model + bounded upload),
 * then — unless the connection is slow / data-saver is on / the user prefers the
 * server — lazy-load @imgly/background-removal, run it with progress reporting,
 * and guarantee the resulting PNG stays under the 8MB upload margin. Any failure
 * falls back to the resized JPEG, which the backend's rembg removes server-side.
 */

import { resizeImage } from './imageUtils';

const SERVER_BG_PREF_KEY = 'ss_use_server_bg';
const BG_MODEL_DOWNLOADED_KEY = 'ss_bg_model_downloaded';

const MAX_DIMENSION = 1024;
const FALLBACK_DIMENSION = 768;
const UPLOAD_LIMIT_BYTES = 8 * 1024 * 1024; // safety margin under the backend's 10MB

interface NetworkInformation {
  saveData?: boolean;
  effectiveType?: string;
}

/** User asked to always use the server for background removal (persisted). */
export function prefersServerBackgroundRemoval(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(SERVER_BG_PREF_KEY) === '1';
}

export function setPreferServerBackgroundRemoval(value: boolean): void {
  if (typeof window === 'undefined') return;
  if (value) window.localStorage.setItem(SERVER_BG_PREF_KEY, '1');
  else window.localStorage.removeItem(SERVER_BG_PREF_KEY);
}

/** Whether the one-time model has been downloaded before (cached). */
export function backgroundModelDownloaded(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(BG_MODEL_DOWNLOADED_KEY) === '1';
}

/** True on 2g/slow-2g or when data-saver is enabled (where supported). */
function isSlowConnection(): boolean {
  if (typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformation }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g';
}

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
  /** Called with 0–100 during model download, then null when done/aborted. */
  onProgress?: (percent: number | null) => void;
}

/**
 * Returns the file to upload for a miniature scan — a bg-removed PNG when
 * in-browser removal runs, otherwise a resized JPEG for the server to handle.
 */
export async function prepareMiniatureImage(
  file: File,
  options: PrepareMiniatureOptions = {}
): Promise<File> {
  const { onProgress } = options;

  // Always resize first: faster model, and the upload is bounded either way.
  const resized = await resizeImage(file, MAX_DIMENSION, 'image/jpeg', 0.85);

  // Slow connection / data-saver / explicit preference → let the server do it.
  if (prefersServerBackgroundRemoval() || isSlowConnection()) {
    return resized;
  }

  try {
    const { removeBackground } = await import('@imgly/background-removal');
    const blob = await removeBackground(resized, {
      progress: (_key: string, current: number, total: number) => {
        if (onProgress && total > 0) onProgress(Math.round((current / total) * 100));
      },
    });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BG_MODEL_DOWNLOADED_KEY, '1');
    }
    onProgress?.(null);

    const pngName = file.name.replace(/\.[^.]+$/, '') + '.png';
    const png = new File([blob], pngName, { type: 'image/png' });
    return await shrinkPngUnderLimit(png);
  } catch {
    // Model load / removal failed — server-side rembg handles the resized JPEG.
    onProgress?.(null);
    return resized;
  }
}
