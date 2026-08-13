/**
 * The warp-cast's own timeline. Deliberately NOT the miniature's.
 *
 * v1 reused `revealTimeline`'s phase table, and that is the single decision that
 * made the shipped clip "the pict-cast wearing purple": proof → smash → sweep →
 * reveal → slam → recipe is a 40k scan narrative, and inheriting it meant
 * inheriting its beats, its urgency and its cuts. What the encode path needed
 * from that module was machinery; what the clip took was grammar.
 *
 * This table is a gallery piece: hold, drain, bloom, six slow pours, settle,
 * hold. 14 s, no smash cut anywhere. Editing the miniature's constants to get
 * here would have silently retimed a shipped video, so this is separate by
 * design and the two share nothing but their maths helpers.
 */

import { clamp, smoothstep } from './revealTimeline';

export const WARP_DURATION_MS = 14000;

/**
 * Phase boundaries as fractions of duration. Exported because the audio bed
 * schedules against them — one source for both, so a retime can never leave the
 * sound playing to the old cut.
 */
const POSTER_END = 1800 / WARP_DURATION_MS; // 0.1286 — the finished poster, held
const DRAIN_END = 2600 / WARP_DURATION_MS; // 0.1857 — bands empty out
const BLOOM_END = 4000 / WARP_DURATION_MS; // 0.2857 — light passes through
const POUR_START = BLOOM_END;
const POUR_END = 9500 / WARP_DURATION_MS; // 0.6786 — six colours poured
const SETTLE_END = 11500 / WARP_DURATION_MS; // 0.8214 — measurements tick in
const LOOP_START = 13400 / WARP_DURATION_MS; // 0.9571 — 0.6 s dissolve home

export const WARP_PHASES = {
  posterEnd: POSTER_END,
  drainEnd: DRAIN_END,
  bloomEnd: BLOOM_END,
  pourStart: POUR_START,
  pourEnd: POUR_END,
  settleEnd: SETTLE_END,
  loopStart: LOOP_START,
} as const;

export type WarpPhase = 'poster' | 'drain' | 'bloom' | 'pour' | 'settle' | 'hold';

export interface WarpBandState {
  /** 0..1 wipe of the swatch itself. */
  fill: number;
  /**
   * 0..1 opacity of the paint name and its ΔE on this swatch.
   *
   * Labels are TRANSIENT by design. The reference format — Cinema Palettes — is
   * a still above a bar of pure colour and carries no type at all, and burning
   * six paint names permanently into the poster is what stopped the first
   * version reading that way. So each name appears as its colour lands, every
   * name is legible while the palette assembles, and they all fade out again
   * before the payoff hold. The finished poster is clean; the information was
   * still shown, and the share caption carries it in text.
   */
  labelAlpha: number;
}

export interface WarpDroplet {
  /** Which band this droplet belongs to. */
  index: number;
  /** 0..1 along its fall from the image to the palette. */
  travel: number;
  /** 0..1 swell of the source point on the image as the colour is drawn out. */
  source: number;
}

export interface WarpFrameState {
  phase: WarpPhase;
  /** Elapsed fraction of the clip. Phase-independent, so anything that has to
   *  keep moving through a hold reads this directly. */
  progress: number;
  /** Slow, continuous camera on the hero image. Periodic in `progress`, so the
   *  first and last frames agree exactly. */
  camera: { scale: number; driftX: number; driftY: number };
  /** 0..1 how far the image has gone soft and desaturated. Never fully grey —
   *  this is a gallery piece, not a scan. */
  soften: number;
  /** 0..1 position of the light bloom travelling through the image, or null. */
  bloom: number | null;
  bands: WarpBandState[];
  droplet: WarpDroplet | null;
  /**
   * The colour flash as a swatch lands, and which swatch it belongs to.
   *
   * The pour is the only moment in the clip where something ARRIVES, and on a
   * pale ground a band quietly filling from the bottom is easy to miss. A brief
   * wash of that colour across the whole frame makes each landing land.
   *
   * Confined to the pour phase, so it can never touch the loop seam.
   */
  pulse: { index: number; strength: number } | null;
  /** 0..1 crossfade to the pre-baked frame-0 poster. */
  loopCrossfade: number;
}

function phaseAt(f: number): WarpPhase {
  if (f <= POSTER_END) return 'poster';
  if (f <= DRAIN_END) return 'drain';
  if (f <= BLOOM_END) return 'bloom';
  if (f <= POUR_END) return 'pour';
  if (f <= SETTLE_END) return 'settle';
  return 'hold';
}

/** When band `i` of `n` pours, as fractions of duration. Even cadence — the
 *  miniature accelerates because it is building tension; this one should feel
 *  inevitable rather than urgent. */
export function bandPourWindow(i: number, n: number): { start: number; end: number } {
  const span = (POUR_END - POUR_START) / Math.max(1, n);
  const start = POUR_START + i * span;
  return { start, end: start + span };
}

/**
 * Everything on screen at elapsed time `t`. Pure maths — no randomness, no
 * clock — so the same scan always renders the same 420 frames.
 */
export function warpFrameState(t: number, durationMs: number, bandCount: number): WarpFrameState {
  const f = clamp(t / durationMs);
  const phase = phaseAt(f);
  const n = Math.max(1, bandCount);

  // A single slow breath across the whole clip. sin(2πf) is 0 at both ends, so
  // frame 0 and the loop target land on identical camera values.
  const breath = Math.sin(f * Math.PI * 2);
  const camera = {
    scale: 1.045 + 0.035 * (0.5 - 0.5 * Math.cos(f * Math.PI * 2)),
    driftX: breath * 44,
    driftY: Math.sin(f * Math.PI * 2 + 1.1) * 34,
  };

  // Soften: clean at the open, soft through the middle, clean again by the
  // settle so the payoff poster is sharp.
  let soften = 0;
  if (phase === 'drain') soften = smoothstep((f - POSTER_END) / (DRAIN_END - POSTER_END));
  else if (phase === 'bloom') soften = 1;
  else if (phase === 'pour') {
    // Clears gradually as the colours come out of it.
    // Clears as the colours come out of it. Ends near sharp: by the last pour
    // the picture should have given up what it had, and a still-soft image
    // reads as out of focus rather than as spent.
    soften = 0.8 - 0.72 * smoothstep((f - POUR_START) / (POUR_END - POUR_START));
  } else if (phase === 'settle') {
    soften = 0.25 * (1 - smoothstep((f - POUR_END) / (SETTLE_END - POUR_END)));
  }

  const bloom =
    phase === 'bloom' ? smoothstep((f - DRAIN_END) / (BLOOM_END - DRAIN_END)) : null;

  const bands: WarpBandState[] = [];
  for (let i = 0; i < n; i++) {
    if (phase === 'poster' || phase === 'hold') {
      // The poster — first frames and last — is pure colour.
      bands.push({ fill: 1, labelAlpha: 0 });
      continue;
    }
    if (phase === 'drain') {
      // Drains in reverse order — the last band poured is the first to go, so
      // the drain reads as the pour running backwards.
      const d = smoothstep((f - POSTER_END) / (DRAIN_END - POSTER_END));
      const stagger = clamp(d * (n + 1) - (n - 1 - i));
      bands.push({ fill: 1 - stagger, labelAlpha: 0 });
      continue;
    }
    if (phase === 'bloom') {
      bands.push({ fill: 0, labelAlpha: 0 });
      continue;
    }
    const win = bandPourWindow(i, n);
    // The band wipes over the back half of its window; the front half is the
    // droplet's fall, so the colour lands rather than simply appearing.
    const local = clamp((f - win.start) / (win.end - win.start));
    const fill = smoothstep(clamp((local - 0.45) / 0.55));
    // The label rises as its swatch lands and STAYS up for the rest of the
    // pour, so the viewer can read the palette accumulating rather than
    // catching one name at a time. Everything then fades together across the
    // settle, uncovering the clean poster.
    const risen = smoothstep(clamp((local - 0.62) / 0.38));
    const labelAlpha =
      phase === 'settle' ? 1 - smoothstep(clamp(((f - POUR_END) / (SETTLE_END - POUR_END) - 0.15) / 0.6)) : risen;
    bands.push({ fill, labelAlpha });
  }

  // Which droplet, if any, is in flight.
  let droplet: WarpDroplet | null = null;
  if (phase === 'pour') {
    for (let i = 0; i < n; i++) {
      const win = bandPourWindow(i, n);
      if (f < win.start || f > win.end) continue;
      const local = clamp((f - win.start) / (win.end - win.start));
      droplet = {
        index: i,
        // Falls over the first 60% of the window, easing in.
        travel: smoothstep(clamp(local / 0.6)),
        // The source point swells then fades as the colour leaves the image.
        source: Math.sin(clamp(local / 0.75) * Math.PI),
      };
      break;
    }
  }

  // The flash peaks just after the colour commits to its column and is gone
  // before the next droplet leaves the image, so two pulses never overlap.
  let pulse: { index: number; strength: number } | null = null;
  if (phase === 'pour') {
    for (let i = 0; i < n; i++) {
      const win = bandPourWindow(i, n);
      if (f < win.start || f > win.end) continue;
      const local = clamp((f - win.start) / (win.end - win.start));
      const x = clamp((local - 0.45) / 0.42);
      if (x > 0 && x < 1) pulse = { index: i, strength: Math.sin(x * Math.PI) };
      break;
    }
  }

  const loopCrossfade = f <= LOOP_START ? 0 : smoothstep((f - LOOP_START) / (1 - LOOP_START));

  return { phase, progress: f, camera, soften, bloom, bands, droplet, pulse, loopCrossfade };
}
