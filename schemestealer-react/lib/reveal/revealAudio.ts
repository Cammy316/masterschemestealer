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
): void {
  const master = ctx.createGain();
  master.gain.value = 0.9;

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
  master.connect(limiter).connect(output);

  const durSec = spec.durationMs / 1000;

  function noiseBuffer(seconds: number, brown: boolean): AudioBuffer {
    const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
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

  // Cogitator hum: brown noise → lowpass drone, slowly breathing via an LFO.
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer(Math.max(2, durSec), true);
  noise.loop = true;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 220;
  const humGain = ctx.createGain();
  humGain.gain.value = 0.3;
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

  // Frame 1 needs a transient or the clip opens on silence — a low boot thud
  // under the hero, then a charge rising into the snap.
  ping(58, t0, 0.9, 0.5);
  const snapAt = at(PHASE_FRACTIONS.heroEnd);
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

  // The snap to greyscale — the moment the scroll stops. Hit it hard.
  burst(snapAt, 0.28, 0.55, 1800, 0.7);
  ping(92, snapAt, 0.55, 0.6);

  // Sweep whine tracking the scan pass.
  const sweepStart = at(PHASE_FRACTIONS.snapEnd);
  const sweepEnd = at(PHASE_FRACTIONS.sweepEnd);
  const whine = ctx.createOscillator();
  whine.type = 'sine';
  whine.frequency.setValueAtTime(420, sweepStart);
  whine.frequency.linearRampToValueAtTime(1300, sweepEnd);
  const wg = ctx.createGain();
  wg.gain.setValueAtTime(0.0001, sweepStart);
  wg.gain.linearRampToValueAtTime(0.2, sweepStart + 0.15);
  wg.gain.exponentialRampToValueAtTime(0.0001, sweepEnd);
  whine.connect(wg).connect(master);
  whine.start(sweepStart);
  whine.stop(sweepEnd + 0.1);

  // Per-region reveal chimes (pentatonic so any count sounds musical), on the
  // same accelerating schedule the blooms use.
  const n = spec.regions.length;
  const pent = [523.25, 587.33, 659.25, 783.99, 880.0];
  spec.regions.forEach((_, i) => {
    const hit = at(regionRevealFraction(i, n));
    ping(pent[i % pent.length], hit, 0.6, 0.28);
    burst(hit, 0.12, 0.1, 2600, 1.4);
  });

  // Outro stamp as the recipe cascade starts.
  const outroAt = at(PHASE_FRACTIONS.revealEnd);
  ping(196, outroAt, 0.9, 0.4);
  ping(659.25, outroAt + 0.06, 0.7, 0.16);

  // Rising swell into the loop point, so the restart feels intended.
  const loopAt = at(PHASE_FRACTIONS.loopStart);
  const swell = ctx.createBufferSource();
  swell.buffer = noiseBuffer(Math.max(0.6, durSec - (loopAt - t0)) + 0.4, false);
  const swellFilter = ctx.createBiquadFilter();
  swellFilter.type = 'lowpass';
  swellFilter.frequency.setValueAtTime(300, loopAt - 0.6);
  swellFilter.frequency.exponentialRampToValueAtTime(4000, t0 + durSec);
  const swellGain = ctx.createGain();
  swellGain.gain.setValueAtTime(0.0001, loopAt - 0.6);
  swellGain.gain.linearRampToValueAtTime(0.22, t0 + durSec);
  swellGain.gain.linearRampToValueAtTime(0.0001, t0 + durSec + 0.12);
  swell.connect(swellFilter).connect(swellGain).connect(master);
  swell.start(loopAt - 0.6);
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
