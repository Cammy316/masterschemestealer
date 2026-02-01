'use client';

import { useState } from 'react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface ColorSwatchProps {
  hex: string;
  name: string;
  percentage: number;
  rgb: [number, number, number];
  mode: 'miniature' | 'inspiration';
  index: number;
}

export function ColorSwatch({ hex, name, percentage, rgb, mode, index }: ColorSwatchProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { copied, copyToClipboard } = useCopyToClipboard(2000);

  const themeColors = mode === 'miniature'
    ? { text: 'text-green-500', border: 'border-green-500', glow: '#00FF66' }
    : { text: 'text-purple-400', border: 'border-purple-500', glow: '#8B5CF6' };

  const handleClick = () => {
    copyToClipboard(hex);
  };

  return (
    <div
      className="color-swatch-enter"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 2000)}
    >
      <button
        onClick={handleClick}
        className={`
          relative overflow-hidden rounded-lg border-2 transition-all duration-300 w-full
          ${isHovered ? `${themeColors.border} shadow-2xl scale-105 -translate-y-0.5` : `${themeColors.border} border-opacity-30 shadow-lg`}
          ${copied ? 'ring-4 ring-white ring-opacity-50' : ''}
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
        }}
      >
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 pointer-events-none shimmer-animation"
          style={{
            background: `linear-gradient(110deg, transparent 30%, ${themeColors.glow}30 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
          }}
        />

        {/* Flash effect when copied */}
        {copied && (
          <div className="absolute inset-0 bg-white pointer-events-none flash-animation" />
        )}

        <div className="relative p-4">
          {/* Color swatch */}
          <div
            className="w-full h-24 rounded-lg shadow-xl mb-3 transition-transform duration-300"
            style={{
              backgroundColor: hex,
              boxShadow: `0 8px 24px ${hex}40`,
              transform: copied ? 'scale(0.95)' : 'scale(1)',
            }}
          />

          {/* Color info */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className={`text-base font-bold ${themeColors.text}`}>{name}</h3>
              <span className="text-xs text-gray-500">{percentage}%</span>
            </div>
            <div>
              <code className={`text-sm font-mono ${themeColors.text}`}>
                {copied ? '✓ Copied' : hex}
              </code>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              RGB: {rgb.join(', ')}
            </div>
          </div>
        </div>

        {/* Energy glow at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 energy-pulse-animation"
          style={{
            background: `linear-gradient(90deg, transparent, ${hex}, transparent)`,
            boxShadow: `0 0 20px ${hex}`,
          }}
        />
      </button>
    </div>
  );
}

/**
 * Grid container for color swatches
 */
interface Color {
  hex: string;
  name: string;
  percentage: number;
  rgb: [number, number, number];
}

interface ColorSwatchGridProps {
  colors: Color[];
  mode: 'miniature' | 'inspiration';
}

export function ColorSwatchGrid({ colors, mode }: ColorSwatchGridProps) {
  const { copied, copyToClipboard } = useCopyToClipboard(3000);

  const handleCopyAll = () => {
    const formatted = colors.map(c => `${c.name}: ${c.hex}`).join('\n');
    copyToClipboard(formatted);
  };

  const themeColors = mode === 'miniature'
    ? { title: 'text-green-500', button: 'bg-green-600 hover:bg-green-700 border-green-500' }
    : { title: 'text-purple-400', button: 'bg-purple-600 hover:bg-purple-700 border-purple-500' };

  return (
    <div className="space-y-6">
      {/* Title */}
      <h2 className={`text-xl font-bold ${themeColors.title} text-center`}>
        {mode === 'miniature' ? '◆ DETECTED COLOURS ◆' : '✦ EXTRACTED ESSENCE ✦'}
      </h2>

      {/* Grid - responsive: 2 cols mobile, 3 cols tablet, 4 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {colors.map((color, index) => (
          <ColorSwatch
            key={color.hex}
            hex={color.hex}
            name={color.name}
            percentage={color.percentage}
            rgb={color.rgb}
            mode={mode}
            index={index}
          />
        ))}
      </div>

      {/* Copy All button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={handleCopyAll}
          className={`px-6 py-3 rounded-lg font-bold text-white border-2 transition-all min-h-[52px] ${themeColors.button} ${
            copied ? 'ring-4 ring-white ring-opacity-30' : ''
          }`}
        >
          {copied ? '✓ Copied All Hex Codes' : 'Copy All Hex Codes'}
        </button>
      </div>
    </div>
  );
}
