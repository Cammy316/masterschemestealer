export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface Ingredient {
  hex: string;
  parts: number;
}

/**
 * Converts a hex color string to an RGB object.
 * @param hex Hex color string (e.g., "#FF0000" or "FF0000")
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace('#', '');
  
  if (cleanHex.length !== 6) {
    throw new Error('Invalid hex color format. Expected 6 characters.');
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    throw new Error('Invalid hex color characters.');
  }

  return { r, g, b };
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
 * Mixes an array of ingredients (hex color + parts ratio) using a squared weighted average.
 * Squared average provides more accurate perceptual blending for sRGB than linear averaging.
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

  let totalParts = 0;
  let sumRSq = 0;
  let sumGSq = 0;
  let sumBSq = 0;

  for (const item of activeIngredients) {
    const rgb = hexToRgb(item.hex);
    totalParts += item.parts;
    
    // Use squared values for better perceptual mixing
    sumRSq += (rgb.r * rgb.r) * item.parts;
    sumGSq += (rgb.g * rgb.g) * item.parts;
    sumBSq += (rgb.b * rgb.b) * item.parts;
  }

  if (totalParts === 0) return null;

  const mixedR = Math.sqrt(sumRSq / totalParts);
  const mixedG = Math.sqrt(sumGSq / totalParts);
  const mixedB = Math.sqrt(sumBSq / totalParts);

  return rgbToHex({ r: mixedR, g: mixedG, b: mixedB });
}
