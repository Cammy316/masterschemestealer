/**
 * Deterministic reveal director for the Engine A video export.
 *
 * PURE maths — no canvas, no rAF, no time-of-day. `frameState(t, spec)` maps an
 * elapsed-milliseconds `t` to exactly what should be on screen. Driving the clip
 * off `t` (not a frame counter) means a dropped frame never desyncs the result,
 * and the whole storyboard is unit-testable.
 *
 * Storyboard (fractions of duration; ~13 s default):
 *   hero   0.000–0.085  the model in FULL COLOUR, punched in close and pulling
 *                       back, rocking gently, lit by a breathing glow — visible
 *                       motion from frame 0, because the scroll decision lands
 *                       inside ~1.7 s and a static product shot loses it
 *   snap   0.085–0.125  glitch-strobe to greyscale + impact flash
 *   sweep  0.125–0.200  scan line passes; the model lights up BEHIND the line
 *   reveal 0.200–0.680  regions bloom back to colour, SMALLEST FIRST — quick
 *                       wins escalating to the dominant colour as the finale
 *   recipe 0.680–0.900  model eases up/back, recipe chips cascade in
 *   plate  0.900–1.000  brand plate, HUD fades, camera dives back into the
 *                       hero close-up — the final frame IS frame 1 (the loop)
 */

import type { RevealSkin } from './revealLayers';

export type RevealPhase = 'hero' | 'snap' | 'sweep' | 'reveal' | 'recipe' | 'plate';

/** Clip length. Lives here because every phase boundary is a fraction of it. */
export const DEFAULT_DURATION_MS = 13000;

export interface RevealRegion {
  index: number; // index into the scan's colours
  hex: string;
  family: string;
  position: { x: number; y: number }; // normalised to the full frame
  percentage: number; // coverage %, drives the small→dominant reveal order
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
  /** multiplier on the fitted model rect (hero punch, Ken Burns, region punch) */
  scale: number;
  /** focus point within the model rect, 0..1 (0.5 = centred) */
  focusX: number;
  focusY: number;
  /** 0 = full-frame hero box, 1 = compact box that clears room for the recipe */
  boxLerp: number;
  /** turntable-substitute rock, degrees about the model centre; 0 at t=0 */
  rotationDeg: number;
}

export interface RevealFrameState {
  phase: RevealPhase;
  heroAlpha: number; // full-colour model on top of the greyscale base
  baseAlpha: number; // greyscale base opacity
  snapFlash: number; // 0..1 impact flash + chromatic glitch at the snap
  heroGlow: number; // 0..1 breathing backlight behind the hero
  scanned: number; // 0..1 fraction of the model lit behind the scan line
  sweepY: number | null; // 0..1 during the sweep, else null
  regions: RevealRegionState[];
  identifiedCount: number; // regions whose label has fully resolved (counting caption)
  recipeProgress: number; // 0..1 across the recipe cascade
  plateAlpha: number; // 0..1 brand plate
  hudFade: number; // 0..1 — HUD chrome fades BEFORE the dissolve so nothing ghosts
  loopCrossfade: number; // 0..1 dissolve to the loop target (the frame-1 hero)
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
/** Model eases into the compact box over this much of the duration. */
const BOX_MORPH = 0.08;
/** Camera is back on the frame-1 hero close-up by here, so the dissolve has no jump. */
const CAMERA_HOME = 0.975;
const HUD_FADE_START = 0.945;
/** HUD is fully gone before the dissolve is half-way — earlier cuts ghosted
 *  labels and recipe chips through the crossfade. */
const HUD_FADE_END = 0.975;
const LOOP_START = 0.955;

/** The hero opens punched-in: the model fills the frame, then pulls back. The
 *  pull-back IS the hook motion — research: motion in the first frame stops the
 *  scroll, a static product shot does not. Also the loop-target scale. */
export const HERO_SCALE = 1.35;
/** Hero focus sits above centre — faces live in the model's upper half. */
export const HERO_FOCUS_Y = 0.45;
/** Turntable-substitute rock: amplitude (deg) and frequency (Hz). sin() phase
 *  is 0 at t=0 so frame 1 and the loop target agree exactly. */
const ROCK_DEG = 1.2;
const ROCK_HZ = 0.45;
/** Hero backlight breathing frequency (Hz). */
const GLOW_HZ = 0.45;

/** Ken Burns push across the body of the clip. */
const PUSH_IN = 0.09;
/** Extra punch toward the region currently blooming. */
const REGION_PUNCH = 0.045;
/** The largest the model rect can ever be scaled to — the exporter sizes its
 *  cached layers to this so they are never upscaled and never oversized. */
export const MAX_CAMERA_SCALE = HERO_SCALE + REGION_PUNCH;
/** How far the frame drifts toward the blooming region (fraction of the offset). */
const FOCUS_DRIFT = 0.35;

/** Later regions bloom faster than earlier ones — the reveal accelerates instead
 *  of metronoming — and no single bloom may exceed the cap: v2 let the first
 *  bloom run 2.6 s alone, right on the 3–6 s retention cliff. */
const REVEAL_ACCEL = 0.35;
const BLOOM_CAP = 0.085; // ≈1.1 s at 13 s
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

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/** Per-region bloom slots: accelerating stagger (weights shrink with index),
 *  durations capped at BLOOM_CAP, and the LAST bloom ends exactly on
 *  REVEAL_END so the recipe starts on a fully-coloured model. */
export function regionSchedule(n: number): { start: number; dur: number }[] {
  if (n <= 0) return [];
  const span = REVEAL_END - SWEEP_END;
  const w = Array.from({ length: n }, (_, i) => 1 / (1 + REVEAL_ACCEL * i));
  const total = w.reduce((a, b) => a + b, 0);
  const starts: number[] = [];
  let acc = 0;
  for (const wi of w) {
    starts.push(SWEEP_END + (span * acc) / total);
    acc += wi;
  }
  return starts.map((start, i) => {
    const next = i + 1 < n ? starts[i + 1] : REVEAL_END;
    const dur = Math.min((next - start) * (1 + BLOOM_TAIL), BLOOM_CAP, REVEAL_END - start);
    return { start, dur };
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

/** Reveal order: smallest coverage first, so quick wins escalate to the
 *  dominant colour igniting last as the finale (ties by y, then index). */
export function sortRegionsForReveal(regions: RevealRegion[]): RevealRegion[] {
  return [...regions].sort(
    (a, b) => a.percentage - b.percentage || a.position.y - b.position.y || a.index - b.index,
  );
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
  const tSec = (f * spec.durationMs) / 1000;
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

  // Hero motion envelope: full during the hero, gone by the end of the snap.
  const heroEnv = 1 - smoothstep((f - HERO_END) / (SNAP_END - HERO_END));
  const heroGlow = heroEnv * (0.7 + 0.3 * Math.sin(2 * Math.PI * GLOW_HZ * tSec));
  const rotationDeg = ROCK_DEG * Math.sin(2 * Math.PI * ROCK_HZ * tSec) * heroEnv;

  // Scan sweep top→bottom; the model lights up behind the line.
  const sweeping = f > SNAP_END && f <= SWEEP_END;
  const scanned = f <= SNAP_END ? 0 : sweeping ? smoothstep((f - SNAP_END) / (SWEEP_END - SNAP_END)) : 1;
  const sweepY = sweeping ? scanned : null;

  // Staggered region blooms, accelerating, capped; the last (dominant) finishes
  // on REVEAL_END so the recipe cascade starts on a fully-coloured model.
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

  // Camera. Hero: punched in at HERO_SCALE, pulling back to 1 by the snap.
  // Body: slow Ken Burns push + a punch toward whichever region is blooming.
  // Tail: dive from the compact framing back into the frame-1 hero close-up,
  // arriving by CAMERA_HOME so the dissolve lands with zero jump.
  const homeT = smoothstep((f - RECIPE_END) / (CAMERA_HOME - RECIPE_END));
  let scale: number;
  let focusX = 0.5;
  let focusY = 0.5;
  if (f <= SNAP_END) {
    const out = smoothstep(f / SNAP_END);
    scale = lerp(HERO_SCALE, 1, out);
    focusY = lerp(HERO_FOCUS_Y, 0.5, out);
  } else if (f <= RECIPE_END) {
    scale = 1 + PUSH_IN * smoothstep((f - SNAP_END) / (RECIPE_END - SNAP_END));
  } else {
    scale = lerp(1 + PUSH_IN, HERO_SCALE, homeT);
    focusY = lerp(0.5, HERO_FOCUS_Y, homeT);
  }

  let wsum = 0;
  let fx = 0;
  let fy = 0;
  regions.forEach((rs, i) => {
    wsum += rs.pulse;
    fx += rs.pulse * spec.regions[i].position.x;
    fy += rs.pulse * spec.regions[i].position.y;
  });
  if (wsum > 0) {
    const strength = Math.min(1, wsum);
    focusX = focusX + (fx / wsum - 0.5) * FOCUS_DRIFT * strength;
    focusY = focusY + (fy / wsum - 0.5) * FOCUS_DRIFT * strength;
    scale += REGION_PUNCH * strength;
  }

  let boxLerp = 0;
  if (f > REVEAL_END && f <= RECIPE_END) boxLerp = smoothstep((f - REVEAL_END) / BOX_MORPH);
  else if (f > RECIPE_END) boxLerp = 1 - homeT;

  return {
    phase,
    heroAlpha,
    baseAlpha,
    snapFlash,
    heroGlow,
    scanned,
    sweepY,
    regions,
    identifiedCount,
    recipeProgress,
    plateAlpha,
    hudFade,
    loopCrossfade,
    camera: { scale, focusX, focusY, boxLerp, rotationDeg },
  };
}
