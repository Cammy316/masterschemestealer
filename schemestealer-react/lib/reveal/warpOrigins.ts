/**
 * Where in the image each extracted colour actually came from.
 *
 * The miniature clip anchors its callouts to segmentation masks. Inspiration
 * scans have no masks — the backend returns colours and recipes only — so an
 * inspiration clip that stacked every orb in the centre would be visibly
 * dishonest: the whole promise is "these paints are IN this image", and the
 * viewer can check that against the photo they are looking at.
 *
 * So we find each colour's origin ourselves, from the pixels. Plain squared-RGB
 * distance, deliberately: this is a "which part of the picture is most this
 * colour" question, not a perceptual-difference question, and CIEDE2000 is
 * reserved for paint matching where it is load-bearing (project invariant — no
 * new colour-space conversions outside the matcher).
 */

export interface Origin {
  /** Normalised 0..1 image coordinates. */
  x: number;
  y: number;
}

export interface OriginScanOptions {
  /** Square window side in pixels, as a fraction of the smaller image side. */
  windowFraction?: number;
  /** Minimum normalised separation between two chosen origins. */
  minSeparation?: number;
}

const DEFAULT_WINDOW_FRACTION = 0.08;
const DEFAULT_MIN_SEPARATION = 0.12;

/** #rrggbb → [r,g,b]. Returns null for anything unparseable. */
export function parseHex(hex: string): [number, number, number] | null {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  if (full.length !== 6) return null;
  const n = Number.parseInt(full, 16);
  if (!Number.isFinite(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/**
 * For each target colour, the centre of the window whose mean colour is closest
 * to it.
 *
 * Uses a summed-area table so the cost is O(pixels + windows) per target rather
 * than O(pixels × window²) — at 200 px and six targets the naive version is tens
 * of millions of operations on the export path.
 *
 * Deterministic by construction: no randomness, and ties resolve to the smallest
 * y then the smallest x, so the same image always yields the same storyboard.
 */
export function scanColourOrigins(
  image: ImageData,
  targets: string[],
  opts: OriginScanOptions = {},
): Origin[] {
  const { width: W, height: H, data } = image;
  const minSeparation = opts.minSeparation ?? DEFAULT_MIN_SEPARATION;
  if (W === 0 || H === 0 || targets.length === 0) return targets.map(() => ({ x: 0.5, y: 0.5 }));

  const win = Math.max(1, Math.round(Math.min(W, H) * (opts.windowFraction ?? DEFAULT_WINDOW_FRACTION)));

  // Summed-area tables, one per channel. (W+1)×(H+1) so the inclusive-exclusive
  // lookup needs no bounds branching.
  const stride = W + 1;
  const sr = new Float64Array(stride * (H + 1));
  const sg = new Float64Array(stride * (H + 1));
  const sb = new Float64Array(stride * (H + 1));
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = (y * W + x) * 4;
      const i = (y + 1) * stride + (x + 1);
      const up = y * stride + (x + 1);
      const left = (y + 1) * stride + x;
      const diag = y * stride + x;
      sr[i] = data[p] + sr[up] + sr[left] - sr[diag];
      sg[i] = data[p + 1] + sg[up] + sg[left] - sg[diag];
      sb[i] = data[p + 2] + sb[up] + sb[left] - sb[diag];
    }
  }
  const boxMean = (x0: number, y0: number, x1: number, y1: number): [number, number, number] => {
    const a = y0 * stride + x0;
    const b = y0 * stride + x1;
    const c = y1 * stride + x0;
    const d = y1 * stride + x1;
    const n = (x1 - x0) * (y1 - y0);
    return [(sr[d] - sr[b] - sr[c] + sr[a]) / n, (sg[d] - sg[b] - sg[c] + sg[a]) / n, (sb[d] - sb[b] - sb[c] + sb[a]) / n];
  };

  const chosen: Origin[] = [];
  return targets.map((hex) => {
    const rgb = parseHex(hex);
    if (!rgb) return { x: 0.5, y: 0.5 };

    // Track the best window overall and the best that also clears every origin
    // already chosen. Two colours genuinely can share a region, so separation is
    // a preference, not a constraint — falling back to the unsuppressed best is
    // always better than inventing a location.
    let best = Number.POSITIVE_INFINITY;
    let bestX = 0;
    let bestY = 0;
    let sepBest = Number.POSITIVE_INFINITY;
    let sepX = -1;
    let sepY = -1;

    // Step by a third of the window: full per-pixel search buys precision the
    // orb radius makes invisible, and costs 9x.
    const step = Math.max(1, Math.floor(win / 3));
    for (let y = 0; y + win <= H; y += step) {
      for (let x = 0; x + win <= W; x += step) {
        const [mr, mg, mb] = boxMean(x, y, x + win, y + win);
        const dr = mr - rgb[0];
        const dg = mg - rgb[1];
        const db = mb - rgb[2];
        const dist = dr * dr + dg * dg + db * db;
        // Strict `<` keeps the earliest window on a tie — scanning order is
        // top-to-bottom then left-to-right, so ties resolve to smallest y then x.
        if (dist < best) {
          best = dist;
          bestX = x;
          bestY = y;
        }
        if (dist < sepBest) {
          const nx = (x + win / 2) / W;
          const ny = (y + win / 2) / H;
          const clear = chosen.every((o) => Math.hypot(o.x - nx, o.y - ny) >= minSeparation);
          if (clear) {
            sepBest = dist;
            sepX = x;
            sepY = y;
          }
        }
      }
    }

    const fx = sepX >= 0 ? sepX : bestX;
    const fy = sepY >= 0 ? sepY : bestY;
    const origin = { x: (fx + win / 2) / W, y: (fy + win / 2) / H };
    chosen.push(origin);
    return origin;
  });
}

/**
 * Deterministic fallback ring, used when the image cannot be read at all
 * (a tainted canvas, a decode failure).
 *
 * A ring rather than a grid because the orbs are drawn over the photo: evenly
 * spaced points on an ellipse never stack, and never sit dead centre where the
 * subject usually is.
 */
export function fallbackOrigins(n: number): Origin[] {
  return Array.from({ length: n }, (_, i) => {
    const a = (i / Math.max(1, n)) * Math.PI * 2 - Math.PI / 2;
    return { x: 0.5 + 0.32 * Math.cos(a), y: 0.5 + 0.3 * Math.sin(a) };
  });
}
