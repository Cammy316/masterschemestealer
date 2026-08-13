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
import type { RevealStoryboard } from './revealStoryboard';
import {
  CANVAS_H,
  CANVAS_W,
  CALLOUT_CHIP_R,
  CALLOUT_RAIL,
  calloutLeaderPath,
  FRAME_CX,
  CHIP_GAP,
  CHIP_H,
  COMPACT_BOX,
  DECOR_BAND,
  FULL_BOX,
  LAYOUT,
  RECIPE_SCRIM_TOP,
  recipeRowY,
  type Rect,
} from './revealLayout';
import {
  frameState,
  nameCipherFraction,
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
import { SAFE_RECT } from './revealLayout';

/** Model dimming ahead of the scan line, so the sweep visibly lights it up.
 *  Kept shallow — the pre-scan model still has to READ at feed size. */
const PRE_SCAN_DIM = 0.62;

/** Callout label type. Shared by the draw call and the leader-start measurement
 *  so the line always begins clear of the glyphs. */
const LABEL_SIZE = 36;
/** ΔE pill type. Sized so the longest band word (DISTANT) still fits the pill. */
const BADGE_TEXT_SIZE = 24;
const LABEL_MAX_W = 380;

const ROLE_ACCENT: Record<RevealRecipeStep['role'], string> = {
  base: '#00FF41',
  highlight: '#FFD700',
  shade: '#2AA6FF',
  wash: '#A78BFA',
};

// accentFor now lives in revealTheme — re-exported here because every existing
// importer reaches for it through this module.
import { accentFor, themeFor, qualityColour } from './revealTheme';
export { accentFor, themeFor };

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
/** sRGB relative luminance, 0..1 — the quantity WCAG contrast is defined on.
 *  Not the 0.2126R+0.7152G+0.0722B byte average used elsewhere in this file:
 *  that one skips the gamma step, which is worth ~2x on dark colours and is the
 *  difference between a label that passes 4.5:1 and one that does not. */
export function relLuma(r: number, g: number, b: number): number {
  const f = (v: number) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrastRatio(l1: number, l2: number): number {
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Push `hex` toward white or black until it clears `minRatio` against a
 * background of relative luminance `bg`, keeping its hue.
 *
 * labelTint lifts dark families toward a fixed luma floor, but that floor is
 * computed against THE VOID — and these callouts land on the MODEL. Measured on
 * the shipped pict-cast: DARK GREY and BLACK rendered as dark glyphs over red
 * armour, and RED rendered red-on-red. The floor was right about the backdrop
 * and wrong about what was actually behind the type.
 */
export function contrastTint(hex: string, bg: number, minRatio = 4.5): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (!Number.isFinite(n)) return hex;
  const r0 = (n >> 16) & 255;
  const g0 = (n >> 8) & 255;
  const b0 = n & 255;
  if (contrastRatio(relLuma(r0, g0, b0), bg) >= minRatio) return hex;

  // Whichever direction has the headroom. A mid-grey background may have
  // neither, in which case we take the better of the two extremes rather than
  // returning something that fails silently.
  const toward = (target: number) => {
    let lo = 0;
    let hi = 1;
    let best = target === 255 ? '#ffffff' : '#000000';
    for (let i = 0; i < 12; i++) {
      const t = (lo + hi) / 2;
      const r = Math.round(r0 + (target - r0) * t);
      const g = Math.round(g0 + (target - g0) * t);
      const b = Math.round(b0 + (target - b0) * t);
      const ratio = contrastRatio(relLuma(r, g, b), bg);
      const hx = (v: number) => v.toString(16).padStart(2, '0');
      if (ratio >= minRatio) {
        best = `#${hx(r)}${hx(g)}${hx(b)}`;
        hi = t;
      } else {
        lo = t;
      }
    }
    return best;
  };
  const up = contrastRatio(relLuma(255, 255, 255), bg) >= minRatio;
  const down = contrastRatio(relLuma(0, 0, 0), bg) >= minRatio;
  if (up && !down) return toward(255);
  if (down && !up) return toward(0);
  // Both work: go away from the background, which keeps more of the hue.
  return bg > 0.18 ? toward(0) : toward(255);
}

/** Mean relative luminance of a small patch of what is ALREADY on the canvas.
 *  Sampled coarsely on purpose — this decides an ink colour, not a rendering,
 *  and it runs once per callout per frame. */
export function sampleBackdropLuma(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
): number {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const w0 = Math.max(1, Math.min(Math.floor(w), ctx.canvas.width - x0));
  const h0 = Math.max(1, Math.min(Math.floor(h), ctx.canvas.height - y0));
  let d: Uint8ClampedArray;
  try {
    d = ctx.getImageData(x0, y0, w0, h0).data;
  } catch {
    return 0; // tainted canvas — treat as the void, which is the old behaviour
  }
  let sum = 0;
  let count = 0;
  // MUST be a multiple of 4, or the loop walks off the RGBA phase and reads
  // green/blue/alpha as red/green/blue.
  const step = 4 * Math.max(1, Math.floor((w0 * h0) / 400));
  for (let i = 0; i + 2 < d.length; i += step) {
    sum += relLuma(d[i], d[i + 1], d[i + 2]);
    count++;
  }
  return count ? sum / count : 0;
}

/**
 * Where a callout's label text lands, for a given model rect.
 *
 * Exported so the contrast gate can measure the exact pixels the type occupies
 * rather than guessing a box around the rail. Kept next to the drawing code so
 * the two cannot drift.
 */
export function calloutLabelBox(
  side: 'left' | 'right',
  railY: number,
  labelW: number,
): { x: number; y: number; w: number; h: number } {
  const railX = side === 'left' ? CALLOUT_RAIL.left : CALLOUT_RAIL.right;
  const labelX = side === 'left' ? railX + CALLOUT_CHIP_R + 18 : railX - CALLOUT_CHIP_R - 18;
  return {
    x: side === 'left' ? labelX : labelX - labelW,
    y: railY - LABEL_SIZE * 0.7,
    w: labelW,
    h: LABEL_SIZE * 1.4,
  };
}

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
  // Returned as #rrggbb, not rgb(), so the result can be fed back into
  // hexToRgba. It used to return rgb(), which parses as NaN there and silently
  // fell back to imperial green — every warp orb rim rendered green.
  const h2 = (v: number) => v.toString(16).padStart(2, '0');
  return `#${h2(r)}${h2(g)}${h2(b)}`;
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
 *  perfect ≤2 · close ≤5 · fair ≤10 · distant beyond. Skin-aware — see
 *  qualityColour; the thresholds are shared, only the hues differ. */
export function deltaBandColour(deltaE: number, skin: RevealSkin = 'imperial'): string {
  return qualityColour(deltaE, skin);
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
export function modelRectAt(
  camera: RevealCamera,
  imgW: number,
  imgH: number,
  // The framing boxes are parameters so the inspiration storyboard can share
  // this camera — Ken Burns, region punch and the outro morph are identical
  // there; only the boxes differ, because an inspiration photo is usually
  // landscape or square rather than a tall figure.
  fullBox: Rect = FULL_BOX,
  compactBox: Rect = COMPACT_BOX,
): Rect {
  const fitted = fitRect(imgW, imgH, lerpRect(fullBox, compactBox, camera.boxLerp));
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
  /** Pre-baked sensor-grain tiles, cycled per frame — see drawAmbient. */
  grainTiles: HTMLCanvasElement[];
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
  const greyLayer = buildBaseLayer(img, imgW, imgH, true, adaptiveVideoDim(measureMeanLuma(heroLayer)), spec.skin);
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
    grainTiles: buildGrainTiles(),
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

export function loadImage(url: string): Promise<HTMLImageElement> {
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

export function drawText(
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
  drawDecorBand(ctx, accentFor(res.spec.skin), 0);
  const cap = captionText(res.spec, s0);
  if (cap)
    drawText(ctx, cap, FRAME_CX, LAYOUT.headline.y + 24, {
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
  // The seam is frame 0 vs this. The watermark and the ambient layer now draw
  // in every composed frame, so they have to be here too — at p=0, which is
  // exactly what the live path produces at both ends of the loop.
  drawWatermark(ctx, 1, res.fonts, res.spec.skin);
  drawAmbient(ctx, res.grainTiles, accentFor(res.spec.skin), 0);
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

    const modelEdge = c.side === 'left' ? r.x : r.x + r.w;
    const leader = calloutLeaderPath({
      side: c.side,
      leaderStart,
      railY,
      anchorX,
      anchorY,
      modelEdge,
    });

    ctx.save();
    ctx.globalAlpha = rs.labelReveal * hud;
    // leader line (circuit elbow)
    ctx.strokeStyle = tint;
    ctx.lineWidth = owns ? 4 : 2.5;
    ctx.shadowColor = tint;
    ctx.shadowBlur = 8 + ownPulse * 18;
    ctx.beginPath();
    ctx.moveTo(leader[0].x, leader[0].y);
    for (let i = 1; i < leader.length; i++) ctx.lineTo(leader[i].x, leader[i].y);
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
    /**
     * Ink solved against what is ACTUALLY behind this label, sampled from the
     * canvas as composed so far, this frame.
     *
     * labelTint lifts dark families toward a luma floor computed against the
     * void — but a callout sits over the MODEL. Measured on the shipped clip:
     * DARK GREY and BLACK rendered as dark glyphs over red armour and RED
     * rendered red-on-red. The floor was right about the backdrop and wrong
     * about the thing in front of it.
     */
    const box = calloutLabelBox(c.side, railY, labelW);
    const bgLuma = sampleBackdropLuma(ctx, box.x, box.y, box.w, box.h);
    const inkColour = contrastTint(tint, bgLuma, 4.5);
    drawText(ctx, label, labelX, railY, {
      font: res.fonts.cyber,
      size: LABEL_SIZE,
      colour: inkColour,
      align: c.side === 'left' ? 'left' : 'right',
      glow: 12,
      maxWidth: LABEL_MAX_W,
    });
    ctx.restore();
  });

  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accent);
  drawDecorBand(ctx, accent, state.progress);

  // Burned-in caption. It fades out on the SAME driver that fades the recipe
  // block in, because the outro framing lifts the model to y=190 (it has to, to
  // keep 40% of frame height while clearing the recipe heading) and the caption
  // would otherwise sit across the model's head. It is also redundant there:
  // "5 COLOURS IDENTIFIED" adds nothing beside a card listing the five paints.
  const capAlpha = hud * (1 - smoothstep(state.camera.boxLerp));
  const cap = captionText(spec, state);
  if (cap && capAlpha > 0) {
    // The readout re-scrambles whenever its text changes — the counter ticking
    // from 3/5 to 4/5 is a machine re-reading, so it should look like one.
    ctx.save();
    ctx.globalAlpha = capAlpha;
    drawText(ctx, garbleReveal(cap, state.captionResolve), FRAME_CX, LAYOUT.headline.y + 24, {
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
  // The watermark is drawn in EVERY frame at a constant position, size and
  // opacity — it is the only branding that survives a re-upload, and gating it
  // on `hud` and `phase` meant it was absent from frame 0 and absent again
  // under the end card. A mark that flickers reads as a glitch, and a mark that
  // is missing from the frame someone screenshots is worth nothing.
  if (state.plateAlpha > 0) drawPlate(ctx, state.plateAlpha, res);
  drawWatermark(ctx, 1, res.fonts, res.spec.skin);

  // Continuous motion — above everything, below the loop crossfade so the
  // dissolve blends two frames that have both already been grained.
  drawAmbient(ctx, res.grainTiles, accent, state.progress);

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
  // What share of a row's entrance its name spends decrypting. Derived from the
  // duration rather than hardcoded, so a non-default clip length cannot turn a
  // 180 ms burst into a 600 ms one.
  const nameCipher = nameCipherFraction(spec.durationMs, steps.length);

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
  drawText(ctx, `${spec.brand.toUpperCase()} RECIPE`, FRAME_CX, LAYOUT.recipeHeading.y + 26, {
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
      FRAME_CX,
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
    // Chip internals are derived from CHIP_H, not hardcoded to it. They were
    // literals tuned for 84 px, so shrinking the row to 74 dropped every paint
    // name's descenders through the bottom border and pushed the swatch past it.
    const swatch = CHIP_H - 26;
    roundRect(ctx, x + 30, y + 13, swatch, swatch, 12);
    ctx.fillStyle = step.hex;
    ctx.fill();

    const textX = x + 30 + swatch + 20;
    drawText(ctx, step.role.toUpperCase(), textX, y + 28, {
      font: res.fonts.cyber,
      size: 20,
      colour: roleAccent,
      align: 'left',
    });
    // The name decrypts as the row lands. Same cipher as the region labels, and
    // compressed to CIPHER_MS so it is readable well before the next row.
    drawText(ctx, garbleReveal(step.name, Math.min(1, appear / nameCipher)), textX, y + 56, {
      font: res.fonts.tech,
      size: 30,
      colour: '#e8f0e8',
      align: 'left',
      maxWidth: x + w - 20 - textX,
    });
    ctx.restore();

    // The ΔE badge, on its own line under the base row.
    //
    // It used to sit right-aligned INSIDE this row, which squeezed the paint
    // name into a 332 px box and made the one measurement in the whole clip
    // read as a suffix on a product name. It is the proof the app rests on.
    //
    // Still base-only: ΔE is the distance from the DETECTED colour, which only
    // the base match measures. Putting it on derived partners would compare two
    // different quantities under one label. Honest badge or no badge.
    if (showDelta) {
      const b = LAYOUT.deltaBadge;
      const band = deltaBandColour(step.deltaE!);
      const text = `ΔE ${step.deltaE!.toFixed(1)} · ${deltaBandName(step.deltaE!)}`;
      ctx.save();
      ctx.globalAlpha = appear * hud;
      ctx.font = `700 ${BADGE_TEXT_SIZE}px ${res.fonts.cyber}`;
      const pillW = Math.min(b.w, ctx.measureText(text).width + 56);
      const pillX = FRAME_CX - pillW / 2;
      roundRect(ctx, pillX, b.y, pillW, b.h, b.h / 2);
      ctx.fillStyle = hexToRgba(band, 0.12);
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = band;
      ctx.shadowColor = band;
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;
      drawText(ctx, text, FRAME_CX, b.y + b.h / 2 + 1, {
        font: res.fonts.cyber,
        size: BADGE_TEXT_SIZE,
        colour: band,
        letter: 1,
        maxWidth: pillW - 24,
      });
      ctx.restore();
    }
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
export function drawWatermark(
  ctx: CanvasRenderingContext2D,
  alpha: number,
  fonts: RevealFonts,
  skin: RevealSkin,
): void {
  ctx.save();
  ctx.globalAlpha = alpha * 0.6;
  drawText(ctx, 'schemestealer.com', LAYOUT.watermark.x + LAYOUT.watermark.w, LAYOUT.watermark.y + 22, {
    font: fonts.cyber,
    size: 24,
    weight: 600,
    colour: themeFor(skin).muted,
    align: 'right',
    letter: 1,
  });
  ctx.restore();
}

/** How many grain tiles are cycled. Must divide GRAIN_STEPS exactly, or the
 *  cycle would not return to tile 0 at the loop point. */
const GRAIN_TILES = 4;
/** Tile advances across the clip. A multiple of GRAIN_TILES, so p=1 lands on
 *  the same tile as p=0 and the loop seam stays pixel-identical. */
const GRAIN_STEPS = 320;
/** Half-resolution tiles: 4 × 540×960 is ~8 MB of canvas, against ~33 MB at
 *  full res. This runs on phones — see the memory rules in CLAUDE.md. */
const GRAIN_W = 540;
const GRAIN_H = 960;
/** Additive, and deliberately low. At 0.024 the grain lifts pure black by ~3
 *  levels (which OLED prefers anyway) and moves the frame-to-frame delta well
 *  clear of the anti-freeze floor without reading as noise. */
const GRAIN_ALPHA = 0.024;

/** Deterministic sensor grain. Same mulberry32 the audio bed uses — a random
 *  grain would make the export non-reproducible and the loop seam a coin flip. */
export function buildGrainTiles(): HTMLCanvasElement[] {
  const tiles: HTMLCanvasElement[] = [];
  let seed = 0x811c9dc5;
  for (let t = 0; t < GRAIN_TILES; t++) {
    const c = document.createElement('canvas');
    c.width = GRAIN_W;
    c.height = GRAIN_H;
    const g = c.getContext('2d');
    if (!g) continue;
    const img = g.createImageData(GRAIN_W, GRAIN_H);
    const d = img.data;
    let s = (seed = (seed + 0x6d2b79f5) | 0);
    for (let i = 0; i < d.length; i += 4) {
      s = (s + 0x6d2b79f5) | 0;
      let x = Math.imul(s ^ (s >>> 15), 1 | s);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      const v = (x ^ (x >>> 14)) >>> 24; // 0..255
      d[i] = v;
      d[i + 1] = v;
      d[i + 2] = v;
      d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    tiles.push(c);
  }
  return tiles;
}

/**
 * The continuous motion layer. Runs the WHOLE clip, independent of phase.
 *
 * This exists because of a measurement, not a preference: composed at 30 Hz and
 * diffed pixel-by-pixel, the calmest 0.4 s window of the shipped clip scored a
 * mean channel delta of 0.012 — 42× below the floor. The payoff hold was a
 * still image in everything but name. Camera drift during that hold is about
 * 0.0127% scale per frame, roughly 0.1 px on a 780 px model, which is why every
 * field-based assertion passed while the screen sat frozen.
 *
 * Phase-driven motion cannot fix that, because a hold is BY DEFINITION the
 * absence of phase change. So the fix has to be something that never asks what
 * phase it is:
 *
 *  - sensor grain, cycled per frame, which touches every pixel including the
 *    black field that makes up most of the frame;
 *  - a slow cogitator refresh band traversing the height exactly once.
 *
 * Both are periodic in `p` (elapsed fraction), so the frame at p=1 is identical
 * to p=0 and the loop seam survives.
 */
export function drawAmbient(
  ctx: CanvasRenderingContext2D,
  tiles: HTMLCanvasElement[],
  accent: string,
  p: number,
): void {
  // Refresh band: one full traversal per clip, so it is exactly where it
  // started when the clip loops.
  const bandH = 460;
  const cy = -bandH / 2 + p * (CANVAS_H + bandH);
  const band = ctx.createLinearGradient(0, cy - bandH / 2, 0, cy + bandH / 2);
  band.addColorStop(0, hexToRgba(accent, 0));
  band.addColorStop(0.5, hexToRgba(accent, 0.05));
  band.addColorStop(1, hexToRgba(accent, 0));
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = band;
  ctx.fillRect(0, cy - bandH / 2, CANVAS_W, bandH);

  // Grain, additive so it registers on the black field rather than being
  // swallowed by it (an `overlay` blend over black is a no-op).
  if (tiles.length) {
    const idx = Math.floor(p * GRAIN_STEPS) % tiles.length;
    ctx.globalAlpha = GRAIN_ALPHA;
    ctx.drawImage(tiles[idx], 0, 0, CANVAS_W, CANVAS_H);
  }
  ctx.restore();
}

/**
 * The band below the safe area — 490 px, a quarter of the frame height.
 *
 * It carries NO information, deliberately: a platform caption bar covers all of
 * it and the viewer must lose nothing. But it was plain black, so on a phone
 * with no caption the clip simply ended in a void. This fills it with the same
 * cogitator furniture used elsewhere — a data ladder that drifts continuously,
 * so the band is never a still region even during a hold.
 *
 * `p` is elapsed fraction of the clip, and every term is periodic in it, so the
 * band at p=1 is identical to p=0 and cannot break the loop seam.
 */
export function drawDecorBand(ctx: CanvasRenderingContext2D, accent: string, p: number): void {
  const b = DECOR_BAND;
  ctx.save();
  ctx.beginPath();
  ctx.rect(b.x, b.y, b.w, b.h);
  ctx.clip();

  const fade = ctx.createLinearGradient(0, b.y, 0, b.y + b.h);
  fade.addColorStop(0, hexToRgba(accent, 0.13));
  fade.addColorStop(1, hexToRgba(accent, 0));
  ctx.fillStyle = fade;
  ctx.fillRect(b.x, b.y, b.w, b.h);

  // Drifting ladder. One full rung-period of travel across the clip, so the
  // last frame lands exactly back on the first.
  const RUNG = 46;
  const drift = p * RUNG;
  ctx.strokeStyle = hexToRgba(accent, 0.1);
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let y = b.y - RUNG + drift; y < b.y + b.h; y += RUNG) {
    ctx.moveTo(b.x + 60, y);
    ctx.lineTo(b.x + b.w - 60, y);
  }
  ctx.stroke();

  // Two counter-drifting tick columns, aligned to the safe area's edges so the
  // band reads as part of the same frame rather than a separate strip.
  ctx.fillStyle = hexToRgba(accent, 0.18);
  for (let i = 0; i < 14; i++) {
    const t = (i / 14 + p) % 1;
    ctx.fillRect(SAFE_RECT.x, b.y + t * b.h, 26, 3);
    ctx.fillRect(SAFE_RECT.x + SAFE_RECT.w - 26, b.y + (1 - t) * b.h, 26, 3);
  }
  ctx.restore();
}

function drawPlate(ctx: CanvasRenderingContext2D, alpha: number, res: RevealResources): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const accent = accentFor(res.spec.skin);
  drawText(ctx, 'SCHEMESTEALER', FRAME_CX, LAYOUT.endCardTitle.y + 30, {
    font: res.fonts.gothic,
    size: 40,
    colour: accent,
    glow: 14,
  });
  drawText(ctx, 'measured, not guessed · scan yours free', FRAME_CX, LAYOUT.endCardSub.y + 18, {
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
    // Exposed for the callout contrast gate, which has to measure the exact
    // pixels the type occupies and the frame state that decides its opacity.
    calloutLabelBox,
    frameState,
    modelRectAt,
    applyOutputScale,
    outputSize,
    scheduleRevealAudio,
    revealAudioBeats,
    // The offline encoder is a dynamic chunk in production; tests pull it in on
    // demand, which registers window.__revealOfflineDebug.
    loadOffline: () => import('./renderRevealOffline'),
    // Same reason: warpCompose is a dynamic chunk in production, so the warp
    // suite pulls it in on demand, which registers window.__warpDebug.
    loadWarp: () => import('./warpCompose'),
  };
}

/**
 * The miniature storyboard as a plug-in bundle.
 *
 * This is exactly what both engines used to do inline; extracting it is what
 * lets the inspiration mode reuse the entire encode path. Behaviour, error
 * messages and debug hooks are unchanged — the mini export is byte-identical
 * across this refactor, which the existing Playwright suites verify.
 */
export const MINI_STORYBOARD: RevealStoryboard<RevealResources> = {
  mode: 'miniature',
  buildSpec(opts, durationMs) {
    const steps = recipeSteps(opts.recipe, opts.brand);
    const spec = buildRevealSpec(
      opts.colors,
      steps,
      opts.brandLabel,
      opts.skin,
      opts.captionPreset,
      durationMs,
      opts.recipeColourIndex ?? -1,
    );
    if (spec.regions.length === 0) throw new Error('No mask regions to reveal.');
    return spec;
  },
  prepare(opts, spec, outputScale) {
    return prepareResources(opts.imageUrl, opts.colors, opts.maskFrame, spec, outputScale);
  },
  composeAt,
  audioSchedule: scheduleRevealAudio,
};
