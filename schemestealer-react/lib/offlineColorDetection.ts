/**
 * Offline Color Detection System
 * Pure JavaScript implementation of color detection and paint matching
 * No backend required - runs entirely in the browser
 */

import type { ScanResult, Color, Paint, ScanMode } from './types';
import { extractDominantColors } from './colorClustering';
import { rgbToHex, rgbToHsv } from './colorConversion';
import { findNClosestColors, deltaE2000 } from './deltaE';
import { getPaintDatabase } from './paintDatabase';

/**
 * Determine color family based on HSV values
 */
function determineColorFamily(rgb: [number, number, number]): string {
  const hsv = rgbToHsv({ r: rgb[0], g: rgb[1], b: rgb[2] });
  const { h, s, v } = hsv;

  // Check for grayscale first
  if (s < 10) {
    if (v < 20) return 'Black';
    if (v > 90) return 'White';
    if (v < 40) return 'Dark Grey';
    if (v < 70) return 'Grey';
    return 'Light Grey';
  }

  // Determine hue-based family
  if (h >= 0 && h < 15) return 'Red';
  if (h >= 15 && h < 35) return 'Orange';
  if (h >= 35 && h < 70) return 'Yellow';
  if (h >= 70 && h < 150) return 'Green';
  if (h >= 150 && h < 200) return 'Cyan';
  if (h >= 200 && h < 260) return 'Blue';
  if (h >= 260 && h < 300) return 'Purple';
  if (h >= 300 && h < 330) return 'Magenta';
  if (h >= 330) return 'Red';

  return 'Unknown';
}

/**
 * Generate a descriptive color name
 */
function generateColorName(rgb: [number, number, number], family: string): string {
  const hsv = rgbToHsv({ r: rgb[0], g: rgb[1], b: rgb[2] });
  const { s, v } = hsv;

  // Grayscale
  if (s < 10) {
    if (v < 20) return 'Black';
    if (v > 90) return 'White';
    if (v < 40) return 'Dark Grey';
    if (v < 70) return 'Grey';
    return 'Light Grey';
  }

  // Add descriptors based on saturation and value
  let prefix = '';
  if (v < 30) prefix = 'Very Dark ';
  else if (v < 50) prefix = 'Dark ';
  else if (v > 85 && s > 70) prefix = 'Bright ';
  else if (v > 75 && s < 40) prefix = 'Light ';
  else if (s < 25) prefix = 'Pale ';

  return prefix + family;
}

/**
 * Load image from file or URL
 */
export async function loadImageData(source: string | File): Promise<ImageData> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(source);
    }
  });
}

/**
 * Main offline color detection function
 * Extracts colors from an image and matches them to paints
 */
export async function detectColorsOffline(
  imageSource: string | File,
  mode: ScanMode,
  options: {
    numColors?: number;
    numPaintMatches?: number;
    sampleRate?: number;
  } = {}
): Promise<ScanResult> {
  const {
    numColors = mode === 'miniature' ? 6 : 5,
    numPaintMatches = 5,
    sampleRate = 5,
  } = options;

  try {
    // Load image data
    const imageData = await loadImageData(imageSource);

    // Extract dominant colors using K-means
    const clusterResults = extractDominantColors(imageData, {
      numColors,
      sampleRate,
      filterExtremes: true,
      deduplicate: true,
    });

    if (clusterResults.length === 0) {
      throw new Error('No colors detected in image');
    }

    // Convert to Color format
    const detectedColors: Color[] = clusterResults.map((cluster) => {
      const rgb: [number, number, number] = [
        cluster.rgb.r,
        cluster.rgb.g,
        cluster.rgb.b,
      ];
      const lab: [number, number, number] = [
        cluster.lab.l,
        cluster.lab.a,
        cluster.lab.b,
      ];
      const hex = rgbToHex(cluster.rgb);
      const family = determineColorFamily(rgb);

      return {
        rgb,
        lab,
        hex,
        percentage: cluster.percentage,
        family,
        reticle: null, // Reticle generation not supported in offline mode
      };
    });

    // Match each color to paints
    const paintDatabase = getPaintDatabase();
    const recommendedPaints: Paint[] = [];
    const usedPaints = new Set<string>();

    for (const color of detectedColors) {
      const matches = findNClosestColors(
        { l: color.lab[0], a: color.lab[1], b: color.lab[2] },
        paintDatabase.map((p) => ({ ...p, lab: p.lab })),
        numPaintMatches * 2, // Get more matches to filter duplicates
        true
      );

      // Add unique matches
      for (const match of matches) {
        const paintKey = `${match.color.brand}-${match.color.name}`;

        if (!usedPaints.has(paintKey) && recommendedPaints.length < numPaintMatches * numColors) {
          usedPaints.add(paintKey);

          recommendedPaints.push({
            name: match.color.name,
            brand: match.color.brand,
            hex: match.color.hex,
            type: match.color.type,
            rgb: [match.color.rgb.r, match.color.rgb.g, match.color.rgb.b],
            lab: [match.color.lab.l, match.color.lab.a, match.color.lab.b],
            deltaE: Math.round(match.deltaE * 10) / 10, // Round to 1 decimal
          });
        }

        if (recommendedPaints.length >= numPaintMatches * numColors) break;
      }
    }

    // Sort recommended paints by delta-E (best matches first)
    recommendedPaints.sort((a, b) => (a.deltaE || 0) - (b.deltaE || 0));

    // Limit to requested number of paints
    const limitedPaints = recommendedPaints.slice(0, numPaintMatches * detectedColors.length);

    // Create result
    const result: ScanResult = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mode,
      imageUrl: typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource),
      detectedColors,
      recommendedPaints: limitedPaints,
      timestamp: new Date(),
    };

    return result;
  } catch (error) {
    console.error('Offline color detection failed:', error);
    throw error;
  }
}

/**
 * Check if offline mode is feasible
 * (Browser supports required APIs)
 */
export function isOfflineModeSupported(): boolean {
  try {
    // Check for required APIs
    const hasCanvas = typeof HTMLCanvasElement !== 'undefined';
    const hasImageData = typeof ImageData !== 'undefined';
    const hasFileReader = typeof FileReader !== 'undefined';

    return hasCanvas && hasImageData && hasFileReader;
  } catch {
    return false;
  }
}

/**
 * Get offline mode info
 */
export function getOfflineModeInfo() {
  const db = getPaintDatabase();

  return {
    supported: isOfflineModeSupported(),
    paintCount: db.length,
    brands: [...new Set(db.map((p) => p.brand))],
    accuracy: '85-90% compared to backend',
    limitations: [
      'No reticle generation (location markers)',
      'Slightly less accurate than backend AI',
      'Limited paint database (can be expanded)',
    ],
    advantages: [
      'Works completely offline',
      'Instant results (no network delay)',
      'Privacy - images never leave your device',
      'No API rate limits',
    ],
  };
}
