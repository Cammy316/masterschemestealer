/**
 * Synthesised audio bed for the INSPIRATION export.
 *
 * Same contract as `scheduleRevealAudio` — same signature, same beat table via
 * `revealAudioBeats`, same measured gates — so the offline renderer schedules it
 * through the identical path and the loudness assertions apply unchanged.
 *
 * Only the timbre differs, and that was a directive: no computer beeps or boops.
 * The miniature clip is a cogitator tearing data off a model, so it clacks and
 * ticks. The inspiration clip is something being drawn OUT of an image, so it
 * breathes: a detuned sub-drone under airy whooshes and inharmonic glass.
 *
 * The constraint that shapes everything here is that the gates do not care how
 * it sounds, only how it measures:
 *
 *  - the sustained layer, alone, must be ≥60% below 250 Hz and ≤10% above 3 kHz;
 *  - ≥65% of all energy above 3 kHz must fall within ±60 ms of a scheduled beat;
 *  - −14 ±1 LUFS, ≤−1 dBTP, crest ≥12 dB.
 *
 * Which rules out the obvious ethereal choices. A long airy pad or a reverb tail
 * smears HF across the clip and fails the alignment gate as surely as the v5.2
 * hiss did. So: anything sustained lives below 250 Hz, and anything bright is
 * short and lands on a beat.
 */

import type { RevealSpec } from './revealTimeline';
import type { RevealAudioOptions } from './revealAudio';
import { WARP_PHASES, bandPourWindow } from './warpTimeline';
import {
  GLASS_PARTIALS,
  SCALES,
  air,
  createBus,
  createMaster,
  createReverb,
  duckAt,
  mulberry32,
  noiseBuffer,
  noteHz,
  pad,
  scaleHz,
  struck,
  sub,
} from './revealAudioEngine';

/**
 * Every scheduled transient in the warp-cast, in seconds from the start.
 *
 * The warp-cast has its OWN phase table, so it needs its own beat list —
 * `revealAudioBeats` reads the miniature's, and using it here would leave the
 * sound playing to a cut that no longer exists. Exported so the alignment gate
 * measures against the schedule itself rather than a copy of it.
 */
export function warpAudioBeats(spec: RevealSpec): number[] {
  const durSec = spec.durationMs / 1000;
  const n = Math.max(1, spec.wall?.length ?? spec.regions.length);
  const beats = [
    0, // the poster is already there — a breath, not an impact
    WARP_PHASES.posterEnd * durSec, // the drain begins
    WARP_PHASES.bloomEnd * durSec, // light finishes passing through
    WARP_PHASES.pourEnd * durSec, // the last colour lands
  ];
  // One beat per pour, at the moment the band actually starts wiping in (45%
  // through its window — see warpTimeline), so the sound lands with the colour
  // rather than with the droplet leaving the image.
  for (let i = 0; i < n; i++) {
    const w = bandPourWindow(i, n);
    beats.push((w.start + (w.end - w.start) * 0.45) * durSec);
  }
  return beats.sort((a, b) => a - b);
}

/**
 * The warp-cast's soundtrack: glass and breath.
 *
 * A detuned pad in A major with bowed-glass tones on each pour and a long soft
 * tail. Major rather than menacing on purpose — the inspiration clip became a
 * gallery poster, and a dissonant immaterium bed would fight the thing the
 * visuals turned into.
 *
 * The constraint that shapes everything is that the gates do not care how it
 * sounds, only how it measures: the sustained layer alone must be a low rumble,
 * bright energy must belong to a beat or its decay, and the whole thing must sit
 * at −14 LUFS with real dynamic range. So anything sustained lives low, and
 * anything bright is short and lands on a beat.
 */
export function scheduleWarpAudio(
  ctx: BaseAudioContext,
  output: AudioNode,
  spec: RevealSpec,
  t0: number,
  opts: RevealAudioOptions = {},
): void {
  const bedOnly = opts.layers === 'bed';
  const durSec = spec.durationMs / 1000;
  const at = (fraction: number) => t0 + fraction * durSec;
  const rnd = mulberry32(0x1b873593);
  const scale = SCALES.warp;
  const n = Math.max(1, spec.wall?.length ?? spec.regions.length);

  const master = createMaster(ctx, output, { gain: 1.2, trim: 0.608 });

  // A larger, slightly brighter space than the miniature's — this one is a
  // gallery, not a machine room. Still nowhere near open: a bright tail is
  // sustained high-frequency energy, which is what the alignment gate watches.
  const hall = createReverb(ctx, master.input, {
    seconds: 2.8,
    decay: 4.2,
    tone: 0.16,
    preDelay: 0.03,
    seed: 0x77a2,
  });

  const bedBus = createBus(ctx, master.input, { gain: 1, send: { to: hall.input, amount: 0.08 } });
  const hitBus = createBus(ctx, master.input, {
    gain: 1,
    compress: { threshold: -20, ratio: 3, attack: 0.005, release: 0.2 },
    send: { to: hall.input, amount: 0.34 },
  });
  const padBus = createBus(ctx, master.input, { gain: 1, send: { to: hall.input, amount: 0.26 } });

  // ---- the sustained bed -----------------------------------------------------
  // Two detuned sub oscillators plus a dark noise floor. The beating between the
  // two IS the movement — a single oscillator reads as a test tone however good
  // the reverb is.
  for (const cents of [-11, 11]) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = scale.root / 2; // A1
    o.detune.value = cents;
    const g = ctx.createGain();
    g.gain.value = 0.026;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = cents < 0 ? 0.11 : 0.17;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(g.gain);
    o.connect(g).connect(bedBus.input);
    o.start(t0);
    lfo.start(t0);
    o.stop(t0 + durSec + 0.3);
    lfo.stop(t0 + durSec + 0.3);
  }

  const floor = ctx.createBufferSource();
  floor.buffer = noiseBuffer(ctx, Math.max(2, durSec), 'brown', rnd);
  floor.loop = true;
  const floorLp = ctx.createBiquadFilter();
  floorLp.type = 'lowpass';
  floorLp.frequency.value = 180;
  const floorGain = ctx.createGain();
  floorGain.gain.value = 0.018;
  floor.connect(floorLp).connect(floorGain).connect(bedBus.input);
  floor.start(t0);
  floor.stop(t0 + durSec + 0.3);

  if (!bedOnly) {
    duckAt(
      bedBus.gain.gain,
      warpAudioBeats(spec).map((b) => t0 + b),
      1,
      { depth: 0.34, release: 0.32 },
    );
  }

  if (bedOnly) return;

  // ---- harmony ---------------------------------------------------------------
  // A → F#m → D. The chord changes at the drain and again as the last colour
  // lands, so the harmony moves with the story rather than on a clock.
  const chordAt = [t0, at(WARP_PHASES.posterEnd), at(WARP_PHASES.pourEnd)];
  const chordEnd = [
    at(WARP_PHASES.posterEnd) + 0.8,
    at(WARP_PHASES.pourEnd) + 0.8,
    t0 + durSec + 0.4,
  ];
  scale.progression.forEach((semi, i) => {
    const root = noteHz(scale.root, semi);
    pad(ctx, padBus.input, {
      freqs: [root, noteHz(root, 7), noteHz(root, 12), noteHz(root, 16)],
      at: chordAt[i],
      dur: Math.max(1, chordEnd[i] - chordAt[i]),
      gain: 0.0135,
      detune: 9,
      cutoff: 1100,
      type: 'triangle',
      fade: 0.9,
    });
  });

  // ---- scheduled material ----------------------------------------------------
  // The poster is already there, so the clip opens on a breath rather than a hit.
  air(ctx, hitBus.input, { at: t0, dur: 1.1, gain: 0.22, fromHz: 900, toHz: 220, q: 0.8, rnd });
  struck(ctx, hitBus.input, {
    freq: scaleHz(scale, 0, 1),
    at: t0,
    gain: 0.2,
    decay: 1.8,
    partials: GLASS_PARTIALS,
    attack: 0.05,
  });

  // The drain: colour leaving the palette. Downward, no percussion.
  const drainAt = at(WARP_PHASES.posterEnd);
  air(ctx, hitBus.input, { at: drainAt, dur: 0.65, gain: 0.3, fromHz: 2600, toHz: 300, q: 0.75, rnd });

  // The bloom passing through the image. Sustained, therefore kept below 1.6 kHz
  // — sustained brightness is exactly what the alignment gate exists to catch.
  const bloomStart = at(WARP_PHASES.drainEnd);
  const bloomEnd = at(WARP_PHASES.bloomEnd);
  const breath = ctx.createBufferSource();
  breath.buffer = noiseBuffer(ctx, Math.max(0.6, bloomEnd - bloomStart) + 0.3, 'white', rnd);
  const bLp = ctx.createBiquadFilter();
  bLp.type = 'lowpass';
  bLp.frequency.setValueAtTime(340, bloomStart);
  bLp.frequency.linearRampToValueAtTime(1600, bloomEnd);
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(0.0001, bloomStart);
  bg.gain.linearRampToValueAtTime(0.24, (bloomStart + bloomEnd) / 2);
  bg.gain.exponentialRampToValueAtTime(0.0001, bloomEnd);
  breath.connect(bLp).connect(bg).connect(hitBus.input);
  breath.start(bloomStart);
  breath.stop(bloomEnd + 0.2);

  // Six pours, climbing the scale. Bowed rather than struck — a 50 ms attack is
  // the difference between glass being played and glass being hit.
  for (let i = 0; i < n; i++) {
    const w = bandPourWindow(i, n);
    const landAt = at(w.start + (w.end - w.start) * 0.45);
    struck(ctx, hitBus.input, {
      freq: scaleHz(scale, i, 1),
      at: landAt,
      gain: 0.3,
      decay: 1.5,
      partials: GLASS_PARTIALS,
      attack: 0.05,
      spread: 9,
    });
    air(ctx, hitBus.input, { at: landAt, dur: 0.26, gain: 0.26, fromHz: 4200, toHz: 900, q: 1.2, rnd });
    sub(ctx, hitBus.input, { at: landAt, gain: 0.24, fromHz: 118, toHz: 62, dur: 0.34 });
  }

  // The last colour lands and the poster is complete: a low swell into a soft
  // glass chord rather than a slam.
  const completeAt = at(WARP_PHASES.pourEnd);
  const swell = ctx.createBufferSource();
  swell.buffer = noiseBuffer(ctx, 1.1, 'brown', rnd);
  const sLp = ctx.createBiquadFilter();
  sLp.type = 'lowpass';
  sLp.frequency.value = 210;
  const sg = ctx.createGain();
  sg.gain.setValueAtTime(0.0001, completeAt - 0.7);
  sg.gain.linearRampToValueAtTime(0.4, completeAt);
  sg.gain.exponentialRampToValueAtTime(0.0001, completeAt + 0.9);
  swell.connect(sLp).connect(sg).connect(hitBus.input);
  swell.start(completeAt - 0.7);
  swell.stop(completeAt + 1.0);

  struck(ctx, hitBus.input, {
    freq: scaleHz(scale, 0, 1),
    at: completeAt,
    gain: 0.38,
    decay: 2.6,
    partials: GLASS_PARTIALS,
    attack: 0.04,
    spread: 7,
  });
  struck(ctx, hitBus.input, {
    freq: scaleHz(scale, 2, 1),
    at: completeAt + 0.06,
    gain: 0.24,
    decay: 2.2,
    partials: GLASS_PARTIALS,
    attack: 0.05,
  });
  sub(ctx, hitBus.input, { at: completeAt, gain: 0.5, fromHz: 130, toHz: 52, dur: 0.8 });

  // Loop exhale. Dark, for the same reason the bloom is dark.
  const loopAt = at(WARP_PHASES.loopStart);
  const exhale = ctx.createBufferSource();
  exhale.buffer = noiseBuffer(ctx, Math.max(0.8, durSec - (loopAt - t0)) + 0.4, 'white', rnd);
  const eLp = ctx.createBiquadFilter();
  eLp.type = 'lowpass';
  eLp.frequency.setValueAtTime(1400, loopAt - 0.9);
  eLp.frequency.exponentialRampToValueAtTime(300, t0 + durSec);
  const eg = ctx.createGain();
  eg.gain.setValueAtTime(0.0001, loopAt - 0.9);
  eg.gain.linearRampToValueAtTime(0.24, loopAt - 0.15);
  eg.gain.linearRampToValueAtTime(0.0001, t0 + durSec + 0.1);
  exhale.connect(eLp).connect(eg).connect(hitBus.input);
  exhale.start(loopAt - 0.9);
  exhale.stop(t0 + durSec + 0.2);
}
