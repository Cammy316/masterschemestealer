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
  fitRect,
  hexToRgba,
  labelTint,
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
 * Layout.
 *
 * A full-bleed BLURRED copy of the photo fills all 1920 px, with the sharp image
 * centred above the palette. That solves three problems at once: the frame has
 * no dead space (v1 left 25.5% of it black), the backdrop is inherently
 * colour-matched to the photo, and the sharp image stays contain-fitted so it is
 * never cropped — v1 sheared the outer colour patches clean off both edges.
 *
 * The palette is six HORIZONTAL bands, full width. Vertical columns were the
 * first choice and had to be abandoned: six columns across 1080 px puts the
 * sixth name at x≈990, directly under the like/comment/share rail. Bands run
 * edge to edge with names set left, so every name is attached to its own colour
 * AND clear of the rail.
 *
 * Everything below the palette is blurred backdrop — a caption bar can cover all
 * of it and the viewer loses nothing.
 */
const HERO_BOX: Rect = { x: 60, y: 150, w: 960, h: 770 };
const PALETTE_Y = 950;
const PALETTE_H = 432;
/** Watermark baseline. Inside the safe floor (1430) on purpose: it is the only
 *  branding that survives a re-upload, so it cannot live in the caption zone. */
const WATERMARK_Y = 1418;
/** Left inset for paint names, and the right edge the ΔE figure stops at — 900
 *  keeps it clear of the action rail. */
const BAND_TEXT_X = 52;
const BAND_DELTA_RIGHT = 900;

/** Relative luminance of a band, deciding whether its type is dark or light.
 *  150 sits between Citadel's mid tones in practice — verified against the
 *  yellow that failed first time round. */
function isLightBand(hex: string): boolean {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return false;
  return 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255) > 150;
}

export function bandHeight(n: number): number {
  return PALETTE_H / Math.max(1, n);
}

export function bandRect(i: number, n: number): Rect {
  const h = bandHeight(n);
  return { x: 0, y: PALETTE_Y + i * h, w: CANVAS_W, h };
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
  const maxDrawW = HERO_BOX.w * 1.4;
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
  // Everything under the palette is out of the safe area and should recede
  // rather than compete — blurred colour blobs down there pull the eye off the
  // poster and land under the caption bar anyway.
  const floorFade = backdrop.ctx.createLinearGradient(0, PALETTE_Y, 0, CANVAS_H);
  floorFade.addColorStop(0, 'rgba(6, 5, 14, 0)');
  floorFade.addColorStop(0.45, 'rgba(6, 5, 14, 0.72)');
  floorFade.addColorStop(1, 'rgba(6, 5, 14, 0.92)');
  backdrop.ctx.fillStyle = floorFade;
  backdrop.ctx.fillRect(0, PALETTE_Y, CANVAS_W, CANVAS_H - PALETTE_Y);

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
    loopTargetLayer: loopTarget.c,
  };

  drawWarpLoopTarget(loopTarget.ctx, res);
  return res;
}

// ---- geometry ----------------------------------------------------------------

/** Where the sharp photo sits this frame. Contain-fit, so it is never cropped,
 *  with a slow drift that is periodic across the clip. */
function heroRectAt(state: WarpFrameState, res: WarpResources): Rect {
  const fitted = fitRect(res.imgW, res.imgH, HERO_BOX);
  const w = fitted.w * state.camera.scale;
  const h = fitted.h * state.camera.scale;
  return {
    x: fitted.x - (w - fitted.w) / 2 + state.camera.driftX,
    y: fitted.y - (h - fitted.h) / 2 + state.camera.driftY,
    w,
    h,
  };
}

// ---- captions ----------------------------------------------------------------

/**
 * One quiet line, and only when there is something to say.
 *
 * v1 narrated every phase (`COMMUNING…`, `BINDING… 3/6 ESSENCES`). A palette
 * poster does not explain itself while you look at it, so the copy now sits on
 * the held poster and stays out of the way in between.
 */
export function warpCaptionText(spec: RevealSpec, state: WarpFrameState): string | null {
  if (spec.captionPreset === 'none') return null;
  if (state.phase === 'poster' || state.phase === 'settle' || state.phase === 'hold') {
    return 'THE EXACT PAINTS IN THIS IMAGE';
  }
  return null;
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
 * The palette: full-width bands of solid colour, each carrying its paint name
 * and its measurement.
 *
 * The ΔE is a quiet figure, never a coloured alarm. A hard-to-match photo — neon
 * lightning, say — legitimately returns several values above 10, and v1 rendered
 * that as six red DISTANT pills, which reads as the product failing rather than
 * the product being honest. The number is unchanged and always shown; only its
 * presentation stopped shouting.
 */
function drawPalette(ctx: CanvasRenderingContext2D, state: WarpFrameState, res: WarpResources): void {
  const rows = res.spec.wall ?? [];
  const n = rows.length;
  if (n === 0) return;
  const h = bandHeight(n);

  // Plate behind the WHOLE palette, drawn before any band. Without it the
  // unfilled slots show raw blurred backdrop, and a half-poured palette reads
  // as a mess rather than as bands waiting to be filled.
  ctx.save();
  ctx.fillStyle = 'rgba(6, 5, 14, 0.9)';
  ctx.fillRect(0, PALETTE_Y, CANVAS_W, PALETTE_H);
  // Empty slots, ruled. Before this the un-poured palette was one dark void for
  // ~1.4 s and said nothing; six visible slots tell the viewer how many colours
  // are coming, which is what makes the pours feel like a countdown rather than
  // a list that happens to stop.
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = 1;
  for (let i = 1; i < n; i++) {
    const y = Math.round(PALETTE_Y + i * h) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CANVAS_W, y);
    ctx.stroke();
  }
  ctx.restore();

  const nameSize = Math.round(h * 0.34);
  const metaSize = Math.round(h * 0.19);

  rows.forEach((row, i) => {
    const band = state.bands[i];
    if (!band || band.fill <= 0) return;
    const r = bandRect(i, n);

    ctx.save();
    // Left→right wipe. Clipping to the filled width makes the colour arrive as
    // a stroke rather than a fade — that is what reads as the droplet spreading.
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w * band.fill, r.h);
    ctx.clip();
    ctx.fillStyle = row.paintHex;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    // A hairline of the EXTRACTED colour along the top of each band, so the
    // comparison the product is actually making stays visible: this is the
    // colour in your photo, that is the paint matched to it.
    ctx.fillStyle = row.extractedHex;
    ctx.fillRect(r.x, r.y, r.w, 3);
    ctx.restore();

    if (band.nameReveal <= 0) return;
    // Type is drawn unclipped once the band has landed, so a name is never seen
    // half-wiped.
    // Ink choice is a question about the BAND, not about the tint helper. The
    // first cut asked whether labelTint had changed the colour, which is a
    // different question entirely — a mid-luma yellow gets lifted, so it took
    // LIGHT ink and the name vanished into its own band.
    const dark = isLightBand(row.paintHex);
    const textColour = dark ? '#100c1c' : labelTint(row.paintHex, 225);
    ctx.save();
    ctx.globalAlpha = band.nameReveal;
    drawText(ctx, row.paintName.toUpperCase(), r.x + BAND_TEXT_X, r.y + r.h * 0.4, {
      font: res.fonts.cyber,
      size: nameSize,
      weight: 700,
      colour: textColour,
      align: 'left',
      letter: 2,
      maxWidth: 540,
    });
    drawText(
      ctx,
      `${row.family.toUpperCase()} · ${row.brand.toUpperCase()}`,
      r.x + BAND_TEXT_X,
      r.y + r.h * 0.72,
      {
        font: res.fonts.tech,
        size: metaSize,
        weight: 600,
        colour: dark ? 'rgba(13,10,22,0.68)' : hexToRgba(textColour, 0.68),
        align: 'left',
        letter: 1,
        maxWidth: 540,
      },
    );
    ctx.restore();

    if (band.deltaReveal <= 0) return;
    ctx.save();
    ctx.globalAlpha = band.deltaReveal;
    drawText(ctx, `ΔE ${row.deltaE.toFixed(1)}`, BAND_DELTA_RIGHT, r.y + r.h * 0.5, {
      font: res.fonts.cyber,
      size: Math.round(h * 0.25),
      weight: 600,
      colour: dark ? 'rgba(13,10,22,0.75)' : hexToRgba(textColour, 0.75),
      align: 'right',
      letter: 1,
    });
    ctx.restore();
  });
}

/**
 * A slow highlight travelling across the palette, once per clip.
 *
 * Aesthetic and load-bearing at the same time. The bands are large flat areas of
 * solid colour, so during the 2.5 s payoff hold roughly a quarter of the frame
 * has literally nothing happening in it — the first cut of this rebuild cleared
 * the anti-freeze floor by 0.006, which is a coincidence rather than a pass.
 * Light moving across paint is the honest fix.
 *
 * One full traversal across the clip, so its position at p=1 equals p=0 and the
 * loop seam stays pixel-exact.
 */
function drawPaletteSheen(ctx: CanvasRenderingContext2D, p: number, filled: number): void {
  if (filled <= 0) return;
  const span = CANVAS_W * 2.2;
  const cx = -span * 0.5 + p * (CANVAS_W + span);
  const g = ctx.createLinearGradient(cx - span * 0.28, 0, cx + span * 0.28, 0);
  g.addColorStop(0, 'rgba(255,255,255,0)');
  g.addColorStop(0.5, `rgba(255,255,255,${0.055 * filled})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, PALETTE_Y, CANVAS_W, PALETTE_H);
  ctx.clip();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = g;
  ctx.fillRect(0, PALETTE_Y, CANVAS_W, PALETTE_H);
  ctx.restore();
}

function drawWarpWatermark(ctx: CanvasRenderingContext2D, res: WarpResources): void {
  ctx.save();
  ctx.globalAlpha = 0.5;
  drawText(ctx, 'schemestealer.com', CANVAS_W / 2, WATERMARK_Y, {
    font: res.fonts.cyber,
    size: 24,
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
  const r = heroRectAt(state, res);

  ctx.drawImage(res.backdropLayer, 0, 0, CANVAS_W, CANVAS_H);

  // Sharp photo with the soft twin cross-faded over it. Never greyscale.
  ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  if (state.soften > 0) {
    ctx.save();
    ctx.globalAlpha = state.soften;
    ctx.drawImage(res.softLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
    ctx.restore();
  }

  if (state.bloom !== null) drawBloom(ctx, r, accent, state.bloom);

  // The colour being drawn out of the picture, and its fall into the palette.
  if (state.droplet) {
    const region = spec.regions[state.droplet.index];
    const row = spec.wall?.[state.droplet.index];
    if (region && row) {
      const sx = r.x + region.position.x * r.w;
      const sy = r.y + region.position.y * r.h;
      drawSourcePoint(ctx, sx, sy, row.extractedHex, state.droplet.source);
      const t = state.droplet.travel;
      if (t > 0 && t < 1) {
        const target = bandRect(state.droplet.index, spec.wall!.length);
        drawDroplet(
          ctx,
          sx + (BAND_TEXT_X + 40 - sx) * t * t,
          sy + (target.y + target.h / 2 - sy) * t,
          row.extractedHex,
          Math.sin(Math.min(1, t / 0.92) * Math.PI) + 0.08,
        );
      }
    }
  }

  drawPalette(ctx, state, res);
  drawPaletteSheen(ctx, state.progress, state.bands.reduce((a, b) => a + b.fill, 0) / Math.max(1, state.bands.length));

  const cap = warpCaptionText(spec, state);
  if (cap) {
    // Fades with the poster holds rather than cutting, so the frame is never
    // interrupted by type appearing.
    const alpha =
      state.phase === 'poster' || state.phase === 'hold' ? 1 : (state.bands[0]?.deltaReveal ?? 0);
    ctx.save();
    ctx.globalAlpha = alpha * 0.92;
    drawText(ctx, cap, CANVAS_W / 2, 108, {
      font: res.fonts.cyber,
      size: 34,
      weight: 700,
      colour: '#ffffff',
      letter: 3,
      maxWidth: 880,
    });
    ctx.restore();
  }

  drawWarpWatermark(ctx, res);
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
    bandRect,
    outputSize,
    WARP_DURATION_MS,
  };
}
