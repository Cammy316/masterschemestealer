/**
 * Inspiration results page - Warp Portal themed display
 * Big beautiful color swatches with ethereal effects
 * Now with per-color brand selection using PaintRecipeCard
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ColorPalette } from '@/components/inspiration/ColorPalette';
import { PaintList } from '@/components/PaintCard';
import { PaintRecipeCard } from '@/components/shared/PaintRecipeCard';
import { PaintResults } from '@/components/shared/PaintResults';
import { SlabButton } from '@/components/shared/SlabButton';
import { HexChip } from '@/components/shared/HexChip';
import { ShareButton } from '@/components/ShareButton';
import { ShareModal } from '@/components/ShareModal';
import { LocalAuspexBadge } from '@/components/shared/LocalAuspexBadge';
import { FeedbackModal, type FeedbackSubmission } from '@/components/FeedbackModal';
import { KoFiPrompt, KoFiBanner } from '@/components/KoFiPrompt';
import { useFeedbackPrompt } from '@/hooks/useFeedbackPrompt';
import { useAnalytics } from '@/hooks/useAnalytics';
import { mlLogger } from '@/lib/mlDataLogger';

export default function InspirationResultsPage() {
  const router = useRouter();
  const rawCurrentScan = useAppStore((s) => s.currentScan);
  const scanHistory = useAppStore((s) => s.scanHistory);
  const clearCurrentScan = useAppStore((s) => s.clearCurrentScan);
  // Refresh-safe: fall back to the latest inspiration scan in persisted history
  // if the in-memory current scan is gone (hard refresh / deep link).
  const currentScan =
    rawCurrentScan && rawCurrentScan.mode === 'inspiration'
      ? rawCurrentScan
      : scanHistory.find((s) => s.mode === 'inspiration') ?? null;
  const activeSession = useAppStore((s) => s.activeSession);
  const setActiveSession = useAppStore((s) => s.setActiveSession);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showKoFiPrompt, setShowKoFiPrompt] = useState(false);
  const [koFiTrigger, setKoFiTrigger] = useState<'scan' | 'feedback'>('scan');
  const { trackFeedbackSubmitted } = useAnalytics();

  // Feedback prompt hook - auto-shows after 10 seconds
  const { shouldShow: shouldShowFeedback, dismiss: dismissFeedback, triggerManually: triggerFeedback } = useFeedbackPrompt({
    scanId: currentScan?.id,
    delay: 10000,
    enabled: !!currentScan,
  });

  // Show feedback modal when prompted
  React.useEffect(() => {
    if (shouldShowFeedback && !showFeedbackModal) {
      setShowFeedbackModal(true);
    }
  }, [shouldShowFeedback, showFeedbackModal]);

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback: FeedbackSubmission) => {
    await mlLogger.submitCompleteFeedback(feedback);
    // Track in analytics
    const hasCorrections = feedback.colourCorrections.some(c => !c.wasCorrect);
    trackFeedbackSubmitted(feedback.rating, hasCorrections);
    // Show Ko-fi prompt after feedback
    setKoFiTrigger('feedback');
    setShowKoFiPrompt(true);
  };

  // Handle feedback modal close
  const handleFeedbackClose = () => {
    setShowFeedbackModal(false);
    dismissFeedback();
  };

  React.useEffect(() => {
    // No redirect — a themed empty state is rendered below when there is no
    // scan, so refresh / deep links resolve gracefully.
    return () => {
      if (currentScan) {
        mlLogger.logResultsPageExit(currentScan.id);
      }
    };
  }, [currentScan]);

  // Show Ko-fi prompt with 20% chance after scan (delayed)
  React.useEffect(() => {
    if (currentScan && !showKoFiPrompt) {
      const timer = setTimeout(() => {
        if (Math.random() < 0.2) {
          setKoFiTrigger('scan');
          setShowKoFiPrompt(true);
        }
      }, 15000);
      return () => clearTimeout(timer);
    }
  }, [currentScan, showKoFiPrompt]);

  // Scroll to color orbs on mount
  React.useEffect(() => {
    if (currentScan?.detectedColors?.length) {
      const timer = setTimeout(() => {
        document.getElementById('orbs-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentScan]);

  if (!currentScan) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-6 void-bg">
        <div className="starfield-bg fixed inset-0 -z-10" />
        <div className="text-center max-w-sm">
          <div className="border-b border-warp-purple-dark/50 pb-4 mb-6">
            <h1 className="text-[clamp(1.2rem,5vw,1.5rem)] text-balance font-bold gothic-text warp-text mb-3">
              ◆ THE VEIL IS EMPTY ◆
            </h1>
            <p className="text-warp-purple-light text-sm mb-6 font-medium">
              No scan data found in the archives. Channel a new image to continue.
            </p>
          </div>
          <button
            onClick={() => router.push('/inspiration')}
            className="w-full py-4 px-6 rounded-lg border-2 border-purple-500 bg-void-blue touch-target warp-text font-bold"
          >
            CHANNEL NEW IMAGE
          </button>
        </div>
      </div>
    );
  }

  const handleScanAnother = () => {
    clearCurrentScan();
    router.push('/inspiration');
  };

  const handleStartPainting = (colorIndex: number, brand: string) => {
    if (!currentScan) return;
    
    if (activeSession && activeSession.scanId !== currentScan.id) {
      if (!window.confirm("You have an active painting session. Replace it?")) return;
    }

    const colours = currentScan.detectedColors.map((c, idx) => {
      let bestBrand = 'citadel' as 'citadel' | 'vallejo' | 'army_painter' | 'ak' | 'pro_acryl' | 'two_thin_coats';
      if (idx === colorIndex) {
        bestBrand = brand as typeof bestBrand;
      } else if (c.paintRecipe && Object.keys(c.paintRecipe).length > 0) {
        bestBrand = Object.keys(c.paintRecipe)[0] as typeof bestBrand;
      }
      
      const recipe = c.paintRecipe?.[bestBrand];
      const steps = [];
      if (recipe) {
        if (recipe.base) steps.push({ role: 'base' as const, paintName: recipe.base.name, status: 'pending' as const });
        if (recipe.shade) steps.push({ role: 'shade' as const, paintName: recipe.shade.name, status: 'pending' as const });
        if (recipe.highlight) steps.push({ role: 'highlight' as const, paintName: recipe.highlight.name, status: 'pending' as const });
        if (recipe.wash) steps.push({ role: 'wash' as const, paintName: recipe.wash.name, status: 'pending' as const });
      }

      return {
        colourIndex: idx,
        brand: bestBrand,
        hex: c.hex,
        steps,
      };
    });

    setActiveSession({
      scanId: currentScan.id,
      startedAt: new Date().toISOString(),
      colours,
      dryTimeOverrides: {},
    });

    router.push('/session');
  };

  return (
    <div className="min-h-dvh pt-8 px-6 void-bg">
      {/* Starfield background */}
      <div className="starfield-bg fixed inset-0 -z-10" />

      <div className="max-w-2xl lg:max-w-5xl mx-auto space-y-8">
        {currentScan.analysisSource === 'local' && <LocalAuspexBadge />}
        {/* Header */}
        <motion.div
          className="text-center relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Breathing void glow behind text */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 bg-purple-600/20 blur-[40px] rounded-full pointer-events-none -z-10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h1 className="text-[clamp(1.5rem,5vw,1.875rem)] text-balance font-bold gothic-text mb-2 warp-text text-shadow-lg">
            ◆ ESSENCE EXTRACTED ◆
          </h1>
          <p className="text-warp-purple-light tech-text">
            {currentScan.detectedColors.length} chromatic signatures manifested from the
            Immaterium
          </p>
          <motion.div
            className="mt-2 text-xs text-warp-teal cyber-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ◆ WARP EXTRACTION COMPLETE ◆
          </motion.div>
        </motion.div>

        {/* Source image with ethereal frame (absent after a hard refresh) */}
        {currentScan.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="warp-border rounded-2xl overflow-hidden p-1">
              <div className="bg-dark-gothic rounded-xl overflow-hidden">
                {/* User's source image (object URL) — next/image not applicable. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentScan.imageUrl} alt="Inspiration source" className="w-full h-auto max-h-[65vh] object-contain" />
              </div>
            </div>
            <motion.p
              className="text-center text-xs text-warp-purple-light/60 mt-2 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Source material from the material realm
            </motion.p>
          </motion.div>
        )}

        {/* Color Palette - The main feature */}
        {currentScan.detectedColors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div id="orbs-section" className="scroll-mt-6" />
            <div className="py-2">
              <ColorPalette colors={currentScan.detectedColors} title="◆ EXTRACTED ESSENCE ◆" />
            </div>
          </motion.div>
        )}

        {/* Paint Recommendations - Per Color with PaintRecipeCard —
            two-column grid on desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
        {currentScan.detectedColors.map((color, index) => {
          // Show if color has paintRecipe (new format) or paintMatches (legacy)
          if (!color.paintRecipe && !color.paintMatches) return null;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <div className="p-2 mb-4">
                {/* Color Header */}
                <div className="flex items-center gap-4">
                  {/* Floating orb for individual color header */}
                  <motion.div
                    className="w-14 h-14 rounded-full flex-shrink-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] border border-white/20"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${color.hex}, #000000)`,
                      boxShadow: `0 0 20px ${color.hex}60`,
                    }}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute top-[10%] left-[15%] w-[30%] h-[20%] rounded-full bg-white/30 blur-[1px] rotate-[-25deg]" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold warp-text gothic-text truncate">
                      {color.family || `Colour ${index + 1}`}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <HexChip hex={color.hex} theme="warp" />
                      <span className="text-xs text-warp-purple-light/70 tech-text">
                        {color.percentage?.toFixed(1)}% coverage
                      </span>
                    </div>
                  </div>
                </div>
              </div>

                  {/* Paint Recipe Card - NEW: Per-color brand selection */}
                  {color.paintRecipe ? (
                    <PaintRecipeCard
                      colorFamily={color.family || 'Unknown'}
                      colorHex={color.hex}
                      paintRecipe={color.paintRecipe}
                      mode="inspiration"
                      coverage={color.percentage}
                      onStartPainting={(brand) => handleStartPainting(index, brand)}
                    />
                  ) : color.paintMatches ? (
                    // Legacy fallback: old paintMatches format
                    <PaintResults
                      colorName={color.family || `Colour ${index + 1}`}
                      colorHex={color.hex}
                      paintMatches={color.paintMatches}
                      mode="inspiration"
                    />
                  ) : null}
            </motion.div>
          );
        })}
        </div>

        {/* Fallback: Old-style paint recommendations if no paintRecipe or paintMatches */}
        {currentScan.recommendedPaints &&
          currentScan.recommendedPaints.length > 0 &&
          !currentScan.detectedColors.some((c) => c.paintRecipe || c.paintMatches) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="warp-border rounded-2xl p-1 depth-2">
                <div className="bg-dark-gothic rounded-xl p-6 textured">
                  <h3 className="text-xl font-bold warp-text gothic-text mb-4 text-center text-shadow">
                    ◆ MATERIAL FORMULATIONS ◆
                  </h3>
                  <p className="text-center text-sm text-warp-purple-light/70 mb-6">
                    Paints from the material realm to manifest this essence
                  </p>
                  <PaintList
                    paints={currentScan.recommendedPaints}
                    title=""
                    showAddButtons={true}
                    emptyMessage=""
                  />
                </div>
              </div>
            </motion.div>
          )}

        {/* Actions */}
        <motion.div
          className="flex flex-col gap-3 mt-8 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            onClick={handleScanAnother}
            className="w-full py-3 px-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_4px_15px_rgba(0,0,0,0.1),inset_0_0_15px_rgba(139,92,246,0.1)] touch-target group"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warp-purple-light)"
                strokeWidth="2"
                className="group-hover:rotate-180 transition-transform duration-500"
              >
                <path
                  d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M3 3v5h5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-warp-purple-light font-bold gothic-text group-hover:text-white transition-colors">
                CHANNEL THE WARP AGAIN
              </span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/forge')}
            className="w-full py-3 px-6 rounded-full border border-warp-teal/30 bg-warp-teal/10 backdrop-blur-md shadow-[0_4px_15px_rgba(20,184,166,0.15)] touch-target group"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(20,184,166,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warp-teal)"
                strokeWidth="2"
              >
                <path
                  d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M15 2H9c-1.1 0-2 .9-2 2v2h10V4c0-1.1-.9-2-2-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-warp-teal font-bold gothic-text group-hover:text-white transition-colors">
                VIEW REQUISITIONS
              </span>
            </div>
          </motion.button>

          {/* Share Button */}
          <motion.button
            onClick={() => setShowShareModal(true)}
            className="w-full py-3 px-6 rounded-full border border-warp-purple/40 bg-warp-purple/10 backdrop-blur-md shadow-[0_4px_15px_rgba(139,92,246,0.15)] touch-target group"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(139,92,246,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warp-purple-light)" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              <span className="text-warp-purple-light font-bold gothic-text group-hover:text-white transition-colors">
                SHARE ESSENCE
              </span>
            </div>
          </motion.button>

          {/* Give Feedback Button */}
          <motion.button
            onClick={triggerFeedback}
            className="w-full py-3 px-6 rounded-full border border-warp-pink/30 bg-warp-pink/10 backdrop-blur-md shadow-[0_4px_15px_rgba(236,72,153,0.15)] touch-target group"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(236,72,153,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--warp-pink)" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-warp-pink text-sm font-bold gothic-text group-hover:text-white transition-colors">
                GIVE FEEDBACK
              </span>
            </div>
          </motion.button>

          {/* Ko-fi Support Button */}
          <motion.button
            onClick={() => {
              import('@/lib/analytics').then(({ analytics }) => analytics.trackKoFiClicked('inspiration_results'));
              window.open('https://ko-fi.com/schemestealer', '_blank', 'noopener,noreferrer');
            }}
            className="w-full py-3 px-6 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md shadow-[0_4px_15px_rgba(245,158,11,0.15)] touch-target group"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(245,158,11,0.2)' }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-amber-500">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 1v3M10 1v3M14 1v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-amber-500 font-bold gothic-text group-hover:text-white transition-colors">
                EMPOWER THE WARP
              </span>
            </div>
          </motion.button>
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="rounded-2xl p-6 text-sm shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] border border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warp-purple-light)"
                strokeWidth="2"
                opacity="0.7"
              >
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              </svg>
              <h3 className="font-bold text-warp-purple-light gothic-text text-center text-shadow-sm">
                PALETTE GUIDANCE
              </h3>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--warp-purple-light)"
                strokeWidth="2"
                opacity="0.7"
              >
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              </svg>
            </div>
            
            <div className="space-y-3 text-warp-purple-light/90 font-medium">
              <div className="flex items-start gap-3">
                <span className="text-warp-purple-light mt-1 text-[10px]">✧</span>
                <p>These {currentScan.detectedColors.length} colours form a harmonious scheme</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-warp-purple-light mt-1 text-[10px]">✧</span>
                <p>Each color shows BASE, SHADE, HIGHLIGHT, and WASH recommendations</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-warp-purple-light mt-1 text-[10px]">✧</span>
                <p>Switch brands per color using the dropdown above each recipe</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-warp-purple-light mt-1 text-[10px]">✧</span>
                <p>Delta-E (ΔE) shows paint accuracy (lower = closer match)</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {showShareModal && (
        <ShareModal
          mode="inspiration"
          data={{
            colors: currentScan.detectedColors.map((color) => ({
              hex: color.hex,
              name: color.family || 'Unknown',
              percentage: color.percentage || 0,
            })),
            imageUrl: currentScan.imageUrl,
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Feedback Modal */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={handleFeedbackClose}
        onSubmit={handleFeedbackSubmit}
        scanId={currentScan.id}
        sessionId={mlLogger.getSessionId()}
        detectedColours={currentScan.detectedColors}
        mode="inspiration"
      />

      {/* Ko-fi Prompt */}
      {showKoFiPrompt && (
        <KoFiPrompt
          trigger={koFiTrigger}
          forceShow={koFiTrigger === 'feedback'}
          onDismiss={() => setShowKoFiPrompt(false)}
          mode="inspiration"
        />
      )}
    </div>
  );
}
