/**
 * Warp Portal - Enhanced vortex portal with advanced effects
 * Features: bright parallax stars, logarithmic spirals, canvas particles
 */

'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface WarpPortalProps {
  onActivate: () => void;
  isActive?: boolean;
  disabled?: boolean;
  hasUploaded?: boolean; // Track if file was uploaded
}

export function WarpPortal({ onActivate, isActive = false, disabled = false, hasUploaded = false }: WarpPortalProps) {
  const portalRef = useRef<HTMLButtonElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas particle system with trails
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    updateSize();

    // Particle system
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
      trail: { x: number; y: number; life: number }[];
    }

    const particles: Particle[] = [];
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;

    // Create particles
    const createParticle = () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 140 + Math.random() * 20;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;

      // Calculate velocity toward center with slight curve
      const dx = centerX - x;
      const dy = centerY - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const speed = 0.5 + Math.random() * 0.5;

      const colors = [
        'rgba(139, 92, 246, 0.8)',  // purple
        'rgba(236, 72, 153, 0.8)',   // pink
        'rgba(20, 184, 166, 0.8)',   // teal
        'rgba(168, 85, 247, 0.8)',   // light purple
      ];

      return {
        x,
        y,
        vx: (dx / dist) * speed,
        vy: (dy / dist) * speed,
        life: 1,
        maxLife: 150 + Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 2,
        trail: [],
      };
    };

    // Initialize particles
    for (let i = 0; i < 30; i++) {
      particles.push(createParticle());
    }

    // Animation loop
    let animationId: number;
    let frame = 0;

    const animate = () => {
      frame++;

      // Fade trail effect instead of clearing
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update trail
        particle.trail.push({ x: particle.x, y: particle.y, life: 1 });
        if (particle.trail.length > 10) particle.trail.shift();

        // Update trail life
        particle.trail.forEach(t => t.life *= 0.95);

        // Draw trail
        particle.trail.forEach((t, i) => {
          if (i > 0) {
            const prev = particle.trail[i - 1];
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(t.x, t.y);
            ctx.strokeStyle = particle.color.replace('0.8', `${t.life * 0.4}`);
            ctx.lineWidth = particle.size * (t.life * 0.5);
            ctx.stroke();
          }
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Add glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = particle.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Move particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;

        // Accelerate toward center as it gets closer
        const dx = centerX - particle.x;
        const dy = centerY - particle.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          const accel = (80 - dist) / 80;
          particle.vx += (dx / dist) * accel * 0.2;
          particle.vy += (dy / dist) * accel * 0.2;
        }

        // Remove dead particles or ones that reached center
        if (particle.life <= 0 || dist < 10) {
          particles.splice(index, 1);
          particles.push(createParticle());
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Generate logarithmic spiral path
  const generateLogarithmicSpiral = (
    turns: number,
    a: number,
    b: number,
    reverse: boolean = false
  ): string => {
    const points: [number, number][] = [];
    const steps = 200;
    const thetaMax = turns * Math.PI * 2;

    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * thetaMax;
      const r = a * Math.exp(b * theta);
      const x = 100 + r * Math.cos(reverse ? -theta : theta);
      const y = 100 + r * Math.sin(reverse ? -theta : theta);
      points.push([x, y]);
    }

    const pathData = points
      .map((point, i) => `${i === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`)
      .join(' ');

    return pathData;
  };

  // Generate multiple spiral tendrils
  const spiralPaths = React.useMemo(() => {
    return [
      { path: generateLogarithmicSpiral(3, 1, 0.15, false), opacity: 0.6, duration: 25 },
      { path: generateLogarithmicSpiral(3, 1.2, 0.14, true), opacity: 0.5, duration: 28 },
      { path: generateLogarithmicSpiral(2.5, 0.8, 0.16, false), opacity: 0.4, duration: 30 },
      { path: generateLogarithmicSpiral(2.5, 1, 0.15, true), opacity: 0.5, duration: 27 },
    ];
  }, []);

  // Bright parallax stars
  const starLayers = React.useMemo(() => {
    return [
      // Near layer - large, bright, fast parallax
      {
        stars: [...Array(30)].map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 2 + Math.random() * 2,
          brightness: 0.8 + Math.random() * 0.2,
          speed: 2 + Math.random() * 2,
        })),
        parallax: 1.5,
      },
      // Mid layer - medium stars
      {
        stars: [...Array(50)].map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 1.5 + Math.random() * 1,
          brightness: 0.6 + Math.random() * 0.3,
          speed: 3 + Math.random() * 2,
        })),
        parallax: 1,
      },
      // Far layer - small, dim, slow parallax
      {
        stars: [...Array(70)].map(() => ({
          x: 10 + Math.random() * 80,
          y: 10 + Math.random() * 80,
          size: 1,
          brightness: 0.4 + Math.random() * 0.3,
          speed: 4 + Math.random() * 3,
        })),
        parallax: 0.5,
      },
    ];
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[400px] py-8 overflow-hidden">
      {/* Enhanced parallax starfield background */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-void-black">
        {starLayers.map((layer, layerIndex) => (
          <motion.div
            key={layerIndex}
            className="absolute inset-0"
            style={{ willChange: 'transform' }}
            animate={{
              x: [0, -5 * layer.parallax, 0, 5 * layer.parallax, 0],
              y: [0, -3 * layer.parallax, 0, 3 * layer.parallax, 0],
            }}
            transition={{
              duration: 20 + layerIndex * 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {layer.stars.map((star, i) => (
              <motion.div
                key={`${layerIndex}-${i}`}
                className="absolute rounded-full"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  background: `radial-gradient(circle, rgba(255, 255, 255, ${star.brightness}), transparent)`,
                  boxShadow: `0 0 ${star.size * 2}px rgba(255, 255, 255, ${star.brightness * 0.8})`,
                }}
                animate={{
                  opacity: [star.brightness * 0.6, star.brightness, star.brightness * 0.6],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: star.speed,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>

      {/* Main portal button */}
      <motion.button
        ref={portalRef}
        onClick={onActivate}
        disabled={disabled}
        className="relative w-72 h-72 rounded-full focus:outline-none focus-visible-warp disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={{
          filter: isActive ? 'brightness(1.5)' : 'brightness(1)',
        }}
      >
        {/* Layer 1: Outer glow */}
        <div className="absolute inset-0 rounded-full bg-purple-600/20 blur-3xl animate-pulse" />

        {/* Layer 2: Outer swirl ring - conic gradient */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(
              from 0deg,
              transparent 0deg,
              rgba(139, 92, 246, 0.4) 30deg,
              rgba(236, 72, 153, 0.3) 90deg,
              rgba(20, 184, 166, 0.3) 150deg,
              transparent 180deg,
              rgba(139, 92, 246, 0.4) 210deg,
              rgba(236, 72, 153, 0.3) 270deg,
              rgba(20, 184, 166, 0.3) 330deg,
              transparent 360deg
            )`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 3: Middle swirl - counter rotation */}
        <motion.div
          className="absolute inset-8 rounded-full"
          style={{
            background: `conic-gradient(
              from 180deg,
              rgba(139, 92, 246, 0.6) 0deg,
              rgba(168, 85, 247, 0.5) 60deg,
              rgba(236, 72, 153, 0.5) 120deg,
              rgba(139, 92, 246, 0.6) 180deg,
              rgba(168, 85, 247, 0.5) 240deg,
              rgba(236, 72, 153, 0.5) 300deg,
              rgba(139, 92, 246, 0.6) 360deg
            )`,
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 4: Inner swirl - faster */}
        <motion.div
          className="absolute inset-16 rounded-full"
          style={{
            background: `conic-gradient(
              from 90deg,
              rgba(192, 132, 252, 0.7) 0deg,
              rgba(236, 72, 153, 0.6) 90deg,
              rgba(192, 132, 252, 0.7) 180deg,
              rgba(236, 72, 153, 0.6) 270deg,
              rgba(192, 132, 252, 0.7) 360deg
            )`,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Layer 5: Event Horizon - Dark center void */}
        <div
          className="absolute inset-24 rounded-full"
          style={{
            background: `radial-gradient(
              circle,
              #000000 0%,
              #0a0010 30%,
              #1a0030 60%,
              rgba(139, 92, 246, 0.4) 100%
            )`,
            boxShadow: `
              inset 0 0 30px 10px rgba(0, 0, 0, 0.8),
              inset 0 0 60px 20px rgba(0, 0, 0, 0.6)
            `,
          }}
        />

        {/* Layer 6: Logarithmic spiral tendrils (SVG) */}
        <svg className="absolute inset-2 w-[calc(100%-1rem)] h-[calc(100%-1rem)] pointer-events-none" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="spiralGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
              <stop offset="30%" stopColor="rgba(139, 92, 246, 0.7)" />
              <stop offset="70%" stopColor="rgba(236, 72, 153, 0.6)" />
              <stop offset="100%" stopColor="rgba(20, 184, 166, 0.5)" />
            </linearGradient>
            <linearGradient id="spiralGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(236, 72, 153, 0)" />
              <stop offset="30%" stopColor="rgba(236, 72, 153, 0.7)" />
              <stop offset="70%" stopColor="rgba(139, 92, 246, 0.6)" />
              <stop offset="100%" stopColor="rgba(20, 184, 166, 0.5)" />
            </linearGradient>
            <filter id="spiralGlow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {spiralPaths.map((spiral, index) => {
            // Calculate path length for stroke animation
            const pathLength = 1000; // Approximate length

            return (
              <motion.path
                key={index}
                d={spiral.path}
                fill="none"
                stroke={index % 2 === 0 ? 'url(#spiralGradient1)' : 'url(#spiralGradient2)'}
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity={spiral.opacity}
                filter="url(#spiralGlow)"
                strokeDasharray={pathLength}
                animate={{
                  strokeDashoffset: [pathLength, 0],
                  rotate: index % 2 === 0 ? 360 : -360,
                  scale: [1, 0.8, 1]
                }}
                transition={{
                  strokeDashoffset: {
                    duration: spiral.duration * 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  rotate: {
                    duration: spiral.duration,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  scale: {
                    duration: spiral.duration * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                }}
                style={{ originX: '50%', originY: '50%' }}
              />
            );
          })}
        </svg>

        {/* Canvas particle system with trails */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-full pointer-events-none"
          style={{ mixBlendMode: 'screen' }}
        />

        {/* Layer 7: Center text - dynamic based on state */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {hasUploaded ? (
            <>
              <motion.span
                className="text-white text-xl font-bold tracking-[0.2em] drop-shadow-lg responsive-section-title"
                style={{
                  textShadow: `
                    0 0 15px rgba(255, 255, 255, 1),
                    0 0 30px rgba(236, 72, 153, 0.9),
                    0 0 50px rgba(236, 72, 153, 0.7),
                    0 0 70px rgba(236, 72, 153, 0.5)
                  `,
                }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                VEIL BREACHED
              </motion.span>
              <motion.span
                className="text-pink-200 mt-2 tracking-wider responsive-label"
                style={{
                  textShadow: `
                    0 0 10px rgba(236, 72, 153, 0.8),
                    0 0 20px rgba(236, 72, 153, 0.6)
                  `,
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Essence Captured
              </motion.span>
            </>
          ) : (
            <>
              <span
                className="text-white text-xl font-bold tracking-[0.2em] drop-shadow-lg responsive-section-title"
                style={{
                  textShadow: `
                    0 0 10px rgba(255, 255, 255, 0.9),
                    0 0 20px rgba(139, 92, 246, 0.8),
                    0 0 40px rgba(139, 92, 246, 0.6),
                    0 0 60px rgba(139, 92, 246, 0.4)
                  `,
                }}
              >
                {isActive ? 'CHANNELING...' : 'TOUCH THE VEIL'}
              </span>
              <span
                className="text-purple-200 mt-2 tracking-wider responsive-label"
                style={{
                  textShadow: `
                    0 0 10px rgba(192, 132, 252, 0.8),
                    0 0 20px rgba(139, 92, 246, 0.6)
                  `,
                }}
              >
                {isActive ? 'The Warp Stirs' : 'Enter the Immaterium'}
              </span>
            </>
          )}
        </div>
      </motion.button>

      {/* Instruction text */}
      {!isActive && (
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="responsive-label text-white/60 font-medium">
            Upload an image or take a photo to extract its chromatic essence
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default WarpPortal;
