/**
 * Deterministic reveal director for the Engine A video export.
 *
 * PURE maths — no canvas, no rAF, no time-of-day. `frameState(t, spec)` maps an
 * elapsed-milliseconds `t` to exactly what should be on screen. Driving the clip
 * off `t` (not a frame counter) means a dropped frame never desyncs the result,
 * and the whole storyboard is unit-testable.
 *
 * Storyboard (fractions of duration; ~13 s default):
 *   hero   0.000–0.077  the user's model in FULL COLOUR, slow push-in — the hook
 *                       IS their paint job, not a dark blob (feed rule: the payoff
 *                       must be visible before the scroll decision at ~2.5 s)
 *   snap   0.077–0.115  hard flicker-snap to greyscale + impact flash
 *   sweep  0.115–0.230  scan line passes; the model lights up BEHIND the line
 *   reveal 0.230–0.680  regions bloom back to true colour, stagger accelerating
 *   recipe 0.680–0.900  model eases up/back, recipe chips cascade in
 *   plate  0.900–1.000  brand plate, HUD fades out, dissolve back to frame 1
 *
 * The loop target is the HERO frame (full-colour model), so the last frame lands
 * on the first: a rewatch replays the snap-to-grey as its own hook.
 */

import type { RevealSkin } from './revealLayers';

export type RevealPhase = 'hero' | 'snap' | 'sweep' | 'reveal' | 'recipe' | 'plate';

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
  /** Match distance from the DETECTED colour. Only meaningful for the base step
   *  (the others are derived partners measured against a different target), so
   *  only the base badge is ever drawn — see drawRecipe. */
  deltaE?: number;
}

export interface RevealSpec {
  skin: RevealSkin;
  regions: RevealRegion[]; // already ordered for reveal (see sortRegionsForReveal)
  recipe: RevealRecipeStep[]; // best-brand steps (0–4)
  brand: string;
  colourCount: number;
  durationMs: number;
  captionPreset: CaptionPreset;
  /** Which entry of `regions` the recipe belongs to, so the outro can name it
   *  ("CITADEL · PINK") and pulse its callout. -1 when unknown. */
  recipeRegionIndex: number;
}

export type CaptionPreset = 'colours' | 'machine-spirit' | 'none';

export interface RevealRegionState {
  index: number;
  revealProgress: number; // 0..1 greyscale→colour
  pulse: number; // 0..1 rim swell, peaks at the reveal moment
  labelReveal: number; // 0..1 garble→resolved family label
}

/** Where the model sits and how hard we're pushed in, this frame. */
export interface RevealCamera {
  /** multiplier on the fitted model rect (Ken Burns + per-region punch) */
  scale: number;
  /** focus point within the model rect, 0..1 (0.5 = centred) */
  focusX: number;
  focusY: number;
  /** 0 = full-frame hero box, 1 = compact box that clears room for the recipe */
  boxLerp: number;
}

export interface RevealFrameState {
  phase: RevealPhase;
  heroAlpha: number; // full-colour model on top of the greyscale base
  baseAlpha: number; // greyscale base opacity
  snapFlash: number; // 0..1 impact flash at the snap-to-grey
  scanned: number; // 0..1 fraction of the model lit behind the scan line
  sweepY: number | null; // 0..1 during the sweep, else null
  regions: RevealRegionState[];
  identifiedCount: number; // regions whose label has fully resolved (counting caption)
  recipeProgress: number; // 0..1 across the recipe cascade
  plateAlpha: number; // 0..1 brand plate
  hudFade: number; // 0..1 — HUD chrome fades BEFORE the dissolve so nothing ghosts
  loopCrossfade: number; // 0..1 dissolve to the loop target (the hero frame)
  camera: RevealCamera;
}

// Phase boundaries as fractions of the total duration. The greyscale stretch
// (snap+sweep) is deliberately short: the scroll decision lands around 2.5 s, so
// the first colour must be blooming back by then, not still scanning.
const HERO_END = 0.085;
const SNAP_END = 0.125;
const SWEEP_END = 0.2;
const REVEAL_END = 0.68;
const RECIPE_END = 0.9;

/** The cascade finishes before the plate arrives so they never race. */
const RECIPE_CASCADE_END = 0.865;
/** Model eases into/out of the compact box over this much of the duration. */
const BOX_MORPH = 0.08;
/** Camera is back to the hero framing by here, so the dissolve has no jump. */
const CAMERA_HOME = 0.975;
const HUD_FADE_START = 0.945;
/** HUD is fully gone before the dissolve is half-way — the first cut ghosted
 *  labels and recipe chips through the crossfade because they were still drawn
 *  at full alpha underneath it. */
const HUD_FADE_END = 0.975;
const LOOP_START = 0.955;

/** Ken Burns push across the body of the clip. */
const PUSH_IN = 0.09;
/** Extra punch toward the region currently blooming. */
const REGION_PUNCH = 0.045;
/** How far the frame drifts toward the blooming region (fraction of the offset). */
const FOCUS_DRIFT = 0.35;

/** Later regions bloom faster than earlier ones — the reveal accelerates instead
 *  of metronoming, which keeps the middle of the clip from sagging. */
const REVEAL_ACCEL = 0.35;
/** Bloom overhang past its slot, so neighbouring blooms overlap slightly. */
const BLOOM_TAIL = 0.4;

/** Phase boundaries as fractions of duration — exported so the audio bed can
 *  schedule to the same beats the visuals use. */
export const PHASE_FRACTIONS = {
  heroEnd: HERO_END,
  snapEnd: SNAP_END,
  sweepEnd: SWEEP_END,
  revealEnd: REVEAL_END,
  recipeEnd: RECIPE_END,
  loopStart: LOOP_START,
} as const;

export function clamp(x: number, lo = 0, hi = 1): number {
  return x < lo ? lo : x > hi ? hi : x;
}

export function smoothstep(x: number): number {
  const c = clamp(x);
  return c * c * (3 - 2 * c);
}

/** Per-region bloom slots. Weights shrink with index (accelerating reveal) and
 *  are normalised so the LAST bloom finishes exactly on REVEAL_END. */
export function regionSchedule(n: number): { start: number; dur: number }[] {
  if (n <= 0) return [];
  const span = REVEAL_END - SWEEP_END;
  const w = Array.from({ length: n }, (_, i) => 1 / (1 + REVEAL_ACCEL * i));
  const total = w.reduce((a, b) => a + b, 0) + BLOOM_TAIL * w[n - 1];
  let acc = 0;
  return w.map((wi) => {
    const slot = { start: SWEEP_END + (span * acc) / total, dur: (span * wi * (1 + BLOOM_TAIL)) / total };
    acc += wi;
    return slot;
  });
}

/** Fraction of duration at which region i (of n) begins to bloom. */
export function regionRevealFraction(i: number, n: number): number {
  return regionSchedule(n)[i]?.start ?? SWEEP_END;
}

/** Deterministic strobe as the full-colour hero cuts to greyscale. */
function snapFlicker(ls: number): number {
  if (ls < 0.12) return 1;
  if (ls < 0.22) return 0;
  if (ls < 0.32) return 0.85;
  if (ls < 0.42) return 0;
  if (ls < 0.48) return 0.35;
  return 0;
}

/** Reveal order: top-of-model first (smaller y), ties broken by colour index. */
export function sortRegionsForReveal(regions: RevealRegion[]): RevealRegion[] {
  return [...regions].sort((a, b) => a.position.y - b.position.y || a.index - b.index);
}

export function phaseAt(f: number): RevealPhase {
  if (f <= HERO_END) return 'hero';
  if (f <= SNAP_END) return 'snap';
  if (f <= SWEEP_END) return 'sweep';
  if (f <= REVEAL_END) return 'reveal';
  if (f <= RECIPE_END) return 'recipe';
  return 'plate';
}

export function frameState(t: number, spec: RevealSpec): RevealFrameState {
  const f = clamp(t / spec.durationMs);
  const phase = phaseAt(f);

  // Hero: the user's paint job, full colour. Strobes away during the snap.
  let heroAlpha = 0;
  let snapFlash = 0;
  if (f <= HERO_END) {
    heroAlpha = 1;
  } else if (f <= SNAP_END) {
    const ls = (f - HERO_END) / (SNAP_END - HERO_END);
    heroAlpha = snapFlicker(ls);
    snapFlash = Math.max(0, 1 - ls / 0.45);
  }
  // Greyscale base sits underneath from the snap onward.
  const baseAlpha = f <= HERO_END ? 0 : 1;

  // Scan sweep top→bottom; the model lights up behind the line.
  const sweeping = f > SNAP_END && f <= SWEEP_END;
  const scanned = f <= SNAP_END ? 0 : sweeping ? smoothstep((f - SNAP_END) / (SWEEP_END - SNAP_END)) : 1;
  const sweepY = sweeping ? scanned : null;

  // Staggered region blooms, accelerating; the last finishes on REVEAL_END so the
  // recipe cascade starts on a fully-coloured model.
  const n = spec.regions.length;
  const slots = regionSchedule(n);
  const regions: RevealRegionState[] = spec.regions.map((r, i) => {
    const { start, dur } = slots[i];
    const revealProgress = smoothstep((f - start) / dur);
    const pulse = revealProgress > 0 ? Math.max(0, 1 - clamp((f - start) / (dur * 2))) * revealProgress : 0;
    const labelReveal = clamp((f - (start + dur * 0.15)) / (dur * 0.4));
    return { index: r.index, revealProgress, pulse, labelReveal };
  });
  const identifiedCount = regions.reduce((acc, r) => acc + (r.labelReveal >= 1 ? 1 : 0), 0);

  const recipeProgress =
    f > REVEAL_END ? clamp((f - REVEAL_END) / (RECIPE_CASCADE_END - REVEAL_END)) : 0;
  const plateAlpha = f > RECIPE_END ? smoothstep((f - RECIPE_END) / 0.035) : 0;
  const hudFade = clamp((f - HUD_FADE_START) / (HUD_FADE_END - HUD_FADE_START));
  const loopCrossfade = f >= LOOP_START ? smoothstep((f - LOOP_START) / (1 - LOOP_START)) : 0;

  // Camera: push in across the body, then home by CAMERA_HOME so the dissolve
  // lands on exactly the hero framing (frame 1 == last frame).
  let scale =
    f <= RECIPE_END
      ? 1 + PUSH_IN * smoothstep(f / RECIPE_END)
      : 1 + PUSH_IN * (1 - smoothstep((f - RECIPE_END) / (CAMERA_HOME - RECIPE_END)));

  let wsum = 0;
  let fx = 0;
  let fy = 0;
  regions.forEach((rs, i) => {
    wsum += rs.pulse;
    fx += rs.pulse * spec.regions[i].position.x;
    fy += rs.pulse * spec.regions[i].position.y;
  });
  const strength = Math.min(1, wsum);
  let focusX = 0.5;
  let focusY = 0.5;
  if (wsum > 0) {
    focusX = 0.5 + (fx / wsum - 0.5) * FOCUS_DRIFT * strength;
    focusY = 0.5 + (fy / wsum - 0.5) * FOCUS_DRIFT * strength;
    scale += REGION_PUNCH * strength;
  }

  let boxLerp = 0;
  if (f > REVEAL_END && f <= RECIPE_END) boxLerp = smoothstep((f - REVEAL_END) / BOX_MORPH);
  else if (f > RECIPE_END) boxLerp = 1 - smoothstep((f - RECIPE_END) / (CAMERA_HOME - RECIPE_END));

  return {
    phase,
    heroAlpha,
    baseAlpha,
    snapFlash,
    scanned,
    sweepY,
    regions,
    identifiedCount,
    recipeProgress,
    plateAlpha,
    hudFade,
    loopCrossfade,
    camera: { scale, focusX, focusY, boxLerp },
  };
}
