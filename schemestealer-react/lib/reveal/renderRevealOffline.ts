/**
 * Engine A — OFFLINE renderer. The pict-cast's real engine.
 *
 * MediaRecorder cannot produce this clip. It is a real-time, wall-clock recorder:
 * if encoding a frame takes too long it drops the frame and moves on (there is a
 * standing W3C request for frame-by-frame recording precisely because the API
 * cannot do it — mediacapture-record#213). On a phone, software VP8 encoding of a
 * 1080×1920 frame is itself slower than the frame budget, so measured device
 * exports came out at 5 fps with half-second stalls, and no amount of compose
 * optimisation could fix that.
 *
 * Here there is no clock. Each frame is composed at its exact timeline position
 * and handed to a WebCodecs encoder with an explicit timestamp, so a slow frame
 * makes the export take longer and can never make it stutter. The result is
 * constant-frame-rate by construction, carries real duration metadata, and is
 * H.264/MP4 wherever the platform can encode it — using the hardware encoder.
 */

import {
  AudioBufferSource,
  BufferTarget,
  Mp4OutputFormat,
  Output,
  QUALITY_HIGH,
  VideoSample,
  VideoSampleSource,
  WebMOutputFormat,
  getFirstEncodableAudioCodec,
  getFirstEncodableVideoCodec,
  type AudioCodec,
  type VideoCodec,
} from 'mediabunny';

import { applyOutputScale, outputSize, MINI_STORYBOARD, CANVAS_W, CANVAS_H } from './revealCompose';
import { DEFAULT_DURATION_MS, type RevealSpec } from './revealTimeline';
import { scheduleRevealAudio } from './revealAudio';
import type { RevealStoryboard } from './revealStoryboard';
import { patchColrToBt709, type ColrPatchResult } from './mp4ColrPatch';
import type { RenderRevealOptions, RenderRevealResult } from './renderRevealVideo';

/**
 * Every frame is tagged BT.709 explicitly.
 *
 * We compose sRGB pixels on a canvas, which is BT.709 primaries and transfer —
 * but nothing in the pipeline SAID so, and the tag was left to whatever encoder
 * the device picked. Measured on real exports: desktop shipped
 * `smpte170m,smpte170m,smpte170m` and mobile `bt470bg,smpte170m,smpte170m` —
 * BT.601, i.e. SD/PAL tagging on a 1080×1920 file. Players and platform
 * transcoders assume BT.709 for HD, so the same frame decoded under the wrong
 * matrix drifts by up to ΔE 4.9 — a full band — while the card claims ΔE 0.8.
 * A colour-accuracy product cannot ship a file that contradicts its own measurement.
 *
 * Note this reproduces ONLY with a hardware encoder: headless Chrome uses the
 * software encoder and already tagged BT.709, so the test suite could not catch
 * it. Device export is the real verification.
 */
const BT709 = {
  primaries: 'bt709',
  transfer: 'bt709',
  matrix: 'bt709',
  fullRange: false,
} as const;

/** MP4 is the goal (Instagram's uploader refuses WebM and iOS won't play it), so
 *  H.264 is tried first; WebM is a fallback that still gets perfect pacing.
 *  The WebM fallback carries the same per-sample tag; Matroska stores colour in
 *  its Colour element, which mediabunny writes from the same sample metadata. */
const VIDEO_LADDER: VideoCodec[] = ['avc', 'vp9', 'vp8'];
const AUDIO_LADDER: AudioCodec[] = ['aac', 'opus'];

export interface OfflinePlan {
  video: VideoCodec;
  audio: AudioCodec | null;
  container: 'mp4' | 'webm';
  mimeType: string;
}

/** MP4 can carry H.264/AAC (and Opus); VP8/VP9 have to go in WebM. */
function containerFor(video: VideoCodec): 'mp4' | 'webm' {
  return video === 'avc' ? 'mp4' : 'webm';
}

/**
 * What this browser can actually encode at the target size.
 *
 * mediabunny's probes run a real encoder configuration rather than trusting
 * `VideoEncoder.isConfigSupported()`, which matters: Firefox reports H.264 as
 * supported and then throws on `configure()`.
 */
export async function planOfflineRender(
  width: number,
  height: number,
): Promise<OfflinePlan | null> {
  if (typeof VideoEncoder === 'undefined') return null;
  let video: VideoCodec | null = null;
  try {
    video = await getFirstEncodableVideoCodec(VIDEO_LADDER, { width, height });
  } catch {
    return null;
  }
  if (!video) return null;

  const container = containerFor(video);
  // WebM cannot carry AAC; MP4 takes either.
  const audioLadder = container === 'webm' ? (['opus'] as AudioCodec[]) : AUDIO_LADDER;
  let audio: AudioCodec | null = null;
  try {
    audio = await getFirstEncodableAudioCodec(audioLadder, { numberOfChannels: 2, sampleRate: 48000 });
  } catch {
    audio = null; // audio is a bonus; never lose the export over it
  }

  return {
    video,
    audio,
    container,
    mimeType: container === 'mp4' ? 'video/mp4' : 'video/webm',
  };
}

/** Frames are emitted at exact multiples of the frame interval. The LAST frame
 *  sits one interval BEFORE the end, because frame N would be frame 0 again —
 *  that wrap is the loop seam, so rendering it would duplicate a frame. */
export function frameTimestamps(durationMs: number, fps: number): number[] {
  const count = Math.max(1, Math.round((durationMs / 1000) * fps));
  const step = 1000 / fps;
  return Array.from({ length: count }, (_, i) => i * step);
}

/** Render the synthesised bed into an AudioBuffer, reusing the same graph the
 *  live path schedules — no second source of truth for the sound. */
async function renderAudioBuffer(
  spec: RevealSpec,
  schedule: typeof scheduleRevealAudio,
): Promise<AudioBuffer | null> {
  try {
    const Ctor =
      window.OfflineAudioContext ||
      (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext })
        .webkitOfflineAudioContext;
    if (!Ctor) return null;
    const sampleRate = 48000;
    const ctx = new Ctor(2, Math.ceil((spec.durationMs / 1000) * sampleRate), sampleRate);
    schedule(ctx, ctx.destination, spec, 0);
    return await ctx.startRendering();
  } catch {
    return null;
  }
}

export async function renderRevealOffline(
  opts: RenderRevealOptions & {
    plan: OfflinePlan;
    outputScale?: number;
    /** Which storyboard to draw. Defaults to the miniature bundle so every
     *  existing caller is unaffected. */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    storyboard?: RevealStoryboard<any>;
  },
): Promise<RenderRevealResult> {
  const storyboard = opts.storyboard ?? MINI_STORYBOARD;
  const durationMs = opts.durationMs ?? DEFAULT_DURATION_MS;
  const fps = opts.fps ?? 30;
  const outputScale = opts.outputScale ?? 1;
  const { width, height } = outputSize(outputScale);

  // Fonts must be loaded or canvas text falls back to a system face.
  await (document.fonts?.ready ?? Promise.resolve());

  const spec = storyboard.buildSpec(opts, durationMs);
  const res = await storyboard.prepare(opts, spec, outputScale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('2D canvas unavailable');

  const output = new Output({
    format:
      opts.plan.container === 'mp4'
        ? new Mp4OutputFormat({ fastStart: 'in-memory' })
        : new WebMOutputFormat(),
    target: new BufferTarget(),
  });

  // VideoSampleSource, not CanvasSource — see BT709 below. CanvasSource builds
  // the sample internally and gives us no way to state a colour space.
  const videoSource = new VideoSampleSource({
    codec: opts.plan.video,
    quality: QUALITY_HIGH,
    keyFrameInterval: 2,
  });
  output.addVideoTrack(videoSource, { frameRate: fps });

  const audioBuffer =
    opts.audio === false || !opts.plan.audio
      ? null
      : await renderAudioBuffer(spec, storyboard.audioSchedule ?? scheduleRevealAudio);
  const audioSource =
    audioBuffer && opts.plan.audio
      ? new AudioBufferSource({ codec: opts.plan.audio, quality: QUALITY_HIGH })
      : null;
  if (audioSource) output.addAudioTrack(audioSource);

  await output.start();

  const stamps = frameTimestamps(durationMs, fps);
  const frameDur = 1 / fps;
  try {
    for (let i = 0; i < stamps.length; i++) {
      if (opts.signal?.aborted) throw new DOMException('Export cancelled', 'AbortError');
      applyOutputScale(ctx, outputScale);
      storyboard.composeAt(ctx, stamps[i], res);
      const sample = new VideoSample(canvas, {
        timestamp: stamps[i] / 1000,
        duration: frameDur,
        colorSpace: BT709,
      });
      try {
        // Awaiting respects encoder + writer backpressure; an unbounded queue is a
        // documented way to crash the encoder.
        await videoSource.add(sample);
      } finally {
        sample.close(); // un-closed samples leak GPU memory
      }
      opts.onProgress?.((i + 1) / (stamps.length + 1));
      // Yield periodically so the progress ring paints and the tab stays alive.
      if (i % 8 === 7) await new Promise((r) => setTimeout(r, 0));
    }
    if (audioSource && audioBuffer) await audioSource.add(audioBuffer);
    await output.finalize();
  } catch (err) {
    try {
      await output.cancel();
    } catch {
      /* already torn down */
    }
    throw err;
  }

  const buffer = (output.target as BufferTarget).buffer;
  if (!buffer) throw new Error('Encoder produced no output.');

  // Force BT.709 in the muxed bytes. Tagging the input VideoSample was not
  // enough: mediabunny writes the `colr` atom from decoderConfig.colorSpace —
  // the ENCODER'S output metadata — and a hardware encoder reports BT.601,
  // which shipped on every device export. `previous` is logged because it tells
  // us what the device's encoder actually claimed, which nothing else does.
  let colr: ColrPatchResult | null = null;
  if (opts.plan.container === 'mp4') {
    colr = patchColrToBt709(buffer);
    console.info('[pict-cast] colr atoms patched:', colr.patched, 'was:', JSON.stringify(colr.previous));
  }

  opts.onProgress?.(1);

  return {
    blob: new Blob([buffer], { type: opts.plan.mimeType }),
    mime: opts.plan.mimeType,
    durationMs,
    engine: 'webcodecs',
    colrPatched: colr?.patched ?? 0,
    colrPrevious: colr?.previous ?? [],
    width,
    height,
    codec: opts.plan.video,
    frameCount: stamps.length,
  };
}

export const OFFLINE_CANVAS_LOGICAL = { width: CANVAS_W, height: CANVAS_H };

// Dev-only hook. Unlike MediaRecorder, the offline pipeline has no real-time
// requirement, so it CAN be driven end-to-end in headless Chromium — the whole
// encode path is testable instead of device-only.
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__revealOfflineDebug = {
    planOfflineRender,
    renderRevealOffline,
    frameTimestamps,
  };
}
