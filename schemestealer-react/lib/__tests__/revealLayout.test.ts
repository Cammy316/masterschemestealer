import { describe, it, expect } from 'vitest';
import {
  CANVAS_H,
  CHIP_GAP,
  CHIP_H,
  COMPACT_BOX,
  FULL_BOX,
  LAYOUT,
  SAFE_RECT,
  insideSafeArea,
  modelHeightFraction,
  recipeRowY,
  recipeBlockHeight,
  wallRowH,
  wallRowRect,
  wallRowCount,
  WALL_MAX_ROWS,
  WALL_MIN_ROW_H,
} from '../reveal/revealLayout';

describe('revealLayout — platform safe area', () => {
  // Intent: on a shipped export the SHADE and WASH rows sat ENTIRELY inside
  // TikTok's caption zone, the ΔE badge sat under the like/comment/share rail,
  // and the watermark — the only persistent branding in the clip — was at
  // y≈1880 where no viewer has ever seen it. Every element that carries
  // information must be inside the safe area, checked mechanically, because
  // eyeballing a 1080×1920 still does not reveal what the platform covers.
  it('every information element lies inside SAFE_RECT', () => {
    for (const [name, rect] of Object.entries(LAYOUT)) {
      expect(insideSafeArea(rect), `${name} ${JSON.stringify(rect)} escapes SAFE_RECT`).toBe(true);
    }
  });

  // Intent: the right-hand action rail was missed entirely in the previous pass
  // — only the bottom was considered — which is how the ΔE badge ended up at
  // x≈944 underneath the share button.
  it('nothing reaches into the action rail', () => {
    const railX = SAFE_RECT.x + SAFE_RECT.w;
    for (const [name, rect] of Object.entries(LAYOUT)) {
      expect(rect.x + rect.w, `${name} crosses the action rail at x=${railX}`).toBeLessThanOrEqual(railX);
    }
  });

  // Intent: all four recipe rows are the payoff. If the last one lands outside
  // the safe area the viewer never sees the wash.
  it('all four recipe rows fit inside the declared block and the safe area', () => {
    const block = LAYOUT.recipeRows;
    for (let i = 0; i < 4; i++) {
      const y = recipeRowY(i);
      expect(y, `row ${i} starts above the block`).toBeGreaterThanOrEqual(block.y);
      expect(y + CHIP_H, `row ${i} overflows the block`).toBeLessThanOrEqual(block.y + block.h);
      expect(insideSafeArea({ x: block.x, y, w: block.w, h: CHIP_H }), `row ${i} escapes SAFE_RECT`).toBe(true);
    }
    // The block must reserve what the rows plus the ΔE badge line actually
    // consume. The old form (4 rows + 3 gaps) stopped describing the layout the
    // moment the badge got its own line between rows 0 and 1.
    expect(recipeBlockHeight()).toBeLessThanOrEqual(block.h);
    expect(4 * CHIP_H + 3 * CHIP_GAP + LAYOUT.deltaBadge.h).toBeLessThanOrEqual(block.h);
  });

  // Intent: the badge shared the base row, right-aligned, which squeezed the
  // paint name into a 332 px box. It is the one MEASUREMENT in the clip and the
  // proof the product rests on — it gets its own line, and that line has to sit
  // between the base row and the highlight row rather than on top of either.
  it('the ΔE badge owns a clear line under the base row', () => {
    const base = { x: LAYOUT.recipeRows.x, y: recipeRowY(0), w: LAYOUT.recipeRows.w, h: CHIP_H };
    const next = { x: LAYOUT.recipeRows.x, y: recipeRowY(1), w: LAYOUT.recipeRows.w, h: CHIP_H };
    expect(LAYOUT.deltaBadge.y, 'badge overlaps the base row').toBeGreaterThanOrEqual(base.y + base.h);
    expect(LAYOUT.deltaBadge.y + LAYOUT.deltaBadge.h, 'badge overlaps the highlight row').toBeLessThanOrEqual(next.y);
    expect(insideSafeArea(LAYOUT.deltaBadge)).toBe(true);
  });

  // Intent: the model is the reason anyone posts this. It shrank to 29.6% of
  // frame height on a shipped export, which reads as the app being the subject
  // rather than their painting.
  it('the model never drops below 40% of frame height', () => {
    expect(modelHeightFraction(COMPACT_BOX)).toBeGreaterThanOrEqual(0.4);
    expect(modelHeightFraction(FULL_BOX)).toBeGreaterThanOrEqual(0.4);
  });

  // Intent: artwork may bleed outside the safe area — only information may not.
  // This records that as deliberate so nobody "fixes" it later.
  it('model boxes are allowed outside the safe area, and are', () => {
    expect(insideSafeArea(FULL_BOX)).toBe(false);
    expect(FULL_BOX.h).toBeLessThanOrEqual(CANVAS_H);
  });

  // Intent: ~280 px of dead black sat between the model's base and the recipe
  // header on a shipped export.
  it('leaves no dead vertical band between the model and the recipe block', () => {
    const gap = LAYOUT.recipeHeading.y - (COMPACT_BOX.y + COMPACT_BOX.h);
    expect(gap, `dead band of ${gap}px above the recipe`).toBeLessThanOrEqual(120);
  });
});

describe('revealLayout — inspiration wall', () => {
  // Intent: the wall is the warp-cast's payoff, and it reuses the recipe block's
  // x/width precisely so it inherits the symmetry and action-rail guarantees.
  // If a future change gives it its own geometry, this catches the drift.
  it('every wall row sits inside the safe area, for every row count', () => {
    for (let n = 1; n <= WALL_MAX_ROWS; n++) {
      for (let i = 0; i < n; i++) {
        const r = wallRowRect(i, n);
        expect(insideSafeArea(r), `row ${i}/${n} ${JSON.stringify(r)} escapes SAFE_RECT`).toBe(true);
      }
    }
  });

  // Intent: v5.3 made the whole layout symmetric about the frame centre after a
  // shipped export sat 35 px off-axis. A new element that is not centred would
  // reintroduce exactly that.
  it('every wall row is centred on the frame axis', () => {
    for (let n = 1; n <= WALL_MAX_ROWS; n++) {
      const r = wallRowRect(0, n);
      expect(r.x + r.w / 2, `row block off-axis at n=${n}`).toBe(540);
    }
  });

  // Intent: rows must fill the block they are given without overflowing it —
  // the last row landing past 1430 would put the final paint under the caption
  // bar, which is the defect the safe area exists to prevent.
  it('all rows fit the declared block with no overflow', () => {
    const block = LAYOUT.recipeRows;
    for (let n = 1; n <= WALL_MAX_ROWS; n++) {
      const last = wallRowRect(n - 1, n);
      expect(last.y + last.h, `n=${n} overflows the block`).toBeLessThanOrEqual(block.y + block.h);
      expect(wallRowRect(0, n).y).toBe(block.y);
    }
  });

  // Intent: the trade this whole derivation exists to make. Six rows must still
  // be legible; if the arithmetic ever produces a row below the floor, the wall
  // is required to drop a row rather than shrink the image below 40%.
  it('six rows stay above the legibility floor', () => {
    expect(wallRowH(WALL_MAX_ROWS)).toBeGreaterThanOrEqual(WALL_MIN_ROW_H);
    expect(wallRowCount(6)).toBe(6);
  });

  it('never exceeds the miniature chip height, and caps at six rows', () => {
    for (let n = 1; n <= WALL_MAX_ROWS; n++) expect(wallRowH(n)).toBeLessThanOrEqual(CHIP_H);
    expect(wallRowCount(8)).toBe(WALL_MAX_ROWS);
    expect(wallRowCount(0)).toBe(1);
  });
});
