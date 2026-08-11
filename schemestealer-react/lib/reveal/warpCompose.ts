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
import { CANVAS_H, CANVAS_W, type Rect } from './revealLayout';
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
 * The reference format is a still at FULL WIDTH with a bar of pure colour
 * directly beneath it, edge to edge, carrying no type whatsoever. Two earlier
 * attempts missed it in opposite directions: the first boxed the image at 61%
 * of frame width behind corner brackets, and the second contain-fitted it into
 * a 960x770 box, which left a landscape photo occupying 28% of the frame height
 * with 470 px of dead space below the palette.
 *
 * So the image is full-bleed WIDTH and keeps its natural aspect, the swatches
 * sit flush underneath it, and the whole block is centred as one poster on a
 * blurred, colour-matched ground. Nothing is cropped; the frame has no holes.
 *
 * The block centre sits above the frame centre so the swatches clear the
 * caption zone. Swatches carry no permanent text, so they are ARTWORK and the
 * safe-area rule does not bind them — which is exactly why vertical columns work
 * here and did not in the previous cut, where every column had a name in it and
 * the sixth landed under the action rail.
 */
const SWATCH_H = 330;
/** Hairline of ground between swatches. The reference separates them; touching
 *  blocks read as one smeared gradient rather than a set of paints. */
const SWATCH_GAP = 5;
/**
 * Ceiling on image height.
 *
 * Chosen so the WHOLE poster — image plus swatches — always fits between the
 * safe top and y1400, which guarantees a home for the watermark underneath it
 * inside the safe area. Without the cap, a square photo pushed the palette to
 * y1545 and the mark had nowhere to go but on top of the headline.
 *
 * Only square-and-taller photos hit it; a 16:9 or 4:3 image is still full-bleed
 * width, which is the case the format is really for.
 */
const MAX_IMAGE_H = 850;
/** Vertical centre of the poster block. */
const BLOCK_CY = 780;
/** Ken Burns range. The image is CLIPPED to its rect, so the poster edges stay
 *  crisp while the picture inside them moves. */
const KEN_BURNS = 0.08;
/** Below this, a platform caption bar can cover anything. Artwork may cross it;
 *  the watermark may not. */
const SAFE_FLOOR = 1430;

export interface PosterLayout {
  image: Rect;
  palette: Rect;
}

/** Where the poster's two pieces sit, for an image of the given dimensions. */
export function posterLayout(imgW: number, imgH: number): PosterLayout {
  const natural = Math.round((CANVAS_W * imgH) / Math.max(1, imgW));
  const h = Math.min(MAX_IMAGE_H, natural);
  // Only a very tall portrait hits the ceiling; then the image narrows rather
  // than being cropped.
  const w = h < natural ? Math.round((h * imgW) / Math.max(1, imgH)) : CANVAS_W;
  const blockH = h + SWATCH_H;
  const top = Math.round(BLOCK_CY - blockH / 2);
  const x = Math.round((CANVAS_W - w) / 2);
  // The palette is always exactly as wide as the image. They are one poster, and
  // a narrowed image over a full-bleed colour bar reads as two unrelated
  // elements stacked — the reference has them flush to the same edges.
  return {
    image: { x, y: top, w, h },
    palette: { x, y: top + h, w, h: SWATCH_H },
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

/** Rect of swatch `i` of `n`. Flush to both frame edges, gaps only between. */
export function swatchRect(i: number, n: number, palette: Rect): Rect {
  const count = Math.max(1, n);
  const colW = (palette.w - (count - 1) * SWATCH_GAP) / count;
  return { x: palette.x + i * (colW + SWATCH_GAP), y: palette.y, w: colW, h: palette.h };
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

  // Soft-focus twin. A blur, not a desaturation: the drain should feel like the
  // colour is being drawn out of the picture, not like the picture is broken.
  const soft = makeLayer(imgW, imgH);
  if (!soft) throw new Error('2D canvas unavailable');
  if ('filter' in soft.ctx) soft.ctx.filter = 'blur(9px) saturate(0.68) brightness(0.74)';
  soft.ctx.drawImage(img, 0, 0, imgW, imgH);
  soft.ctx.filter = 'none';

  // Full-bleed blurred backdrop, built small and upscaled — a heavy blur of a
  // full-size canvas is one of the most expensive things a browser can be asked
  // to do, and once it is this soft the result is indistinguishable.
  const backdrop = makeLayer(CANVAS_W, CANVAS_H);
  if (!backdrop) throw new Error('2D canvas unavailable');
  // Opaque base FIRST. A blur draw leaves sub-opaque pixels at the frame edge,
  // and the loop dissolve blits this layer over the live frame at alpha 1 — if
  // it is not fully opaque the blit does not replace, and the seam stops being
  // pixel-exact. Cheap fill, load-bearing.
  backdrop.ctx.fillStyle = '#0b0918';
  backdrop.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const small = makeLayer(108, 192);
  if (small) {
    const cover = coverRect(imgW, imgH, { x: 0, y: 0, w: 108, h: 192 });
    small.ctx.drawImage(hero.c, cover.x, cover.y, cover.w, cover.h);
    if ('filter' in backdrop.ctx) backdrop.ctx.filter = 'blur(26px)';
    backdrop.ctx.drawImage(small.c, 0, 0, CANVAS_W, CANVAS_H);
    backdrop.ctx.filter = 'none';
  } else {
    backdrop.ctx.fillStyle = '#0f0f23';
    backdrop.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }
  // Darkened so the sharp image and the palette both separate from it.
  backdrop.ctx.fillStyle = 'rgba(8, 6, 18, 0.62)';
  backdrop.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  const vig = backdrop.ctx.createRadialGradient(
    CANVAS_W / 2,
    CANVAS_H * 0.42,
    Math.min(CANVAS_W, CANVAS_H) * 0.28,
    CANVAS_W / 2,
    CANVAS_H * 0.42,
    Math.max(CANVAS_W, CANVAS_H) * 0.72,
  );
  vig.addColorStop(0, 'transparent');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  backdrop.ctx.fillStyle = vig;
  backdrop.ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  // The ground above and below the poster should recede rather than compete —
  // blurred colour blobs pull the eye off the palette, and the lower ones land
  // under the caption bar anyway.
  const floorFade = backdrop.ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  floorFade.addColorStop(0, 'rgba(6, 5, 14, 0.55)');
  floorFade.addColorStop(0.4, 'rgba(6, 5, 14, 0.1)');
  floorFade.addColorStop(0.78, 'rgba(6, 5, 14, 0.55)');
  floorFade.addColorStop(1, 'rgba(6, 5, 14, 0.9)');
  backdrop.ctx.fillStyle = floorFade;
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
    ctx.globalAlpha = state.soften;
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

  // Ground behind the swatches, so un-poured slots are visible empties rather
  // than raw blurred backdrop.
  ctx.save();
  ctx.fillStyle = 'rgba(6, 5, 14, 0.92)';
  ctx.fillRect(palette.x, palette.y, palette.w, palette.h);
  ctx.restore();

  rows.forEach((row, i) => {
    const band = state.bands[i];
    if (!band) return;
    const r = swatchRect(res.columns[i] ?? i, n, palette);

    if (band.fill > 0) {
      // Pours UPWARD from the base of its column — the droplet fell in, so the
      // colour fills the way liquid would.
      const fh = r.h * band.fill;
      ctx.save();
      ctx.fillStyle = row.paintHex;
      ctx.fillRect(r.x, r.y + r.h - fh, r.w, fh);
      ctx.restore();
    }

    if (band.labelAlpha <= 0) return;
    // Rotated to read bottom-to-top: a swatch is far taller than it is wide, and
    // horizontal type would have to shrink past legibility to fit.
    const light = isLightSwatch(row.paintHex);
    const ink = light ? '#0d0a16' : '#ffffff';
    ctx.save();
    ctx.globalAlpha = band.labelAlpha;
    ctx.translate(r.x + r.w / 2, r.y + r.h - 26);
    ctx.rotate(-Math.PI / 2);
    drawText(ctx, row.paintName.toUpperCase(), 0, -11, {
      font: res.fonts.cyber,
      size: 25,
      weight: 700,
      colour: ink,
      align: 'left',
      letter: 1,
      maxWidth: r.h - 52,
    });
    drawText(ctx, `ΔE ${row.deltaE.toFixed(1)}`, 0, 16, {
      font: res.fonts.cyber,
      size: 19,
      weight: 600,
      colour: light ? 'rgba(13,10,22,0.72)' : 'rgba(255,255,255,0.72)',
      align: 'left',
      letter: 1,
      maxWidth: r.h - 52,
    });
    ctx.restore();
  });
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
 * Small, tucked against the poster, and never below the safe floor.
 *
 * It is the only branding that survives a re-upload, so it is in every frame —
 * but the poster block is image-dependent, and for a square or portrait photo
 * the palette runs past y1430 into the caption zone. Sitting under it there
 * would put the one piece of branding exactly where the platform covers it, so
 * when the palette runs low the mark moves ABOVE the image instead.
 */
function drawWarpWatermark(
  ctx: CanvasRenderingContext2D,
  res: WarpResources,
  poster: PosterLayout,
): void {
  // The block is capped so this always lands inside the safe area; the clamp is
  // a belt-and-braces guard rather than the mechanism.
  const y = Math.min(poster.palette.y + poster.palette.h + 40, SAFE_FLOOR - 16);
  ctx.save();
  ctx.globalAlpha = 0.42;
  drawText(ctx, 'schemestealer.com', CANVAS_W / 2, y, {
    font: res.fonts.cyber,
    size: 21,
    weight: 600,
    colour: '#ffffff',
    letter: 2,
  });
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

  // Headline. Rides with the swatch labels, so the finished poster carries no
  // type at all — the reference format has none, and the clip only earns that
  // look if it actually clears the frame at the end.
  const cap = warpCaptionText(spec, state);
  const capAlpha = state.bands.length ? Math.max(...state.bands.map((b) => b.labelAlpha)) : 0;
  if (cap && capAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = capAlpha * 0.9;
    drawText(ctx, cap, CANVAS_W / 2, Math.max(96, frame.y - 62), {
      font: res.fonts.cyber,
      size: 32,
      weight: 700,
      colour: '#ffffff',
      letter: 3,
      maxWidth: 880,
    });
    ctx.restore();
  }

  drawWarpWatermark(ctx, res, poster);
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
