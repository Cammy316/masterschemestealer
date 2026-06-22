/**
 * PaintRecipeCard — per-colour paint recipe (BASE → SHADE → HIGHLIGHT → WASH).
 *
 * Shared across both tabs via the `mode` prop (green Imperial / purple Warp).
 * Prompt C redesign:
 *  - role-spine rows (coloured left bar encodes role) + ΔE-badge on the swatch
 *  - icon-only heart / + actions, 2-line name wrap, proper empty-state rows
 *  - header: difficulty pill (not bare stars) + always-visible brand tabs
 *  - "Copy recipe" → single consolidated copyRecipe() util
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PaintRecipe, BrandRecipe, PaintMatch } from '@/lib/types';
import { useAppStore } from '@/lib/store';
import { useOwnedPaints } from '@/hooks/useLocalStorage';
import { copyRecipe } from '@/lib/clipboard';
import { Tooltip } from '@/components/ui/Tooltip';
import { GhostButton } from '@/components/shared/GhostButton';
import { RoleTag } from '@/components/shared/RoleTag';
import { themeForMode, type UITheme } from '@/components/shared/theme';

interface PaintRecipeCardProps {
  colorFamily: string;
  colorHex: string;
  paintRecipe: PaintRecipe;
  mode: 'miniature' | 'inspiration';
  /** Detected-colour coverage %, surfaced in the copied recipe header. */
  coverage?: number;
}

type BrandKey = 'citadel' | 'vallejo' | 'army_painter' | 'scale75' | 'ak' | 'pro_acryl' | 'two_thin_coats';

const BRANDS: { key: BrandKey; name: string; short: string }[] = [
  { key: 'citadel', name: 'Citadel', short: 'Citadel' },
  { key: 'vallejo', name: 'Vallejo', short: 'Vallejo' },
  { key: 'army_painter', name: 'Army Painter', short: 'Army P.' },
  { key: 'scale75', name: 'Scale75', short: 'Scale75' },
  { key: 'ak', name: 'AK', short: 'AK' },
  { key: 'pro_acryl', name: 'Pro Acryl', short: 'Pro Acryl' },
  { key: 'two_thin_coats', name: 'Two Thin Coats', short: 'TTC' },
];

// Brand icon component - custom SVG icons for each brand
function BrandIcon({ brand, isActive, mode }: { brand: BrandKey; isActive: boolean; mode: 'miniature' | 'inspiration' }) {
  const activeColor = mode === 'miniature' ? 'var(--cogitator-green)' : 'var(--warp-purple-light)';
  const inactiveColor = '#6b7280';
  const color = isActive ? activeColor : inactiveColor;

  const icons: Record<BrandKey, React.JSX.Element> = {
    citadel: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M3 21h18" strokeLinecap="round" />
        <path d="M5 21V11l7-8 7 8v10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 21v-6h6v6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2" fill={isActive ? color : 'none'} />
      </svg>
    ),
    vallejo: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 2C12 2 6 9 6 14a6 6 0 0 0 12 0c0-5-6-12-6-12z" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? color : 'none'} fillOpacity={isActive ? 0.2 : 0} />
        <circle cx="10" cy="14" r="1.5" fill={color} />
      </svg>
    ),
    army_painter: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 3L4 7v6c0 5.5 3.8 10.3 8 11 4.2-.7 8-5.5 8-11V7l-8-4z" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? color : 'none'} fillOpacity={isActive ? 0.2 : 0} />
        <path d="M12 8v5M9.5 11h5" strokeLinecap="round" />
      </svg>
    ),
    scale75: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <rect x="2" y="8" width="20" height="8" rx="1" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? color : 'none'} fillOpacity={isActive ? 0.2 : 0} />
        <path d="M6 8V6M10 8V5M14 8V6M18 8V5" strokeLinecap="round" />
      </svg>
    ),
    // New measured-swatch brands — generic paint-pot glyph.
    ak: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? color : 'none'} fillOpacity={isActive ? 0.2 : 0} />
        <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    pro_acryl: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? color : 'none'} fillOpacity={isActive ? 0.2 : 0} />
        <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M9 13h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    two_thin_coats: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M5 8h14v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" fill={isActive ? color : 'none'} fillOpacity={isActive ? 0.2 : 0} />
        <path d="M8 8V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3M9 12h6M9 16h6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };

  return icons[brand];
}

const RECIPE_STEPS = [
  { key: 'base' as const, label: 'BASE', description: 'Foundation layer' },
  { key: 'shade' as const, label: 'SHADE', description: 'Recess shading' },
  { key: 'highlight' as const, label: 'HIGHLIGHT', description: 'Edge highlights' },
  { key: 'wash' as const, label: 'WASH', description: 'Optional wash' },
];

type StepKey = (typeof RECIPE_STEPS)[number]['key'];

/**
 * Role-spine colours (tokens only). The 5px left bar encodes the role so the
 * recipe is scannable by position + colour:
 *   BASE → theme primary · SHADE → deep void-blue (recess) ·
 *   HIGHLIGHT → lighter tint of the primary · WASH → muted brass glaze.
 */
const SPINE_TOKENS: Record<UITheme, Record<StepKey, string>> = {
  cogitator: {
    base: 'var(--cogitator-green-dim)',
    shade: 'var(--void-blue)',
    highlight: 'var(--cogitator-green)',
    wash: 'var(--brass)',
  },
  warp: {
    base: 'var(--warp-purple)',
    shade: 'var(--void-blue)',
    highlight: 'var(--warp-purple-light)',
    wash: 'var(--brass)',
  },
};

/** ΔE → match-quality colour (semantic tokens) + word. */
function deltaQuality(deltaE?: number): { color: string; label: string } {
  if (deltaE === undefined) return { color: 'var(--text-tertiary)', label: 'unknown' };
  if (deltaE <= 5) return { color: 'var(--success)', label: 'excellent' };
  if (deltaE <= 15) return { color: 'var(--warning)', label: 'loose' };
  return { color: 'var(--error)', label: 'poor' };
}

/**
 * Get recipe difficulty based on number of paints
 */
function getRecipeDifficulty(recipe: BrandRecipe): { level: number; label: string } {
  const paintCount = [recipe.base, recipe.shade, recipe.highlight, recipe.wash].filter(Boolean).length;
  if (paintCount <= 2) return { level: 1, label: 'Beginner' };
  if (paintCount <= 3) return { level: 2, label: 'Intermediate' };
  return { level: 3, label: 'Advanced' };
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
  coverage,
}: PaintRecipeCardProps) {
  const [selectedBrand, setSelectedBrand] = useState<BrandKey>('citadel');
  const [showComparison, setShowComparison] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [copied, setCopied] = useState(false);
  const { addToCart, currentMode, currentScan } = useAppStore();
  const { isOwned, toggleOwnedPaint } = useOwnedPaints();

  // Screen reader announcement
  const [announcement, setAnnouncement] = useState('');

  const theme = themeForMode(mode);
  const primaryVar = mode === 'miniature' ? 'var(--cogitator-green)' : 'var(--warp-purple)';
  const onPrimary = mode === 'miniature' ? 'var(--void-black)' : '#ffffff';

  const currentRecipe: BrandRecipe = useMemo(
    () => paintRecipe[selectedBrand] ?? { base: null, shade: null, highlight: null, wash: null },
    [paintRecipe, selectedBrand]
  );

  const difficulty = useMemo(() =>
    getRecipeDifficulty(currentRecipe),
    [currentRecipe]
  );

  const paintCount = [currentRecipe.base, currentRecipe.shade, currentRecipe.highlight, currentRecipe.wash].filter(Boolean).length;

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

  const handleCopyRecipe = useCallback(async () => {
    const brandName = BRANDS.find((b) => b.key === selectedBrand)?.name || selectedBrand;
    const slots = RECIPE_STEPS.map((step) => {
      const p = currentRecipe[step.key];
      return { role: step.label, name: p?.name ?? '', hex: p?.hex ?? '', deltaE: p?.deltaE };
    });
    await copyRecipe({ family: colorFamily, sourceHex: colorHex, coverage, brand: brandName, slots });
    setCopied(true);
    setAnnouncement('Recipe copied');
    setTimeout(() => setCopied(false), 2000);
  }, [colorFamily, colorHex, coverage, currentRecipe, selectedBrand]);

  const handleBrandChange = useCallback((brand: BrandKey) => {
    setSelectedBrand(brand);
    const brandName = BRANDS.find((b) => b.key === brand)?.name || brand;
    setAnnouncement(`Switched to ${brandName} paints`);
  }, []);

  // Swipe gesture (kept as a bonus; the tabs are the obvious control)
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentIndex = BRANDS.findIndex((b) => b.key === selectedBrand);
    const newIndex = direction === 'left'
      ? (currentIndex + 1) % BRANDS.length
      : (currentIndex - 1 + BRANDS.length) % BRANDS.length;
    setSwipeDirection(direction);
    handleBrandChange(BRANDS[newIndex].key);
    setTimeout(() => setSwipeDirection(null), 300);
  }, [selectedBrand, handleBrandChange]);

  const handleDragEnd = useCallback((
    _: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number }; velocity: { x: number } }
  ) => {
    const threshold = 50;
    const velocityThreshold = 200;
    if (Math.abs(info.offset.x) > threshold || Math.abs(info.velocity.x) > velocityThreshold) {
      if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
        handleSwipe('left');
      } else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
        handleSwipe('right');
      }
    }
  }, [handleSwipe]);

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: primaryVar }}>
      {/* Screen Reader Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header: difficulty pill + actions */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-900/90 border-b border-gray-800 gap-2">
        <Tooltip content={`${difficulty.label} — ${paintCount} paint${paintCount === 1 ? '' : 's'} in this recipe`}>
          <span
            className="text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full border cursor-help whitespace-nowrap"
            style={{ borderColor: 'var(--text-tertiary)', color: 'var(--text-secondary)' }}
          >
            {difficulty.label}
          </span>
        </Tooltip>

        <div className="flex items-center gap-2">
          {/* Compare toggle */}
          <Tooltip content="Compare detected colour with paint matches">
            <button
              onClick={() => setShowComparison(!showComparison)}
              className="p-2 rounded text-xs transition-colors flex items-center gap-1"
              style={showComparison
                ? { background: primaryVar, color: onPrimary }
                : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--text-tertiary)' }}
              aria-pressed={showComparison}
              aria-label="Toggle colour comparison"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="9" height="20" rx="1" />
                <rect x="13" y="2" width="9" height="20" rx="1" />
              </svg>
              <span className="hidden sm:inline">Compare</span>
            </button>
          </Tooltip>

          {/* Copy recipe */}
          <motion.button
            onClick={handleCopyRecipe}
            className="px-2.5 py-2 rounded text-xs font-semibold transition-colors flex items-center gap-1.5"
            style={copied
              ? { background: 'var(--success)', color: 'var(--void-black)' }
              : { background: 'transparent', color: primaryVar, border: `1px solid ${primaryVar}` }}
            whileTap={{ scale: 0.95 }}
            aria-label="Copy recipe to clipboard"
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Copied
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Copy recipe
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

      {/* Brand Selector Tabs — always-visible labels (no hidden swipe hint).
          Wraps to a second row on narrow screens now that there are 7 brands. */}
      <div className="flex flex-wrap gap-1 p-1 bg-gray-900/80">
        {BRANDS.map((brand) => {
          const active = selectedBrand === brand.key;
          return (
            <button
              key={brand.key}
              onClick={() => handleBrandChange(brand.key)}
              className="flex-1 min-w-[72px] min-h-[44px] rounded px-1 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
              style={active
                ? { background: primaryVar, color: onPrimary }
                : { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--text-tertiary)' }}
              aria-pressed={active}
            >
              <BrandIcon brand={brand.key} isActive={active} mode={mode} />
              <span className="truncate">{brand.short}</span>
            </button>
          );
        })}
      </div>

      {/* Recipe Steps */}
      <div className="p-3 bg-gray-900/50 overflow-hidden">
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
            className="space-y-2.5 touch-pan-y"
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
                  theme={theme}
                  spineColor={SPINE_TOKENS[theme][step.key]}
                  onAddToCart={paint ? () => handleAddToCart(paint) : undefined}
                  isOwned={paint ? isOwned(paintId) : false}
                  onToggleOwned={paint ? () => toggleOwnedPaint(paintId) : undefined}
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
        <span className="text-xs text-gray-400">Colour comparison</span>
        {deltaE !== undefined && deltaE > 0 && (
          <span className="text-xs text-gray-500">(ΔE: {deltaE.toFixed(1)})</span>
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
            {matchColor ? 'Base match' : 'No match'}
          </span>
        </div>
      </div>
    </div>
  );
}

interface RecipeStepRowProps {
  step: { key: string; label: string; description: string };
  paint: PaintMatch | null;
  theme: UITheme;
  spineColor: string;
  onAddToCart?: () => void;
  isOwned?: boolean;
  onToggleOwned?: () => void;
}

function RecipeStepRow({
  step,
  paint,
  theme,
  spineColor,
  onAddToCart,
  isOwned = false,
  onToggleOwned,
}: RecipeStepRowProps) {
  // Empty slot — dashed, dimmed, greyed spine.
  if (!paint) {
    return (
      <div className="rounded-lg overflow-hidden border border-dashed border-gray-700 opacity-60">
        <div className="flex items-stretch">
          <div className="w-[5px] flex-shrink-0" style={{ background: 'var(--charcoal)' }} />
          <div className="flex items-center gap-3 flex-1 min-w-0 py-2.5 px-2.5 bg-gray-800/40">
            <div className="w-[46px] h-[46px] rounded border border-dashed border-gray-600 flex items-center justify-center flex-shrink-0 text-gray-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" strokeLinecap="round" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <RoleTag theme={theme} className="opacity-60">{step.label}</RoleTag>
              <p className="text-xs text-gray-500 mt-1">No match found</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isPerfectMatch = paint.deltaE !== undefined && paint.deltaE < 3;
  const quality = deltaQuality(paint.deltaE);

  return (
    <div
      className={`rounded-lg overflow-hidden border bg-gray-800/80 ${isOwned ? 'ring-2 ring-green-500/30' : ''}`}
      style={{ borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-stretch">
        {/* Role spine */}
        <div className="w-[5px] flex-shrink-0" style={{ background: spineColor }} aria-hidden />

        <div className="flex items-center gap-3 flex-1 min-w-0 py-2.5 px-2.5">
          {/* Swatch + ΔE badge */}
          <div className="relative flex-shrink-0">
            <div
              className="w-[46px] h-[46px] rounded border border-gray-600"
              style={{ backgroundColor: paint.hex }}
            />
            {/* Owned tick */}
            {isOwned && (
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            )}
            {/* ΔE badge, colour-coded by match quality */}
            {paint.deltaE !== undefined && (
              <div
                className="absolute -bottom-1.5 -right-1.5 min-w-[26px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold leading-none"
                style={{ background: 'var(--void-black)', border: `1px solid ${quality.color}`, color: quality.color }}
                aria-label={`Delta E ${paint.deltaE.toFixed(1)}, ${quality.label} match`}
              >
                {paint.deltaE.toFixed(1)}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <RoleTag theme={theme}>{step.label}</RoleTag>
              {isPerfectMatch && (
                <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-semibold">✓ Perfect</span>
              )}
              {paint.discontinued && (
                <Tooltip content={paint.alternativeName ? `Try ${paint.alternativeName} instead` : 'This paint may be discontinued'}>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded cursor-help">Discontinued</span>
                </Tooltip>
              )}
            </div>
            <p
              className="paint-name font-semibold text-white mt-1"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
                lineHeight: 1.2,
              }}
            >
              {paint.name}
            </p>
          </div>

          {/* Icon-only actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {onToggleOwned && (
              <Tooltip content={isOwned ? 'Mark as not owned' : 'I own this paint'}>
                <GhostButton
                  theme={theme}
                  active={isOwned}
                  onClick={onToggleOwned}
                  className="w-9 h-9 flex items-center justify-center"
                  aria-label={isOwned ? 'Mark as not owned' : 'Mark as owned'}
                  aria-pressed={isOwned}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={isOwned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </GhostButton>
              </Tooltip>
            )}
            {onAddToCart && (
              <Tooltip content={isOwned ? 'Already owned — add anyway' : 'Add to requisition'}>
                <GhostButton
                  theme={theme}
                  onClick={onAddToCart}
                  className={`w-9 h-9 flex items-center justify-center ${isOwned ? 'opacity-70' : ''}`}
                  aria-label={`Add ${paint.name} to cart`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                </GhostButton>
              </Tooltip>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaintRecipeCard;
