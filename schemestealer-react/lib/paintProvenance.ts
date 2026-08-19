/**
 * Paint colour provenance — display gates (DEC-2).
 *
 * 1,216 of the 1,312 paints carry `color_source: 'swatch-median'` — a region
 * median of a physically photographed swatch. The remaining 96 washes, shades
 * and inks carry `'assumed'`: their LAB was never measured at all. They are not
 * even 96 independent estimates — 12 hex values are each carried by 2+ assumed
 * records, covering 68 of the 96 (71%), with `#63493c` shared by 17 paints
 * across four brands.
 *
 * Showing an estimated colour with the same confidence as a measured one is the
 * quiet version of the spectrophotometer claim the project explicitly calls
 * false. Marking it QUALIFIES the recommendation; it does not alter or hide a
 * ΔE (hard invariant 10), and the recipe itself is unchanged.
 *
 * A separate module rather than a line inside the card, for the reason below:
 * the rule is easy to get subtly wrong and the wrong version is invisible.
 */

/**
 * Should the "Estimated colour" marker render for this paint?
 *
 * Keyed on provenance and DELIBERATELY NOT on the slot being the wash. Every
 * assumed record in the database today is a wash/shade/ink, so a
 * `category`-keyed rule would agree with this one on all 1,312 paints — right
 * by accident. It stops being right the moment a single wash is measured, which
 * is precisely what the accuracy roadmap intends to do: a category rule would
 * then label a genuinely measured wash "estimated" forever, and would miss any
 * future assumed base entirely. `python-api/tests/test_served_provenance.py`
 * pins that equivalence as a coincidence so nothing comes to depend on it.
 *
 * Absent provenance returns false, not true. The offline path
 * (`lib/paintDatabase.ts`) ships no `color_source` field, so an offline recipe
 * renders no marker rather than marking everything — an unknown provenance is
 * not evidence of an estimate, and claiming otherwise would put the marker on
 * all four slots of every offline scan.
 */
export function shouldShowEstimatedColour(colorSource: string | undefined): boolean {
  return colorSource === 'assumed';
}

/** The marker's copy, in one place so the chip and its tooltip cannot drift. */
export const ESTIMATED_COLOUR_LABEL = 'Estimated colour';
export const ESTIMATED_COLOUR_TOOLTIP =
  "This paint's colour is estimated, not measured from a swatch — treat the match as indicative.";
