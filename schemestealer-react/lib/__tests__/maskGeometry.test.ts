/**
 * Mask placement geometry (Auspex Reveal production fix).
 *
 * The backend analyses an alpha-bbox-cropped copy of the uploaded image;
 * masks must be drawn INTO that crop rectangle on the canvas. Production
 * stretched them across the whole frame (crop offset dropped) so region
 * highlights bled into the transparent background.
 */

import { describe, it, expect } from 'vitest';
import { maskDestRect } from '../maskGeometry';

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
