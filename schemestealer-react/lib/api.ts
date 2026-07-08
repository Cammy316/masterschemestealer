/**
 * API surface for the SchemeStealer backend.
 *
 * Thin wrappers over the single shared `apiClient` (which owns timeouts,
 * AbortController, and the one ApiError class). ApiError and API_BASE_URL are
 * defined once in apiClient and re-exported here so existing imports keep working
 * and `instanceof ApiError` holds across module boundaries.
 */

import type { ScanResult, Color, Paint, MaskFrame } from './types';
import { generateScanId } from './utils';
import { apiClient } from './apiClient';
import { compressImage } from './imageUtils';

export { ApiError, API_BASE_URL } from './apiClient';

// Scan requests must cover a Render cold start (30–60s) plus rembg processing.
const SCAN_TIMEOUT_MS = 120_000;
const PAINTS_TIMEOUT_MS = 30_000;

interface ScanResponse {
  colors?: Color[];
  paints?: Paint[];
  mask_frame?: MaskFrame;
}

/**
 * Scan a miniature image (with background removal).
 */
export async function scanMiniature(imageFile: File, signal?: AbortSignal, inventoryIds?: string[]): Promise<ScanResult> {
  // Skip JPEG compression for PNG files — bg-removed images are PNG with an
  // alpha channel that must not be re-encoded to JPEG (which strips alpha).
  const compressed = imageFile.type === 'image/png' ? imageFile : await compressImage(imageFile);
  const formData = new FormData();
  formData.append('file', compressed);
  if (inventoryIds && inventoryIds.length > 0) {
    formData.append('inventory', JSON.stringify(inventoryIds));
  }

  const data = await apiClient.postForm<ScanResponse>('/api/scan/miniature', formData, {
    timeout: SCAN_TIMEOUT_MS,
    signal,
  });

  return {
    id: generateScanId(),
    mode: 'miniature',
    // Object URL for in-session display; its lifecycle is owned by the store
    // (revoked when replaced or cleared) and the useScan hook (on failure).
    imageUrl: URL.createObjectURL(imageFile),
    detectedColors: data.colors || [],
    recommendedPaints: data.paints || [],
    maskFrame: data.mask_frame,
    timestamp: new Date().toISOString(),
    analysisSource: 'backend',
  };
}

/**
 * Scan an inspiration image (without background removal).
 */
export async function scanInspiration(imageFile: File, signal?: AbortSignal, inventoryIds?: string[]): Promise<ScanResult> {
  const compressed = await compressImage(imageFile);
  const formData = new FormData();
  formData.append('file', compressed);
  if (inventoryIds && inventoryIds.length > 0) {
    formData.append('inventory', JSON.stringify(inventoryIds));
  }

  const data = await apiClient.postForm<ScanResponse>('/api/scan/inspiration', formData, {
    timeout: SCAN_TIMEOUT_MS,
    signal,
  });

  return {
    id: generateScanId(),
    mode: 'inspiration',
    imageUrl: URL.createObjectURL(imageFile),
    detectedColors: data.colors || [],
    recommendedPaints: data.paints || [],
    timestamp: new Date().toISOString(),
    analysisSource: 'backend',
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
