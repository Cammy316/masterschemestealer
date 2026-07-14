import { describe, it, expect } from 'vitest';
import { hueDirection, proximityPercentage, proximityLabel } from '../colourClues';

describe('colourClues', () => {
  describe('hueDirection', () => {
    it('returns achromatic for low chroma paints', () => {
      // a=0, b=0 -> chroma=0
      expect(hueDirection({ l: 50, a: 0, b: 0 }, { l: 50, a: 10, b: 10 })).toBe('achromatic');
      expect(hueDirection({ l: 50, a: 10, b: 10 }, { l: 50, a: 0, b: 0 })).toBe('achromatic');
    });

    it('returns match for close hues (< 10 degrees)', () => {
      // 0 deg and 5 deg
      expect(hueDirection({ l: 50, a: 10, b: 0 }, { l: 50, a: 10, b: 0.87 })).toBe('match');
    });

    it('handles warm rotation (guess 0 -> target 40 -> warm pole 55)', () => {
      // guess 0 deg (a=10, b=0)
      // target 40 deg (a=7.66, b=6.42)
      // dist to 55 from 0 is 55, from 40 is 15. Target is warmer.
      expect(hueDirection({ l: 50, a: 10, b: 0 }, { l: 50, a: 7.66, b: 6.42 })).toBe('warmer');
    });

    it('handles cool rotation', () => {
      // guess 40 deg, target 0 deg
      // target is cooler.
      expect(hueDirection({ l: 50, a: 7.66, b: 6.42 }, { l: 50, a: 10, b: 0 })).toBe('cooler');
    });

    it('handles wraparound across 0 degrees', () => {
      // warm pole is 55.
      // target 10 deg, guess 350 deg
      // dist 10 -> 55 = 45
      // dist 350 -> 55 = 65
      // target is warmer
      expect(hueDirection({ l: 50, a: 10, b: -1.76 }, { l: 50, a: 10, b: 1.76 })).toBe('warmer');
    });
  });

  describe('proximity', () => {
    it('mapping is monotonic decreasing in de', () => {
      const p1 = proximityPercentage(0);
      const p2 = proximityPercentage(10);
      const p3 = proximityPercentage(39);
      const p4 = proximityPercentage(40);
      const p5 = proximityPercentage(50);
      
      expect(p1).toBe(100);
      expect(p2).toBeLessThan(p1);
      expect(p3).toBeLessThan(p2);
      expect(p4).toBe(0);
      expect(p5).toBe(0);
    });
    
    it('labels correctly', () => {
      expect(proximityLabel(0)).toBe('WIN');
      expect(proximityLabel(3.9)).toBe('HOT');
      expect(proximityLabel(11.9)).toBe('WARM');
      expect(proximityLabel(15)).toBe('COLD');
    });
  });
});
