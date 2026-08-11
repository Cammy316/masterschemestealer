/**
 * Deterministic reveal director for the Engine A video export.
 *
 * PURE maths — no canvas, no rAF, no time-of-day. `frameState(t, spec)` maps an
 * elapsed-milliseconds `t` to exactly what should be on screen. Driving the clip
 * off `t` (not a frame counter) means a dropped frame never desyncs the result,
 * and the whole storyboard is unit-testable.
 *
 * PROOF-FIRST storyboard (fractions of duration; 11 s default, seconds shown):
 *   proof  0.000–0.182  0.00–2.00  the model in FULL COLOUR with the finished
 *                                  recipe stamped over it — the ANSWER first,
 *                                  held long enough to actually READ
 *   smash  0.182–0.209  2.00–2.30  glitch cut, colour drains to greyscale
 *   sweep  0.209–0.273  2.30–3.00  scan line; the model lights up behind it
 *   reveal 0.273–0.455  3.00–5.00  five region locks, 0.40 s each
 *   slam   0.455–0.491  5.00–5.40  full-colour restore + count caption
 *   recipe 0.491–0.873  5.40–9.60  cascade lands all four rows by 6.40 s, then
 *                                  the complete state HOLDS for 3.0 s — the
 *                                  screenshot frame, which previously existed
 *                                  for only 1.4 s of the whole clip
 *   plate  0.873–1.000  9.60–11.0  rows clear, end card owns a clean frame for
 *                                  1.0 s, then dissolve back to `proof`
 *
 * The loop is perfect by construction: the clip ENDS on model + recipe, which
 * is exactly what frame 0 shows.
 */

import type { RevealSkin } from './revealLayers';

export type RevealPhase = 'proof' | 'smash' | 'sweep' | 'reveal' | 'slam' | 'recipe' | 'plate';

/** Clip length. Lives here because every phase boundary is a fraction of it.
 *  11 s over 13: a shorter loop completes more often and rewatches more, and it
 *  stops the recipe phase padding once extraction is compressed. */
export const DEFAULT_DURATION_MS = 11000;

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

/** One row of the inspiration payoff wall: an extracted colour paired with the
 *  single closest paint to it. The miniature never sets these. */
export interface WallRow {
  extractedHex: string;
  family: string;
  paintName: string;
  paintHex: string;
  brand: string;
  deltaE: number;
  /** Index into the scan's colours, so the orb and its row agree. */
  colourIndex: number;
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
  /** Inspiration mode only. Its presence is what makes the outro draw a wall
   *  instead of the four-role recipe card. */
  wall?: WallRow[];
}

/** Burned-in headline. `colours` is the progress counter; the rest are fixed
 *  result-oriented lines. None of them asserts anything the engine cannot know
 *  (no chapter or army names — it detects colours, not factions). */
export type CaptionPreset = 'colours' | 'never-guess' | 'exact-paints' | 'measured' | 'none';

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
  /** Elapsed fraction of the clip, 0..1. Phase-independent, so anything that
   *  must keep moving through a hold can be driven from it directly. */
  progress: number;
  heroAlpha: number; // full-colour model on top of the greyscale base
  baseAlpha: number; // greyscale base opacity
  snapFlash: number; // 0..1 impact flash + chromatic glitch at the smash cut
  heroGlow: number; // 0..1 breathing backlight behind the hero
  /** 0..1 opacity of the PRE-STAMPED recipe during the proof flash. The clip
   *  opens on the finished answer, then tears it away. */
  proofAlpha: number;
  scanned: number; // 0..1 fraction of the model lit behind the scan line
  /** 0..1 restore of the WHOLE image at the slam. The colour return was masked
   *  to detected regions, so the scenic base and grass stayed grey from ~5.5 s
   *  until the loop blitted the hero over them — which reads as "the app missed
   *  half the model", the opposite of the intended message. */
  fullRestore: number;
  sweepY: number | null; // 0..1 during the sweep, else null
  regions: RevealRegionState[];
  identifiedCount: number; // regions whose label has fully resolved (counting caption)
  /** 0..1 decrypt progress for the burned-in caption / counter. 1 = readable. */
  captionResolve: number;
  recipeProgress: number; // 0..1 across the recipe cascade
  plateAlpha: number; // 0..1 brand plate
  hudFade: number; // 0..1 — HUD chrome fades BEFORE the dissolve so nothing ghosts
  loopCrossfade: number; // 0..1 dissolve to the loop target (the frame-0 proof)
  camera: RevealCamera;
}

// Phase boundaries as fractions of the total duration. Proof lands first, the
// greyscale stretch is short, and extraction is compressed hard — the scroll
// decision lands around 1.7 s and the old cut was still asking a question then.
// Measured from a shipped export: the complete state (all four rows + coloured
// model) existed for only 1.4 s of 11, while 4.0 s of the clip was frame-identical
// and the hook showed the proof for 0.6 s — not long enough to read a headline
// plus four paint names. Redistributed so the hook holds 2.0 s and the payoff
// holds 3.0 s, with no build window longer than 0.4 s without a state change.
const PROOF_END = 0.182;   // 2.00 s — hook holds long enough to READ
const SMASH_END = 0.209;   // 2.30 s
const SWEEP_END = 0.273;   // 3.00 s
const REVEAL_END = 0.455;  // 5.00 s — five region locks at 0.40 s each
const SLAM_END = 0.4837;   // 5.32 s — see CIPHER_MS for why this moved
const RECIPE_END = 0.873;  // 9.60 s (cascade, then the payoff HOLD)

/** Cascade lands all four rows by 6.40 s, leaving a 3.0 s hold on the complete
 *  state — the screenshot frame, previously the shortest-lived in the video. */
const RECIPE_CASCADE_END = 0.5818;
/** The full state is held from here to RECIPE_END.
 *
 *  "Held" no longer means "frozen". Composed and diffed pixel-by-pixel this
 *  window scored a mean channel delta of 0.012 — a still image — while every
 *  field-based assertion passed, because camera drift mutates frameState every
 *  frame without moving anything visible. The continuous ambient layer in
 *  revealCompose is what makes the hold live; these boundaries only decide how
 *  long the viewer gets to READ it.
 *
 *  The v5.3 brief specified 0.5818–0.8364, i.e. a 2.8 s hold. The cascade end is
 *  taken verbatim; the hold END is not. 3.0 s here came from direct feedback
 *  that this is the frame people screenshot, and trimming 200 ms off it fixes
 *  nothing — the hold was never too LONG, it was too STILL, and that is what
 *  the ambient layer addresses. Shortening it would only have made the defect
 *  briefer. */
export const PAYOFF_HOLD = { start: RECIPE_CASCADE_END, end: 0.855 } as const;
/** Callouts and rows clear, then the end card owns a clean frame for 1.0 s. */
const CLEAR_END = 0.873;
/** The dissolve back to frame 0 runs from here to the end: 0.6 s at 11 s.
 *  It was 0.4 s, which is short enough that the loop reads as a cut rather than
 *  a return. Safe to lengthen because plateAlpha never ramps back down — the end
 *  card holds full opacity through the dissolve, so a longer crossfade costs the
 *  card no on-screen time. */
const END_CARD_END = 0.9455;
/** Model eases into the compact box over this much of the duration. */
const BOX_MORPH = 0.06;
/** Camera is back on the frame-0 proof framing by here, so the dissolve has no jump. */
const CAMERA_HOME = 0.99;
const HUD_FADE_START = PAYOFF_HOLD.end;
/** HUD is fully gone BEFORE the dissolve even starts. The previous cut overlapped
 *  them for ~0.26 s and the outgoing caption ghosted through the incoming one. */
const HUD_FADE_END = CLEAR_END;
const LOOP_START = END_CARD_END;

/** The hero opens punched-in: the model fills the frame, then pulls back. The
 *  pull-back IS the hook motion — research: motion in the first frame stops the
 *  scroll, a static product shot does not. Also the loop-target scale. */
export const HERO_SCALE = 1.5;
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
 *  of metronoming — and no single bloom may exceed the cap. The whole phase is
 *  now ~2.2 s for five regions: labels PERSIST once landed, so a fast entry
 *  costs nothing in legibility, and the leisurely one-at-a-time crawl was where
 *  mid-clip retention died. */
const REVEAL_ACCEL = 0.35;
const BLOOM_CAP = 0.05; // ≈0.55 s at 11 s
/** Bloom overhang past its slot, so neighbouring blooms overlap slightly. */
const BLOOM_TAIL = 0.4;

/** How long a label takes to decrypt, as a fraction of duration (≈0.39 s).
 *  Decoupled from the bloom: tying it to 40% of a bloom made the cipher resolve
 *  in ~0.23 s once extraction was compressed — present, but far too fast to read
 *  as decryption, which is why a reviewer thought it had been dropped entirely.
 *  Always clamped so every label still lands by REVEAL_END. */
const LABEL_RESOLVE = 0.035;

/** Phase boundaries as fractions of duration — exported so the audio bed can
 *  schedule to the same beats the visuals use. */
export const PHASE_FRACTIONS = {
  proofEnd: PROOF_END,
  smashEnd: SMASH_END,
  sweepEnd: SWEEP_END,
  revealEnd: REVEAL_END,
  slamEnd: SLAM_END,
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
  const slot = span / n;
  return Array.from({ length: n }, (_, i) => ({
    start: SWEEP_END + i * slot,
    dur: Math.min(slot * (1 + BLOOM_TAIL), BLOOM_CAP, REVEAL_END - (SWEEP_END + i * slot)),
  }));
}

/**
 * Cipher burst length, in ms.
 *
 * The symbol cipher has existed since v5 but only ran on region labels. It now
 * also runs on the burned-in caption, the colour counter and the paint names —
 * the same deterministic glyph substitution, never a rival paint name, never a
 * random draw.
 *
 * 180 ms sits at the bottom of the 0.18–0.22 s window on purpose. The binding
 * constraint is that a burst must finish CIPHER_CLEARANCE_MS before the next
 * one begins, and the tightest cadence in the clip is the recipe cascade's row
 * entrance. At the old SLAM_END the cascade ran 250 ms per row, which cannot
 * clear 180 + 80; SLAM_END moved 0.491 → 0.4837 to make the row cadence 270 ms.
 * That shortens the colour-restore slam by 80 ms, which suits it — it is an
 * impact, not a transition.
 */
export const CIPHER_MS = 180;
/** A burst must be fully resolved this long before the next one starts, or the
 *  viewer never gets a readable frame between them. */
export const CIPHER_CLEARANCE_MS = 80;

/**
 * Every fraction at which burned-in TEXT changes, and therefore re-ciphers.
 *
 * Frame 0 is deliberately absent. The loop target IS frameState(0), so a burst
 * there would render the opening caption as glyphs in the dissolve target and
 * break the seam.
 */
export function cipherBeats(n: number, durationMs: number): number[] {
  const beats = [SMASH_END, SWEEP_END, REVEAL_END];
  // Each region's label completing is what increments the "READING… k/n" counter.
  for (const slot of regionSchedule(n)) beats.push(Math.min(slot.start + LABEL_RESOLVE, REVEAL_END));

  // Collapse beats that land on top of each other, keeping the LATER one.
  //
  // Not hypothetical: with five regions the last counter tick lands at 4990 ms
  // and the phase change to "n COLOURS IDENTIFIED" at 5005 ms — 15 ms apart.
  // Two bursts that close would read as a stutter, and the second would restart
  // the scramble before the first had produced a single readable frame. Keeping
  // the later one merges the final tick and the headline into one burst, which
  // is what the eye sees anyway.
  const minGap = (CIPHER_MS + CIPHER_CLEARANCE_MS) / durationMs;
  const desc = Array.from(new Set(beats)).sort((a, b) => b - a);
  const kept: number[] = [];
  for (const b of desc) {
    if (kept.length === 0 || kept[kept.length - 1] - b >= minGap) kept.push(b);
  }
  return kept.reverse();
}

/**
 * How much of a recipe row's entrance its name spends decrypting, as a fraction
 * of that entrance. Expressed against the row span rather than hardcoded so a
 * non-default duration cannot silently turn a 180 ms burst into a 600 ms one.
 */
export function nameCipherFraction(durationMs: number, steps: number): number {
  const rowSpanMs = ((RECIPE_CASCADE_END - SLAM_END) * durationMs) / Math.max(1, steps);
  return clamp(CIPHER_MS / Math.max(1, rowSpanMs), 0.05, 1);
}

/** Fraction of duration at which region i (of n) begins to bloom. */
export function regionRevealFraction(i: number, n: number): number {
  return regionSchedule(n)[i]?.start ?? SWEEP_END;
}

/**
 * Deterministic strobe as the full-colour hero cuts to greyscale.
 *
 * MONOTONICALLY NON-INCREASING. The previous pattern returned 0.85, then 0, then
 * 0.35 — so the colour model flashed back one frame AFTER it had already gone
 * grey. Measured saturation across the transition went 4.9 → 4.5 → 9.7 → 4.0,
 * which reads as a stutter rather than a glitch. A decaying strobe keeps the
 * cogitator feel and cannot produce an isolated pop.
 */
function snapFlicker(ls: number): number {
  if (ls < 0.12) return 1;
  if (ls < 0.24) return 0.6;
  if (ls < 0.36) return 0.25;
  if (ls < 0.48) return 0.08;
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
  if (f <= PROOF_END) return 'proof';
  if (f <= SMASH_END) return 'smash';
  if (f <= SWEEP_END) return 'sweep';
  if (f <= REVEAL_END) return 'reveal';
  if (f <= SLAM_END) return 'slam';
  if (f <= RECIPE_END) return 'recipe';
  return 'plate';
}

export function frameState(t: number, spec: RevealSpec): RevealFrameState {
  const f = clamp(t / spec.durationMs);
  const tSec = (f * spec.durationMs) / 1000;
  const phase = phaseAt(f);

  // Proof: the painter's model in full colour with the finished recipe already
  // stamped over it — the answer before the question. Strobes away at the smash.
  let heroAlpha = 0;
  let snapFlash = 0;
  let proofAlpha = 0;
  if (f <= PROOF_END) {
    heroAlpha = 1;
    proofAlpha = 1;
  } else if (f <= SMASH_END) {
    const ls = (f - PROOF_END) / (SMASH_END - PROOF_END);
    heroAlpha = snapFlicker(ls);
    snapFlash = Math.max(0, 1 - ls / 0.45);
    // The chips blow out faster than the colour drains — the recipe is torn
    // away first, which is what makes the viewer wait to see it earned back.
    proofAlpha = Math.max(0, 1 - ls / 0.3);
  }
  // Greyscale base sits underneath from the smash onward.
  const baseAlpha = f <= PROOF_END ? 0 : 1;

  // Hero motion envelope: full during the proof, gone by the end of the smash.
  const heroEnv = 1 - smoothstep((f - PROOF_END) / (SMASH_END - PROOF_END));
  const heroGlow = heroEnv * (0.7 + 0.3 * Math.sin(2 * Math.PI * GLOW_HZ * tSec));
  const rotationDeg = ROCK_DEG * Math.sin(2 * Math.PI * ROCK_HZ * tSec) * heroEnv;

  // Scan sweep top→bottom; the model lights up behind the line.
  const sweeping = f > SMASH_END && f <= SWEEP_END;
  const scanned = f <= SMASH_END ? 0 : sweeping ? smoothstep((f - SMASH_END) / (SWEEP_END - SMASH_END)) : 1;
  const sweepY = sweeping ? scanned : null;

  // Staggered region blooms, accelerating, capped; the last (dominant) finishes
  // on REVEAL_END so the recipe cascade starts on a fully-coloured model.
  const n = spec.regions.length;
  const slots = regionSchedule(n);
  const regions: RevealRegionState[] = spec.regions.map((r, i) => {
    const { start, dur } = slots[i];
    const revealProgress = smoothstep((f - start) / dur);
    const pulse = revealProgress > 0 ? Math.max(0, 1 - clamp((f - start) / (dur * 2))) * revealProgress : 0;
    const labelSpan = Math.max(1e-6, Math.min(LABEL_RESOLVE, REVEAL_END - start));
    const labelReveal = clamp((f - start) / labelSpan);
    return { index: r.index, revealProgress, pulse, labelReveal };
  });
  const identifiedCount = regions.reduce((acc, r) => acc + (r.labelReveal >= 1 ? 1 : 0), 0);

  // Caption cipher: the readout re-scrambles whenever its text changes, then
  // resolves. Deterministic, and readable again well before the next beat.
  const cipherSpan = CIPHER_MS / spec.durationMs;
  let captionResolve = 1;
  for (const b of cipherBeats(spec.regions.length, spec.durationMs)) {
    if (f >= b && f < b + cipherSpan) captionResolve = clamp((f - b) / cipherSpan);
  }

  // The cascade only starts once the model is fully resolved (after the slam),
  // so the payoff never competes with the reveal for attention.
  // The whole photo returns to colour at the slam; the numbered callouts carry
  // the "these five were detected" message from here on. This also removes the
  // pop at the loop point, because the hero and the payoff now agree.
  const fullRestore = f > REVEAL_END ? smoothstep((f - REVEAL_END) / (SLAM_END - REVEAL_END)) : 0;

  const recipeProgress =
    f > SLAM_END ? clamp((f - SLAM_END) / (RECIPE_CASCADE_END - SLAM_END)) : 0;
  // End card: full opacity on a CLEAN frame for a full second. It previously got
  // 0.5 s, never reached full alpha, and overlapped the rows fading beneath it.
  // Deliberately NOT gated on hudFade — the HUD clearing is what makes the frame
  // clean, so the card has to outlive it.
  const plateAlpha = f > CLEAR_END ? clamp((f - CLEAR_END) / 0.012) : 0;
  const hudFade = clamp((f - HUD_FADE_START) / (HUD_FADE_END - HUD_FADE_START));
  const loopCrossfade = f >= LOOP_START ? smoothstep((f - LOOP_START) / (1 - LOOP_START)) : 0;

  // Camera. Proof: punched in at HERO_SCALE, pulling back to 1 by the smash.
  // Body: slow Ken Burns push + a punch toward whichever region is blooming.
  // Tail: dive from the compact framing back into the frame-0 proof close-up,
  // arriving by CAMERA_HOME so the dissolve lands with zero jump.
  const homeT = smoothstep((f - RECIPE_END) / (CAMERA_HOME - RECIPE_END));
  let scale: number;
  let focusX = 0.5;
  let focusY = 0.5;
  if (f <= SMASH_END) {
    const out = smoothstep(f / SMASH_END);
    scale = lerp(HERO_SCALE, 1, out);
    focusY = lerp(HERO_FOCUS_Y, 0.5, out);
  } else if (f <= RECIPE_END) {
    scale = 1 + PUSH_IN * smoothstep((f - SMASH_END) / (RECIPE_END - SMASH_END));
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

  // The model only eases back once the slam has landed, so it stays large
  // through the whole reveal.
  let boxLerp = 0;
  if (f > SLAM_END && f <= RECIPE_END) boxLerp = smoothstep((f - SLAM_END) / BOX_MORPH);
  else if (f > RECIPE_END) boxLerp = 1 - homeT;

  return {
    phase,
    progress: f,
    captionResolve,
    heroAlpha,
    baseAlpha,
    snapFlash,
    heroGlow,
    proofAlpha,
    scanned,
    fullRestore,
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
