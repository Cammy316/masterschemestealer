import { describe, it, expect } from 'vitest';
import proofSchemes from '../data/proof_schemes.json';
import { PAINT_DATABASE } from '../paintDatabase';

const paintMap = new Map(PAINT_DATABASE.map(p => [p.paint_id, p]));

describe('proof_schemes.json', () => {
  it('has at least 30 schemes', () => {
    expect(proofSchemes.length).toBeGreaterThanOrEqual(30);
  });

  it('contains valid paint IDs in both palettes', () => {
    proofSchemes.forEach(scheme => {
      scheme.originalPalette.forEach(id => {
        expect(paintMap.has(id)).toBe(true);
      });
      scheme.budgetPalette.forEach(id => {
        expect(paintMap.has(id)).toBe(true);
      });
    });
  });

  it('contains no Citadel paints in budget palettes', () => {
    proofSchemes.forEach(scheme => {
      scheme.budgetPalette.forEach(id => {
        const p = paintMap.get(id);
        expect(p?.brand).not.toBe('Citadel');
      });
    });
  });

  it('has non-empty and unique model labels', () => {
    const labels = new Set();
    proofSchemes.forEach(scheme => {
      expect(scheme.model.trim().length).toBeGreaterThan(0);
      expect(labels.has(scheme.model)).toBe(false);
      labels.add(scheme.model);
    });
  });
});
