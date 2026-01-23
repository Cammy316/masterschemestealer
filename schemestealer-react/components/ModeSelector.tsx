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
import { GrimdarkSkullIcon } from '@/components/icons/GrimdarkSkull';

export function ModeSelector() {
  const router = useRouter();
  const setMode = useAppStore((state) => state.setMode);
  const offlineMode = useAppStore((state) => state.offlineMode);
  const setOfflineMode = useAppStore((state) => state.setOfflineMode);

  const handleModeSelect = (mode: ScanMode) => {
    setMode(mode);
    router.push(`/${mode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-void-black relative overflow-hidden">
      {/* Subtle starfield background */}
      <div className="starfield-bg fixed inset-0 opacity-30" />

      {/* Scan line overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"
          style={{
            animation: 'scan-line 8s linear infinite',
          }}
        />
      </div>

      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-3 py-4">
        {/* System Status Indicator */}
        <motion.div
          className="mb-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-block px-3 py-1 border border-green-500/30 rounded-full bg-black/50">
            <span className="text-green-500 text-xs font-mono tracking-wider">
              {'>'} MACHINE SPIRIT STATUS: <span className="text-green-400">ACTIVE</span>
            </span>
          </div>
        </motion.div>

        {/* Offline Mode Toggle */}
        <motion.div
          className="mb-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <button
            onClick={() => setOfflineMode(!offlineMode)}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border-2 transition-all duration-300 touch-target"
            style={{
              borderColor: offlineMode ? 'rgba(59, 130, 246, 0.5)' : 'rgba(156, 163, 175, 0.3)',
              backgroundColor: offlineMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 0, 0, 0.3)',
            }}
          >
            <span className="text-xs font-mono tracking-wider text-gray-400">
              DETECTION MODE:
            </span>

            {/* Toggle Switch */}
            <div className="relative">
              <motion.div
                className="w-12 h-6 rounded-full relative"
                style={{
                  backgroundColor: offlineMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(156, 163, 175, 0.2)',
                }}
                animate={{
                  backgroundColor: offlineMode
                    ? 'rgba(59, 130, 246, 0.3)'
                    : 'rgba(156, 163, 175, 0.2)',
                }}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full"
                  style={{
                    backgroundColor: offlineMode ? '#3B82F6' : '#9CA3AF',
                    boxShadow: offlineMode
                      ? '0 0 10px rgba(59, 130, 246, 0.5)'
                      : '0 0 5px rgba(0, 0, 0, 0.3)',
                  }}
                  animate={{
                    x: offlineMode ? 24 : 2,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </motion.div>
            </div>

            {/* Status Label */}
            <span
              className="text-xs font-bold tracking-wider"
              style={{
                color: offlineMode ? '#3B82F6' : '#9CA3AF',
              }}
            >
              {offlineMode ? '⚡ OFFLINE' : '🌐 ONLINE'}
            </span>
          </button>

          {/* Info text */}
          <motion.p
            className="text-xs text-gray-500 mt-1.5 font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {offlineMode
              ? '⚡ Lightning-fast local analysis • No network required'
              : '🌐 Enhanced accuracy • Cloud processing'}
          </motion.p>
        </motion.div>

        {/* Header - Compact and Responsive */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="font-bold gothic-text mb-1 header-text responsive-header flex items-center justify-center gap-2"
            style={{
              color: 'var(--imperial-gold)',
            }}
          >
            <span className="text-amber-500/80">⚙</span>
            <span>═══ SCHEMESTEALER ═══</span>
            <span className="text-amber-500/80">⚙</span>
          </motion.h1>
          <motion.p
            className="text-brass/70 tech-text responsive-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Chromatic Analysis & Pattern Recognition System
          </motion.p>
        </motion.div>

        {/* Mission Select Cards - Side by side on ALL screens including mobile */}
        <motion.div
          className="w-full flex gap-3 mb-4"
          style={{ maxHeight: '70vh' }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Miniscan Card - Left */}
          <motion.button
            onClick={() => handleModeSelect('miniature')}
            className="group relative rounded-xl overflow-hidden touch-target textured flex-1"
            style={{
              background: 'linear-gradient(135deg, #0d1a0d 0%, #1a2a1a 100%)',
              border: '2px solid rgba(0, 255, 65, 0.3)',
            }}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(0, 255, 65, 0.6)',
              boxShadow: '0 0 30px rgba(0, 255, 65, 0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500 pointer-events-none" />

            {/* Scanline effect on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)',
              }}
            />

            {/* Pulse ring animation on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-green-500 opacity-0 group-hover:opacity-100 pointer-events-none"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full">
              {/* Icon */}
              <div className="mb-3">
                <GrimdarkSkullIcon className="w-16 h-16" />
              </div>

              {/* Title */}
              <h2 className="responsive-section-title font-bold gothic-text mb-1 text-shadow" style={{ color: 'var(--cogitator-green)' }}>
                MINISCAN
              </h2>
              <p className="text-cogitator-green/60 responsive-label mb-2">PROTOCOL</p>

              <p className="text-gray-400 responsive-label text-center mb-3 leading-relaxed">
                Identify paints on your miniatures
              </p>

              <div className="px-3 py-2 border border-cogitator-green/50 rounded responsive-label">
                <span className="text-cogitator-green font-semibold cyber-text">
                  INITIATE SCAN
                </span>
              </div>
            </div>
          </motion.button>

          {/* Inspiration Card - Right */}
          <motion.button
            onClick={() => handleModeSelect('inspiration')}
            className="group relative rounded-xl overflow-hidden touch-target textured flex-1"
            style={{
              background: 'linear-gradient(135deg, #1a0d1a 0%, #2a1a2a 100%)',
              border: '2px solid rgba(139, 92, 246, 0.3)',
            }}
            whileHover={{
              scale: 1.02,
              borderColor: 'rgba(139, 92, 246, 0.6)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-purple-500 pointer-events-none" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-500 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-purple-500 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-purple-500 pointer-events-none" />

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

            {/* Pulse ring animation on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-purple-500 opacity-0 group-hover:opacity-100 pointer-events-none"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <div className="relative z-10 p-4 flex flex-col items-center justify-center h-full">
              {/* Icon */}
              <div className="mb-3">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--warp-purple-light)" strokeWidth="1.5">
                  <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="1" fill="var(--warp-purple-light)" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="responsive-section-title font-bold gothic-text mb-1 text-shadow" style={{ color: 'var(--warp-purple-light)' }}>
                INSPIRATION
              </h2>
              <p className="text-purple-400/60 responsive-label mb-2">PROTOCOL</p>

              <p className="text-gray-400 responsive-label text-center mb-3 leading-relaxed">
                Extract colors from any image
              </p>

              <div className="px-3 py-2 border border-purple-500/50 rounded responsive-label">
                <span className="text-purple-400 font-semibold cyber-text">
                  CHANNEL WARP
                </span>
              </div>
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
          <p className="responsive-label text-gray-500 tech-text">
            SELECT YOUR PROTOCOL
          </p>
        </motion.div>
      </div>
    </div>
  );
}
