import spectral from 'spectral.js';
import { differenceCiede2000, parseHex, converter } from 'culori';
import paintsData from './data/paints_groundtruth.json';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Ingredient {
  hex: string;
  parts: number;
}

export interface PaintGroundTruth {
  paint_id: string;
  name: string;
  brand: string;
  hex: string;
  lab: [number, number, number];
}

const toLab = converter('lab');

/**
 * Converts an RGB object to a hex color string.
 */
export function rgbToHex({ r, g, b }: RGB): string {
  // Clamp values between 0 and 255 and round
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  
  const toHex = (c: number) => {
    const hexStr = clamp(c).toString(16);
    return hexStr.length === 1 ? '0' + hexStr : hexStr;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Mixes an array of ingredients (hex color + parts ratio) using spectral.js (Kubelka-Munk theory).
 * Iteratively mixes ingredients according to their parts ratio.
 */
export function mixColorsWeighted(ingredients: Ingredient[]): string | null {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  // Filter out ingredients with 0 parts
  const activeIngredients = ingredients.filter(i => i.parts > 0);
  
  if (activeIngredients.length === 0) {
    return null;
  }

  // Calculate total parts to get the relative weight of each ingredient
  const totalParts = activeIngredients.reduce((sum, item) => sum + item.parts, 0);

  // Map to spectral arguments: [Color, weight]
  const spectralArgs = activeIngredients.map(item => {
    return [new spectral.Color(item.hex), item.parts / totalParts];
  });

  // Call spectral.mix with the spread arguments
  // @ts-ignore - spectral.js types are not well defined
  const mixedColor = spectral.mix(...spectralArgs);

  // The result is a Color object with sRGB array [r, g, b]
  if (mixedColor && mixedColor.sRGB) {
    return rgbToHex({
      r: mixedColor.sRGB[0],
      g: mixedColor.sRGB[1],
      b: mixedColor.sRGB[2]
    });
  }

  return '#000000';
}

/**
 * Finds the closest single-pot paint match from the ground truth database
 * using CIEDE2000 color difference.
 */
export function findClosestPaint(targetHex: string) {
  const targetLab = toLab(targetHex);
  if (!targetLab) return null;

  let bestMatch = null;
  let minDeltaE = Infinity;

  const paints = paintsData as PaintGroundTruth[];

  for (const paint of paints) {
    if (!paint.lab) continue;
    
    const paintLab = { mode: 'lab', l: paint.lab[0], a: paint.lab[1], b: paint.lab[2] };
    const deltaE = differenceCiede2000()(targetLab, paintLab as any);

    if (deltaE < minDeltaE) {
      minDeltaE = deltaE;
      bestMatch = paint;
    }
  }

  if (!bestMatch) return null;

  // Map to the format expected by the frontend (with band)
  return {
    ...bestMatch,
    delta_e: minDeltaE.toFixed(1),
    band: getDeltaEBand(minDeltaE)
  };
}

function getDeltaEBand(deltaE: number): string {
  if (deltaE < 1.0) return 'Identical';
  if (deltaE <= 2.0) return 'Excellent';
  if (deltaE <= 3.0) return 'Good';
  if (deltaE <= 5.0) return 'Acceptable';
  return 'Poor';
}

/**
 * Finds the top alternative matches, limited to Citadel, Vallejo, and Army Painter.
 * Returns the best match overall, and the best match from the remaining two brands.
 */
export function findTopAlternativeMatches(targetHex: string) {
  const targetLab = toLab(targetHex);
  if (!targetLab) return [];

  const paints = paintsData as PaintGroundTruth[];
  const allowedBrands = ['Citadel', 'Vallejo', 'Army Painter'];

  // Score all allowed paints
  const scored = paints
    .filter(p => allowedBrands.includes(p.brand) && p.lab)
    .map(p => {
      const pLab = { mode: 'lab', l: p.lab[0], a: p.lab[1], b: p.lab[2] };
      const deltaE = differenceCiede2000()(targetLab, pLab as any);
      return { ...p, deltaE };
    })
    .sort((a, b) => a.deltaE - b.deltaE);

  if (scored.length === 0) return [];

  const topMatch = scored[0];
  const results = [topMatch];

  // Find best match from remaining brands
  const remainingBrands = allowedBrands.filter(b => b !== topMatch.brand);
  for (const brand of remainingBrands) {
    const bestBrandMatch = scored.find(p => p.brand === brand);
    if (bestBrandMatch) {
      results.push(bestBrandMatch);
    }
  }

  // Sort results by Delta E again so they are in accuracy order
  results.sort((a, b) => a.deltaE - b.deltaE);

  return results.map(match => ({
    ...match,
    delta_e: match.deltaE.toFixed(1),
    band: getDeltaEBand(match.deltaE)
  }));
}

/**
 * Simulates painting a custom mix over a primer basecoat.
 * Opacity is 0.85 (85% paint, 15% primer).
 */
export function simulateBasecoat(paintHex: string, primerHex: string): string {
  // @ts-ignore - spectral.js API
  const simulated = spectral.mix(
    [new spectral.Color(paintHex), 0.85],
    [new spectral.Color(primerHex), 0.15]
  );
  if (simulated && simulated.sRGB) {
    return rgbToHex({
      r: simulated.sRGB[0],
      g: simulated.sRGB[1],
      b: simulated.sRGB[2]
    });
  }
  return paintHex;
}
