/**
 * The warp-cast: Engine A's storyboard for INSPIRATION scans.
 *
 * An inspiration scan is any image — a sky, a poster, a flower — and the backend
 * returns colours with full per-brand recipes but NO segmentation masks. The
 * miniature storyboard is mask-gated from end to end (region layers, rim layers,
 * leader lines anchored to mask bounds), so none of it can run here.
 *
 * What IS reused, through `RevealStoryboard`: the entire encode path, the phase
 * table in `revealTimeline` (so the audio bed's beats line up for free), the
 * safe-area geometry, the ambient motion layer, the decor band, the watermark
 * and the loop-seam machinery. Only the middle — what is drawn — is new.
 *
 * The story, proof-first like the miniature: the image with its matched paints
 * already stamped → smash to a warp-veiled desaturation → a commune sweep → the
 * colours torn out one at a time as orbs, from the places they actually occur in
 * the photo → the bind → a wall pairing each colour with its closest paint.
 */

import type { Color } from '../types';
import {
  CANVAS_H,
  CANVAS_W,
  DECOR_BAND,
  FRAME_CX,
  LAYOUT,
  RECIPE_SCRIM_TOP,
  wallRowCount,
  wallRowRect,
  type Rect,
} from './revealLayout';
import {
  drawAmbient,
  drawDecorBand,
  drawText,
  drawWatermark,
  buildGrainTiles,
  garbleReveal,
  hexToRgba,
  labelTint,
  loadImage,
  fitRect,
  modelRectAt,
  outputSize,
  deltaBandColour,
  deltaBandName,
  type RevealFonts,
  resolveFonts,
} from './revealCompose';
import { drawCornerBrackets, paintBackdrop, type RevealSkin } from './revealLayers';
import { accentFor, themeFor } from './revealTheme';
import {
  frameState,
  nameCipherFraction,
  smoothstep,
  sortRegionsForReveal,
  type RevealFrameState,
  type RevealRegion,
  type RevealSpec,
  type CaptionPreset,
  type WallRow,
} from './revealTimeline';
import { scanColourOrigins, fallbackOrigins } from './warpOrigins';
import { scheduleWarpAudio } from './warpAudio';
import type { RevealStoryboard } from './revealStoryboard';
import type { RenderRevealOptions } from './renderRevealVideo';
import { WALL_MAX_ROWS } from './revealLayout';

/** Image box for the hero framing. Wider than the miniature's because an
 *  inspiration photo is usually landscape or square, not a tall figure. */
const IMAGE_FULL_BOX: Rect = { x: 40, y: 210, w: 1000, h: 1120 };
/** Outro framing, above the wall. */
const IMAGE_COMPACT_BOX: Rect = { x: 150, y: 200, w: 780, h: 760 };

/** Orb radius at full reveal, and the halo that sells it as a sphere. */
const ORB_R = 54;

export interface WarpResources {
  spec: RevealSpec;
  fonts: RevealFonts;
  imgW: number;
  imgH: number;
  backdropLayer: HTMLCanvasElement;
  grainTiles: HTMLCanvasElement[];
  /** The photo as shot — opening frame and loop target. */
  heroLayer: HTMLCanvasElement;
  /** Desaturated and warp-veiled: what the sweep reads across. */
  veiledLayer: HTMLCanvasElement;
  loopTargetLayer: HTMLCanvasElement;
}

// ---- spec --------------------------------------------------------------------

/**
 * Build the warp spec from a maskless inspiration scan.
 *
 * Keeps only colours that actually have a matched paint for the chosen brand —
 * an orb with no paint behind it would be a colour we cannot deliver on, and the
 * whole clip is a promise that we can. Capped at six, by coverage.
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

  // Coverage order first, so "top 6" means the six most present colours.
  const top = [...usable]
    .sort((a, b) => (b.c.percentage ?? 0) - (a.c.percentage ?? 0))
    .slice(0, WALL_MAX_ROWS);

  const regions: RevealRegion[] = top.map(({ c, index }) => ({
    index,
    hex: c.hex,
    family: c.family ?? c.hex,
    // Overwritten by the pixel scan in prepareWarpResources. Centre is only a
    // placeholder — if it ever survives to the screen the orbs stack, which the
    // Playwright seed deliberately checks for.
    position: { x: 0.5, y: 0.5 },
    percentage: c.percentage ?? 0,
  }));

  // Same small→dominant reveal order the miniature uses, so the accelerating
  // bloom schedule and the audio beats line up without a second implementation.
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
    // The wall replaces the four-role recipe card entirely, so there are no
    // recipe steps. `revealAudioBeats` keys its outro cadence off `wall`.
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

export async function prepareWarpResources(
  imageUrl: string,
  spec: RevealSpec,
  outputScale = 1,
): Promise<WarpResources> {
  const img = await loadImage(imageUrl);

  // Layers are built at the largest size they can ever be DRAWN at, not at the
  // photo's native size — a 12 MP phone photo would otherwise be resampled in
  // full on every one of 330 frames.
  const maxDrawW = IMAGE_FULL_BOX.w * 1.6;
  const scale = Math.min(1, maxDrawW / img.naturalWidth);
  const imgW = Math.max(1, Math.round(img.naturalWidth * scale));
  const imgH = Math.max(1, Math.round(img.naturalHeight * scale));

  const hero = makeLayer(imgW, imgH);
  if (!hero) throw new Error('2D canvas unavailable');
  hero.ctx.drawImage(img, 0, 0, imgW, imgH);

  // Veiled: desaturated, darkened, and washed toward the warp accent. This is
  // the state the commune sweep reads across.
  const veiled = makeLayer(imgW, imgH);
  if (!veiled) throw new Error('2D canvas unavailable');
  if ('filter' in veiled.ctx) veiled.ctx.filter = 'grayscale(1) brightness(0.55) contrast(1.1)';
  veiled.ctx.drawImage(img, 0, 0, imgW, imgH);
  veiled.ctx.filter = 'none';
  veiled.ctx.globalCompositeOperation = 'source-atop';
  veiled.ctx.fillStyle = hexToRgba(themeFor(spec.skin).accent, 0.12);
  veiled.ctx.fillRect(0, 0, imgW, imgH);
  for (let y = 0; y < imgH; y += 4) {
    veiled.ctx.fillStyle = themeFor(spec.skin).scanline;
    veiled.ctx.fillRect(0, y, imgW, 1);
  }

  // Where each colour actually lives in the picture. Done on a small copy: a
  // 200 px scan is plenty for "which region is most this colour" and keeps the
  // whole thing off the critical path of a phone export.
  const SCAN_MAX = 200;
  const sScale = Math.min(1, SCAN_MAX / Math.max(imgW, imgH));
  const scanW = Math.max(1, Math.round(imgW * sScale));
  const scanH = Math.max(1, Math.round(imgH * sScale));
  const small = makeLayer(scanW, scanH);
  let origins = fallbackOrigins(spec.regions.length);
  if (small) {
    small.ctx.drawImage(img, 0, 0, scanW, scanH);
    try {
      const data = small.ctx.getImageData(0, 0, scanW, scanH);
      origins = scanColourOrigins(data, spec.regions.map((r) => r.hex));
    } catch {
      // Tainted canvas (a cross-origin image without CORS). The ring fallback is
      // honest about being a layout, and never stacks orbs.
      origins = fallbackOrigins(spec.regions.length);
    }
  }
  spec.regions.forEach((r, i) => {
    r.position = origins[i] ?? { x: 0.5, y: 0.5 };
  });

  const backdrop = makeLayer(CANVAS_W, CANVAS_H);
  if (!backdrop) throw new Error('2D canvas unavailable');
  paintBackdrop(backdrop.ctx, CANVAS_W, CANVAS_H, spec.skin);

  const loopTarget = makeLayer(CANVAS_W, CANVAS_H);
  if (!loopTarget) throw new Error('2D canvas unavailable');

  const res: WarpResources = {
    spec,
    fonts: resolveFonts(),
    imgW,
    imgH,
    backdropLayer: backdrop.c,
    grainTiles: buildGrainTiles(),
    heroLayer: hero.c,
    veiledLayer: veiled.c,
    loopTargetLayer: loopTarget.c,
  };

  // Bake the loop target last — it needs every other layer to exist.
  drawWarpLoopTarget(loopTarget.ctx, res);
  return res;
}

// ---- geometry ----------------------------------------------------------------

/** Where the photo sits this frame. Same camera machinery as the miniature, so
 *  the Ken Burns push, the region punch and the outro morph all behave the
 *  same — only the two boxes differ. */
function imageRectAt(state: RevealFrameState, res: WarpResources): Rect {
  return modelRectAt(state.camera, res.imgW, res.imgH, IMAGE_FULL_BOX, IMAGE_COMPACT_BOX);
}

// ---- captions ----------------------------------------------------------------

/**
 * Warp-voiced copy. British spelling, and nothing that asserts more than the
 * engine can know: it measures colours, so it never names a subject, a brand of
 * paint it did not match, or a count of paints in the database.
 */
export function warpCaptionText(spec: RevealSpec, state: RevealFrameState): string | null {
  if (spec.captionPreset === 'none') return null;
  if (state.phase === 'proof' || state.phase === 'smash') return 'THE EXACT PAINTS IN THIS IMAGE';
  if (state.phase === 'sweep') return 'COMMUNING…';
  if (state.phase === 'reveal')
    return `BINDING… ${Math.max(1, state.identifiedCount)}/${spec.colourCount} ESSENCES`;
  return `${spec.colourCount} ESSENCES BOUND`;
}

// ---- drawing -----------------------------------------------------------------

/**
 * A colour orb, in the ColorPalette language: a radial-gradient sphere with a
 * specular highlight and an outer glow, so it reads as something lifted OUT of
 * the picture rather than a flat dot pasted on top.
 */
function drawOrb(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  hex: string,
  reveal: number,
  pulse: number,
): void {
  if (reveal <= 0) return;
  const r = ORB_R * (0.4 + 0.6 * smoothstep(reveal));
  ctx.save();
  ctx.globalAlpha = Math.min(1, reveal);

  // Outer glow — swells on the pulse then settles.
  const halo = ctx.createRadialGradient(x, y, r * 0.6, x, y, r * (2.1 + pulse * 0.9));
  halo.addColorStop(0, hexToRgba(hex, 0.5));
  halo.addColorStop(1, hexToRgba(hex, 0));
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, r * (2.1 + pulse * 0.9), 0, Math.PI * 2);
  ctx.fill();

  // The sphere itself, lit from the upper left.
  const body = ctx.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
  body.addColorStop(0, hexToRgba(hex, 1));
  body.addColorStop(0.65, hexToRgba(hex, 0.95));
  body.addColorStop(1, hexToRgba(hex, 0.55));
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();

  // Rim, so a dark orb still separates from a dark photo.
  ctx.strokeStyle = hexToRgba(labelTint(hex, 170), 0.85);
  ctx.lineWidth = 2;
  ctx.stroke();

  // Specular dot.
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.beginPath();
  ctx.ellipse(x - r * 0.34, y - r * 0.4, r * 0.2, r * 0.14, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** Family label under an orb, decrypting as it lands. */
function drawOrbLabel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  family: string,
  reveal: number,
  fonts: RevealFonts,
  hex: string,
): void {
  if (reveal <= 0) return;
  const label = garbleReveal(family.toUpperCase(), reveal);
  ctx.save();
  ctx.globalAlpha = Math.min(1, reveal);
  const tint = labelTint(hex);
  const w = Math.min(260, 30 + label.length * 15);
  ctx.fillStyle = 'rgba(5,4,12,0.72)';
  ctx.beginPath();
  ctx.roundRect(x - w / 2, y + ORB_R * 0.85, w, 34, 17);
  ctx.fill();
  ctx.strokeStyle = hexToRgba(tint, 0.55);
  ctx.lineWidth = 1.5;
  ctx.stroke();
  drawText(ctx, label, x, y + ORB_R * 0.85 + 18, {
    font: fonts.cyber,
    size: 22,
    colour: tint,
    glow: 8,
    letter: 1,
    maxWidth: w - 16,
  });
  ctx.restore();
}

/**
 * The payoff wall: each extracted colour beside the single closest paint to it,
 * with its own ΔE pill.
 *
 * More ΔE honesty than the miniature card, which shows one badge for the base
 * step: here every row carries its own measurement, because every row is a
 * separate claim. The numbers are passed straight through from the matcher and
 * never adjusted.
 */
function drawWall(ctx: CanvasRenderingContext2D, progress: number, hud: number, res: WarpResources): void {
  const { spec, fonts } = res;
  const rows = spec.wall ?? [];
  if (rows.length === 0) return;
  const accent = accentFor(spec.skin);
  const n = wallRowCount(rows.length);
  const shown = rows.slice(0, n);
  const nameCipher = nameCipherFraction(spec.durationMs, Math.max(1, Math.ceil(n / 2)));

  // Scrim behind the block — during the proof stamp the image sits under it.
  ctx.save();
  ctx.globalAlpha = hud;
  const scrim = ctx.createLinearGradient(0, RECIPE_SCRIM_TOP, 0, DECOR_BAND.y);
  scrim.addColorStop(0, 'rgba(5,4,12,0)');
  scrim.addColorStop(0.35, 'rgba(5,4,12,0.88)');
  scrim.addColorStop(1, 'rgba(5,4,12,0.94)');
  ctx.fillStyle = scrim;
  ctx.fillRect(0, RECIPE_SCRIM_TOP, CANVAS_W, DECOR_BAND.y - RECIPE_SCRIM_TOP);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = hud;
  drawText(ctx, 'BOUND TO REAL PAINTS', FRAME_CX, LAYOUT.recipeHeading.y + 26, {
    font: fonts.gothic,
    size: 44,
    colour: accent,
    glow: 16,
    letter: 2,
    maxWidth: LAYOUT.recipeHeading.w,
  });
  drawText(ctx, `CLOSEST ${spec.brand.toUpperCase()} MATCH PER ESSENCE`, FRAME_CX, LAYOUT.recipeSubheading.y + 15, {
    font: fonts.cyber,
    size: 24,
    weight: 600,
    colour: themeFor(spec.skin).muted,
    letter: 2,
    maxWidth: LAYOUT.recipeSubheading.w,
  });
  ctx.restore();

  // Rows land in PAIRS. Six single beats inside the outro window would be a
  // 180 ms cadence, which cannot clear the cipher burst — see revealAudioBeats.
  const pairs = Math.max(1, Math.ceil(n / 2));
  shown.forEach((row, i) => {
    const pair = Math.floor(i / 2);
    const start = pair / pairs;
    const local = Math.max(0, Math.min(1, (progress - start) * pairs * 1.6));
    if (local <= 0) return;

    const rect = wallRowRect(i, n);
    const ease = smoothstep(local);
    ctx.save();
    ctx.globalAlpha = hud * ease;
    // Slide in from the side the row sits on, so a pair reads as two halves of
    // one gesture rather than two identical drops.
    ctx.translate((i % 2 === 0 ? -1 : 1) * (1 - ease) * 40, 0);

    const pad = Math.round(rect.h * 0.14);
    const sw = rect.h - pad * 2;

    ctx.fillStyle = 'rgba(10,8,20,0.85)';
    ctx.beginPath();
    ctx.roundRect(rect.x, rect.y, rect.w, rect.h, Math.round(rect.h * 0.22));
    ctx.fill();
    ctx.strokeStyle = hexToRgba(accent, 0.28);
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Extracted colour, then the paint it maps to.
    const swatchY = rect.y + pad;
    ctx.fillStyle = row.extractedHex;
    ctx.beginPath();
    ctx.roundRect(rect.x + pad, swatchY, sw, sw, 8);
    ctx.fill();
    ctx.fillStyle = row.paintHex;
    ctx.beginPath();
    ctx.roundRect(rect.x + pad * 2 + sw, swatchY, sw, sw, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();

    const textX = rect.x + pad * 3 + sw * 2;
    const nameSize = Math.round(rect.h * 0.42);
    const cy = rect.y + rect.h / 2;
    // The paint NAME decrypts; the ΔE never does — a garbled measurement would
    // be a garbled claim.
    const nameProgress = Math.max(0, Math.min(1, local / nameCipher));
    drawText(ctx, garbleReveal(row.paintName, nameProgress), textX, cy - rect.h * 0.13, {
      font: fonts.tech,
      size: nameSize,
      colour: '#ffffff',
      align: 'left',
      maxWidth: rect.w * 0.42,
    });
    drawText(ctx, `${row.family.toUpperCase()} · ${row.brand.toUpperCase()}`, textX, cy + rect.h * 0.22, {
      font: fonts.cyber,
      size: Math.round(rect.h * 0.24),
      weight: 600,
      colour: themeFor(spec.skin).muted,
      align: 'left',
      letter: 1,
      maxWidth: rect.w * 0.42,
    });

    // ΔE pill, right-aligned inside the row.
    const band = deltaBandColour(row.deltaE);
    const pillW = Math.round(rect.h * 2.5);
    const pillH = Math.round(rect.h * 0.46);
    const pillX = rect.x + rect.w - pad - pillW;
    const pillY = cy - pillH / 2;
    ctx.fillStyle = hexToRgba(band, 0.16);
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fill();
    ctx.strokeStyle = hexToRgba(band, 0.7);
    ctx.lineWidth = 1.5;
    ctx.stroke();
    drawText(ctx, `ΔE ${row.deltaE.toFixed(1)} · ${deltaBandName(row.deltaE)}`, pillX + pillW / 2, pillY + pillH / 2, {
      font: fonts.cyber,
      size: Math.round(pillH * 0.5),
      weight: 700,
      colour: band,
      letter: 1,
      maxWidth: pillW - 12,
    });
    ctx.restore();
  });
}

function drawWarpPlate(ctx: CanvasRenderingContext2D, alpha: number, res: WarpResources): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const accent = accentFor(res.spec.skin);
  drawText(ctx, 'SCHEMESTEALER', FRAME_CX, LAYOUT.endCardTitle.y + 30, {
    font: res.fonts.gothic,
    size: 60,
    colour: accent,
    glow: 24,
    letter: 4,
    maxWidth: LAYOUT.endCardTitle.w,
  });
  drawText(ctx, 'measured, not guessed · scan yours free', FRAME_CX, LAYOUT.endCardSub.y + 18, {
    font: res.fonts.tech,
    size: 30,
    weight: 600,
    colour: themeFor(res.spec.skin).muted,
    maxWidth: LAYOUT.endCardSub.w,
  });
  ctx.restore();
}

/** Frame 0 and the loop target: the photo with its wall already stamped. */
export function drawWarpLoopTarget(ctx: CanvasRenderingContext2D, res: WarpResources): void {
  const s0 = frameState(0, res.spec);
  const r = imageRectAt(s0, res);
  ctx.drawImage(res.backdropLayer, 0, 0, CANVAS_W, CANVAS_H);
  drawDecorBand(ctx, accentFor(res.spec.skin), 0);
  ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accentFor(res.spec.skin));
  const cap = warpCaptionText(res.spec, s0);
  if (cap)
    drawText(ctx, cap, FRAME_CX, LAYOUT.headline.y + 24, {
      font: res.fonts.cyber,
      size: 40,
      colour: accentFor(res.spec.skin),
      glow: 16,
      letter: 2,
      maxWidth: LAYOUT.headline.w,
    });
  if (s0.proofAlpha > 0) drawWall(ctx, 1, s0.proofAlpha, res);
  drawWatermark(ctx, 1, res.fonts, res.spec.skin);
  drawAmbient(ctx, res.grainTiles, accentFor(res.spec.skin), 0);
}

export function composeWarp(ctx: CanvasRenderingContext2D, state: RevealFrameState, res: WarpResources): void {
  const { spec } = res;
  const accent = accentFor(spec.skin);
  const r = imageRectAt(state, res);
  const hud = 1 - state.hudFade;

  ctx.drawImage(res.backdropLayer, 0, 0, CANVAS_W, CANVAS_H);
  drawDecorBand(ctx, accent, state.progress);

  // The photo. Veiled underneath, full colour returning as the bind lands.
  ctx.drawImage(res.veiledLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  if (state.fullRestore > 0) {
    ctx.save();
    ctx.globalAlpha = state.fullRestore;
    ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
    ctx.restore();
  }
  // The proof frame sits in full colour until the smash strobes it away.
  if (state.heroAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = state.heroAlpha;
    ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
    ctx.restore();
  }

  // Commune sweep.
  if (state.sweepY !== null) {
    const y = r.y + state.sweepY * r.h;
    const grad = ctx.createLinearGradient(0, y - 70, 0, y);
    grad.addColorStop(0, hexToRgba(accent, 0));
    grad.addColorStop(1, hexToRgba(accent, 0.35));
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(r.x, y - 70, r.w, 70);
    ctx.strokeStyle = hexToRgba(accent, 0.95);
    ctx.lineWidth = 4;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.moveTo(r.x, y);
    ctx.lineTo(r.x + r.w, y);
    ctx.stroke();
    ctx.restore();
  }

  // Impact flash on the smash.
  if (state.snapFlash > 0) {
    ctx.save();
    ctx.globalAlpha = state.snapFlash * 0.5;
    ctx.fillStyle = hexToRgba(accent, 0.5);
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }

  // Orbs, at the places their colours actually occur in the photo.
  if (hud > 0) {
    ctx.save();
    ctx.globalAlpha = hud;
    state.regions.forEach((rs, i) => {
      const region = spec.regions[i];
      if (!region || rs.revealProgress <= 0) return;
      const x = r.x + region.position.x * r.w;
      const y = r.y + region.position.y * r.h;
      drawOrb(ctx, x, y, region.hex, rs.revealProgress, rs.pulse);
      drawOrbLabel(ctx, x, y, region.family, rs.labelReveal, res.fonts, region.hex);
    });
    ctx.restore();
  }

  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accent);

  const cap = warpCaptionText(spec, state);
  if (cap && hud > 0) {
    ctx.save();
    ctx.globalAlpha = hud;
    drawText(ctx, cap, FRAME_CX, LAYOUT.headline.y + 24, {
      font: res.fonts.cyber,
      size: 40,
      colour: accent,
      glow: 16,
      letter: 2,
      maxWidth: LAYOUT.headline.w,
    });
    ctx.restore();
  }

  // Proof stamp, then the outro wall — same renderer at full progress, so the
  // opening frame and the payoff can never show different paints.
  if (state.proofAlpha > 0) drawWall(ctx, 1, state.proofAlpha, res);
  const wallAlpha = hud * (state.phase === 'recipe' ? smoothstep(state.camera.boxLerp) : 1);
  if (state.recipeProgress > 0 && wallAlpha > 0) drawWall(ctx, state.recipeProgress, wallAlpha, res);

  if (state.plateAlpha > 0) drawWarpPlate(ctx, state.plateAlpha, res);
  drawWatermark(ctx, 1, res.fonts, spec.skin);

  drawAmbient(ctx, res.grainTiles, accent, state.progress);

  if (state.loopCrossfade > 0) {
    ctx.save();
    ctx.globalAlpha = state.loopCrossfade;
    ctx.drawImage(res.loopTargetLayer, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
}

export function composeWarpAt(ctx: CanvasRenderingContext2D, t: number, res: WarpResources): void {
  composeWarp(ctx, frameState(t, res.spec), res);
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
      durationMs,
    );
  },
  prepare(opts, spec, outputScale) {
    return prepareWarpResources(opts.imageUrl, spec, outputScale);
  },
  composeAt: composeWarpAt,
  audioSchedule: scheduleWarpAudio,
};

// Dev-only hook, mirroring __revealDebug so the warp suite can render
// deterministic frames without an encoder.
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__warpDebug = {
    buildWarpSpec,
    prepareWarpResources,
    composeWarpAt,
    warpCaptionText,
    scheduleWarpAudio,
    outputSize,
    fitRect,
  };
}
