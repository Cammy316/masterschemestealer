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
export const SAFE_RECT: Rect = { x: 40, y: 190, w: 860, h: 1240 }; // x 40–900, y 190–1430

/**
 * Horizontal centre for all centred text.
 *
 * NOT the frame centre. The usable band is x 110–900 (the action rail eats the
 * right edge), so centring on 540 would sit every heading 35 px right of the
 * recipe rows stacked directly beneath them. Everything in the information
 * column shares this axis instead.
 */
export const CONTENT_CX = 505;
/** Widest a centred element can be and still clear both edges of the band. */
const CENTRED_W = 720;
const CENTRED_X = CONTENT_CX - CENTRED_W / 2; // 145

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
  /** Four paint rows. Right edge stops at 900 to clear the action rail. */
  recipeRows: { x: 110, y: 1055, w: 790, h: 372 },
  /** End card, shown alone on a clean frame. */
  endCardTitle: { x: CENTRED_X, y: 1120, w: CENTRED_W, h: 52 },
  endCardSub: { x: CENTRED_X, y: 1184, w: CENTRED_W, h: 32 },
  /** Numbered callout chips. These are INFORMATION — the right rail previously
   *  sat at x≈1028, i.e. underneath the like/comment/share column. */
  calloutChipLeft: { x: CALLOUT_RAIL.left - CALLOUT_CHIP_R, y: SAFE_RECT.y, w: CALLOUT_CHIP_R * 2, h: 68 },
  calloutChipRight: { x: CALLOUT_RAIL.right - CALLOUT_CHIP_R, y: SAFE_RECT.y, w: CALLOUT_CHIP_R * 2, h: 68 },
} as const;

export const CHIP_H = 84;
export const CHIP_GAP = 12;

/** Vertical centre of recipe row `i`. */
export function recipeRowY(i: number): number {
  return LAYOUT.recipeRows.y + i * (CHIP_H + CHIP_GAP);
}

/**
 * Model artwork boxes. These deliberately EXCEED `SAFE_RECT` — the miniature is
 * the reason anyone posts the clip, so it gets the room, and the recipe scrim
 * covers whatever it overlaps once the cascade starts.
 */
export const FULL_BOX: Rect = { x: 70, y: 150, w: 940, h: 1250 };
/** Outro framing. Height is 770 px = 40.1% of the frame: the model must never
 *  drop below 40%, and a previous pass let it shrink to 29.6%. */
export const COMPACT_BOX: Rect = { x: 150, y: 300, w: 780, h: 770 };

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

/** Model height as a fraction of the frame, for the ≥40% guard. */
export function modelHeightFraction(box: Rect): number {
  return box.h / CANVAS_H;
}

export const FRAME = { w: CANVAS_W, h: CANVAS_H };
