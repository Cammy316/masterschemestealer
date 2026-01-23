/**
 * Paint Matcher - Matches colors to paints from multiple brands
 * Uses offline paint database to supplement API results
 */

import type { Paint } from './types';
import { getPaintDatabase, type PaintData } from './paintDatabase';
import { deltaE2000 } from './deltaE';

export interface MultiBrandMatches {
  citadel: Paint[];
  vallejo: Paint[];
  armyPainter: Paint[];
}

/**
 * Get top N paint matches for a color from each brand
 */
export function getMultiBrandMatches(
  colorLab: [number, number, number],
  matchesPerBrand: number = 3
): MultiBrandMatches {
  const paintDatabase = getPaintDatabase();

  // Group paints by brand
  const citadelPaints = paintDatabase.filter((p) => p.brand.toLowerCase() === 'citadel');
  const vallejoPaints = paintDatabase.filter((p) => p.brand.toLowerCase() === 'vallejo');
  const armyPainterPaints = paintDatabase.filter(
    (p) => p.brand.toLowerCase() === 'army painter'
  );

  // Find top matches for each brand
  const citadelMatches = findTopMatches(colorLab, citadelPaints, matchesPerBrand);
  const vallejoMatches = findTopMatches(colorLab, vallejoPaints, matchesPerBrand);
  const armyPainterMatches = findTopMatches(colorLab, armyPainterPaints, matchesPerBrand);

  return {
    citadel: citadelMatches,
    vallejo: vallejoMatches,
    armyPainter: armyPainterMatches,
  };
}

/**
 * Find top N closest paint matches
 */
function findTopMatches(
  colorLab: [number, number, number],
  paints: PaintData[],
  limit: number
): Paint[] {
  // Calculate Delta-E for each paint
  const matches = paints.map((paint) => {
    const deltaE = deltaE2000(
      { l: colorLab[0], a: colorLab[1], b: colorLab[2] },
      paint.lab
    );

    return {
      name: paint.name,
      brand: paint.brand,
      hex: paint.hex,
      type: paint.type,
      rgb: [paint.rgb.r, paint.rgb.g, paint.rgb.b] as [number, number, number],
      lab: [paint.lab.l, paint.lab.a, paint.lab.b] as [number, number, number],
      deltaE: Math.round(deltaE * 10) / 10, // Round to 1 decimal
    };
  });

  // Sort by Delta-E and return top matches
  matches.sort((a, b) => a.deltaE! - b.deltaE!);
  return matches.slice(0, limit);
}

/**
 * Enhance scan result with multi-brand matches
 * Takes existing result and adds matches from all brands
 */
export function enhanceWithMultiBrandMatches(
  scanResult: any,
  matchesPerBrand: number = 3
): any {
  // If result already has multi-brand matches, return as is
  if (
    scanResult.detectedColors &&
    scanResult.detectedColors[0]?.paintMatches?.citadel
  ) {
    return scanResult;
  }

  // Add multi-brand matches to each color
  const enhancedColors = scanResult.detectedColors.map((color: any) => {
    const matches = getMultiBrandMatches(color.lab, matchesPerBrand);

    return {
      ...color,
      paintMatches: matches,
    };
  });

  return {
    ...scanResult,
    detectedColors: enhancedColors,
  };
}
