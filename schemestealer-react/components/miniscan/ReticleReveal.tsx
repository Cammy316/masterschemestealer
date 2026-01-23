/**
 * Reticle Reveal - The "magic moment" feature
 * Hidden by default, reveals color location on miniature when tapped
 * Creates a shareable/viral moment
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReticleRevealProps {
  colorName: string;
  colorHex: string;
  reticleImage?: string; // Base64 or URL from backend
  originalImage?: string;
  reticlePositions?: Array<{ x: number; y: number }>; // Positions to draw client-side reticles
}

export function ReticleReveal({
  colorName,
  colorHex,
  reticleImage,
  originalImage,
  reticlePositions,
}: ReticleRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imageRef = React.useRef<HTMLImageElement>(null);

  const handleReveal = () => {
    setIsRevealed(!isRevealed);
    if (!isRevealed) {
      setScanComplete(false); // Reset scan when revealing
    }
  };

  // Draw reticles on canvas when using client-side rendering
  React.useEffect(() => {
    if (!imageLoaded || !reticlePositions || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match image
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw the original image
    ctx.drawImage(img, 0, 0);

    // Draw 20px reticles at each position
    reticlePositions.forEach(pos => {
      const x = pos.x * img.naturalWidth;
      const y = pos.y * img.naturalHeight;
      const size = 20;
      const halfSize = size / 2;

      ctx.save();
      ctx.translate(x, y);

      // Outer pulsing ring (we'll use CSS animation for pulse)
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
      ctx.stroke();

      // Center dot
      ctx.fillStyle = colorHex;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      // Crosshair lines
      ctx.strokeStyle = colorHex;
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Top
      ctx.moveTo(0, -halfSize);
      ctx.lineTo(0, -halfSize + 6);
      // Bottom
      ctx.moveTo(0, halfSize);
      ctx.lineTo(0, halfSize - 6);
      // Left
      ctx.moveTo(-halfSize, 0);
      ctx.lineTo(-halfSize + 6, 0);
      // Right
      ctx.moveTo(halfSize, 0);
      ctx.lineTo(halfSize - 6, 0);
      ctx.stroke();

      ctx.restore();
    });
  }, [imageLoaded, reticlePositions, colorHex]);

  return (
    <div className="space-y-3">
      {/* Reveal Button - The magic moment trigger */}
      <motion.button
        onClick={handleReveal}
        className="w-full py-4 px-6 rounded-lg relative overflow-hidden touch-target"
        style={{
          background: isRevealed
            ? 'linear-gradient(135deg, var(--cogitator-green-dark), var(--cogitator-green-dim))'
            : 'linear-gradient(135deg, var(--dark-gothic), var(--charcoal))',
          border: `2px solid ${isRevealed ? 'var(--cogitator-green)' : 'var(--brass)'}`,
        }}
        whileHover={{
          scale: 1.02,
          boxShadow: isRevealed
            ? '0 0 30px var(--cogitator-green-glow)'
            : '0 0 20px var(--brass)',
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        {/* Scanline effect on hover */}
        {!isRevealed && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ y: '-100%' }}
            whileHover={{
              y: '100%',
              transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              },
            }}
            style={{
              background: 'linear-gradient(to bottom, transparent, var(--cogitator-green-glow), transparent)',
              height: '20%',
            }}
          />
        )}

        <div className="flex items-center justify-center gap-3 relative z-10">
          {/* Icon - Targeting reticle instead of emoji */}
          <motion.div
            animate={{
              rotate: isRevealed ? 0 : 360,
              scale: isRevealed ? 1.1 : 1,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex-shrink-0"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke={isRevealed ? 'var(--cogitator-green)' : 'var(--brass)'}
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="9" opacity="0.5" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="12" cy="12" r="1" fill={isRevealed ? 'var(--cogitator-green)' : 'var(--brass)'} />
              <line x1="12" y1="3" x2="12" y2="7" />
              <line x1="12" y1="17" x2="12" y2="21" />
              <line x1="3" y1="12" x2="7" y2="12" />
              <line x1="17" y1="12" x2="21" y2="12" />
            </svg>
          </motion.div>

          {/* Text */}
          <div className="flex flex-col items-start flex-1">
            <span
              className="font-bold text-base cyber-text text-shadow"
              style={{
                color: isRevealed ? 'var(--cogitator-green)' : 'var(--brass)',
              }}
            >
              {isRevealed ? '◇ LOCATION ACTIVE ◇' : '◇ REVEAL LOCATION ◇'}
            </span>
            <span
              className="text-xs font-medium tech-text"
              style={{
                color: isRevealed ? 'var(--cogitator-green-dim)' : 'var(--text-secondary)',
              }}
            >
              {isRevealed ? 'Target acquired' : 'Tap to activate scan'}
            </span>
          </div>

          {/* Chevron */}
          <motion.div
            animate={{ rotate: isRevealed ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex-shrink-0"
            style={{
              color: isRevealed ? 'var(--cogitator-green)' : 'var(--brass)',
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>

        {/* Pulse effect when revealed */}
        {isRevealed && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              border: '2px solid var(--cogitator-green)',
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </motion.button>

      {/* Revealed Image Container */}
      <AnimatePresence mode="wait">
        {isRevealed && (
          <motion.div
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="overflow-hidden"
          >
            <div className="gothic-frame rounded-lg overflow-hidden bg-dark-gothic">
              <div className="bg-dark-gothic p-1">
                {(reticleImage || (originalImage && reticlePositions)) ? (
                  <div className="relative">
                    {/* Loading skeleton */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-charcoal animate-pulse rounded" />
                    )}

                    {/* Main image with reveal animation */}
                    {reticlePositions && originalImage ? (
                      <>
                        {/* Hidden image for canvas drawing */}
                        <img
                          ref={imageRef}
                          src={originalImage}
                          alt={`Source miniature`}
                          className="hidden"
                          onLoad={() => setImageLoaded(true)}
                        />
                        {/* Canvas with client-side reticles */}
                        <motion.canvas
                          ref={canvasRef}
                          className="w-full rounded"
                          initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                          animate={{
                            scale: imageLoaded ? 1 : 1.1,
                            filter: imageLoaded ? 'blur(0px)' : 'blur(10px)',
                            opacity: imageLoaded ? 1 : 0,
                          }}
                          transition={{
                            duration: 0.6,
                            ease: [0.43, 0.13, 0.23, 0.96],
                          }}
                        />
                      </>
                    ) : (
                      /* Backend reticle image */
                      <motion.img
                        src={reticleImage}
                        alt={`Location of ${colorName} on miniature`}
                        className="w-full rounded"
                        initial={{ scale: 1.1, filter: 'blur(10px)', opacity: 0 }}
                        animate={{
                          scale: imageLoaded ? 1 : 1.1,
                          filter: imageLoaded ? 'blur(0px)' : 'blur(10px)',
                          opacity: imageLoaded ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.6,
                          ease: [0.43, 0.13, 0.23, 0.96],
                        }}
                        onLoad={() => setImageLoaded(true)}
                      />
                    )}

                    {/* Enhanced scanning overlay effect - Full sweep with multiple passes */}
                    {imageLoaded && !scanComplete && (
                      <>
                        {/* Main scan bar */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ y: '-100%' }}
                          animate={{ y: '100%' }}
                          transition={{
                            duration: 2,
                            ease: [0.65, 0, 0.35, 1], // Ease in-out cubic
                          }}
                          onAnimationComplete={() => setScanComplete(true)}
                          style={{
                            background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 255, 136, 0.1) 20%, rgba(0, 255, 136, 0.6) 50%, rgba(0, 255, 136, 0.1) 80%, transparent 100%)',
                            height: '40%',
                            boxShadow: '0 0 40px rgba(0, 255, 136, 0.8)',
                          }}
                        />
                        {/* Secondary scan line - thin bright line */}
                        <motion.div
                          className="absolute left-0 right-0 pointer-events-none"
                          initial={{ top: '-2px' }}
                          animate={{ top: '100%' }}
                          transition={{
                            duration: 2,
                            ease: [0.65, 0, 0.35, 1],
                          }}
                          style={{
                            height: '2px',
                            background: 'rgba(0, 255, 136, 1)',
                            boxShadow: '0 0 20px rgba(0, 255, 136, 1), 0 0 40px rgba(0, 255, 136, 0.6)',
                          }}
                        />
                        {/* Scan grid overlay that fades in */}
                        <motion.div
                          className="absolute inset-0 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: [0, 0, 0.3, 0] }}
                          transition={{
                            duration: 2,
                            times: [0, 0.3, 0.7, 1],
                          }}
                          style={{
                            backgroundImage: `
                              linear-gradient(rgba(0, 255, 136, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(0, 255, 136, 0.1) 1px, transparent 1px)
                            `,
                            backgroundSize: '20px 20px',
                          }}
                        />
                      </>
                    )}

                    {/* Corner indicators */}
                    {imageLoaded && (
                      <>
                        {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
                          const positions = {
                            'top-left': 'top-2 left-2',
                            'top-right': 'top-2 right-2',
                            'bottom-left': 'bottom-2 left-2',
                            'bottom-right': 'bottom-2 right-2',
                          };
                          return (
                            <motion.div
                              key={corner}
                              className={`absolute ${positions[corner as keyof typeof positions]} w-4 h-4`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8, duration: 0.3 }}
                              style={{
                                borderColor: 'var(--cogitator-green)',
                                borderWidth: '2px',
                                borderStyle: 'solid',
                                ...(corner.includes('top') ? { borderBottom: 'none' } : { borderTop: 'none' }),
                                ...(corner.includes('left') ? { borderRight: 'none' } : { borderLeft: 'none' }),
                              }}
                            />
                          );
                        })}
                      </>
                    )}
                  </div>
                ) : (
                  /* Fallback if no reticle image */
                  <div className="p-8 text-center textured" style={{
                    background: 'linear-gradient(135deg, #1a1500 0%, #0d0a00 100%)',
                    border: '1px solid rgba(255, 170, 0, 0.3)',
                    borderLeft: '3px solid #ffaa00',
                    borderRadius: '8px'
                  }}>
                    {/* Warning icon - stylized skull instead of emoji */}
                    <div className="mb-4 flex justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffaa00" strokeWidth="1.5">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-warning text-sm font-bold cyber-text text-shadow mb-1">
                      ◆ AUSPEX DATA UNAVAILABLE ◆
                    </p>
                    <p className="text-text-tertiary text-xs tech-text">
                      Location mapping failed during analysis
                    </p>
                  </div>
                )}
              </div>

              {/* Info footer */}
              {(reticleImage || (originalImage && reticlePositions)) && imageLoaded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="px-4 py-3 flex items-center justify-between"
                  style={{
                    background: 'linear-gradient(to bottom, var(--dark-gothic), var(--void-black))',
                    borderTop: '1px solid var(--brass)',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full auspex-glow"
                      style={{ backgroundColor: colorHex }}
                    />
                    <span className="auspex-text text-sm font-bold">
                      {colorName}
                    </span>
                  </div>
                  <span className="text-cogitator-green-dim text-xs cyber-text">
                    ◆ HIGHLIGHTED ◆
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ReticleReveal;
