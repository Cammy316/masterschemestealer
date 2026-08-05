/**
 * Canvas composition for the Engine A export — turns a timeline RevealFrameState
 * into one drawn 1080×1920 frame, reusing the shared Auspex layers so the clip
 * matches the live reveal. Kept separate from the MediaRecorder orchestration
 * (renderRevealVideo) so single frames can be screenshotted for QA.
 */

import type { Color, MaskFrame, PaintRecipe } from '../types';
import { layoutRailCallouts, type RailCallout } from '../maskGeometry';
import {
  adaptiveVideoDim,
  buildBaseLayer,
  buildHeroLayer,
  buildRegionLayer,
  buildRegionRimLayer,
  decodeMask,
  drawCornerBrackets,
  measureMeanLuma,
  paintBackdrop,
  type RevealSkin,
} from './revealLayers';
import { scheduleRevealAudio } from './revealAudio';
import {
  frameState,
  smoothstep,
  sortRegionsForReveal,
  type RevealCamera,
  type RevealFrameState,
  type RevealRecipeStep,
  type RevealSpec,
  type CaptionPreset,
} from './revealTimeline';

export const CANVAS_W = 1080;
export const CANVAS_H = 1920;

/** Reveal framing: the model owns the frame. */
const FULL_BOX = { x: 70, y: 150, w: 940, h: 1250 };
/** Outro framing: the model eases up and back to clear room for the recipe. */
const COMPACT_BOX = { x: 250, y: 180, w: 580, h: 800 };
const RECIPE_TOP = 1060;
const CHIP_H = 96;
const CHIP_GAP = 18;

/** Model dimming ahead of the scan line, so the sweep visibly lights it up.
 *  Kept shallow — the pre-scan model still has to READ at feed size. */
const PRE_SCAN_DIM = 0.62;

const ROLE_ACCENT: Record<RevealRecipeStep['role'], string> = {
  base: '#00FF41',
  highlight: '#FFD700',
  shade: '#2AA6FF',
  wash: '#A78BFA',
};

function accentFor(skin: RevealSkin): string {
  return skin === 'warp' ? '#A78BFA' : '#00FF41';
}

/** #rrggbb → rgba() so gradients can fade an arbitrary accent. */
export function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return `rgba(0,255,65,${alpha})`;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/**
 * Text-safe tint of a region colour: mixed toward white (plain sRGB
 * arithmetic — no colour-space maths) until it clears a readable luma floor.
 * BLACK and BROWN callouts were invisible dark-on-black in their own hex;
 * leader lines and anchor dots stay true-hex so the colour story is honest —
 * only the TYPE gets lifted.
 */
export function labelTint(hex: string, floor = 140): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return hex;
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luma >= floor) return hex;
  const t = (floor - luma) / (255 - luma);
  r = Math.round(r + (255 - r) * t);
  g = Math.round(g + (255 - g) * t);
  b = Math.round(b + (255 - b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

/** ΔE badge colour follows the app's band vocabulary (DeltaEBadge):
 *  perfect ≤2 · close ≤5 · fair ≤10 · distant beyond. */
export function deltaBandColour(deltaE: number): string {
  if (deltaE <= 2) return '#00FF41';
  if (deltaE <= 5) return '#A3E635';
  if (deltaE <= 10) return '#F59E0B';
  return '#EF4444';
}

// ---- fonts -------------------------------------------------------------------
export interface RevealFonts {
  gothic: string; // Cinzel — headings
  tech: string; // Rajdhani — body / paint names
  cyber: string; // Orbitron — HUD labels
}

function cssVar(name: string, fallback: string): string {
  if (typeof document === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

export function resolveFonts(): RevealFonts {
  return {
    gothic: cssVar('--font-cinzel', 'serif'),
    tech: cssVar('--font-rajdhani', 'sans-serif'),
    cyber: cssVar('--font-orbitron', 'monospace'),
  };
}

// ---- geometry ----------------------------------------------------------------
export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Contain-fit source dims into a box, centred. */
export function fitRect(srcW: number, srcH: number, box: Rect): Rect {
  const scale = Math.min(box.w / srcW, box.h / srcH);
  const w = srcW * scale;
  const h = srcH * scale;
  return { x: box.x + (box.w - w) / 2, y: box.y + (box.h - h) / 2, w, h };
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRect(a: Rect, b: Rect, t: number): Rect {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) };
}

/**
 * Where the model lands this frame: the box morphs full→compact for the outro,
 * then the camera scales about its focus point (Ken Burns + per-region punch).
 * Everything anchored to the model — masks, rims, leader lines — reads this one
 * rect, so nothing can drift out of register.
 */
export function modelRectAt(camera: RevealCamera, imgW: number, imgH: number): Rect {
  const fitted = fitRect(imgW, imgH, lerpRect(FULL_BOX, COMPACT_BOX, camera.boxLerp));
  const w = fitted.w * camera.scale;
  const h = fitted.h * camera.scale;
  return {
    x: fitted.x + fitted.w * camera.focusX - w * camera.focusX,
    y: fitted.y + fitted.h * camera.focusY - h * camera.focusY,
    w,
    h,
  };
}

// ---- spec + resources --------------------------------------------------------
export interface RevealResources {
  spec: RevealSpec;
  fonts: RevealFonts;
  imgW: number;
  imgH: number;
  heroLayer: HTMLCanvasElement;
  greyLayer: HTMLCanvasElement;
  regionLayers: (HTMLCanvasElement | null)[]; // aligned to spec.regions order
  rimLayers: (HTMLCanvasElement | null)[];
  callouts: RailCallout[];
}

/** Best-brand 4-step recipe → ordered steps for the outro cascade. Order matches
 *  the app's recipe card (base→highlight→shade→wash) so the clip teaches the
 *  same sequence the user will follow at the desk. */
export function recipeSteps(recipe: PaintRecipe | undefined, brand: keyof PaintRecipe): RevealRecipeStep[] {
  const br = recipe?.[brand];
  if (!br) return [];
  const order: RevealRecipeStep['role'][] = ['base', 'highlight', 'shade', 'wash'];
  const out: RevealRecipeStep[] = [];
  for (const role of order) {
    const m = br[role];
    if (m) out.push({ role, name: m.name, hex: m.hex, deltaE: m.deltaE });
  }
  return out;
}

export function buildRevealSpec(
  colors: Color[],
  recipe: RevealRecipeStep[],
  brand: string,
  skin: RevealSkin,
  captionPreset: CaptionPreset,
  durationMs: number,
  recipeColourIndex = -1,
): RevealSpec {
  const withMasks = colors
    .map((c, index) => ({
      index,
      hex: c.hex,
      family: c.family ?? '',
      position: c.position ?? { x: 0.5, y: 0.5 },
      percentage: c.percentage ?? 0,
      hasMask: !!c.mask,
    }))
    .filter((r) => r.hasMask)
    .map(({ hasMask, ...r }) => r);
  const regions = sortRegionsForReveal(withMasks);
  return {
    skin,
    regions,
    recipe,
    brand,
    colourCount: withMasks.length,
    durationMs,
    captionPreset,
    recipeRegionIndex: regions.findIndex((r) => r.index === recipeColourIndex),
  };
}

/** Load image + decode masks + pre-build layers. Browser-only. */
export async function prepareResources(
  imageUrl: string,
  colors: Color[],
  maskFrame: MaskFrame | undefined,
  spec: RevealSpec,
): Promise<RevealResources> {
  const img = await loadImage(imageUrl);
  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  const heroLayer = buildHeroLayer(img, imgW, imgH);
  if (!heroLayer) throw new Error('Failed to build base layer');
  // Greyscale brightness adapts to the model's measured luma so a dark scheme
  // reads as a visible grey model, not a silhouette.
  const greyLayer = buildBaseLayer(img, imgW, imgH, true, adaptiveVideoDim(measureMeanLuma(heroLayer)));
  if (!greyLayer) throw new Error('Failed to build base layer');

  const built = await Promise.all(
    spec.regions.map(async (r) => {
      const b64 = colors[r.index]?.mask;
      if (!b64) return { region: null, rim: null };
      const mask = await decodeMask(b64);
      if (!mask) return { region: null, rim: null };
      return {
        region: buildRegionLayer(img, mask, imgW, imgH, maskFrame),
        rim: buildRegionRimLayer(mask, imgW, imgH, maskFrame, r.hex),
      };
    }),
  );

  return {
    spec,
    fonts: resolveFonts(),
    imgW,
    imgH,
    heroLayer,
    greyLayer,
    regionLayers: built.map((b) => b.region),
    rimLayers: built.map((b) => b.rim),
    callouts: layoutRailCallouts(spec.regions.map((r) => r.position)),
  };
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('reveal: source image failed to load'));
    img.src = url;
  });
}

// ---- text helpers ------------------------------------------------------------
const GARBLE_GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Left-to-right resolve; deterministic (no per-frame random) so it's stable. */
export function garbleReveal(text: string, progress: number): string {
  const resolved = Math.floor(Math.max(0, Math.min(1, progress)) * text.length);
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    out += i < resolved || ch === ' ' ? ch : GARBLE_GLYPHS[(text.charCodeAt(i) + i) % GARBLE_GLYPHS.length];
  }
  return out;
}

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: {
    font: string;
    size: number;
    weight?: number;
    colour: string;
    align?: CanvasTextAlign;
    glow?: number;
    letter?: number;
    maxWidth?: number;
  },
): void {
  ctx.save();
  let size = opts.size;
  // Shrink to fit a max width so long captions never clip the frame edge.
  if (opts.maxWidth) {
    ctx.font = `${opts.weight ?? 700} ${size}px ${opts.font}`;
    const measured = opts.letter ? measureSpaced(ctx, text, opts.letter) : ctx.measureText(text).width;
    if (measured > opts.maxWidth) size = Math.max(12, Math.floor(size * (opts.maxWidth / measured)));
  }
  ctx.font = `${opts.weight ?? 700} ${size}px ${opts.font}`;
  ctx.fillStyle = opts.colour;
  ctx.textAlign = opts.align ?? 'center';
  ctx.textBaseline = 'middle';
  if (opts.glow) {
    ctx.shadowColor = opts.colour;
    ctx.shadowBlur = opts.glow;
  }
  if (opts.letter) {
    // manual letter-spacing for older canvas impls
    ctx.textAlign = 'left';
    const align = opts.align ?? 'center'; // match the non-spaced default
    const total = measureSpaced(ctx, text, opts.letter);
    let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
    for (const ch of text) {
      ctx.fillText(ch, cx, y);
      cx += ctx.measureText(ch).width + opts.letter;
    }
  } else {
    ctx.fillText(text, x, y);
  }
  ctx.restore();
}

function measureSpaced(ctx: CanvasRenderingContext2D, text: string, letter: number): number {
  let w = 0;
  for (const ch of text) w += ctx.measureText(ch).width + letter;
  return Math.max(0, w - letter);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// ---- frame composition -------------------------------------------------------
/**
 * The 'colours' caption opens with a question hook on frame 0 (the written
 * promise the research says the first frame needs), then COUNTS UP as regions
 * resolve — progression to watch, and the payoff line only lands once the
 * model is fully read.
 */
export function captionText(spec: RevealSpec, state: RevealFrameState): string | null {
  if (spec.captionPreset === 'none') return null;
  if (spec.captionPreset === 'machine-spirit') return 'THE MACHINE SPIRIT KNOWS YOUR RECIPE';
  if (state.phase === 'hero') return 'CAN THE MACHINE READ THIS PAINT JOB?';
  if (state.phase === 'snap' || state.phase === 'sweep') return 'SCANNING…';
  if (state.phase === 'reveal') return `READING… ${state.identifiedCount}/${spec.colourCount} COLOURS`;
  return `${spec.colourCount} COLOURS IDENTIFIED`;
}

/** Breathing backlight behind the hero, tinted with the dominant region's hex —
 *  the void stays, but the frame has light and it moves. */
function drawHeroGlow(ctx: CanvasRenderingContext2D, res: RevealResources, r: Rect, glow: number): void {
  if (glow <= 0) return;
  const hex = res.spec.regions[res.spec.regions.length - 1]?.hex ?? '#00FF41';
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const radius = Math.max(r.w, r.h) * 0.75;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  grad.addColorStop(0, hexToRgba(hex, 0.26 * glow));
  grad.addColorStop(0.55, hexToRgba(hex, 0.1 * glow));
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.restore();
}

/** Run `draw` with the model-space rock rotation applied about the rect centre.
 *  Rotation is only ever non-zero during hero/snap, when no callouts are up, so
 *  HUD geometry never needs to counter-rotate. */
function withRock(
  ctx: CanvasRenderingContext2D,
  r: Rect,
  rotationDeg: number,
  draw: () => void,
): void {
  if (rotationDeg === 0) {
    draw();
    return;
  }
  ctx.save();
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  ctx.translate(cx, cy);
  ctx.rotate((rotationDeg * Math.PI) / 180);
  ctx.translate(-cx, -cy);
  draw();
  ctx.restore();
}

/** Greyscale base, dim ahead of the scan line and full behind it. */
function drawGreyModel(
  ctx: CanvasRenderingContext2D,
  res: RevealResources,
  r: Rect,
  alpha: number,
  scanned: number,
): void {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = alpha * PRE_SCAN_DIM;
  ctx.drawImage(res.greyLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  ctx.restore();
  if (scanned <= 0) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h * scanned);
  ctx.clip();
  ctx.globalAlpha = alpha * (1 - PRE_SCAN_DIM);
  ctx.drawImage(res.greyLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  ctx.restore();
}

/** Frame-1 / loop-target composition, DERIVED from frameState(0) so the loop
 *  and the opening frame can never drift apart: backdrop + breathing glow +
 *  the punched-in full-colour hero + brackets + the hook caption. */
export function drawLoopTarget(ctx: CanvasRenderingContext2D, res: RevealResources): void {
  const s0 = frameState(0, res.spec);
  const r = modelRectAt(s0.camera, res.imgW, res.imgH);
  paintBackdrop(ctx, CANVAS_W, CANVAS_H, res.spec.skin);
  drawHeroGlow(ctx, res, r, s0.heroGlow);
  withRock(ctx, r, s0.camera.rotationDeg, () => {
    ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  });
  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accentFor(res.spec.skin));
  const cap = captionText(res.spec, s0);
  if (cap)
    drawText(ctx, cap, CANVAS_W / 2, 130, {
      font: res.fonts.cyber,
      size: 40,
      colour: accentFor(res.spec.skin),
      glow: 16,
      letter: 2,
      maxWidth: CANVAS_W - 120,
    });
}

export function composeReveal(ctx: CanvasRenderingContext2D, state: RevealFrameState, res: RevealResources): void {
  const { spec } = res;
  const accent = accentFor(spec.skin);
  const r = modelRectAt(state.camera, res.imgW, res.imgH);
  const hud = 1 - state.hudFade;
  const finaleIndex = spec.regions.length - 1; // dominant colour blooms last

  paintBackdrop(ctx, CANVAS_W, CANVAS_H, spec.skin);
  drawHeroGlow(ctx, res, r, state.heroGlow);

  withRock(ctx, r, state.camera.rotationDeg, () => {
    drawGreyModel(ctx, res, r, state.baseAlpha, state.scanned);

    // Region colour blooms — the painter's REAL pixels, drawn clean. The rim
    // flashes at the moment of identification then dies away entirely: a
    // permanent outline traced every pinhole in real grabCut masks and read as
    // crayon scribble.
    state.regions.forEach((rs, i) => {
      if (rs.revealProgress <= 0) return;
      const layer = res.regionLayers[i];
      if (layer) {
        ctx.save();
        ctx.globalAlpha = rs.revealProgress;
        ctx.drawImage(layer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
        ctx.restore();
      }
      const rim = res.rimLayers[i];
      if (rim && rs.pulse > 0) {
        const finale = i === finaleIndex ? 1.25 : 1;
        ctx.save();
        ctx.globalAlpha = Math.min(1, rs.pulse * finale);
        ctx.shadowColor = spec.regions[i].hex;
        ctx.shadowBlur = (14 + rs.pulse * 46) * finale;
        ctx.drawImage(rim, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
        ctx.restore();
      }
    });

    // The hero (full colour) sits on top until the snap strobes it away, with
    // a chromatic-aberration hit as it goes (hue-shifted echoes; browsers
    // without canvas filters just get the ghost offsets, which still read).
    if (state.heroAlpha > 0) {
      if (state.snapFlash > 0) {
        const shift = 7 * state.snapFlash;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.22 * state.snapFlash;
        ctx.filter = 'hue-rotate(120deg)';
        ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x + shift, r.y, r.w, r.h);
        ctx.filter = 'hue-rotate(-120deg)';
        ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x - shift, r.y, r.w, r.h);
        ctx.restore();
      }
      ctx.save();
      ctx.globalAlpha = state.heroAlpha;
      ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
      ctx.restore();
    }
  });

  // Scan sweep, in the active skin's accent.
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

  // Impact flash on the cut to greyscale — a sharp pop, not a wash: the square
  // falloff keeps it to the first frames so the backdrop never sits tinted.
  if (state.snapFlash > 0) {
    const pop = state.snapFlash * state.snapFlash;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = hexToRgba(accent, 0.22 * pop);
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }

  // Rail callouts: leader line + chip + garble family label.
  res.callouts.forEach((c) => {
    const rs = state.regions[c.index];
    const region = spec.regions[c.index];
    if (!rs || !region || rs.labelReveal <= 0 || hud <= 0) return;
    const hex = region.hex;
    const railX = c.side === 'left' ? 52 : CANVAS_W - 52;
    const railY = r.y + c.railY * r.h;
    const anchorX = r.x + c.anchorX * r.w;
    const anchorY = r.y + c.anchorY * r.h;
    const dir = c.side === 'left' ? 1 : -1;
    const elbowX = railX + dir * 40;
    // The recipe belongs to ONE region — keep its chip alive while the cascade runs.
    const owns = c.index === spec.recipeRegionIndex && state.recipeProgress > 0;
    const ownPulse = owns ? 0.5 + 0.5 * Math.sin(state.recipeProgress * Math.PI * 6) : 0;

    ctx.save();
    ctx.globalAlpha = rs.labelReveal * hud;
    // leader line (circuit elbow)
    ctx.strokeStyle = hex;
    ctx.lineWidth = owns ? 4 : 2.5;
    ctx.shadowColor = hex;
    ctx.shadowBlur = 8 + ownPulse * 18;
    ctx.beginPath();
    ctx.moveTo(railX, railY);
    ctx.lineTo(elbowX, railY);
    ctx.lineTo(elbowX + dir * 30, anchorY);
    ctx.lineTo(anchorX, anchorY);
    ctx.stroke();
    // anchor dot
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 8, 0, Math.PI * 2);
    ctx.fill();
    // chip + type in a text-safe tint — a BLACK or BROWN callout in its own
    // hex is invisible on the void backdrop; the line/dot above stay true-hex.
    const tint = labelTint(hex);
    ctx.beginPath();
    ctx.arc(railX, railY, 34, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5,7,10,0.92)';
    ctx.fill();
    ctx.lineWidth = owns ? 5 : 3;
    ctx.strokeStyle = tint;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = rs.labelReveal * hud;
    drawText(ctx, String(c.index + 1), railX, railY, { font: res.fonts.cyber, size: 32, colour: tint });
    const label = garbleReveal((region.family || region.hex).toUpperCase(), rs.labelReveal);
    const labelX = c.side === 'left' ? railX + 52 : railX - 52;
    drawText(ctx, label, labelX, railY, {
      font: res.fonts.cyber,
      size: 36,
      colour: tint,
      align: c.side === 'left' ? 'left' : 'right',
      glow: 12,
      maxWidth: 380,
    });
    ctx.restore();
  });

  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accent);

  // Burned-in caption.
  const cap = captionText(spec, state);
  if (cap && hud > 0) {
    ctx.save();
    ctx.globalAlpha = hud;
    drawText(ctx, cap, CANVAS_W / 2, 130, {
      font: res.fonts.cyber,
      size: 40,
      colour: accent,
      glow: 16,
      letter: 2,
      maxWidth: CANVAS_W - 120,
    });
    ctx.restore();
  }

  // Recipe outro cascade. Gated on the box morph so the heading never draws
  // over the model's feet while it is still easing into the compact framing.
  const recipeAlpha = hud * (state.phase === 'recipe' ? smoothstep(state.camera.boxLerp) : 1);
  if (state.recipeProgress > 0 && recipeAlpha > 0) drawRecipe(ctx, state.recipeProgress, recipeAlpha, res);

  // Brand plate + persistent watermark.
  if (state.plateAlpha > 0 && hud > 0) drawPlate(ctx, state.plateAlpha * hud, res);
  if (state.phase !== 'hero' && hud > 0) drawWatermark(ctx, hud, res);

  // Loop dissolve back to frame 1 (the hero). The HUD has already faded, so
  // nothing ghosts through the crossfade.
  if (state.loopCrossfade > 0) {
    ctx.save();
    ctx.globalAlpha = state.loopCrossfade;
    drawLoopTarget(ctx, res);
    ctx.restore();
  }
}

function drawRecipe(ctx: CanvasRenderingContext2D, progress: number, hud: number, res: RevealResources): void {
  const { spec } = res;
  const steps = spec.recipe;
  if (steps.length === 0) return;
  const accent = accentFor(spec.skin);
  const owner = spec.recipeRegionIndex >= 0 ? spec.regions[spec.recipeRegionIndex] : undefined;

  ctx.save();
  ctx.globalAlpha = hud;
  drawText(ctx, `${spec.brand.toUpperCase()} RECIPE`, CANVAS_W / 2, RECIPE_TOP, {
    font: res.fonts.gothic,
    size: 44,
    colour: accent,
    glow: 12,
    maxWidth: CANVAS_W - 160,
  });
  // Name WHICH colour this recipe is for — five regions were called out, only
  // one gets a breakdown, and the viewer should never have to guess which.
  if (owner) {
    drawText(
      ctx,
      `DOMINANT · ${spec.recipeRegionIndex + 1} ${(owner.family || owner.hex).toUpperCase()}`,
      CANVAS_W / 2,
      RECIPE_TOP + 44,
      { font: res.fonts.cyber, size: 26, colour: labelTint(owner.hex), letter: 2, maxWidth: CANVAS_W - 200 },
    );
  }
  ctx.restore();

  const startY = RECIPE_TOP + 84;
  steps.forEach((step, i) => {
    const appear = Math.max(0, Math.min(1, progress * steps.length - i));
    if (appear <= 0) return;
    const roleAccent = ROLE_ACCENT[step.role];
    const y = startY + i * (CHIP_H + CHIP_GAP);
    const x = 110;
    const w = CANVAS_W - 220;
    // ΔE is the distance from the DETECTED colour, which only the base match
    // measures — showing it on derived partners would compare two different
    // quantities under one label. Honest badge or no badge.
    const showDelta = step.role === 'base' && typeof step.deltaE === 'number' && step.deltaE > 0;

    ctx.save();
    ctx.globalAlpha = appear * hud;
    ctx.translate((1 - appear) * 40, 0);
    // chip body
    roundRect(ctx, x, y, w, CHIP_H, 18);
    ctx.fillStyle = 'rgba(8,12,16,0.85)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = roleAccent;
    ctx.shadowColor = roleAccent;
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // role spine
    roundRect(ctx, x, y, 12, CHIP_H, 6);
    ctx.fillStyle = roleAccent;
    ctx.fill();
    // swatch
    roundRect(ctx, x + 34, y + 18, 60, 60, 12);
    ctx.fillStyle = step.hex;
    ctx.fill();

    drawText(ctx, step.role.toUpperCase(), x + 118, y + 34, {
      font: res.fonts.cyber,
      size: 22,
      colour: roleAccent,
      align: 'left',
    });
    drawText(ctx, step.name, x + 118, y + 66, {
      font: res.fonts.tech,
      size: 34,
      colour: '#e8f0e8',
      align: 'left',
      maxWidth: w - 118 - 20 - (showDelta ? 140 : 0),
    });
    if (showDelta) {
      drawText(ctx, `ΔE ${step.deltaE!.toFixed(1)}`, x + w - 26, y + CHIP_H / 2, {
        font: res.fonts.cyber,
        size: 26,
        colour: deltaBandColour(step.deltaE!),
        align: 'right',
      });
    }
    ctx.restore();
  });
}

/** Small, persistent, corner-set. The flex is the recipe — the brand only has
 *  to be findable, not shouted, or nobody posts this to their own grid. */
function drawWatermark(ctx: CanvasRenderingContext2D, alpha: number, res: RevealResources): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  drawText(ctx, 'schemestealer.com', 56, CANVAS_H - 46, {
    font: res.fonts.cyber,
    size: 24,
    weight: 600,
    colour: '#c8d8cc',
    align: 'left',
    letter: 1,
  });
  ctx.restore();
}

function drawPlate(ctx: CanvasRenderingContext2D, alpha: number, res: RevealResources): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const accent = accentFor(res.spec.skin);
  drawText(ctx, 'SCHEMESTEALER', CANVAS_W / 2, 1670, {
    font: res.fonts.gothic,
    size: 40,
    colour: accent,
    glow: 14,
  });
  drawText(ctx, '1,312 measured paints · scan yours free', CANVAS_W / 2, 1716, {
    font: res.fonts.cyber,
    size: 23,
    colour: '#8a9a8a',
    letter: 2,
    maxWidth: CANVAS_W - 140,
  });
  ctx.restore();
}

/** Convenience: compose the frame at elapsed time t (drives QA screenshots). */
export function composeAt(ctx: CanvasRenderingContext2D, t: number, res: RevealResources): void {
  composeReveal(ctx, frameState(t, res.spec), res);
}

// Dev-only hook so tests can render deterministic frames without MediaRecorder
// (headless offscreen renderers suspend timers, so the real-time record can't be
// driven under test). Tree-shaken out of production builds.
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__revealDebug = {
    buildRevealSpec,
    prepareResources,
    recipeSteps,
    composeAt,
    scheduleRevealAudio,
  };
}
