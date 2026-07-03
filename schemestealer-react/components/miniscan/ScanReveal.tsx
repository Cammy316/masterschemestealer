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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const normalizedPositions = useRef<ColorPoint[]>([]);
  const bloomProgressRef = useRef(0);

  // Initialize and run the bloom animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;

      const scaleX = img.width / 1000;
      const scaleY = img.height / 1000;

      normalizedPositions.current = reticleData.map(point => ({
        x: point.x * scaleX,
        y: point.y * scaleY,
        color: point.color,
        name: point.name,
      }));

      // Pre-create temp canvas for compositing to avoid allocating every frame
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      
      const startTime = Date.now();
      const duration = 1500;

      const frame = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        bloomProgressRef.current = progress;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (progress === 0) {
          ctx.filter = 'grayscale(100%)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';
        } else if (progress < 1 && tempCtx) {
          ctx.filter = 'grayscale(100%)';
          ctx.drawImage(img, 0, 0);
          ctx.filter = 'none';

          normalizedPositions.current.forEach(point => {
            const maxRadius = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
            const radius = maxRadius * progress * 0.8;

            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

            const gradient = tempCtx.createRadialGradient(
              point.x, point.y, 0,
              point.x, point.y, radius
            );
            gradient.addColorStop(0, 'rgba(255,255,255,1)');
            gradient.addColorStop(0.7, 'rgba(255,255,255,0.6)');
            gradient.addColorStop(1, 'rgba(255,255,255,0)');

            tempCtx.fillStyle = gradient;
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

            tempCtx.globalCompositeOperation = 'source-in';
            tempCtx.drawImage(img, 0, 0);
            tempCtx.globalCompositeOperation = 'source-over'; // reset

            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(tempCanvas, 0, 0);
          });
        } else {
           // when progress == 1, just draw full color
           ctx.drawImage(img, 0, 0);
        }

        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          setTimeout(() => {
            setPhase('grid');
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
    img.src = imageUrl;
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl, onComplete]); // intentionally run once per imageUrl

  // Draw grid when phase changes to grid/complete
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    if (phase === 'grid' || phase === 'complete') {
      ctx.drawImage(imageRef.current, 0, 0);
      if (phase === 'grid') {
        drawAuspexGrid(ctx, canvas.width, canvas.height);
      }
    }
  }, [phase]);

  function drawAuspexGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
    ctx.strokeStyle = 'rgba(0, 255, 100, 0.4)';
    ctx.lineWidth = 1;

    const gridSize = 40;

    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

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
  }

  // Force re-render for reticles only once bloom completes, we can just use phase === 'grid' or 'complete'
  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative rounded-lg overflow-hidden border-2 border-green-500/50 shadow-2xl shadow-green-500/20">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ maxHeight: '70vh', objectFit: 'contain' }}
        />

        {/* Reticles - appear when bloom is done (phase goes to grid) */}
        {(phase === 'grid' || phase === 'complete') && normalizedPositions.current.map((point, index) => {
          const canvas = canvasRef.current;
          if (!canvas || !canvas.width) return null;

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
              <div className="relative w-5 h-5">
                <div
                  className="absolute inset-0 rounded-full border-2 border-green-500 animate-ping"
                  style={{ animationDuration: '2s' }}
                />
                <div className="absolute inset-0 rounded-full border-2 border-green-500 opacity-80" />
                <div className="absolute inset-[6px] rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
                <div className="absolute left-1/2 top-0 w-[2px] h-[6px] bg-green-500 -translate-x-1/2" />
                <div className="absolute left-1/2 bottom-0 w-[2px] h-[6px] bg-green-500 -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 h-[2px] w-[6px] bg-green-500 -translate-y-1/2" />
                <div className="absolute top-1/2 right-0 h-[2px] w-[6px] bg-green-500 -translate-y-1/2" />
              </div>
            </motion.div>
          );
        })}

        {phase === 'grid' && (
          <motion.div
            className="absolute inset-0 bg-green-500/20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

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
