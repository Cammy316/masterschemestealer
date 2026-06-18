/**
 * API surface for the SchemeStealer backend.
 *
 * Thin wrappers over the single shared `apiClient` (which owns timeouts,
 * AbortController, and the one ApiError class). ApiError and API_BASE_URL are
 * defined once in apiClient and re-exported here so existing imports keep working
 * and `instanceof ApiError` holds across module boundaries.
 */

import type { ScanResult, Color, Paint } from './types';
import { generateScanId } from './utils';
import { apiClient } from './apiClient';

export { ApiError, API_BASE_URL } from './apiClient';

// Scan requests must cover a Render cold start (30–60s) plus rembg processing.
const SCAN_TIMEOUT_MS = 120_000;
const PAINTS_TIMEOUT_MS = 30_000;

interface ScanResponse {
  colors?: Color[];
  paints?: Paint[];
}

/**
 * Compress an image to JPEG, capped at maxDimension px on the longest side.
 * Keeps original if it's already small enough to avoid unnecessary re-encoding.
 */
async function compressImage(file: File, maxDimension = 1024, quality = 0.85): Promise<File> {
  return new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      if (w <= maxDimension && h <= maxDimension) {
        resolve(file);
        return;
      }
      const scale = maxDimension / Math.max(w, h);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(w * scale);
      canvas.height = Math.round(h * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => resolve(new File([blob!], file.name, { type: 'image/jpeg' })),
        'image/jpeg',
        quality
      );
    };
    img.src = url;
  });
}

/**
 * Scan a miniature image (with background removal).
 */
export async function scanMiniature(imageFile: File): Promise<ScanResult> {
  // Skip JPEG compression for PNG files — bg-removed images are PNG with an
  // alpha channel that must not be re-encoded to JPEG (which strips alpha).
  const compressed = imageFile.type === 'image/png' ? imageFile : await compressImage(imageFile);
  const formData = new FormData();
  formData.append('file', compressed);

  const data = await apiClient.postForm<ScanResponse>('/api/scan/miniature', formData, {
    timeout: SCAN_TIMEOUT_MS,
  });

  return {
    id: generateScanId(),
    mode: 'miniature',
    // Object URL for in-session display; its lifecycle is owned by the store
    // (revoked when replaced or cleared) and the useScan hook (on failure).
    imageUrl: URL.createObjectURL(imageFile),
    detectedColors: data.colors || [],
    recommendedPaints: data.paints || [],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Scan an inspiration image (without background removal).
 */
export async function scanInspiration(imageFile: File): Promise<ScanResult> {
  const compressed = await compressImage(imageFile);
  const formData = new FormData();
  formData.append('file', compressed);

  const data = await apiClient.postForm<ScanResponse>('/api/scan/inspiration', formData, {
    timeout: SCAN_TIMEOUT_MS,
  });

  return {
    id: generateScanId(),
    mode: 'inspiration',
    imageUrl: URL.createObjectURL(imageFile),
    detectedColors: data.colors || [],
    recommendedPaints: data.paints || [],
    timestamp: new Date().toISOString(),
  };
}

/**
 * Get all paints from the database.
 */
export async function getPaints(): Promise<Paint[]> {
  const data = await apiClient.get<{ paints?: Paint[] }>('/api/paints', {
    timeout: PAINTS_TIMEOUT_MS,
  });
  return data?.paints || [];
}

/**
 * Submit user feedback.
 */
export async function submitFeedback(feedback: {
  scanId: string;
  rating?: number;
  comment?: string;
}): Promise<void> {
  await apiClient.post<void>('/api/feedback', feedback);
}

/**
 * Check if the backend is available.
 */
export async function healthCheck(): Promise<boolean> {
  return apiClient.healthCheck();
}
