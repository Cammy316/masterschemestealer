/**
 * K-means Color Clustering (perceptual / LAB space)
 *
 * Extracts dominant colours from an image. All distance and centroid maths run
 * in CIE-LAB (perceptually uniform) rather than gamma-encoded sRGB, so mixtures
 * don't darken and "nearest colour" matches perception. Randomness is seeded
 * (mulberry32) so the same image always yields the same colours.
 */

import type { RGB, LAB } from './colorConversion';
import { rgbToLab, labToRgb } from './colorConversion';
import { deltaE76 } from './deltaE';

export interface ClusterResult {
  rgb: RGB;
  lab: LAB;
  percentage: number;
  pixelCount: number;
}

/**
 * Seeded PRNG (mulberry32). A constant seed makes clustering deterministic:
 * the same image in → the same colours out, every scan.
 */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Euclidean distance in LAB space. */
function labDistance(c1: LAB, c2: LAB): number {
  const dl = c1.l - c2.l;
  const da = c1.a - c2.a;
  const db = c1.b - c2.b;
  return Math.sqrt(dl * dl + da * da + db * db);
}

/**
 * K-means++ initialisation in LAB, using the seeded PRNG for all random choices.
 */
function kMeansPlusPlusInit(pixels: LAB[], k: number, rand: () => number): LAB[] {
  if (pixels.length === 0 || k <= 0) return [];

  const centroids: LAB[] = [];
  centroids.push(pixels[Math.floor(rand() * pixels.length)]);

  for (let i = 1; i < k; i++) {
    const distances: number[] = [];
    let totalDistance = 0;

    for (const pixel of pixels) {
      let minDist = Infinity;
      for (const centroid of centroids) {
        const dist = labDistance(pixel, centroid);
        if (dist < minDist) minDist = dist;
      }
      const sq = minDist * minDist; // squared for weighted probability
      distances.push(sq);
      totalDistance += sq;
    }

    let random = rand() * totalDistance;
    let chosen = pixels.length - 1;
    for (let j = 0; j < pixels.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        chosen = j;
        break;
      }
    }
    centroids.push(pixels[chosen]);
  }

  return centroids;
}

function findNearestCentroid(pixel: LAB, centroids: LAB[]): number {
  let minDist = Infinity;
  let nearestIndex = 0;
  for (let i = 0; i < centroids.length; i++) {
    const dist = labDistance(pixel, centroids[i]);
    if (dist < minDist) {
      minDist = dist;
      nearestIndex = i;
    }
  }
  return nearestIndex;
}

/** Mean of a LAB cluster. */
function calculateMean(cluster: LAB[]): LAB {
  if (cluster.length === 0) return { l: 0, a: 0, b: 0 };
  let sl = 0, sa = 0, sb = 0;
  for (const p of cluster) {
    sl += p.l;
    sa += p.a;
    sb += p.b;
  }
  return { l: sl / cluster.length, a: sa / cluster.length, b: sb / cluster.length };
}

function haveConverged(oldCentroids: LAB[], newCentroids: LAB[], threshold: number = 1.0): boolean {
  if (oldCentroids.length !== newCentroids.length) return false;
  for (let i = 0; i < oldCentroids.length; i++) {
    if (labDistance(oldCentroids[i], newCentroids[i]) > threshold) return false;
  }
  return true;
}

interface LabCluster {
  lab: LAB;
  pixelCount: number;
}

/**
 * K-means clustering in LAB. Returns LAB centroids + pixel counts (most
 * populous first); callers convert centroids back to RGB for display.
 */
export function kMeansClustering(
  pixels: LAB[],
  k: number,
  rand: () => number,
  maxIterations: number = 100
): LabCluster[] {
  if (pixels.length === 0 || k <= 0) return [];
  if (pixels.length < k) k = pixels.length;

  let centroids = kMeansPlusPlusInit(pixels, k, rand);

  for (let iteration = 0; iteration < maxIterations; iteration++) {
    const clusters: LAB[][] = Array.from({ length: k }, () => []);
    for (const pixel of pixels) {
      clusters[findNearestCentroid(pixel, centroids)].push(pixel);
    }

    const newCentroids = clusters.map((cluster, i) =>
      cluster.length > 0 ? calculateMean(cluster) : centroids[i]
    );

    if (haveConverged(centroids, newCentroids)) {
      centroids = newCentroids;
      break;
    }
    centroids = newCentroids;
  }

  // Final assignment
  const finalClusters: LAB[][] = Array.from({ length: k }, () => []);
  for (const pixel of pixels) {
    finalClusters[findNearestCentroid(pixel, centroids)].push(pixel);
  }

  const out: LabCluster[] = [];
  for (let i = 0; i < k; i++) {
    if (finalClusters[i].length === 0) continue;
    out.push({ lab: centroids[i], pixelCount: finalClusters[i].length });
  }
  out.sort((a, b) => b.pixelCount - a.pixelCount);
  return out;
}

/**
 * Extract pixels from an image. Downsamples for performance (every Nth pixel).
 */
export function extractPixelsFromImage(imageData: ImageData, sampleRate: number = 5): RGB[] {
  const pixels: RGB[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y += sampleRate) {
    for (let x = 0; x < width; x += sampleRate) {
      const index = (y * width + x) * 4;
      const a = data[index + 3];
      if (a < 128) continue; // skip transparent pixels
      pixels.push({ r: data[index], g: data[index + 1], b: data[index + 2] });
    }
  }

  return pixels;
}

/** Nearest-rank percentile of a pre-sorted ascending array. */
function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * (sorted.length - 1))));
  return sorted[idx];
}

/**
 * Drop specular highlights and deep shadows by trimming the L* tails (below the
 * 2nd / above the 98th percentile) — the LAB analogue of the backend's specular/
 * shadow filtering. Crucially this is RELATIVE, so solid-black and solid-white
 * schemes survive (their pixels cluster near one L*, not split by an absolute
 * cutoff). Trimming is skipped unless ≥5,000 pixels would remain.
 */
export function filterExtremeColors(labPixels: LAB[]): LAB[] {
  if (labPixels.length === 0) return labPixels;
  const ls = labPixels.map((p) => p.l).sort((x, y) => x - y);
  const lo = percentile(ls, 2);
  const hi = percentile(ls, 98);
  const kept = labPixels.filter((p) => p.l >= lo && p.l <= hi);
  return kept.length >= 5000 ? kept : labPixels;
}

/**
 * Remove colours too similar to ones already kept (near-duplicates).
 */
export function deduplicateColors(colors: ClusterResult[], minDeltaE: number = 10): ClusterResult[] {
  if (colors.length === 0) return [];
  const filtered: ClusterResult[] = [colors[0]];
  for (let i = 1; i < colors.length; i++) {
    let isDuplicate = false;
    for (const existing of filtered) {
      if (deltaE76(colors[i].lab, existing.lab) < minDeltaE) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) filtered.push(colors[i]);
  }
  return filtered;
}

/**
 * Complete colour extraction pipeline (sample → LAB → trim → cluster → dedupe).
 */
export function extractDominantColors(
  imageData: ImageData,
  options: {
    numColors?: number;
    sampleRate?: number;
    filterExtremes?: boolean;
    deduplicate?: boolean;
    maxIterations?: number;
  } = {}
): ClusterResult[] {
  const {
    numColors = 5,
    sampleRate = 5,
    filterExtremes = true,
    deduplicate = true,
    maxIterations = 100,
  } = options;

  // Sample pixels, then convert to LAB once up front — all clustering is in LAB.
  const rgbPixels = extractPixelsFromImage(imageData, sampleRate);
  let labPixels = rgbPixels.map(rgbToLab);

  if (filterExtremes) {
    labPixels = filterExtremeColors(labPixels);
  }
  if (labPixels.length === 0) return [];

  const rand = mulberry32(42); // seeded → deterministic results
  const clusters = kMeansClustering(labPixels, numColors, rand, maxIterations);

  const total = labPixels.length;
  let results: ClusterResult[] = clusters.map((c) => ({
    rgb: labToRgb(c.lab),
    lab: c.lab,
    pixelCount: c.pixelCount,
    percentage: Math.round((c.pixelCount / total) * 100),
  }));

  results.sort((a, b) => b.percentage - a.percentage);

  if (deduplicate) {
    results = deduplicateColors(results);
  }

  return results;
}
