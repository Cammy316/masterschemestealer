/**
 * Offline Color Detection System
 * Pure JavaScript implementation of color detection and paint matching
 * No backend required - runs entirely in the browser
 */

import type { ScanResult, Color, Paint, ScanMode } from './types';
import { extractDominantColors } from './colorClustering';
import { rgbToHex, rgbToHsv, rgbToLab, hexToRgb, type LAB } from './colorConversion';
import { findNClosestColors } from './deltaE';

/**
 * Canonical hue → family classifier — a faithful port of the backend
 * `core/color_engine.py::hue_family` (Prompt 1.3), so the offline fallback and
 * the backend can never disagree on a colour's family.
 *
 * Returns the SAME flat lowercase vocabulary the backend uses
 * (red, orange, yellow, green, cyan, blue, purple, pink, magenta, brown, bone,
 * white, grey, black). Metals are not produced here.
 *
 * @param hDeg  hue in degrees (0–360)
 * @param s     saturation 0–1   (note: rgbToHsv returns 0–100 — convert first)
 * @param v     value 0–1
 * @param chroma  sqrt(a*² + b*²) from LAB
 * @param lab   LAB (for the pale-pink rescue + desaturated exceptions)
 */
export function hueFamily(
  hDeg: number,
  s: number,
  v: number,
  chroma: number,
  lab?: LAB
): string {
  const h = ((hDeg % 360) + 360) % 360;
  const L = lab ? lab.l : v * 100;
  const a = lab ? lab.a : 0;

  // 1. ACHROMATIC / PALE-TINT GATE (value + chroma based)
  if (v < 0.1) return 'black';
  if (s < 0.1 || chroma < 12) {
    if ((h < 24 || h >= 300) && L > 60 && a > 6 && v > 0.7) return 'pink'; // pale pink, both hue ends
    if (h >= 195 && h < 256 && s > 0.05 && chroma > 3) return 'blue'; // desaturated blue
    if (h >= 74 && h < 158 && s > 0.06 && chroma > 4) return 'green'; // desaturated green
    if (h >= 158 && h < 195 && s > 0.06 && chroma > 3) return 'cyan'; // desaturated cyan
    if (h >= 256 && h < 300 && s > 0.05 && chroma > 3) return 'purple'; // desaturated purple
    if (v > 0.85) return 'white';
    if (v > 0.18) return 'grey';
    return 'black';
  }

  // 2. CHROMATIC — strictly hue-zoned; sub-splits live inside each zone only.
  if (h < 16 || h >= 336) {
    if (v > 0.72 && s < 0.55) return 'pink';
    if (chroma < 16 && v < 0.55) return 'brown';
    if (s < 0.45 && v < 0.4) return 'brown';
    return 'red';
  }
  if (h >= 16 && h < 40) {
    if (s < 0.45 || v < 0.45) return 'brown';
    return 'orange';
  }
  if (h >= 40 && h < 74) {
    if (s < 0.3 && v > 0.55) return 'bone';
    if (v < 0.3) return 'brown';
    return 'yellow';
  }
  if (h >= 74 && h < 158) return 'green';
  if (h >= 158 && h < 195) return 'cyan';
  if (h >= 195 && h < 256) return 'blue';
  if (h >= 256 && h < 292) return 'purple';
  if (h >= 292 && h < 336) {
    if (v > 0.72 && s < 0.55) return 'pink';
    return 'magenta';
  }
  return 'grey';
}

/**
 * Display colour family for a detected colour. Thin wrapper over hueFamily():
 * converts HSV scale, derives chroma from LAB, and Capitalises the canonical
 * family for display (matching the backend's Capitalised display families).
 */
function determineColorFamily(rgb: [number, number, number], lab?: [number, number, number]): string {
  const hsv = rgbToHsv({ r: rgb[0], g: rgb[1], b: rgb[2] });
  const labObj: LAB = lab
    ? { l: lab[0], a: lab[1], b: lab[2] }
    : rgbToLab({ r: rgb[0], g: rgb[1], b: rgb[2] });
  const chroma = Math.sqrt(labObj.a * labObj.a + labObj.b * labObj.b);
  const family = hueFamily(hsv.h, hsv.s / 100, hsv.v / 100, chroma, labObj);
  return family.charAt(0).toUpperCase() + family.slice(1);
}

/**
 * Dev-only parity check: the ported hueFamily MUST agree with the backend
 * hue_family on these fixtures (the baby-blue-shows-green class of mismatch).
 * Logs an error in development if any drift creeps in; no-op in production.
 */
const HUE_FAMILY_PARITY_FIXTURES: ReadonlyArray<readonly [string, string]> = [
  ['#b2dfd1', 'cyan'],
  ['#b6ce61', 'yellow'],
  ['#EF6E2E', 'orange'],
  ['#DECBDA', 'pink'],
  ['#9A1115', 'red'],
];

export function runHueFamilyParityCheck(): { hex: string; expected: string; got: string }[] {
  const failures: { hex: string; expected: string; got: string }[] = [];
  for (const [hex, expected] of HUE_FAMILY_PARITY_FIXTURES) {
    const rgb = hexToRgb(hex);
    const hsv = rgbToHsv(rgb);
    const lab = rgbToLab(rgb);
    const chroma = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
    const got = hueFamily(hsv.h, hsv.s / 100, hsv.v / 100, chroma, lab);
    if (got !== expected) failures.push({ hex, expected, got });
  }
  return failures;
}

if (process.env.NODE_ENV !== 'production') {
  const failures = runHueFamilyParityCheck();
  if (failures.length > 0) {
    console.error('[hueFamily] parity check FAILED — offline classifier diverged from backend:', failures);
  }
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
      const family = determineColorFamily(rgb, lab);

      return {
        rgb,
        lab,
        hex,
        percentage: cluster.percentage,
        family,
        reticle: null, // Reticle generation not supported in offline mode
      };
    });

    // Match each color to paints. The paint DB (~several hundred KB) is loaded
    // dynamically so it stays out of the main bundle — this fallback path is the
    // only consumer.
    const { getPaintDatabase } = await import('./paintDatabase');
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

    // Create result — tagged 'local' so the UI badges it and ML excludes it.
    const result: ScanResult = {
      id: `offline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      mode,
      imageUrl: typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource),
      detectedColors,
      recommendedPaints: limitedPaints,
      timestamp: new Date().toISOString(),
      analysisSource: 'local',
    };

    return result;
  } catch (error) {
    console.error('Offline color detection failed:', error);
    throw error;
  }
}
