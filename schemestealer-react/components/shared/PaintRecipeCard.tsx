/**
 * PaintRecipeCard - Displays paint recipes with per-color brand selection
 * Shows BASE -> SHADE -> HIGHLIGHT -> WASH recipe steps
 *
 * Enhanced with:
 * - Copy All button for clipboard
 * - Delta-E tooltip explanation
 * - Perfect Match badge (ΔE < 3)
 * - Color comparison view
 * - Recipe difficulty rating
 * - Owned paint toggle
 * - Screen reader announcements
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PaintRecipe, BrandRecipe, PaintMatch } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useOwnedPaints } from '@/hooks/useLocalStorage';
import { Tooltip, InfoTooltip } from '@/components/ui/Tooltip';

interface PaintRecipeCardProps {
  colorFamily: string;
  colorHex: string;
  paintRecipe: PaintRecipe;
  mode: 'miniature' | 'inspiration';
}

type BrandKey = 'citadel' | 'vallejo' | 'army_painter';

const BRANDS: { key: BrandKey; name: string; icon: string }[] = [
  { key: 'citadel', name: 'Citadel', icon: '🏛️' },
  { key: 'vallejo', name: 'Vallejo', icon: '🎨' },
  { key: 'army_painter', name: 'Army Painter', icon: '🖌️' },
];

const RECIPE_STEPS = [
  { key: 'base' as const, label: 'BASE', description: 'Foundation layer' },
  { key: 'shade' as const, label: 'SHADE', description: 'Recess shading' },
  { key: 'highlight' as const, label: 'HIGHLIGHT', description: 'Edge highlights' },
  { key: 'wash' as const, label: 'WASH', description: 'Optional wash' },
];

/**
 * Get recipe difficulty based on number of paints
 */
function getRecipeDifficulty(recipe: BrandRecipe): { level: number; label: string; stars: string } {
  const paintCount = [recipe.base, recipe.shade, recipe.highlight, recipe.wash].filter(Boolean).length;

  if (paintCount <= 2) {
    return { level: 1, label: 'Beginner', stars: '⭐' };
  } else if (paintCount <= 3) {
    return { level: 2, label: 'Intermediate', stars: '⭐⭐' };
  } else {
    return { level: 3, label: 'Advanced', stars: '⭐⭐⭐' };
  }
}

/**
 * Generate paint ID for tracking owned paints
 */
function getPaintId(brand: string, paintName: string): string {
  return `${brand}-${paintName}`.toLowerCase().replace(/\s+/g, '-');
}

export function PaintRecipeCard({
  colorFamily,
  colorHex,
  paintRecipe,
  mode,
}: PaintRecipeCardProps) {
  const [selectedBrand, setSelectedBrand] = useState<BrandKey>('citadel');
  const [showComparison, setShowComparison] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const { addToCart, currentMode, currentScan } = useAppStore();
  const { copied, copyToClipboard } = useCopyToClipboard(2000);
  const { isOwned, toggleOwnedPaint } = useOwnedPaints();

  // Screen reader announcement
  const [announcement, setAnnouncement] = useState('');

  const themeColors = useMemo(() =>
    mode === 'miniature'
      ? {
          primary: 'green',
          border: 'border-green-500',
          borderDim: 'border-green-500/30',
          bg: 'bg-green-600',
          bgDim: 'bg-green-600/20',
          text: 'text-green-500',
          textDim: 'text-green-500/70',
          hover: 'hover:bg-green-700',
        }
      : {
          primary: 'purple',
          border: 'border-purple-500',
          borderDim: 'border-purple-500/30',
          bg: 'bg-purple-600',
          bgDim: 'bg-purple-600/20',
          text: 'text-purple-400',
          textDim: 'text-purple-400/70',
          hover: 'hover:bg-purple-700',
        }
  , [mode]);

  const currentRecipe: BrandRecipe = useMemo(() =>
    paintRecipe[selectedBrand],
    [paintRecipe, selectedBrand]
  );

  const difficulty = useMemo(() =>
    getRecipeDifficulty(currentRecipe),
    [currentRecipe]
  );

  const handleAddToCart = useCallback((paint: PaintMatch) => {
    const brandName = BRANDS.find((b) => b.key === selectedBrand)?.name || selectedBrand;
    addToCart(
      {
        name: paint.name,
        brand: brandName,
        hex: paint.hex,
        type: paint.type,
      },
      currentMode || undefined,
      currentScan?.id
    );
    setAnnouncement(`${paint.name} added to cart`);
  }, [selectedBrand, addToCart, currentMode, currentScan?.id]);

  const copyRecipeToClipboard = useCallback(() => {
    const brandName = BRANDS.find((b) => b.key === selectedBrand)?.name || selectedBrand;
    const recipe = [
      `${colorFamily} Recipe (${brandName})`,
      '─────────────────────',
      currentRecipe.base ? `BASE: ${currentRecipe.base.name}` : 'BASE: -',
      currentRecipe.shade ? `SHADE: ${currentRecipe.shade.name}` : 'SHADE: -',
      currentRecipe.highlight ? `HIGHLIGHT: ${currentRecipe.highlight.name}` : 'HIGHLIGHT: -',
      currentRecipe.wash ? `WASH: ${currentRecipe.wash.name}` : 'WASH: -',
    ].join('\n');
    copyToClipboard(recipe);
    setAnnouncement('Recipe copied to clipboard');
  }, [colorFamily, currentRecipe, selectedBrand, copyToClipboard]);

  const handleBrandChange = useCallback((brand: BrandKey) => {
    setSelectedBrand(brand);
    const brandName = BRANDS.find((b) => b.key === brand)?.name || brand;
    setAnnouncement(`Switched to ${brandName} paints`);
  }, []);

  // Swipe gesture handlers for mobile brand switching
  const currentBrandIndex = BRANDS.findIndex((b) => b.key === selectedBrand);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentIndex = BRANDS.findIndex((b) => b.key === selectedBrand);
    let newIndex: number;

    if (direction === 'left') {
      // Swipe left = next brand
      newIndex = (currentIndex + 1) % BRANDS.length;
    } else {
      // Swipe right = previous brand
      newIndex = (currentIndex - 1 + BRANDS.length) % BRANDS.length;
    }

    setSwipeDirection(direction);
    handleBrandChange(BRANDS[newIndex].key);

    // Reset swipe direction after animation
    setTimeout(() => setSwipeDirection(null), 300);
  }, [selectedBrand, handleBrandChange]);

  const handleDragEnd = useCallback((
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const threshold = 50; // Minimum swipe distance
    const velocityThreshold = 200; // Minimum velocity

    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
      if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
        handleSwipe('left');
      } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
        handleSwipe('right');
      }
    }
  }, [handleSwipe]);

  return (
    <div className={`rounded-lg ${themeColors.border} border-2 overflow-hidden`}>
      {/* Screen Reader Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header with Copy All and Difficulty */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/90 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Tooltip content={`${difficulty.label} recipe with ${[currentRecipe.base, currentRecipe.shade, currentRecipe.highlight, currentRecipe.wash].filter(Boolean).length} paints`}>
            <span className="text-xs text-gray-400 cursor-help">
              {difficulty.stars}
            </span>
          </Tooltip>
          <span className="text-xs text-gray-500">{difficulty.label}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Color Comparison Toggle */}
          <Tooltip content="Compare detected color with paint matches">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className={`p-1.5 rounded text-xs transition-colors ${
                showComparison
                  ? `${themeColors.bg} text-white`
                  : 'bg-gray-700 text-gray-400 hover:text-white'
              }`}
              aria-pressed={showComparison}
              aria-label="Toggle color comparison"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="9" height="20" rx="1" />
                <rect x="13" y="2" width="9" height="20" rx="1" />
              </svg>
            </button>
          </Tooltip>

          {/* Copy All Button */}
          <motion.button
            onClick={copyRecipeToClipboard}
            className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${
              copied
                ? 'bg-green-600 text-white'
                : `bg-gray-700 text-gray-300 hover:bg-gray-600`
            }`}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy recipe to clipboard"
          >
            {copied ? (
              <>
                <span className="mr-1">✓</span>
                Copied
              </>
            ) : (
              <>
                <span className="mr-1">📋</span>
                Copy All
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Color Comparison Bar */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ColorComparison
              detectedColor={colorHex}
              matchColor={currentRecipe.base?.hex}
              deltaE={currentRecipe.base?.deltaE}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Selector Tabs */}
      <div className="flex bg-gray-900/80">
        {BRANDS.map((brand) => (
          <button
            key={brand.key}
            onClick={() => handleBrandChange(brand.key)}
            className={`flex-1 py-3 px-2 text-sm font-semibold transition-all touch-target ${
              selectedBrand === brand.key
                ? `${themeColors.bg} text-white`
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            aria-pressed={selectedBrand === brand.key}
          >
            <span className="mr-1">{brand.icon}</span>
            <span className="hidden sm:inline">{brand.name}</span>
          </button>
        ))}
      </div>

      {/* Recipe Steps - Swipeable on mobile */}
      <div className="p-4 space-y-3 bg-gray-900/50 overflow-hidden">
        {/* Swipe hint for mobile */}
        <div className="flex items-center justify-between text-xs text-gray-500 sm:hidden mb-2">
          <span>← Swipe to change brand →</span>
          <span className="text-gray-600">
            {currentBrandIndex + 1}/{BRANDS.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBrand}
            initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : swipeDirection === 'right' ? -50 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : swipeDirection === 'right' ? 50 : -10 }}
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="space-y-2 touch-pan-y"
          >
            {RECIPE_STEPS.map((step) => {
              const paint = currentRecipe[step.key];
              const brandName = BRANDS.find((b) => b.key === selectedBrand)?.name || selectedBrand;
              const paintId = paint ? getPaintId(brandName, paint.name) : '';

              return (
                <RecipeStepRow
                  key={step.key}
                  step={step}
                  paint={paint}
                  themeColors={themeColors}
                  onAddToCart={paint ? () => handleAddToCart(paint) : undefined}
                  isOwned={paint ? isOwned(paintId) : false}
                  onToggleOwned={paint ? () => toggleOwnedPaint(paintId) : undefined}
                  detectedColor={colorHex}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/**
 * Color Comparison Component
 */
interface ColorComparisonProps {
  detectedColor: string;
  matchColor?: string;
  deltaE?: number;
}

function ColorComparison({ detectedColor, matchColor, deltaE }: ColorComparisonProps) {
  return (
    <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-gray-400">Color Comparison</span>
        {deltaE !== undefined && deltaE > 0 && (
          <span className="text-xs text-gray-500">
            (ΔE: {deltaE.toFixed(1)})
          </span>
        )}
      </div>
      <div className="flex rounded-lg overflow-hidden h-8">
        <div
          className="flex-1 flex items-center justify-center text-xs font-semibold"
          style={{ backgroundColor: detectedColor }}
        >
          <span className="bg-black/40 px-2 py-0.5 rounded text-white">Detected</span>
        </div>
        <div
          className="flex-1 flex items-center justify-center text-xs font-semibold"
          style={{ backgroundColor: matchColor || '#333' }}
        >
          <span className="bg-black/40 px-2 py-0.5 rounded text-white">
            {matchColor ? 'Base Match' : 'No Match'}
          </span>
        </div>
      </div>
    </div>
  );
}

interface RecipeStepRowProps {
  step: { key: string; label: string; description: string };
  paint: PaintMatch | null;
  themeColors: {
    primary: string;
    border: string;
    borderDim: string;
    bg: string;
    bgDim: string;
    text: string;
    textDim: string;
    hover: string;
  };
  onAddToCart?: () => void;
  isOwned?: boolean;
  onToggleOwned?: () => void;
  detectedColor?: string;
}

function RecipeStepRow({
  step,
  paint,
  themeColors,
  onAddToCart,
  isOwned = false,
  onToggleOwned,
  detectedColor
}: RecipeStepRowProps) {
  if (!paint) {
    return (
      <div className="flex items-center gap-3 py-2 px-3 rounded bg-gray-800/50 opacity-50">
        <div className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center text-xs">
          —
        </div>
        <div className="flex-1">
          <span className={`text-xs font-bold ${themeColors.textDim}`}>{step.label}</span>
          <p className="text-xs text-gray-500">No match found</p>
        </div>
      </div>
    );
  }

  const isPerfectMatch = paint.deltaE !== undefined && paint.deltaE < 3;
  const isHighDeltaE = paint.deltaE !== undefined && paint.deltaE > 10;

  return (
    <div
      className={`flex items-center gap-3 py-2 px-3 rounded bg-gray-800/80 ${themeColors.borderDim} border ${
        isOwned ? 'ring-2 ring-green-500/30' : ''
      }`}
    >
      {/* Color Swatch */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded border border-gray-600 flex-shrink-0"
          style={{ backgroundColor: paint.hex }}
        />
        {/* Owned indicator */}
        {isOwned && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        )}
      </div>

      {/* Paint Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold ${themeColors.text} px-2 py-0.5 rounded ${themeColors.bgDim}`}
          >
            {step.label}
          </span>

          {/* Perfect Match Badge */}
          {isPerfectMatch && (
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-semibold">
              ✓ Perfect Match
            </span>
          )}

          {/* Delta-E with Tooltip */}
          {paint.deltaE !== undefined && paint.deltaE > 0 && !isPerfectMatch && (
            <Tooltip
              content={
                <div className="space-y-1">
                  <p className="font-semibold">Delta-E (ΔE) Color Accuracy</p>
                  <p>Lower values = better match</p>
                  <ul className="text-xs space-y-0.5 mt-1">
                    <li><span className="text-green-400">0-3:</span> Excellent match</li>
                    <li><span className="text-yellow-400">3-10:</span> Good match</li>
                    <li><span className="text-orange-400">10-20:</span> Noticeable difference</li>
                    <li><span className="text-red-400">20+:</span> Significant difference</li>
                  </ul>
                </div>
              }
              position="top"
            >
              <span className={`text-xs font-mono cursor-help ${
                isHighDeltaE ? 'text-orange-400' : 'text-gray-500'
              }`}>
                {'\u0394'}E: {paint.deltaE.toFixed(1)}
              </span>
            </Tooltip>
          )}

          {/* Discontinued Badge */}
          {paint.discontinued && (
            <Tooltip content={paint.alternativeName ? `Try ${paint.alternativeName} instead` : 'This paint may be discontinued'}>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded cursor-help">
                Discontinued
              </span>
            </Tooltip>
          )}
        </div>
        <p className="text-sm font-semibold text-white truncate mt-0.5">{paint.name}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Owned Toggle */}
        {onToggleOwned && (
          <Tooltip content={isOwned ? 'Mark as not owned' : 'I own this paint'}>
            <motion.button
              onClick={onToggleOwned}
              className={`p-2 rounded text-xs transition-colors ${
                isOwned
                  ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                  : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={isOwned ? 'Mark as not owned' : 'Mark as owned'}
              aria-pressed={isOwned}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isOwned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </Tooltip>
        )}

        {/* Add to Cart Button */}
        {onAddToCart && (
          <motion.button
            onClick={onAddToCart}
            className={`${themeColors.bg} ${themeColors.hover} text-white px-3 py-2 rounded text-xs font-semibold min-h-[36px] transition-all ${
              isOwned ? 'opacity-60' : ''
            }`}
            whileTap={{ scale: 0.95 }}
            aria-label={`Add ${paint.name} to cart`}
          >
            {isOwned ? 'Own' : 'Add'}
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default PaintRecipeCard;
