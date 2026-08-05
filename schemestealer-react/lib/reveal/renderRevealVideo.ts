/**
 * Engine A — records the scan-reveal to a vertical video Blob.
 *
 * Drives the deterministic timeline in real time onto an offscreen 1080×1920
 * canvas, captures it via captureStream + MediaRecorder, and (Phase 3) mixes a
 * synthesised audio bed. Format prefers MP4 (avc1) where supported, else WebM.
 */

import {
  applyOutputScale,
  composeReveal,
  prepareResources,
  buildRevealSpec,
  outputSize,
  recipeSteps,
} from './revealCompose';
import { frameState, DEFAULT_DURATION_MS, type CaptionPreset } from './revealTimeline';
import type { Color, MaskFrame, PaintRecipe } from '../types';
import type { RevealSkin } from './revealLayers';
import { createRevealAudioBed, type RevealAudioBed } from './revealAudio';

/**
 * MP4 first, and with FULL codec profile strings — Chrome's isTypeSupported
 * rejects the bare `avc1` shorthand, which is why the first real exports all
 * landed on VP8 WebM: a file Instagram refuses on upload and iOS won't play.
 * The AAC pairings serve Safari (which encodes AAC); the Opus pairings serve
 * Chrome (which does not encode AAC). WebM is the genuine last resort.
 */
const MIME_CANDIDATES = [
  'video/mp4;codecs="avc1.640028,mp4a.40.2"', // H.264 High + AAC
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"', // H.264 Baseline + AAC
  'video/mp4;codecs="avc1.640028,opus"', // H.264 High + Opus
  'video/mp4;codecs="avc1.42E01E,opus"', // H.264 Baseline + Opus
  'video/mp4;codecs=avc1',
  'video/mp4',
  'video/webm;codecs="vp9,opus"',
  'video/webm;codecs=vp9',
  'video/webm',
];

function defaultIsSupported(m: string): boolean {
  return typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(m);
}

/** Which candidates this browser claims to support — logged and attached to the
 *  export analytics, so real devices tell us what they can record instead of us
 *  guessing codec strings a third time. */
export function videoMimeSupport(
  isSupported: (m: string) => boolean = defaultIsSupported,
): Record<string, boolean> {
  const map: Record<string, boolean> = {};
  for (const m of MIME_CANDIDATES) map[m] = isSupported(m);
  return map;
}

/** Preferred recordable MIME — MP4 first, WebM fallback. `isSupported` is
 *  injectable for tests. Returns null when nothing is recordable. */
export function pickVideoMime(isSupported: (m: string) => boolean = defaultIsSupported): string | null {
  for (const m of MIME_CANDIDATES) if (isSupported(m)) return m;
  return null;
}

/** Whether this browser can export at all (button gating). Either pipeline will
 *  do — WebCodecs is preferred, MediaRecorder is the fallback. */
export function canExportReveal(): boolean {
  if (typeof HTMLCanvasElement === 'undefined') return false;
  if (typeof VideoEncoder !== 'undefined') return true;
  return (
    typeof MediaRecorder !== 'undefined' &&
    typeof HTMLCanvasElement.prototype.captureStream === 'function' &&
    pickVideoMime() !== null
  );
}

export { DEFAULT_DURATION_MS } from './revealTimeline';

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
  /** Which pipeline produced the file. `mediarecorder` is the degraded path. */
  engine?: 'webcodecs' | 'mediarecorder';
  width?: number;
  height?: number;
  codec?: string;
  frameCount?: number;
  /** isTypeSupported result per candidate — export telemetry (see videoMimeSupport). */
  mimeSupport?: Record<string, boolean>;
}

/**
 * Output scale for the MediaRecorder fallback: 720×1280 instead of 1080×1920.
 * That path is stuck with a real-time software encoder, and 2.25× fewer pixels
 * is the difference between the 5 fps measured on Firefox Android and something
 * watchable. Still within every platform's accepted vertical spec.
 */
const FALLBACK_OUTPUT_SCALE = 2 / 3;
/** Fewer frames to encode buys the fallback encoder more time per frame. */
const FALLBACK_FPS = 24;

/**
 * Render the reveal, preferring the offline WebCodecs pipeline.
 *
 * MediaRecorder is a real-time recorder that drops frames it cannot encode in
 * time, so it can only ever be the fallback — on browsers with no WebCodecs at
 * all (notably Firefox Android).
 */
export async function renderRevealVideo(opts: RenderRevealOptions): Promise<RenderRevealResult> {
  // Dynamic: the muxer + encoder module only loads when someone actually taps
  // export, so it never lands in the initial bundle of a mobile-first app.
  const offline = await import('./renderRevealOffline');
  const fullSize = outputSize(1);
  const plan = await offline.planOfflineRender(fullSize.width, fullSize.height);
  if (plan) {
    console.info('[pict-cast] offline render:', plan.container, plan.video, 'audio', plan.audio ?? 'none');
    return offline.renderRevealOffline({ ...opts, plan });
  }
  console.warn('[pict-cast] no WebCodecs encoder — falling back to real-time MediaRecorder at 720p');
  return recordRevealRealtime(opts);
}

/** Legacy real-time path. Kept only for browsers without WebCodecs. */
export async function recordRevealRealtime(opts: RenderRevealOptions): Promise<RenderRevealResult> {
  const mime = pickVideoMime();
  if (!mime) throw new Error('This browser cannot record video (MediaRecorder unavailable).');
  const mimeSupport = videoMimeSupport();
  // Deliberately loud: a device export attaching this log is the diagnostic.
  console.info('[pict-cast] recording as', mime, 'support map:', mimeSupport);

  const durationMs = opts.durationMs ?? DEFAULT_DURATION_MS;
  const fps = opts.fps ?? FALLBACK_FPS;
  const outputScale = FALLBACK_OUTPUT_SCALE;
  const phys = outputSize(outputScale);

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

  const res = await prepareResources(opts.imageUrl, opts.colors, opts.maskFrame, spec, outputScale);

  const canvas = document.createElement('canvas');
  canvas.width = phys.width;
  canvas.height = phys.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('2D canvas unavailable');

  const compose = (t: number) => {
    applyOutputScale(ctx, outputScale);
    composeReveal(ctx, frameState(t, spec), res);
  };

  // Prime frame 0 so capture never starts on a blank canvas.
  compose(0);

  const videoStream = canvas.captureStream(fps);

  // Audio bed (quiet cogitator hum + sweep whine + reveal chimes + outro stamp).
  let audioBed: RevealAudioBed | null = null;
  const tracks: MediaStreamTrack[] = [...videoStream.getVideoTracks()];
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

  await new Promise<void>((resolve) => {
    const frameMs = 1000 / fps;
    // Draw on rAF so paints land on compositor frame boundaries; a timer-driven
    // loop free-runs against captureStream's own clock and the beat between the
    // two shows up as judder. The gate keeps us near `fps` on a 120 Hz display
    // instead of drawing four times per captured frame.
    let rafId = 0;
    let watchdog = 0;
    let lastDraw = -Infinity;
    let finished = false;

    const stop = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(rafId);
      clearInterval(watchdog);
      compose(durationMs);
      opts.onProgress?.(1);
      resolve();
    };

    const draw = () => {
      if (finished) return;
      const now = performance.now();
      const t = now - startedAt;
      if (opts.signal?.aborted || t >= durationMs + LOOP_HOLD_MS) return stop();
      if (now - lastDraw < frameMs * 0.8) return;
      lastDraw = now;
      // Past the storyboard end, hold the final (loop-target) frame so the
      // completed dissolve is actually captured.
      compose(Math.min(t, durationMs));
      opts.onProgress?.(Math.min(1, t / durationMs));
    };

    const tick = () => {
      draw();
      if (!finished) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    // rAF is throttled or suspended in a backgrounded tab (and under headless),
    // which would stall the recording forever — keep a timer as the floor.
    watchdog = window.setInterval(() => {
      if (performance.now() - lastDraw >= frameMs * 2) draw();
    }, frameMs);
  });

  recorder.stop();
  audioBed?.stop();
  videoStream.getTracks().forEach((tr) => tr.stop());

  const blob = await done;
  if (opts.signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
  return {
    blob,
    mime,
    durationMs,
    mimeSupport,
    engine: 'mediarecorder',
    width: phys.width,
    height: phys.height,
    codec: mime,
  };
}
