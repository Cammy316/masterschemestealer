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

import { useState, useEffect, useMemo, useCallback } from 'react';
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

// The six supported brands (those with measured-swatch ground truth). Scale75 is
// intentionally absent — it has no measured data, so the backend never returns a
// recipe for it and it must not render a tab. Mirrors config.SUPPORTED_BRANDS.
type BrandKey = 'citadel' | 'vallejo' | 'army_painter' | 'ak' | 'pro_acryl' | 'two_thin_coats';

const BRANDS: { key: BrandKey; name: string; short: string; isPremium?: boolean }[] = [
  { key: 'citadel', name: 'Citadel', short: 'Citadel' },
  { key: 'vallejo', name: 'Vallejo', short: 'Vallejo' },
  { key: 'army_painter', name: 'Army Painter', short: 'Army P.' },
  { key: 'ak', name: 'AK', short: 'AK', isPremium: true },
  { key: 'pro_acryl', name: 'Pro Acryl', short: 'Pro Acryl', isPremium: true },
  { key: 'two_thin_coats', name: 'Two Thin Coats', short: 'TTC', isPremium: true },
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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

  // Only show tabs for brands the backend actually returned. Scale75 (and any
  // other unsupported brand) is absent from the response, so it never renders.
  // Falls back to the supported list if a response omits the key entirely.
  //
  // PREMIUM BRANDS HIDDEN (temporary): AK / Pro Acryl / Two Thin Coats are
  // marked isPremium and filtered out here because the premium subscription
  // isn't set up yet — we don't want to surface paints the user can't unlock.
  // They remain in the DB and the backend still returns recipes for them; we
  // only omit them from the selector. To re-enable once premium ships, drop the
  // `!b.isPremium` filter below (the premium-gating overlay further down then
  // becomes reachable again).
  const visibleBrands = useMemo(() => {
    const selectable = BRANDS.filter((b) => !b.isPremium);
    const present = selectable.filter((b) => paintRecipe[b.key]);
    return present.length ? present : selectable;
  }, [paintRecipe]);

  // Derive the effective brand: the user's choice if it's present in this scan's
  // response, otherwise the first available brand. Derived (not stored) so we
  // never have to reset state in an effect.
  const effectiveBrand: BrandKey = useMemo(
    () => (visibleBrands.some((b) => b.key === selectedBrand) ? selectedBrand : visibleBrands[0].key),
    [visibleBrands, selectedBrand]
  );

  const currentRecipe: BrandRecipe = useMemo(
    () => paintRecipe[effectiveBrand] ?? { base: null, shade: null, highlight: null, wash: null },
    [paintRecipe, effectiveBrand]
  );

  const difficulty = useMemo(() =>
    getRecipeDifficulty(currentRecipe),
    [currentRecipe]
  );

  const paintCount = [currentRecipe.base, currentRecipe.shade, currentRecipe.highlight, currentRecipe.wash].filter(Boolean).length;

  const handleAddToCart = useCallback((paint: PaintMatch) => {
    const brandName = BRANDS.find((b) => b.key === effectiveBrand)?.name || effectiveBrand;
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
  }, [effectiveBrand, addToCart, currentMode, currentScan?.id]);

  const handleCopyRecipe = useCallback(async () => {
    const brandName = BRANDS.find((b) => b.key === effectiveBrand)?.name || effectiveBrand;
    const slots = RECIPE_STEPS.map((step) => {
      const p = currentRecipe[step.key];
      return { role: step.label, name: p?.name ?? '', hex: p?.hex ?? '', deltaE: p?.deltaE };
    });
    await copyRecipe({ family: colorFamily, sourceHex: colorHex, coverage, brand: brandName, slots });
    setCopied(true);
    setAnnouncement('Recipe copied');
    setTimeout(() => setCopied(false), 2000);
  }, [colorFamily, colorHex, coverage, currentRecipe, effectiveBrand]);

  const handleBrandChange = useCallback((brand: BrandKey) => {
    setSelectedBrand(brand);
    const brandName = BRANDS.find((b) => b.key === brand)?.name || brand;
    setAnnouncement(`Switched to ${brandName} paints`);
  }, []);

  // Swipe gesture (kept as a bonus; the tabs are the obvious control)
  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    const currentIndex = visibleBrands.findIndex((b) => b.key === effectiveBrand);
    const newIndex = direction === 'left'
      ? (currentIndex + 1) % visibleBrands.length
      : (currentIndex - 1 + visibleBrands.length) % visibleBrands.length;
    setSwipeDirection(direction);
    handleBrandChange(visibleBrands[newIndex].key);
    setTimeout(() => setSwipeDirection(null), 300);
  }, [effectiveBrand, handleBrandChange, visibleBrands]);

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

  const isWarp = mode === 'inspiration';
  const containerClass = isWarp
    ? "rounded-2xl border overflow-hidden backdrop-blur-xl bg-void-black/40 shadow-[0_0_30px_rgba(147,51,234,0.15)]"
    : "rounded-sm border-[2px] overflow-hidden bg-void-black shadow-[0_0_15px_rgba(0,255,65,0.1)]";
  const containerBorder = isWarp ? 'rgba(168, 85, 247, 0.3)' : primaryVar;

  return (
    <div className={containerClass} style={{ borderColor: containerBorder }}>
      {/* Screen Reader Announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      {/* Header: difficulty pill + actions */}
      <div className={`flex items-center justify-between px-3 py-2 border-b gap-2 ${isWarp ? 'bg-void-black/30 border-purple-500/20' : 'bg-[#0a150c] border-cogitator-green/30'}`}>
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

      {/* Brand Selector Dropdown */}
      <div className={`relative p-3 border-b ${isWarp ? 'border-white/10 bg-void-black/30' : 'border-cogitator-green/20 bg-[#0a150c]'}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 transition-all ${
            isWarp ? 'rounded-lg bg-white/5 border border-white/10 hover:bg-white/10' : 'rounded-sm bg-cogitator-green/5 border border-cogitator-green/30 hover:bg-cogitator-green/10'
          }`}
        >
          <div className="flex items-center gap-3">
            <BrandIcon brand={effectiveBrand} isActive={true} mode={mode} />
            <span className="font-bold text-sm">
              {BRANDS.find((b) => b.key === effectiveBrand)?.name}
            </span>
            {BRANDS.find((b) => b.key === effectiveBrand)?.isPremium && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2">
                <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            )}
          </div>
          <svg
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <AnimatePresence>
          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -10, scaleY: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute left-3 right-3 top-[calc(100%-4px)] z-50 shadow-2xl overflow-hidden border ${
                isWarp ? 'rounded-lg bg-void-black/95 backdrop-blur-xl border-white/10' : 'rounded-sm bg-void-black border-cogitator-green shadow-[0_5px_20px_rgba(0,255,65,0.2)]'
              }`}
              style={{ transformOrigin: 'top' }}
            >
              {visibleBrands.map((brand) => (
                <button
                  key={brand.key}
                  onClick={() => {
                    handleBrandChange(brand.key);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-b last:border-b-0 ${
                    effectiveBrand === brand.key
                      ? (isWarp ? 'bg-warp-purple/20' : 'bg-cogitator-green/10')
                      : (isWarp ? 'hover:bg-white/5 border-white/5' : 'hover:bg-gray-800 border-gray-800')
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BrandIcon brand={brand.key} isActive={effectiveBrand === brand.key} mode={mode} />
                    <span className={effectiveBrand === brand.key ? 'font-bold' : ''}>
                      {brand.name}
                    </span>
                  </div>
                  {brand.isPremium && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider" style={{ background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24' }}>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <rect x="5" y="11" width="14" height="10" rx="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      PREMIUM
                    </div>
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recipe Steps */}
      <div className={`p-3 overflow-hidden relative ${isWarp ? 'bg-void-black/20' : 'bg-[#050a06]'}`}>
        
        {/* Premium Gating Overlay */}
        {BRANDS.find((b) => b.key === effectiveBrand)?.isPremium && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md bg-void-black/60 rounded-b-xl border-t border-white/5">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.5" className="mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h4 className="text-xl font-bold mb-2 text-[#fbbf24] gothic-text tracking-wide text-shadow-sm">
              SEALED FORMULATION
            </h4>
            <p className="text-sm text-gray-300 text-center px-6 mb-6 max-w-sm">
              This advanced chromatic recipe requires Level 4 clearance. Elevate your status to unlock premium formulations.
            </p>
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-400 text-void-black font-bold text-sm tracking-widest shadow-[0_4px_15px_rgba(251,191,36,0.3)] hover:scale-105 transition-transform">
              UNLOCK PREMIUM
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={effectiveBrand}
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
  const isWarp = theme === 'warp';
  const [activePaint, setActivePaint] = useState(paint);
  
  useEffect(() => {
    setActivePaint(paint);
  }, [paint]);

  // Empty slot — dashed, dimmed, greyed spine.
  if (!activePaint) {
    return (
      <div className={`overflow-hidden border border-dashed opacity-60 ${isWarp ? 'rounded-xl border-purple-500/20' : 'rounded-sm border-cogitator-green/30 bg-[#0a150c]'}`}>
        <div className="flex items-stretch">
          <div className="w-[5px] flex-shrink-0" style={{ background: 'var(--charcoal)' }} />
          <div className={`flex items-center gap-3 flex-1 min-w-0 py-2.5 px-2.5 ${isWarp ? 'bg-void-black/30' : ''}`}>
            <div className={`w-[46px] h-[46px] flex items-center justify-center flex-shrink-0 text-gray-600 border border-dashed ${isWarp ? 'rounded-full border-purple-500/30' : 'rounded-none border-cogitator-green/40'}`}>
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

  const isPerfectMatch = activePaint.deltaE !== undefined && activePaint.deltaE < 3;
  const quality = deltaQuality(activePaint.deltaE);
  
  const hasAlt = !isOwned && activePaint.owned_alternative;

  const rowClass = isWarp
    ? `rounded-xl overflow-hidden border bg-warp-purple/10 backdrop-blur-md ${isOwned ? 'ring-2 ring-purple-500/50' : ''}`
    : `rounded-sm overflow-hidden border bg-[#0a150c] ${isOwned ? 'ring-2 ring-cogitator-green shadow-[0_0_10px_rgba(0,255,65,0.1)]' : ''}`;
  const rowBorder = isWarp ? 'rgba(168, 85, 247, 0.2)' : 'rgba(0,255,65,0.2)';

  return (
    <div
      className={rowClass}
      style={{ borderColor: rowBorder }}
    >
      <div className="flex items-stretch">
        {/* Role spine */}
        <div className="w-[5px] flex-shrink-0" style={{ background: spineColor }} aria-hidden />

        <div className="flex items-center gap-3 flex-1 min-w-0 py-2.5 px-2.5">
          {/* Swatch + ΔE badge */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-[46px] h-[46px] border ${isWarp ? 'border-gray-600 rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]' : 'border-cogitator-green/50 rounded-none shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]'}`}
              style={{ backgroundColor: activePaint.hex }}
            />
            {/* Owned tick */}
            {isOwned && (
              <div className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            )}
            {/* ΔE badge, colour-coded by match quality */}
            {activePaint.deltaE !== undefined && (
              <div
                className="absolute -bottom-1.5 -right-1.5 min-w-[26px] h-5 px-1 rounded-full flex items-center justify-center text-[10px] font-bold leading-none"
                style={{ background: 'var(--void-black)', border: `1px solid ${quality.color}`, color: quality.color }}
                aria-label={`Delta E ${activePaint.deltaE.toFixed(1)}, ${quality.label} match`}
              >
                {activePaint.deltaE.toFixed(1)}
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
              {activePaint.discontinued && (
                <Tooltip content={activePaint.alternativeName ? `Try ${activePaint.alternativeName} instead` : 'This paint may be discontinued'}>
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
              {activePaint.name}
            </p>
            {hasAlt && (
              <button
                onClick={() => setActivePaint(activePaint.owned_alternative!)}
                className="mt-1 flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300 bg-amber-900/40 rounded border border-amber-500/30 hover:bg-amber-800/60 transition-colors"
                title={`Swap to owned: ${activePaint.owned_alternative!.name} (ΔE ${activePaint.owned_alternative!.deltaE})`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 17l-4-4 4-4M16 7l4 4-4 4 M4 13h16 M4 11h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Swap to Owned ({activePaint.owned_alternative!.name})
              </button>
            )}
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
                  onClick={() => onAddToCart(activePaint)}
                  className={`w-9 h-9 flex items-center justify-center ${isOwned ? 'opacity-70' : ''}`}
                  aria-label={`Add ${activePaint.name} to cart`}
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
