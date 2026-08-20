/**
 * The recipe card must open on the brand that actually matches best.
 *
 * It opened on Citadel unconditionally — array position, not match quality.
 * Measured over 37 cards from the five real test photographs, Citadel is beaten
 * on 28 of them (76%), median 2.5 ΔE00, max 9.1, with several crossing a whole
 * band of the fixed vocabulary. The real cases below are taken from that run.
 */

import { describe, it, expect } from 'vitest';
import { bestBrandFor, type BrandKey } from '../brandRanking';
import type { PaintRecipe, BrandRecipe } from '../types';

const VISIBLE: BrandKey[] = ['citadel', 'vallejo', 'army_painter'];

/** A recipe carrying only what the ranking reads: the base slot's deltaE. */
function recipe(deltas: Partial<Record<BrandKey, number | undefined>>): PaintRecipe {
  const slot = (d: number | undefined): BrandRecipe => ({
    base: d === undefined ? null : { name: 'x', hex: '#000000', type: 'base', deltaE: d },
    shade: null, highlight: null, wash: null,
  });
  return {
    citadel: slot(deltas.citadel),
    vallejo: slot(deltas.vallejo),
    army_painter: slot(deltas.army_painter),
  } as PaintRecipe;
}

describe('bestBrandFor', () => {
  it('picks the closest base match, not the first brand in the list', () => {
    // pinkhorror2 Dark Grey, measured: Citadel 7.6 / Vallejo 1.8 / AP 4.0.
    // Citadel would read "fair", Vallejo "perfect" — a whole band.
    //
    // FAILS IF: the ranking is removed and the card reverts to Citadel-first.
    expect(bestBrandFor(recipe({ citadel: 7.6, vallejo: 1.8, army_painter: 4.0 }), VISIBLE))
      .toBe('vallejo');
  });

  it('picks Army Painter when Army Painter wins', () => {
    // capturepink Cyan, measured: Citadel 10.2 / Vallejo 5.1 / AP 1.1 —
    // distant vs perfect. Included so the test cannot pass by always
    // returning Vallejo.
    expect(bestBrandFor(recipe({ citadel: 10.2, vallejo: 5.1, army_painter: 1.1 }), VISIBLE))
      .toBe('army_painter');
  });

  it('still picks Citadel when Citadel genuinely wins', () => {
    // complex.PNG Black, measured: Citadel 1.2 / Vallejo 3.8 / AP 7.6.
    //
    // FAILS IF: someone "fixes" the old bias by inverting it and always
    // avoiding Citadel. It wins 9 of 37 cards and must keep them.
    expect(bestBrandFor(recipe({ citadel: 1.2, vallejo: 3.8, army_painter: 7.6 }), VISIBLE))
      .toBe('citadel');
  });

  it('breaks an exact tie by candidate order, so renders are stable', () => {
    // FAILS IF: the comparison becomes `<=`, which would make the LAST tied
    // brand win and could flip between renders on equal data.
    expect(bestBrandFor(recipe({ citadel: 4.0, vallejo: 4.0, army_painter: 4.0 }), VISIBLE))
      .toBe('citadel');
  });

  it('ignores brands with no base match at all', () => {
    // A brand can return null when its gated pool is empty. It must not be
    // ranked as if it scored zero.
    //
    // FAILS IF: a missing base is coerced to 0 — the classic `?? 0` bug, which
    // would make the WORST brand always win.
    expect(bestBrandFor(recipe({ citadel: 6.0, vallejo: undefined, army_painter: 9.0 }), VISIBLE))
      .toBe('citadel');
  });

  it('never returns a brand outside the offered list', () => {
    // Premium brands are filtered out upstream; the card cannot render a tab
    // for a brand it was not given.
    //
    // FAILS IF: the search runs over the recipe's keys instead of the
    // candidates — AK would win here and the card would have no tab for it.
    const withPremium = {
      ...recipe({ citadel: 6.0, vallejo: 7.0, army_painter: 8.0 }),
      ak: { base: { name: 'ak', hex: '#000000', type: 'base', deltaE: 0.1 },
            shade: null, highlight: null, wash: null },
    } as PaintRecipe;
    expect(bestBrandFor(withPremium, VISIBLE)).toBe('citadel');
  });

  it('falls back to the first candidate when nothing is rankable', () => {
    // Old scans carry no deltaE. The card must still open on something.
    //
    // FAILS IF: it returns undefined and the card renders an empty tab.
    expect(bestBrandFor(recipe({}), VISIBLE)).toBe('citadel');
    expect(bestBrandFor(undefined, VISIBLE)).toBe('citadel');
  });

  it('returns undefined only when there are no candidates', () => {
    expect(bestBrandFor(recipe({ citadel: 1 }), [])).toBeUndefined();
  });

  it('ignores a non-finite score rather than ranking it best', () => {
    // FAILS IF: NaN slips through the comparison. `NaN < Infinity` is false so
    // it cannot win by accident, but an explicit guard means a future refactor
    // to `sort()` cannot regress it silently.
    expect(bestBrandFor(recipe({ citadel: 5.0, vallejo: NaN, army_painter: 8.0 }), VISIBLE))
      .toBe('citadel');
  });
});
