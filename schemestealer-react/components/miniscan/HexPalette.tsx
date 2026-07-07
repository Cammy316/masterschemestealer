'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HexChip } from '../shared/HexChip';

interface HexPaletteProps {
  colors: {
    hex: string;
    family?: string;
    percentage?: number;
  }[];
  title?: string;
  onColorClick?: (index: number) => void;
}

export function HexPalette({ colors, title = '◆ DATA CORE EXTRACT ◆', onColorClick }: HexPaletteProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      {title && (
        <motion.h2
          className="text-xl font-bold gothic-text text-center auspex-text text-shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
      )}

      {/* Hex Data Bus Grid */}
      <motion.div
        className="flex flex-wrap justify-center gap-6 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* Background circuit lines connecting them (fake visual) */}
        <div className="absolute top-1/2 left-8 right-8 h-px bg-cogitator-green/30 -translate-y-1/2 z-0 hidden md:block" />

        {colors.map((color, index) => (
          <motion.div
            key={index}
            className="relative z-10 flex flex-col items-center"
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
            {/* Hex node container */}
            <motion.div
              className="relative group cursor-pointer"
              onClick={() => onColorClick?.(index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Outer targeting bracket */}
              <motion.div 
                className="absolute -inset-2 border border-cogitator-green/20 rounded-lg pointer-events-none"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                style={{ 
                  clipPath: 'polygon(0 0, 20% 0, 20% 10%, 10% 10%, 10% 20%, 0 20%, 0 0, 80% 0, 100% 0, 100% 20%, 90% 20%, 90% 10%, 80% 10%, 80% 0, 100% 80%, 100% 100%, 80% 100%, 80% 90%, 90% 90%, 90% 80%, 100% 80%, 0 100%, 20% 100%, 20% 90%, 10% 90%, 10% 80%, 0 80%, 0 100%)' 
                }}
              />

              {/* The actual color hex */}
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 shadow-[0_0_15px_rgba(0,255,65,0.2)] flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_0_25px_var(--cogitator-green)] group-hover:animate-[pulse-glow_1s_ease-in-out_infinite]"
                style={{
                  backgroundColor: color.hex,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  border: '2px solid var(--cogitator-green)',
                  color: color.hex, // pulse-glow needs currentColor
                }}
              >
                <div className="absolute inset-0 border-2 border-white/20" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
              </div>

              {/* Percentage badge */}
              {color.percentage !== undefined && (
                <div className="absolute -bottom-1 -right-1 bg-black border border-cogitator-green text-cogitator-green text-[10px] font-mono px-1 font-bold shadow-[0_0_5px_rgba(0,255,65,0.5)]">
                  {color.percentage.toFixed(0)}%
                </div>
              )}
            </motion.div>

            {/* Data readout */}
            <div className="mt-4 text-center">
              <div className="text-xs font-bold text-white/90 gothic-text tracking-wider uppercase mb-1">
                {color.family || 'Unknown'}
              </div>
              <div className="text-[10px] text-cogitator-green-dim font-mono flex items-center gap-1 justify-center">
                <span className="w-1 h-1 bg-cogitator-green rounded-full animate-pulse" />
                {color.hex}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary text */}
      <motion.p
        className="text-center text-[10px] text-cogitator-green-dim font-mono tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        [ {colors.length} CORE SIGNATURES EXTRACTED FROM TARGET ]
      </motion.p>
    </div>
  );
}

export default HexPalette;
