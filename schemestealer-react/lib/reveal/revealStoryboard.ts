/**
 * The seam between "what to draw" and "how to encode it".
 *
 * Both engines — the offline WebCodecs renderer and the real-time MediaRecorder
 * fallback — used to hard-code the miniature storyboard: build a spec from
 * masks, prepare mask-gated layers, compose. That is the whole reason the
 * inspiration tab could not export. Inspiration scans return colours and full
 * per-brand recipes but NO masks, so every one of those three steps needed a
 * different implementation while the encoding either side of them was identical.
 *
 * A storyboard is that middle. The engines now take one, defaulting to the
 * miniature bundle, so the encode path — pacing, BT.709, the colr patch, the
 * loudness chain, backpressure, abort handling — has exactly one implementation
 * and cannot drift between the two modes.
 */

import type { RevealSpec } from './revealTimeline';
import type { RevealAudioOptions } from './revealAudio';
import type { RenderRevealOptions } from './renderRevealVideo';

/** Signature shared by `scheduleRevealAudio` and `scheduleWarpAudio`. */
export type RevealAudioScheduler = (
  ctx: BaseAudioContext,
  output: AudioNode,
  spec: RevealSpec,
  t0: number,
  opts?: RevealAudioOptions,
) => void;

/**
 * `R` is the storyboard's own prepared-resources type. The engines never look
 * inside it — they only hand it back to `composeAt` — so each storyboard is free
 * to cache whatever layers it needs.
 */
export interface RevealStoryboard<R = unknown> {
  /** Human-readable name, used in the engine's console diagnostics. */
  readonly mode: RevealMode;
  /** Deterministic spec for this render. Throws a mode-specific error when
   *  there is nothing to show — the message reaches the share modal. */
  buildSpec(opts: RenderRevealOptions, durationMs: number): RevealSpec;
  /** Decode the image and pre-bake every layer that does not change per frame. */
  prepare(opts: RenderRevealOptions, spec: RevealSpec, outputScale: number): Promise<R>;
  /** Draw the frame at elapsed time `t` (ms). */
  composeAt(ctx: CanvasRenderingContext2D, t: number, res: R): void;
  /** Offline audio graph. Defaults to the cogitator bed when omitted. */
  audioSchedule?: RevealAudioScheduler;
}

export type RevealMode = 'miniature' | 'inspiration';
