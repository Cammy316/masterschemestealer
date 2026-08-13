/**
 * The warp-cast: Engine A's storyboard for INSPIRATION scans.
 *
 * A palette poster, not a scan readout. The reference is the Cinema Palettes
 * format — a still with a band of solid colour beneath it, no chrome and no
 * narration — and the whole clip exists to earn that poster one colour at a
 * time and then hold it.
 *
 * v1 of this file reused the miniature's phase table and its visual grammar,
 * and the result was measurable rather than arguable: no palette anywhere, 25.5%
 * of the frame dead, the image boxed at 61% of frame width behind corner
 * brackets. It was the pict-cast wearing purple. This is a rebuild.
 *
 * Deliberately NOT here: corner brackets, scanline veils, HUD garble, greyscale,
 * smash cuts, `COMMUNING…`, ΔE alarm pills. All of that is Auspex language and
 * belongs to the miniature clip.
 *
 * What IS reused, through `RevealStoryboard`: the entire encode path (frame
 * pacing, BT.709, the colr patch, backpressure, abort), the origin scanner and
 * the grain tiles. Machinery, not grammar.
 */

import type { Color } from '../types';
import { CANVAS_H, CANVAS_W, SAFE_RECT, type Rect } from './revealLayout';
import {
  buildGrainTiles,
  drawText,
  hexToRgba,
  loadImage,
  outputSize,
  resolveFonts,
  type RevealFonts,
} from './revealCompose';
import type { RevealSkin } from './revealLayers';
import { themeFor } from './revealTheme';
import {
  sortRegionsForReveal,
  type RevealRegion,
  type RevealSpec,
  type CaptionPreset,
  type WallRow,
} from './revealTimeline';
import { WARP_DURATION_MS, bandPourWindow, warpFrameState, type WarpFrameState } from './warpTimeline';
import { scanColourOrigins, fallbackOrigins } from './warpOrigins';
import { scheduleWarpAudio, warpAudioBeats } from './warpAudio';
import type { RevealStoryboard } from './revealStoryboard';
import type { RenderRevealOptions } from './renderRevealVideo';

/** Most colours a palette can carry. Past six the bands stop being readable and
 *  the poster stops being a palette. */
export const WARP_MAX_COLOURS = 6;

/**
 * Layout — the Cinema Palettes poster, adapted to 9:16.
 *
 * Measured off the reference (1064×808): image 73.0% of height, a 7 px gap, the
 * swatch row 24.1%, a 7 px bottom margin, and 7 px gaps between swatches — all
 * of them WHITE, because the reference's canvas is white. The gaps are most of
 * why it reads as designed rather than assembled.
 *
 * So the ground is off-white and fills the frame, and the image and swatches sit
 * on it with even gaps. That replaces the blurred backdrop entirely: a blurred
 * ground and a white gutter cannot both be the thing behind the poster, and the
 * gutter is what the format actually needs.
 *
 * FILLING THE FRAME is a genuine conflict, not a setting. The reference is a 4:3
 * canvas; ours is 9:16, nearly three times taller relative to width. Holding the
 * reference's 73/24 split at 1080 wide needs an image 1402 px tall — an aspect
 * of 0.77, i.e. portrait. A landscape photo cannot do that without being cropped
 * to pieces. The resolution is that the PALETTE flexes: the image is cropped
 * only as far as `MIN_WIDTH_KEPT` allows, and the swatch row absorbs whatever
 * height is left. Portrait photos land on reference proportions; a 16:9 photo
 * gets a mild crop and taller columns. Either way the frame is full.
 */
/**
 * The ONLY gaps in the composition, measured off the reference: between
 * swatches, and between the image and the swatch row. There is no outer margin
 * — the reference bleeds to its top, left and right edges, and adding a border
 * of ground did two things wrong at once. It framed the poster like a slide,
 * and it put ground either side of the end swatches, so a near-white paint at
 * one end vanished into it.
 */
const GAP = 10;
/** Off-white ground. Warmed slightly off pure white — 255 against six saturated
 *  swatches glares on an OLED phone. */
const GROUND = '#F2F0EA';
/** Ink for anything drawn on the ground. */
const GROUND_INK = '#1A1720';
/** An un-poured swatch slot: a shade off the ground, never a dark hole. */
const SLOT = '#E4E0D8';
/** Share of the usable height the swatch row wants, from the reference. */
const PALETTE_SHARE = 0.26;
const PALETTE_MIN = 340;
const PALETTE_MAX = 620;
/**
 * The narrowest the image may be DISPLAYED at: 4:5.
 *
 * This is the whole "gentle" in gentle crop, and it binds in both directions —
 * a wide photo is cropped at the sides no further than 4:5, and a tall one is
 * cropped top and bottom no further than 4:5. Past that the palette grows
 * instead, which is a better trade than throwing away half of someone's
 * photograph to satisfy a proportion.
 *
 * A first pass capped the crop at "keep 60% of the width", which let a 16:9
 * photo push the swatch row to 895 px — 47% of the frame, colour bars rather
 * than a palette. 4:5 puts the same photo at a 543 px row, near the reference.
 */
const MIN_DISPLAY_ASPECT = 0.8;

/**
 * Blur radius of the soft-focus twin, in pixels at the 1080-wide canvas.
 *
 * BOUNDED ON PURPOSE. The harness gate is: no window longer than 0.35 s may sit
 * below 70% of the clip's median sharpness. At 9px this clip spent 1.6 s at
 * 44-47%. Raising this re-opens that defect, which is why it is a named
 * constant with a test on it rather than a number inside a filter string.
 */
export const SOFT_BLUR_PX = 2;

/**
 * How much of the soft twin may ever replace the sharp hero.
 *
 * The drain's feeling comes from the desaturation and luminance drop, which are
 * baked into the twin at full strength; keeping 35% of the sharp image
 * underneath costs almost nothing visually and is what actually clears the
 * sharpness gate. Derived, not guessed: whole-frame ratio is approximately
 * 1 - 0.494 * mix at a 2px blur, so mix = 0.65 lands near 0.78 of median
 * against a 0.75 floor.
 */
export const SOFT_MAX_MIX = 0.65;

/** The ceiling the above must respect. See warpDefocus.test.ts. */
export const SOFT_BLUR_MAX_PX = 4;

/**
 * Height reserved at the TOP of the palette region for the horizontal label
 * strip, so names and ΔE sit above y=1430 — the platform caption line.
 *
 * Measured on the shipped export: 15.3% of detail pixels were below 1430 and
 * 9.8% right of x=900, with the names rendering at y≈1600-1750, behind TikTok's
 * caption and the action rail. Swatch colour FIELDS still bleed to the frame
 * bottom because they are artwork; type is information and may not.
 *
 * 70 is not arbitrary: for the reference layout the palette starts at y=1360,
 * so the strip ends exactly on y=1430 — the caption line. Everything above
 * that line is type, everything below it is artwork, with no sliver between.
 */
export const LABEL_STRIP_H = 70;

/** Ken Burns range. The image is CLIPPED to its rect, so the poster edges stay
 *  crisp while the picture inside them moves. */
const KEN_BURNS = 0.08;

export interface PosterLayout {
  image: Rect;
  palette: Rect;
}

/** Where the poster's two pieces sit, for an image of the given dimensions. */
export function posterLayout(imgW: number, imgH: number): PosterLayout {
  const w = CANVAS_W;
  const usable = CANVAS_H - GAP;
  const aspect = imgW / Math.max(1, imgH);

  // What the reference proportions would ask for.
  const wanted = Math.min(PALETTE_MAX, Math.max(PALETTE_MIN, Math.round(usable * PALETTE_SHARE)));
  // The tallest the image may be drawn before the crop passes 4:5.
  const cropCeiling = w / MIN_DISPLAY_ASPECT;

  const imageH = Math.round(Math.min(usable - wanted, cropCeiling));
  const paletteH = usable - imageH;

  return {
    image: { x: 0, y: 0, w, h: imageH },
    palette: { x: 0, y: imageH + GAP, w, h: paletteH },
  };
}

/** Relative luminance of a swatch, deciding whether its transient label is dark
 *  or light ink. 150 sits between Citadel's mid tones in practice — verified
 *  against the yellow whose name vanished into its own band first time round. */
function isLightSwatch(hex: string): boolean {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return false;
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) > 150;
}

/** Perceptual lightness of a hex, for ordering the palette. */
function swatchLuma(hex: string): number {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return 0;
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
}

/**
 * Which column each colour occupies: darkest on the left, lightest on the right.
 *
 * This deliberately DECOUPLES position from pour order. Colours pour in coverage
 * order — smallest first, dominant last — because that is a narrative choice and
 * it drives the audio beats. But a palette laid out in coverage order looks
 * arbitrary, and the reference format is unmistakably graded: dark navy through
 * blues to light, then warm. Sorting the columns by tone is the single change
 * that makes the finished poster read as designed rather than dumped.
 *
 * It also makes the pour better: consecutive droplets land in scattered columns
 * instead of marching left to right.
 *
 * Returns `column[i]` for wall row `i`.
 */
export function columnOrder(hexes: string[]): number[] {
  const ranked = hexes
    .map((hex, i) => ({ i, luma: swatchLuma(hex) }))
    // Ties broken by original index so the result is fully deterministic.
    .sort((a, b) => a.luma - b.luma || a.i - b.i);
  const columns = new Array<number>(hexes.length);
  ranked.forEach((entry, col) => {
    columns[entry.i] = col;
  });
  return columns;
}

/** Rect of swatch `i` of `n`. Flush to the poster's edges, gaps only between —
 *  the same GAP used everywhere else, so the grid reads as one system. */
export function swatchRect(i: number, n: number, palette: Rect): Rect {
  const count = Math.max(1, n);
  const colW = (palette.w - (count - 1) * GAP) / count;
  // The strip owns the top of the palette region. The offset lives HERE rather
  // than at the call sites so the swatches, the landing flash and the droplet's
  // target can never disagree about where a column actually is.
  return {
    x: palette.x + i * (colW + GAP),
    y: palette.y + LABEL_STRIP_H,
    w: colW,
    h: palette.h - LABEL_STRIP_H,
  };
}

export interface WarpResources {
  spec: RevealSpec;
  fonts: RevealFonts;
  imgW: number;
  imgH: number;
  /** Blurred, darkened cover-fit of the photo — fills every pixel of the frame. */
  backdropLayer: HTMLCanvasElement;
  /** The photo, sharp, at composition scale. */
  heroLayer: HTMLCanvasElement;
  /** Soft-focus twin, cross-faded in for the drain and bloom instead of a
   *  greyscale veil. Desaturating an inspiration photo would fight the one thing
   *  the clip is about. */
  softLayer: HTMLCanvasElement;
  grainTiles: HTMLCanvasElement[];
  /** Column each wall row occupies, by tone — see columnOrder. Computed once
   *  rather than per frame, and it must be stable or the palette would reshuffle
   *  mid-clip. */
  columns: number[];
  loopTargetLayer: HTMLCanvasElement;
}

// ---- spec --------------------------------------------------------------------

/**
 * Build the warp spec from a maskless inspiration scan.
 *
 * Keeps only colours with a matched paint for the chosen brand: a band with no
 * paint behind it is a colour we cannot deliver, and the poster is a promise
 * that we can.
 */
export function buildWarpSpec(
  colors: Color[],
  brand: keyof NonNullable<Color['paintRecipe']> | string,
  brandLabel: string,
  skin: RevealSkin,
  captionPreset: CaptionPreset,
  durationMs: number,
): RevealSpec {
  const brandKey = brand as keyof NonNullable<Color['paintRecipe']>;
  const usable = colors
    .map((c, index) => ({ c, index }))
    .filter(({ c }) => !!c.paintRecipe?.[brandKey]?.base);

  if (usable.length === 0) throw new Error('No colours to bind.');

  const top = [...usable]
    .sort((a, b) => (b.c.percentage ?? 0) - (a.c.percentage ?? 0))
    .slice(0, WARP_MAX_COLOURS);

  const regions: RevealRegion[] = top.map(({ c, index }) => ({
    index,
    hex: c.hex,
    family: c.family ?? c.hex,
    // Overwritten by the pixel scan in prepareWarpResources.
    position: { x: 0.5, y: 0.5 },
    percentage: c.percentage ?? 0,
  }));

  const ordered = sortRegionsForReveal(regions);

  const wall: WallRow[] = ordered.map((r) => {
    const src = colors[r.index];
    const base = src.paintRecipe![brandKey]!.base!;
    return {
      extractedHex: r.hex,
      family: r.family,
      paintName: base.name,
      paintHex: base.hex,
      brand: brandLabel,
      deltaE: base.deltaE ?? 0,
      colourIndex: r.index,
    };
  });

  return {
    skin,
    regions: ordered,
    recipe: [],
    brand: brandLabel,
    colourCount: ordered.length,
    durationMs,
    captionPreset,
    recipeRegionIndex: -1,
    wall,
  };
}

// ---- resources ---------------------------------------------------------------

function makeLayer(w: number, h: number): { c: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  return ctx ? { c, ctx } : null;
}

/** Cover-fit source dims into a box: fills it completely, cropping the overflow.
 *  Only ever used for the BLURRED backdrop, where a crop costs nothing. */
function coverRect(srcW: number, srcH: number, box: Rect): Rect {
  const scale = Math.max(box.w / srcW, box.h / srcH);
  const w = srcW * scale;
  const h = srcH * scale;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

export async function prepareWarpResources(
  imageUrl: string,
  spec: RevealSpec,
  outputScale = 1,
): Promise<WarpResources> {
  const img = await loadImage(imageUrl);

  // Layers are built at the largest size they can ever be DRAWN at, not at the
  // photo's native size — a 12 MP phone photo would otherwise be resampled in
  // full on every one of 420 frames.
  // The image is drawn full-bleed and can be pushed in by the Ken Burns, so it
  // has to exist at a little over frame width.
  const maxDrawW = CANVAS_W * (1 + KEN_BURNS) * 1.05;
  const scale = Math.min(1, maxDrawW / img.naturalWidth);
  const imgW = Math.max(1, Math.round(img.naturalWidth * scale));
  const imgH = Math.max(1, Math.round(img.naturalHeight * scale));

  const hero = makeLayer(imgW, imgH);
  if (!hero) throw new Error('2D canvas unavailable');
  hero.ctx.drawImage(img, 0, 0, imgW, imgH);

  // Soft-focus twin, cross-faded in by `soften` for the drain and bloom.
  //
  // The blur used to be 9px, and at soften = 1 through the whole bloom that put
  // 1.6 s of the shipped clip at 44-47% of its own median sharpness — measured
  // t=2.27-3.83s on the 2026-08-12 export. That is 11% of the runtime, sitting
  // exactly where a viewer decides whether to keep watching, on a product whose
  // entire claim is colour accuracy.
  //
  // The drain still reads, because the drain was never really the blur: it is
  // the desaturation and the luminance drop, which are now doing the work
  // alone at full strength. The register already prohibits colour grading the
  // footage for this product, and defocusing it is the same argument in
  // another dimension.
  const soft = makeLayer(imgW, imgH);
  if (!soft) throw new Error('2D canvas unavailable');
  if ('filter' in soft.ctx) {
    soft.ctx.filter = `blur(${SOFT_BLUR_PX}px) saturate(0.52) brightness(0.72)`;
  }
  soft.ctx.drawImage(img, 0, 0, imgW, imgH);
  soft.ctx.filter = 'none';

  // The ground. Flat off-white, filling the frame: with white gutters between
  // every element there is nothing for a blurred backdrop to be — it would only
  // ever show through the gaps, where it would read as dirt rather than depth.
  const backdrop = makeLayer(CANVAS_W, CANVAS_H);
  if (!backdrop) throw new Error('2D canvas unavailable');
  backdrop.ctx.fillStyle = GROUND;
  backdrop.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Where each colour actually lives in the picture — the droplets have to come
  // from somewhere real or the poster is decoration rather than a reading.
  const SCAN_MAX = 200;
  const sScale = Math.min(1, SCAN_MAX / Math.max(imgW, imgH));
  const scanW = Math.max(1, Math.round(imgW * sScale));
  const scanH = Math.max(1, Math.round(imgH * sScale));
  const scanCanvas = makeLayer(scanW, scanH);
  let origins = fallbackOrigins(spec.regions.length);
  if (scanCanvas) {
    scanCanvas.ctx.drawImage(img, 0, 0, scanW, scanH);
    try {
      const data = scanCanvas.ctx.getImageData(0, 0, scanW, scanH);
      origins = scanColourOrigins(
        data,
        spec.regions.map((r) => r.hex),
      );
    } catch {
      origins = fallbackOrigins(spec.regions.length);
    }
  }
  spec.regions.forEach((r, i) => {
    r.position = origins[i] ?? { x: 0.5, y: 0.5 };
  });

  const loopTarget = makeLayer(CANVAS_W, CANVAS_H);
  if (!loopTarget) throw new Error('2D canvas unavailable');

  const res: WarpResources = {
    spec,
    fonts: resolveFonts(),
    imgW,
    imgH,
    backdropLayer: backdrop.c,
    heroLayer: hero.c,
    softLayer: soft.c,
    grainTiles: buildGrainTiles(),
    columns: columnOrder((spec.wall ?? []).map((w) => w.paintHex)),
    loopTargetLayer: loopTarget.c,
  };

  drawWarpLoopTarget(loopTarget.ctx, res);
  return res;
}

// ---- geometry ----------------------------------------------------------------

/**
 * The poster's image frame — fixed, so its edges stay crisp against the
 * swatches. The Ken Burns happens INSIDE it (see drawPosterImage), which is what
 * lets the picture move without the poster itself wobbling.
 */
function posterAt(res: WarpResources): PosterLayout {
  return posterLayout(res.imgW, res.imgH);
}

/** Draw the photo into its frame, clipped, with a slow push and drift. Sharp
 *  and soft twins are cross-faded by `soften`. */
function drawPosterImage(
  ctx: CanvasRenderingContext2D,
  state: WarpFrameState,
  res: WarpResources,
  frame: Rect,
): void {
  const push = 1 + KEN_BURNS * (0.5 - 0.5 * Math.cos(state.progress * Math.PI * 2));
  const w = frame.w * push;
  const h = frame.h * push;
  const r: Rect = {
    x: frame.x - (w - frame.w) / 2 + state.camera.driftX,
    y: frame.y - (h - frame.h) / 2 + state.camera.driftY,
    w,
    h,
  };
  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();
  ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  if (state.soften > 0) {
    // Capped, not just narrowed. Measured on the shipped export: the photo
    // carries ~70% of the frame's gradient energy, so at full mix even a 2px
    // blur leaves the frame at ~0.66 of its median sharpness — under the 0.70
    // gate. Reducing the blur radius alone cannot get there; the cross-fade
    // has to stop short of fully replacing the sharp hero. See SOFT_BLUR_PX.
    ctx.globalAlpha = state.soften * SOFT_MAX_MIX;
    ctx.drawImage(res.softLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  }
  ctx.restore();
}

// ---- captions ----------------------------------------------------------------

/**
 * The single line of copy, shown only while the palette is assembling.
 *
 * v1 narrated every phase (`COMMUNING…`, `BINDING… 3/6 ESSENCES`) and v2 held a
 * headline over the finished poster. Neither is the reference format, which
 * carries no type at all. The line now rides the swatch labels: up while the
 * colours land, gone for the poster.
 */
export function warpCaptionText(spec: RevealSpec, _state: WarpFrameState): string | null {
  if (spec.captionPreset === 'none') return null;
  return 'THE EXACT PAINTS IN THIS IMAGE';
}

// ---- drawing -----------------------------------------------------------------

/** Continuous motion. Grain touches every pixel including the flat colour bands,
 *  which is what stops a 2.5 s hold measuring as a frozen frame. Periodic in
 *  `p`, so the loop seam survives. */
function drawWarpAmbient(ctx: CanvasRenderingContext2D, res: WarpResources, p: number): void {
  const tiles = res.grainTiles;
  if (!tiles.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.032;
  // 840 steps, not the miniature's 320. At 30 fps a 14 s clip is 420 frames, so
  // 320 steps advance the tile on only ~76% of them — the other 24% of frame
  // pairs get an IDENTICAL grain field and contribute nothing to motion, which
  // is what left the payoff hold clearing the anti-freeze floor by 0.006.
  // 840 is a multiple of the tile count, so p=1 still lands on tile 0 and the
  // loop seam stays pixel-exact.
  const idx = Math.floor(p * 840) % tiles.length;
  ctx.drawImage(tiles[idx], 0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();
}

/** The light that passes through the image before the pours begin. A soft
 *  aurora, not a scan line — the miniature's hard-edged sweep is exactly the
 *  cogitator language this clip is getting away from. */
function drawBloom(ctx: CanvasRenderingContext2D, r: Rect, accent: string, t: number): void {
  const cy = r.y + (0.15 + 0.8 * t) * r.h;
  const band = r.h * 0.55;
  const g = ctx.createLinearGradient(0, cy - band, 0, cy + band);
  g.addColorStop(0, hexToRgba(accent, 0));
  g.addColorStop(0.5, hexToRgba(accent, 0.32 * Math.sin(t * Math.PI)));
  g.addColorStop(1, hexToRgba(accent, 0));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.fillRect(r.x, cy - band, r.w, band * 2);
  ctx.restore();
}

/** The point on the image a colour is being drawn out of. */
function drawSourcePoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hex: string,
  swell: number,
): void {
  if (swell <= 0) return;
  const r = 26 + 36 * swell;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const halo = ctx.createRadialGradient(x, y, 0, x, y, r);
  halo.addColorStop(0, hexToRgba(hex, 0.85 * swell));
  halo.addColorStop(0.45, hexToRgba(hex, 0.35 * swell));
  halo.addColorStop(1, hexToRgba(hex, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** The droplet falling from the image into its band. */
function drawDroplet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hex: string,
  alpha: number,
): void {
  ctx.save();
  ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
  const halo = ctx.createRadialGradient(x, y, 0, x, y, 46);
  halo.addColorStop(0, hexToRgba(hex, 0.55));
  halo.addColorStop(1, hexToRgba(hex, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, 46, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = hex;
  ctx.beginPath();
  ctx.arc(x, y, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.beginPath();
  ctx.ellipse(x - 5, y - 6, 5.5, 3.8, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * The palette: vertical swatches of solid colour, flush edge to edge.
 *
 * No permanent type. The reference format carries none, and burning six paint
 * names into the poster is exactly what stopped the previous cut reading like
 * one. Each name appears on its own swatch as the colour lands, stays while the
 * palette assembles so the whole set can be read, and fades before the payoff
 * hold — see `labelAlpha` in warpTimeline.
 *
 * The ΔE rides with the name, and is a quiet figure rather than a coloured
 * alarm. A hard-to-match photo legitimately returns several values above 10;
 * rendering that as red pills reads as the product failing rather than as the
 * product being honest. The numbers are never altered.
 */
function drawPalette(
  ctx: CanvasRenderingContext2D,
  state: WarpFrameState,
  res: WarpResources,
  palette: Rect,
): void {
  const rows = res.spec.wall ?? [];
  const n = rows.length;
  if (n === 0) return;


  // The flash goes down FIRST, so the swatches cover it and it survives only in
  // the gutters. See drawPulseUnder.
  if (state.pulse) {
    const hit = rows[state.pulse.index];
    if (hit) {
      drawPulseUnder(
        ctx,
        hit.extractedHex,
        state.pulse.strength,
        swatchRect(res.columns[state.pulse.index] ?? state.pulse.index, n, palette),
        palette,
      );
    }
  }

  rows.forEach((row, i) => {
    const band = state.bands[i];
    if (!band) return;
    const base = swatchRect(res.columns[i] ?? i, n, palette);
    // The landing swatch overshoots its column and settles back. A geometric
    // beat rather than a colour one: it cannot misrepresent the paint.
    const kick = state.pulse && state.pulse.index === i ? state.pulse.strength * 7 : 0;
    const r: Rect = kick ? { x: base.x - kick, y: base.y, w: base.w + kick * 2, h: base.h } : base;

    // Empty slot. A shade off the ground rather than a dark plate — on a white
    // card a dark plate is a hole, and the gaps between swatches have to read as
    // the SAME gutter whether the swatch above them is filled or not.
    ctx.save();
    ctx.fillStyle = SLOT;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.restore();

    if (band.fill > 0) {
      // Pours UPWARD from the base of its column — the droplet fell in, so the
      // colour fills the way liquid would.
      const fh = r.h * band.fill;
      ctx.save();
      ctx.fillStyle = row.paintHex;
      ctx.fillRect(r.x, r.y + r.h - fh, r.w, fh);
      ctx.restore();
    }

    // Hairline. Invisible against a dark swatch and load-bearing against a pale
    // one: a near-white paint beside a near-white gutter has no edge otherwise,
    // and the palette silently loses a colour.
    ctx.save();
    ctx.strokeStyle = 'rgba(0,0,0,0.10)';
    ctx.lineWidth = 1;
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
    ctx.restore();

  });

  drawLabelStrip(ctx, state, res, palette);
}

/**
 * Paint name and ΔE, horizontal, in the strip above the caption line.
 *
 * Replaces six rotated labels of ~24px cap height — roughly 9pt on a phone,
 * with the ΔE at ~14px (~5pt), which is not readable at arm's length at all.
 * Contrast was never the problem (6.75:1 and 6.84:1 measured); size and
 * orientation were. One name at a time can be twice the size and still fit.
 */
function drawLabelStrip(
  ctx: CanvasRenderingContext2D,
  state: WarpFrameState,
  res: WarpResources,
  palette: Rect,
): void {
  const strip = state.strip;
  if (!strip || strip.alpha <= 0) return;
  const rows = res.spec.wall ?? [];
  const row = rows[strip.index];
  if (!row) return;


  const cy = palette.y + LABEL_STRIP_H / 2;

  ctx.save();
  ctx.globalAlpha = strip.alpha;

  // A chip of the paint itself, so the name is anchored to a colour rather than
  // floating over the gutter.
  const chipR = 13;
  ctx.beginPath();
  ctx.arc(palette.x + 26, cy - 6, chipR, 0, Math.PI * 2);
  ctx.fillStyle = row.paintHex;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();

  drawText(ctx, row.paintName.toUpperCase(), palette.x + 52, cy - 14, {
    font: res.fonts.cyber,
    size: 38,
    weight: 700,
    colour: GROUND_INK,
    align: 'left',
    letter: 1.5,
    maxWidth: SAFE_RECT.x + SAFE_RECT.w - 250,
  });

  // Right-aligned to the SAFE edge, not the frame edge. Measured on the first
  // cut of this strip: at the frame edge the ΔE landed at x≈1054, i.e. under
  // the platform action rail, which is the same defect the strip exists to fix
  // — moved from the bottom of the frame to the side of it.
  drawText(ctx, `ΔE ${row.deltaE.toFixed(1)}`, SAFE_RECT.x + SAFE_RECT.w - 20, cy - 10, {
    font: res.fonts.cyber,
    size: 26,
    weight: 600,
    colour: 'rgba(26,23,32,0.78)',
    align: 'right',
    letter: 1,
    maxWidth: 180,
  });

  ctx.restore();
}

function drawPaletteSheen(
  ctx: CanvasRenderingContext2D,
  p: number,
  filled: number,
  palette: Rect,
): void {
  if (filled <= 0) return;
  const span = CANVAS_W * 2.2;
  const cx = -span * 0.5 + p * (CANVAS_W + span);
  const g = ctx.createLinearGradient(cx - span * 0.28, 0, cx + span * 0.28, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, `rgba(255,255,255,${0.055 * filled})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.beginPath();
  ctx.rect(palette.x, palette.y, palette.w, palette.h);
  ctx.clip();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.fillRect(palette.x, palette.y, palette.w, palette.h);
  ctx.restore();
}

/**
 * The only branding that survives a re-upload, so it is in every frame — but
 * with the outer margin gone there is no ground left to put it on. It sits in
 * the bottom-left of the IMAGE instead, the way a photo credit does: small, low
 * contrast, and carrying its own shadow so it stays legible over a light or a
 * dark photograph without knowing which it is.
 */
/**
 * The landing flash, drawn UNDER the swatches.
 *
 * Two earlier versions were wrong in instructive ways. The first washed the
 * whole frame in the arriving colour, which tinted the PHOTOGRAPH — the one
 * thing this product must not do, for the same reason the miniature clip refuses
 * to hue-shift the model even for three frames. The second confined it to the
 * palette but drew it on top, which additively blew a pale ground toward white
 * and tinted the neighbouring swatches — and those swatches ARE paint colours we
 * are claiming to have measured. Misrepresenting them for 300 ms is still
 * misrepresenting them.
 *
 * Drawn under, the glow can only appear in the gutters and on empty slots.
 * Nothing that carries a colour claim is touched, and the beat still reads,
 * because a colour blooming out of the gaps around a swatch is exactly the
 * "something landed here" signal wanted.
 */
function drawPulseUnder(
  ctx: CanvasRenderingContext2D,
  hex: string,
  strength: number,
  swatch: Rect,
  palette: Rect,
): void {
  if (strength <= 0) return;
  const cx = swatch.x + swatch.w / 2;
  const cy = swatch.y + swatch.h / 2;
  const r = swatch.w * 2.2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(palette.x, palette.y, palette.w, palette.h);
  ctx.clip();
  const g = ctx.createRadialGradient(cx, cy, swatch.w * 0.1, cx, cy, r);
  g.addColorStop(0, hexToRgba(hex, 0.95 * strength));
  g.addColorStop(0.5, hexToRgba(hex, 0.4 * strength));
  g.addColorStop(1, hexToRgba(hex, 0));
  ctx.fillStyle = g;
  ctx.fillRect(cx - r, palette.y, r * 2, palette.h);
  ctx.restore();
}

function drawWarpWatermark(ctx: CanvasRenderingContext2D, res: WarpResources, image: Rect): void {
  ctx.save();
  // Deliberately faint. This poster is something people share as a picture, and
  // a legible-but-unignorable mark across the corner is the difference between
  // a credit and a stamp. The shadow does the work the opacity gives up: at 38%
  // white the glyphs alone would vanish on a pale photograph, so they carry
  // their own dark edge and stay findable on anything.
  const opts = {
    font: res.fonts.cyber,
    size: 17,
    weight: 600,
    align: 'left' as CanvasTextAlign,
    letter: 2,
  };
  const x = image.x + 22;
  const y = image.y + image.h - 20;

  // Halo and glyph are drawn separately so they can be tuned against opposite
  // problems. A single pass with a shadow could not do both: the shadow is
  // multiplied by the same globalAlpha as the text, so making the mark fainter
  // made it vanish on a WHITE photograph, and a second pass fixed the halo only
  // by re-filling the glyphs back to the opacity we were trying to lose.
  //
  // Measured luma spread over the mark, white photo / dark photo:
  //   single pass at 0.38   40 / 99      (thin on white)
  //   double pass at 0.38   66 / 154     (but effectively 0.62 opacity again)
  //   this                  ~75 / ~85    (faint on both, legible on both)
  ctx.globalAlpha = 0.3;
  ctx.shadowColor = 'rgba(0,0,0,0.9)';
  ctx.shadowBlur = 10;
  drawText(ctx, 'schemestealer', x, y, { ...opts, colour: 'rgba(0,0,0,0.9)' });
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = 0.4;
  drawText(ctx, 'schemestealer', x, y, { ...opts, colour: '#ffffff' });
  ctx.restore();
}

// ---- compose -----------------------------------------------------------------

export function composeWarp(
  ctx: CanvasRenderingContext2D,
  state: WarpFrameState,
  res: WarpResources,
): void {
  const { spec } = res;
  const accent = themeFor(spec.skin).accent;
  const poster = posterAt(res);
  const frame = poster.image;

  ctx.drawImage(res.backdropLayer, 0, 0, CANVAS_W, CANVAS_H);
  drawPosterImage(ctx, state, res, frame);

  if (state.bloom !== null) drawBloom(ctx, frame, accent, state.bloom);

  // The colour being drawn out of the picture, and its fall into its swatch.
  if (state.droplet) {
    const region = spec.regions[state.droplet.index];
    const row = spec.wall?.[state.droplet.index];
    if (region && row) {
      const sx = frame.x + region.position.x * frame.w;
      const sy = frame.y + region.position.y * frame.h;
      drawSourcePoint(ctx, sx, sy, row.extractedHex, state.droplet.source);
      const t = state.droplet.travel;
      if (t > 0 && t < 1) {
        const target = swatchRect(
          res.columns[state.droplet.index] ?? state.droplet.index,
          spec.wall!.length,
          poster.palette,
        );
        // Eases across to its column then drops in — a straight line from an
        // arbitrary point in the photo to an arbitrary column reads as a
        // scattering rather than a pour.
        drawDroplet(
          ctx,
          sx + (target.x + target.w / 2 - sx) * (t * t),
          sy + (target.y + 24 - sy) * t,
          row.extractedHex,
          Math.sin(Math.min(1, t / 0.92) * Math.PI) + 0.08,
        );
      }
    }
  }

  drawPalette(ctx, state, res, poster.palette);
  drawPaletteSheen(
    ctx,
    state.progress,
    state.bands.reduce((a, b) => a + b.fill, 0) / Math.max(1, state.bands.length),
    poster.palette,
  );

  // No headline. The reference carries no type at all, and a line across the top
  // was the last thing making this read as a slide rather than a poster.

  drawWarpWatermark(ctx, res, frame);
  drawWarpAmbient(ctx, res, state.progress);

  if (state.loopCrossfade > 0) {
    ctx.save();
    ctx.globalAlpha = state.loopCrossfade;
    ctx.drawImage(res.loopTargetLayer, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
}

/** Frame 0 and the loop target: the finished poster. */
export function drawWarpLoopTarget(ctx: CanvasRenderingContext2D, res: WarpResources): void {
  const s0 = warpFrameState(0, res.spec.durationMs, res.spec.wall?.length ?? 0);
  composeWarp(ctx, { ...s0, loopCrossfade: 0 }, res);
}

export function composeWarpAt(ctx: CanvasRenderingContext2D, t: number, res: WarpResources): void {
  composeWarp(ctx, warpFrameState(t, res.spec.durationMs, res.spec.wall?.length ?? 0), res);
}

export const WARP_STORYBOARD: RevealStoryboard<WarpResources> = {
  mode: 'inspiration',
  buildSpec(opts: RenderRevealOptions, durationMs: number) {
    return buildWarpSpec(
      opts.colors,
      opts.brand as string,
      opts.brandLabel,
      opts.skin,
      opts.captionPreset,
      // The warp-cast runs to its OWN length. The caller's default is the
      // miniature's 11 s, and adopting it here would compress the pours back to
      // the pacing this rebuild exists to fix.
      durationMs === 11000 ? WARP_DURATION_MS : durationMs,
    );
  },
  prepare(opts, spec, outputScale) {
    return prepareWarpResources(opts.imageUrl, spec, outputScale);
  },
  composeAt: composeWarpAt,
  audioSchedule: scheduleWarpAudio,
};

// Dev-only hook, so the warp suite can render deterministic frames without an
// encoder.
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__warpDebug = {
    buildWarpSpec,
    prepareWarpResources,
    composeWarpAt,
    warpCaptionText,
    scheduleWarpAudio,
    warpAudioBeats,
    warpFrameState,
    bandPourWindow,
    swatchRect,
    posterLayout,
    outputSize,
    WARP_DURATION_MS,
  };
}
