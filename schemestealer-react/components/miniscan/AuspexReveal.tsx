/**
 * AuspexReveal — Tactical map + per-colour mask overlay
 * 
 * Two modes:
 * - "map": Full tactical readout showing all colour regions with numbered chips
 * - "single": Per-colour reveal showing one mask with glow rim
 * 
 * Uses canvas compositing with 1-bit PNG masks from the backend.
 * All animations via useRef + rAF (no setState storms).
 */

'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Color } from '@/lib/types';

interface AuspexRevealProps {
  /** "map" = tactical readout (top of results), "single" = per-colour reveal */
  mode: 'map' | 'single';
  /** The user's uploaded miniature image (object URL) */
  imageUrl?: string;
  /** All detected colours with mask data */
  colors: Color[];
  /** Analysis resolution from mask_frame */
  maskFrame?: { width: number; height: number };
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

  // Decode all masks once
  const masksRef = useRef<(ImageBitmap | null)[]>([]);
  const masksDecodedRef = useRef(false);

  useEffect(() => {
    masksDecodedRef.current = false;
    const decode = async () => {
      const decoded = await Promise.all(
        colors.map((c) => (c.mask ? decodeMask(c.mask) : Promise.resolve(null)))
      );
      masksRef.current = decoded;
      masksDecodedRef.current = true;
      // Trigger a repaint
      drawCanvas();
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

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    if (!masksDecodedRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = img.naturalWidth;
    const h = img.naturalHeight;
    canvas.width = w;
    canvas.height = h;

    // Draw base image
    ctx.drawImage(img, 0, 0);

    // Apply dim + desaturate overlay (scanline CRT feel)
    ctx.save();
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Desaturate: draw the image again with saturation blend
    ctx.save();
    ctx.globalCompositeOperation = 'saturation';
    ctx.fillStyle = 'hsl(0, 0%, 50%)';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();

    // Redraw original dimly as base
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 0.3;
    ctx.drawImage(img, 0, 0);
    ctx.globalAlpha = 1;
    ctx.restore();

    // Scanline texture
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';
    for (let y = 0; y < h; y += 4) {
      ctx.fillStyle = 'rgba(0, 255, 65, 0.02)';
      ctx.fillRect(0, y, w, 1);
    }
    ctx.restore();

    // Scale factor from analysis resolution to image resolution
    const scaleX = maskFrame ? w / maskFrame.width : 1;
    const scaleY = maskFrame ? h / maskFrame.height : 1;

    if (mode === 'map') {
      // MAP MODE: Tint all colour regions
      masksRef.current.forEach((mask, i) => {
        if (!mask) return;
        const color = colors[i];
        if (!color) return;

        // Create a temporary canvas for the mask
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = w;
        tmpCanvas.height = h;
        const tmpCtx = tmpCanvas.getContext('2d');
        if (!tmpCtx) return;

        // Draw the mask scaled to image resolution
        tmpCtx.drawImage(mask, 0, 0, mask.width, mask.height, 0, 0, mask.width * scaleX, mask.height * scaleY);

        // Use the mask as a clip for the tint
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.45;

        // Draw tinted region: first draw the original image through the mask
        const tintCanvas = document.createElement('canvas');
        tintCanvas.width = w;
        tintCanvas.height = h;
        const tintCtx = tintCanvas.getContext('2d');
        if (tintCtx) {
          // Fill with the colour's hex
          tintCtx.fillStyle = color.hex;
          tintCtx.fillRect(0, 0, w, h);
          // Use mask as alpha
          tintCtx.globalCompositeOperation = 'destination-in';
          tintCtx.drawImage(tmpCanvas, 0, 0);
          // Composite onto main canvas
          ctx.drawImage(tintCanvas, 0, 0);
        }
        ctx.restore();
      });

    } else {
      // SINGLE MODE: Highlight just the active colour
      const mask = masksRef.current[activeIndex];
      const color = colors[activeIndex];
      if (mask && color) {
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = w;
        tmpCanvas.height = h;
        const tmpCtx = tmpCanvas.getContext('2d');
        if (tmpCtx) {
          tmpCtx.drawImage(mask, 0, 0, mask.width, mask.height, 0, 0, mask.width * scaleX, mask.height * scaleY);

          // Glow rim: draw slightly dilated mask outline
          ctx.save();
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.6;
          ctx.shadowColor = color.hex;
          ctx.shadowBlur = 12;
          ctx.drawImage(tmpCanvas, 0, 0);
          ctx.shadowBlur = 0;
          ctx.restore();

          // Tinted region
          const tintCanvas = document.createElement('canvas');
          tintCanvas.width = w;
          tintCanvas.height = h;
          const tintCtx = tintCanvas.getContext('2d');
          if (tintCtx) {
            tintCtx.fillStyle = color.hex;
            tintCtx.fillRect(0, 0, w, h);
            tintCtx.globalCompositeOperation = 'destination-in';
            tintCtx.drawImage(tmpCanvas, 0, 0);
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.55;
            ctx.drawImage(tintCanvas, 0, 0);
            ctx.restore();
          }

          // Draw the original image through the mask at higher opacity
          const revealCanvas = document.createElement('canvas');
          revealCanvas.width = w;
          revealCanvas.height = h;
          const revealCtx = revealCanvas.getContext('2d');
          if (revealCtx) {
            revealCtx.drawImage(img, 0, 0);
            revealCtx.globalCompositeOperation = 'destination-in';
            revealCtx.drawImage(tmpCanvas, 0, 0);
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.5;
            ctx.drawImage(revealCanvas, 0, 0);
            ctx.restore();
          }
        }
      }
    }

    // Draw numbered chips / crosshairs at positions
    const colorsToMark = mode === 'map' ? colors : [colors[activeIndex]];
    const indices = mode === 'map' ? colors.map((_, i) => i) : [activeIndex];

    indices.forEach((idx, _) => {
      const color = colors[idx];
      if (!color?.position) return;

      const px = color.position.x * w;
      const py = color.position.y * h;
      const isActive = mode === 'single' || idx === activeIndex;

      ctx.save();
      ctx.translate(px, py);

      if (mode === 'map') {
        // Numbered chip
        const chipR = Math.max(14, w * 0.035);

        // Chip background
        ctx.beginPath();
        ctx.arc(0, 0, chipR, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fill();
        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Number
        ctx.fillStyle = '#00ff41';
        ctx.font = `bold ${Math.round(chipR * 1.1)}px monospace`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), 0, 1);
      } else {
        // Crosshair for single mode
        const size = Math.max(20, w * 0.04);
        const half = size / 2;

        ctx.strokeStyle = '#00ff41';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00ff41';
        ctx.shadowBlur = 8;

        // Outer ring
        ctx.beginPath();
        ctx.arc(0, 0, half, 0, Math.PI * 2);
        ctx.stroke();

        // Centre dot
        ctx.fillStyle = '#00ff41';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        // Crosshair lines
        ctx.beginPath();
        ctx.moveTo(0, -half); ctx.lineTo(0, -half + 6);
        ctx.moveTo(0, half); ctx.lineTo(0, half - 6);
        ctx.moveTo(-half, 0); ctx.lineTo(-half + 6, 0);
        ctx.moveTo(half, 0); ctx.lineTo(half - 6, 0);
        ctx.stroke();

        ctx.shadowBlur = 0;
      }

      ctx.restore();
    });

    // Corner brackets
    const bracketSize = Math.max(16, w * 0.04);
    const bracketInset = 8;
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(bracketInset, bracketInset + bracketSize);
    ctx.lineTo(bracketInset, bracketInset);
    ctx.lineTo(bracketInset + bracketSize, bracketInset);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(w - bracketInset - bracketSize, bracketInset);
    ctx.lineTo(w - bracketInset, bracketInset);
    ctx.lineTo(w - bracketInset, bracketInset + bracketSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(bracketInset, h - bracketInset - bracketSize);
    ctx.lineTo(bracketInset, h - bracketInset);
    ctx.lineTo(bracketInset + bracketSize, h - bracketInset);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(w - bracketInset - bracketSize, h - bracketInset);
    ctx.lineTo(w - bracketInset, h - bracketInset);
    ctx.lineTo(w - bracketInset, h - bracketInset - bracketSize);
    ctx.stroke();
  }, [colors, maskFrame, mode, activeIndex]);

  // Redraw when image loads or masks decode
  useEffect(() => {
    if (imgLoaded) {
      drawCanvas();
    }
  }, [imgLoaded, drawCanvas]);

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

  // Handle chip clicks in map mode
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (mode !== 'map' || !onChipClick || !canvasRef.current || !imgRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const w = canvasRef.current.width;
    const h = canvasRef.current.height;
    const chipR = Math.max(14, w * 0.035) * 1.5; // Generous hit area

    for (let i = 0; i < colors.length; i++) {
      const pos = colors[i].position;
      if (!pos) continue;
      const px = pos.x * w;
      const py = pos.y * h;
      const dist = Math.sqrt((clickX - px) ** 2 + (clickY - py) ** 2);
      if (dist <= chipR) {
        onChipClick(i);
        return;
      }
    }
  }, [mode, onChipClick, colors]);

  // No mask data available — hide the component
  const hasMasks = colors.some((c) => c.mask);
  // Fallback: support old reticle data for backward compat
  const hasReticles = colors.some((c) => c.reticle);
  if (!hasMasks && !hasReticles && !imageUrl) return null;
  // If we only have reticle data (no masks), don't render AuspexReveal
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
                    className={`w-full rounded ${mode === 'map' ? 'cursor-pointer' : ''}`}
                    onClick={handleCanvasClick}
                    initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                    animate={{
                      scale: imgLoaded ? 1 : 1.1,
                      filter: imgLoaded ? 'blur(0px)' : 'blur(10px)',
                      opacity: imgLoaded ? 1 : 0,
                    }}
                    transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
                  />

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
