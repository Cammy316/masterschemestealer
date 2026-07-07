/**
 * AuspexReveal — Tactical map + per-colour region reveal
 *
 * Two modes:
 * - "map": full tactical readout — the model lit out of a dimmed frame,
 *   every detected region rimmed in its own colour, numbered DOM chips
 *   (staggered pop-in) marking each region's interior point.
 * - "single": per-colour reveal — the frame dims and ONLY that colour's
 *   region shows the user's real paint at full brightness, rimmed with a
 *   pulsing glow in the colour's own hue.
 *
 * Compositing contract (matches the backend spatial contract):
 * - `color.mask` is an RGBA PNG whose ALPHA channel is the region, at
 *   analysis resolution, covering only the alpha-bbox CROP of the frame.
 * - `maskFrame` carries the analysis dims + cropX/Y/W/H + frameW/frameH so
 *   the mask is drawn INTO its crop rectangle, never stretched over the
 *   whole photo (that stretch + an opaque mask caused the production
 *   whole-image tint).
 * - `color.position` is normalised to the FULL uploaded frame.
 *
 * Perf discipline: layers are pre-rendered once per image/mask change; the
 * single-mode pulse animates via rAF re-composing two cached layers only.
 */

'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Color, MaskFrame } from '@/lib/types';
import { maskDestRect } from '@/lib/maskGeometry';

interface AuspexRevealProps {
  /** "map" = tactical readout (top of results), "single" = per-colour reveal */
  mode: 'map' | 'single';
  /** The user's uploaded miniature image (object URL) */
  imageUrl?: string;
  /** All detected colours with mask data */
  colors: Color[];
  /** Spatial geometry from the backend's mask_frame */
  maskFrame?: MaskFrame;
  /** For mode="single": which colour index to highlight */
  activeIndex?: number;
  /** Callback when a numbered chip is tapped in map mode */
  onChipClick?: (index: number) => void;
}

/** Decode a base64 PNG into an ImageBitmap */
async function decodeMask(base64: string): Promise<ImageBitmap | null> {
  try {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    const blob = new Blob([bytes], { type: 'image/png' });
    return await createImageBitmap(blob);
  } catch {
    return null;
  }
}

const PULSE_DURATION_MS = 2600;

export function AuspexReveal({
  mode,
  imageUrl,
  colors,
  maskFrame,
  activeIndex = 0,
  onChipClick,
}: AuspexRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [isRevealed, setIsRevealed] = useState(mode === 'map');
  const animFrameRef = useRef(0);

  // Decoded masks + pre-rendered layers (rebuilt when image/masks change)
  const masksRef = useRef<(ImageBitmap | null)[]>([]);
  const masksDecodedRef = useRef(false);
  const baseLayerRef = useRef<HTMLCanvasElement | null>(null);
  const regionLayersRef = useRef<(HTMLCanvasElement | null)[]>([]);

  /** Dimmed base image + scanline texture, rendered once. */
  const buildBaseLayer = useCallback((img: HTMLImageElement, w: number, h: number) => {
    const layer = document.createElement('canvas');
    layer.width = w;
    layer.height = h;
    const ctx = layer.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = 'rgba(5, 12, 10, 0.78)';
    ctx.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
      ctx.fillRect(0, y, w, 1);
    }
    return layer;
  }, []);

  /** The user's REAL image clipped to one region (alpha-keyed mask drawn
   *  into its crop rect). No tinting — the whole point is showing the
   *  actual paint. */
  const buildRegionLayer = useCallback(
    (img: HTMLImageElement, mask: ImageBitmap, w: number, h: number) => {
      const dst = maskDestRect(maskFrame, w, h);
      const layer = document.createElement('canvas');
      layer.width = w;
      layer.height = h;
      const ctx = layer.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(img, 0, 0);
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(mask, 0, 0, mask.width, mask.height, dst.x, dst.y, dst.w, dst.h);
      return layer;
    },
    [maskFrame]
  );

  const prepareLayers = useCallback(() => {
    const img = imgRef.current;
    if (!img || !img.complete || img.naturalWidth === 0) return false;
    if (!masksDecodedRef.current) return false;
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    baseLayerRef.current = buildBaseLayer(img, w, h);
    regionLayersRef.current = masksRef.current.map((mask) =>
      mask ? buildRegionLayer(img, mask, w, h) : null
    );
    return true;
  }, [buildBaseLayer, buildRegionLayer]);

  /** Compose one frame: dimmed base, revealed region(s) with rim glow,
   *  crosshair (single mode) and corner brackets. */
  const composeFrame = useCallback(
    (glowBlur: number) => {
      const canvas = canvasRef.current;
      const img = imgRef.current;
      const base = baseLayerRef.current;
      if (!canvas || !img || !base) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (canvas.width !== w) canvas.width = w;
      if (canvas.height !== h) canvas.height = h;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(base, 0, 0);

      if (mode === 'map') {
        // Every region revealed at full brightness with its own colour rim —
        // the model emerges from the dark readout, regions distinguishable
        // by their rims and the numbered chips.
        regionLayersRef.current.forEach((layer, i) => {
          const color = colors[i];
          if (!layer || !color) return;
          ctx.save();
          ctx.shadowColor = color.hex;
          ctx.shadowBlur = Math.max(8, w * 0.012);
          ctx.drawImage(layer, 0, 0);
          ctx.restore();
        });
      } else {
        const layer = regionLayersRef.current[activeIndex];
        const color = colors[activeIndex];
        if (layer && color) {
          // Wide soft halo first, then the region itself with a tight rim.
          ctx.save();
          ctx.globalAlpha = 0.55;
          ctx.shadowColor = color.hex;
          ctx.shadowBlur = glowBlur * 2.2;
          ctx.drawImage(layer, 0, 0);
          ctx.restore();
          ctx.save();
          ctx.shadowColor = color.hex;
          ctx.shadowBlur = glowBlur;
          ctx.drawImage(layer, 0, 0);
          ctx.restore();
        }

        // Crosshair at the region's marker point (full-frame normalised)
        const pos = color?.position;
        if (pos) {
          const px = pos.x * w;
          const py = pos.y * h;
          const size = Math.max(20, w * 0.04);
          const half = size / 2;
          ctx.save();
          ctx.translate(px, py);
          ctx.strokeStyle = '#00ff41';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, half, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#00ff41';
          ctx.beginPath();
          ctx.arc(0, 0, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(0, -half); ctx.lineTo(0, -half + 6);
          ctx.moveTo(0, half); ctx.lineTo(0, half - 6);
          ctx.moveTo(-half, 0); ctx.lineTo(-half + 6, 0);
          ctx.moveTo(half, 0); ctx.lineTo(half - 6, 0);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Corner brackets
      const bracketSize = Math.max(16, w * 0.04);
      const inset = 8;
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(inset, inset + bracketSize);
      ctx.lineTo(inset, inset);
      ctx.lineTo(inset + bracketSize, inset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - inset - bracketSize, inset);
      ctx.lineTo(w - inset, inset);
      ctx.lineTo(w - inset, inset + bracketSize);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(inset, h - inset - bracketSize);
      ctx.lineTo(inset, h - inset);
      ctx.lineTo(inset + bracketSize, h - inset);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w - inset - bracketSize, h - inset);
      ctx.lineTo(w - inset, h - inset);
      ctx.lineTo(w - inset, h - inset - bracketSize);
      ctx.stroke();
    },
    [colors, mode, activeIndex]
  );

  /** Full render: (re)build layers, draw, and in single mode run the
   *  settle-glow pulse (rAF over two cached layers — cheap). */
  const renderScene = useCallback(() => {
    if (!prepareLayers()) return;
    cancelAnimationFrame(animFrameRef.current);

    const baseGlow = Math.max(10, (imgRef.current?.naturalWidth ?? 600) * 0.015);
    if (mode !== 'single') {
      composeFrame(baseGlow);
      return;
    }

    const start = performance.now();
    const pulse = (now: number) => {
      const t = now - start;
      if (t >= PULSE_DURATION_MS) {
        composeFrame(baseGlow);
        return;
      }
      // Two soft swells that decay into the resting glow
      const decay = 1 - t / PULSE_DURATION_MS;
      const swell = Math.sin((t / PULSE_DURATION_MS) * Math.PI * 4) * 0.5 + 0.5;
      composeFrame(baseGlow * (1 + swell * decay * 0.9));
      animFrameRef.current = requestAnimationFrame(pulse);
    };
    animFrameRef.current = requestAnimationFrame(pulse);
  }, [prepareLayers, composeFrame, mode]);

  // Decode all masks once per colour set
  useEffect(() => {
    masksDecodedRef.current = false;
    const decode = async () => {
      const decoded = await Promise.all(
        colors.map((c) => (c.mask ? decodeMask(c.mask) : Promise.resolve(null)))
      );
      masksRef.current = decoded;
      masksDecodedRef.current = true;
      renderScene();
    };
    decode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colors]);

  // Detect already-loaded cached images
  useEffect(() => {
    if (imgRef.current?.complete && imgRef.current.naturalWidth > 0) {
      setImgLoaded(true);
    }
  }, [isRevealed]);

  // Redraw when the image loads or the highlighted colour changes
  useEffect(() => {
    if (imgLoaded) renderScene();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [imgLoaded, renderScene]);

  const handleReveal = () => {
    setIsRevealed((prev) => {
      const next = !prev;
      if (next) {
        setScanComplete(false);
        setImgLoaded(false);
      }
      return next;
    });
  };

  // No mask data available — hide the component
  const hasMasks = colors.some((c) => c.mask);
  if (!hasMasks) return null;

  if (mode === 'single' && !isRevealed) {
    // Show reveal button for single mode
    return (
      <div className="space-y-3">
        <motion.button
          onClick={handleReveal}
          className="w-full py-4 px-6 rounded-lg relative overflow-hidden touch-target border-2 bg-gradient-to-br from-dark-gothic to-charcoal border-brass"
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 20px var(--brass)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {/* Scanline hover effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ y: '-100%' }}
            whileHover={{
              y: '100%',
              transition: { duration: 1.5, repeat: Infinity, ease: 'linear' },
            }}
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--cogitator-green-glow), transparent)',
              height: '20%',
            }}
          />

          <div className="flex items-center justify-center gap-3 relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="flex-shrink-0"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="2">
                <circle cx="12" cy="12" r="9" opacity="0.5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1" fill="var(--brass)" />
                <line x1="12" y1="3" x2="12" y2="7" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="3" y1="12" x2="7" y2="12" />
                <line x1="17" y1="12" x2="21" y2="12" />
              </svg>
            </motion.div>
            <div className="flex flex-col items-start flex-1">
              <span className="font-bold text-base cyber-text text-shadow" style={{ color: 'var(--brass)' }}>
                ◇ REVEAL LOCATION ◇
              </span>
              <span className="text-xs font-medium tech-text" style={{ color: 'var(--text-secondary)' }}>
                Tap to activate scan
              </span>
            </div>
            <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="var(--brass)" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Toggle button for single mode */}
      {mode === 'single' && (
        <motion.button
          onClick={handleReveal}
          className="w-full py-4 px-6 rounded-lg relative overflow-hidden touch-target border-2 bg-gradient-to-br from-cogitator-green-dark to-cogitator-green-dim border-cogitator-green"
          whileHover={{
            scale: 1.02,
            boxShadow: '0 0 30px var(--cogitator-green-glow)',
          }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="flex items-center justify-center gap-3 relative z-10">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="2">
              <circle cx="12" cy="12" r="9" opacity="0.5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1" fill="var(--cogitator-green)" />
              <line x1="12" y1="3" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="3" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="21" y2="12" />
            </svg>
            <div className="flex flex-col items-start flex-1">
              <span className="font-bold text-base cyber-text text-shadow" style={{ color: 'var(--cogitator-green)' }}>
                ◇ LOCATION ACTIVE ◇
              </span>
              <span className="text-xs font-medium tech-text" style={{ color: 'var(--cogitator-green-dim)' }}>
                Target acquired
              </span>
            </div>
            <motion.div animate={{ rotate: 180 }} transition={{ duration: 0.3 }}>
              <svg className="w-6 h-6" fill="none" stroke="var(--cogitator-green)" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>

          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-cogitator-green"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.button>
      )}

      {/* Header for map mode */}
      {mode === 'map' && (
        <motion.h2
          className="text-center text-lg font-bold gothic-text auspex-text text-shadow-sm"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          ◆ TACTICAL READOUT ◆
        </motion.h2>
      )}

      {/* Canvas container */}
      <AnimatePresence mode="wait">
        {(mode === 'map' || isRevealed) && (
          <motion.div
            initial={{ opacity: 0, height: mode === 'map' ? 'auto' : 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="gothic-frame rounded-lg overflow-hidden bg-dark-gothic">
              <div className="bg-dark-gothic p-1">
                <div className="relative">
                  {/* Loading skeleton */}
                  {!imgLoaded && (
                    <div className="w-full aspect-square bg-charcoal animate-pulse rounded" />
                  )}

                  {/* Hidden source image */}
                  {imageUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      ref={imgRef}
                      src={imageUrl}
                      alt="Source miniature"
                      className="hidden"
                      onLoad={() => setImgLoaded(true)}
                    />
                  )}

                  {/* Main canvas */}
                  <motion.canvas
                    ref={canvasRef}
                    className="w-full rounded"
                    initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                    animate={{
                      scale: imgLoaded ? 1 : 1.1,
                      filter: imgLoaded ? 'blur(0px)' : 'blur(10px)',
                      opacity: imgLoaded ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                  />

                  {/* Numbered chips (map mode): DOM overlay positioned by the
                      full-frame normalised marker points — percentage
                      positioning survives any canvas scaling, and DOM chips
                      get real tap targets + staggered pop-in. */}
                  {mode === 'map' && imgLoaded &&
                    colors.map((color, i) =>
                      color.position ? (
                        <motion.button
                          key={i}
                          onClick={() => onChipClick?.(i)}
                          aria-label={`Locate colour ${i + 1}: ${color.family ?? color.hex}`}
                          className="absolute w-9 h-9 rounded-full font-mono font-bold text-base flex items-center justify-center touch-target"
                          style={{
                            left: `${color.position.x * 100}%`,
                            top: `${color.position.y * 100}%`,
                            // Centring via framer's x/y so it composes with the
                            // scale animation (Tailwind translate classes would
                            // be clobbered by framer's inline transform).
                            x: '-50%',
                            y: '-50%',
                            background: 'rgba(0, 0, 0, 0.85)',
                            border: '2px solid #00ff41',
                            color: '#00ff41',
                            boxShadow: `0 0 10px rgba(0, 255, 65, 0.5), 0 0 4px ${color.hex}`,
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            delay: 0.9 + i * 0.12,
                            type: 'spring',
                            stiffness: 400,
                            damping: 18,
                          }}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {i + 1}
                        </motion.button>
                      ) : null
                    )}

                  {/* Scan sweep animation */}
                  {imgLoaded && !scanComplete && (
                    <>
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        initial={{ y: '-100%' }}
                        animate={{ y: '100%' }}
                        transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
                        onAnimationComplete={() => setScanComplete(true)}
                        style={{
                          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 255, 136, 0.1) 20%, rgba(0, 255, 136, 0.6) 50%, rgba(0, 255, 136, 0.1) 80%, transparent 100%)',
                          height: '40%',
                          boxShadow: '0 0 40px rgba(0, 255, 136, 0.8)',
                        }}
                      />
                      <motion.div
                        className="absolute left-0 right-0 pointer-events-none"
                        initial={{ top: '-2px' }}
                        animate={{ top: '100%' }}
                        transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
                        style={{
                          height: '2px',
                          background: 'rgba(0, 255, 136, 1)',
                          boxShadow: '0 0 20px rgba(0, 255, 136, 1), 0 0 40px rgba(0, 255, 136, 0.6)',
                        }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Footer: info for map mode, colour label for single */}
              {imgLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-4 py-3 flex items-center justify-between bg-gradient-to-b from-dark-gothic to-void-black border-t border-brass"
                >
                  {mode === 'map' ? (
                    <>
                      <span className="auspex-text text-xs font-bold">
                        {colors.length} REGIONS IDENTIFIED
                      </span>
                      <span className="text-cogitator-green-dim text-xs cyber-text">
                        Tap number to locate
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full auspex-glow"
                          style={{ backgroundColor: colors[activeIndex]?.hex }}
                        />
                        <span className="auspex-text text-sm font-bold">
                          {colors[activeIndex]?.family || 'Unknown'}
                        </span>
                      </div>
                      <span className="text-cogitator-green-dim text-xs cyber-text">
                        Showing where it appears
                      </span>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AuspexReveal;
