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
