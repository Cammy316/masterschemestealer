/**
 * Which brand should a recipe card open on?
 *
 * It used to open on Citadel, always — `useState<BrandKey>('citadel')`, decided
 * by position in a hard-coded array and never by how good the match was.
 *
 * MEASURED over 37 cards from the five real test photographs: **Citadel is
 * beaten on 28 of them (76%)**. Wins go Vallejo 15, Army Painter 13, Citadel 9.
 * When Citadel loses, the median improvement is **2.5 ΔE00** and the maximum is
 * **9.1**. That is not cosmetic — the band vocabulary is perfect <2 · close <5 ·
 * fair <10, so several cards cross a whole band:
 *
 *     pinkhorror2  Dark Grey   Citadel 7.6  -> Vallejo       1.8   (fair -> perfect)
 *     capturepink  Cyan        Citadel 10.2 -> Army Painter  1.1   (distant -> perfect)
 *     complex      Grey        Citadel 5.3  -> Vallejo       0.5
 *
 * WHY THE BASE SLOT AND NOTHING ELSE. The base is the only slot whose `deltaE`
 * is a genuine match distance. Highlight and shade are scored against a
 * *different* target than the one they were chosen for, so a correctly-derived
 * highlight scores ~12 by construction; and the wash no longer carries a score
 * at all (DEC-8) because it is picked by family archetype, not by colour.
 * Ranking on anything but the base would rank on a ramp-span measurement.
 *
 * This does not alter or hide a ΔE (invariant 10). Every brand remains one tap
 * away with its own number shown; only the tab that opens first changes.
 */

import type { PaintRecipe, BrandRecipe } from './types';

export type BrandKey =
  | 'citadel' | 'vallejo' | 'army_painter' | 'ak' | 'pro_acryl' | 'two_thin_coats';

/**
 * The brand whose BASE match is closest to the detected colour.
 *
 * `candidates` is the ordered list of brands actually offered by this card
 * (premium brands are filtered out upstream). Order is the tie-break, so an
 * exact tie keeps today's behaviour rather than shuffling between renders.
 *
 * Returns `candidates[0]` when nothing can be ranked — an empty recipe, or a
 * scan old enough to carry no `deltaE` at all. Never returns a brand that is
 * not in `candidates`.
 */
export function bestBrandFor(
  recipe: PaintRecipe | undefined,
  candidates: readonly BrandKey[]
): BrandKey | undefined {
  if (!candidates.length) return undefined;

  let best: BrandKey | undefined;
  let bestDelta = Infinity;

  for (const key of candidates) {
    const brand: BrandRecipe | undefined = recipe?.[key];
    const delta = brand?.base?.deltaE;
    // Strictly less-than, so the first candidate wins a tie.
    if (typeof delta === 'number' && Number.isFinite(delta) && delta < bestDelta) {
      bestDelta = delta;
      best = key;
    }
  }

  return best ?? candidates[0];
}
