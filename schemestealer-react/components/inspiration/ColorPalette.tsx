/**
 * Colour Palette - Big beautiful swatches for Inspiration results
 * No reticles - just pure colour extraction from the image
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Color } from '@/lib/types';

interface ColorPaletteProps {
  colors: Color[];
  title?: string;
}

export function ColorPalette({ colors, title = '◆ EXTRACTED ESSENCE ◆' }: ColorPaletteProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      {title && (
        <motion.h2
          className="text-2xl font-bold gothic-text text-center warp-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      {/* Color swatches grid */}
      <motion.div
        className="flex flex-wrap justify-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: 0.3 + index * 0.1,
              type: 'spring',
              stiffness: 300,
              damping: 20,
            }}
          >
            {/* Swatch container with ethereal glow and floating animation */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3 + ((index * 13) % 100) / 100,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.2,
              }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-xl opacity-60"
                style={{ backgroundColor: color.hex }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }}
              />

              {/* Main orb */}
              <div 
                className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-md"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${color.hex}, #000000)`,
                }}
              >
                {/* Specular highlight for glass effect */}
                <div className="absolute top-[10%] left-[15%] w-[30%] h-[20%] rounded-full bg-white/20 blur-[2px] rotate-[-25deg]" />
              </div>

              {/* Percentage badge — iron disc (void-black + thin warp edge) */}
              {color.percentage !== undefined && (
                <div
                  className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shadow-lg"
                  style={{
                    background: 'var(--void-black)',
                    border: '1px solid var(--warp-purple)',
                    color: 'var(--warp-purple-light)',
                  }}
                >
                  {color.percentage.toFixed(0)}%
                </div>
              )}
            </motion.div>

            {/* Color info */}
            <div className="mt-3 text-center">
              <div className="text-sm font-bold text-warp-purple-light gothic-text">
                {color.family || 'Unknown'}
              </div>
              <div className="text-xs text-warp-teal font-mono mt-1">
                {color.hex}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary text */}
      <motion.p
        className="text-center text-sm text-white/60 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        {colors.length} chromatic signatures manifested from the Warp
      </motion.p>
    </div>
  );
}

export default ColorPalette;
