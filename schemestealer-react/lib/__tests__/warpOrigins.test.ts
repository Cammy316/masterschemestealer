import { describe, it, expect } from 'vitest';
import { scanColourOrigins, fallbackOrigins, parseHex } from '../reveal/warpOrigins';

/**
 * Build an ImageData-shaped object with coloured patches painted into it.
 * `patches` are in normalised coords so the intent of each test reads clearly.
 */
function makeImage(
  W: number,
  H: number,
  bg: [number, number, number],
  patches: { x: number; y: number; w: number; h: number; rgb: [number, number, number] }[],
): ImageData {
  const data = new Uint8ClampedArray(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    data[i * 4] = bg[0];
    data[i * 4 + 1] = bg[1];
    data[i * 4 + 2] = bg[2];
    data[i * 4 + 3] = 255;
  }
  for (const p of patches) {
    const x0 = Math.round(p.x * W);
    const y0 = Math.round(p.y * H);
    const x1 = Math.min(W, Math.round((p.x + p.w) * W));
    const y1 = Math.min(H, Math.round((p.y + p.h) * H));
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * W + x) * 4;
        data[i] = p.rgb[0];
        data[i + 1] = p.rgb[1];
        data[i + 2] = p.rgb[2];
        data[i + 3] = 255;
      }
    }
  }
  return { width: W, height: H, data, colorSpace: 'srgb' } as ImageData;
}

describe('parseHex', () => {
  it('reads both long and short form', () => {
    expect(parseHex('#FF8000')).toEqual([255, 128, 0]);
    expect(parseHex('#f80')).toEqual([255, 136, 0]);
  });
  it('returns null rather than a wrong colour for junk', () => {
    expect(parseHex('nonsense')).toBeNull();
    expect(parseHex('#12345')).toBeNull();
  });
});

describe('scanColourOrigins', () => {
  // Intent: this is the whole promise of the inspiration clip — "these paints
  // are IN this image". An orb that floats over an unrelated part of the photo
  // is a claim the viewer can see is false, so each origin must land in the
  // patch its colour actually came from.
  it('lands each origin inside the patch that colour came from', () => {
    const img = makeImage(200, 200, [20, 20, 20], [
      { x: 0.05, y: 0.05, w: 0.25, h: 0.25, rgb: [255, 0, 0] },
      { x: 0.7, y: 0.7, w: 0.25, h: 0.25, rgb: [0, 0, 255] },
    ]);
    const [red, blue] = scanColourOrigins(img, ['#FF0000', '#0000FF']);
    expect(red.x, 'red origin x').toBeGreaterThan(0.05);
    expect(red.x, 'red origin x').toBeLessThan(0.3);
    expect(red.y, 'red origin y').toBeLessThan(0.3);
    expect(blue.x, 'blue origin x').toBeGreaterThan(0.7);
    expect(blue.y, 'blue origin y').toBeGreaterThan(0.7);
  });

  // Intent: the storyboard is deterministic everywhere else. If origins moved
  // between renders the same scan would export a different video each time, and
  // the loop-seam assertion could pass once and fail the next run.
  it('is deterministic across repeated scans', () => {
    const img = makeImage(120, 90, [40, 60, 40], [
      { x: 0.1, y: 0.1, w: 0.2, h: 0.2, rgb: [200, 30, 30] },
      { x: 0.6, y: 0.5, w: 0.2, h: 0.2, rgb: [30, 30, 200] },
    ]);
    const a = scanColourOrigins(img, ['#C81E1E', '#1E1EC8']);
    const b = scanColourOrigins(img, ['#C81E1E', '#1E1EC8']);
    expect(a).toEqual(b);
  });

  // Intent: a flat image gives every window an identical score. Without a
  // defined tie-break the result depends on iteration order, which is exactly
  // the kind of thing that changes silently under a refactor.
  it('breaks ties toward the smallest y then x', () => {
    const flat = makeImage(100, 100, [128, 128, 128], []);
    const [o] = scanColourOrigins(flat, ['#808080']);
    // The first window scanned starts at (0,0), so its centre is half a window in.
    expect(o.x).toBeLessThan(0.15);
    expect(o.y).toBeLessThan(0.15);
  });

  // Intent: two near-identical colours would otherwise both snap to the same
  // brightest patch and the orbs would overlap into an unreadable blob.
  it('pushes a second, similar colour to a different region when one exists', () => {
    const img = makeImage(200, 200, [10, 10, 10], [
      { x: 0.05, y: 0.05, w: 0.3, h: 0.3, rgb: [200, 40, 40] },
      { x: 0.6, y: 0.6, w: 0.3, h: 0.3, rgb: [205, 45, 45] },
    ]);
    const [a, b] = scanColourOrigins(img, ['#C82828', '#CD2D2D']);
    expect(Math.hypot(a.x - b.x, a.y - b.y), 'origins collapsed onto each other').toBeGreaterThan(0.12);
  });

  // Intent: separation is a PREFERENCE. When a picture genuinely only has one
  // region of a colour, inventing a second location elsewhere would be a lie —
  // better two orbs close together than one pointing at nothing.
  it('falls back to the true best window when nothing clears the separation', () => {
    const img = makeImage(100, 100, [10, 10, 10], [{ x: 0.4, y: 0.4, w: 0.2, h: 0.2, rgb: [0, 200, 0] }]);
    // A separation no two points in a unit square can satisfy (max is √2), so
    // the suppressed search is guaranteed to find nothing and the fallback is
    // the only thing under test.
    const [a, b] = scanColourOrigins(img, ['#00C800', '#00C800'], { minSeparation: 2 });
    expect(a, 'both must land on the one true patch').toEqual(b);
    expect(a.x).toBeGreaterThan(0.3);
    expect(a.x).toBeLessThan(0.7);
    expect(a.y).toBeGreaterThan(0.3);
    expect(a.y).toBeLessThan(0.7);
  });

  it('returns centres rather than throwing on a zero-sized image', () => {
    const empty = { width: 0, height: 0, data: new Uint8ClampedArray(0), colorSpace: 'srgb' } as ImageData;
    expect(scanColourOrigins(empty, ['#FFFFFF'])).toEqual([{ x: 0.5, y: 0.5 }]);
  });
});

describe('fallbackOrigins', () => {
  // Intent: used when the image cannot be read at all. Stacked centres would
  // draw every orb on top of every other one — the one outcome worse than
  // being wrong about location.
  it('never stacks two points and never sits dead centre', () => {
    const pts = fallbackOrigins(6);
    expect(pts).toHaveLength(6);
    for (let i = 0; i < pts.length; i++) {
      expect(Math.hypot(pts[i].x - 0.5, pts[i].y - 0.5)).toBeGreaterThan(0.2);
      for (let j = i + 1; j < pts.length; j++) {
        expect(Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y)).toBeGreaterThan(0.1);
      }
    }
  });

  it('keeps every point inside the frame', () => {
    for (const p of fallbackOrigins(6)) {
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(1);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(1);
    }
  });
});
