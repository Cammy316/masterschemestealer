/**
 * Offline Color Detection System
 * Pure JavaScript implementation of color detection and paint matching
 * No backend required - runs entirely in the browser
 */

import type { ScanResult, Color, Paint, ScanMode } from './types';
import { extractDominantColors } from './colorClustering';
import { rgbToHex, rgbToLab, type LAB } from './colorConversion';
import { findNClosestColors } from './deltaE';
import { COLOR_ANCHORS } from './colorAnchors';

/**
 * Nearest-exemplar colour-family classifier (Stage B) — the port of the backend
 * `color_engine.classify_family`, reading the SAME exemplar set
 * (`color_anchors.json`, compiled into ./colorAnchors). There are NO hue-band
 * thresholds: a colour's family is the family of its nearest LAB exemplar by
 * ΔE76. Backend and frontend cannot diverge because they share the anchors and
 * run the same tiny algorithm — change anchors in python-api and re-run
 * scripts/build_color_anchors.py to regenerate ./colorAnchors.
 */
type AnchorSet = { pts: number[][]; fams: string[] };

function _stack(entries: [string, number[][]][]): AnchorSet {
  const pts: number[][] = [];
  const fams: string[] = [];
  for (const [fam, labs] of entries) {
    for (const lab of labs) { pts.push(lab); fams.push(fam); }
  }
  return { pts, fams };
}

const _FAM_ENTRIES = Object.entries(COLOR_ANCHORS.families);
const _FALLBACK = new Set(COLOR_ANCHORS.metallic_fallback);
// Non-metallic path: every family (chromatic + neutral).
const _NON_METAL = _stack(_FAM_ENTRIES);
// Metallic path: the three metals + only the vivid fallback families.
const _METAL = _stack([
  ...Object.entries(COLOR_ANCHORS.metallic),
  ..._FAM_ENTRIES.filter(([f]) => _FALLBACK.has(f)),
]);

function nearestFamily(set: AnchorSet, L: number, a: number, b: number): string {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < set.pts.length; i++) {
    const p = set.pts[i];
    const dL = p[0] - L, da = p[1] - a, db = p[2] - b;
    const d = dL * dL + da * da + db * db;
    if (d < bestD) { bestD = d; best = i; }
  }
  return set.fams[best];
}

/**
 * THE single colour-family classifier. Input is CIELAB (D65); `chroma` is unused
 * (kept for signature parity with the backend); `isMetallic` selects the metallic
 * exemplar set. Mirrors `color_engine.classify_family` exactly.
 */
export function classifyFamily(lab: LAB, _chroma?: number, isMetallic = false): string {
  const { l: L, a, b } = lab;
  if (isMetallic) return nearestFamily(_METAL, L, a, b);
  if (L < COLOR_ANCHORS.thresholds.black_l) return 'black';
  return nearestFamily(_NON_METAL, L, a, b);
}

/**
 * Display colour family for a detected colour. Thin wrapper over classifyFamily;
 * the offline detector has no metallic cue, so isMetallic is false. Capitalised
 * for display, matching the backend's Capitalised display families.
 */
function determineColorFamily(rgb: [number, number, number], lab?: [number, number, number]): string {
  const labObj: LAB = lab
    ? { l: lab[0], a: lab[1], b: lab[2] }
    : rgbToLab({ r: rgb[0], g: rgb[1], b: rgb[2] });
  const family = classifyFamily(labObj);
  return family.charAt(0).toUpperCase() + family.slice(1);
}

// Backend/frontend parity is enforced comprehensively in CI by the shared golden
// fixtures (lib/__tests__/colorFamily.test.ts vs the Python test) — no inline
// dev check needed.

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
