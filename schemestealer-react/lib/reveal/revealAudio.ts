/**
 * Synthesised audio bed for the Engine A export.
 *
 * captureStream() is video-only, so we render a cogitator soundscape via
 * WebAudio into a MediaStreamAudioDestinationNode and hand its track to the
 * MediaRecorder alongside the canvas track. Synthesised = tiny, royalty-free by
 * construction, and scheduled to the SAME beats as the visuals.
 *
 * Level: the first cut measured −40 dBFS RMS, which is inaudible once a platform
 * normalises toward ~−14 LUFS — and a silent clip is demoted outright. The mix
 * now sits loud enough to read on a phone speaker and runs through a soft limiter
 * so the transients can't clip, while still being a BED that a voiceover can sit
 * on top of in-platform.
 */

import { PHASE_FRACTIONS, regionRevealFraction, type RevealSpec } from './revealTimeline';

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
  const stepCount = Math.max(1, spec.recipe.length);
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
export function scheduleRevealAudio(
  ctx: BaseAudioContext,
  output: AudioNode,
  spec: RevealSpec,
  t0: number,
  opts: RevealAudioOptions = {},
): void {
  const bedOnly = opts.layers === 'bed';
  const master = ctx.createGain();
  master.gain.value = 2.55;

  // Soft-knee limiter: tanh curve keeps the snap hit and chimes from clipping
  // now that the bed runs hot.
  const limiter = ctx.createWaveShaper();
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
  }
  limiter.curve = curve;
  limiter.oversample = '4x';
  // Post-limiter trim. Platforms normalise to about −14 LUFS, so they ADD gain;
  // shipping at −0.5 dBFS peak meant they clipped it on their own servers.
  // This guarantees true-peak headroom no matter how hard the limiter is driven.
  const trim = ctx.createGain();
  trim.gain.value = 0.72;

  // Master EQ, and the reason it exists: a rumble bed and a −14 LUFS target pull
  // in opposite directions. BS.1770 K-weighting discounts the sub band hard, so
  // the rebuilt mix measured −17.2 LUFS while ALREADY peaking at −1.9 dBFS —
  // there was no gain left to give it. Loudness has to come from the band the
  // meter (and a phone speaker) actually weight, not from more rumble.
  //
  // The high-pass removes sub-50 Hz nothing reproduces; it was consuming
  // headroom and returning neither loudness nor audible bass. The presence bell
  // adds energy where K-weighting counts it in full. Both sit BEFORE the limiter
  // so the limiter acts on the final balance rather than fighting it.
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 70;
  hp.Q.value = 0.7;
  const presence = ctx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 1400;
  presence.Q.value = 0.9;
  presence.gain.value = 10;
  // High shelf on top of the bell. K-weighting applies a +4 dB shelf above
  // ~1.5 kHz, so this is the most loudness-per-dB-of-peak band available — and
  // the only continuous layer is a 220 Hz-lowpassed hum, so it lifts transients
  // and nothing else.
  const airShelf = ctx.createBiquadFilter();
  airShelf.type = 'highshelf';
  airShelf.frequency.value = 2600;
  airShelf.gain.value = 6;
  master.connect(hp).connect(presence).connect(airShelf).connect(limiter).connect(trim).connect(output);

  const durSec = spec.durationMs / 1000;

  /**
   * Noise source counter. Every buffer gets its own deterministic stream, so two
   * layers never correlate into an audible comb, and the SAME export always
   * produces the same file.
   */
  let noiseSeed = 0x9e3779b9;

  function noiseBuffer(seconds: number, brown: boolean): AudioBuffer {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    // mulberry32, not Math.random(). The visual timeline has been deterministic
    // from the start; the audio quietly was not, so the measured loudness, peak
    // and crest factor drifted a little on every render — and the crest gate
    // sits close enough to its threshold that random noise alone could flip it.
    // A gate that fails at random teaches the team to re-run tests until green,
    // which is worse than having no gate.
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

  /** Pitched hit with a fast attack and exponential tail. */
  function ping(freq: number, at: number, dur: number, peak: number, type: OscillatorType = 'sine'): void {
    if (bedOnly) return;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + dur + 0.05);
  }

  /** Filtered noise burst — the percussive half of a transient. */
  function burst(at: number, dur: number, peak: number, freq: number, q = 1): void {
    if (bedOnly) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(dur + 0.1, false);
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = freq;
    bp.Q.value = q;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    src.connect(bp).connect(g).connect(master);
    src.start(at);
    src.stop(at + dur + 0.05);
  }

  const at = (fraction: number) => t0 + fraction * durSec;

  /**
   * The weighted hit: a downward sine sweep plus a short filtered-noise crack.
   *
   * This is the shape that replaced the continuous hiss. The sweep from 120 Hz
   * to 45 Hz gives a hit physical WEIGHT (the ear reads a falling pitch as mass
   * landing), and the ~40 ms noise crack gives it the high-frequency edge that a
   * phone speaker can actually reproduce. Highs therefore arrive AT the beat and
   * nowhere else, instead of being smeared across the whole clip by a hiss bed.
   */
  function impact(at: number, weight: number, crackHz = 3200): void {
    if (bedOnly) return;
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(130, at);
    o.frequency.exponentialRampToValueAtTime(58, at + 0.18);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(weight, at + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.32);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + 0.4);
    burst(at, 0.04, weight * 0.85, crackHz, 1.4);
  }

  // Cogitator hum: brown noise → lowpass drone, slowly breathing via an LFO.
  //
  // Back up to a real level. v5.2 cut this to 0.05 and added a continuous
  // 2–7 kHz hiss on top, chasing a "≥15% of energy above 1 kHz" gate — the gate
  // measured a PROXY (spectral balance) instead of the property it wanted
  // (audible on a phone), and the cheapest way to satisfy it was to make the
  // clip sound like tape noise. The hum is the bed again; the highs now come
  // from `impact`, on the beat.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(Math.max(2, durSec), true);
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 220;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.095;
  noise.connect(lp).connect(humGain).connect(master);
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 0.1;
  lfo.connect(lfoGain).connect(humGain.gain);
  noise.start(t0);
  lfo.start(t0);
  noise.stop(t0 + durSec + 0.3);
  lfo.stop(t0 + durSec + 0.3);

  // Frame 0 needs a transient or the clip opens on silence — a low thud under
  // the proof stamp, then a charge rising into the smash cut.
  impact(t0, 0.34);
  ping(58, t0, 0.9, 0.5);
  const snapAt = at(PHASE_FRACTIONS.proofEnd);
  if (!bedOnly) {
    const charge = ctx.createOscillator();
    charge.type = 'sawtooth';
    charge.frequency.setValueAtTime(70, t0);
    charge.frequency.exponentialRampToValueAtTime(520, snapAt);
    const chargeGain = ctx.createGain();
    chargeGain.gain.setValueAtTime(0.0001, t0);
    chargeGain.gain.exponentialRampToValueAtTime(0.16, snapAt);
    chargeGain.gain.exponentialRampToValueAtTime(0.0001, snapAt + 0.12);
    const chargeLp = ctx.createBiquadFilter();
    chargeLp.type = 'lowpass';
    chargeLp.frequency.value = 900;
    charge.connect(chargeLp).connect(chargeGain).connect(master);
    charge.start(t0);
    charge.stop(snapAt + 0.2);
  }

  // The snap to greyscale — the moment the scroll stops. Hit it hard.
  impact(snapAt, 0.62, 4200);
  burst(snapAt, 0.28, 0.4, 1800, 0.7);
  ping(92, snapAt, 0.55, 0.5);

  // Sweep whine tracking the scan pass.
  const sweepStart = at(PHASE_FRACTIONS.smashEnd);
  const sweepEnd = at(PHASE_FRACTIONS.sweepEnd);
  if (!bedOnly) {
    const whine = ctx.createOscillator();
    whine.type = 'sine';
    whine.frequency.setValueAtTime(420, sweepStart);
    whine.frequency.linearRampToValueAtTime(1300, sweepEnd);
    const wg = ctx.createGain();
    wg.gain.setValueAtTime(0.0001, sweepStart);
    wg.gain.linearRampToValueAtTime(0.26, sweepStart + 0.15);
    wg.gain.exponentialRampToValueAtTime(0.0001, sweepEnd);
    whine.connect(wg).connect(master);
    whine.start(sweepStart);
    whine.stop(sweepEnd + 0.1);
  }

  // Per-region reveal chimes (pentatonic so any count sounds musical), on the
  // same accelerating schedule the blooms use. The LAST region is the dominant
  // colour igniting — it lands as a chord with a low thump, not another tick.
  // Per-region hits, on the same accelerating schedule the blooms use. These are
  // MECHANICAL CLACKS, not chimes: a cogitator tearing data off a model should
  // sound industrial, and clean sine pips read as generic UI. Each strike is a
  // tight noise crack plus a low body, with only a trace of pitch so successive
  // hits still climb. They sit BELOW the cascade — the payoff is the loudest
  // passage and the mid-reveal used to peak over it.
  const n = spec.regions.length;
  const pent = [523.25, 587.33, 659.25, 783.99, 880.0];
  spec.regions.forEach((_, i) => {
    const hit = at(regionRevealFraction(i, n));
    impact(hit, 0.3, 3600); // weight + the HF crack that carries on a phone
    burst(hit, 0.05, 0.3, 1150, 2.2); // the clack itself
    burst(hit + 0.012, 0.04, 0.16, 3200, 1.6); // bright edge, a hair late
    ping(96 + i * 5, hit, 0.14, 0.3); // solid low body
    ping(pent[i % pent.length], hit, 0.1, 0.07); // trace of pitch, climbing
    if (i === n - 1 && n > 1) {
      ping(65.4, hit, 0.7, 0.4); // low thump — the finale beat
    }
  });

  // The SLAM: the model resolving to full colour is the biggest visual beat in
  // the clip and it had nothing under it — a measured −25 dBFS hole sat exactly
  // there, right before the payoff.
  const slamAt = at(PHASE_FRACTIONS.revealEnd);
  impact(slamAt, 0.7, 5200); // the heaviest hit in the clip
  ping(49, slamAt, 1.2, 0.6); // sub impact
  burst(slamAt, 0.5, 0.34, 420, 0.5); // body
  burst(slamAt + 0.02, 0.35, 0.2, 5200, 0.8); // air

  // The recipe cascade is the money shot, so it gets the biggest stamp and a
  // rising bed underneath it. The previous mix troughed at −24.6 dBFS exactly
  // here while peaking mid-reveal — the emotional peak was the quietest moment.
  const outroAt = at(PHASE_FRACTIONS.slamEnd);
  const recipeEndAt = at(PHASE_FRACTIONS.recipeEnd);
  impact(outroAt, 0.6, 4600);
  ping(196, outroAt, 1.1, 0.55);
  ping(392, outroAt + 0.05, 0.9, 0.3);
  ping(659.25, outroAt + 0.1, 0.8, 0.22);

  if (!bedOnly) {
    const bed = ctx.createBufferSource();
    bed.buffer = noiseBuffer(Math.max(0.5, recipeEndAt - outroAt) + 0.4, true);
    const bedFilter = ctx.createBiquadFilter();
    bedFilter.type = 'lowpass';
    bedFilter.frequency.setValueAtTime(180, outroAt);
    bedFilter.frequency.linearRampToValueAtTime(900, recipeEndAt);
    const bedGain = ctx.createGain();
    bedGain.gain.setValueAtTime(0.0001, outroAt);
    bedGain.gain.linearRampToValueAtTime(0.42, recipeEndAt);
    bedGain.gain.linearRampToValueAtTime(0.0001, recipeEndAt + 0.35);
    bed.connect(bedFilter).connect(bedGain).connect(master);
    bed.start(outroAt);
    bed.stop(recipeEndAt + 0.5);
  }

  // One stamp per chip as it lands, so the cascade is felt as well as read.
  const stepCount = Math.max(1, spec.recipe.length);
  for (let i = 0; i < stepCount; i++) {
    const chipAt = outroAt + ((recipeEndAt - outroAt) * 0.75 * i) / stepCount;
    ping(147 * (1 + i * 0.18), chipAt, 0.45, 0.3);
    burst(chipAt, 0.07, 0.12, 1400, 1.1);
    burst(chipAt, 0.045, 0.16, 3800, 1.3); // HF edge, on the beat
  }

  // Rising swell into the loop point, so the restart feels intended.
  const loopAt = at(PHASE_FRACTIONS.loopStart);
  if (!bedOnly) {
    const swell = ctx.createBufferSource();
    swell.buffer = noiseBuffer(Math.max(0.6, durSec - (loopAt - t0)) + 0.4, false);
    const swellFilter = ctx.createBiquadFilter();
    swellFilter.type = 'lowpass';
    swellFilter.frequency.setValueAtTime(300, loopAt - 0.6);
    swellFilter.frequency.exponentialRampToValueAtTime(1600, t0 + durSec);
    const swellGain = ctx.createGain();
    swellGain.gain.setValueAtTime(0.0001, loopAt - 0.6);
    swellGain.gain.linearRampToValueAtTime(0.3, t0 + durSec);
    swellGain.gain.linearRampToValueAtTime(0.0001, t0 + durSec + 0.12);
    swell.connect(swellFilter).connect(swellGain).connect(master);
    swell.start(loopAt - 0.6);
    swell.stop(t0 + durSec + 0.2);
  }
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
