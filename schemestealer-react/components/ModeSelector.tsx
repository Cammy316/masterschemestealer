/**
 * ModeSelector - Imperial Command Terminal / Mission Select
 * Professional two-column layout with W40K theming
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import type { ScanMode } from '@/lib/types';

export function ModeSelector() {
  const router = useRouter();
  const setMode = useAppStore((state) => state.setMode);

  const handleModeSelect = (mode: ScanMode) => {
    setMode(mode);
    router.push(`/${mode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-void-black relative overflow-hidden">
      {/* Subtle starfield background */}
      <div className="starfield-bg fixed inset-0 opacity-30" />

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold gothic-text mb-3 header-text"
            style={{
              color: 'var(--imperial-gold)',
              letterSpacing: '0.15em',
            }}
          >
            ═══ SCHEMESTEAL ═══
          </motion.h1>
          <motion.p
            className="text-brass/70 tech-text text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Machine Spirit Initialized
          </motion.p>

          {/* Blinking cursor effect */}
          <motion.span
            className="inline-block w-2 h-4 bg-cogitator-green ml-1"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </motion.div>

        {/* Mission Select Cards - Two Column Layout */}
        <motion.div
          className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Miniscan Card - Left */}
          <motion.button
            onClick={() => handleModeSelect('miniature')}
            className="group relative rounded-xl overflow-hidden touch-target textured"
            style={{
              background: 'linear-gradient(135deg, #0d1a0d 0%, #1a2a1a 100%)',
              border: '1px solid rgba(0, 255, 65, 0.3)',
            }}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(0, 255, 65, 0.6)',
              boxShadow: '0 0 30px rgba(0, 255, 65, 0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Scanline effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)',
              }}
            />

            <div className="relative z-10 p-6 md:p-8 flex flex-col items-center min-h-[320px] justify-between">
              {/* Icon */}
              <motion.div
                className="mb-4"
                whileHover={{
                  filter: 'drop-shadow(0 0 20px var(--cogitator-green))',
                  scale: 1.1,
                }}
                transition={{ duration: 0.3 }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="1.5">
                  <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="9" cy="10" r="1.5" fill="var(--cogitator-green)" />
                  <circle cx="15" cy="10" r="1.5" fill="var(--cogitator-green)" />
                  <path d="M8 17h8v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="6" r="0.5" fill="var(--brass)" />
                  <path d="M9 14h6" strokeLinecap="round" />
                </svg>
              </motion.div>

              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold gothic-text mb-2 text-shadow" style={{ color: 'var(--cogitator-green)' }}>
                  MINISCAN
                </h2>
                <h3 className="text-lg font-semibold gothic-text mb-3" style={{ color: 'var(--brass)' }}>
                  PROTOCOL
                </h3>
                <p className="text-sm text-cogitator-green-dim tech-text leading-relaxed">
                  Identify paint colors on completed miniatures
                </p>
              </div>

              {/* Features */}
              <div className="w-full space-y-2 text-left mb-4">
                <div className="flex items-start gap-2 text-xs text-white/70 tech-text">
                  <span className="text-cogitator-green">◆</span>
                  <span>Scan painted models</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/70 tech-text">
                  <span className="text-cogitator-green">◆</span>
                  <span>Detect 3-5 key colors</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/70 tech-text">
                  <span className="text-cogitator-green">◆</span>
                  <span>Match to paint brands</span>
                </div>
              </div>

              {/* Action indicator */}
              <motion.div
                className="w-full py-2 px-4 rounded border border-cogitator-green/50 bg-cogitator-green/5"
                whileHover={{ backgroundColor: 'rgba(0, 255, 65, 0.1)' }}
              >
                <span className="text-cogitator-green font-bold cyber-text text-sm">
                  ► INITIATE SCAN
                </span>
              </motion.div>
            </div>
          </motion.button>

          {/* Inspiration Card - Right */}
          <motion.button
            onClick={() => handleModeSelect('inspiration')}
            className="group relative rounded-xl overflow-hidden touch-target textured"
            style={{
              background: 'linear-gradient(135deg, #1a0d1a 0%, #2a1a2a 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
            }}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(139, 92, 246, 0.6)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Ethereal shimmer on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 p-6 md:p-8 flex flex-col items-center min-h-[320px] justify-between">
              {/* Icon */}
              <motion.div
                className="mb-4"
                whileHover={{
                  filter: 'drop-shadow(0 0 20px var(--warp-purple))',
                  scale: 1.1,
                }}
                transition={{ duration: 0.3 }}
              >
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--warp-purple-light)" strokeWidth="1.5">
                  <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="1" fill="var(--warp-purple-light)" />
                </svg>
              </motion.div>

              {/* Title */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold gothic-text mb-2 text-shadow" style={{ color: 'var(--warp-purple-light)' }}>
                  INSPIRATION
                </h2>
                <h3 className="text-lg font-semibold gothic-text mb-3" style={{ color: 'var(--warp-pink)' }}>
                  PROTOCOL
                </h3>
                <p className="text-sm text-warp-purple-light/70 tech-text leading-relaxed">
                  Extract colors from any image or artwork
                </p>
              </div>

              {/* Features */}
              <div className="w-full space-y-2 text-left mb-4">
                <div className="flex items-start gap-2 text-xs text-white/70 tech-text">
                  <span className="text-warp-purple-light">✦</span>
                  <span>Capture any inspiration</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/70 tech-text">
                  <span className="text-warp-purple-light">✦</span>
                  <span>Extract color palette</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/70 tech-tech">
                  <span className="text-warp-purple-light">✦</span>
                  <span>Find matching paints</span>
                </div>
              </div>

              {/* Action indicator */}
              <motion.div
                className="w-full py-2 px-4 rounded"
                style={{
                  border: '1px solid rgba(139, 92, 246, 0.5)',
                  background: 'rgba(139, 92, 246, 0.05)',
                }}
                whileHover={{
                  background: 'rgba(139, 92, 246, 0.1)',
                }}
              >
                <span className="text-warp-purple-light font-bold cyber-text text-sm">
                  ► CHANNEL WARP
                </span>
              </motion.div>
            </div>
          </motion.button>
        </motion.div>

        {/* Bottom instruction */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-xs text-brass/50 tech-text mb-2">
            ──── SELECT YOUR PROTOCOL ────
          </p>
          <p className="text-xs text-text-tertiary tech-text">
            Advanced chromatic analysis for miniature painters
          </p>
        </motion.div>
      </div>
    </div>
  );
}
