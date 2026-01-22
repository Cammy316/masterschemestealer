/**
 * Warp Portal - True vortex portal with dark center for Inspiration mode
 * Redesigned to look like an actual portal being pulled into the void
 */

'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface WarpPortalProps {
  onActivate: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

export function WarpPortal({ onActivate, isActive = false, disabled = false }: WarpPortalProps) {
  const portalRef = useRef<HTMLButtonElement>(null);

  // Generate particles being drawn toward center
  const particles = React.useMemo(() => {
    return [...Array(12)].map((_, i) => {
      const angle = (Math.PI * 2 * i) / 12;
      const distance = 45; // percentage from center
      return {
        id: i,
        startX: 50 + Math.cos(angle) * distance,
        startY: 50 + Math.sin(angle) * distance,
        delay: i * 0.25,
      };
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[400px] py-8 overflow-hidden">
      {/* Realistic starfield background - constrained within container */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-void-black">
        {[...Array(100)].map((_, i) => {
          const size = Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 1.5 : 2;
          const x = 10 + Math.random() * 80; // Keep stars away from edges
          const y = 10 + Math.random() * 80;
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${size}px`,
                height: `${size}px`,
              }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'easeInOut',
              }}
            />
          );
        })}
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

        {/* Layer 6: Spiral arms overlay (SVG) */}
        <motion.svg
          className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)]"
          viewBox="0 0 200 200"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <linearGradient id="spiralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.6)" />
              <stop offset="50%" stopColor="rgba(236, 72, 153, 0.4)" />
              <stop offset="100%" stopColor="rgba(139, 92, 246, 0.2)" />
            </linearGradient>
          </defs>
          {/* Spiral arm paths - creates the "being pulled in" effect */}
          <path
            d="M100,100 Q120,80 140,85 T160,100 Q155,120 140,130 T100,140 Q80,135 70,120 T60,100 Q65,80 80,70 T100,60"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="2"
            opacity="0.5"
          />
          <path
            d="M100,100 Q80,120 60,115 T40,100 Q45,80 60,70 T100,60 Q120,65 130,80 T140,100 Q135,120 120,130 T100,140"
            fill="none"
            stroke="url(#spiralGradient)"
            strokeWidth="2"
            opacity="0.5"
          />
        </motion.svg>

        {/* Layer 7: Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
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
        </div>

        {/* Particle effects - being drawn toward center */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-purple-300 rounded-full"
              style={{
                left: `${particle.startX}%`,
                top: `${particle.startY}%`,
              }}
              animate={{
                left: '50%',
                top: '50%',
                opacity: [0.8, 0],
                scale: [1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeIn",
              }}
            />
          ))}
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
