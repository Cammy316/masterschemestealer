/**
 * Mask placement geometry (Auspex Reveal production fix).
 *
 * The backend analyses an alpha-bbox-cropped copy of the uploaded image;
 * masks must be drawn INTO that crop rectangle on the canvas. Production
 * stretched them across the whole frame (crop offset dropped) so region
 * highlights bled into the transparent background.
 */

import { describe, it, expect } from 'vitest';
import { maskDestRect, layoutRailCallouts } from '../maskGeometry';

describe('maskDestRect', () => {
  it('places the mask inside its crop rectangle, scaled to the canvas', () => {
    // Frame 800x1000, crop at (100, 50) sized 400x600, canvas rendered 1:1.
    const rect = maskDestRect(
      { width: 300, height: 450, cropX: 100, cropY: 50, cropW: 400, cropH: 600, frameW: 800, frameH: 1000 },
      800,
      1000
    );
    expect(rect).toEqual({ x: 100, y: 50, w: 400, h: 600 });
  });

  it('scales the crop rectangle when the canvas resolution differs from the frame', () => {
    // Same geometry, canvas at double resolution (frontend renders the
    // original file; the backend analysed a 1024 thumbnail of it).
    const rect = maskDestRect(
      { width: 300, height: 450, cropX: 100, cropY: 50, cropW: 400, cropH: 600, frameW: 800, frameH: 1000 },
      1600,
      2000
    );
    expect(rect).toEqual({ x: 200, y: 100, w: 800, h: 1200 });
  });

  it('never fills the whole canvas when a real crop exists (the production bug)', () => {
    const rect = maskDestRect(
      { width: 300, height: 450, cropX: 100, cropY: 50, cropW: 400, cropH: 600, frameW: 800, frameH: 1000 },
      800,
      1000
    );
    expect(rect.w).toBeLessThan(800);
    expect(rect.h).toBeLessThan(1000);
    expect(rect.x).toBeGreaterThan(0);
  });

  it('degrades to the full canvas for responses without crop geometry', () => {
    // Old mask_frame shape ({width, height} only) — e.g. uncropped
    // inspiration scans or pre-upgrade cached results.
    const rect = maskDestRect({ width: 300, height: 400 }, 900, 1200);
    expect(rect).toEqual({ x: 0, y: 0, w: 900, h: 1200 });
  });

  it('degrades to the full canvas when maskFrame is absent entirely', () => {
    const rect = maskDestRect(undefined, 640, 480);
    expect(rect).toEqual({ x: 0, y: 0, w: 640, h: 480 });
  });
});

describe('layoutRailCallouts', () => {
  // The production symptom this replaces: five numbered chips stacked ON the
  // model, overlapping each other. Chips must dock at the frame edges,
  // never overlap, and keep top-to-bottom order matching their anchors.

  const MIN_GAP = 0.12;
  const PADDING = 0.07;

  it('assigns each anchor to its nearest side', () => {
    const out = layoutRailCallouts([
      { x: 0.2, y: 0.3 },
      { x: 0.8, y: 0.4 },
      { x: 0.49, y: 0.6 },
    ]);
    expect(out[0].side).toBe('left');
    expect(out[1].side).toBe('right');
    expect(out[2].side).toBe('left');
  });

  it('enforces the minimum gap on a crowded rail', () => {
    // Four anchors all on the left at nearly the same height — the pink
    // horror's clustered-chip case.
    const out = layoutRailCallouts([
      { x: 0.3, y: 0.45 },
      { x: 0.31, y: 0.46 },
      { x: 0.32, y: 0.47 },
      { x: 0.33, y: 0.48 },
    ]);
    const ys = out.map((c) => c.railY).sort((a, b) => a - b);
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i] - ys[i - 1]).toBeGreaterThanOrEqual(MIN_GAP - 1e-9);
    }
  });

  it('keeps every chip inside the padded band even when crowded at the bottom', () => {
    const out = layoutRailCallouts([
      { x: 0.7, y: 0.95 },
      { x: 0.72, y: 0.96 },
      { x: 0.74, y: 0.97 },
      { x: 0.76, y: 0.98 },
    ]);
    for (const c of out) {
      expect(c.railY).toBeGreaterThanOrEqual(PADDING - 1e-9);
      expect(c.railY).toBeLessThanOrEqual(1 - PADDING + 1e-9);
    }
  });

  it('preserves top-to-bottom anchor order within a rail', () => {
    const out = layoutRailCallouts([
      { x: 0.2, y: 0.8 },
      { x: 0.25, y: 0.2 },
      { x: 0.3, y: 0.5 },
    ]);
    const byAnchor = [...out].sort((a, b) => a.anchorY - b.anchorY);
    for (let i = 1; i < byAnchor.length; i++) {
      expect(byAnchor[i].railY).toBeGreaterThan(byAnchor[i - 1].railY);
    }
  });

  it('a lone anchor keeps its own height', () => {
    const [c] = layoutRailCallouts([{ x: 0.6, y: 0.42 }]);
    expect(c.railY).toBeCloseTo(0.42, 5);
    expect(c.side).toBe('right');
  });
});
