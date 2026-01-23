/**
 * ScanReveal - Progressive Color Bloom Animation
 * Magical reveal effect where colors bloom from detected points
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ColorPoint {
  x: number;
  y: number;
  color: string;
  name: string;
}

interface ScanRevealProps {
  imageUrl: string;
  reticleData: ColorPoint[];
  onComplete: () => void;
}

type Phase = 'bloom' | 'grid' | 'complete';

export function ScanReveal({ imageUrl, reticleData, onComplete }: ScanRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>('bloom');
  const [bloomProgress, setBloomProgress] = useState(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;

      // Start bloom animation
      animateBloom();
    };
    img.src = imageUrl;

    const animateBloom = () => {
      const startTime = Date.now();
      const duration = 1500; // 1.5 seconds

      const frame = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        setBloomProgress(progress);

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          // Bloom complete, show grid
          setTimeout(() => {
            setPhase('grid');

            // Grid complete, finish
            setTimeout(() => {
              setPhase('complete');
              setTimeout(() => {
                onComplete();
              }, 400);
            }, 300);
          }, 100);
        }
      };

      requestAnimationFrame(frame);
    };
  }, [imageUrl, onComplete]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bloomProgress === 0) {
      // Draw grayscale image
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';
    } else if (phase === 'bloom') {
      // Create off-screen canvas for compositing
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Draw grayscale base
      ctx.filter = 'grayscale(100%)';
      ctx.drawImage(img, 0, 0);
      ctx.filter = 'none';

      // Draw color blooms from each point
      reticleData.forEach(point => {
        const maxRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        const radius = maxRadius * bloomProgress * 0.8; // 80% of max for better coverage

        // Clear temp canvas
        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Create radial gradient mask
        const gradient = tempCtx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, radius
        );
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.7, 'rgba(255,255,255,0.6)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        // Draw gradient mask
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Use mask to reveal color
        tempCtx.globalCompositeOperation = 'source-in';
        tempCtx.drawImage(img, 0, 0);

        // Composite onto main canvas
        ctx.globalCompositeOperation = 'source-over';
        ctx.drawImage(tempCanvas, 0, 0);
      });

      ctx.globalCompositeOperation = 'source-over';

    } else if (phase === 'grid' || phase === 'complete') {
      // Draw full color image
      ctx.drawImage(img, 0, 0);

      // Draw auspex grid overlay (only during grid phase)
      if (phase === 'grid') {
        drawAuspexGrid(ctx, canvas.width, canvas.height);
      }
    }
  }, [bloomProgress, phase, reticleData]);

  const drawAuspexGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.4)';
    ctx.lineWidth = 1;

    const gridSize = 40;

    // Draw vertical lines
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw corner brackets
    const bracketSize = 30;
    const corners = [
      { x: 0, y: 0, type: 'tl' },
      { x: width - bracketSize, y: 0, type: 'tr' },
      { x: 0, y: height - bracketSize, type: 'bl' },
      { x: width - bracketSize, y: height - bracketSize, type: 'br' }
    ];

    ctx.strokeStyle = 'rgba(0, 255, 100, 0.8)';
    ctx.lineWidth = 3;

    corners.forEach(corner => {
      ctx.beginPath();
      switch (corner.type) {
        case 'tl':
          ctx.moveTo(bracketSize, 0);
          ctx.lineTo(0, 0);
          ctx.lineTo(0, bracketSize);
          break;
        case 'tr':
          ctx.moveTo(corner.x, 0);
          ctx.lineTo(corner.x + bracketSize, 0);
          ctx.lineTo(corner.x + bracketSize, bracketSize);
          break;
        case 'bl':
          ctx.moveTo(0, corner.y);
          ctx.lineTo(0, corner.y + bracketSize);
          ctx.lineTo(bracketSize, corner.y + bracketSize);
          break;
        case 'br':
          ctx.moveTo(corner.x + bracketSize, corner.y);
          ctx.lineTo(corner.x + bracketSize, corner.y + bracketSize);
          ctx.lineTo(corner.x, corner.y + bracketSize);
          break;
      }
      ctx.stroke();
    });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      {/* Canvas for bloom animation */}
      <div className="relative rounded-lg overflow-hidden border-2 border-green-500/50 shadow-2xl shadow-green-500/20">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ maxHeight: '70vh', objectFit: 'contain' }}
        />

        {/* Reticles - tiny 20px size, appear at end of bloom */}
        {bloomProgress > 0.8 && reticleData.map((point, index) => {
          const canvas = canvasRef.current;
          if (!canvas) return null;

          const percentX = (point.x / canvas.width) * 100;
          const percentY = (point.y / canvas.height) * 100;

          return (
            <motion.div
              key={index}
              className="absolute pointer-events-none"
              style={{
                left: `${percentX}%`,
                top: `${percentY}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.1,
                duration: 0.4,
                ease: 'easeOut'
              }}
            >
              {/* Tiny dot reticle (20px) */}
              <div className="relative w-5 h-5">
                {/* Pulsing ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping"
                  style={{ animationDuration: '2s' }}
                />

                {/* Static outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-green-500 opacity-80" />

                {/* Center dot */}
                <div className="absolute inset-[6px] rounded-full bg-green-500 shadow-lg shadow-green-500/50" />

                {/* Crosshair lines */}
                <div className="absolute left-1/2 top-0 w-[2px] h-[6px] bg-green-500 -translate-x-1/2" />
                <div className="absolute left-1/2 bottom-0 w-[2px] h-[6px] bg-green-500 -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 h-[2px] w-[6px] bg-green-500 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 h-[2px] w-[6px] bg-green-500 -translate-y-1/2" />
              </div>
            </motion.div>
          );
        })}

        {/* Grid phase flash */}
        {phase === 'grid' && (
          <motion.div
            className="absolute inset-0 bg-green-500/20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      {/* Status text */}
      <div className="absolute top-4 left-0 right-0 text-center pointer-events-none z-10">
        <motion.div
          className="inline-block bg-black/90 px-6 py-2 rounded-full border-2 border-green-500 shadow-lg shadow-green-500/50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-green-500 font-bold text-sm font-mono tracking-wider">
            {phase === 'bloom' && (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                ANALYZING CHROMATIC SIGNATURES
              </>
            )}
            {phase === 'grid' && (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                CALIBRATING AUSPEX
              </>
            )}
            {phase === 'complete' && (
              <>
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" />
                ANALYSIS COMPLETE
              </>
            )}
          </p>
        </motion.div>
      </div>

      {/* Completion flash */}
      {phase === 'complete' && (
        <motion.div
          className="absolute inset-0 bg-green-500 pointer-events-none rounded-lg"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}
