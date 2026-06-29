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
    <div className={`relative ${className}`} style={{ width: 120, height: 120 }}>
      {/* Glitch Animation Styles */}
      <style>{`
        @keyframes hologramGlitch {
          0% { clip-path: inset(10% 0 80% 0); transform: translate(-2px, 2px); }
          5% { clip-path: inset(40% 0 10% 0); transform: translate(2px, -2px); }
          10% { clip-path: inset(80% 0 5% 0); transform: translate(-2px, 0); }
          15% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
          100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
        }
        @keyframes floatHolo {
          0% { transform: translateY(0px) rotateY(0deg); }
          50% { transform: translateY(-5px) rotateY(5deg); }
          100% { transform: translateY(0px) rotateY(0deg); }
        }
        .holo-glitch {
          animation: floatHolo 4s ease-in-out infinite, hologramGlitch 3s infinite linear alternate-reverse;
        }
      `}</style>
      
      {/* Emitting Data Particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: 'var(--cogitator-green)', boxShadow: '0 0 5px var(--cogitator-green)' }}
          initial={{ x: 60, y: 60, opacity: 0 }}
          animate={{ 
            x: 60 + (Math.random() - 0.5) * 120, 
            y: 60 + (Math.random() - 0.5) * 120, 
            opacity: [0, 1, 0],
            scale: [1, 2, 0]
          }}
          transition={{ 
            duration: 1.5 + Math.random() * 2, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Hologram SVG */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        className="holo-glitch relative z-10"
        style={{ filter: 'drop-shadow(0 0 10px rgba(0,255,0,0.5))' }}
      >
        <defs>
          <filter id="holoGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g stroke="var(--cogitator-green)" strokeWidth="1.5" fill="none" filter="url(#holoGlow)">
          {/* Wireframe Cranium */}
          <path d="M60 15 C35 15 20 35 20 55 C20 70 28 82 38 90 L38 100 L82 100 L82 90 C92 82 100 70 100 55 C100 35 85 15 60 15Z" strokeDasharray="6 3" />
          
          {/* Topographic Lines */}
          <path d="M60 25 C45 25 30 40 30 55" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M60 25 C75 25 90 40 90 55" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M60 35 C50 35 40 45 40 55" strokeWidth="0.5" strokeDasharray="2 2" />
          <path d="M60 35 C70 35 80 45 80 55" strokeWidth="0.5" strokeDasharray="2 2" />

          {/* Holographic Eyes */}
          <polygon points="35,50 45,45 55,50 45,65" fill="rgba(0,255,0,0.15)" stroke="var(--cogitator-green)" strokeWidth="1" />
          <polygon points="65,50 75,45 85,50 75,65" fill="rgba(0,255,0,0.15)" stroke="var(--cogitator-green)" strokeWidth="1" />
          
          {/* Glowing Lenses */}
          <circle cx="45" cy="53" r="4" fill="var(--cogitator-green)">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
          </circle>
          <circle cx="75" cy="53" r="4" fill="var(--cogitator-green)">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.2s" repeatCount="indefinite" />
          </circle>

          {/* Jaw & Teeth Wireframe */}
          <path d="M38 90 L38 105 L50 112 L70 112 L82 105 L82 90" strokeDasharray="4 2" />
          <line x1="45" y1="90" x2="45" y2="108" />
          <line x1="52" y1="90" x2="52" y2="110" />
          <line x1="60" y1="90" x2="60" y2="112" />
          <line x1="68" y1="90" x2="68" y2="110" />
          <line x1="75" y1="90" x2="75" y2="108" />

          {/* Holographic Mechadendrites */}
          <path d="M30 75 Q15 90 10 115" strokeDasharray="2 4" strokeWidth="1" />
          <path d="M25 65 Q5 80 15 110" strokeDasharray="4 2" strokeWidth="1" />
          <path d="M90 75 Q105 90 110 115" strokeDasharray="2 4" strokeWidth="1" />
          <path d="M95 65 Q115 80 105 110" strokeDasharray="4 2" strokeWidth="1" />

          {/* Scan Rings */}
          <circle cx="60" cy="60" r="55" strokeWidth="0.5" opacity="0.4" strokeDasharray="4 8">
            <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur="10s" repeatCount="indefinite" />
          </circle>
          <circle cx="60" cy="60" r="45" strokeWidth="0.5" opacity="0.5" strokeDasharray="15 5">
            <animateTransform attributeName="transform" type="rotate" from="360 60 60" to="0 60 60" dur="15s" repeatCount="indefinite" />
          </circle>
          
          {/* Grid lines through the skull to emphasize hologram */}
          <line x1="20" y1="55" x2="100" y2="55" strokeWidth="0.5" opacity="0.4" />
          <line x1="60" y1="15" x2="60" y2="100" strokeWidth="0.5" opacity="0.4" />
        </g>
      </svg>
    </div>
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

// Decorative starfield particle positions (percent-based) + timings.
function makeStarfield(count = 20) {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
}

function WarpVortexLoading({ phrase }: { phrase: string }) {
  // Generate particle positions once (not on every render — keeps them stable
  // and keeps the impure Math.random() calls out of the render body).
  const [particles] = useState(() => makeStarfield());
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center void-bg">
      <div className="relative w-full max-w-md px-4">
        {/* Starfield particles */}
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white"
              style={{ left: `${p.left}%`, top: `${p.top}%` }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
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

        {/* Pulsing ethereal overlay - restricted to the vortex area */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 pointer-events-none rounded-full -z-10"
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
