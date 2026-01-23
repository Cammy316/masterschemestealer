/**
 * Paint Database
 * Pre-loaded miniature paint database with RGB and LAB values
 * Includes Citadel, Vallejo, Army Painter, and other popular brands
 */

import type { RGB, LAB } from './colorConversion';
import { rgbToLab, hexToRgb } from './colorConversion';

export interface PaintData {
  name: string;
  brand: string;
  hex: string;
  rgb: RGB;
  lab: LAB;
  type: string; // Base, Layer, Shade, etc.
  family?: string; // Red, Blue, Green, etc.
}

/**
 * Sample paint database (can be expanded)
 * In production, this would be loaded from a JSON file or API
 */
const PAINT_HEX_DATABASE: Array<Omit<PaintData, 'rgb' | 'lab'>> = [
  // Citadel Base Paints
  { name: 'Abaddon Black', brand: 'Citadel', hex: '#231F20', type: 'Base', family: 'Black' },
  { name: 'Ceramite White', brand: 'Citadel', hex: '#FFFFFF', type: 'Base', family: 'White' },
  { name: 'Corax White', brand: 'Citadel', hex: '#F0F0F0', type: 'Base', family: 'White' },
  { name: 'Mephiston Red', brand: 'Citadel', hex: '#960C09', type: 'Base', family: 'Red' },
  { name: 'Khorne Red', brand: 'Citadel', hex: '#6A0001', type: 'Base', family: 'Red' },
  { name: 'Screamer Pink', brand: 'Citadel', hex: '#811638', type: 'Base', family: 'Pink' },
  { name: 'Rhinox Hide', brand: 'Citadel', hex: '#493435', type: 'Base', family: 'Brown' },
  { name: 'Mournfang Brown', brand: 'Citadel', hex: '#621E18', type: 'Base', family: 'Brown' },
  { name: 'Bugmans Glow', brand: 'Citadel', hex: '#834437', type: 'Base', family: 'Skin' },
  { name: 'Cadian Fleshtone', brand: 'Citadel', hex: '#C77F6D', type: 'Base', family: 'Skin' },
  { name: 'Averland Sunset', brand: 'Citadel', hex: '#FDB825', type: 'Base', family: 'Yellow' },
  { name: 'Yriel Yellow', brand: 'Citadel', hex: '#FFE900', type: 'Layer', family: 'Yellow' },
  { name: 'Jokaero Orange', brand: 'Citadel', hex: '#EE3823', type: 'Base', family: 'Orange' },
  { name: 'Moot Green', brand: 'Citadel', hex: '#52B244', type: 'Layer', family: 'Green' },
  { name: 'Warpstone Glow', brand: 'Citadel', hex: '#1E7331', type: 'Base', family: 'Green' },
  { name: 'Caliban Green', brand: 'Citadel', hex: '#003D14', type: 'Base', family: 'Green' },
  { name: 'Macragge Blue', brand: 'Citadel', hex: '#0D407F', type: 'Base', family: 'Blue' },
  { name: 'Kantor Blue', brand: 'Citadel', hex: '#021B3A', type: 'Base', family: 'Blue' },
  { name: 'Caledor Sky', brand: 'Citadel', hex: '#366699', type: 'Layer', family: 'Blue' },
  { name: 'Lothern Blue', brand: 'Citadel', hex: '#34B2CE', type: 'Layer', family: 'Blue' },
  { name: 'Daemonette Hide', brand: 'Citadel', hex: '#696684', type: 'Base', family: 'Purple' },
  { name: 'Naggaroth Night', brand: 'Citadel', hex: '#3D3354', type: 'Base', family: 'Purple' },
  { name: 'Xereus Purple', brand: 'Citadel', hex: '#47125A', type: 'Layer', family: 'Purple' },
  { name: 'Leadbelcher', brand: 'Citadel', hex: '#888D8F', type: 'Base', family: 'Metal' },
  { name: 'Balthasar Gold', brand: 'Citadel', hex: '#A0784A', type: 'Base', family: 'Metal' },
  { name: 'Retributor Armour', brand: 'Citadel', hex: '#C39E6C', type: 'Base', family: 'Metal' },
  { name: 'Runelord Brass', brand: 'Citadel', hex: '#A58C5B', type: 'Layer', family: 'Metal' },

  // Citadel Shades
  { name: 'Agrax Earthshade', brand: 'Citadel', hex: '#84563D', type: 'Shade', family: 'Brown' },
  { name: 'Nuln Oil', brand: 'Citadel', hex: '#14100E', type: 'Shade', family: 'Black' },
  { name: 'Carroburg Crimson', brand: 'Citadel', hex: '#AA0808', type: 'Shade', family: 'Red' },
  { name: 'Drakenhof Nightshade', brand: 'Citadel', hex: '#125899', type: 'Shade', family: 'Blue' },
  { name: 'Athonian Camoshade', brand: 'Citadel', hex: '#475B2E', type: 'Shade', family: 'Green' },

  // Vallejo Model Color
  { name: 'Black', brand: 'Vallejo', hex: '#000000', type: 'Base', family: 'Black' },
  { name: 'White', brand: 'Vallejo', hex: '#FFFFFF', type: 'Base', family: 'White' },
  { name: 'Flat Red', brand: 'Vallejo', hex: '#B01010', type: 'Base', family: 'Red' },
  { name: 'Scarlet', brand: 'Vallejo', hex: '#911419', type: 'Base', family: 'Red' },
  { name: 'Vermillion', brand: 'Vallejo', hex: '#FF3108', type: 'Base', family: 'Orange' },
  { name: 'Orange', brand: 'Vallejo', hex: '#FF6B08', type: 'Base', family: 'Orange' },
  { name: 'Golden Yellow', brand: 'Vallejo', hex: '#F7CA18', type: 'Base', family: 'Yellow' },
  { name: 'Lemon Yellow', brand: 'Vallejo', hex: '#FFF212', type: 'Base', family: 'Yellow' },
  { name: 'Olive Green', brand: 'Vallejo', hex: '#505F23', type: 'Base', family: 'Green' },
  { name: 'Green', brand: 'Vallejo', hex: '#09A134', type: 'Base', family: 'Green' },
  { name: 'Flat Blue', brand: 'Vallejo', hex: '#005B94', type: 'Base', family: 'Blue' },
  { name: 'Blue', brand: 'Vallejo', hex: '#004E9E', type: 'Base', family: 'Blue' },
  { name: 'Azure', brand: 'Vallejo', hex: '#1890C8', type: 'Base', family: 'Blue' },
  { name: 'Prussian Blue', brand: 'Vallejo', hex: '#1C2D44', type: 'Base', family: 'Blue' },
  { name: 'Violet', brand: 'Vallejo', hex: '#4C2B4F', type: 'Base', family: 'Purple' },
  { name: 'Royal Purple', brand: 'Vallejo', hex: '#5B3256', type: 'Base', family: 'Purple' },
  { name: 'Burnt Umber', brand: 'Vallejo', hex: '#573B2A', type: 'Base', family: 'Brown' },
  { name: 'Chocolate Brown', brand: 'Vallejo', hex: '#3C2215', type: 'Base', family: 'Brown' },
  { name: 'Flat Brown', brand: 'Vallejo', hex: '#704E1F', type: 'Base', family: 'Brown' },
  { name: 'German Grey', brand: 'Vallejo', hex: '#3E4446', type: 'Base', family: 'Grey' },
  { name: 'Dark Grey', brand: 'Vallejo', hex: '#616667', type: 'Base', family: 'Grey' },
  { name: 'Medium Grey', brand: 'Vallejo', hex: '#8D9092', type: 'Base', family: 'Grey' },
  { name: 'Light Grey', brand: 'Vallejo', hex: '#BFBFBF', type: 'Base', family: 'Grey' },

  // Army Painter
  { name: 'Matt Black', brand: 'Army Painter', hex: '#000000', type: 'Base', family: 'Black' },
  { name: 'Matt White', brand: 'Army Painter', hex: '#FFFFFF', type: 'Base', family: 'White' },
  { name: 'Pure Red', brand: 'Army Painter', hex: '#DC1F3C', type: 'Base', family: 'Red' },
  { name: 'Dragon Red', brand: 'Army Painter', hex: '#B8191E', type: 'Base', family: 'Red' },
  { name: 'Greenskin', brand: 'Army Painter', hex: '#87A961', type: 'Base', family: 'Green' },
  { name: 'Angel Green', brand: 'Army Painter', hex: '#1A9B4A', type: 'Base', family: 'Green' },
  { name: 'Electric Blue', brand: 'Army Painter', hex: '#1598D3', type: 'Base', family: 'Blue' },
  { name: 'Ultramarine Blue', brand: 'Army Painter', hex: '#1E3F83', type: 'Base', family: 'Blue' },
  { name: 'Royal Purple', brand: 'Army Painter', hex: '#5A2C7A', type: 'Base', family: 'Purple' },
  { name: 'Alien Purple', brand: 'Army Painter', hex: '#8952AC', type: 'Base', family: 'Purple' },
  { name: 'Gun Metal', brand: 'Army Painter', hex: '#585E62', type: 'Metallic', family: 'Metal' },
  { name: 'Shining Silver', brand: 'Army Painter', hex: '#C5C8CB', type: 'Metallic', family: 'Metal' },
  { name: 'Greedy Gold', brand: 'Army Painter', hex: '#C9A952', type: 'Metallic', family: 'Metal' },
  { name: 'Weapon Bronze', brand: 'Army Painter', hex: '#947456', type: 'Metallic', family: 'Metal' },

  // Reaper MSP
  { name: 'Pure Black', brand: 'Reaper', hex: '#0C0C0C', type: 'Core', family: 'Black' },
  { name: 'Pure White', brand: 'Reaper', hex: '#FEFEFE', type: 'Core', family: 'White' },
  { name: 'Blood Red', brand: 'Reaper', hex: '#9A0D11', type: 'Core', family: 'Red' },
  { name: 'Fire Orange', brand: 'Reaper', hex: '#FF5B00', type: 'Core', family: 'Orange' },
  { name: 'Sunny Yellow', brand: 'Reaper', hex: '#FFDD00', type: 'Core', family: 'Yellow' },
  { name: 'Forest Green', brand: 'Reaper', hex: '#0F5B24', type: 'Core', family: 'Green' },
  { name: 'Jade Green', brand: 'Reaper', hex: '#0A927B', type: 'Core', family: 'Green' },
  { name: 'Ultramarine Blue', brand: 'Reaper', hex: '#002A7C', type: 'Core', family: 'Blue' },
  { name: 'Violet', brand: 'Reaper', hex: '#5F3A87', type: 'Core', family: 'Purple' },
  { name: 'Walnut Brown', brand: 'Reaper', hex: '#593D2F', type: 'Core', family: 'Brown' },
];

/**
 * Convert hex database to full paint database with RGB and LAB
 */
let paintDatabase: PaintData[] | null = null;

export function getPaintDatabase(): PaintData[] {
  if (paintDatabase) return paintDatabase;

  paintDatabase = PAINT_HEX_DATABASE.map((paint) => {
    const rgb = hexToRgb(paint.hex);
    const lab = rgbToLab(rgb);

    return {
      ...paint,
      rgb,
      lab,
    };
  });

  return paintDatabase;
}

/**
 * Get paints by brand
 */
export function getPaintsByBrand(brand: string): PaintData[] {
  return getPaintDatabase().filter((paint) => paint.brand === brand);
}

/**
 * Get paints by type
 */
export function getPaintsByType(type: string): PaintData[] {
  return getPaintDatabase().filter((paint) => paint.type === type);
}

/**
 * Get paints by color family
 */
export function getPaintsByFamily(family: string): PaintData[] {
  return getPaintDatabase().filter((paint) => paint.family === family);
}

/**
 * Search paints by name
 */
export function searchPaintsByName(query: string): PaintData[] {
  const lowerQuery = query.toLowerCase();
  return getPaintDatabase().filter((paint) =>
    paint.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get all unique brands
 */
export function getAllBrands(): string[] {
  const brands = new Set(getPaintDatabase().map((paint) => paint.brand));
  return Array.from(brands).sort();
}

/**
 * Get all unique types
 */
export function getAllTypes(): string[] {
  const types = new Set(getPaintDatabase().map((paint) => paint.type));
  return Array.from(types).sort();
}

/**
 * Get all unique families
 */
export function getAllFamilies(): string[] {
  const families = new Set(
    getPaintDatabase()
      .map((paint) => paint.family)
      .filter((f): f is string => f !== undefined)
  );
  return Array.from(families).sort();
}

/**
 * Get database statistics
 */
export function getDatabaseStats() {
  const db = getPaintDatabase();
  return {
    totalPaints: db.length,
    brands: getAllBrands().length,
    types: getAllTypes().length,
    families: getAllFamilies().length,
  };
}
