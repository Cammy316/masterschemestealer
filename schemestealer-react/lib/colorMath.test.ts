import { describe, it, expect } from 'vitest';
import { hexToRgb, rgbToHex, mixColorsWeighted } from './colorMath';

describe('colorMath', () => {
  describe('hexToRgb', () => {
    it('converts valid hex to RGB', () => {
      expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
      expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
      expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
      expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('works without the hash prefix', () => {
      expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('throws error on invalid format', () => {
      expect(() => hexToRgb('#FF0')).toThrowError();
      expect(() => hexToRgb('#FFFFFFF')).toThrowError();
      expect(() => hexToRgb('#ZZZZZZ')).toThrowError();
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB to hex', () => {
      expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000');
      expect(rgbToHex({ r: 0, g: 255, b: 0 })).toBe('#00FF00');
      expect(rgbToHex({ r: 0, g: 0, b: 255 })).toBe('#0000FF');
      expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF');
      expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    });

    it('clamps values below 0 and above 255', () => {
      expect(rgbToHex({ r: -10, g: 300, b: 0 })).toBe('#00FF00');
    });
    
    it('rounds decimal values', () => {
      expect(rgbToHex({ r: 10.4, g: 10.6, b: 0 })).toBe('#0A0B00');
    });
  });

  describe('mixColorsWeighted', () => {
    it('returns null for empty array', () => {
      expect(mixColorsWeighted([])).toBeNull();
    });

    it('returns null if all parts are 0', () => {
      expect(mixColorsWeighted([{ hex: '#FF0000', parts: 0 }])).toBeNull();
    });

    it('returns the same color if only 1 ingredient is active', () => {
      expect(mixColorsWeighted([{ hex: '#FF0000', parts: 1 }])).toBe('#FF0000');
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 1 },
        { hex: '#00FF00', parts: 0 }
      ])).toBe('#FF0000');
    });

    it('mixes two colors equally (1:1 ratio)', () => {
      // Red + Green using squared average: sqrt( (255^2 + 0) / 2 ) = sqrt(32512.5) ≈ 180.3 -> B4
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 1 },
        { hex: '#00FF00', parts: 1 }
      ])).toBe('#B4B400');
    });

    it('mixes two colors with different weights (2:1 ratio)', () => {
      // 2 parts Red + 1 part Green
      // R: sqrt( (2*255^2 + 0)/3 ) = sqrt(130050/3) = sqrt(43350) ≈ 208.2 -> D0
      // G: sqrt( (0 + 255^2)/3 ) = sqrt(65025/3) = sqrt(21675) ≈ 147.2 -> 93
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 2 },
        { hex: '#00FF00', parts: 1 }
      ])).toBe('#D09300');
    });

    it('mixes multiple colors correctly', () => {
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 1 },
        { hex: '#00FF00', parts: 1 },
        { hex: '#0000FF', parts: 1 }
      ])).toBe('#939393'); // 147, 147, 147
    });
  });
});
