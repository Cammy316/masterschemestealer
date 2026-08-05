'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import type { ScanResult, Color, PaintRecipe } from '@/lib/types';
import { renderRevealVideo, canExportReveal } from '@/lib/reveal/renderRevealVideo';
import { buildRevealCaptions } from '@/lib/reveal/revealCaptions';
import type { CaptionPreset } from '@/lib/reveal/revealTimeline';
import { analytics } from '@/lib/analytics';

interface ShareModalProps {
  mode: 'miniature' | 'inspiration';
  scan: ScanResult;
  onClose: () => void;
}

const BRAND_LABELS: Record<string, string> = {
  citadel: 'Citadel',
  vallejo: 'Vallejo',
  army_painter: 'Army Painter',
  ak: 'AK',
  pro_acryl: 'Pro Acryl',
  two_thin_coats: 'Two Thin Coats',
};

const PRESETS: { id: CaptionPreset; label: string }[] = [
  { id: 'colours', label: 'COLOUR COUNT' },
  { id: 'machine-spirit', label: 'MACHINE SPIRIT' },
  { id: 'none', label: 'NO CAPTION' },
];

type Phase = 'idle' | 'recording' | 'ready' | 'error';

/** Dominant colour's best-brand recipe drives the outro cascade. Its index comes
 *  back too so the clip can label WHICH colour the recipe is for. */
function pickBestRecipe(colors: Color[]): {
  recipe?: PaintRecipe;
  brand: keyof PaintRecipe;
  label: string;
  topFamily?: string;
  colourIndex: number;
} {
  const sorted = [...colors].sort((a, b) => (b.percentage ?? 0) - (a.percentage ?? 0));
  const dom = sorted.find((c) => c.paintRecipe) ?? colors[0];
  const recipe = dom?.paintRecipe;
  const keys = recipe ? (Object.keys(recipe) as (keyof PaintRecipe)[]) : [];
  const brand = (keys.includes('citadel') ? 'citadel' : keys[0]) ?? 'citadel';
  return {
    recipe,
    brand,
    label: BRAND_LABELS[brand] ?? 'Citadel',
    topFamily: dom?.family,
    colourIndex: dom ? colors.indexOf(dom) : -1,
  };
}

export function ShareModal({ mode, scan, onClose }: ShareModalProps) {
  const accent = mode === 'miniature' ? 'var(--cogitator-green)' : 'var(--warp-purple)';
  const accentDim = mode === 'miniature' ? 'var(--cogitator-green-dim)' : 'var(--warp-purple-dark)';

  const colors = scan.detectedColors;
  const hasMasks = colors.some((c) => c.mask);
  const exportable = hasMasks && !!scan.imageUrl && canExportReveal();

  const [phase, setPhase] = useState<Phase>('idle');
  const [progress, setProgress] = useState(0);
  const [preset, setPreset] = useState<CaptionPreset>('colours');
  const [audio, setAudio] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [video, setVideo] = useState<{
    url: string;
    blob: Blob;
    mime: string;
    engine?: 'webcodecs' | 'mediarecorder';
    width?: number;
    height?: number;
  } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const best = useMemo(() => pickBestRecipe(colors), [colors]);
  const captions = useMemo(
    () => buildRevealCaptions({ colourCount: colors.length, topFamily: best.topFamily, brandLabel: best.label }),
    [colors.length, best.topFamily, best.label],
  );

  // Revoke the blob URL on replace / unmount.
  useEffect(() => {
    return () => {
      if (video?.url) URL.revokeObjectURL(video.url);
      abortRef.current?.abort();
    };
  }, [video?.url]);

  async function handleExport() {
    if (!scan.imageUrl) return;
    setError(null);
    setProgress(0);
    setPhase('recording');
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const result = await renderRevealVideo({
        imageUrl: scan.imageUrl,
        colors,
        maskFrame: scan.maskFrame,
        recipe: best.recipe,
        brand: best.brand,
        brandLabel: best.label,
        recipeColourIndex: best.colourIndex,
        skin: mode === 'miniature' ? 'imperial' : 'warp',
        captionPreset: preset,
        audio,
        onProgress: setProgress,
        signal: controller.signal,
      });
      const url = URL.createObjectURL(result.blob);
      setVideo({
        url,
        blob: result.blob,
        mime: result.mime,
        engine: result.engine,
        width: result.width,
        height: result.height,
      });
      setPhase('ready');
      analytics.trackRevealVideoExported(result.durationMs, result.mime, preset, {
        mimeSupport: result.mimeSupport,
        engine: result.engine,
        width: result.width,
        height: result.height,
        codec: result.codec,
      });
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        setPhase('idle');
        return;
      }
      setError(e instanceof Error ? e.message : 'Export failed');
      setPhase('error');
    }
  }

  function cancelExport() {
    abortRef.current?.abort();
    setPhase('idle');
  }

  function fileExt(mime: string): string {
    return mime.includes('mp4') ? 'mp4' : 'webm';
  }

  async function handleSaveShare() {
    if (!video) return;
    const file = new File([video.blob], `schemestealer-reveal.${fileExt(video.mime)}`, { type: video.mime });
    const canShareFiles =
      typeof navigator !== 'undefined' && !!navigator.canShare && navigator.canShare({ files: [file] });
    if (canShareFiles) {
      try {
        await navigator.share({ files: [file], text: captions.tiktok });
        analytics.trackShareInitiated('social');
        return;
      } catch {
        /* user cancelled or share failed — fall through to download */
      }
    }
    handleDownload();
  }

  function handleDownload() {
    if (!video) return;
    const link = document.createElement('a');
    link.href = video.url;
    link.download = `schemestealer-reveal-${Date.now()}.${fileExt(video.mime)}`;
    link.click();
    analytics.trackShareInitiated('download');
  }

  async function copyCaption(key: keyof typeof captions) {
    try {
      await navigator.clipboard.writeText(captions[key]);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  const ext = video ? fileExt(video.mime) : '';

  return (
    <Dialog open onClose={onClose} className="relative z-[var(--z-modal)]">
      <div className="fixed inset-0 bg-black/85" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className="w-full max-w-lg rounded-lg border-2 p-6 max-h-[90dvh] flex flex-col"
          style={{ background: 'var(--void-black)', borderColor: accent, boxShadow: `0 0 40px ${accent}44` }}
        >
          <div className="flex justify-between items-center mb-5 shrink-0">
            <DialogTitle className="text-2xl font-bold gothic-text" style={{ color: accent }}>
              ◆ BROADCAST PICT-CAST ◆
            </DialogTitle>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-gray-400 hover:text-white text-2xl touch-target flex items-center justify-center"
            >
              ×
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto space-y-5">
            {!exportable && (
              <p className="text-sm cyber-text" style={{ color: accentDim }}>
                {hasMasks
                  ? 'This browser cannot record video. Try Chrome or Safari on a recent device.'
                  : 'Scan a miniature to broadcast a pict-cast of the machine spirit reading your model.'}
              </p>
            )}

            {exportable && phase === 'idle' && (
              <>
                <div>
                  <h3 className="text-xs cyber-text mb-2" style={{ color: accentDim }}>
                    ON-SCREEN CAPTION
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPreset(p.id)}
                        className="px-2 py-3 rounded font-bold text-xs tech-text touch-target"
                        style={
                          preset === p.id
                            ? { background: accent, color: '#05070a' }
                            : { background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }
                        }
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <span className="text-sm tech-text text-white">Cogitator audio bed</span>
                  <input
                    type="checkbox"
                    checked={audio}
                    onChange={(e) => setAudio(e.target.checked)}
                    className="w-5 h-5 accent-current"
                    style={{ color: accent }}
                  />
                </label>

                <button
                  onClick={handleExport}
                  className="w-full py-4 rounded-lg font-bold text-base cyber-text touch-target"
                  style={{ background: accent, color: '#05070a', boxShadow: `0 0 24px ${accent}66` }}
                >
                  ◇ EXPORT PICT-CAST ◇
                </button>
                <p className="text-xs cyber-text text-center" style={{ color: accentDim }}>
                  ~13s recording · 1080×1920 · records in real time
                </p>
              </>
            )}

            {exportable && phase === 'recording' && (
              <div className="flex flex-col items-center gap-4 py-6">
                <ProgressRing progress={progress} colour={accent} />
                <span className="cyber-text text-sm" style={{ color: accent }}>
                  TRANSMITTING… {Math.round(progress * 100)}%
                </span>
                <button
                  onClick={cancelExport}
                  className="px-6 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold touch-target"
                >
                  Cancel
                </button>
              </div>
            )}

            {exportable && phase === 'error' && (
              <div className="space-y-3">
                <p className="text-sm text-red-400 tech-text">{error}</p>
                <button
                  onClick={() => setPhase('idle')}
                  className="w-full py-3 rounded-lg font-bold text-sm"
                  style={{ background: accent, color: '#05070a' }}
                >
                  Try again
                </button>
              </div>
            )}

            {exportable && phase === 'ready' && video && (
              <div className="space-y-4">
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={video.url}
                  className="w-full rounded-lg border-2"
                  style={{ borderColor: accent, aspectRatio: '9 / 16', background: '#000' }}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <p className="text-xs cyber-text text-center" style={{ color: accentDim }}>
                  PICT-CAST READY · {ext.toUpperCase()}
                  {video.width ? ` · ${video.width}×${video.height}` : ''}
                </p>
                {/* Honest about the degraded path: this browser has no WebCodecs,
                    so the clip was captured in real time at reduced size. */}
                {video.engine === 'mediarecorder' && (
                  <p className="text-xs tech-text text-center" style={{ color: 'var(--text-secondary)' }}>
                    Your browser can&apos;t encode video directly, so this was captured live at reduced
                    size. Chrome or Safari will export a full-resolution MP4.
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveShare}
                    className="flex-1 py-3 rounded-lg font-bold text-sm cyber-text touch-target"
                    style={{ background: accent, color: '#05070a' }}
                  >
                    Save &amp; share
                  </button>
                  <button
                    onClick={handleDownload}
                    className="px-5 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-sm touch-target"
                  >
                    Download
                  </button>
                </div>

                <div className="border-t pt-4 space-y-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <h3 className="text-xs cyber-text" style={{ color: accentDim }}>
                    COPY A CAPTION
                  </h3>
                  {(['tiktok', 'reels', 'shorts'] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => copyCaption(k)}
                      className="w-full text-left px-3 py-2 rounded border text-xs tech-text touch-target"
                      style={{ borderColor: 'rgba(255,255,255,0.12)', color: 'var(--text-secondary)' }}
                    >
                      <span style={{ color: accent }}>{copied === k ? '✓ COPIED' : k.toUpperCase()}</span>{' '}
                      — tap to copy
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (video.url) URL.revokeObjectURL(video.url);
                    setVideo(null);
                    setPhase('idle');
                  }}
                  className="w-full py-2 text-sm text-gray-400 hover:text-white"
                >
                  Make another
                </button>
              </div>
            )}

            {/* Secondary: quick link shares (not slop — real intents). */}
            <div className="border-t pt-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
              <h3 className="text-xs cyber-text mb-2" style={{ color: accentDim }}>
                OR SHARE A LINK
              </h3>
              <div className="flex gap-2">
                {(['twitter', 'reddit', 'facebook'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => shareLink(p)}
                    className="flex-1 px-2 py-2 rounded border border-gray-700 hover:border-gray-500 text-white text-xs font-semibold capitalize touch-target"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

function shareLink(platform: 'twitter' | 'reddit' | 'facebook') {
  const text = 'I scanned my mini and got the exact paint recipe with SchemeStealer';
  const url = typeof window !== 'undefined' ? window.location.href : 'https://schemestealer.com';
  const urls: Record<string, string> = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    reddit: `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };
  window.open(urls[platform], '_blank', 'width=600,height=400');
}

function ProgressRing({ progress, colour }: { progress: number; colour: string }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
      <circle
        cx="60"
        cy="60"
        r={r}
        fill="none"
        stroke={colour}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - progress)}
        style={{ filter: `drop-shadow(0 0 6px ${colour})`, transition: 'stroke-dashoffset 0.1s linear' }}
      />
    </svg>
  );
}
