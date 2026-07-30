/**
 * Canvas composition for the Engine A export — turns a timeline RevealFrameState
 * into one drawn 1080×1920 frame, reusing the shared Auspex layers so the clip
 * matches the live reveal. Kept separate from the MediaRecorder orchestration
 * (renderRevealVideo) so single frames can be screenshotted for QA.
 */

import type { Color, MaskFrame, PaintRecipe } from '../types';
import { maskDestRect, layoutRailCallouts, type RailCallout } from '../maskGeometry';
import {
  buildBaseLayer,
  buildRegionLayer,
  decodeMask,
  drawCornerBrackets,
  paintBackdrop,
  type RevealSkin,
} from './revealLayers';
import {
  frameState,
  sortRegionsForReveal,
  LOOP_FAINT_ALPHA,
  type RevealFrameState,
  type RevealRecipeStep,
  type RevealSpec,
  type CaptionPreset,
} from './revealTimeline';

export const CANVAS_W = 1080;
export const CANVAS_H = 1920;
const MODEL_BOX = { x: 90, y: 210, w: 900, h: 1000 };
const RECIPE_TOP = 1270;

const ROLE_ACCENT: Record<RevealRecipeStep['role'], string> = {
  base: '#00FF41',
  shade: '#2AA6FF',
  highlight: '#FFD700',
  wash: '#A78BFA',
};

function accentFor(skin: RevealSkin): string {
  return skin === 'warp' ? '#A78BFA' : '#00FF41';
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

// ---- spec + resources --------------------------------------------------------
export interface RevealResources {
  spec: RevealSpec;
  fonts: RevealFonts;
  imgW: number;
  imgH: number;
  modelRect: Rect;
  greyLayer: HTMLCanvasElement;
  regionLayers: (HTMLCanvasElement | null)[]; // aligned to spec.regions order
  callouts: RailCallout[];
}

/** Best-brand 4-step recipe → ordered steps for the outro cascade. */
export function recipeSteps(recipe: PaintRecipe | undefined, brand: keyof PaintRecipe): RevealRecipeStep[] {
  const br = recipe?.[brand];
  if (!br) return [];
  const order: RevealRecipeStep['role'][] = ['base', 'shade', 'highlight', 'wash'];
  const out: RevealRecipeStep[] = [];
  for (const role of order) {
    const m = br[role];
    if (m) out.push({ role, name: m.name, hex: m.hex });
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
): RevealSpec {
  const withMasks = colors
    .map((c, index) => ({
      index,
      hex: c.hex,
      family: c.family ?? '',
      position: c.position ?? { x: 0.5, y: 0.5 },
      hasMask: !!c.mask,
    }))
    .filter((r) => r.hasMask)
    .map(({ hasMask, ...r }) => r);
  return {
    skin,
    regions: sortRegionsForReveal(withMasks),
    recipe,
    brand,
    colourCount: withMasks.length,
    durationMs,
    captionPreset,
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

  const greyLayer = buildBaseLayer(img, imgW, imgH, true);
  if (!greyLayer) throw new Error('Failed to build base layer');

  const regionLayers = await Promise.all(
    spec.regions.map(async (r) => {
      const b64 = colors[r.index]?.mask;
      if (!b64) return null;
      const mask = await decodeMask(b64);
      return mask ? buildRegionLayer(img, mask, imgW, imgH, maskFrame) : null;
    }),
  );

  return {
    spec,
    fonts: resolveFonts(),
    imgW,
    imgH,
    modelRect: fitRect(imgW, imgH, MODEL_BOX),
    greyLayer,
    regionLayers,
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
function captionText(preset: CaptionPreset, colourCount: number): string | null {
  if (preset === 'colours') return `IDENTIFIED IN ${colourCount} COLOURS`;
  if (preset === 'machine-spirit') return 'THE MACHINE SPIRIT KNOWS YOUR RECIPE';
  return null;
}

function drawGreyModel(ctx: CanvasRenderingContext2D, res: RevealResources, alpha: number): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const r = res.modelRect;
  ctx.drawImage(res.greyLayer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
  ctx.restore();
}

/** Frame-1 / loop-target composition: backdrop + faint grey model + brackets. */
export function drawLoopTarget(ctx: CanvasRenderingContext2D, res: RevealResources): void {
  paintBackdrop(ctx, CANVAS_W, CANVAS_H, res.spec.skin);
  drawGreyModel(ctx, res, LOOP_FAINT_ALPHA);
  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accentFor(res.spec.skin));
}

export function composeReveal(ctx: CanvasRenderingContext2D, state: RevealFrameState, res: RevealResources): void {
  const { spec, modelRect: r } = res;
  const accent = accentFor(spec.skin);

  paintBackdrop(ctx, CANVAS_W, CANVAS_H, spec.skin);
  drawGreyModel(ctx, res, state.baseAlpha);

  // Region colour blooms, each with its own hex glow.
  state.regions.forEach((rs, i) => {
    const layer = res.regionLayers[i];
    if (!layer || rs.revealProgress <= 0) return;
    const region = spec.regions[i];
    ctx.save();
    ctx.globalAlpha = rs.revealProgress;
    ctx.shadowColor = region.hex;
    ctx.shadowBlur = 18 + rs.pulse * 55;
    ctx.drawImage(layer, 0, 0, res.imgW, res.imgH, r.x, r.y, r.w, r.h);
    ctx.restore();
  });

  // Scan sweep.
  if (state.sweepY !== null) {
    const y = r.y + state.sweepY * r.h;
    const grad = ctx.createLinearGradient(0, y - 60, 0, y);
    grad.addColorStop(0, 'rgba(0,255,136,0)');
    grad.addColorStop(1, 'rgba(0,255,136,0.35)');
    ctx.save();
    ctx.fillStyle = grad;
    ctx.fillRect(r.x, y - 60, r.w, 60);
    ctx.strokeStyle = 'rgba(0,255,136,0.95)';
    ctx.lineWidth = 3;
    ctx.shadowColor = 'rgba(0,255,136,0.8)';
    ctx.shadowBlur = 24;
    ctx.beginPath();
    ctx.moveTo(r.x, y);
    ctx.lineTo(r.x + r.w, y);
    ctx.stroke();
    ctx.restore();
  }

  // Rail callouts: leader line + chip + garble family label.
  res.callouts.forEach((c) => {
    const rs = state.regions[c.index];
    const region = spec.regions[c.index];
    if (!rs || !region || rs.labelReveal <= 0) return;
    const hex = region.hex;
    const railX = c.side === 'left' ? 46 : CANVAS_W - 46;
    const railY = r.y + c.railY * r.h;
    const anchorX = r.x + c.anchorX * r.w;
    const anchorY = r.y + c.anchorY * r.h;
    const dir = c.side === 'left' ? 1 : -1;
    const elbowX = railX + dir * 40;

    ctx.save();
    ctx.globalAlpha = rs.labelReveal;
    // leader line (circuit elbow)
    ctx.strokeStyle = hex;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = hex;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(railX, railY);
    ctx.lineTo(elbowX, railY);
    ctx.lineTo(elbowX + dir * 30, anchorY);
    ctx.lineTo(anchorX, anchorY);
    ctx.stroke();
    // anchor dot
    ctx.fillStyle = hex;
    ctx.beginPath();
    ctx.arc(anchorX, anchorY, 7, 0, Math.PI * 2);
    ctx.fill();
    // chip
    ctx.beginPath();
    ctx.arc(railX, railY, 26, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(5,7,10,0.9)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = hex;
    ctx.stroke();
    ctx.restore();
    drawText(ctx, String(c.index + 1), railX, railY, { font: res.fonts.cyber, size: 26, colour: hex });
    // label
    const label = garbleReveal((region.family || region.hex).toUpperCase(), rs.labelReveal);
    const labelX = c.side === 'left' ? railX + 44 : railX - 44;
    drawText(ctx, label, labelX, railY, {
      font: res.fonts.cyber,
      size: 24,
      colour: hex,
      align: c.side === 'left' ? 'left' : 'right',
      glow: 10,
    });
  });

  drawCornerBrackets(ctx, CANVAS_W, CANVAS_H, accent);

  // Burned-in caption (hidden during boot and the loop dissolve).
  if (state.phase !== 'boot') {
    const cap = captionText(spec.captionPreset, spec.colourCount);
    if (cap)
      drawText(ctx, cap, CANVAS_W / 2, 130, {
        font: res.fonts.cyber,
        size: 34,
        colour: accent,
        glow: 14,
        letter: 2,
        maxWidth: CANVAS_W - 120,
      });
  }

  // Recipe outro cascade.
  if (state.recipeProgress > 0) drawRecipe(ctx, state.recipeProgress, res);

  // Brand plate.
  if (state.plateAlpha > 0) drawPlate(ctx, state.plateAlpha, res);

  // Loop dissolve back to frame 1.
  if (state.loopCrossfade > 0) {
    ctx.save();
    ctx.globalAlpha = state.loopCrossfade;
    drawLoopTarget(ctx, res);
    ctx.restore();
  }
}

function drawRecipe(ctx: CanvasRenderingContext2D, progress: number, res: RevealResources): void {
  const steps = res.spec.recipe;
  if (steps.length === 0) return;
  drawText(ctx, '◆ THE RECIPE ◆', CANVAS_W / 2, RECIPE_TOP, {
    font: res.fonts.gothic,
    size: 44,
    colour: accentFor(res.spec.skin),
    glow: 12,
  });

  const chipH = 96;
  const gap = 18;
  const startY = RECIPE_TOP + 60;
  steps.forEach((step, i) => {
    const appear = Math.max(0, Math.min(1, progress * steps.length - i));
    if (appear <= 0) return;
    const accent = ROLE_ACCENT[step.role];
    const y = startY + i * (chipH + gap);
    const x = 110;
    const w = CANVAS_W - 220;
    ctx.save();
    ctx.globalAlpha = appear;
    ctx.translate((1 - appear) * 40, 0);
    // chip body
    roundRect(ctx, x, y, w, chipH, 18);
    ctx.fillStyle = 'rgba(8,12,16,0.85)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = accent;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 16;
    ctx.stroke();
    ctx.shadowBlur = 0;
    // role spine
    roundRect(ctx, x, y, 12, chipH, 6);
    ctx.fillStyle = accent;
    ctx.fill();
    // swatch
    roundRect(ctx, x + 34, y + 18, 60, 60, 12);
    ctx.fillStyle = step.hex;
    ctx.fill();
    ctx.restore();
    // text
    drawText(ctx, step.role.toUpperCase(), x + 118, y + 34, {
      font: res.fonts.cyber,
      size: 22,
      colour: accent,
      align: 'left',
    });
    drawText(ctx, step.name, x + 118, y + 66, {
      font: res.fonts.tech,
      size: 34,
      colour: '#e8f0e8',
      align: 'left',
      maxWidth: x + w - (x + 118) - 20,
    });
  });
}

function drawPlate(ctx: CanvasRenderingContext2D, alpha: number, res: RevealResources): void {
  ctx.save();
  ctx.globalAlpha = alpha;
  const accent = accentFor(res.spec.skin);
  drawText(ctx, 'SCHEMESTEALER', CANVAS_W / 2, CANVAS_H - 130, {
    font: res.fonts.gothic,
    size: 52,
    colour: accent,
    glow: 16,
  });
  drawText(ctx, 'scan yours free · schemestealer.com', CANVAS_W / 2, CANVAS_H - 78, {
    font: res.fonts.cyber,
    size: 26,
    colour: '#8a9a8a',
    letter: 2,
    maxWidth: CANVAS_W - 120,
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
  };
}
