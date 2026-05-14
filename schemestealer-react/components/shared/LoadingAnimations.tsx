/**
 * Loading Animations - Theme-specific loading screens
 * Servo-skull for Miniscan, Warp vortex for Inspiration
 * Enhanced with detailed, grimdark SVG animations
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Gothic phrases for Miniscan loading
const COGITATOR_PHRASES = [
  'AWAKENING MACHINE SPIRIT...',
  'CONSULTING SACRED DATABANKS...',
  'ANALYSING PIGMENT SIGNATURES...',
  'CROSS-REFERENCING ADMINISTRATUM RECORDS...',
  'COMPILING HOLY FORMULATION...',
  'INVOKING THE OMNISSIAH...',
  'PROCESSING CHROMATIC DATA...',
  'VERIFYING SACRED TOMES...',
];

// Mystical phrases for Inspiration loading
const WARP_PHRASES = [
  'PIERCING THE VEIL...',
  'CHANNELLING CHROMATIC ESSENCE...',
  'THE WARP REVEALS ITS SECRETS...',
  'MANIFESTING COLOUR SPIRITS...',
  'REALITY BENDS TO YOUR WILL...',
  'SUMMONING ETHEREAL HUES...',
  'THE IMMATERIUM STIRS...',
  'WEAVING THREADS OF FATE...',
];

interface LoadingAnimationProps {
  mode: 'miniature' | 'inspiration';
  message?: string;
}

export function LoadingAnimation({ mode, message }: LoadingAnimationProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = mode === 'miniature' ? COGITATOR_PHRASES : WARP_PHRASES;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [phrases.length]);

  if (mode === 'miniature') {
    return <ServoSkullLoading phrase={message || phrases[currentPhrase]} />;
  }

  return <WarpVortexLoading phrase={message || phrases[currentPhrase]} />;
}

// ============================================================================
// Enhanced Servo-Skull SVG Component
// ============================================================================

function ServoSkull({ className }: { className?: string }) {
  return (
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      fill="none"
      className={className}
    >
      {/* Definitions */}
      <defs>
        {/* Glow filter */}
        <filter id="skullGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Metal gradient */}
        <linearGradient id="skullMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#5a5a5a" />
          <stop offset="100%" stopColor="#2a2a2a" />
        </linearGradient>
        {/* Brass gradient */}
        <linearGradient id="brassAccent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B8860B" />
          <stop offset="50%" stopColor="#DAA520" />
          <stop offset="100%" stopColor="#8B6508" />
        </linearGradient>
      </defs>

      {/* Anti-grav suspensor field (subtle circle) */}
      <circle
        cx="60"
        cy="60"
        r="55"
        stroke="var(--cogitator-green)"
        strokeWidth="0.5"
        fill="none"
        opacity="0.3"
        strokeDasharray="4 4"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 60 60"
          to="360 60 60"
          dur="10s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Main skull cranium */}
      <path
        d="M60 15 C35 15 20 35 20 55 C20 70 28 82 38 90 L38 100 L82 100 L82 90 C92 82 100 70 100 55 C100 35 85 15 60 15Z"
        fill="url(#skullMetal)"
        stroke="#4a4a4a"
        strokeWidth="1"
      />

      {/* Cranium ridges/details */}
      <path
        d="M40 25 Q60 20 80 25"
        stroke="#5a5a5a"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M35 35 Q60 30 85 35"
        stroke="#4a4a4a"
        strokeWidth="1"
        fill="none"
      />

      {/* Left eye socket */}
      <ellipse cx="45" cy="55" rx="12" ry="14" fill="#0d0d0d" />
      {/* Left eye lens (mechanical) */}
      <circle cx="45" cy="55" r="8" fill="#1a1a1a" stroke="url(#brassAccent)" strokeWidth="2" />
      {/* Left eye glow */}
      <circle cx="45" cy="55" r="5" fill="var(--cogitator-green)" filter="url(#skullGlow)">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      {/* Left eye pupil */}
      <circle cx="45" cy="55" r="2" fill="#0d0d0d" />

      {/* Right eye socket */}
      <ellipse cx="75" cy="55" rx="12" ry="14" fill="#0d0d0d" />
      {/* Right eye lens (mechanical) */}
      <circle cx="75" cy="55" r="8" fill="#1a1a1a" stroke="url(#brassAccent)" strokeWidth="2" />
      {/* Right eye glow */}
      <circle cx="75" cy="55" r="5" fill="var(--cogitator-green)" filter="url(#skullGlow)">
        <animate
          attributeName="opacity"
          values="0.6;1;0.6"
          dur="2s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
      {/* Right eye pupil */}
      <circle cx="75" cy="55" r="2" fill="#0d0d0d" />

      {/* Nose cavity */}
      <path d="M55 65 L60 78 L65 65 Z" fill="#0d0d0d" />

      {/* Cheekbone details */}
      <path d="M28 60 Q32 70 38 75" stroke="#5a5a5a" strokeWidth="1" fill="none" />
      <path d="M92 60 Q88 70 82 75" stroke="#5a5a5a" strokeWidth="1" fill="none" />

      {/* Jaw / lower skull */}
      <path
        d="M38 90 L38 105 Q40 112 50 112 L70 112 Q80 112 82 105 L82 90"
        fill="url(#skullMetal)"
        stroke="#4a4a4a"
        strokeWidth="1"
      />

      {/* Teeth */}
      <g fill="#e0e0e0">
        <rect x="42" y="95" width="4" height="8" rx="1" />
        <rect x="48" y="95" width="4" height="8" rx="1" />
        <rect x="54" y="95" width="4" height="9" rx="1" />
        <rect x="60" y="95" width="4" height="9" rx="1" />
        <rect x="66" y="95" width="4" height="8" rx="1" />
        <rect x="72" y="95" width="4" height="8" rx="1" />
      </g>

      {/* Mechanical augments - left side */}
      <circle cx="22" cy="45" r="6" fill="url(#brassAccent)" />
      <circle cx="22" cy="45" r="3" fill="#1a1a1a" />
      <line x1="28" y1="45" x2="35" y2="50" stroke="url(#brassAccent)" strokeWidth="2" />

      {/* Mechanical augments - right side */}
      <circle cx="98" cy="45" r="6" fill="url(#brassAccent)" />
      <circle cx="98" cy="45" r="3" fill="#1a1a1a" />
      <line x1="92" y1="45" x2="85" y2="50" stroke="url(#brassAccent)" strokeWidth="2" />

      {/* Top cogitator unit */}
      <rect x="50" y="8" width="20" height="10" rx="2" fill="url(#brassAccent)" />
      <circle cx="55" cy="13" r="2" fill="var(--cogitator-green)">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="65" cy="13" r="2" fill="var(--cogitator-green)">
        <animate
          attributeName="opacity"
          values="1;0.3;1"
          dur="0.5s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Wiring/cables */}
      <path
        d="M22 51 Q15 70 20 90"
        stroke="#2a2a2a"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M98 51 Q105 70 100 90"
        stroke="#2a2a2a"
        strokeWidth="3"
        fill="none"
      />

      {/* Scanner beam from eyes (animated) */}
      <g opacity="0.4">
        <path
          d="M45 55 L30 80 L60 80 Z"
          fill="var(--cogitator-green)"
        >
          <animate
            attributeName="opacity"
            values="0;0.3;0"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M75 55 L60 80 L90 80 Z"
          fill="var(--cogitator-green)"
        >
          <animate
            attributeName="opacity"
            values="0;0.3;0"
            dur="3s"
            repeatCount="indefinite"
            begin="1.5s"
          />
        </path>
      </g>
    </svg>
  );
}

// ============================================================================
// Miniscan loading - Spinning servo-skull
// ============================================================================

function ServoSkullLoading({ phrase }: { phrase: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'var(--void-black)' }}>
      {/* Scanline overlay */}
      <div className="scanline" />

      <div className="relative w-full max-w-md px-4">
        {/* Floating servo-skull with bob animation */}
        <div className="relative flex flex-col items-center">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            style={{
              filter: 'drop-shadow(0 0 20px var(--cogitator-green-glow))',
            }}
          >
            <ServoSkull />
          </motion.div>

          {/* Spinning cog behind skull */}
          <motion.div
            className="absolute top-0 w-32 h-32 text-brass opacity-20"
            animate={{ rotate: -360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L10.5 5.5L8 6L9.5 8.5L9 11L11.5 10L14 11L13.5 8.5L15 6L12.5 5.5L12 3M12 8C10.3 8 9 9.3 9 11S10.3 14 12 14 15 12.7 15 11 13.7 8 12 8M7 13C6.4 13 6 13.4 6 14S6.4 15 7 15 8 14.6 8 14 7.6 13 7 13M17 13C16.4 13 16 13.4 16 14S16.4 15 17 15 18 14.6 18 14 17.6 13 17 13M10 18C9.4 18 9 18.4 9 19S9.4 20 10 20 11 19.6 11 19 10.6 18 10 18M14 18C13.4 18 13 18.4 13 19S13.4 20 14 20 15 19.6 15 19 14.6 18 14 18Z" />
            </svg>
          </motion.div>

          {/* Loading text */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phrase}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <motion.h2
                  className="text-xl font-bold auspex-text gothic-text tracking-wider"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {phrase}
                </motion.h2>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Progress bar */}
          <div className="mt-6 w-64 h-2 bg-void-black border border-cogitator-green-dim rounded-full overflow-hidden gothic-frame">
            <motion.div
              className="h-full bg-cogitator-green"
              style={{
                boxShadow: '0 0 10px var(--cogitator-green-glow)',
              }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          {/* Status text */}
          <motion.div
            className="mt-3 text-xs text-brass cyber-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            &#9670; PROCESSING &#9670;
          </motion.div>
        </div>

        {/* CRT flicker effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none bg-cogitator-green/5"
          animate={{ opacity: [0, 0.1, 0] }}
          transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 2 }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// Inspiration loading - Swirling warp vortex
// ============================================================================

function WarpVortexLoading({ phrase }: { phrase: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center void-bg">
      <div className="relative w-full max-w-md px-4">
        {/* Starfield particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Vortex container */}
        <div className="relative flex flex-col items-center">
          {/* Swirling vortex layers */}
          <div className="relative w-48 h-48 mb-8">
            {/* Outer layer */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background: 'conic-gradient(from 0deg, var(--warp-purple), var(--warp-pink), var(--warp-teal), var(--warp-purple))',
                filter: 'blur(20px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Middle layer */}
            <motion.div
              className="absolute inset-8 rounded-full opacity-50"
              style={{
                background: 'conic-gradient(from 180deg, var(--warp-teal), var(--warp-purple), var(--warp-pink), var(--warp-teal))',
                filter: 'blur(15px)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner layer */}
            <motion.div
              className="absolute inset-16 rounded-full opacity-70"
              style={{
                background: 'radial-gradient(circle, white, var(--warp-purple))',
                filter: 'blur(10px)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: 360,
              }}
              transition={{
                scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
              }}
            />

            {/* Energy bolts */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-16 bg-gradient-to-b from-transparent via-white to-transparent"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'top center',
                }}
                animate={{
                  rotate: [i * 45, i * 45 + 360],
                  opacity: [0, 1, 0],
                  scaleY: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Loading phrase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phrase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="warp-text text-lg font-bold mb-4 gothic-text">
                {phrase}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Ethereal glow bar */}
          <div className="w-full max-w-xs h-2 rounded-full overflow-hidden mt-4 warp-border bg-void-blue">
            <motion.div
              className="h-full warp-gradient"
              style={{
                boxShadow: '0 0 15px var(--ethereal-glow)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>

          {/* Sub-text */}
          <motion.div
            className="mt-4 text-warp-purple-light text-sm font-medium gothic-text"
            animate={{
              opacity: [0.5, 1, 0.5],
              textShadow: [
                '0 0 10px var(--ethereal-glow)',
                '0 0 20px var(--ethereal-glow)',
                '0 0 10px var(--ethereal-glow)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            &#10023; THE WARP STIRS &#10023;
          </motion.div>
        </div>

        {/* Pulsing ethereal overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(circle, var(--ethereal-glow), transparent)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}

export default LoadingAnimation;
