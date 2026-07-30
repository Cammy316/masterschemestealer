/**
 * Synthesised audio bed for the Engine A export.
 *
 * captureStream() is video-only, so we render a quiet cogitator soundscape via
 * WebAudio into a MediaStreamAudioDestinationNode and hand its track to the
 * MediaRecorder alongside the canvas track. Synthesised = tiny, royalty-free by
 * construction, and scheduled to the SAME beats as the visuals. Kept a quiet
 * BED (not a soundtrack) so creators can voiceover on top in-platform.
 */

import { PHASE_FRACTIONS, regionRevealFraction, type RevealSpec } from './revealTimeline';

export interface RevealAudioBed {
  stream: MediaStream;
  start(): void;
  stop(): void;
}

export function createRevealAudioBed(spec: RevealSpec): RevealAudioBed {
  const Ctor = (window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext) as typeof AudioContext;
  const ctx = new Ctor();
  const dest = ctx.createMediaStreamDestination();
  const master = ctx.createGain();
  master.gain.value = 0.45; // quiet bed
  master.connect(dest);

  const durSec = spec.durationMs / 1000;
  let started = false;

  function brownNoise(seconds: number): AudioBuffer {
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    return buf;
  }

  function ping(freq: number, at: number, dur: number, peak: number): void {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, at);
    g.gain.linearRampToValueAtTime(peak, at + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, at + dur);
    o.connect(g).connect(master);
    o.start(at);
    o.stop(at + dur + 0.05);
  }

  return {
    stream: dest.stream,
    start() {
      if (started) return;
      started = true;
      if (ctx.state === 'suspended') void ctx.resume();
      const t0 = ctx.currentTime + 0.05;

      // Cogitator hum: brown noise → lowpass drone, slowly breathing via an LFO.
      const noise = ctx.createBufferSource();
      noise.buffer = brownNoise(Math.max(2, durSec));
      noise.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 200;
      const humGain = ctx.createGain();
      humGain.gain.value = 0.1;
      noise.connect(lp).connect(humGain).connect(master);
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.15;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.04;
      lfo.connect(lfoGain).connect(humGain.gain);
      noise.start(t0);
      lfo.start(t0);
      noise.stop(t0 + durSec + 0.2);
      lfo.stop(t0 + durSec + 0.2);

      // Sweep whine tracking the scan pass.
      const sweepStart = t0 + PHASE_FRACTIONS.bootEnd * durSec;
      const sweepEnd = t0 + PHASE_FRACTIONS.sweepEnd * durSec;
      const whine = ctx.createOscillator();
      whine.type = 'sine';
      whine.frequency.setValueAtTime(420, sweepStart);
      whine.frequency.linearRampToValueAtTime(1300, sweepEnd);
      const wg = ctx.createGain();
      wg.gain.setValueAtTime(0.0001, sweepStart);
      wg.gain.linearRampToValueAtTime(0.06, sweepStart + 0.15);
      wg.gain.exponentialRampToValueAtTime(0.0001, sweepEnd);
      whine.connect(wg).connect(master);
      whine.start(sweepStart);
      whine.stop(sweepEnd + 0.1);

      // Per-region reveal chimes (pentatonic so any count sounds musical).
      const n = spec.regions.length;
      const pent = [523.25, 587.33, 659.25, 783.99, 880.0];
      spec.regions.forEach((_, i) => {
        ping(pent[i % pent.length], t0 + regionRevealFraction(i, n) * durSec, 0.5, 0.08);
      });

      // Outro stamp at the recipe cascade.
      const outroAt = t0 + PHASE_FRACTIONS.revealEnd * durSec;
      ping(196, outroAt, 0.8, 0.12); // low thud
      ping(659.25, outroAt + 0.06, 0.6, 0.05); // shimmer
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
