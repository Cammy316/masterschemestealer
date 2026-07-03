/**
 * Forge colour-math tests (Phase 0 of the colour-science overhaul).
 *
 * Pins the physics the Alchemy Crucible promises the painter:
 *   - Kubelka-Munk mixing behaves like paint (blue + yellow makes GREEN,
 *     not the grey that naive RGB averaging produces),
 *   - mixing depends on ratios, not absolute part counts,
 *   - basecoat simulation darkens over a dark primer,
 *   - matching returns well-formed, accuracy-ordered results.
 *
 * Two tests use `it.fails` to document a live defect (audit finding F9):
 * colorMath.ts tags the database's D65 LAB values as culori mode 'lab'
 * (which is D50), so differenceCiede2000 applies a spurious chromatic
 * adaptation to the paint side of every comparison. Reported ΔE values are
 * wrong by up to ~1.8 and close matches can flip order. Phase 4 fixes the
 * mode to 'lab65'; these tests then start passing and `.fails` must be
 * removed.
 */

import { describe, it, expect } from 'vitest';
import { converter, differenceCiede2000 } from 'culori';
import paintsData from '../lib/data/paints_groundtruth.json';
import {
  effectiveCoverage,
  findClosestPaint,
  findTopAlternativeMatches,
  mixColorsWeighted,
  rgbToHex,
  simulateBasecoat,
} from '../lib/colorMath';

const toLab65 = converter('lab65');
const deltaE = differenceCiede2000();

const BLUE = '#2b3a8f';
const YELLOW = '#f2d84b';

function channels(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

describe('rgbToHex', () => {
  it('clamps out-of-range channels and rounds fractional ones', () => {
    expect(rgbToHex({ r: -5, g: 300, b: 12.4 })).toBe('#00FF0C');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toBe('#FFFFFF');
  });
});

describe('mixColorsWeighted (Kubelka-Munk)', () => {
  it('mixes blue + yellow to GREEN — the K-M signature RGB averaging fails', () => {
    // RGB averaging of these two gives a desaturated grey-mauve; pigment
    // mixing must land in green (dominant G channel).
    const mixed = mixColorsWeighted([
      { hex: BLUE, parts: 1 },
      { hex: YELLOW, parts: 1 },
    ]);
    expect(mixed).not.toBeNull();
    const [r, g, b] = channels(mixed!);
    expect(g).toBeGreaterThan(r);
    expect(g).toBeGreaterThan(b);
  });

  it('depends on ratios, not absolute part counts', () => {
    const oneToOne = mixColorsWeighted([
      { hex: BLUE, parts: 1 },
      { hex: YELLOW, parts: 1 },
    ]);
    const threeToThree = mixColorsWeighted([
      { hex: BLUE, parts: 3 },
      { hex: YELLOW, parts: 3 },
    ]);
    expect(oneToOne).toBe(threeToThree);
  });

  it('ignores zero-part ingredients', () => {
    const withZero = mixColorsWeighted([
      { hex: BLUE, parts: 2 },
      { hex: YELLOW, parts: 0 },
    ]);
    const alone = mixColorsWeighted([{ hex: BLUE, parts: 2 }]);
    expect(withZero).toBe(alone);
  });

  it('returns the ingredient itself for a single-ingredient mix', () => {
    const mixed = mixColorsWeighted([{ hex: BLUE, parts: 5 }]);
    expect(mixed?.toLowerCase()).toBe(BLUE.toLowerCase());
  });

  it('returns null for empty or all-zero inputs', () => {
    expect(mixColorsWeighted([])).toBeNull();
    expect(mixColorsWeighted([{ hex: BLUE, parts: 0 }])).toBeNull();
  });
});

describe('pigment load (opacity-weighted mixing)', () => {
  it('a translucent paint contributes less colourant per part than an opaque one', () => {
    // citadel-flash-gitz-yellow has opacity_rating 0 (translucent);
    // army-painter-jb-sunburst-ochre has rating 3 (opaque). Mixing 1:1 with
    // load weighting must differ from the unweighted 1:1 of the same hexes,
    // pulled toward the opaque ingredient.
    const withLoads = mixColorsWeighted([
      { hex: '#f5b808', parts: 1, paintId: 'citadel-flash-gitz-yellow' },
      { hex: '#a85625', parts: 1, paintId: 'army-painter-jb-sunburst-ochre' },
    ]);
    const unweighted = mixColorsWeighted([
      { hex: '#f5b808', parts: 1 },
      { hex: '#a85625', parts: 1 },
    ]);
    expect(withLoads).not.toBeNull();
    expect(unweighted).not.toBeNull();
    expect(withLoads).not.toBe(unweighted);

    // Pulled toward the opaque ochre = closer to it than the unweighted mix.
    const de = differenceCiede2000();
    const ochre = toLab65('#a85625')!;
    expect(de(toLab65(withLoads!)!, ochre)).toBeLessThan(de(toLab65(unweighted!)!, ochre));
  });

  it('unknown paintIds fall back to neutral load (ratio-only mixing)', () => {
    const withUnknown = mixColorsWeighted([
      { hex: BLUE, parts: 1, paintId: 'not-a-real-paint' },
      { hex: YELLOW, parts: 1 },
    ]);
    const plain = mixColorsWeighted([
      { hex: BLUE, parts: 1 },
      { hex: YELLOW, parts: 1 },
    ]);
    expect(withUnknown).toBe(plain);
  });
});

describe('effectiveCoverage', () => {
  it('maps opaque mixes high and translucent mixes low', () => {
    const opaque = effectiveCoverage([
      { hex: '#a85625', parts: 1, paintId: 'army-painter-jb-sunburst-ochre' }, // rating 3
    ]);
    const glaze = effectiveCoverage([
      { hex: '#f5b808', parts: 1, paintId: 'citadel-flash-gitz-yellow' },      // rating 0
    ]);
    expect(opaque).toBeCloseTo(0.95, 2);
    expect(glaze).toBeCloseTo(0.45, 2);
    expect(effectiveCoverage([{ hex: BLUE, parts: 1 }])).toBeCloseTo(0.85, 2);
    expect(effectiveCoverage([])).toBeCloseTo(0.85, 2);
  });
});

describe('simulateBasecoat', () => {
  it('is the identity when paint and primer are the same colour', () => {
    expect(simulateBasecoat('#aa5533', '#aa5533').toLowerCase()).toBe('#aa5533');
  });

  it('darkens the paint over a black primer', () => {
    const over = simulateBasecoat('#c95f34', '#000000');
    const paintL = toLab65('#c95f34')!.l;
    const overL = toLab65(over)!.l;
    expect(overL).toBeLessThan(paintL);
  });

  it('lets more primer through at lower coverage', () => {
    // Over black primer: a glaze (low coverage) must sit darker than an
    // opaque coat (high coverage) of the same paint.
    const opaque = simulateBasecoat('#c95f34', '#000000', 0.95);
    const glaze = simulateBasecoat('#c95f34', '#000000', 0.45);
    expect(toLab65(glaze)!.l).toBeLessThan(toLab65(opaque)!.l);
  });
});

describe('findClosestPaint', () => {
  it('returns a well-formed match with ΔE and band', () => {
    const match = findClosestPaint('#c0392b');
    expect(match).not.toBeNull();
    expect(match!.name).toBeTruthy();
    expect(match!.brand).toBeTruthy();
    expect(Number(match!.delta_e)).toBeGreaterThanOrEqual(0);
    expect(['Identical', 'Excellent', 'Good', 'Acceptable', 'Poor'])
      .toContain(match!.band);
  });

  // Audit F9 (fixed in Phase 4): DB labs are D65 and must be tagged culori
  // mode 'lab65' — tagging them 'lab' (D50) applied a spurious chromatic
  // adaptation that corrupted every reported ΔE and flipped close matches.
  it('reports ~0 ΔE for a paint whose own hex is the target', () => {
    // Self-consistent against the live DB (values change when the ground
    // truth is re-sampled): pick a real non-metallic paint and search for
    // its own hex — the D65-consistent pipeline must report near-zero ΔE.
    // (Under the old 'lab' (D50) mislabel this reported ~1.8.)
    const paint = (paintsData as any[]).find(
      p => !p.metallic && p.lab && p.hex && p.paint_id.includes('pro-acryl'));
    expect(paint).toBeDefined();
    const match = findClosestPaint(paint.hex);
    expect(match).not.toBeNull();
    expect(Number(match!.delta_e)).toBeLessThan(0.6);
  });

  it('returns the true D65-nearest non-metallic paint', () => {
    // Self-validating ranking check: the returned paint must achieve the
    // MINIMUM D65 CIEDE2000 over the whole eligible pool — no magic
    // constants to rot when the DB is re-sampled. (The old D50 mislabel
    // returned measurably farther paints on close calls.)
    const target = toLab65('#2980b9')!;
    const match = findClosestPaint('#2980b9');
    expect(match).not.toBeNull();
    const de = deltaE;
    let minD = Infinity;
    for (const p of paintsData as any[]) {
      if (!p.lab || p.metallic) continue;
      const d = de(target, { mode: 'lab65', l: p.lab[0], a: p.lab[1], b: p.lab[2] } as any);
      if (d < minD) minD = d;
    }
    const got = de(target, {
      mode: 'lab65',
      l: (match as any).lab[0],
      a: (match as any).lab[1],
      b: (match as any).lab[2],
    } as any);
    expect(got).toBeCloseTo(minD, 6);
  });

  it('never matches a metallic paint — mixes are matte pigment simulations', () => {
    // Sweep a spread of targets incl. gold/silver-ish hexes; the metallic
    // gate must hold everywhere (same contract as the backend matcher).
    for (const hex of ['#d4af37', '#c0c0c0', '#b87333', '#8a6d1f']) {
      const match = findClosestPaint(hex);
      expect(match).not.toBeNull();
      expect((match as any).metallic).not.toBe(true);
    }
  });
});

describe('findTopAlternativeMatches', () => {
  it('returns at most one match per allowed brand, ordered by accuracy', () => {
    const results = findTopAlternativeMatches('#c0392b');
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(3);

    const allowed = ['Citadel', 'Vallejo', 'Army Painter'];
    const brands = results.map(r => r.brand);
    expect(new Set(brands).size).toBe(brands.length);
    for (const b of brands) expect(allowed).toContain(b);

    const des = results.map(r => Number(r.delta_e));
    const sorted = [...des].sort((a, b) => a - b);
    expect(des).toEqual(sorted);
  });
});
