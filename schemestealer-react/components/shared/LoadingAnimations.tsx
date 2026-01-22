/**
 * Loading Animations - Theme-specific loading screens
 * Servo-skull for Miniscan, Warp vortex for Inspiration
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Gothic phrases for Miniscan loading
const COGITATOR_PHRASES = [
  'AWAKENING MACHINE SPIRIT...',
  'CONSULTING SACRED DATABANKS...',
  'ANALYZING PIGMENT SIGNATURES...',
  'CROSS-REFERENCING ADMINISTRATUM RECORDS...',
  'COMPILING HOLY FORMULATION...',
  'INVOKING THE OMNISSIAH...',
  'PROCESSING CHROMATIC DATA...',
  'VERIFYING SACRED TOMES...',
];

// Mystical phrases for Inspiration loading
const WARP_PHRASES = [
  'PIERCING THE VEIL...',
  'CHANNELING CHROMATIC ESSENCE...',
  'THE WARP REVEALS ITS SECRETS...',
  'MANIFESTING COLOR SPIRITS...',
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

// Miniscan loading - Spinning servo-skull
function ServoSkullLoading({ phrase }: { phrase: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-md px-4">
        {/* Scanline effect */}
        <div className="scanline" />

        {/* Servo-skull container */}
        <div className="relative flex flex-col items-center">
          {/* Skull icon (servo-skull effect) */}
          <motion.div
            className="mb-8 servo-skull-spin"
            style={{
              filter: 'drop-shadow(0 0 20px var(--cogitator-green-glow))',
            }}
          >
            <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="1.5">
              <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="10" r="1.5" fill="var(--cogitator-green)" />
              <circle cx="15" cy="10" r="1.5" fill="var(--cogitator-green)" />
              <path d="M8 17h8v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="6" r="0.5" fill="var(--brass)" />
              <path d="M9 14h6" strokeLinecap="round" />
            </svg>
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

          {/* Loading phrase */}
          <AnimatePresence mode="wait">
            <motion.div
              key={phrase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="auspex-text text-lg font-bold mb-4 gothic-text">
                {phrase}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-2 rounded-full overflow-hidden mt-4 gothic-frame">
            <motion.div
              className="h-full"
              style={{
                background: 'linear-gradient(to right, var(--cogitator-green-dark), var(--cogitator-green))',
                boxShadow: '0 0 10px var(--cogitator-green-glow)',
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          {/* Sub-text */}
          <motion.div
            className="mt-4 text-cogitator-green-dim text-sm cyber-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ◆ PROCESSING ◆
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

// Inspiration loading - Swirling warp vortex
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
            ✧ THE WARP STIRS ✧
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
