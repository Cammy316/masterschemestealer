/**
 * Engine A — records the scan-reveal to a vertical video Blob.
 *
 * Drives the deterministic timeline in real time onto an offscreen 1080×1920
 * canvas, captures it via captureStream + MediaRecorder, and (Phase 3) mixes a
 * synthesised audio bed. Format prefers MP4 (avc1) where supported, else WebM.
 */

import {
  composeReveal,
  prepareResources,
  buildRevealSpec,
  recipeSteps,
  CANVAS_W,
  CANVAS_H,
} from './revealCompose';
import { frameState, type CaptionPreset } from './revealTimeline';
import type { Color, MaskFrame, PaintRecipe } from '../types';
import type { RevealSkin } from './revealLayers';
import { createRevealAudioBed, type RevealAudioBed } from './revealAudio';

/**
 * MP4 first, and with FULL codec profile strings — Chrome's isTypeSupported
 * rejects the bare `avc1` shorthand, which is why the first real exports all
 * landed on VP8 WebM: a file Instagram refuses on upload and iOS won't play.
 * WebM is the genuine last resort, not the default.
 */
const MIME_CANDIDATES = [
  'video/mp4;codecs="avc1.640028,mp4a.40.2"', // H.264 High
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"', // H.264 Baseline
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs="vp9,opus"',
  'video/webm;codecs=vp9',
  'video/webm',
];

function defaultIsSupported(m: string): boolean {
  return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m);
}

/** Preferred recordable MIME — MP4 first, WebM fallback. `isSupported` is
 *  injectable for tests. Returns null when nothing is recordable. */
export function pickVideoMime(isSupported: (m: string) => boolean = defaultIsSupported): string | null {
  for (const m of MIME_CANDIDATES) if (isSupported(m)) return m;
  return null;
}

/** Whether this browser can export at all (button gating). */
export function canExportReveal(): boolean {
  return (
    typeof MediaRecorder !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof HTMLCanvasElement.prototype.captureStream === 'function' &&
    pickVideoMime() !== null
  );
}

export const DEFAULT_DURATION_MS = 13000;

/** Extra real time spent holding the completed final frame before stopping the
 *  recorder. Without it the record ended mid-dissolve — the loop seam the whole
 *  storyboard is built around never made it onto the tape. */
const LOOP_HOLD_MS = 320;

export interface RenderRevealOptions {
  imageUrl: string;
  colors: Color[];
  maskFrame?: MaskFrame;
  recipe?: PaintRecipe;
  /** best-brand key into PaintRecipe (e.g. 'citadel') */
  brand: keyof PaintRecipe;
  brandLabel: string;
  /** Index into `colors` of the colour the recipe describes, so the outro can
   *  name it instead of leaving the viewer guessing which region it's for. */
  recipeColourIndex?: number;
  skin: RevealSkin;
  captionPreset: CaptionPreset;
  durationMs?: number;
  audio?: boolean;
  fps?: number;
  onProgress?: (p: number) => void;
  signal?: AbortSignal;
}

export interface RenderRevealResult {
  blob: Blob;
  mime: string;
  durationMs: number;
}

export async function renderRevealVideo(opts: RenderRevealOptions): Promise<RenderRevealResult> {
  const mime = pickVideoMime();
  if (!mime) throw new Error('This browser cannot record video (MediaRecorder unavailable).');

  const durationMs = opts.durationMs ?? DEFAULT_DURATION_MS;
  const fps = opts.fps ?? 30;

  // Fonts must be loaded or canvas text falls back to a system face.
  await (document.fonts?.ready ?? Promise.resolve());

  const steps = recipeSteps(opts.recipe, opts.brand);
  const spec = buildRevealSpec(
    opts.colors,
    steps,
    opts.brandLabel,
    opts.skin,
    opts.captionPreset,
    durationMs,
    opts.recipeColourIndex ?? -1,
  );
  if (spec.regions.length === 0) throw new Error('No mask regions to reveal.');

  const res = await prepareResources(opts.imageUrl, opts.colors, opts.maskFrame, spec);

  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');

  // Prime frame 0 so capture never starts on a blank canvas.
  composeReveal(ctx, frameState(0, spec), res);

  const videoStream = canvas.captureStream(fps);

  // Audio bed (quiet cogitator hum + sweep whine + reveal chimes + outro stamp).
  let audioBed: RevealAudioBed | null = null;
  const tracks = [...videoStream.getVideoTracks()];
  if (opts.audio !== false) {
    try {
      audioBed = createRevealAudioBed(spec);
      tracks.push(...audioBed.stream.getAudioTracks());
    } catch {
      audioBed = null; // audio is a bonus; never fail the export over it
    }
  }
  const stream = new MediaStream(tracks);

  const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  const done = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mime }));
    recorder.onerror = () => reject(new Error('MediaRecorder error'));
  });

  recorder.start();
  audioBed?.start();
  const startedAt = performance.now();

  // Drive the compose loop off a timer, not rAF: rAF pauses when the tab is
  // backgrounded (or under headless), which would stall a 13 s record forever.
  // captureStream(fps) samples the canvas on its own clock, so a timer draw is
  // enough. Wall-clock `t` keeps the storyboard on time regardless of tick jitter.
  await new Promise<void>((resolve) => {
    const frameMs = 1000 / fps;
    const id = setInterval(() => {
      const t = performance.now() - startedAt;
      if (opts.signal?.aborted || t >= durationMs + LOOP_HOLD_MS) {
        clearInterval(id);
        composeReveal(ctx, frameState(durationMs, spec), res);
        opts.onProgress?.(1);
        return resolve();
      }
      // Past the storyboard end, hold the final (loop-target) frame so the
      // completed dissolve is actually captured.
      composeReveal(ctx, frameState(Math.min(t, durationMs), spec), res);
      opts.onProgress?.(Math.min(1, t / durationMs));
    }, frameMs);
  });

  recorder.stop();
  audioBed?.stop();
  videoStream.getTracks().forEach((tr) => tr.stop());

  const blob = await done;
  if (opts.signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
  return { blob, mime, durationMs };
}
