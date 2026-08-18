/**
 * Delta-E Color Difference — thin adapter over culori.
 *
 * The frontend previously shipped its OWN hand-rolled CIEDE2000 next to the
 * culori one used by the Forge (audit F2: three CIEDE2000 implementations
 * across the stack). This module now delegates to culori so exactly one
 * implementation exists on the frontend; the interface is unchanged for
 * consumers (offlineColorDetection, paintMatcher, colorClustering).
 *
 * Inputs are CIELAB **D65** triples (colorConversion.ts mirrors the backend's
 * skimage D65 conversion), so they are tagged culori mode 'lab65' — never
 * 'lab', which is D50 per CSS Color 4 and silently applies a chromatic
 * adaptation (audit F9). Cross-stack agreement with the backend's skimage
 * CIEDE2000 is pinned by tests/parity.test.ts.
 *
 * Delta-E scale:
 * - 0-1: Not perceptible by human eyes
 * - 1-2: Perceptible through close observation
 * - 2-10: Perceptible at a glance
 * - 11-49: Colors are more similar than opposite
 * - 50+: Colors are very different
 */

import { differenceCiede2000 } from 'culori';
import type { LAB } from './colorConversion';

const ciede2000 = differenceCiede2000();

function asLab65(lab: LAB) {
  return { mode: 'lab65' as const, l: lab.l, a: lab.a, b: lab.b };
}

/**
 * The project's fixed match-quality vocabulary. Hard invariant 10: the bands are
 * `perfect <2 · close <5 · fair <10 · distant ≤30`, and a ΔE is never altered or
 * hidden. `none` is the honest fifth state — beyond the matcher's ΔE 30 ceiling
 * there is no match to describe.
 */
export type DeltaBand = 'perfect' | 'close' | 'fair' | 'distant' | 'none';

/** One word per band. The single place the vocabulary is spelled. */
export const DELTA_BAND_WORD: Record<DeltaBand, string> = {
  perfect: 'perfect',
  close: 'close',
  fair: 'fair',
  distant: 'distant',
  none: 'no match',
};

/**
 * ΔE → band. A faithful mirror of `python-api/scripts/build_conversions.py:17-26`,
 * which generated every `band` already shipped in `lib/data/conversions.json`;
 * matching it is what lets a computed band and a pre-computed one sit side by
 * side on a page. The bounds are strict `<`, so ΔE exactly 2.0 is `close`.
 *
 * This is arithmetic over an already-computed ΔE, not a colour-space conversion
 * — invariant 9 is untouched.
 */
export function deltaBand(deltaE: number): DeltaBand {
  if (deltaE < 2) return 'perfect';
  if (deltaE < 5) return 'close';
  if (deltaE < 10) return 'fair';
  if (deltaE <= 30) return 'distant';
  return 'none';
}

/**
 * Whether a recipe slot may show a ΔE badge. **Base only, deliberately.**
 *
 * Every slot carries a `deltaE` computed against the cluster's own colour, but
 * `derive_partner` ranks shade and highlight against a *different* target
 * (`recipe_geometry.py:314`), so outside the base slot the number measures the
 * span of the ramp, not the distance to a match. Over 1,644 real slots the
 * medians are base 5.60, shade 13.45, highlight 12.85, wash 26.25 — badging them
 * would report 35% of correctly-derived shades and 81% of correctly-derived
 * washes as failures. That is a worse breach of invariant 10 than showing
 * nothing, which is why the gate is a feature and not an oversight (O-F4).
 */
export function shouldShowDeltaBadge(stepKey: string, deltaE: number | undefined): boolean {
  return deltaE !== undefined && stepKey === 'base';
}

/**
 * Delta-E 76 (CIE76) — Euclidean distance in LAB. Fast screening metric.
 */
export function deltaE76(lab1: LAB, lab2: LAB): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;

  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Delta-E 2000 (CIEDE2000) via culori — the single frontend implementation.
 */
export function deltaE2000(lab1: LAB, lab2: LAB): number {
  return ciede2000(asLab65(lab1), asLab65(lab2));
}

/**
 * Find N closest colors from a palette
 */
export function findNClosestColors<T extends { lab: LAB }>(
  targetLab: LAB,
  palette: T[],
  n: number,
  useCIE2000: boolean = true
): Array<{ color: T; deltaE: number }> {
  if (palette.length === 0 || n <= 0) return [];

  // Calculate delta-E for all colors
  const results = palette.map((color) => ({
    color,
    deltaE: useCIE2000 ? deltaE2000(targetLab, color.lab) : deltaE76(targetLab, color.lab),
  }));

  // Sort by delta-E and return top N
  return results.sort((a, b) => a.deltaE - b.deltaE).slice(0, n);
}
