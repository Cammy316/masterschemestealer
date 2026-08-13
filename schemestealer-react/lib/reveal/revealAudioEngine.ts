/**
 * Shared synthesis engine for both export soundtracks.
 *
 * Both beds were written as flat lists of oscillators and filtered noise
 * connected straight to a limiter, and they sounded like it: bone dry, mono,
 * with pitches picked as arbitrary Hz values (`96 + i * 5`) so nothing agreed
 * with anything. This module is what they were missing — space, buses,
 * dynamics, struck-metal timbres and a key to be in.
 *
 * Everything here is PROCEDURAL. That is a licensing decision as much as a
 * technical one: our users redistribute the exported file, and a royalty-free
 * or AI-generated track licenses US, not the painter who posts it — their video
 * can still take a Content ID claim. Audio we synthesise is ours to grant
 * unconditionally, and the platforms now weight original audio more heavily than
 * borrowed sound anyway.
 *
 * Everything is also DETERMINISTIC: same scan, same bytes, every render.
 */

import type { RevealSkin } from './revealLayers';

// ---- determinism -------------------------------------------------------------

/** mulberry32. Seeded so a render is reproducible — the loudness gates sit close
 *  enough to their thresholds that `Math.random()` alone could flip one. */
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- pitch -------------------------------------------------------------------

/** Equal-tempered semitone offset from a root frequency. */
export function noteHz(rootHz: number, semitones: number): number {
  return rootHz * Math.pow(2, semitones / 12);
}

export interface Scale {
  /** Tonic, in Hz. */
  root: number;
  /** Semitone offsets of the scale, one octave. */
  degrees: number[];
  /** Chord roots (semitones from the tonic) the bed moves through, in order. */
  progression: number[];
}

/**
 * A key per skin, so pitched material has somewhere to belong.
 *
 * Imperial is D natural minor — dark and liturgical, which is what "sacred
 * machine" needs. Warp is A major, which reads as calm and premium rather than
 * menacing: the inspiration clip became a gallery poster, and a dissonant bed
 * would fight the thing the visuals turned into.
 */
export const SCALES: Record<RevealSkin, Scale> = {
  // D2. Low enough to feel, above the 70 Hz master high-pass.
  imperial: { root: 73.416, degrees: [0, 2, 3, 5, 7, 8, 10], progression: [0, -2, 3] },
  // A2.
  warp: { root: 110, degrees: [0, 2, 4, 7, 9], progression: [0, -3, 5] },
};

/** `i`th degree of a scale, wrapping into higher octaves. */
export function scaleHz(scale: Scale, i: number, octave = 0): number {
  const n = scale.degrees.length;
  const idx = ((i % n) + n) % n;
  const oct = Math.floor(i / n) + octave;
  return noteHz(scale.root, scale.degrees[idx] + oct * 12);
}

// ---- impulse response --------------------------------------------------------

/**
 * One channel of a synthetic reverb impulse: noise under an exponential decay,
 * one-pole lowpassed for darkness.
 *
 * Pure and separately exported so the maths is unit-testable without a browser —
 * an AudioBuffer needs an AudioContext, a Float32Array does not.
 *
 * `tone` 0..1 is the lowpass coefficient: 1 is bright/open, 0.05 is a dark hall.
 * `decay` is the exponent on the fade; 2 is a small room, 5 a long tail.
 */
export function buildImpulse(
  length: number,
  decay: number,
  tone: number,
  rnd: () => number,
): Float32Array<ArrayBuffer> {
  const out = new Float32Array(new ArrayBuffer(length * 4));
  const t = Math.min(1, Math.max(0.001, tone));
  let lp = 0;
  for (let i = 0; i < length; i++) {
    const n = rnd() * 2 - 1;
    lp += t * (n - lp);
    out[i] = lp * Math.pow(1 - i / length, decay);
  }
  return out;
}

export interface ReverbOptions {
  seconds: number;
  decay: number;
  /** 0..1 — lower is darker. */
  tone: number;
  /** Pre-delay in seconds. Separates the source from its space, which is most of
   *  what makes a reverb sound like a room rather than a wash. */
  preDelay?: number;
  seed?: number;
}

export interface Reverb {
  /** Connect sends here. */
  input: AudioNode;
}

/**
 * Convolution reverb from a generated impulse — no asset files, no decode step,
 * deterministic.
 *
 * This is the single biggest change to how either clip sounds. Every previous
 * version was completely dry, which is the most reliable tell of cheap
 * synthesis: real sounds happen somewhere, and nothing in those mixes did.
 *
 * The two channels get DIFFERENT noise, which is what produces stereo width
 * without any phase trickery — and therefore without a mono downmix cancelling
 * it, which matters because most people watch on a phone speaker.
 */
export function createReverb(ctx: BaseAudioContext, output: AudioNode, opts: ReverbOptions): Reverb {
  const rnd = mulberry32(opts.seed ?? 0x5eed1);
  const len = Math.max(1, Math.floor(ctx.sampleRate * opts.seconds));
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  buf.copyToChannel(buildImpulse(len, opts.decay, opts.tone, rnd), 0);
  buf.copyToChannel(buildImpulse(len, opts.decay, opts.tone, rnd), 1);

  const conv = ctx.createConvolver();
  conv.normalize = true;
  conv.buffer = buf;

  const input: AudioNode = opts.preDelay
    ? (() => {
        const d = ctx.createDelay(1);
        d.delayTime.value = opts.preDelay!;
        d.connect(conv);
        return d;
      })()
    : conv;

  conv.connect(output);
  return { input };
}

// ---- buses -------------------------------------------------------------------

export interface Bus {
  /** Connect sources here. */
  input: GainNode;
  /** Post-source level, and the handle for ducking. */
  gain: GainNode;
}

export interface BusOptions {
  gain?: number;
  /** Adds a compressor with musical timings — glue, not limiting. */
  compress?: { threshold: number; ratio: number; attack: number; release: number };
  /** 0..1 send into a reverb. */
  send?: { to: AudioNode; amount: number };
}

export function createBus(ctx: BaseAudioContext, output: AudioNode, opts: BusOptions = {}): Bus {
  const input = ctx.createGain();
  const gain = ctx.createGain();
  gain.gain.value = opts.gain ?? 1;

  let tail: AudioNode = input;
  if (opts.compress) {
    const c = ctx.createDynamicsCompressor();
    c.threshold.value = opts.compress.threshold;
    c.ratio.value = opts.compress.ratio;
    c.attack.value = opts.compress.attack;
    c.release.value = opts.compress.release;
    c.knee.value = 6;
    tail.connect(c);
    tail = c;
  }
  tail.connect(gain);
  gain.connect(output);

  if (opts.send) {
    const s = ctx.createGain();
    s.gain.value = opts.send.amount;
    gain.connect(s).connect(opts.send.to);
  }
  return { input, gain };
}

/**
 * Duck a bus under each beat.
 *
 * WebAudio has no sidechain, and it does not need one here: every beat time is
 * known before a sample is rendered, so this is scheduled automation. That is
 * both cheaper and more exact than a real detector — and it is deterministic,
 * which a level-following sidechain would not be.
 */
export function duckAt(
  param: AudioParam,
  beats: number[],
  base: number,
  opts: { depth?: number; attack?: number; release?: number } = {},
): void {
  const depth = opts.depth ?? 0.45;
  const attack = opts.attack ?? 0.012;
  const release = opts.release ?? 0.28;
  param.setValueAtTime(base, 0);
  for (const t of beats) {
    if (t < 0) continue;
    param.setTargetAtTime(base * (1 - depth), Math.max(0, t - 0.004), attack);
    param.setTargetAtTime(base, t + attack + 0.01, release);
  }
}

// ---- sources -----------------------------------------------------------------

export function noiseBuffer(
  ctx: BaseAudioContext,
  seconds: number,
  kind: 'white' | 'brown',
  rnd: () => number,
): AudioBuffer {
  const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = rnd() * 2 - 1;
    if (kind === 'brown') {
      last = (last + 0.02 * w) / 1.02;
      d[i] = last * 3.5;
    } else {
      d[i] = w;
    }
  }
  return buf;
}

/** Church-bell partial ratios. Inharmonic on purpose — the minor-third "hum"
 *  against the strike tone is what makes metal sound struck rather than played. */
export const BELL_PARTIALS = [0.5, 1, 1.183, 1.506, 2, 2.514, 3.011, 4.166];
/** Bowed glass / crystal: sparser, higher, no low hum. */
export const GLASS_PARTIALS = [1, 2.76, 5.4, 8.93];

export interface StruckOptions {
  freq: number;
  at: number;
  gain: number;
  decay: number;
  partials?: number[];
  /** Seconds to reach full level. 0 is struck; 0.04+ is bowed. */
  attack?: number;
  /** Detune spread in cents across partials, for beating. */
  spread?: number;
}

/**
 * A struck or bowed metal tone: a stack of inharmonic partials, each with its
 * own decay.
 *
 * Upper partials must die faster than the fundamental or the result rings like a
 * synth pad instead of metal. That single detail is most of the difference
 * between "bell" and "sine with reverb".
 */
export function struck(ctx: BaseAudioContext, dest: AudioNode, o: StruckOptions): void {
  const partials = o.partials ?? BELL_PARTIALS;
  const attack = o.attack ?? 0.004;
  partials.forEach((mult, i) => {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = o.freq * mult;
    if (o.spread) osc.detune.value = (i - partials.length / 2) * o.spread;
    const g = ctx.createGain();
    // Higher partials are quieter and shorter.
    const amp = o.gain / (1 + i * 1.35);
    const dur = o.decay / (1 + i * 0.42);
    g.gain.setValueAtTime(0.0001, o.at);
    g.gain.linearRampToValueAtTime(amp, o.at + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, o.at + attack + dur);
    osc.connect(g).connect(dest);
    osc.start(o.at);
    osc.stop(o.at + attack + dur + 0.05);
  });
}

/**
 * Body resonances, in ABSOLUTE Hz. These do NOT transpose with the note.
 *
 * This is the single largest contributor to the "keyboard preset" impression
 * the previous pour tones gave. Measured on the shipped bed: nothing held a
 * fixed frequency as pitch moved — the entire spectrum simply transposed, so
 * every pour was one timbre pitch-shifted. Real resonant bodies have body
 * modes that stay put while the note moves, and the ear uses exactly that to
 * decide whether it is hearing an object or a synthesiser.
 */
const BODY_FORMANTS: { hz: number; q: number; gain: number }[] = [
  { hz: 700, q: 3.2, gain: 0.42 },
  { hz: 2400, q: 4.5, gain: 0.26 },
];

export interface PourOptions {
  freq: number;
  at: number;
  gain: number;
  decay: number;
  /**
   * Deterministic voice seed — hash it from the paint, not from a counter.
   *
   * The colour decides the sound. That is on-brand in a way a random seed is
   * not, and it is what stops five pours being one spectral template
   * transposed: measured on the shipped bed, two pairs of pours agreed on
   * their partial ratios to within 0.15% and 0.3%.
   */
  seed: number;
  attack?: number;
  /** How far the pitch rises across the note. A real vessel filling RISES —
   *  the air column shortens, so the Helmholtz resonance climbs. */
  glideSemitones?: number;
}

/**
 * A liquid pour into a resonant vessel.
 *
 * Replaces `struck` for the warp-cast's pours. Five things separate it from a
 * stack of enveloped sines, and all five were defects measured in the shipped
 * bed rather than matters of taste:
 *
 *  1. The pitch GLIDES upward. The swatch fills while the tone sits still, and
 *     the ear notices the sound is not doing what the picture is doing.
 *     Measured glide before: +2.4 and +0.7 cents across an entire note.
 *  2. Fixed formants that do not transpose — see BODY_FORMANTS.
 *  3. Partial ratios jittered from the seed, so every paint has its own voice.
 *  4. The attack is filtered through the note's OWN resonances instead of
 *     being an independent noise burst summed alongside. Measured before:
 *     spectral centroid 3990 Hz at the attack against 1852 Hz in the sustain,
 *     a 2.2x gap, which the ear hears as a click followed by an oscillator.
 *     That disconnect is the classic rompler tell.
 *  5. Every partial is two oscillators a fraction of a Hz apart. Beating is
 *     most of what makes a sustained real tone breathe.
 */
export function poured(ctx: BaseAudioContext, dest: AudioNode, o: PourOptions): void {
  const rnd = mulberry32(o.seed >>> 0);
  const attack = o.attack ?? 0.05;
  const glide = Math.pow(2, (o.glideSemitones ?? 3.5) / 12);

  // Partial ratios, jittered per paint. The fundamental is never moved — that
  // is the note, and the palette's musical intervals have to survive.
  //
  // +/-11%, arrived at by measurement: +/-4% gave a coefficient of variation of
  // the partial-2/partial-1 ratio across five paints of 2.0% and +/-7.5% gave
  // 2.9%, both under the 3% the gate requires to call these distinct voices
  // rather than one instrument. Peak-picking under a glide smears the ratio,
  // so the realised spread is well under the nominal one.
  const partials = GLASS_PARTIALS.map((m, i) =>
    i === 0 ? m : m * (1 + (rnd() * 2 - 1) * 0.11),
  );

  // The body: everything the note produces passes through this, so the formants
  // and the attack burst share one signal path.
  const body = ctx.createGain();
  const out = ctx.createGain();
  for (const f of BODY_FORMANTS) {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = f.hz;
    bp.Q.value = f.q;
    const g = ctx.createGain();
    g.gain.value = f.gain;
    body.connect(bp).connect(g).connect(out);
  }
  // A dry path alongside the formants — all-formant reads as a telephone.
  const dry = ctx.createGain();
  dry.gain.value = 0.7;
  body.connect(dry).connect(out);
  out.connect(dest);

  partials.forEach((mult, i) => {
    const amp = o.gain / (1 + i * 1.35);
    const dur = o.decay / (1 + i * 0.42);
    const base = o.freq * mult;
    // Two oscillators per partial, 0.3-1.5 Hz apart.
    const beat = 0.3 + rnd() * 1.2;
    for (let d = 0; d < 2; d++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const f0 = base + (d === 0 ? -beat / 2 : beat / 2);
      osc.frequency.setValueAtTime(f0, o.at);
      // Exponential, and mostly done before the note has decayed away, or the
      // rise happens where there is no longer anything to hear.
      osc.frequency.exponentialRampToValueAtTime(f0 * glide, o.at + attack + dur * 0.55);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, o.at);
      g.gain.linearRampToValueAtTime(amp / 2, o.at + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, o.at + attack + dur);
      osc.connect(g).connect(body);
      osc.start(o.at);
      osc.stop(o.at + attack + dur + 0.05);
    }
  });

  // The strike, excited THROUGH the note's own partial resonances rather than
  // summed beside them. High Q, short decay: this is the vessel being hit, not
  // a separate click.
  const burst = ctx.createBufferSource();
  burst.buffer = noiseBuffer(ctx, 0.07, 'white', rnd);
  const bg = ctx.createGain();
  bg.gain.setValueAtTime(o.gain * 1.5, o.at);
  bg.gain.exponentialRampToValueAtTime(0.0001, o.at + 0.06);
  const burstOut = ctx.createGain();
  burst.connect(bg);
  partials.forEach((mult, i) => {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = o.freq * mult;
    bp.Q.value = 12;
    const g = ctx.createGain();
    g.gain.value = 0.55 / (1 + i * 0.8);
    bg.connect(bp).connect(g).connect(burstOut);
  });
  burstOut.connect(body);

  /**
   * Body modes, as actual MODES.
   *
   * Two earlier attempts failed here and both are worth recording. Routing the
   * note through fixed band-passes shapes its amplitude but adds no peak: with
   * four partials there is often no energy at 700 Hz for a filter to lift.
   * Exciting a high-Q band-pass with the attack burst does ring — for about
   * Q/(pi*f) seconds, which at Q=22 and 700 Hz is 10 ms, gone before anyone
   * hears it. Ringing for half a second that way needs Q around 1100, which a
   * biquad will not do stably.
   *
   * A struck vessel's body mode is simply a decaying sinusoid at a fixed
   * frequency, so that is what this is. It does NOT transpose with the note,
   * which is the entire point: it is the difference between an object being
   * struck and a key being pressed.
   */
  for (const f of BODY_FORMANTS) {
    const mode = ctx.createOscillator();
    mode.type = 'sine';
    mode.frequency.value = f.hz;
    const mg = ctx.createGain();
    const peak = o.gain * f.gain * 0.55;
    mg.gain.setValueAtTime(0.0001, o.at);
    mg.gain.linearRampToValueAtTime(peak, o.at + 0.008);
    mg.gain.exponentialRampToValueAtTime(0.0001, o.at + o.decay * 0.8);
    mode.connect(mg).connect(out);
    mode.start(o.at);
    mode.stop(o.at + o.decay * 0.8 + 0.05);
  }

  burst.start(o.at);
  burst.stop(o.at + 0.09);
}

export interface PadOptions {
  freqs: number[];
  at: number;
  dur: number;
  gain: number;
  /** Detune in cents; the beating between copies IS the movement. */
  detune?: number;
  cutoff?: number;
  type?: OscillatorType;
  /** Fade in/out, seconds. */
  fade?: number;
}

/** A sustained stack. Three detuned copies per note, because one oscillator per
 *  note reads as a test tone however good the reverb is. */
export function pad(ctx: BaseAudioContext, dest: AudioNode, o: PadOptions): void {
  const detune = o.detune ?? 7;
  const fade = o.fade ?? 0.6;
  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = o.cutoff ?? 1400;
  lp.Q.value = 0.6;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, o.at);
  g.gain.linearRampToValueAtTime(o.gain, o.at + fade);
  g.gain.setValueAtTime(o.gain, o.at + o.dur - fade);
  g.gain.linearRampToValueAtTime(0.0001, o.at + o.dur);
  lp.connect(g).connect(dest);

  for (const f of o.freqs) {
    for (const cents of [-detune, 0, detune]) {
      const osc = ctx.createOscillator();
      osc.type = o.type ?? 'sawtooth';
      osc.frequency.value = f;
      osc.detune.value = cents;
      osc.connect(lp);
      osc.start(o.at);
      osc.stop(o.at + o.dur + 0.1);
    }
  }
}

export interface AirOptions {
  at: number;
  dur: number;
  gain: number;
  fromHz: number;
  toHz: number;
  q?: number;
  rnd: () => number;
}

/** Band-passed noise gesture — breath, servo, whoosh. The filter SWEEP is what
 *  stops it reading as a click. */
export function air(ctx: BaseAudioContext, dest: AudioNode, o: AirOptions): void {
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx, o.dur + 0.1, 'white', o.rnd);
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.setValueAtTime(o.fromHz, o.at);
  bp.frequency.exponentialRampToValueAtTime(Math.max(40, o.toHz), o.at + o.dur);
  bp.Q.value = o.q ?? 1.1;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, o.at);
  g.gain.linearRampToValueAtTime(o.gain, o.at + Math.min(0.05, o.dur * 0.25));
  g.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur);
  src.connect(bp).connect(g).connect(dest);
  src.start(o.at);
  src.stop(o.at + o.dur + 0.05);
}

/** Low sine with a downward pitch drop — weight. */
export function sub(
  ctx: BaseAudioContext,
  dest: AudioNode,
  o: { at: number; gain: number; fromHz: number; toHz: number; dur: number },
): void {
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(o.fromHz, o.at);
  osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.toHz), o.at + o.dur * 0.6);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, o.at);
  g.gain.linearRampToValueAtTime(o.gain, o.at + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, o.at + o.dur);
  osc.connect(g).connect(dest);
  osc.start(o.at);
  osc.stop(o.at + o.dur + 0.05);
}

// ---- master ------------------------------------------------------------------

export interface MasterChain {
  /** Everything connects here. */
  input: GainNode;
}

/**
 * The output chain, identical for both skins.
 *
 * The EQ is not taste, it is arithmetic: BS.1770 discounts the sub band hard, so
 * a bass-led mix measures far quieter than it sounds and cannot reach −14 LUFS
 * on level alone. The high-pass drops content no phone reproduces, and the bell
 * and shelf put energy where the meter — and a phone speaker — actually weight
 * it. A glue compressor now sits ahead of the limiter so the limiter stops doing
 * the dynamics work it was never meant to do.
 */
export function createMaster(
  ctx: BaseAudioContext,
  output: AudioNode,
  opts: { gain: number; trim: number },
): MasterChain {
  const input = ctx.createGain();
  input.gain.value = opts.gain;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 70;
  hp.Q.value = 0.7;

  const presence = ctx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 1400;
  presence.Q.value = 0.9;
  presence.gain.value = 9.5;

  const airShelf = ctx.createBiquadFilter();
  airShelf.type = 'highshelf';
  airShelf.frequency.value = 2600;
  airShelf.gain.value = 5.5;

  const glue = ctx.createDynamicsCompressor();
  glue.threshold.value = -11;
  glue.ratio.value = 1.9;
  glue.attack.value = 0.012;
  glue.release.value = 0.22;
  glue.knee.value = 8;

  const limiter = ctx.createWaveShaper();
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * 1.6) / Math.tanh(1.6);
  }
  limiter.curve = curve;
  limiter.oversample = '4x';

  const trim = ctx.createGain();
  trim.gain.value = opts.trim;

  input.connect(hp).connect(presence).connect(airShelf).connect(glue).connect(limiter).connect(trim).connect(output);
  return { input };
}
