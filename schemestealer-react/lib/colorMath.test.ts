import { describe, it, expect } from 'vitest';
import { rgbToHex, mixColorsWeighted } from './colorMath';

describe('colorMath', () => {
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

    // Expected values are spectral.js Kubelka-Munk pigment mixes — real paint
    // behaviour, NOT channel averaging. Pure red + green pigments make a
    // brown-orange; all three primaries make a dark brown, never grey.
    it('mixes two colors equally (1:1 ratio) like pigment', () => {
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 1 },
        { hex: '#00FF00', parts: 1 }
      ])).toBe('#834B17');
    });

    it('weights the mix by parts (2:1 pulls toward red)', () => {
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 2 },
        { hex: '#00FF00', parts: 1 }
      ])).toBe('#8A3A16');
    });

    it('mixes all three primaries to a dark brown, not grey', () => {
      expect(mixColorsWeighted([
        { hex: '#FF0000', parts: 1 },
        { hex: '#00FF00', parts: 1 },
        { hex: '#0000FF', parts: 1 }
      ])).toBe('#593923');
    });
  });
});
