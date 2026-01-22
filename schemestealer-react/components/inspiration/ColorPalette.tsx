/**
 * Color Palette - Big beautiful swatches for Inspiration results
 * No reticles - just pure color extraction from the image
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
            {/* Swatch container with ethereal glow */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                style={{ backgroundColor: color.hex }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />

              {/* Main swatch */}
              <div className="relative warp-border rounded-2xl p-1">
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl"
                  style={{ backgroundColor: color.hex }}
                />
              </div>

              {/* Percentage badge */}
              {color.percentage !== undefined && (
                <motion.div
                  className="absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold warp-gradient"
                  style={{
                    boxShadow: '0 0 15px var(--ethereal-glow)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 10px var(--ethereal-glow)',
                      '0 0 20px var(--ethereal-glow)',
                      '0 0 10px var(--ethereal-glow)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {color.percentage.toFixed(0)}%
                </motion.div>
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
