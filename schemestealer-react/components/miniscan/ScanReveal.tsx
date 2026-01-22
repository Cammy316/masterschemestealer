/**
 * Enhanced Scan Reveal Sequence for Miniscan Mode
 * Creates a dramatic "Auspex Target Lock" reveal with hex grid overlay
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanRevealProps {
  imageUrl: string;
  reticleData: Array<{ x: number; y: number; color: string; name: string }>;
  onComplete: () => void;
}

export function ScanReveal({ imageUrl, reticleData, onComplete }: ScanRevealProps) {
  const [phase, setPhase] = useState<'scanning' | 'analyzing' | 'locking' | 'complete'>('scanning');
  const [visibleReticles, setVisibleReticles] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Phase 1: Scanning (1s)
    const scanTimer = setTimeout(() => setPhase('analyzing'), 1000);

    // Phase 2: Analyzing with hex grid (1.5s)
    const analyzeTimer = setTimeout(() => setPhase('locking'), 2500);

    // Phase 3: Reticles appear one by one
    const lockingTimer = setTimeout(() => {
      reticleData.forEach((_, index) => {
        setTimeout(() => {
          setVisibleReticles(index + 1);
        }, index * 150); // 150ms between each reticle
      });
    }, 2600);

    // Phase 4: Complete
    const completeTimer = setTimeout(() => {
      setPhase('complete');
      setTimeout(onComplete, 500);
    }, 2600 + (reticleData.length * 150) + 500);

    return () => {
      clearTimeout(scanTimer);
      clearTimeout(analyzeTimer);
      clearTimeout(lockingTimer);
      clearTimeout(completeTimer);
    };
  }, [reticleData, onComplete]);

  // Draw hex grid animation
  useEffect(() => {
    if (phase !== 'analyzing') return;

    const canvas = canvasRef.current;
    const image = imageRef.current;
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = image.naturalWidth || rect.width;
    canvas.height = image.naturalHeight || rect.height;

    const hexSize = 20;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let frame = 0;

    const drawHexGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw hexagonal grid
      for (let x = -canvas.width; x < canvas.width * 2; x += hexSize * 1.5) {
        for (let y = -canvas.height; y < canvas.height * 2; y += hexSize * Math.sqrt(3)) {
          const offsetX = (y / (hexSize * Math.sqrt(3))) % 2 === 0 ? 0 : hexSize * 0.75;
          const hexX = x + offsetX;
          const hexY = y;

          // Calculate distance from center for wave effect
          const dx = hexX - centerX;
          const dy = hexY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Wave propagation
          const waveSpeed = 100;
          const waveWidth = 50;
          const waveDist = (frame * waveSpeed) % (Math.max(canvas.width, canvas.height) + waveWidth);

          if (Math.abs(dist - waveDist) < waveWidth) {
            const opacity = 1 - (Math.abs(dist - waveDist) / waveWidth);
            ctx.strokeStyle = `rgba(0, 255, 100, ${opacity * 0.6})`;
            ctx.lineWidth = 2;
          } else if (dist < waveDist) {
            ctx.strokeStyle = 'rgba(0, 255, 100, 0.2)';
            ctx.lineWidth = 1;
          } else {
            ctx.strokeStyle = 'rgba(0, 255, 100, 0)';
          }

          // Draw hexagon
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = (Math.PI / 3) * i;
            const hx = hexX + hexSize * Math.cos(angle);
            const hy = hexY + hexSize * Math.sin(angle);
            if (i === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();
        }
      }

      frame++;
      if (phase === 'analyzing') {
        requestAnimationFrame(drawHexGrid);
      }
    };

    drawHexGrid();
  }, [phase]);

  return (
    <div className="relative w-full h-full">
      {/* Base image with green overlay */}
      <div className="relative">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Scanned miniature"
          className={`w-full h-auto transition-all duration-500 ${
            phase === 'scanning' ? 'filter brightness-75 hue-rotate-90' : ''
          }`}
        />

        {/* Green overlay during scanning */}
        {phase === 'scanning' && (
          <motion.div
            className="absolute inset-0 bg-green-500/20"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}

        {/* Hex grid overlay */}
        {phase === 'analyzing' && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />
        )}

        {/* Reticles */}
        <AnimatePresence>
          {(phase === 'locking' || phase === 'complete') && (
            <>
              {reticleData.slice(0, visibleReticles).map((reticle, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  style={{
                    left: `${reticle.x}px`,
                    top: `${reticle.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }}
                >
                  {/* Clean reticle design - Thin Circle + Crosshair */}
                  <svg width="48" height="48" viewBox="0 0 48 48" className="drop-shadow-lg">
                    {/* Outer dashed circle */}
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="#00FF66"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                      style={{ transformOrigin: 'center' }}
                    />

                    {/* Crosshair */}
                    <line x1="24" y1="8" x2="24" y2="16" stroke="#00FF66" strokeWidth="2" />
                    <line x1="24" y1="32" x2="24" y2="40" stroke="#00FF66" strokeWidth="2" />
                    <line x1="8" y1="24" x2="16" y2="24" stroke="#00FF66" strokeWidth="2" />
                    <line x1="32" y1="24" x2="40" y2="24" stroke="#00FF66" strokeWidth="2" />

                    {/* Center dot */}
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="2"
                      fill="#00FF66"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </svg>

                  {/* Flash effect on appear */}
                  <motion.div
                    className="absolute inset-0 bg-green-500 rounded-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0, 3, 0] }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Status text */}
      <div className="absolute top-4 left-0 right-0 text-center">
        <motion.div
          className="inline-block bg-black/80 px-6 py-2 rounded-full border-2 border-green-500"
          animate={{ boxShadow: ['0 0 10px rgba(0,255,100,0.3)', '0 0 20px rgba(0,255,100,0.6)', '0 0 10px rgba(0,255,100,0.3)'] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <p className="text-green-500 font-bold text-sm font-mono tracking-wider">
            {phase === 'scanning' && (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                ACQUIRING TARGET<span className="animate-pulse">...</span>
              </>
            )}
            {phase === 'analyzing' && (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                AUSPEX ANALYSIS<span className="animate-pulse">...</span>
              </>
            )}
            {(phase === 'locking' || phase === 'complete') && (
              <>
                <motion.span
                  className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                />
                TARGET LOCK
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* Lock confirmation flash */}
      {phase === 'complete' && (
        <motion.div
          className="absolute inset-0 bg-green-500 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}
