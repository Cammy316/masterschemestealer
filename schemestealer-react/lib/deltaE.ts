/**
 * Delta-E Color Difference Calculations
 * Measures perceptual color difference between two colors
 *
 * Delta-E scale:
 * - 0-1: Not perceptible by human eyes
 * - 1-2: Perceptible through close observation
 * - 2-10: Perceptible at a glance
 * - 11-49: Colors are more similar than opposite
 * - 50+: Colors are very different
 */

import type { LAB } from './colorConversion';

/**
 * Delta-E 76 (CIE76)
 * Simple Euclidean distance in LAB space
 * Fast but less accurate than CIE2000
 */
export function deltaE76(lab1: LAB, lab2: LAB): number {
  const dL = lab1.l - lab2.l;
  const da = lab1.a - lab2.a;
  const db = lab1.b - lab2.b;

  return Math.sqrt(dL * dL + da * da + db * db);
}

/**
 * Delta-E 2000 (CIEDE2000)
 * Most accurate perceptually uniform color difference
 * Accounts for non-uniformities in LAB space
 */
export function deltaE2000(lab1: LAB, lab2: LAB): number {
  // Parametric weighting factors
  const kL = 1.0;
  const kC = 1.0;
  const kH = 1.0;

  // Calculate C1, C2 (chroma)
  const c1 = Math.sqrt(lab1.a * lab1.a + lab1.b * lab1.b);
  const c2 = Math.sqrt(lab2.a * lab2.a + lab2.b * lab2.b);

  // Calculate mean chroma
  const cMean = (c1 + c2) / 2;

  // Calculate G for a' adjustment
  const g = 0.5 * (1 - Math.sqrt(Math.pow(cMean, 7) / (Math.pow(cMean, 7) + Math.pow(25, 7))));

  // Calculate adjusted a' values
  const a1Prime = (1 + g) * lab1.a;
  const a2Prime = (1 + g) * lab2.a;

  // Calculate adjusted C' values
  const c1Prime = Math.sqrt(a1Prime * a1Prime + lab1.b * lab1.b);
  const c2Prime = Math.sqrt(a2Prime * a2Prime + lab2.b * lab2.b);

  // Calculate adjusted h' values
  let h1Prime = 0;
  if (lab1.b !== 0 || a1Prime !== 0) {
    h1Prime = Math.atan2(lab1.b, a1Prime);
    if (h1Prime < 0) h1Prime += 2 * Math.PI;
  }

  let h2Prime = 0;
  if (lab2.b !== 0 || a2Prime !== 0) {
    h2Prime = Math.atan2(lab2.b, a2Prime);
    if (h2Prime < 0) h2Prime += 2 * Math.PI;
  }

  // Convert to degrees
  h1Prime = (h1Prime * 180) / Math.PI;
  h2Prime = (h2Prime * 180) / Math.PI;

  // Calculate delta values
  const deltaLPrime = lab2.l - lab1.l;
  const deltaCPrime = c2Prime - c1Prime;

  // Calculate deltaHPrime
  let deltahPrime = 0;
  if (c1Prime * c2Prime !== 0) {
    deltahPrime = h2Prime - h1Prime;
    if (deltahPrime > 180) {
      deltahPrime -= 360;
    } else if (deltahPrime < -180) {
      deltahPrime += 360;
    }
  }

  const deltaHPrime = 2 * Math.sqrt(c1Prime * c2Prime) * Math.sin((deltahPrime * Math.PI) / 360);

  // Calculate mean values
  const lMeanPrime = (lab1.l + lab2.l) / 2;
  const cMeanPrime = (c1Prime + c2Prime) / 2;

  let hMeanPrime = 0;
  if (c1Prime * c2Prime !== 0) {
    hMeanPrime = (h1Prime + h2Prime) / 2;
    if (Math.abs(h1Prime - h2Prime) > 180) {
      if (hMeanPrime < 180) {
        hMeanPrime += 180;
      } else {
        hMeanPrime -= 180;
      }
    }
  }

  // Calculate T
  const t =
    1 -
    0.17 * Math.cos(((hMeanPrime - 30) * Math.PI) / 180) +
    0.24 * Math.cos((2 * hMeanPrime * Math.PI) / 180) +
    0.32 * Math.cos(((3 * hMeanPrime + 6) * Math.PI) / 180) -
    0.20 * Math.cos(((4 * hMeanPrime - 63) * Math.PI) / 180);

  // Calculate SL, SC, SH
  const sL = 1 + (0.015 * (lMeanPrime - 50) * (lMeanPrime - 50)) / Math.sqrt(20 + (lMeanPrime - 50) * (lMeanPrime - 50));

  const sC = 1 + 0.045 * cMeanPrime;

  const sH = 1 + 0.015 * cMeanPrime * t;

  // Calculate RT (rotation term)
  const deltaTheta = 30 * Math.exp(-Math.pow((hMeanPrime - 275) / 25, 2));
  const rC = 2 * Math.sqrt(Math.pow(cMeanPrime, 7) / (Math.pow(cMeanPrime, 7) + Math.pow(25, 7)));
  const rT = -rC * Math.sin((2 * deltaTheta * Math.PI) / 180);

  // Calculate final delta-E
  const deltaE =
    Math.sqrt(
      Math.pow(deltaLPrime / (kL * sL), 2) +
      Math.pow(deltaCPrime / (kC * sC), 2) +
      Math.pow(deltaHPrime / (kH * sH), 2) +
      rT * (deltaCPrime / (kC * sC)) * (deltaHPrime / (kH * sH))
    );

  return deltaE;
}

/**
 * Find closest color from a palette
 * Returns the closest color and its delta-E distance
 */
export function findClosestColor(
  targetLab: LAB,
  palette: Array<{ lab: LAB; [key: string]: any }>,
  useCIE2000: boolean = true
): { color: any; deltaE: number } | null {
  if (palette.length === 0) return null;

  let closestColor = palette[0];
  let minDeltaE = useCIE2000
    ? deltaE2000(targetLab, palette[0].lab)
    : deltaE76(targetLab, palette[0].lab);

  for (let i = 1; i < palette.length; i++) {
    const deltaE = useCIE2000
      ? deltaE2000(targetLab, palette[i].lab)
      : deltaE76(targetLab, palette[i].lab);

    if (deltaE < minDeltaE) {
      minDeltaE = deltaE;
      closestColor = palette[i];
    }
  }

  return { color: closestColor, deltaE: minDeltaE };
}

/**
 * Find N closest colors from a palette
 */
export function findNClosestColors(
  targetLab: LAB,
  palette: Array<{ lab: LAB; [key: string]: any }>,
  n: number,
  useCIE2000: boolean = true
): Array<{ color: any; deltaE: number }> {
  if (palette.length === 0 || n <= 0) return [];

  // Calculate delta-E for all colors
  const results = palette.map((color) => ({
    color,
    deltaE: useCIE2000 ? deltaE2000(targetLab, color.lab) : deltaE76(targetLab, color.lab),
  }));

  // Sort by delta-E and return top N
  return results.sort((a, b) => a.deltaE - b.deltaE).slice(0, n);
}

/**
 * Check if two colors are perceptually similar
 */
export function areSimilar(lab1: LAB, lab2: LAB, threshold: number = 2.0): boolean {
  return deltaE2000(lab1, lab2) < threshold;
}

/**
 * Group colors by similarity
 * Returns clusters of similar colors
 */
export function groupBySimilarity(
  colors: Array<{ lab: LAB; [key: string]: any }>,
  threshold: number = 5.0
): Array<Array<any>> {
  if (colors.length === 0) return [];

  const clusters: Array<Array<any>> = [];
  const used = new Set<number>();

  for (let i = 0; i < colors.length; i++) {
    if (used.has(i)) continue;

    const cluster = [colors[i]];
    used.add(i);

    for (let j = i + 1; j < colors.length; j++) {
      if (used.has(j)) continue;

      if (deltaE2000(colors[i].lab, colors[j].lab) < threshold) {
        cluster.push(colors[j]);
        used.add(j);
      }
    }

    clusters.push(cluster);
  }

  return clusters;
}
