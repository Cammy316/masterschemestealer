/**
 * Color Conversion Utilities
 * RGB ↔ LAB ↔ HSV conversions for color analysis
 */

export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface LAB {
  l: number; // 0-100 (lightness)
  a: number; // -128 to 127 (green to red)
  b: number; // -128 to 127 (blue to yellow)
}

export interface HSV {
  h: number; // 0-360 (hue)
  s: number; // 0-100 (saturation)
  v: number; // 0-100 (value)
}

/**
 * Convert RGB to LAB color space
 * LAB is perceptually uniform - better for color difference calculations
 */
export function rgbToLab(rgb: RGB): LAB {
  // Step 1: RGB to XYZ
  let r = rgb.r / 255;
  let g = rgb.g / 255;
  let b = rgb.b / 255;

  // Apply gamma correction
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

  // Convert to XYZ using D65 illuminant
  const x = (r * 0.4124564 + g * 0.3575761 + b * 0.1804375) * 100;
  const y = (r * 0.2126729 + g * 0.7151522 + b * 0.0721750) * 100;
  const z = (r * 0.0193339 + g * 0.1191920 + b * 0.9503041) * 100;

  // Step 2: XYZ to LAB
  // D65 reference white point
  const xn = 95.047;
  const yn = 100.000;
  const zn = 108.883;

  let fx = x / xn;
  let fy = y / yn;
  let fz = z / zn;

  // Apply LAB transformation
  const delta = 6 / 29;
  const deltaSquared = delta * delta;
  const deltaCubed = delta * delta * delta;

  fx = fx > deltaCubed ? Math.pow(fx, 1 / 3) : (fx / (3 * deltaSquared)) + (4 / 29);
  fy = fy > deltaCubed ? Math.pow(fy, 1 / 3) : (fy / (3 * deltaSquared)) + (4 / 29);
  fz = fz > deltaCubed ? Math.pow(fz, 1 / 3) : (fz / (3 * deltaSquared)) + (4 / 29);

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bValue = 200 * (fy - fz);

  return { l, a, b: bValue };
}

/**
 * Convert LAB to RGB color space
 */
export function labToRgb(lab: LAB): RGB {
  // Step 1: LAB to XYZ
  const fy = (lab.l + 16) / 116;
  const fx = lab.a / 500 + fy;
  const fz = fy - lab.b / 200;

  const delta = 6 / 29;
  const deltaSquared = delta * delta;
  const deltaCubed = delta * delta * delta;

  const xr = fx > delta ? Math.pow(fx, 3) : 3 * deltaSquared * (fx - 4 / 29);
  const yr = fy > delta ? Math.pow(fy, 3) : 3 * deltaSquared * (fy - 4 / 29);
  const zr = fz > delta ? Math.pow(fz, 3) : 3 * deltaSquared * (fz - 4 / 29);

  // D65 reference white point
  const x = xr * 95.047;
  const y = yr * 100.000;
  const z = zr * 108.883;

  // Step 2: XYZ to RGB
  let r = (x * 0.032406 - y * 0.015372 - z * 0.004986) / 100;
  let g = (-x * 0.009689 + y * 0.018758 + z * 0.000415) / 100;
  let b = (x * 0.000557 - y * 0.002040 + z * 0.010570) / 100;

  // Apply inverse gamma correction
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  // Clamp to valid range
  return {
    r: Math.max(0, Math.min(255, Math.round(r * 255))),
    g: Math.max(0, Math.min(255, Math.round(g * 255))),
    b: Math.max(0, Math.min(255, Math.round(b * 255))),
  };
}

/**
 * Convert RGB to HSV color space
 * Useful for color categorization and filtering
 */
export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  // Calculate value
  const v = max * 100;

  // Calculate saturation
  const s = max === 0 ? 0 : (delta / max) * 100;

  // Calculate hue
  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = 60 * (((g - b) / delta) % 6);
    } else if (max === g) {
      h = 60 * ((b - r) / delta + 2);
    } else {
      h = 60 * ((r - g) / delta + 4);
    }
  }

  // Normalize hue to 0-360
  if (h < 0) h += 360;

  return { h, s, v };
}

/**
 * Convert HSV to RGB color space
 */
export function hsvToRgb(hsv: HSV): RGB {
  const h = hsv.h;
  const s = hsv.s / 100;
  const v = hsv.v / 100;

  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    r = c; g = x; b = 0;
  } else if (h >= 60 && h < 120) {
    r = x; g = c; b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0; g = c; b = x;
  } else if (h >= 180 && h < 240) {
    r = 0; g = x; b = c;
  } else if (h >= 240 && h < 300) {
    r = x; g = 0; b = c;
  } else if (h >= 300 && h < 360) {
    r = c; g = 0; b = x;
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

/**
 * Convert RGB to hex string
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(n).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/**
 * Convert hex string to RGB
 */
export function hexToRgb(hex: string): RGB {
  // Remove # if present
  hex = hex.replace('#', '');

  // Handle 3-digit hex codes
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

/**
 * Get relative luminance (for contrast calculations)
 */
export function getRelativeLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r / 255, rgb.g / 255, rgb.b / 255].map((val) => {
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}
