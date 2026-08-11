/**
 * Single source of truth for WHERE everything sits in the exported frame.
 *
 * Before this module the rects were loose constants plus inline arithmetic
 * scattered through `revealCompose`, and the result was measurable: on a shipped
 * export the SHADE and WASH rows sat entirely inside TikTok's caption zone, the
 * ΔE badge sat under the action rail, and the watermark — the only persistent
 * branding in the clip — was buried at y≈1880 where nobody has ever seen it.
 *
 * The rule: **artwork may leave the safe area, information may not.** The model
 * is artwork. Every text, chip, badge, callout and card is information.
 */

export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Worst-case union of TikTok / Reels / Shorts chrome, in logical 1080×1920 space.
 * Bottom ~25% is caption + username + music ticker; the right ~17% is the
 * like/comment/share rail; the top strip is the tab bar.
 */
export const SAFE_RECT: Rect = { x: 180, y: 190, w: 720, h: 1240 }; // x 180–900, y 190–1430

/**
 * Horizontal centre for everything centred: the FRAME centre, 540.
 *
 * This replaces a CONTENT_CX of 505. That constant centred text on the usable
 * band rather than the frame, which was defensible in isolation and wrong in
 * practice: the corner brackets, the scan sweep and the model are all symmetric
 * about 540, so every heading sat 35 px left of the furniture around it — read
 * on a device as the whole layout being subtly askew.
 *
 * Symmetry and clearing the action rail together force the safe rect narrower:
 * the rail eats roughly the right 17%%, so the right edge must stop at 900, and
 * symmetry then fixes the left edge at 180. That costs 80 px of usable width
 * versus the asymmetric rect. A badge nobody can see is worth less than a badge
 * 80 px narrower.
 */
export const FRAME_CX = CANVAS_W / 2; // 540 — asserted as a literal in the tests
/** Widest a centred element can be and still clear both edges of the band. */
const CENTRED_W = SAFE_RECT.w; // 720
const CENTRED_X = FRAME_CX - CENTRED_W / 2; // 180

/** Callout chip radius, and the rails they dock to. Both rails are pulled inside
 *  the safe area — the right one used to sit under the action rail. */
export const CALLOUT_CHIP_R = 34;
export const CALLOUT_RAIL = {
  left: SAFE_RECT.x + CALLOUT_CHIP_R + 4, // 78
  right: SAFE_RECT.x + SAFE_RECT.w - CALLOUT_CHIP_R - 4, // 862
} as const;

/** Every element that carries information. Containment is unit-tested. */
export const LAYOUT = {
  /** Persistent brand mark — top-right, because the bottom is never visible. */
  watermark: { x: 560, y: 196, w: 340, h: 32 },
  /** Burned-in headline / counter. */
  headline: { x: CENTRED_X, y: 244, w: CENTRED_W, h: 48 },
  /** Recipe block heading + "DOMINANT · <FAMILY>" line. */
  recipeHeading: { x: CENTRED_X, y: 976, w: CENTRED_W, h: 52 },
  recipeSubheading: { x: CENTRED_X, y: 1030, w: CENTRED_W, h: 30 },
  /** Four paint rows. Symmetric about 540, right edge at 900 for the rail. */
  recipeRows: { x: CENTRED_X, y: 1064, w: CENTRED_W, h: 366 }, // 1064–1430
  /** The delta-E badge, on its OWN line under the base row. */
  deltaBadge: { x: CENTRED_X, y: 1142, w: CENTRED_W, h: 30 },
  /** End card, shown alone on a clean frame. */
  endCardTitle: { x: CENTRED_X, y: 1120, w: CENTRED_W, h: 52 },
  endCardSub: { x: CENTRED_X, y: 1184, w: CENTRED_W, h: 32 },
  /** Numbered callout chips. These are INFORMATION — the right rail previously
   *  sat at x≈1028, i.e. underneath the like/comment/share column. */
  calloutChipLeft: { x: CALLOUT_RAIL.left - CALLOUT_CHIP_R, y: SAFE_RECT.y, w: CALLOUT_CHIP_R * 2, h: 68 },
  calloutChipRight: { x: CALLOUT_RAIL.right - CALLOUT_CHIP_R, y: SAFE_RECT.y, w: CALLOUT_CHIP_R * 2, h: 68 },
} as const;

/**
 * Row metrics. 84/12 shrank to 74/10 to buy the delta-E badge its own line.
 *
 * The badge used to share the base row, right-aligned, which forced the paint
 * name down to a 332 px box and made the one MEASUREMENT in the clip read as a
 * suffix on a product name. It is the proof the whole app rests on; it gets its
 * own line.
 *
 * The vertical budget is exact and there was no slack to take it from: safe area
 * ends at 1430, the model needs 40%% of frame height, and the heading pair sits
 * between them. 10 px off each chip is where the space came from.
 */
export const CHIP_H = 74;
export const CHIP_GAP = 10;
const BADGE_GAP = 4;

/** Top of recipe row `i`. Rows 1..3 sit below the badge line, which is reserved
 *  whether or not a badge is drawn — a layout that reflows on the presence of a
 *  measurement would be untestable and would jump between scans. */
export function recipeRowY(i: number): number {
  const y0 = LAYOUT.recipeRows.y;
  if (i === 0) return y0;
  return y0 + CHIP_H + BADGE_GAP + LAYOUT.deltaBadge.h + CHIP_GAP + (i - 1) * (CHIP_H + CHIP_GAP);
}

/** Total vertical space the four rows plus the badge line actually consume. */
export function recipeBlockHeight(): number {
  return recipeRowY(3) + CHIP_H - LAYOUT.recipeRows.y;
}

// ---- inspiration wall --------------------------------------------------------
/**
 * The warp-cast payoff is a WALL: up to six extracted colours, each paired with
 * its single closest paint. The miniature's four fixed rows do not fit — six at
 * `CHIP_H` plus gaps is 494 px into a 366 px block.
 *
 * Rather than shrink the image (it must stay ≥40% of frame height — that rule
 * exists because a shipped export let it fall to 29.6% and the clip read as an
 * advert for us rather than a photo the poster chose), the ROWS flex. Every row
 * internal — swatch size, type size, pill height — derives from `wallRowH`, so
 * there is one number to change if six rows prove too tight on a device.
 */
export const WALL_MAX_ROWS = 6;
/** Below this a paint name is not readable at phone size; the wall caps its row
 *  count instead of shrinking further. Asserted in the layout tests. */
export const WALL_MIN_ROW_H = 48;

/** Row height for an `n`-row wall, filling the recipe block exactly. */
export function wallRowH(n: number): number {
  const rows = Math.max(1, n);
  return Math.min(CHIP_H, Math.floor((LAYOUT.recipeRows.h - (rows - 1) * CHIP_GAP) / rows));
}

/** How many rows a wall of `n` colours may actually draw. */
export function wallRowCount(n: number): number {
  let rows = Math.min(WALL_MAX_ROWS, Math.max(1, n));
  while (rows > 1 && wallRowH(rows) < WALL_MIN_ROW_H) rows--;
  return rows;
}

/** Rect of wall row `i` of `n`. Shares the recipe block's x and width, so it
 *  inherits the symmetry and action-rail guarantees for free. */
export function wallRowRect(i: number, n: number): Rect {
  const h = wallRowH(n);
  return { x: LAYOUT.recipeRows.x, y: LAYOUT.recipeRows.y + i * (h + CHIP_GAP), w: LAYOUT.recipeRows.w, h };
}

/**
 * Model artwork boxes. These deliberately EXCEED `SAFE_RECT` — the miniature is
 * the reason anyone posts the clip, so it gets the room, and the recipe scrim
 * covers whatever it overlaps once the cascade starts.
 */
export const FULL_BOX: Rect = { x: 70, y: 150, w: 940, h: 1250 };
/** Outro framing. Height is 770 px = 40.1% of the frame: the model must never
 *  drop below 40%, and a previous pass let it shrink to 29.6%. */
export const COMPACT_BOX: Rect = { x: 150, y: 190, w: 780, h: 770 }; // y 190–960

/**
 * Everything below the safe area is DECORATION and carries no information, so a
 * platform caption bar can cover all of it and the viewer loses nothing. Before
 * this the band was plain black — 490 px of dead frame, a quarter of the height.
 */
export const DECOR_BAND: Rect = {
  x: 0,
  y: SAFE_RECT.y + SAFE_RECT.h,
  w: CANVAS_W,
  h: CANVAS_H - (SAFE_RECT.y + SAFE_RECT.h),
};

/** Where the recipe scrim begins its fade — above the heading, over the model. */
export const RECIPE_SCRIM_TOP = LAYOUT.recipeHeading.y - 60;

/** True when `r` lies entirely inside `SAFE_RECT`. */
export function insideSafeArea(r: Rect): boolean {
  return (
    r.x >= SAFE_RECT.x &&
    r.y >= SAFE_RECT.y &&
    r.x + r.w <= SAFE_RECT.x + SAFE_RECT.w &&
    r.y + r.h <= SAFE_RECT.y + SAFE_RECT.h
  );
}

export interface Pt {
  x: number;
  y: number;
}

/**
 * The dog-leg a callout's leader line takes: label end → elbow → anchor.
 *
 * Pulled out of the draw call and made pure so the one property that actually
 * matters can be asserted. On a shipped export BROWN's leader ended in a stub
 * pointing at empty space and RED had no visible line at all, and neither was
 * catchable while the geometry lived inline between `ctx.moveTo` calls.
 *
 * The path always TERMINATES ON the anchor — that is the contract, and the test
 * checks the last point, not the intent.
 */
export function calloutLeaderPath(opts: {
  side: 'left' | 'right';
  /** x where the line may start: past the chip AND past the label glyphs. */
  leaderStart: number;
  railY: number;
  anchorX: number;
  anchorY: number;
  /** Near edge of the model rect, so the elbow turns outside the artwork. */
  modelEdge: number;
}): Pt[] {
  const { side, leaderStart, railY, anchorX, anchorY, modelEdge } = opts;
  // Turn the corner on the FAR side of the label, then hop to the anchor.
  // Clamping the elbow to the model's edge alone put it between the chip and
  // the label, so the horizontal run doubled back straight through the type.
  const elbowX =
    side === 'left'
      ? Math.min(Math.max(leaderStart, modelEdge - 26), Math.max(anchorX - 12, leaderStart))
      : Math.max(Math.min(leaderStart, modelEdge + 26), Math.min(anchorX + 12, leaderStart));
  return [
    { x: leaderStart, y: railY },
    { x: elbowX, y: railY },
    { x: elbowX, y: anchorY },
    { x: anchorX, y: anchorY },
  ];
}

/** Total drawn length of a polyline — a leader with no length is a leader the
 *  viewer never sees, however correct its endpoints are. */
export function pathLength(pts: Pt[]): number {
  let d = 0;
  for (let i = 1; i < pts.length; i++) d += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return d;
}

/** True when two rects overlap at all. */
export function intersects(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

/** Model height as a fraction of the frame, for the ≥40% guard. */
export function modelHeightFraction(box: Rect): number {
  return box.h / CANVAS_H;
}

export const FRAME = { w: CANVAS_W, h: CANVAS_H };
