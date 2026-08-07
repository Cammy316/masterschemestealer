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
  measureMaskBounds,
  measureMeanLuma,
  paintBackdrop,
  type MaskBounds,
  type RevealSkin,
} from './revealLayers';
import { scheduleRevealAudio, revealAudioBeats } from './revealAudio';
import {
  CANVAS_H,
  CANVAS_W,
  CALLOUT_CHIP_R,
  CALLOUT_RAIL,
  CONTENT_CX,
  CHIP_GAP,
  CHIP_H,
  COMPACT_BOX,
  FULL_BOX,
  LAYOUT,
  RECIPE_SCRIM_TOP,
  recipeRowY,
  type Rect,
} from './revealLayout';
import {
  frameState,
  smoothstep,
  sortRegionsForReveal,
  MAX_CAMERA_SCALE,
  type RevealCamera,
  type RevealFrameState,
  type RevealRecipeStep,
  type RevealSpec,
  type CaptionPreset,
} from './revealTimeline';

// Every position lives in revealLayout — the single source of truth for what is
// inside the platform safe area. Re-exported so existing importers are unaffected.
export { CANVAS_W, CANVAS_H, SAFE_RECT, type Rect } from './revealLayout';

/** Model dimming ahead of the scan line, so the sweep visibly lights it up.
 *  Kept shallow — the pre-scan model still has to READ at feed size. */
const PRE_SCAN_DIM = 0.62;

/** Callout label type. Shared by the draw call and the leader-start measurement
 *  so the line always begins clear of the glyphs. */
const LABEL_SIZE = 36;
const LABEL_MAX_W = 380;

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

/** The app's fixed band vocabulary. A bare number means nothing to a viewer who
 *  has never used the product; the word is what makes ΔE legible. Computed from
 *  the value, never hardcoded. */
export function deltaBandName(deltaE: number): string {
  if (deltaE <= 2) return 'PERFECT';
  if (deltaE <= 5) return 'CLOSE';
  if (deltaE <= 10) return 'FAIR';
  return 'DISTANT';
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
  /** LAYER dimensions, not the source photo's. Layers are built at composition
   *  scale (see prepareResources) — the aspect ratio is preserved, so these
   *  drive fitRect identically while every per-frame drawImage samples a small
   *  texture instead of a 12-megapixel one. */
  imgW: number;
  imgH: number;
  /** The static cogitator backdrop, rendered once and blitted per frame. */
  backdropLayer: HTMLCanvasElement;
  /** The finished frame-1 composition, rendered once — the loop dissolve is
   *  frameState(0) every time, so re-composing it per frame was pure waste. */
  loopTargetLayer: HTMLCanvasElement;
  heroLayer: HTMLCanvasElement;
  greyLayer: HTMLCanvasElement;
  /** Grey base + every region at full reveal, flattened. Once the blooms have
   *  settled the model stops changing except for the camera, so the outro can
   *  draw ONE layer instead of the base twice plus one per region. */
  revealedLayer: HTMLCanvasElement | null;
  regionLayers: (HTMLCanvasElement | null)[]; // aligned to spec.regions order
  rimLayers: (HTMLCanvasElement | null)[];
  /** Normalised extent per region, so leaders can stop at the near EDGE of a
   *  region instead of driving to its centroid across the model. */
  regionBounds: (MaskBounds | null)[];
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

/**
 * Physical canvas for a given output scale. Composition always happens in
 * logical 1080×1920 coordinates — the scale is applied as a context transform
 * (see `applyOutputScale`), so no layout, font size or geometry constant has to
 * know about it. Used to drop the MediaRecorder fallback to 720×1280, where the
 * software encoder is the bottleneck.
 */
export function outputSize(scale: number): { width: number; height: number } {
  return { width: Math.round(CANVAS_W * scale), height: Math.round(CANVAS_H * scale) };
}

/** Reset the context to logical 1080×1920 space for the given output scale. */
export function applyOutputScale(ctx: CanvasRenderingContext2D, scale: number): void {
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

/** Load image + decode masks + pre-build layers. Browser-only. */
export async function prepareResources(
  imageUrl: string,
  colors: Color[],
  maskFrame: MaskFrame | undefined,
  spec: RevealSpec,
  outputScale = 1,
): Promise<RevealResources> {
  const img = await loadImage(imageUrl);

  // Build every layer at the largest size it can ever be DRAWN at, not at the
  // photo's native resolution. A background-removed phone photo is ~12 MP; a
  // dozen layers of that scaled down per frame cost ~70 ms/frame and starved
  // the 33 ms budget, which is what made the export stutter at ~12 fps.
  // The output scale folds in here too, so a 720p export builds 720p layers.
  const fitted = fitRect(img.naturalWidth, img.naturalHeight, FULL_BOX);
  const layerScale = Math.min(1, (fitted.w * MAX_CAMERA_SCALE * outputScale) / img.naturalWidth);
  const imgW = Math.max(1, Math.round(img.naturalWidth * layerScale));
  const imgH = Math.max(1, Math.round(img.naturalHeight * layerScale));

  const heroLayer = buildHeroLayer(img, imgW, imgH);
  if (!heroLayer) throw new Error('Failed to build base layer');
  // Greyscale brightness adapts to the model's measured luma so a dark scheme
  // reads as a visible grey model, not a silhouette.
  const greyLayer = buildBaseLayer(img, imgW, imgH, true, adaptiveVideoDim(measureMeanLuma(heroLayer)));
  if (!greyLayer) throw new Error('Failed to build base layer');

  // Full-frame cached layers are stored at PHYSICAL output size so their
  // per-frame blit is 1:1, but painted through the scale transform so they keep
  // logical geometry (the 26 px grid stays 26 logical px at any output size).
  const phys = outputSize(outputScale);

  // The backdrop is fully determined by (size, skin): render it once instead of
  // repainting three full-canvas gradients and ~116 grid strips every frame —
  // twice per frame during the loop crossfade.
  const backdropLayer = document.createElement('canvas');
  backdropLayer.width = phys.width;
  backdropLayer.height = phys.height;
  const bctx = backdropLayer.getContext('2d');
  if (!bctx) throw new Error('2D canvas unavailable');
  applyOutputScale(bctx, outputScale);
  paintBackdrop(bctx, CANVAS_W, CANVAS_H, spec.skin);

  const built = await Promise.all(
    spec.regions.map(async (r) => {
      const b64 = colors[r.index]?.mask;
      if (!b64) return { region: null, rim: null };
      const mask = await decodeMask(b64);
      if (!mask) return { region: null, rim: null, bounds: null };
      return {
        region: buildRegionLayer(img, mask, imgW, imgH, maskFrame),
        rim: buildRegionRimLayer(mask, imgW, imgH, maskFrame, r.hex),
        bounds: measureMaskBounds(mask, maskFrame, imgW, imgH),
      };
    }),
  );

  const loopTargetLayer = document.createElement('canvas');
  loopTargetLayer.width = phys.width;
  loopTargetLayer.height = phys.height;

  const revealedLayer = buildRevealedComposite(
    greyLayer,
    built.map((b) => b.region),
    imgW,
    imgH,
  );

  const res: RevealResources = {
    spec,
    fonts: resolveFonts(),
    imgW,
    imgH,
    backdropLayer,
    loopTargetLayer,
    heroLayer,
    greyLayer,
    revealedLayer,
    regionLayers: built.map((b) => b.region),
    rimLayers: built.map((b) => b.rim),
    regionBounds: built.map((b) => b.bounds ?? null),
    callouts: layoutRailCallouts(spec.regions.map((r) => r.position)),
  };

  // Bake the loop target now (fonts are loaded before prepareResources runs).
  const lctx = loopTargetLayer.getContext('2d');
  if (lctx) {
    applyOutputScale(lctx, outputScale);
    drawLoopTarget(lctx, res);
  }
  return res;
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
/**
 * Block/symbol glyphs ONLY — never A–Z.
 *
 * The letter-based garble spelled plausible fake words: real exports showed
 * CYSJ, SCGRBP, MAGENR9, BLASH, REB — each held long enough to read at 30 fps.
 * A product whose brand is measured accuracy cannot appear unable to spell.
 * With symbols an unresolved label reads unmistakably as decryption, and a
 * wrong-looking word is impossible by construction rather than unlikely.
 */
const GARBLE_GLYPHS = '▓▒░#/\\<>|';

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

  // Result-oriented headline copy. The old "CAN THE MACHINE READ THIS PAINT
  // JOB?" was a yes/no question the viewer already knew the answer to, and it
  // sold the process rather than the payoff. These never assert anything the
  // engine cannot know — no chapter or army names, which it does not detect.
  if (spec.captionPreset === 'never-guess') return 'NEVER GUESS A RECIPE AGAIN';
  if (spec.captionPreset === 'exact-paints') return 'THE EXACT PAINTS ON THIS MODEL';
  if (spec.captionPreset === 'measured') {
    const dE = spec.recipe.find((s) => s.role === 'base')?.deltaE;
    return typeof dE === 'number' && dE > 0
      ? `ΔE ${dE.toFixed(1)}. MEASURED, NOT GUESSED.`
      : 'MEASURED, NOT GUESSED.';
  }

  // 'colours' — the progress counter, now opening on the proof rather than a question.
  if (state.phase === 'proof' || state.phase === 'smash') return 'THE EXACT PAINTS ON THIS MODEL';
  if (state.phase === 'sweep') return 'SCANNING…';
  if (state.phase === 'reveal')
    // Never render 0/n — announcing that nothing has happened yet is not a hook.
    return `READING… ${Math.max(1, state.identifiedCount)}/${spec.colourCount} COLOURS`;
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

/**
 * Flatten "scanned grey base + every region revealed" into one layer.
 *
 * Mirrors exactly what the per-frame path draws once the blooms have settled:
 * the base twice (PRE_SCAN_DIM then the remainder, as drawGreyModel does when
 * fully scanned), then each region at full alpha. Source-over composites
 * associatively here, so blitting this layer over the backdrop is pixel-wise
 * identical to the seven separate draws it replaces.
 */
function buildRevealedComposite(
  greyLayer: HTMLCanvasElement,
  regionLayers: (HTMLCanvasElement | null)[],
  w: number,
  h: number,
): HTMLCanvasElement | null {
  const layer = document.createElement('canvas');
  layer.width = w;
  layer.height = h;
  const ctx = layer.getContext('2d');
  if (!ctx) return null;
  ctx.globalAlpha = PRE_SCAN_DIM;
  ctx.drawImage(greyLayer, 0, 0);
  ctx.globalAlpha = 1 - PRE_SCAN_DIM;
  ctx.drawImage(greyLayer, 0, 0);
  ctx.globalAlpha = 1;
  for (const region of regionLayers) if (region) ctx.drawImage(region, 0, 0);
  return layer;
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

/**
 * Frame-0 / loop-target composition, DERIVED from frameState(0) so the loop and
 * the opening frame can never drift apart.
 *
 * This is the PROOF frame: the painter's model in full colour with the finished
 * recipe already stamped over it. Proof-first — the answer before the question —
 * while the model stays the hero, because painters post these to show off their
 * own work, not to advertise us. It also makes the loop perfect for free: the
 * clip ends on model + recipe, which is exactly this.
 */
export function drawLoopTarget(ctx: CanvasRenderingContext2D, res: RevealResources): void {
  const s0 = frameState(0, res.spec);
  const r = modelRectAt(s0.camera, res.imgW, res.imgH);
  ctx.drawImage(res.backdropLayer, 0, 0, CANVAS_W, CANVAS_H);
  drawHeroGlow(ctx, res, r, s0.heroGlow);
  withRock(ctx, r, s0.camera.rotationDeg, () => {
    ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  });
  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accentFor(res.spec.skin));
  const cap = captionText(res.spec, s0);
  if (cap)
    drawText(ctx, cap, CONTENT_CX, LAYOUT.headline.y + 24, {
      font: res.fonts.cyber,
      size: 40,
      colour: accentFor(res.spec.skin),
      glow: 16,
      letter: 2,
      maxWidth: LAYOUT.headline.w,
    });
  // Same renderer as the outro cascade at full progress, so the flash and the
  // payoff can never show different recipes.
  if (s0.proofAlpha > 0) drawRecipe(ctx, 1, s0.proofAlpha, res);
}

export function composeReveal(ctx: CanvasRenderingContext2D, state: RevealFrameState, res: RevealResources): void {
  const { spec } = res;
  const accent = accentFor(spec.skin);
  const r = modelRectAt(state.camera, res.imgW, res.imgH);
  const hud = 1 - state.hudFade;
  const finaleIndex = spec.regions.length - 1; // dominant colour blooms last

  ctx.drawImage(res.backdropLayer, 0, 0, CANVAS_W, CANVAS_H);
  drawHeroGlow(ctx, res, r, state.heroGlow);

  // Once every bloom has landed and its rim has died away, the model is a fixed
  // image under a moving camera — draw the flattened layer instead of the base
  // twice plus one draw per region.
  const settled =
    !!res.revealedLayer &&
    state.baseAlpha === 1 &&
    state.scanned === 1 &&
    state.regions.length > 0 &&
    state.regions.every((rs) => rs.revealProgress >= 1 && rs.pulse <= 0);

  withRock(ctx, r, state.camera.rotationDeg, () => {
    if (state.fullRestore >= 1) {
      // Past the slam the entire photo is back in colour — base, scenic, all of
      // it. Nothing left to composite per region.
      ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
    } else if (settled) {
      ctx.drawImage(res.revealedLayer!, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
    } else {
      drawGreyModel(ctx, res, r, state.baseAlpha, state.scanned);

      // Region colour blooms — the painter's REAL pixels, drawn clean. The rim
      // flashes at the moment of identification then dies away entirely: a
      // permanent outline traced every pinhole in real grabCut masks and read
      // as crayon scribble.
      state.regions.forEach((rs, i) => {
        if (rs.revealProgress <= 0) return;
        const layer = res.regionLayers[i];
        if (layer) {
          ctx.save();
          ctx.globalAlpha = rs.revealProgress;
          ctx.drawImage(layer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
          ctx.restore();
        }
        // Glow is pre-baked into the rim layer, so the pulse is a plain alpha
        // blend — no per-frame gaussian blur.
        const rim = res.rimLayers[i];
        if (rim && rs.pulse > 0) {
          const finale = i === finaleIndex ? 1.25 : 1;
          ctx.save();
          ctx.globalAlpha = Math.min(1, rs.pulse * finale);
          ctx.drawImage(rim, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
          ctx.restore();
        }
      });
    }

    // The slam: the rest of the image fades back to full colour over the
    // detected-region composite.
    if (state.fullRestore > 0 && state.fullRestore < 1) {
      ctx.save();
      ctx.globalAlpha = state.fullRestore;
      ctx.drawImage(res.heroLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
      ctx.restore();
    }

    // The hero (full colour) sits on top until the snap strobes it away, with
    // a chromatic-aberration hit as it goes (hue-shifted echoes; browsers
    // without canvas filters just get the ghost offsets, which still read).
    if (state.heroAlpha > 0) {
      // NOTE: no colour wash over the model. The smash cut used to draw the hero
      // twice under hue-rotate(±120°) — rotating red by 120° yields green, so the
      // proof frame measured G exceeding R by 22 levels for ~3 frames. Tinting the
      // subject is the one thing a colour-accuracy product must never do, even
      // briefly. The glitch now lives on the backdrop and chrome only.
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

  // Impact flash + chromatic tear on the cut to greyscale. Both are drawn on the
  // BACKDROP band above and below the model, never over the subject: a sharp pop
  // with square falloff so the frame never sits tinted.
  if (state.snapFlash > 0) {
    const pop = state.snapFlash * state.snapFlash;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = hexToRgba(accent, 0.16 * pop);
    ctx.fillRect(0, 0, CANVAS_W, r.y);
    ctx.fillRect(0, r.y + r.h, CANVAS_W, CANVAS_H - (r.y + r.h));
    // torn scan bands across the chrome, offset like a mistracked signal
    const shift = 10 * pop;
    ctx.fillStyle = hexToRgba(accent, 0.1 * pop);
    for (let i = 0; i < 6; i++) {
      const by = ((i * 317) % Math.max(1, Math.floor(CANVAS_H))) as number;
      ctx.fillRect(shift * (i % 2 ? 1 : -1), by, CANVAS_W, 6);
    }
    ctx.restore();
  }

  // Rail callouts: leader line + chip + garble family label.
  res.callouts.forEach((c) => {
    const rs = state.regions[c.index];
    const region = spec.regions[c.index];
    if (!rs || !region || rs.labelReveal <= 0 || hud <= 0) return;
    const hex = region.hex;
    const railX = c.side === 'left' ? CALLOUT_RAIL.left : CALLOUT_RAIL.right;
    const railY = r.y + c.railY * r.h;
    const dir = c.side === 'left' ? 1 : -1;

    // Anchor at the region's NEAR EDGE, not its centroid. The backend gives one
    // point per colour — its centre — so a leader aimed at it drove deep across
    // the model, over the paint job the clip exists to show off. With the mask's
    // extent known the line stops the moment it reaches the region.
    const bounds = res.regionBounds[c.index];
    const anchorFx = bounds
      ? c.side === 'left'
        ? Math.min(bounds.x0 + 0.02, c.anchorX)
        : Math.max(bounds.x1 - 0.02, c.anchorX)
      : c.anchorX;
    const anchorFy = bounds ? Math.min(Math.max(c.anchorY, bounds.y0), bounds.y1) : c.anchorY;
    const anchorX = r.x + anchorFx * r.w;
    const anchorY = r.y + anchorFy * r.h;

    // The recipe belongs to ONE region — keep its chip alive while the cascade runs.
    const owns = c.index === spec.recipeRegionIndex && state.recipeProgress > 0;
    const ownPulse = owns ? 0.5 + 0.5 * Math.sin(state.recipeProgress * Math.PI * 6) : 0;

    // ALL callout chrome uses a lightness-lifted tint. Drawing it in the true
    // hex left BLACK's leader as #141414 on a void backdrop — a label connected
    // to nothing. The honest colour story is carried by the revealed region on
    // the model itself, which shows the actual paint; the leader is chrome.
    const tint = labelTint(hex);

    // The leader must begin PAST the label, not at the chip. Starting at the
    // chip edge drew the line straight through the type — on long labels like
    // DARK GREY almost the whole leader was buried under the glyphs, which is
    // exactly why those callouts looked attached to nothing.
    const label = garbleReveal((region.family || region.hex).toUpperCase(), rs.labelReveal);
    ctx.save();
    ctx.font = `700 ${LABEL_SIZE}px ${res.fonts.cyber}`;
    const labelW = Math.min(LABEL_MAX_W, ctx.measureText(label).width);
    ctx.restore();
    const leaderStart = railX + dir * (CALLOUT_CHIP_R + 18 + labelW + 18);

    // Turn the corner on the FAR side of the label, then hop to the anchor.
    // Clamping the elbow to the model's edge alone put it between the chip and
    // the label, so the horizontal run doubled back straight through the type.
    const modelEdge = c.side === 'left' ? r.x : r.x + r.w;
    const elbowX =
      c.side === 'left'
        ? Math.min(Math.max(leaderStart, modelEdge - 26), Math.max(anchorX - 12, leaderStart))
        : Math.max(Math.min(leaderStart, modelEdge + 26), Math.min(anchorX + 12, leaderStart));

    ctx.save();
    ctx.globalAlpha = rs.labelReveal * hud;
    // leader line (circuit elbow)
    ctx.strokeStyle = tint;
    ctx.lineWidth = owns ? 4 : 2.5;
    ctx.shadowColor = tint;
    ctx.shadowBlur = 8 + ownPulse * 18;
    ctx.beginPath();
    ctx.moveTo(leaderStart, railY);
    ctx.lineTo(elbowX, railY);
    ctx.lineTo(elbowX, anchorY);
    ctx.lineTo(anchorX, anchorY);
    ctx.stroke();
    // anchor dot
    ctx.fillStyle = tint;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(railX, railY, CALLOUT_CHIP_R, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5,7,10,0.92)';
    ctx.fill();
    ctx.lineWidth = owns ? 5 : 3;
    ctx.strokeStyle = tint;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = rs.labelReveal * hud;
    drawText(ctx, String(c.index + 1), railX, railY, { font: res.fonts.cyber, size: 32, colour: tint });
    const labelX = c.side === 'left' ? railX + CALLOUT_CHIP_R + 18 : railX - CALLOUT_CHIP_R - 18;
    drawText(ctx, label, labelX, railY, {
      font: res.fonts.cyber,
      size: LABEL_SIZE,
      colour: tint,
      align: c.side === 'left' ? 'left' : 'right',
      glow: 12,
      maxWidth: LABEL_MAX_W,
    });
    ctx.restore();
  });

  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accent);

  // Burned-in caption.
  const cap = captionText(spec, state);
  if (cap && hud > 0) {
    ctx.save();
    ctx.globalAlpha = hud;
    drawText(ctx, cap, CONTENT_CX, LAYOUT.headline.y + 24, {
      font: res.fonts.cyber,
      size: 40,
      colour: accent,
      glow: 16,
      letter: 2,
      maxWidth: LAYOUT.headline.w,
    });
    ctx.restore();
  }

  // Proof stamp: the finished recipe, up front, before it is torn away. Same
  // renderer at full progress as the outro, so the two can never disagree.
  if (state.proofAlpha > 0) drawRecipe(ctx, 1, state.proofAlpha, res);

  // Recipe outro cascade. Gated on the box morph so the heading never draws
  // over the model's feet while it is still easing into the compact framing.
  const recipeAlpha = hud * (state.phase === 'recipe' ? smoothstep(state.camera.boxLerp) : 1);
  if (state.recipeProgress > 0 && recipeAlpha > 0) drawRecipe(ctx, state.recipeProgress, recipeAlpha, res);

  // Brand plate + persistent watermark.
  // NOT gated on hud: the HUD clearing is what makes the end card's frame clean.
  if (state.plateAlpha > 0) drawPlate(ctx, state.plateAlpha, res);
  if (state.phase !== 'proof' && hud > 0) drawWatermark(ctx, hud, res);

  // Loop dissolve back to frame 1 (the hero) — a blit of the pre-baked target.
  // The HUD has already faded, so nothing ghosts through the crossfade.
  if (state.loopCrossfade > 0) {
    ctx.save();
    ctx.globalAlpha = state.loopCrossfade;
    ctx.drawImage(res.loopTargetLayer, 0, 0, CANVAS_W, CANVAS_H);
    ctx.restore();
  }
}

function drawRecipe(ctx: CanvasRenderingContext2D, progress: number, hud: number, res: RevealResources): void {
  const { spec } = res;
  const steps = spec.recipe;
  if (steps.length === 0) return;
  const accent = accentFor(spec.skin);
  const owner = spec.recipeRegionIndex >= 0 ? spec.regions[spec.recipeRegionIndex] : undefined;

  // Scrim behind the block. During the proof stamp the model is punched in and
  // the heading lands ON it, so unbacked text is unreadable; in the outro the
  // area is already void, where this is invisible.
  const blockTop = RECIPE_SCRIM_TOP;
  const scrim = ctx.createLinearGradient(0, blockTop, 0, blockTop + 120);
  scrim.addColorStop(0, 'rgba(3,5,8,0)');
  scrim.addColorStop(1, 'rgba(3,5,8,0.82)');
  ctx.save();
  ctx.globalAlpha = hud;
  ctx.fillStyle = scrim;
  ctx.fillRect(0, blockTop, CANVAS_W, 120);
  ctx.fillStyle = 'rgba(3,5,8,0.82)';
  ctx.fillRect(0, blockTop + 120, CANVAS_W, CANVAS_H - blockTop - 120);
  ctx.restore();

  ctx.save();
  ctx.globalAlpha = hud;
  drawText(ctx, `${spec.brand.toUpperCase()} RECIPE`, CONTENT_CX, LAYOUT.recipeHeading.y + 26, {
    font: res.fonts.gothic,
    size: 44,
    colour: accent,
    glow: 12,
    maxWidth: LAYOUT.recipeHeading.w,
  });
  // Name WHICH colour this recipe is for — five regions were called out, only
  // one gets a breakdown, and the viewer should never have to guess which.
  if (owner) {
    drawText(
      ctx,
      `DOMINANT · ${(owner.family || owner.hex).toUpperCase()}`,
      CONTENT_CX,
      LAYOUT.recipeSubheading.y + 15,
      { font: res.fonts.cyber, size: 26, colour: labelTint(owner.hex), letter: 2, maxWidth: LAYOUT.recipeSubheading.w },
    );
  }
  ctx.restore();

  steps.forEach((step, i) => {
    const appear = Math.max(0, Math.min(1, progress * steps.length - i));
    if (appear <= 0) return;
    const roleAccent = ROLE_ACCENT[step.role];
    // Row geometry comes from the layout table; the right edge stops at 900 so
    // the delta-E badge clears the platform's action rail.
    const y = recipeRowY(i);
    const x = LAYOUT.recipeRows.x;
    const w = LAYOUT.recipeRows.w;
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
      maxWidth: w - 118 - 20 - (showDelta ? 250 : 0),
    });
    if (showDelta) {
      drawText(ctx, `ΔE ${step.deltaE!.toFixed(1)} · ${deltaBandName(step.deltaE!)}`, x + w - 26, y + CHIP_H / 2, {
        font: res.fonts.cyber,
        size: 26,
        colour: deltaBandColour(step.deltaE!),
        align: 'right',
      });
    }
    ctx.restore();
  });
}

/**
 * Small, persistent, and ABOVE the platform's furniture. The flex is the recipe
 * — the brand only has to be findable, not shouted, or nobody posts this to
 * their own grid.
 *
 * It used to sit at y=1874 (97.6% down), which TikTok and Reels bury completely
 * under the caption, username and action rail. Anything that must be read lives
 * above ~82% of the frame; the empty band below is deliberate safe margin, not
 * wasted space.
 */
function drawWatermark(ctx: CanvasRenderingContext2D, alpha: number, res: RevealResources): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  drawText(ctx, 'schemestealer.com', LAYOUT.watermark.x + LAYOUT.watermark.w, LAYOUT.watermark.y + 22, {
    font: res.fonts.cyber,
    size: 24,
    weight: 600,
    colour: '#c8d8cc',
    align: 'right',
    letter: 1,
  });
  ctx.restore();
}

function drawPlate(ctx: CanvasRenderingContext2D, alpha: number, res: RevealResources): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const accent = accentFor(res.spec.skin);
  drawText(ctx, 'SCHEMESTEALER', CONTENT_CX, LAYOUT.endCardTitle.y + 30, {
    font: res.fonts.gothic,
    size: 40,
    colour: accent,
    glow: 14,
  });
  drawText(ctx, 'measured, not guessed · scan yours free', CONTENT_CX, LAYOUT.endCardSub.y + 18, {
    font: res.fonts.cyber,
    size: 23,
    colour: '#8a9a8a',
    letter: 2,
    maxWidth: LAYOUT.endCardSub.w,
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
    applyOutputScale,
    outputSize,
    scheduleRevealAudio,
    revealAudioBeats,
    // The offline encoder is a dynamic chunk in production; tests pull it in on
    // demand, which registers window.__revealOfflineDebug.
    loadOffline: () => import('./renderRevealOffline'),
  };
}
