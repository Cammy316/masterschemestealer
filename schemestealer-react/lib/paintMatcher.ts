/**
 * Paint Matcher - Matches colors to paints from multiple brands
 * Uses offline paint database to supplement API results
 * Now supports structured paint recipes with BASE/SHADE/HIGHLIGHT/WASH
 */

import type { Paint, PaintMatch, BrandRecipe, PaintRecipe } from './types';
import { getPaintDatabase, type PaintData } from './paintDatabase';
import { deltaE2000 } from './deltaE';

export interface MultiBrandMatches {
  citadel: Paint[];
  vallejo: Paint[];
  armyPainter: Paint[];
}

// Wash mapping by color family - mirrors backend WashMapping
const WASH_MAPPING: Record<string, Record<string, string>> = {
  citadel: {
    red: 'Carroburg Crimson',
    orange: 'Reikland Fleshshade',
    yellow: 'Casandora Yellow',
    brown: 'Agrax Earthshade',
    green: 'Biel-Tan Green',
    cyan: 'Coelia Greenshade',
    blue: 'Drakenhof Nightshade',
    purple: 'Druchii Violet',
    pink: 'Carroburg Crimson',
    flesh: 'Reikland Fleshshade',
    black: 'Nuln Oil',
    grey: 'Nuln Oil',
    white: 'Nuln Oil',
    gold: 'Reikland Fleshshade',
    silver: 'Nuln Oil',
    bronze: 'Agrax Earthshade',
    default: 'Nuln Oil',
  },
  vallejo: {
    red: 'Red Shade',
    orange: 'Sepia Shade',
    yellow: 'Yellow Shade',
    brown: 'Umber Shade',
    green: 'Green Shade',
    cyan: 'Green Shade',
    blue: 'Blue Shade',
    purple: 'Violet Shade',
    pink: 'Red Shade',
    flesh: 'Flesh Wash',
    black: 'Black Shade',
    grey: 'Black Shade',
    white: 'Black Shade',
    gold: 'Sepia Shade',
    silver: 'Black Shade',
    bronze: 'Umber Shade',
    default: 'Black Shade',
  },
  'army-painter': {
    red: 'Red Tone',
    orange: 'Soft Tone',
    yellow: 'Soft Tone',
    brown: 'Strong Tone',
    green: 'Green Tone',
    cyan: 'Blue Tone',
    blue: 'Blue Tone',
    purple: 'Purple Tone',
    pink: 'Red Tone',
    flesh: 'Flesh Wash',
    black: 'Dark Tone',
    grey: 'Dark Tone',
    white: 'Dark Tone',
    gold: 'Soft Tone',
    silver: 'Dark Tone',
    bronze: 'Strong Tone',
    default: 'Dark Tone',
  },
};

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
 * Adjust LAB lightness to generate highlight/shade variations
 */
function adjustLightness(
  lab: [number, number, number],
  delta: number
): [number, number, number] {
  return [Math.max(0, Math.min(100, lab[0] + delta)), lab[1], lab[2]];
}

/**
 * Get wash recommendation for a color family and brand
 */
function getWashForFamily(
  family: string,
  brand: 'citadel' | 'vallejo' | 'army-painter'
): string {
  const brandMap = WASH_MAPPING[brand] || WASH_MAPPING.citadel;
  const familyLower = family.toLowerCase();

  // Check for exact match or partial match
  for (const key of Object.keys(brandMap)) {
    if (familyLower.includes(key) || key.includes(familyLower)) {
      return brandMap[key];
    }
  }

  return brandMap.default;
}

/**
 * Find a wash paint from the database by name and brand
 */
function findWashPaint(washName: string, brand: string): PaintMatch | null {
  const paintDatabase = getPaintDatabase();

  // Find wash in database
  const wash = paintDatabase.find(
    (p) =>
      p.brand.toLowerCase() === brand.replace('-', ' ').toLowerCase() &&
      (p.name.toLowerCase().includes(washName.toLowerCase()) ||
        washName.toLowerCase().includes(p.name.toLowerCase().split(' ')[0]))
  );

  if (wash) {
    return {
      name: wash.name,
      hex: wash.hex,
      type: 'wash',
      deltaE: 0,
    };
  }

  // Return basic info if not found in database
  return {
    name: washName,
    hex: '#000000',
    type: 'wash',
    deltaE: 0,
  };
}

/**
 * Generate a structured paint recipe for a color
 */
export function getRecipeForColor(
  colorLab: [number, number, number],
  colorFamily: string,
  brand: 'citadel' | 'vallejo' | 'army-painter'
): BrandRecipe {
  const paintDatabase = getPaintDatabase();
  const brandName = brand.replace('-', ' ');

  // Filter paints by brand
  const brandPaints = paintDatabase.filter(
    (p) => p.brand.toLowerCase() === brandName.toLowerCase()
  );

  // Filter for base/layer paints (non-washes)
  const basePaints = brandPaints.filter(
    (p) =>
      !['wash', 'shade', 'ink'].includes(p.type.toLowerCase()) &&
      !p.name.toLowerCase().includes('wash') &&
      !p.name.toLowerCase().includes('shade')
  );

  // Find best base match
  const baseMatch = findClosestPaint(colorLab, basePaints);

  // Generate highlight (lighter version)
  const highlightLab = adjustLightness(colorLab, 15);
  const highlightMatch = findClosestPaint(highlightLab, basePaints);

  // Generate shade (darker version)
  const shadeLab = adjustLightness(colorLab, -20);
  const shadeMatch = findClosestPaint(shadeLab, basePaints);

  // Get wash based on color family
  const washName = getWashForFamily(colorFamily, brand);
  const washMatch = findWashPaint(washName, brandName);

  return {
    base: baseMatch,
    shade: shadeMatch,
    highlight: highlightMatch,
    wash: washMatch,
  };
}

/**
 * Find closest paint match from a list
 */
function findClosestPaint(
  colorLab: [number, number, number],
  paints: PaintData[]
): PaintMatch | null {
  if (paints.length === 0) return null;

  let bestMatch: PaintData | null = null;
  let bestDeltaE = Infinity;

  for (const paint of paints) {
    const dE = deltaE2000({ l: colorLab[0], a: colorLab[1], b: colorLab[2] }, paint.lab);

    if (dE < bestDeltaE) {
      bestDeltaE = dE;
      bestMatch = paint;
    }
  }

  if (!bestMatch) return null;

  return {
    name: bestMatch.name,
    hex: bestMatch.hex,
    type: bestMatch.type || 'paint',
    deltaE: Math.round(bestDeltaE * 10) / 10,
  };
}

/**
 * Generate full paint recipe for all brands
 */
export function getFullPaintRecipe(
  colorLab: [number, number, number],
  colorFamily: string
): PaintRecipe {
  return {
    citadel: getRecipeForColor(colorLab, colorFamily, 'citadel'),
    vallejo: getRecipeForColor(colorLab, colorFamily, 'vallejo'),
    army_painter: getRecipeForColor(colorLab, colorFamily, 'army-painter'),
  };
}

/**
 * Enhance scan result with multi-brand matches (legacy format)
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

/**
 * Enhance scan result with structured paint recipes (new format)
 * Takes existing result and adds paintRecipe to each color
 */
export function enhanceWithPaintRecipes(scanResult: any): any {
  // If result already has paintRecipe, return as is
  if (scanResult.detectedColors && scanResult.detectedColors[0]?.paintRecipe) {
    return scanResult;
  }

  // Add paintRecipe to each color
  const enhancedColors = scanResult.detectedColors.map((color: any) => {
    const recipe = getFullPaintRecipe(color.lab, color.family || 'Unknown');

    return {
      ...color,
      paintRecipe: recipe,
    };
  });

  return {
    ...scanResult,
    detectedColors: enhancedColors,
  };
}
