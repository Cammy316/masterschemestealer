/**
 * PaintResults - Displays paint matches grouped by brand
 * Supports multi-brand filtering and cart integration
 */

'use client';

import { useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import type { Paint } from '@/lib/types';
import { motion } from 'framer-motion';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PaintResultsProps {
  colorName: string;
  colorHex: string;
  paintMatches: {
    citadel: Paint[];
    vallejo: Paint[];
    armyPainter: Paint[];
  };
  mode: 'miniature' | 'inspiration';
}

export function PaintResults({
  colorName,
  colorHex,
  paintMatches,
  mode,
}: PaintResultsProps) {
  const { preferredBrands, addToCart, currentMode, currentScan } = useAppStore();

  // Filter paints based on selected brands
  const visiblePaints = useMemo(() => {
    if (preferredBrands.includes('all')) {
      return {
        citadel: paintMatches.citadel,
        vallejo: paintMatches.vallejo,
        armyPainter: paintMatches.armyPainter,
      };
    }

    return {
      citadel: preferredBrands.includes('citadel') ? paintMatches.citadel : [],
      vallejo: preferredBrands.includes('vallejo') ? paintMatches.vallejo : [],
      armyPainter: preferredBrands.includes('army-painter')
        ? paintMatches.armyPainter
        : [],
    };
  }, [paintMatches, preferredBrands]);

  const themeColors =
    mode === 'miniature'
      ? {
          header: 'text-green-500',
          border: 'border-green-500',
          bg: 'bg-green-600',
        }
      : {
          header: 'text-purple-400',
          border: 'border-purple-500',
          bg: 'bg-purple-600',
        };

  const brandData = [
    {
      key: 'citadel' as const,
      name: 'CITADEL',
      icon: '🏛️',
      paints: visiblePaints.citadel,
    },
    {
      key: 'vallejo' as const,
      name: 'VALLEJO',
      icon: '🎨',
      paints: visiblePaints.vallejo,
    },
    {
      key: 'armyPainter' as const,
      name: 'ARMY PAINTER',
      icon: '🖌️',
      paints: visiblePaints.armyPainter,
    },
  ].filter((brand) => brand.paints.length > 0);

  const handleAddToCart = (paint: Paint) => {
    addToCart(paint, currentMode || undefined, currentScan?.id);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Color header */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-lg shadow-xl border-2 border-gray-700"
          style={{ backgroundColor: colorHex }}
        />
        <div>
          <h3 className={`text-xl font-bold ${themeColors.header}`}>
            {colorName}
          </h3>
          <p className="text-gray-400 text-sm font-mono">{colorHex}</p>
        </div>
      </div>

      {/* Paint matches grouped by brand */}
      {brandData.map((brand) => (
        <motion.div
          key={brand.key}
          className={`border-2 ${themeColors.border} rounded-lg p-4 bg-gray-900/50`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {/* Brand header */}
          <h4
            className={`text-lg font-bold ${themeColors.header} mb-3 flex items-center gap-2`}
          >
            <span>{brand.icon}</span>
            <span>{brand.name}</span>
          </h4>

          {/* Paint list */}
          <div className="space-y-2">
            {brand.paints.map((paint, index) => (
              <PaintItemWithCopy
                key={index}
                paint={paint}
                detectedColorHex={colorHex}
                mode={mode}
                onAddToCart={handleAddToCart}
                themeColors={themeColors}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      ))}

      {/* No results message */}
      {brandData.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No paints found for selected brands.</p>
          <p className="text-sm mt-2">Try selecting "All Brands" above.</p>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Individual paint item with copy functionality
 */
function PaintItemWithCopy({
  paint,
  detectedColorHex,
  mode,
  onAddToCart,
  themeColors,
  index,
}: {
  paint: Paint;
  detectedColorHex: string;
  mode: 'miniature' | 'inspiration';
  onAddToCart: (paint: Paint) => void;
  themeColors: any;
  index: number;
}) {
  const { copied: copiedDetected, copyToClipboard: copyDetected } = useCopyToClipboard(2000);
  const { copied: copiedPaint, copyToClipboard: copyPaint } = useCopyToClipboard(2000);

  return (
    <motion.div
      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
    >
      {/* Paint swatch */}
      <div
        className="w-12 h-12 rounded-md shadow-md border border-gray-700 flex-shrink-0"
        style={{ backgroundColor: paint.hex }}
      />

      {/* Paint info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">
          {paint.name}
        </p>
        <p className="text-xs text-gray-400">{paint.brand}</p>
      </div>

      {/* Delta-E badge */}
      {paint.deltaE !== undefined && (
        <div
          className={`px-3 py-1 rounded-full ${themeColors.bg} bg-opacity-20 border ${themeColors.border}`}
        >
          <span className={`text-sm font-mono ${themeColors.header}`}>
            ΔE: {paint.deltaE.toFixed(1)}
          </span>
        </div>
      )}

      {/* Copy buttons */}
      <div className="flex flex-col gap-1">
        {/* Copy detected color */}
        <button
          onClick={() => copyDetected(detectedColorHex)}
          className="px-2 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors min-w-[70px]"
          title="Copy detected color hex"
        >
          {copiedDetected ? '✓ Copied' : 'Copy Match'}
        </button>

        {/* Copy paint hex */}
        <button
          onClick={() => copyPaint(paint.hex)}
          className="px-2 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors min-w-[70px]"
          title="Copy paint hex"
        >
          {copiedPaint ? '✓ Copied' : 'Copy Paint'}
        </button>
      </div>

      {/* Add to cart button */}
      <motion.button
        className={`px-4 py-2 rounded-lg ${themeColors.bg} text-white font-semibold text-sm hover:opacity-90 transition-opacity`}
        onClick={() => onAddToCart(paint)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Add
      </motion.button>
    </motion.div>
  );
}
