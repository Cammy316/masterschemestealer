/**
 * C4.2 / O-D5 — the offline matcher must not serve a metallic paint for a matte target.
 *
 * The backend excludes metallics outright when the scan has not flagged the cluster
 * metallic (`python-api/core/color_engine.py:542`, `role not in ('shade','wash') and
 * not flagged_metallic`). The offline path had no such exclusion, so it served a metal
 * for a matte target in 5.61% of rows (MERGED O-D5). The science half of that finding
 * matters more than the rate: metallics are gonio-apparent, so a single diffuse LAB is
 * not commensurable with a matte target's — the online exclusion is correct colour
 * science and the offline omission is a real defect.
 *
 * `offlineColorDetection.ts:63` classifies with `isMetallic = false` unconditionally, so
 * nothing on the offline scan path ever has a metallic target; the `allowMetallic` flag
 * exists so a caller that genuinely wants metals can still ask, and so this file can
 * prove the exclusion is a filter and not a deletion.
 *
 * TWO DIVERGENCES FROM THE BACKEND, recorded rather than papered over:
 *   1. `getRecipeForColor` uses ONE `basePaints` pool for base, highlight AND shade,
 *      while the backend excludes metallics only for roles not in ('shade','wash'). A
 *      blanket filter therefore also removes metals from the offline SHADE slot. Low
 *      harm, arguably better; not asserted here, so mirroring the backend later does
 *      not have to fight a test.
 *   2. Offline `findClosestPaint` has no "different from the base" constraint (the
 *      backend's `recipe_geometry.is_eligible` does), so on Citadel mid-grey the base
 *      and highlight slots now resolve to the SAME paint, where before the filter they
 *      differed only by being two different metals. Pre-existing; exposed by this
 *      commit, not caused by it.
 *
 * Out of scope and deliberately untouched: `findPaintsByNameOrAlias` (the genuine
 * browse path) and The Forge, which uses `lib/colorMath.ts` over
 * `lib/data/paints_groundtruth.json`.
 */
import { describe, it, expect } from 'vitest';
import {
  getRecipeForColor,
  getMultiBrandMatches,
  findPaintsByNameOrAlias,
} from '../paintMatcher';
import { getPaintDatabase } from '../paintDatabase';

/** Is the paint this slot named a curated metallic in the shipped DB? */
function isMetallic(name: string | undefined, brand: string): boolean {
  if (!name) return false;
  return getPaintDatabase().some(
    (p) => p.name === name && p.brand.toLowerCase() === brand.toLowerCase() && p.metallic
  );
}

/** A mid grey. Pinned because it is MEASURED to return metals today, not because it
 *  looks neutral: Citadel's nearest base/layer/air paint to it is Leadbelcher. */
const MID_GREY: [number, number, number] = [50, 0, 0];

/** A dark warm-neutral. Vallejo's nearest paint to it today is Metal Color Steel. */
const DARK_NEUTRAL: [number, number, number] = [30, 2, 0];

describe('offline metallic exclusion (O-D5)', () => {
  it('does not serve a metallic base for a matte mid grey', () => {
    // FAILS IF: the filter is removed, or applied only to findTopMatches —
    // getRecipeForColor goes through findClosestPaint, which is a separate function.
    // Before this commit the answer here was Leadbelcher, a curated metallic.
    const recipe = getRecipeForColor(MID_GREY, 'grey', 'citadel');
    expect(recipe.base).not.toBeNull();
    expect(isMetallic(recipe.base?.name, 'Citadel')).toBe(false);
  });

  it('does not serve a metallic highlight for a matte mid grey', () => {
    // The highlight slot searches a +12 L* target through the same pool. Before this
    // commit it returned Ironbreaker — a second metallic on the same matte surface.
    // FAILS IF: the pool passed to the highlight lookup is not filtered.
    const recipe = getRecipeForColor(MID_GREY, 'grey', 'citadel');
    expect(recipe.highlight).not.toBeNull();
    expect(isMetallic(recipe.highlight?.name, 'Citadel')).toBe(false);
  });

  it('does not serve metallics in the offline scan multi-brand matches', () => {
    // getMultiBrandMatches is NOT a browse path: its only caller is
    // enhanceWithMultiBrandMatches, whose only caller is the offline scan at
    // hooks/useScan.ts:148. Before this commit DARK_NEUTRAL returned Metal Color
    // Steel for Vallejo and Heavy Metal for Army Painter.
    // FAILS IF: the three brand pools are filtered but the ranking is not, or if the
    // filter is applied to only one of the three.
    const matches = getMultiBrandMatches(DARK_NEUTRAL, 3);
    for (const [brand, list] of [
      ['Citadel', matches.citadel],
      ['Vallejo', matches.vallejo],
      ['Army Painter', matches.armyPainter],
    ] as const) {
      expect(list.length).toBeGreaterThan(0);
      for (const paint of list) {
        expect(isMetallic(paint.name, brand)).toBe(false);
      }
    }
  });

  it('still returns a metal when the caller explicitly asks for one', () => {
    // The exclusion must be a FILTER on a pool, not a deletion from the database.
    // FAILS IF: the flag is ignored, or the filter is hard-coded rather than
    // conditioned on it. This asserts the behaviour that existed for every caller
    // before the commit, now reachable only on request.
    const recipe = getRecipeForColor(MID_GREY, 'grey', 'citadel', true);
    expect(recipe.base?.name).toBe('Leadbelcher');
    expect(isMetallic(recipe.base?.name, 'Citadel')).toBe(true);
  });

  it('leaves the name/alias browse path able to find a metallic', () => {
    // The genuine browse path must still surface metals — a painter searching for
    // Leadbelcher wants Leadbelcher.
    // FAILS IF: anyone "fixes" O-D5 by filtering getPaintDatabase() globally.
    const hits = findPaintsByNameOrAlias('Leadbelcher');
    expect(hits.some((p) => p.paint_id === 'citadel-leadbelcher' && p.metallic)).toBe(true);
  });
});
