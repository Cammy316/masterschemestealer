/**
 * Magical Color Swatch Component for Inspiration Mode
 * Features shimmer effect, 3D lift on hover, and copy functionality
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ColorSwatchProps {
  color: {
    hex: string;
    name: string;
    percentage: number;
    rgb: [number, number, number];
  };
  index: number;
  onCopy: (hex: string) => void;
  mode?: 'miniscan' | 'inspiration';
}

export function ColorSwatch({ color, index, onCopy, mode = 'inspiration' }: ColorSwatchProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(color.hex);
      onCopy(color.hex);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const themeColors = mode === 'miniscan'
    ? {
        border: 'border-green-500/30',
        borderHover: 'border-green-400/80',
        shadowHover: 'shadow-green-500/30',
        text: 'text-green-200',
        textDim: 'text-green-400/70',
        textMuted: 'text-green-400/50',
        gradient: 'from-gray-900/95 to-gray-800/95',
        glow: 'ring-green-500',
      }
    : {
        border: 'border-purple-500/30',
        borderHover: 'border-purple-400/80',
        shadowHover: 'shadow-purple-500/30',
        text: 'text-purple-200',
        textDim: 'text-purple-400/70',
        textMuted: 'text-purple-400/50',
        gradient: 'from-gray-900/95 to-gray-800/95',
        glow: 'ring-purple-500',
      };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 100,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 3000)}
    >
      <motion.div
        className={`relative overflow-hidden border-2 rounded-xl transition-all duration-300 ${
          isHovered
            ? `${themeColors.borderHover} shadow-2xl ${themeColors.shadowHover} scale-105 -translate-y-2`
            : `${themeColors.border} shadow-lg`
        }`}
        style={{
          background: `linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))`,
        }}
      >
        {/* Shimmer effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: mode === 'miniscan'
              ? 'linear-gradient(110deg, transparent 30%, rgba(0, 255, 100, 0.5) 50%, transparent 70%)'
              : 'linear-gradient(110deg, transparent 30%, rgba(139, 92, 246, 0.5) 50%, transparent 70%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 3s infinite',
          }}
        />

        <div className="relative p-6">
          {/* Color swatch with flash effect - now clickable */}
          <div className="relative mb-4 group">
            <motion.button
              onClick={handleCopy}
              className={`w-full h-32 rounded-lg shadow-xl transition-all duration-300 cursor-pointer ${
                copied ? `ring-4 ${themeColors.glow} animate-pulse-once` : ''
              }`}
              style={{
                backgroundColor: color.hex,
                boxShadow: `0 8px 32px ${color.hex}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              title={`Click to copy ${color.hex}`}
            />

            {/* Flash effect when copied */}
            {copied && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0] }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white rounded-lg"
              />
            )}
          </div>

          {/* Color info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className={`responsive-body font-bold ${themeColors.text}`}>
                {color.name}
              </h3>
              <span className={`text-xs ${themeColors.textDim} font-mono`}>
                {color.percentage}%
              </span>
            </div>

            <div className="flex items-center justify-center gap-2">
              <code className={`text-sm font-mono ${themeColors.text} font-semibold transition-all duration-200`}>
                {copied ? '✓ Copied' : color.hex}
              </code>
            </div>

            {/* RGB values */}
            <div className={`text-xs ${themeColors.textMuted} font-mono`}>
              RGB: {color.rgb.join(', ')}
            </div>
          </div>
        </div>

        {/* Energy glow at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-60"
          style={{
            background: `linear-gradient(90deg, transparent, ${color.hex}, transparent)`,
            boxShadow: `0 0 20px ${color.hex}`,
          }}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Grid container for color swatches
 */
export function ColorSwatchGrid({
  colors,
  mode = 'inspiration',
  onCopy,
  onCopyAll,
}: {
  colors: Array<{ hex: string; name: string; percentage: number; rgb: [number, number, number] }>;
  mode?: 'miniscan' | 'inspiration';
  onCopy: (hex: string) => void;
  onCopyAll: () => void;
}) {
  const themeColors = mode === 'miniscan'
    ? {
        title: 'text-green-400',
        symbol: '⚙',
        button: 'border-green-500 text-green-400 hover:bg-green-500/10',
      }
    : {
        title: 'text-purple-400',
        symbol: '✦',
        button: 'border-purple-500 text-purple-400 hover:bg-purple-500/10',
      };

  return (
    <div className="mb-8">
      <h2 className={`responsive-section font-bold ${themeColors.title} mb-6 text-center flex items-center justify-center`}>
        <span className="text-decoration-symbol">{themeColors.symbol}</span>
        EXTRACTED ESSENCE
        <span className="text-decoration-symbol">{themeColors.symbol}</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {colors.map((color, index) => (
          <ColorSwatch
            key={color.hex}
            color={color}
            index={index}
            mode={mode}
            onCopy={onCopy}
          />
        ))}
      </div>

      {/* Copy all button */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: colors.length * 0.1 + 0.2 }}
      >
        <motion.button
          onClick={onCopyAll}
          className={`px-6 py-3 rounded-lg border-2 font-bold responsive-body transition-colors ${themeColors.button}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-2">📋</span>
          COPY ALL HEX CODES
        </motion.button>
      </motion.div>
    </div>
  );
}
