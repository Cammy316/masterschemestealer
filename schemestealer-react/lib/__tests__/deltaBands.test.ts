/**
 * O-F2 / ledger L6 — one ΔE band vocabulary across the product.
 *
 * `PaintRecipeCard.deltaQuality` used its own scale — `≤5 excellent · ≤15 loose ·
 * >15 poor` — against the fixed project vocabulary `perfect <2 · close <5 ·
 * fair <10 · distant ≤30`. Measured in the audit: **0 of 300,001 grid points
 * across ΔE 0–30 share a word**, and at exactly 5.0 the spec says "fair" while
 * the card said "excellent". The card is the surface every scan renders, so the
 * two vocabularies met the same user.
 *
 * The thresholds here mirror `python-api/scripts/build_conversions.py:17-26`
 * exactly — the data skill names it the reference implementation, and it is what
 * generated every `band` in `lib/data/conversions.json`. That fixes the
 * boundaries as STRICT `<`: ΔE exactly 2.0 is `close`, not `perfect`.
 *
 * Known divergence, deliberately left alone: `lib/reveal/revealCompose.ts`'s
 * `deltaBandName` uses the same words with `≤` boundaries, so it disagrees at
 * exactly 2.0 / 5.0 / 10.0. `lib/reveal/` is an explicit non-goal of the colour
 * audit (CONTEXT_LEDGER §4) and is not touched here.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { deltaBand, DELTA_BAND_WORD, shouldShowDeltaBadge } from '../deltaE';
import type { DeltaBand } from '../deltaE';

/**
 * The boundary table. Every row above sits on or one step below a threshold, so
 * an off-by-one in either direction moves at least one row.
 *
 * Every one of these rows fails on the parent commit: the card answered
 * `excellent` for everything through 5.0, so even ΔE 0 disagreed on the word.
 * (The plan says "fails on every row above 2.0"; that understates it, and
 * MERGED's "0 of 300,001 points share a word" is the accurate version.)
 */
const BOUNDARY_TABLE: Array<[number, DeltaBand]> = [
  [0, 'perfect'],
  [1.9, 'perfect'],
  [2.0, 'close'],
  [4.9, 'close'],
  [5.0, 'fair'],
  [9.9, 'fair'],
  [10.0, 'distant'],
  [30.0, 'distant'],
  [30.1, 'none'],
];

describe('deltaBand', () => {
  it.each(BOUNDARY_TABLE)('ΔE %s is "%s"', (deltaE, expected) => {
    expect(deltaBand(deltaE)).toBe(expected);
  });

  it('matches the Python reference implementation at every boundary', () => {
    // build_conversions.get_band: <2 perfect, <5 close, <10 fair, <=30 distant,
    // else none. What would make this fail: relaxing any bound to `<=`, which
    // would move 2.0, 5.0 and 10.0 one band better and re-open the drift this
    // commit closes.
    expect(deltaBand(1.999999)).toBe('perfect');
    expect(deltaBand(2)).toBe('close');
    expect(deltaBand(4.999999)).toBe('close');
    expect(deltaBand(5)).toBe('fair');
    expect(deltaBand(9.999999)).toBe('fair');
    expect(deltaBand(10)).toBe('distant');
    expect(deltaBand(30)).toBe('distant');
    expect(deltaBand(30.000001)).toBe('none');
  });

  it('gives every band exactly one word', () => {
    // What would make this fail: a consumer inventing a synonym. The words are
    // the vocabulary; hard invariant 10 fixes them.
    expect(DELTA_BAND_WORD).toEqual({
      perfect: 'perfect',
      close: 'close',
      fair: 'fair',
      distant: 'distant',
      none: 'no match',
    });
  });
});

describe('shouldShowDeltaBadge — the base-only gate (O-F4)', () => {
  /**
   * The gate is NOT a bug, and this is the test that stops someone "finishing"
   * the vocabulary fix by un-gating it.
   *
   * All four slots carry a numeric `deltaE` computed against the same
   * `color_lab` — the cluster's own colour — but `derive_partner` deliberately
   * ranks shade and highlight against a DIFFERENT target
   * (`recipe_geometry.py:314`). So the non-base number is a ramp-span
   * measurement, not a match distance. Over 1,644 real recipe slots the medians
   * are base 5.60, shade 13.45, highlight 12.85, wash 26.25 — 35% of shades,
   * 33% of highlights and 81% of washes would render as failures. Showing the
   * badge there misreports correctly-derived recipes: a harder breach of
   * invariant 10 than the current gate.
   *
   * What would make this fail: returning true for any non-base step.
   */
  it.each([
    ['base', 5.6, true],
    ['shade', 13.45, false],
    ['highlight', 12.85, false],
    ['wash', 26.25, false],
  ] as Array<[string, number, boolean]>)(
    '%s slot at ΔE %s → %s',
    (stepKey, deltaE, expected) => {
      expect(shouldShowDeltaBadge(stepKey, deltaE)).toBe(expected);
    },
  );

  it('hides the badge when there is no measurement to show', () => {
    // A slot with no ΔE must render no badge rather than a zero.
    expect(shouldShowDeltaBadge('base', undefined)).toBe(false);
  });
});

describe('the card and the SEO badge share one vocabulary', () => {
  const read = (rel: string) =>
    readFileSync(join(__dirname, '..', '..', rel), 'utf8');

  it('the recipe card no longer carries its own band words', () => {
    /**
     * Vitest runs in a node environment with no DOM, so the badge cannot be
     * asserted by rendering without adding a dependency this plan forbids. The
     * source is the next-best witness, and it fails on the parent commit, where
     * `deltaQuality` returns 'excellent' / 'loose' / 'poor' literals.
     */
    const source = read('components/shared/PaintRecipeCard.tsx');
    for (const dead of ["'excellent'", "'loose'", "'poor'"]) {
      expect(source).not.toContain(dead);
    }
  });

  it('both surfaces import the shared helper rather than re-deriving bands', () => {
    // What would make this fail: either component growing its own threshold
    // ladder again, which is exactly how these two drifted apart.
    expect(read('components/shared/PaintRecipeCard.tsx')).toMatch(
      /import[^;]*deltaBand[^;]*from '@\/lib\/deltaE'/,
    );
    expect(read('components/seo/DeltaEBadge.tsx')).toMatch(
      /import[^;]*DELTA_BAND_WORD[^;]*from '@\/lib\/deltaE'/,
    );
  });

  it('the badge covers every band the vocabulary defines', () => {
    // Including `none`. The parent commit had no `none` case and its `default`
    // branch rendered an unrecognised band as "DISTANT MATCH" — an assertion
    // that the paint is within the ΔE 30 ceiling, which `none` means it is not.
    const source = read('components/seo/DeltaEBadge.tsx');
    for (const band of Object.keys(DELTA_BAND_WORD)) {
      expect(source).toContain(`case '${band}'`);
    }
  });
});
