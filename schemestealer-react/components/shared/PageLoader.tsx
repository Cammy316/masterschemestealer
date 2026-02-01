/**
 * PageLoader Component
 * Reusable full-page loading screen with W40K themed animations
 * Cogwheel for Miniscan (Imperial), Warp portal for Inspiration (Chaos)
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

interface PageLoaderProps {
  /** Theme: 'miniature' for cogwheel, 'inspiration' for warp portal */
  theme?: 'miniature' | 'inspiration';
  /** Custom loading message (overrides rotating phrases) */
  message?: string;
  /** Show loader */
  isLoading?: boolean;
}

export function PageLoader({ theme = 'miniature', message, isLoading = true }: PageLoaderProps) {
  const [currentPhrase, setCurrentPhrase] = useState(0);
  const phrases = theme === 'miniature' ? COGITATOR_PHRASES : WARP_PHRASES;

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % phrases.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [phrases.length, isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {theme === 'miniature' ? (
            <CogwheelLoader phrase={message || phrases[currentPhrase]} />
          ) : (
            <WarpPortalLoader phrase={message || phrases[currentPhrase]} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Cogwheel/Servo-skull loader for Miniscan theme
 */
function CogwheelLoader({ phrase }: { phrase: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/95 backdrop-blur-sm">
      <div className="relative w-full max-w-md px-4">
        {/* Scanline effect */}
        <div className="scanline" />

        {/* Main loader container */}
        <div className="relative flex flex-col items-center">
          {/* Animated cogwheel */}
          <div className="relative w-32 h-32 mb-8">
            {/* Outer cog ring */}
            <motion.div
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <filter id="cogGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g filter="url(#cogGlow)" stroke="var(--cogitator-green)" strokeWidth="2" fill="none">
                  {/* Outer cog teeth */}
                  {[...Array(12)].map((_, i) => (
                    <rect
                      key={i}
                      x="46"
                      y="2"
                      width="8"
                      height="12"
                      transform={`rotate(${i * 30} 50 50)`}
                      fill="var(--cogitator-green)"
                      opacity="0.8"
                    />
                  ))}
                  <circle cx="50" cy="50" r="35" />
                  <circle cx="50" cy="50" r="25" />
                </g>
              </svg>
            </motion.div>

            {/* Inner counter-rotating cog */}
            <motion.div
              className="absolute inset-6"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <g stroke="var(--brass)" strokeWidth="2" fill="none" opacity="0.6">
                  {[...Array(8)].map((_, i) => (
                    <rect
                      key={i}
                      x="44"
                      y="5"
                      width="12"
                      height="15"
                      transform={`rotate(${i * 45} 50 50)`}
                      fill="var(--brass)"
                      opacity="0.5"
                    />
                  ))}
                  <circle cx="50" cy="50" r="30" />
                </g>
              </svg>
            </motion.div>

            {/* Central skull icon */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ filter: 'drop-shadow(0 0 10px var(--cogitator-green-glow))' }}
            >
              <motion.svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--cogitator-green)"
                strokeWidth="1.5"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="9" cy="10" r="1.5" fill="var(--cogitator-green)" />
                <circle cx="15" cy="10" r="1.5" fill="var(--cogitator-green)" />
                <path d="M9 14h6" strokeLinecap="round" />
              </motion.svg>
            </div>
          </div>

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
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
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

/**
 * Warp Portal loader for Inspiration theme
 */
function WarpPortalLoader({ phrase }: { phrase: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center void-bg">
      <div className="relative w-full max-w-md px-4">
        {/* Starfield particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
          {/* Swirling warp portal */}
          <div className="relative w-48 h-48 mb-8">
            {/* Outer energy layer */}
            <motion.div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background: 'conic-gradient(from 0deg, var(--warp-purple), var(--warp-pink), var(--warp-teal), var(--warp-purple))',
                filter: 'blur(20px)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />

            {/* Middle counter-rotating layer */}
            <motion.div
              className="absolute inset-8 rounded-full opacity-50"
              style={{
                background: 'conic-gradient(from 180deg, var(--warp-teal), var(--warp-purple), var(--warp-pink), var(--warp-teal))',
                filter: 'blur(15px)',
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />

            {/* Inner core */}
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

          {/* Ethereal progress bar */}
          <div className="w-full max-w-xs h-2 rounded-full overflow-hidden mt-4 warp-border bg-void-blue">
            <motion.div
              className="h-full warp-gradient"
              style={{
                boxShadow: '0 0 15px var(--ethereal-glow)',
              }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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

export default PageLoader;
