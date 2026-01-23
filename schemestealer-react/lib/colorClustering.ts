/**
 * K-means Color Clustering
 * Extracts dominant colors from images using K-means algorithm
 */

import type { RGB, LAB } from './colorConversion';
import { rgbToLab } from './colorConversion';
import { deltaE76 } from './deltaE';

export interface ClusterResult {
  rgb: RGB;
  lab: LAB;
  percentage: number;
  pixelCount: number;
}

/**
 * K-means++ initialization
 * Chooses initial centroids that are far apart for better clustering
 */
function kMeansPlusPlusInit(pixels: RGB[], k: number): RGB[] {
  if (pixels.length === 0 || k <= 0) return [];

  const centroids: RGB[] = [];

  // Choose first centroid randomly
  centroids.push(pixels[Math.floor(Math.random() * pixels.length)]);

  // Choose remaining centroids
  for (let i = 1; i < k; i++) {
    const distances: number[] = [];
    let totalDistance = 0;

    // Calculate distance to nearest centroid for each pixel
    for (const pixel of pixels) {
      let minDist = Infinity;

      for (const centroid of centroids) {
        const dist = colorDistance(pixel, centroid);
        if (dist < minDist) {
          minDist = dist;
        }
      }

      distances.push(minDist * minDist); // Square for weighted probability
      totalDistance += minDist * minDist;
    }

    // Choose next centroid with probability proportional to distance
    let random = Math.random() * totalDistance;
    for (let j = 0; j < pixels.length; j++) {
      random -= distances[j];
      if (random <= 0) {
        centroids.push(pixels[j]);
        break;
      }
    }
  }

  return centroids;
}

/**
 * Calculate Euclidean distance between two RGB colors
 */
function colorDistance(c1: RGB, c2: RGB): number {
  const dr = c1.r - c2.r;
  const dg = c1.g - c2.g;
  const db = c1.b - c2.b;
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

/**
 * Find nearest centroid for a pixel
 */
function findNearestCentroid(pixel: RGB, centroids: RGB[]): number {
  let minDist = Infinity;
  let nearestIndex = 0;

  for (let i = 0; i < centroids.length; i++) {
    const dist = colorDistance(pixel, centroids[i]);
    if (dist < minDist) {
      minDist = dist;
      nearestIndex = i;
    }
  }

  return nearestIndex;
}

/**
 * Calculate mean color of a cluster
 */
function calculateMean(cluster: RGB[]): RGB {
  if (cluster.length === 0) {
    return { r: 0, g: 0, b: 0 };
  }

  let sumR = 0, sumG = 0, sumB = 0;

  for (const pixel of cluster) {
    sumR += pixel.r;
    sumG += pixel.g;
    sumB += pixel.b;
  }

  return {
    r: Math.round(sumR / cluster.length),
    g: Math.round(sumG / cluster.length),
    b: Math.round(sumB / cluster.length),
  };
}

/**
 * Check if centroids have converged (no significant change)
 */
function haveConverged(oldCentroids: RGB[], newCentroids: RGB[], threshold: number = 1.0): boolean {
  if (oldCentroids.length !== newCentroids.length) return false;

  for (let i = 0; i < oldCentroids.length; i++) {
    if (colorDistance(oldCentroids[i], newCentroids[i]) > threshold) {
      return false;
    }
  }

  return true;
}

/**
 * K-means clustering algorithm
 * Extracts K dominant colors from an array of pixels
 */
export function kMeansClustering(
  pixels: RGB[],
  k: number,
  maxIterations: number = 100
): ClusterResult[] {
  if (pixels.length === 0 || k <= 0) return [];
  if (pixels.length < k) k = pixels.length;

  // Initialize centroids using K-means++
  let centroids = kMeansPlusPlusInit(pixels, k);

  // Iterate until convergence or max iterations
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    // Assign pixels to nearest centroid
    const clusters: RGB[][] = Array.from({ length: k }, () => []);

    for (const pixel of pixels) {
      const nearestIndex = findNearestCentroid(pixel, centroids);
      clusters[nearestIndex].push(pixel);
    }

    // Calculate new centroids
    const newCentroids = clusters.map((cluster) => calculateMean(cluster));

    // Check for convergence
    if (haveConverged(centroids, newCentroids)) {
      break;
    }

    centroids = newCentroids;
  }

  // Calculate final cluster assignments
  const clusters: RGB[][] = Array.from({ length: k }, () => []);

  for (const pixel of pixels) {
    const nearestIndex = findNearestCentroid(pixel, centroids);
    clusters[nearestIndex].push(pixel);
  }

  // Create results with percentages
  const totalPixels = pixels.length;
  const results: ClusterResult[] = [];

  for (let i = 0; i < k; i++) {
    if (clusters[i].length === 0) continue;

    const rgb = centroids[i];
    const lab = rgbToLab(rgb);
    const pixelCount = clusters[i].length;
    const percentage = Math.round((pixelCount / totalPixels) * 100);

    results.push({
      rgb,
      lab,
      percentage,
      pixelCount,
    });
  }

  // Sort by percentage (most dominant first)
  results.sort((a, b) => b.percentage - a.percentage);

  return results;
}

/**
 * Extract pixels from an image
 * Downsamples for performance (samples every Nth pixel)
 */
export function extractPixelsFromImage(
  imageData: ImageData,
  sampleRate: number = 5
): RGB[] {
  const pixels: RGB[] = [];
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;

  for (let y = 0; y < height; y += sampleRate) {
    for (let x = 0; x < width; x += sampleRate) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const a = data[index + 3];

      // Skip transparent pixels
      if (a < 128) continue;

      pixels.push({ r, g, b });
    }
  }

  return pixels;
}

/**
 * Filter out very dark or very light colors (likely noise)
 */
export function filterExtremeColors(pixels: RGB[], minBrightness: number = 20, maxBrightness: number = 235): RGB[] {
  return pixels.filter((pixel) => {
    const brightness = (pixel.r + pixel.g + pixel.b) / 3;
    return brightness >= minBrightness && brightness <= maxBrightness;
  });
}

/**
 * Remove colors that are too similar to existing results
 * Helps eliminate near-duplicates
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

    if (!isDuplicate) {
      filtered.push(colors[i]);
    }
  }

  return filtered;
}

/**
 * Complete color extraction pipeline
 * Extracts and processes dominant colors from an image
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

  // Extract pixels
  let pixels = extractPixelsFromImage(imageData, sampleRate);

  // Filter extreme colors if enabled
  if (filterExtremes) {
    pixels = filterExtremeColors(pixels);
  }

  if (pixels.length === 0) {
    return [];
  }

  // Run K-means clustering
  let results = kMeansClustering(pixels, numColors, maxIterations);

  // Deduplicate similar colors if enabled
  if (deduplicate) {
    results = deduplicateColors(results);
  }

  return results;
}
