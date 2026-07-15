import { describe, it, expect, vi } from 'vitest';
import { searchPaints } from '../paintSearch';
import { PAINT_DATABASE } from '../paintDatabase';

// Mock the paint database for consistent testing
vi.mock('../paintDatabase', async () => {
  const actual = await vi.importActual('../paintDatabase');
  return {
    ...actual,
    PAINT_DATABASE: [
      { paint_id: 'citadel-mephiston-red', brand: 'Citadel', name: 'Mephiston Red', matchable: true, aliases: ['base'] },
      { paint_id: 'citadel-evil-sunz', brand: 'Citadel', name: 'Evil Sunz Scarlet', matchable: true, aliases: ['layer'] },
      { paint_id: 'vallejo-red', brand: 'Vallejo', name: 'Flat Red', matchable: true, aliases: ['mc'] },
      { paint_id: 'vallejo-dead', brand: 'Vallejo', name: 'Dead White', matchable: false, aliases: ['mc'] },
      { paint_id: 'ak-red', brand: 'AK', name: 'Deep Red', matchable: true, aliases: ['3rd gen'] },
      { paint_id: 'citadel-nuln', brand: 'Citadel', name: 'Nuln Oil', matchable: true, aliases: ['wash', 'shade'] },
      { paint_id: 'citadel-agrax', brand: 'Citadel', name: 'Agrax Earthshade', matchable: true, aliases: ['wash', 'shade'] },
      { paint_id: 'citadel-seraphim', brand: 'Citadel', name: 'Seraphim Sepia', matchable: true, aliases: ['wash', 'shade'] },
      { paint_id: 'citadel-reikland', brand: 'Citadel', name: 'Reikland Fleshshade', matchable: true, aliases: ['wash', 'shade'] },
      { paint_id: 'citadel-druchii', brand: 'Citadel', name: 'Druchii Violet', matchable: true, aliases: ['wash', 'shade'] },
    ]
  };
});

describe('searchPaints', () => {
  it('returns empty array for empty query', () => {
    expect(searchPaints('')).toEqual([]);
    expect(searchPaints('   ')).toEqual([]);
  });

  it('matches single term (case insensitive)', () => {
    const results = searchPaints('mephiston');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Mephiston Red');

    const upperResults = searchPaints('MEPHISTON');
    expect(upperResults).toHaveLength(1);
  });

  it('matches multiple terms across brand and name', () => {
    const results = searchPaints('citadel red');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Mephiston Red');
  });

  it('matches aliases', () => {
    const results = searchPaints('citadel shade');
    expect(results.length).toBeGreaterThan(0);
    expect(results.every(p => p.aliases.includes('shade'))).toBe(true);
  });

  it('excludes non-matchable paints', () => {
    const results = searchPaints('dead white');
    expect(results).toHaveLength(0);
  });

  it('limits results', () => {
    const results = searchPaints('citadel', 3);
    expect(results).toHaveLength(3);
  });
});
