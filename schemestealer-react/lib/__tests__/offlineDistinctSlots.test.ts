/**
 * DEC-11 — offline, the highlight and shade must not be the base paint again.
 *
 * The backend has this rule and the offline path did not. `recipe_geometry`'s
 * `is_eligible` rejects a candidate whose `to_node.paint_id` equals the base's
 * `from_node.paint_id`, so a served recipe can never tell you to highlight a
 * paint with itself. Offline, `findClosestPaint` was given only a lightness
 * predicate — `(p) => p.lab.l > baseL` for the highlight, `< baseL` for the
 * shade — where `baseL` is the L* of the TARGET colour, not of the chosen base
 * paint. The base is whatever sits nearest the target; the highlight is whatever
 * sits nearest target+12 among paints lighter than the target. Nothing stops
 * those being the same paint, and on real brand pools they sometimes are.
 *
 * MEASURED before this commit (Citadel/Vallejo/Army Painter, neutral axis
 * L*15–90 at unit steps, 228 recipes per slot):
 *   highlight collapses onto the base   5 / 228  (2.2%)
 *   shade collapses onto the base       4 / 228  (1.8%)
 * Named cases: Citadel LAB [50,0,0] returns "Administra- tum Grey" for BOTH base
 * and highlight; Citadel LAB [30,2,0] returns "Skavenblight Dinge" for BOTH base
 * and shade. Both are recipes that tell the painter to do nothing.
 *
 * This is pre-existing, and C4.2 exposed it rather than causing it — before the
 * metallic filter the Citadel mid-grey pair returned two different METALS, which
 * was worse advice that merely looked like a recipe (recorded as divergence 2 in
 * `offlineMetallicExclusion.test.ts`).
 *
 * NOT a monotonicity test. `recipeMonotonicity.test.ts` covers the documented M5
 * gap (a "highlight" that is not actually lighter) and is untouched; this file
 * covers identity only.
 */

import { describe, it, expect } from 'vitest';
import { getRecipeForColor } from '../paintMatcher';

const BRANDS = ['citadel', 'vallejo', 'army-painter'] as const;

describe('DEC-11 — offline recipe slots are distinct paints', () => {
  it('does not return the base paint as its own highlight (Citadel mid grey)', () => {
    // The measured exemplar. FAILS IF the constraint is removed: before this
    // commit both slots read "Administra- tum Grey".
    const r = getRecipeForColor([50, 0, 0], 'grey', 'citadel');

    expect(r.base).not.toBeNull();
    expect(r.highlight).not.toBeNull();
    expect(r.highlight!.name).not.toBe(r.base!.name);

    // C4.2's exclusion must still hold — this fix must not readmit metals as
    // the escape hatch from the collision.
    expect(r.base!.name).not.toMatch(/leadbelcher|ironbreaker|runefang/i);
    expect(r.highlight!.name).not.toMatch(/leadbelcher|ironbreaker|runefang/i);
  });

  it('does not return the base paint as its own shade (Citadel dark neutral)', () => {
    // The second measured exemplar, which the DEC-11 brief did not name — the
    // collapse is not highlight-only. FAILS IF the constraint is applied to the
    // highlight slot alone: before this commit both slots read "Skavenblight
    // Dinge".
    const r = getRecipeForColor([30, 2, 0], 'grey', 'citadel');

    expect(r.base).not.toBeNull();
    expect(r.shade).not.toBeNull();
    expect(r.shade!.name).not.toBe(r.base!.name);
  });

  it('never repeats the base in either partner slot along the neutral axis', () => {
    // The population test. The neutral axis is where brand pools are densest and
    // the collision is therefore most likely; 228 recipes per slot per the
    // measurement above.
    //
    // FAILS IF: the constraint is dropped (9 collisions return), or applied to
    // only one of the two slots (4 or 5 return). A single collision fails it.
    const collisions: string[] = [];

    for (const brand of BRANDS) {
      for (let L = 15; L <= 90; L += 1) {
        const r = getRecipeForColor([L, 0, 0], 'grey', brand);
        if (r.base && r.highlight && r.highlight.name === r.base.name) {
          collisions.push(`${brand} L*${L} highlight=${r.base.name}`);
        }
        if (r.base && r.shade && r.shade.name === r.base.name) {
          collisions.push(`${brand} L*${L} shade=${r.base.name}`);
        }
      }
    }

    expect(collisions, `offline recipe repeats the base paint:\n${collisions.join('\n')}`)
      .toEqual([]);
  });

  it('still fills both partner slots — the constraint filters, it does not delete', () => {
    // The counterpart guard. Excluding one paint from a pool of hundreds must
    // not turn a populated slot into an honest empty.
    //
    // FAILS IF: the exclusion is implemented as "return null on collision"
    // instead of "pick the next-best eligible paint". That would silently strip
    // ~2% of offline highlights and be invisible to the collision test above.
    let filled = 0;
    let total = 0;
    for (const brand of BRANDS) {
      for (let L = 25; L <= 80; L += 5) {
        const r = getRecipeForColor([L, 0, 0], 'grey', brand);
        total += 2;
        if (r.highlight) filled += 1;
        if (r.shade) filled += 1;
      }
    }
    // Not 100%: at the extremes of a brand's lightness range there genuinely is
    // no lighter (or darker) paint, and returning null there is correct.
    expect(filled / total).toBeGreaterThan(0.9);
  });
});
