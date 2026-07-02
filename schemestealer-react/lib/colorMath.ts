import spectral from 'spectral.js';
import { differenceCiede2000, converter, formatHex } from 'culori';
import paintsData from './data/paints_groundtruth.json';

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Ingredient {
  hex: string;
  parts: number;
  /** Ground-truth paint_id — when present, the mix uses the paint's MEASURED
   *  colour and its opacity rating instead of the chart hex alone. */
  paintId?: string;
}

export interface PaintGroundTruth {
  paint_id: string;
  name: string;
  brand: string;
  hex: string;
  lab: [number, number, number];
  metallic?: boolean;
  opacity_rating?: number | null;
}

// DB labs are CIELAB **D65** (backend skimage). culori's 'lab' mode is D50
// per CSS Color 4 — tagging D65 values with it applies a spurious chromatic
// adaptation inside differenceCiede2000 (audit F9). Everything here speaks
// 'lab65'.
const toLab = converter('lab65');
const toRgb = converter('rgb');

const PAINTS = paintsData as unknown as PaintGroundTruth[];
const PAINTS_BY_ID = new Map(PAINTS.map(p => [p.paint_id, p]));

/** The paint's measured applied colour as a hex (falls back to chart hex). */
function measuredHex(p: PaintGroundTruth): string {
  if (!p.lab) return p.hex;
  const rgb = toRgb({ mode: 'lab65', l: p.lab[0], a: p.lab[1], b: p.lab[2] } as any);
  return rgb ? formatHex(rgb).toUpperCase() : p.hex;
}

/** Relative pigment load from the DB opacity rating (0 translucent .. 3
 *  opaque): a wash contributes far less colourant per part than a heavy
 *  base. Unknown rating → neutral load 1. */
function pigmentLoad(rating: number | null | undefined): number {
  if (rating == null) return 1.0;
  return 0.4 + 0.2 * Math.max(0, Math.min(3, rating));
}

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
 * Mixes an array of ingredients using spectral.js (Kubelka-Munk theory).
 *
 * When an ingredient carries a paintId, two physical corrections apply:
 *  - its MEASURED applied colour (DB lab) feeds the reflectance
 *    reconstruction instead of the marketing chart hex, and
 *  - its parts are scaled by pigment load (opacity rating), so one part of
 *    wash no longer contributes as much colourant as one part of heavy base.
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

  const resolved = activeIngredients.map(item => {
    const paint = item.paintId ? PAINTS_BY_ID.get(item.paintId) : undefined;
    return {
      hex: paint ? measuredHex(paint) : item.hex,
      weight: item.parts * pigmentLoad(paint?.opacity_rating),
    };
  });

  const totalWeight = resolved.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    return null;
  }

  // Map to spectral arguments: [Color, weight]
  const spectralArgs = resolved.map(item => {
    return [new spectral.Color(item.hex), item.weight / totalWeight];
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
 * Coverage weight of a mix over a primer, from the parts-weighted mean of the
 * ingredients' opacity ratings: an opaque mix (rating 3) covers ~95%, a
 * translucent glaze (rating 0) lets ~55% of the primer through. Ingredients
 * without a known rating count as the historical default coverage (0.85).
 */
export function effectiveCoverage(ingredients: Ingredient[]): number {
  const active = ingredients.filter(i => i.parts > 0);
  if (active.length === 0) return 0.85;

  let weighted = 0;
  let totalParts = 0;
  for (const item of active) {
    const paint = item.paintId ? PAINTS_BY_ID.get(item.paintId) : undefined;
    const rating = paint?.opacity_rating;
    const coverage = rating == null ? 0.85 : 0.45 + (0.5 / 3) * Math.max(0, Math.min(3, rating));
    weighted += coverage * item.parts;
    totalParts += item.parts;
  }
  return weighted / totalParts;
}

/**
 * Finds the closest single-pot paint match from the ground truth database
 * using CIEDE2000 color difference.
 *
 * Metallic paints are excluded: the Forge simulates matte pigment mixing, so
 * a mix can never legitimately resolve to a metallic (same gate the backend
 * matcher enforces).
 */
export function findClosestPaint(targetHex: string) {
  const targetLab = toLab(targetHex);
  if (!targetLab) return null;

  let bestMatch = null;
  let minDeltaE = Infinity;

  for (const paint of PAINTS) {
    if (!paint.lab || paint.metallic) continue;

    const paintLab = { mode: 'lab65', l: paint.lab[0], a: paint.lab[1], b: paint.lab[2] };
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
    type: (bestMatch as any).category || 'Base',
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
export function findTopAlternativeMatches(
  targetHex: string,
  opts: { includeMetallics?: boolean } = {},
) {
  const targetLab = toLab(targetHex);
  if (!targetLab) return [];

  const allowedBrands = ['Citadel', 'Vallejo', 'Army Painter'];

  // Metallics are excluded by default: the primary caller matches a MATTE
  // pigment mix, which can never legitimately resolve to a metallic. Callers
  // matching a physical pot (inventory scanning) opt back in.
  const scored = PAINTS
    .filter(p => allowedBrands.includes(p.brand) && p.lab
      && (opts.includeMetallics || !p.metallic))
    .map(p => {
      const pLab = { mode: 'lab65', l: p.lab[0], a: p.lab[1], b: p.lab[2] };
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
    type: (match as any).category || 'Base',
    delta_e: match.deltaE.toFixed(1),
    band: getDeltaEBand(match.deltaE)
  }));
}

/**
 * Simulates painting a custom mix over a primer basecoat.
 *
 * `coverage` is the paint's share of the result — derive it from the mix's
 * opacity ratings via effectiveCoverage() (an opaque mix hides the primer,
 * a glaze lets it through). Defaults to the historical 0.85.
 */
export function simulateBasecoat(
  paintHex: string,
  primerHex: string,
  coverage: number = 0.85,
): string {
  const c = Math.max(0.05, Math.min(0.98, coverage));
  // @ts-ignore - spectral.js API
  const simulated = spectral.mix(
    [new spectral.Color(paintHex), c],
    [new spectral.Color(primerHex), 1 - c]
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
