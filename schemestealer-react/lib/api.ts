/**
 * API client for SchemeStealer backend
 */

import type { ScanResult, Color, Paint } from './types';
import { generateScanId } from './utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Scan a miniature image (with background removal)
 */
export async function scanMiniature(imageFile: File): Promise<ScanResult> {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}/api/scan/miniature`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.detail || 'Failed to scan miniature',
        response.status,
        error
      );
    }

    const data = await response.json();

    // Convert API response to ScanResult format
    const scanResult: ScanResult = {
      id: generateScanId(),
      mode: 'miniature',
      imageUrl: URL.createObjectURL(imageFile),
      imageData: await fileToBase64(imageFile),
      detectedColors: data.colors || [],
      recommendedPaints: data.paints || [],
      timestamp: new Date(),
    };

    return scanResult;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error: Failed to connect to backend');
  }
}

/**
 * Scan an inspiration image (without background removal)
 */
export async function scanInspiration(imageFile: File): Promise<ScanResult> {
  try {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${API_BASE_URL}/api/scan/inspiration`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        error.detail || 'Failed to scan inspiration image',
        response.status,
        error
      );
    }

    const data = await response.json();

    // Convert API response to ScanResult format
    const scanResult: ScanResult = {
      id: generateScanId(),
      mode: 'inspiration',
      imageUrl: URL.createObjectURL(imageFile),
      imageData: await fileToBase64(imageFile),
      detectedColors: data.colors || [],
      recommendedPaints: data.paints || [],
      timestamp: new Date(),
    };

    return scanResult;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error: Failed to connect to backend');
  }
}

/**
 * Get all paints from the database
 */
export async function getPaints(): Promise<Paint[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/paints`);

    if (!response.ok) {
      throw new ApiError('Failed to fetch paints', response.status);
    }

    const data = await response.json();
    return data.paints || [];
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error: Failed to connect to backend');
  }
}

/**
 * Submit user feedback
 */
export async function submitFeedback(feedback: {
  scanId: string;
  rating?: number;
  comment?: string;
}): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedback),
    });

    if (!response.ok) {
      throw new ApiError('Failed to submit feedback', response.status);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error: Failed to connect to backend');
  }
}

/**
 * Check if backend is available
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Helper: Convert File to base64 string
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}
