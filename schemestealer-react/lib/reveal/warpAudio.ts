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

import { PHASE_FRACTIONS, regionRevealFraction, type RevealSpec } from './revealTimeline';
import type { RevealAudioOptions } from './revealAudio';

/** Root of the drone. Low enough to feel, high enough that a phone speaker
 *  reproduces its harmonics even when it cannot reproduce the fundamental. */
const DRONE_HZ = 55;
/** Detune of the second oscillator, in cents. The slow beating this produces IS
 *  the "ethereal" — a single oscillator reads as a test tone. */
const DRONE_DETUNE = 14;

export function scheduleWarpAudio(
  ctx: BaseAudioContext,
  output: AudioNode,
  spec: RevealSpec,
  t0: number,
  opts: RevealAudioOptions = {},
): void {
  const bedOnly = opts.layers === 'bed';
  const master = ctx.createGain();
  master.gain.value = 2.0;

  const limiter = ctx.createWaveShaper();
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
  }
  limiter.curve = curve;
  limiter.oversample = '4x';

  const trim = ctx.createGain();
  trim.gain.value = 0.78;

  // The same loudness chain as the miniature bed, and for the same reason:
  // BS.1770 K-weighting discounts the sub band hard, so a drone-led mix cannot
  // reach −14 LUFS on level alone. Kept identical rather than re-derived — if
  // the chain needs to change it should change for both.
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 70;
  hp.Q.value = 0.7;
  const presence = ctx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 1400;
  presence.Q.value = 0.9;
  presence.gain.value = 10;
  const airShelf = ctx.createBiquadFilter();
  airShelf.type = 'highshelf';
  airShelf.frequency.value = 2600;
  airShelf.gain.value = 6;
  master.connect(hp).connect(presence).connect(airShelf).connect(limiter).connect(trim).connect(output);

  const durSec = spec.durationMs / 1000;
  const at = (fraction: number) => t0 + fraction * durSec;

  /** Deterministic noise — see the equivalent note in revealAudio. */
  let noiseSeed = 0x1b873593;
  function noiseBuffer(seconds: number, brown: boolean): AudioBuffer {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let s = (noiseSeed = (noiseSeed + 0x6d2b79f5) | 0);
    const rnd = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = rnd() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = white;
      }
    }
    return buf;
  }

  /** Sine with a fast attack and exponential tail. */
  function tone(freq: number, start: number, dur: number, peak: number, type: OscillatorType = 'sine'): void {
    if (bedOnly) return;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    o.connect(g).connect(master);
    o.start(start);
    o.stop(start + dur + 0.05);
  }

  /** Band-passed noise gesture. `fromHz`→`toHz` sweeps the filter, which is what
   *  makes it read as breath rather than as a click. */
  function whoosh(
    start: number,
    dur: number,
    peak: number,
    fromHz: number,
    toHz: number,
    q = 1.1,
  ): void {
    if (bedOnly) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(dur + 0.1, false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(fromHz, start);
    bp.frequency.exponentialRampToValueAtTime(Math.max(40, toHz), start + dur);
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(peak, start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    src.connect(bp).connect(g).connect(master);
    src.start(start);
    src.stop(start + dur + 0.05);
  }

  /**
   * Inharmonic glass. Partials at non-integer ratios so it rings like struck
   * crystal rather than a synth pad — and short, because every one of these
   * partials is above 3 kHz and the alignment gate counts them.
   */
  function glass(start: number, root: number, peak: number, dur = 0.5): void {
    if (bedOnly) return;
    const partials = [1, 2.76, 5.4, 8.93];
    partials.forEach((mult, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = root * mult;
      // Detune the upper partials slightly so they beat against each other.
      o.detune.value = i * 7;
      const g = ctx.createGain();
      const amp = peak / (1 + i * 1.7);
      g.gain.setValueAtTime(0.0001, start);
      g.gain.linearRampToValueAtTime(amp, start + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, start + dur / (1 + i * 0.35));
      o.connect(g).connect(master);
      o.start(start);
      o.stop(start + dur + 0.05);
    });
  }

  // ---- the sustained bed -----------------------------------------------------
  // Two detuned oscillators plus a dark noise floor. This is the ONLY layer that
  // runs the whole clip, and the bed-isolation gate measures exactly this.
  for (const cents of [-DRONE_DETUNE, DRONE_DETUNE]) {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = DRONE_HZ;
    o.detune.value = cents;
    const g = ctx.createGain();
    g.gain.value = 0.052;
    // Slow amplitude wobble, offset per oscillator so they never breathe in
    // lockstep — in lockstep it reads as a tremolo effect, not as air.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = cents < 0 ? 0.11 : 0.17;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.06;
    lfo.connect(lfoGain).connect(g.gain);
    o.connect(g).connect(master);
    o.start(t0);
    lfo.start(t0);
    o.stop(t0 + durSec + 0.3);
    lfo.stop(t0 + durSec + 0.3);
  }

  // Dark noise floor under the drone — brown, lowpassed hard. Gives the drone a
  // body without putting anything in the band the alignment gate watches.
  const floor = ctx.createBufferSource();
  floor.buffer = noiseBuffer(Math.max(2, durSec), true);
  floor.loop = true;
  const floorLp = ctx.createBiquadFilter();
  floorLp.type = 'lowpass';
  floorLp.frequency.value = 190;
  const floorGain = ctx.createGain();
  floorGain.gain.value = 0.03;
  floor.connect(floorLp).connect(floorGain).connect(master);
  floor.start(t0);
  floor.stop(t0 + durSec + 0.3);

  // ---- scheduled gestures ----------------------------------------------------
  // Opening: the image is already there, so the clip opens on a breath rather
  // than an impact.
  whoosh(t0, 0.9, 0.3, 900, 180, 0.8);
  tone(DRONE_HZ * 2, t0, 0.7, 0.26);

  // The smash into the veiled state — a downward pitch drop with an airy edge.
  const veilAt = at(PHASE_FRACTIONS.proofEnd);
  if (!bedOnly) {
    const drop = ctx.createOscillator();
    drop.type = 'sine';
    drop.frequency.setValueAtTime(150, veilAt);
    drop.frequency.exponentialRampToValueAtTime(48, veilAt + 0.24);
    const dg = ctx.createGain();
    dg.gain.setValueAtTime(0.0001, veilAt);
    dg.gain.linearRampToValueAtTime(0.6, veilAt + 0.01);
    dg.gain.exponentialRampToValueAtTime(0.0001, veilAt + 0.42);
    drop.connect(dg).connect(master);
    drop.start(veilAt);
    drop.stop(veilAt + 0.5);
  }
  whoosh(veilAt, 0.34, 0.42, 5200, 700, 0.7);

  // The commune sweep. Kept below 1.6 kHz on purpose: it is a SUSTAINED gesture,
  // and anything sustained above 3 kHz would fail the HF-on-beat gate exactly
  // the way the miniature's first loop swell did.
  const sweepStart = at(PHASE_FRACTIONS.smashEnd);
  const sweepEnd = at(PHASE_FRACTIONS.sweepEnd);
  if (!bedOnly) {
    const breath = ctx.createBufferSource();
    breath.buffer = noiseBuffer(Math.max(0.6, sweepEnd - sweepStart) + 0.3, false);
    const bLp = ctx.createBiquadFilter();
    bLp.type = 'lowpass';
    bLp.frequency.setValueAtTime(420, sweepStart);
    bLp.frequency.linearRampToValueAtTime(1600, sweepEnd);
    const bg = ctx.createGain();
    bg.gain.setValueAtTime(0.0001, sweepStart);
    bg.gain.linearRampToValueAtTime(0.26, sweepStart + 0.2);
    bg.gain.exponentialRampToValueAtTime(0.0001, sweepEnd);
    breath.connect(bLp).connect(bg).connect(master);
    breath.start(sweepStart);
    breath.stop(sweepEnd + 0.2);
  }

  // Orb rips — one per colour torn out of the image. Whoosh sweeping DOWN (the
  // colour is being pulled toward the viewer) plus a glass shimmer on top.
  const n = spec.regions.length;
  const scale = [523.25, 622.25, 698.46, 830.61, 932.33, 1046.5];
  spec.regions.forEach((_, i) => {
    const hit = at(regionRevealFraction(i, n));
    whoosh(hit, 0.26, 0.34, 4600, 800, 1.3);
    glass(hit, scale[i % scale.length], 0.3, 0.42);
    tone(DRONE_HZ * 1.5, hit, 0.2, 0.24);
  });

  // The bind: every colour lands at once. A reverse swell into a pitch-drop
  // boom. The swell is kept in the sub band so it adds weight without smearing
  // HF energy away from the beat.
  const bindAt = at(PHASE_FRACTIONS.revealEnd);
  if (!bedOnly) {
    const rev = ctx.createBufferSource();
    rev.buffer = noiseBuffer(0.6, true);
    const rLp = ctx.createBiquadFilter();
    rLp.type = 'lowpass';
    rLp.frequency.value = 240;
    const rg = ctx.createGain();
    rg.gain.setValueAtTime(0.0001, bindAt - 0.5);
    rg.gain.linearRampToValueAtTime(0.5, bindAt);
    rg.gain.linearRampToValueAtTime(0.0001, bindAt + 0.05);
    rev.connect(rLp).connect(rg).connect(master);
    rev.start(bindAt - 0.5);
    rev.stop(bindAt + 0.1);

    const boom = ctx.createOscillator();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(130, bindAt);
    boom.frequency.exponentialRampToValueAtTime(58, bindAt + 0.2);
    const bmg = ctx.createGain();
    bmg.gain.setValueAtTime(0.0001, bindAt);
    bmg.gain.linearRampToValueAtTime(0.72, bindAt + 0.008);
    bmg.gain.exponentialRampToValueAtTime(0.0001, bindAt + 0.55);
    boom.connect(bmg).connect(master);
    boom.start(bindAt);
    boom.stop(bindAt + 0.7);
  }
  whoosh(bindAt, 0.3, 0.4, 6000, 900, 0.8);

  // Wall header, then the rows landing in pairs — the cadence revealAudioBeats
  // derives from `spec.wall`, so this loop and the beat table cannot disagree.
  const wallAt = at(PHASE_FRACTIONS.slamEnd);
  const wallEndAt = at(PHASE_FRACTIONS.recipeEnd);
  glass(wallAt, 392, 0.42, 0.9);
  whoosh(wallAt, 0.34, 0.3, 3800, 1100, 1.0);

  const pairs = spec.wall ? Math.max(1, Math.ceil(spec.wall.length / 2)) : Math.max(1, spec.recipe.length);
  for (let i = 0; i < pairs; i++) {
    const landAt = wallAt + ((wallEndAt - wallAt) * 0.75 * i) / pairs;
    glass(landAt, scale[i % scale.length] * 0.75, 0.26, 0.4);
    tone(98 * (1 + i * 0.16), landAt, 0.34, 0.26);
  }

  // Loop exhale. Dark for the same reason the commune sweep is dark.
  const loopAt = at(PHASE_FRACTIONS.loopStart);
  if (!bedOnly) {
    const exhale = ctx.createBufferSource();
    exhale.buffer = noiseBuffer(Math.max(0.6, durSec - (loopAt - t0)) + 0.4, false);
    const eLp = ctx.createBiquadFilter();
    eLp.type = 'lowpass';
    eLp.frequency.setValueAtTime(1500, loopAt - 0.6);
    eLp.frequency.exponentialRampToValueAtTime(320, t0 + durSec);
    const eg = ctx.createGain();
    eg.gain.setValueAtTime(0.0001, loopAt - 0.6);
    eg.gain.linearRampToValueAtTime(0.3, loopAt - 0.1);
    eg.gain.linearRampToValueAtTime(0.0001, t0 + durSec + 0.1);
    exhale.connect(eLp).connect(eg).connect(master);
    exhale.start(loopAt - 0.6);
    exhale.stop(t0 + durSec + 0.2);
  }
}
