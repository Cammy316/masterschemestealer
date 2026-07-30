/**
 * Deterministic reveal director for the Engine A video export.
 *
 * PURE maths — no canvas, no rAF, no time-of-day. `frameState(t, spec)` maps an
 * elapsed-milliseconds `t` to exactly what should be on screen. Driving the clip
 * off `t` (not a frame counter) means a dropped frame never desyncs the result,
 * and the whole storyboard is unit-testable.
 *
 * Storyboard (fractions of duration; ~13 s default):
 *   boot   0.000–0.062  faint greyscale model materialises + flickers
 *   sweep  0.062–0.231  scan line passes top→bottom over the greyscale model
 *   reveal 0.231–0.731  regions bloom greyscale→true colour one-by-one w/ labels
 *   recipe 0.731–0.923  4 role chips cascade in (base→shade→highlight→wash)
 *   plate  0.923–1.000  brand plate; last ~0.5 s dissolves back to frame 1 (loop)
 */

import type { RevealSkin } from './revealLayers';

export type RevealPhase = 'boot' | 'sweep' | 'reveal' | 'recipe' | 'plate';

export interface RevealRegion {
  index: number; // index into the scan's colours
  hex: string;
  family: string;
  position: { x: number; y: number }; // normalised to the full frame
}

export interface RevealRecipeStep {
  role: 'base' | 'shade' | 'highlight' | 'wash';
  name: string;
  hex: string;
}

export interface RevealSpec {
  skin: RevealSkin;
  regions: RevealRegion[]; // already ordered for reveal (see sortRegionsForReveal)
  recipe: RevealRecipeStep[]; // best-brand steps (0–4)
  brand: string;
  colourCount: number;
  durationMs: number;
  captionPreset: CaptionPreset;
}

export type CaptionPreset = 'colours' | 'machine-spirit' | 'none';

export interface RevealRegionState {
  index: number;
  revealProgress: number; // 0..1 greyscale→colour
  pulse: number; // 0..1 glow swell, peaks at the reveal moment
  labelReveal: number; // 0..1 garble→resolved family label
}

export interface RevealFrameState {
  phase: RevealPhase;
  baseAlpha: number; // greyscale base opacity (boot ramp)
  sweepY: number | null; // 0..1 during the sweep, else null
  regions: RevealRegionState[];
  recipeProgress: number; // 0..1 across the recipe cascade
  plateAlpha: number; // 0..1 brand plate
  loopCrossfade: number; // 0..1 dissolve to the loop target (frame-1 state)
}

// Phase boundaries as fractions of the total duration.
const BOOT_END = 0.062;
const SWEEP_END = 0.231;
const REVEAL_END = 0.731;
const RECIPE_END = 0.923;
const LOOP_START = 0.962; // last ~0.5 s at 13 s

/** The faint model opacity at frame 1 AND the loop target — they must match so
 *  the dissolve at the end lands exactly on the opening frame. */
export const LOOP_FAINT_ALPHA = 0.35;

/** Phase boundaries as fractions of duration — exported so the audio bed can
 *  schedule to the same beats the visuals use. */
export const PHASE_FRACTIONS = {
  bootEnd: BOOT_END,
  sweepEnd: SWEEP_END,
  revealEnd: REVEAL_END,
  recipeEnd: RECIPE_END,
} as const;

/** Per-region stagger width (fraction of duration). Single source for the
 *  frame maths, the reveal-time helper, and the audio chime schedule. */
export function regionStepFraction(n: number): number {
  const span = REVEAL_END - SWEEP_END;
  return n > 0 ? span / (n + 0.4) : span;
}

/** Fraction of duration at which region i (of n) begins to bloom. */
export function regionRevealFraction(i: number, n: number): number {
  return SWEEP_END + i * regionStepFraction(n);
}

export function clamp(x: number, lo = 0, hi = 1): number {
  return x < lo ? lo : x > hi ? hi : x;
}

export function smoothstep(x: number): number {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
}

/** Deterministic boot flicker — a couple of dips that resolve to steady by boot end. */
function bootFlicker(localBoot: number): number {
  return 1 - (1 - localBoot) * 0.4 * Math.abs(Math.sin(localBoot * Math.PI * 7));
}

/** Reveal order: top-of-model first (smaller y), ties broken by colour index. */
export function sortRegionsForReveal(regions: RevealRegion[]): RevealRegion[] {
  return [...regions].sort((a, b) => a.position.y - b.position.y || a.index - b.index);
}

export function phaseAt(f: number): RevealPhase {
  if (f <= BOOT_END) return 'boot';
  if (f <= SWEEP_END) return 'sweep';
  if (f <= REVEAL_END) return 'reveal';
  if (f <= RECIPE_END) return 'recipe';
  return 'plate';
}

export function frameState(t: number, spec: RevealSpec): RevealFrameState {
  const f = clamp(t / spec.durationMs);
  const phase = phaseAt(f);

  // Faint greyscale model materialises during boot, then holds at full.
  let baseAlpha = 1;
  if (f <= BOOT_END) {
    const lb = f / BOOT_END; // BOOT_END is a nonzero constant
    baseAlpha = (LOOP_FAINT_ALPHA + (1 - LOOP_FAINT_ALPHA) * smoothstep(lb)) * bootFlicker(lb);
  }

  // Scan sweep top→bottom during the sweep phase.
  const sweepY =
    f > BOOT_END && f <= SWEEP_END ? smoothstep((f - BOOT_END) / (SWEEP_END - BOOT_END)) : null;

  // Staggered region blooms across the reveal phase. Each bloom lasts 1.4×step
  // and overlaps its neighbour; step is sized so the LAST region finishes exactly
  // at REVEAL_END (so the recipe cascade starts on a fully-coloured model).
  const n = spec.regions.length;
  const per = regionStepFraction(n);
  const regions: RevealRegionState[] = spec.regions.map((r, i) => {
    const s = SWEEP_END + i * per;
    const e = s + per * 1.4; // slight overlap so blooms feel continuous
    const revealProgress = smoothstep((f - s) / (e - s));
    const since = f - s;
    const pulse = revealProgress > 0 ? Math.max(0, 1 - clamp(since / (per * 2))) * revealProgress : 0;
    const labelReveal = clamp((f - (s + per * 0.2)) / (per * 0.8));
    return { index: r.index, revealProgress, pulse, labelReveal };
  });

  const recipeProgress = f > REVEAL_END ? clamp((f - REVEAL_END) / (RECIPE_END - REVEAL_END)) : 0;
  const plateAlpha = f > RECIPE_END ? smoothstep((f - RECIPE_END) / (1 - RECIPE_END)) : 0;
  const loopCrossfade = f >= LOOP_START ? smoothstep((f - LOOP_START) / (1 - LOOP_START)) : 0;

  return { phase, baseAlpha, sweepY, regions, recipeProgress, plateAlpha, loopCrossfade };
}
