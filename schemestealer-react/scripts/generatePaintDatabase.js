/**
 * Paint Database Generator
 *
 * Extracts ~1000 most important paints from the full database,
 * pre-computes LAB values, and generates an optimized TypeScript file.
 *
 * Run with: node scripts/generatePaintDatabase.js
 */

const fs = require('fs');
const path = require('path');

// ============================================================================
// Colour Conversion Functions
// ============================================================================

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { r: 0, g: 0, b: 0 };
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToLab(rgb) {
  // Convert RGB to XYZ
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  r *= 100;
  g *= 100;
  b *= 100;

  const x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
  const y = r * 0.2126729 + g * 0.7151522 + b * 0.0721750;
  const z = r * 0.0193339 + g * 0.1191920 + b * 0.9503041;

  // Convert XYZ to LAB (D65 illuminant)
  const refX = 95.047;
  const refY = 100.0;
  const refZ = 108.883;

  let xr = x / refX;
  let yr = y / refY;
  let zr = z / refZ;

  xr = xr > 0.008856 ? Math.pow(xr, 1/3) : (7.787 * xr) + (16/116);
  yr = yr > 0.008856 ? Math.pow(yr, 1/3) : (7.787 * yr) + (16/116);
  zr = zr > 0.008856 ? Math.pow(zr, 1/3) : (7.787 * zr) + (16/116);

  return {
    l: Math.round((116 * yr - 16) * 100) / 100,
    a: Math.round((500 * (xr - yr)) * 100) / 100,
    b: Math.round((200 * (yr - zr)) * 100) / 100,
  };
}

// ============================================================================
// Paint Selection Logic
// ============================================================================

// Priority brands (most commonly used for miniature painting)
const PRIORITY_BRANDS = [
  'Citadel',
  'Vallejo',
  'Army Painter',
  'Vallejo Game Color',
  'Vallejo Model Color',
  'Scale75',
  'Reaper',
  'P3',
  'AK Interactive',
];

// Priority categories (base/layer paints are most important)
const PRIORITY_CATEGORIES = ['base', 'layer', 'shade', 'contrast', 'metallic'];

// Colour families we want good coverage of
const COLOUR_FAMILIES = [
  'red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink',
  'brown', 'grey', 'black', 'white', 'metal', 'gold', 'silver', 'bronze',
  'skin', 'flesh', 'bone', 'cream', 'tan', 'turquoise', 'teal', 'cyan'
];

function calculatePaintScore(paint, index, totalPaints) {
  let score = 0;

  // Brand priority (higher = better)
  const brandIndex = PRIORITY_BRANDS.findIndex(b =>
    paint.brand?.toLowerCase().includes(b.toLowerCase())
  );
  if (brandIndex !== -1) {
    score += (PRIORITY_BRANDS.length - brandIndex) * 10;
  }

  // Category priority
  const category = (paint.category || paint.type || '').toLowerCase();
  const catIndex = PRIORITY_CATEGORIES.indexOf(category);
  if (catIndex !== -1) {
    score += (PRIORITY_CATEGORIES.length - catIndex) * 5;
  }

  // Metallics are important
  if (paint.finish === 'metallic' || category === 'metallic' ||
      paint.color_family === 'metal' || paint.tags?.includes('metallic')) {
    score += 15;
  }

  // Shades/washes are important for recipes
  if (category === 'shade' || category === 'wash') {
    score += 12;
  }

  // Base paints are essential
  if (category === 'base') {
    score += 10;
  }

  // Contrast paints are popular
  if (category === 'contrast') {
    score += 8;
  }

  return score;
}

function selectPaints(allPaints, targetCount = 1000) {
  console.log(`Total paints in database: ${allPaints.length}`);

  // Score all paints
  const scoredPaints = allPaints.map((paint, index) => ({
    ...paint,
    score: calculatePaintScore(paint, index, allPaints.length),
  }));

  // Sort by score (descending)
  scoredPaints.sort((a, b) => b.score - a.score);

  // Select paints ensuring colour coverage
  const selected = [];
  const colourFamilyCounts = {};
  const brandCounts = {};

  // Initialize counters
  COLOUR_FAMILIES.forEach(f => colourFamilyCounts[f] = 0);

  // First pass: select high-scoring paints with diversity
  for (const paint of scoredPaints) {
    if (selected.length >= targetCount) break;

    const family = (paint.color_family || 'unknown').toLowerCase();
    const brand = paint.brand || 'unknown';

    // Ensure we don't over-represent any single colour family
    const maxPerFamily = Math.ceil(targetCount / COLOUR_FAMILIES.length) * 2;
    if (colourFamilyCounts[family] >= maxPerFamily) continue;

    // Ensure we don't over-represent any single brand
    const maxPerBrand = Math.ceil(targetCount / 4);
    if ((brandCounts[brand] || 0) >= maxPerBrand) continue;

    selected.push(paint);
    colourFamilyCounts[family] = (colourFamilyCounts[family] || 0) + 1;
    brandCounts[brand] = (brandCounts[brand] || 0) + 1;
  }

  // Log statistics
  console.log(`\nSelected ${selected.length} paints`);
  console.log('\nBy brand:');
  Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([brand, count]) => console.log(`  ${brand}: ${count}`));

  console.log('\nBy colour family:');
  Object.entries(colourFamilyCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .forEach(([family, count]) => console.log(`  ${family}: ${count}`));

  return selected;
}

// ============================================================================
// TypeScript Generation
// ============================================================================

function mapCategory(paint) {
  const category = (paint.category || paint.type || 'base').toLowerCase();

  // Normalize category names
  if (category.includes('shade') || category.includes('wash')) return 'Shade';
  if (category.includes('layer')) return 'Layer';
  if (category.includes('base')) return 'Base';
  if (category.includes('contrast')) return 'Contrast';
  if (category.includes('metallic') || paint.finish === 'metallic') return 'Metallic';
  if (category.includes('technical')) return 'Technical';
  if (category.includes('dry')) return 'Dry';
  if (category.includes('air')) return 'Air';

  return 'Base';
}

function mapFamily(paint) {
  const family = (paint.color_family || 'unknown').toLowerCase();

  // Capitalize first letter
  return family.charAt(0).toUpperCase() + family.slice(1);
}

function generateTypeScript(paints) {
  const processedPaints = paints.map(paint => {
    const rgb = hexToRgb(paint.hex);
    const lab = rgbToLab(rgb);

    return {
      name: paint.name,
      brand: paint.brand,
      hex: paint.hex.toUpperCase(),
      type: mapCategory(paint),
      family: mapFamily(paint),
      rgb: rgb,  // { r, g, b } object
      lab: lab,  // { l, a, b } object
    };
  });

  // Sort by brand, then by name for easier reading
  processedPaints.sort((a, b) => {
    if (a.brand !== b.brand) return a.brand.localeCompare(b.brand);
    return a.name.localeCompare(b.name);
  });

  const tsContent = `/**
 * Paint Database - Auto-generated
 *
 * Contains ${processedPaints.length} pre-computed paints with RGB and LAB values.
 * Generated from the master paints.json database.
 *
 * DO NOT EDIT MANUALLY - run \`node scripts/generatePaintDatabase.js\` to regenerate.
 *
 * Last generated: ${new Date().toISOString()}
 */

import type { RGB, LAB } from './colorConversion';

export interface PaintData {
  name: string;
  brand: string;
  hex: string;
  rgb: RGB;
  lab: LAB;
  type: string;
  family: string;
}

/**
 * Pre-computed paint database with LAB values
 * Optimized subset of ~${processedPaints.length} paints for fast offline matching
 */
export const PAINT_DATABASE: PaintData[] = ${JSON.stringify(processedPaints, null, 2)
  .replace(/"(\w+)":/g, '$1:')
  .replace(/"/g, "'")};

// Cached reference
let _paintDatabase: PaintData[] | null = null;

/**
 * Get the paint database (cached)
 */
export function getPaintDatabase(): PaintData[] {
  if (!_paintDatabase) {
    _paintDatabase = PAINT_DATABASE;
  }
  return _paintDatabase;
}

/**
 * Get paints by brand
 */
export function getPaintsByBrand(brand: string): PaintData[] {
  return getPaintDatabase().filter(
    (paint) => paint.brand.toLowerCase() === brand.toLowerCase()
  );
}

/**
 * Get paints by type
 */
export function getPaintsByType(type: string): PaintData[] {
  return getPaintDatabase().filter(
    (paint) => paint.type.toLowerCase() === type.toLowerCase()
  );
}

/**
 * Get paints by colour family
 */
export function getPaintsByFamily(family: string): PaintData[] {
  return getPaintDatabase().filter(
    (paint) => paint.family.toLowerCase() === family.toLowerCase()
  );
}

/**
 * Database statistics
 */
export const PAINT_DATABASE_STATS = {
  totalPaints: ${processedPaints.length},
  brands: ${JSON.stringify([...new Set(processedPaints.map(p => p.brand))].sort())},
  types: ${JSON.stringify([...new Set(processedPaints.map(p => p.type))].sort())},
  families: ${JSON.stringify([...new Set(processedPaints.map(p => p.family))].sort())},
  generatedAt: '${new Date().toISOString()}',
};
`;

  return tsContent;
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const paintsJsonPath = path.join(__dirname, '../../python-api/paints.json');
  const outputPath = path.join(__dirname, '../lib/paintDatabase.ts');

  console.log('Reading paints database...');
  const rawData = fs.readFileSync(paintsJsonPath, 'utf-8');
  const allPaints = JSON.parse(rawData);

  console.log('Selecting optimal paint subset...');
  const selectedPaints = selectPaints(allPaints, 1000);

  console.log('\nGenerating TypeScript file...');
  const tsContent = generateTypeScript(selectedPaints);

  console.log(`Writing to ${outputPath}...`);
  fs.writeFileSync(outputPath, tsContent, 'utf-8');

  console.log('\n✅ Done! Paint database generated successfully.');
  console.log(`   ${selectedPaints.length} paints with pre-computed LAB values`);
}

main().catch(console.error);
