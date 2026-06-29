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

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
      angle: number;
      radius: number;
      speed: number;
      wobble: number;
      wobbleSpeed: number;
    }

    const particles: Particle[] = [];
    const centerX = canvas.offsetWidth; // Remember we scaled by 2, but offsetWidth is logical CSS pixels. 
    // Wait, the canvas context is scaled by 2, but the width/height are also *2. 
    // So logical center is just offsetWidth / offsetHeight.
    const cy = canvas.offsetHeight / 2;
    const cx = canvas.offsetWidth / 2;

    const createParticle = (initial: boolean = false) => {
      const angle = Math.random() * Math.PI * 2;
      const maxRadius = 144; // w-72 = 288px diameter
      const radius = initial ? Math.random() * maxRadius : maxRadius + Math.random() * 10;
      
      const colors = [
        'rgba(139, 92, 246, 0.4)',  // purple
        'rgba(236, 72, 153, 0.4)',   // pink
        'rgba(20, 184, 166, 0.3)',   // teal
        'rgba(168, 85, 247, 0.4)',   // light purple
        'rgba(255, 255, 255, 0.8)'   // lightning bright white/purple
      ];
      
      const isLightning = Math.random() > 0.95;

      return {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        life: 1,
        maxLife: isLightning ? 20 : 200 + Math.random() * 150, // slightly longer life
        color: isLightning ? colors[4] : colors[Math.floor(Math.random() * 4)],
        size: isLightning ? 1 + Math.random() * 2 : 2 + Math.random() * 4,
        angle,
        radius,
        speed: 0.005 + Math.random() * 0.015,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.02 + Math.random() * 0.05,
      };
    };

    for (let i = 0; i < 150; i++) {
      particles.push(createParticle(true));
    }

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Strong fade for motion blur effect
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      
      ctx.globalCompositeOperation = 'screen';

      particles.forEach((p, index) => {
        // Warp maelstrom math
        p.angle += p.speed + (p.radius < 50 ? 0.1 : 0); 
        p.radius -= (p.radius > 20 ? 0.3 : 0.05); // suck inward
        p.wobble += p.wobbleSpeed;

        const isLightning = p.color === 'rgba(255, 255, 255, 0.8)';

        // Calculate new position
        let targetX = cx + Math.cos(p.angle) * p.radius;
        let targetY = cy + Math.sin(p.angle) * p.radius;
        
        // Add chaotic turbulence
        if (isLightning) {
          targetX += (Math.random() - 0.5) * 20;
          targetY += (Math.random() - 0.5) * 20;
        } else {
          targetX += Math.cos(p.wobble) * 10;
          targetY += Math.sin(p.wobble) * 10;
        }

        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(targetX, targetY);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size * (p.life / p.maxLife);
        ctx.lineCap = 'round';
        ctx.stroke();

        p.x = targetX;
        p.y = targetY;
        p.life++;

        if (p.radius < 5 || p.life > p.maxLife) {
          particles[index] = createParticle();
        }
      });

      // Occasional lightning flash
      if (Math.random() > 0.95) {
        ctx.fillStyle = 'rgba(236, 72, 153, 0.05)';
        ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
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

  return (
    <div className="relative flex items-center justify-center min-h-[400px] py-8">
      {/* TODO(asset): warp-vortex.png hero art + the eye/skull decorative array would
          layer in here once the art exists. Blocked on art — the CSS/SVG vortex and
          parallax starfield below are the intentional fallback. */}


      {/* Eye of the Storm: Nebula Clouds */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-purple-900/30 blur-[100px] rounded-full pointer-events-none -z-10"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] bg-pink-900/20 blur-[120px] rounded-full pointer-events-none -z-10"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Eye of the Storm: Space Dust / Debris */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full pointer-events-none -z-10"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-purple-400/40 rounded-full blur-sm" />
        <div className="absolute bottom-10 right-10 w-3 h-3 bg-pink-400/30 rounded-full blur-[2px]" />
        <div className="absolute top-1/4 left-0 w-1.5 h-1.5 bg-white/30 rounded-full" />
      </motion.div>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none -z-10"
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute bottom-0 left-1/4 w-2 h-2 bg-purple-300/40 rounded-full blur-[1px]" />
        <div className="absolute top-10 right-1/4 w-1 h-1 bg-white/40 rounded-full" />
        <div className="absolute top-1/2 right-0 w-2.5 h-2.5 bg-teal-400/20 rounded-full blur-sm" />
      </motion.div>

      {/* Main portal button */}
      <motion.button
        ref={portalRef}
        onClick={onActivate}
        disabled={disabled}
        className="relative w-72 h-72 rounded-full focus:outline-none focus-visible-warp disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={{
          filter: isActive ? 'brightness(1.5)' : 'brightness(1)',
        }}
      >
        {/* SVG Filter Definition for Torn Reality Effect */}
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
          <filter id="warp-tear">
            <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise">
              <animate attributeName="baseFrequency" values="0.04;0.05;0.04" dur="8s" repeatCount="indefinite" />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="15" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>

        {/* Torn Reality Wrapper - Applies jagged edges to all visual layers but NOT the text */}
        <div className="absolute inset-0" style={{ filter: 'url(#warp-tear)' }}>
          {/* Layer 1: Outer glow — slow "breathing" so the portal feels alive */}
        <motion.div
          className="absolute inset-0 rounded-full bg-purple-600/20 blur-3xl"
          animate={{ scale: [1, 1.04, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

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

        {/* Layer 5: Event Horizon — dark receding void with a bright rim where
            the light bends around the core */}
        <div
          className="absolute inset-24 rounded-full"
          style={{
            background: `radial-gradient(
              circle,
              #000000 0%,
              #05000a 32%,
              #1a0030 62%,
              rgba(167, 139, 250, 0.75) 90%,
              rgba(236, 72, 153, 0.55) 100%
            )`,
            boxShadow: `
              inset 0 0 34px 12px rgba(0, 0, 0, 0.85),
              inset 0 0 64px 22px rgba(0, 0, 0, 0.6),
              0 0 22px 2px rgba(167, 139, 250, 0.5)
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
          className="absolute inset-0 w-full h-full rounded-full pointer-events-none mix-blend-screen"
        />
        </div>

        {/* Layer 7: Center text - dynamic based on state (Outside filter so text isn't torn) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          {hasUploaded ? (
            <>
              <motion.span
                className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] drop-shadow-lg gothic-text warp-text text-center px-4 leading-tight"
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
            </>
          ) : (
            <>
              <motion.span
                className="text-white text-lg sm:text-xl md:text-2xl font-bold tracking-[0.2em] drop-shadow-lg gothic-text warp-text text-center px-4 leading-tight"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)',
                    '0 0 15px rgba(255, 255, 255, 1), 0 0 30px rgba(139, 92, 246, 1), 0 0 60px rgba(139, 92, 246, 0.8)',
                    '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.6)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {isActive ? 'CHANNELING...' : 'TOUCH THE VEIL'}
              </motion.span>
            </>
          )}
        </div>
      </motion.button>

    </div>
  );
}

export default WarpPortal;
