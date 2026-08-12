/**
 * The miniature export's soundtrack — a ritual machine.
 *
 * Synthesised, never sampled or licensed. That is deliberate: our users
 * redistribute the exported file, and a licensed track covers US rather than the
 * painter who posts it, whose video can still take a Content ID claim. Audio we
 * generate is ours to grant unconditionally — and the platforms now weight
 * original audio above borrowed sound anyway.
 *
 * Voicing lives here; the machinery (reverb, buses, ducking, struck-metal
 * timbres, the key) lives in revealAudioEngine and is shared with the warp-cast.
 */

import { PHASE_FRACTIONS, regionRevealFraction, type RevealSpec } from './revealTimeline';
import {
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

export interface RevealAudioBed {
  stream: MediaStream;
  start(): void;
  stop(): void;
}

/**
 * Which layers to schedule.
 *
 * `bed` renders ONLY the sustained layers — the ones that play under everything
 * else rather than marking a moment. It exists so a test can measure the bed's
 * spectrum on its own, which is the only way to state the actual requirement:
 * the sustained layer must be a low rumble. Measuring the full mix cannot say
 * that, because transients dominate the spectrum and a continuous hiss hides
 * inside them — which is exactly how the v5.2 hiss passed its gate.
 */
export type RevealAudioLayers = 'all' | 'bed';

export interface RevealAudioOptions {
  layers?: RevealAudioLayers;
}

/**
 * Every scheduled transient, in seconds from the start of the clip.
 *
 * Exported so the alignment test measures against the SCHEDULE ITSELF rather
 * than a second copy of the beat list that could drift out of sync with this
 * file and quietly stop testing anything.
 */
export function revealAudioBeats(spec: RevealSpec): number[] {
  const durSec = spec.durationMs / 1000;
  const at = (f: number) => f * durSec;
  const beats = [
    0, // the opening thud under the proof stamp
    at(PHASE_FRACTIONS.proofEnd), // smash cut to greyscale
    at(PHASE_FRACTIONS.revealEnd), // the slam back to full colour
    at(PHASE_FRACTIONS.slamEnd), // recipe cascade stamp
  ];
  const n = spec.regions.length;
  for (let i = 0; i < n; i++) beats.push(at(regionRevealFraction(i, n)));
  const outroAt = at(PHASE_FRACTIONS.slamEnd);
  const recipeEndAt = at(PHASE_FRACTIONS.recipeEnd);
  // The outro cascade window was tuned for four recipe rows. The inspiration
  // wall carries up to six, and six beats in the same window is a 180 ms cadence
  // that cannot clear the cipher's 180 ms burst plus its 80 ms readable tail. So
  // wall rows land in PAIRS — ceil(n/2) beats at ~359 ms, which does clear.
  // Mini is unaffected: without a wall this is spec.recipe.length exactly.
  const stepCount = spec.wall ? Math.max(1, Math.ceil(spec.wall.length / 2)) : Math.max(1, spec.recipe.length);
  for (let i = 0; i < stepCount; i++) {
    beats.push(outroAt + ((recipeEndAt - outroAt) * 0.75 * i) / stepCount);
  }
  return beats.sort((a, b) => a - b);
}

/**
 * Build and schedule the whole bed into `output` on `ctx`, starting at `t0`.
 *
 * Split out from the MediaStream plumbing so the identical graph can be rendered
 * in an OfflineAudioContext and its loudness measured — the first cut shipped at
 * −40 dBFS RMS precisely because nothing ever checked.
 */
/**
 * The miniature soundtrack: a ritual machine.
 *
 * A low choral drone under servo whirs and relay clacks, resolving to a struck
 * bell at the slam. The previous version was a flat list of sine pings and
 * band-passed noise wired straight to a limiter — dry, mono, and pitched on
 * arbitrary Hz values, so nothing agreed with anything. Everything here is in D
 * minor and everything sits in a room.
 *
 * `bedOnly` renders ONLY the always-on layers, so a test can measure the
 * sustained bed's spectrum on its own. The chord pad is deliberately NOT part of
 * it: it fades in and out at phase boundaries, so it is scheduled material, and
 * counting it as bed would both misdescribe it and drag mid-band energy into a
 * gate that exists to prove the sustained layer is a low rumble.
 */
export function scheduleRevealAudio(
  ctx: BaseAudioContext,
  output: AudioNode,
  spec: RevealSpec,
  t0: number,
  opts: RevealAudioOptions = {},
): void {
  const bedOnly = opts.layers === 'bed';
  const durSec = spec.durationMs / 1000;
  const at = (fraction: number) => t0 + fraction * durSec;
  const rnd = mulberry32(0x9e3779b9);
  const scale = SCALES.imperial;

  // trim is POST-limiter, so this sets the ceiling without touching how hard
  // the limiter is driven — crest ratio and transient shape are unchanged.
  // Was 0.83, which measured -10.72 LUFS on the shipped file once the gate
  // stopped averaging the channels. 0.83 * 10^(-3.01/20) lands on -14.
  const master = createMaster(ctx, output, { gain: 1.33, trim: 0.587 });

  // A dark hall. `tone` is low on purpose: a bright tail on a cogitator reads as
  // a cathedral rather than a machine room, and bright sustained content is also
  // what the HF-on-beat gate is watching for.
  const hall = createReverb(ctx, master.input, {
    seconds: 2.0,
    decay: 4.6,
    tone: 0.1,
    preDelay: 0.022,
    seed: 0x11c0,
  });

  const bedBus = createBus(ctx, master.input, { gain: 1, send: { to: hall.input, amount: 0.07 } });
  const hitBus = createBus(ctx, master.input, {
    gain: 1,
    compress: { threshold: -20, ratio: 3.2, attack: 0.004, release: 0.18 },
    send: { to: hall.input, amount: 0.26 },
  });
  const padBus = createBus(ctx, master.input, { gain: 1, send: { to: hall.input, amount: 0.22 } });

  // ---- the sustained bed -----------------------------------------------------
  // Brown noise under a hard lowpass, plus a dark drone on the tonic. Both stay
  // below 250 Hz so the bed remains a rumble by measurement, not just by intent.
  const floor = ctx.createBufferSource();
  floor.buffer = noiseBuffer(ctx, Math.max(2, durSec), 'brown', rnd);
  floor.loop = true;
  const floorLp = ctx.createBiquadFilter();
  floorLp.type = 'lowpass';
  floorLp.frequency.value = 200;
  const floorGain = ctx.createGain();
  floorGain.gain.value = 0.020;
  floor.connect(floorLp).connect(floorGain).connect(bedBus.input);
  floor.start(t0);
  floor.stop(t0 + durSec + 0.3);

  for (const cents of [-9, 9]) {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = scale.root;
    o.detune.value = cents;
    const g = ctx.createGain();
    g.gain.value = 0.0118;
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 240;
    // Slow, offset breathing, so the two never pulse in lockstep.
    const lfo = ctx.createOscillator();
    lfo.frequency.value = cents < 0 ? 0.13 : 0.19;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(g.gain);
    o.connect(lp).connect(g).connect(bedBus.input);
    o.start(t0);
    lfo.start(t0);
    o.stop(t0 + durSec + 0.3);
    lfo.stop(t0 + durSec + 0.3);
  }

  // The bed dips under every hit so the transients cut without the mix getting
  // louder. Scheduled, not sidechained — every beat is known in advance.
  if (!bedOnly) {
    duckAt(
      bedBus.gain.gain,
      revealAudioBeats(spec).map((b) => t0 + b),
      1,
      { depth: 0.4, release: 0.3 },
    );
  }

  if (bedOnly) return;

  // ---- harmony ---------------------------------------------------------------
  // Three chords across the three acts: Dm while the machine reads, C as it
  // resolves, F under the payoff. Low and filtered — this is a bed to sit under
  // the hits, not a melody competing with them.
  const chordAt = [t0, at(PHASE_FRACTIONS.revealEnd), at(PHASE_FRACTIONS.slamEnd)];
  const chordEnd = [at(PHASE_FRACTIONS.revealEnd) + 0.6, at(PHASE_FRACTIONS.slamEnd) + 0.6, t0 + durSec + 0.4];
  scale.progression.forEach((semi, i) => {
    const root = noteHz(scale.root, semi);
    pad(ctx, padBus.input, {
      freqs: [root, noteHz(root, 7), noteHz(root, 12)],
      at: chordAt[i],
      dur: Math.max(0.8, chordEnd[i] - chordAt[i]),
      gain: 0.0108,
      detune: 8,
      cutoff: 900,
      type: 'sawtooth',
      fade: 0.7,
    });
  });

  // ---- scheduled material ----------------------------------------------------
  // The clip opens on the finished proof, so it opens on a bell rather than an
  // impact: something already awake.
  struck(ctx, hitBus.input, { freq: scaleHz(scale, 0, 1), at: t0, gain: 0.4, decay: 2.2 });
  sub(ctx, hitBus.input, { at: t0, gain: 0.46, fromHz: 130, toHz: 58, dur: 0.5 });

  // Charge into the smash: a rising servo whine that stops dead.
  const snapAt = at(PHASE_FRACTIONS.proofEnd);
  const charge = ctx.createOscillator();
  charge.type = 'sawtooth';
  charge.frequency.setValueAtTime(70, t0);
  charge.frequency.exponentialRampToValueAtTime(430, snapAt);
  const chargeGain = ctx.createGain();
  chargeGain.gain.setValueAtTime(0.0001, t0);
  chargeGain.gain.exponentialRampToValueAtTime(0.1, snapAt);
  chargeGain.gain.exponentialRampToValueAtTime(0.0001, snapAt + 0.1);
  const chargeLp = ctx.createBiquadFilter();
  chargeLp.type = 'lowpass';
  chargeLp.frequency.value = 800;
  charge.connect(chargeLp).connect(chargeGain).connect(hitBus.input);
  charge.start(t0);
  charge.stop(snapAt + 0.2);

  // The smash: metal on metal. Short decay and a tight partial set — a clank,
  // not a bell.
  struck(ctx, hitBus.input, {
    freq: scaleHz(scale, 2, 2),
    at: snapAt,
    gain: 0.46,
    decay: 0.5,
    partials: [1, 1.41, 2.13, 3.17, 4.51],
    spread: 12,
  });
  sub(ctx, hitBus.input, { at: snapAt, gain: 0.8, fromHz: 150, toHz: 48, dur: 0.55 });
  air(ctx, hitBus.input, { at: snapAt, dur: 0.3, gain: 0.42, fromHz: 5200, toHz: 900, rnd });

  // Servo sweep across the scan pass.
  const sweepStart = at(PHASE_FRACTIONS.smashEnd);
  const sweepEnd = at(PHASE_FRACTIONS.sweepEnd);
  const servo = ctx.createOscillator();
  servo.type = 'sawtooth';
  servo.frequency.setValueAtTime(scaleHz(scale, 0, 2), sweepStart);
  servo.frequency.linearRampToValueAtTime(scaleHz(scale, 4, 2), sweepEnd);
  const servoLp = ctx.createBiquadFilter();
  servoLp.type = 'lowpass';
  servoLp.frequency.value = 1500;
  servoLp.Q.value = 6;
  const servoGain = ctx.createGain();
  servoGain.gain.setValueAtTime(0.0001, sweepStart);
  servoGain.gain.linearRampToValueAtTime(0.075, sweepStart + 0.18);
  servoGain.gain.exponentialRampToValueAtTime(0.0001, sweepEnd);
  servo.connect(servoLp).connect(servoGain).connect(hitBus.input);
  servo.start(sweepStart);
  servo.stop(sweepEnd + 0.1);

  // Each colour identified: a relay clack and a small bell, climbing the scale.
  const n = spec.regions.length;
  spec.regions.forEach((_, i) => {
    const hit = at(regionRevealFraction(i, n));
    air(ctx, hitBus.input, { at: hit, dur: 0.045, gain: 0.42, fromHz: 3400, toHz: 1500, q: 2.4, rnd });
    struck(ctx, hitBus.input, {
      freq: scaleHz(scale, i + 2, 2),
      at: hit,
      gain: 0.28,
      decay: 0.85,
      spread: 6,
    });
    sub(ctx, hitBus.input, { at: hit, gain: 0.3, fromHz: 120, toHz: 62, dur: 0.24 });
  });

  // The slam: the big bell. This one strike is most of the "sacred tech"
  // character, so it gets the longest tail in the clip.
  const slamAt = at(PHASE_FRACTIONS.revealEnd);
  struck(ctx, hitBus.input, { freq: scaleHz(scale, 0, 1), at: slamAt, gain: 0.62, decay: 3.2 });
  sub(ctx, hitBus.input, { at: slamAt, gain: 0.88, fromHz: 140, toHz: 44, dur: 0.9 });
  air(ctx, hitBus.input, { at: slamAt, dur: 0.34, gain: 0.36, fromHz: 6000, toHz: 1100, rnd });

  // Recipe cascade: one metallic tick per chip.
  const outroAt = at(PHASE_FRACTIONS.slamEnd);
  const recipeEndAt = at(PHASE_FRACTIONS.recipeEnd);
  struck(ctx, hitBus.input, { freq: scaleHz(scale, 4, 1), at: outroAt, gain: 0.42, decay: 1.8 });
  const stepCount = Math.max(1, spec.recipe.length);
  for (let i = 0; i < stepCount; i++) {
    const chipAt = outroAt + ((recipeEndAt - outroAt) * 0.75 * i) / stepCount;
    struck(ctx, hitBus.input, {
      freq: scaleHz(scale, i + 4, 2),
      at: chipAt,
      gain: 0.15,
      decay: 0.5,
      partials: [1, 2.04, 3.31],
    });
    air(ctx, hitBus.input, { at: chipAt, dur: 0.05, gain: 0.13, fromHz: 3000, toHz: 1600, q: 2, rnd });
  }

  // Into the loop: a dark swell, so the restart feels intended rather than cut.
  const loopAt = at(PHASE_FRACTIONS.loopStart);
  const swell = ctx.createBufferSource();
  swell.buffer = noiseBuffer(ctx, Math.max(0.8, durSec - (loopAt - t0)) + 0.4, 'white', rnd);
  const swellLp = ctx.createBiquadFilter();
  swellLp.type = 'lowpass';
  swellLp.frequency.setValueAtTime(320, loopAt - 0.7);
  swellLp.frequency.exponentialRampToValueAtTime(1500, t0 + durSec);
  const swellGain = ctx.createGain();
  swellGain.gain.setValueAtTime(0.0001, loopAt - 0.7);
  swellGain.gain.linearRampToValueAtTime(0.2, t0 + durSec);
  swellGain.gain.linearRampToValueAtTime(0.0001, t0 + durSec + 0.12);
  swell.connect(swellLp).connect(swellGain).connect(hitBus.input);
  swell.start(loopAt - 0.7);
  swell.stop(t0 + durSec + 0.2);
}

export function createRevealAudioBed(spec: RevealSpec): RevealAudioBed {
  const Ctor = (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
  const ctx = new Ctor();
  const dest = ctx.createMediaStreamDestination();
  let started = false;

  return {
    stream: dest.stream,
    start() {
      if (started) return;
      started = true;
      if (ctx.state === 'suspended') void ctx.resume();
      scheduleRevealAudio(ctx, dest, spec, ctx.currentTime + 0.05);
    },
    stop() {
      // Video loop already ran the full duration, so the bed has played.
      try {
        void ctx.close();
      } catch {
        /* already closed */
      }
    },
  };
}
