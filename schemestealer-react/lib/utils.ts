/**
 * Utility functions for SchemeSteal app
 */

import type { Paint, Color } from './types';

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return [0, 0, 0];
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Format paint name for display (shorten long names)
 */
export function formatPaintName(name: string, maxLength: number = 30): string {
  if (name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + '...';
}

/**
 * Get paint ID (combination of brand and name)
 */
export function getPaintId(paint: Paint): string {
  return `${paint.brand}-${paint.name}`;
}

/**
 * Calculate total cart items
 */
export function getTotalCartItems(cart: { quantity: number }[]): number {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

/**
 * Format Delta-E value for display
 */
export function formatDeltaE(deltaE?: number): string {
  if (!deltaE) return 'N/A';
  if (deltaE < 2) return 'Excellent match';
  if (deltaE < 5) return 'Very close';
  if (deltaE < 10) return 'Close match';
  if (deltaE < 15) return 'Similar';
  return 'Approximate';
}

/**
 * Get color quality indicator based on Delta-E
 */
export function getMatchQuality(deltaE?: number): 'excellent' | 'good' | 'fair' | 'poor' {
  if (!deltaE) return 'poor';
  if (deltaE < 2) return 'excellent';
  if (deltaE < 5) return 'good';
  if (deltaE < 15) return 'fair';
  return 'poor';
}

/**
 * Compress image for mobile upload
 */
export async function compressImage(
  file: File,
  maxWidth: number = 1024,
  maxHeight: number = 1024,
  quality: number = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 10 * 1024 * 1024; // 10MB

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPG, PNG, or WebP)',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Image file is too large. Please use an image smaller than 10MB',
    };
  }

  return { valid: true };
}

/**
 * Generate unique ID for scans
 */
export function generateScanId(): string {
  return `scan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Format timestamp for display
 */
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return new Date(date).toLocaleDateString();
}

/**
 * Tailwind utility for conditional classes
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
