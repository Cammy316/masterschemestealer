/**
 * Miniscan results page - Cogitator-themed display with ReticleReveal
 * The "magic moment" page with hidden-by-default reticle reveals
 * Now with per-color brand selection using PaintRecipeCard
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ReticleReveal } from '@/components/miniscan/ReticleReveal';
import { HexPalette } from '@/components/miniscan/HexPalette';
import { PaintList } from '@/components/PaintCard';
import { PaintRecipeCard } from '@/components/shared/PaintRecipeCard';
import { PaintResults } from '@/components/shared/PaintResults';
import { HexChip } from '@/components/shared/HexChip';
import { ShareButton } from '@/components/ShareButton';
import { ShareModal } from '@/components/ShareModal';
import { LocalAuspexBadge } from '@/components/shared/LocalAuspexBadge';
import { FeedbackModal, type FeedbackSubmission } from '@/components/FeedbackModal';
import { KoFiPrompt, KoFiBanner } from '@/components/KoFiPrompt';
import { useFeedbackPrompt } from '@/hooks/useFeedbackPrompt';
import { useAnalytics } from '@/hooks/useAnalytics';
import { motion } from 'framer-motion';
import { mlLogger } from '@/lib/mlDataLogger';

function DecryptionHeader({ text }: { text: string }) {
  const [displayText, setDisplayText] = React.useState(text.replace(/[a-zA-Z]/g, '0'));
  
  React.useEffect(() => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if (char === ' ' || char === '◆') return char;
        if (index < iterations) return text[index];
        return String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }).join(''));
      
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1/3;
    }, 30);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayText}</span>;
}

export default function MiniscanResultsPage() {
  const router = useRouter();
  const rawCurrentScan = useAppStore((s) => s.currentScan);
  const scanHistory = useAppStore((s) => s.scanHistory);
  const clearCurrentScan = useAppStore((s) => s.clearCurrentScan);
  // Refresh-safe: if the in-memory current scan is gone (hard refresh / deep
  // link), fall back to the most recent miniature scan in persisted history.
  const currentScan =
    rawCurrentScan && rawCurrentScan.mode === 'miniature'
      ? rawCurrentScan
      : scanHistory.find((s) => s.mode === 'miniature') ?? null;
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
    // No redirect — we render a themed empty state below when there is genuinely
    // no scan, so a hard refresh or deep link shows data (or a graceful empty
    // state) instead of bouncing the user away.
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
        // Only show if feedback modal hasn't been shown yet
        if (Math.random() < 0.2) {
          setKoFiTrigger('scan');
          setShowKoFiPrompt(true);
        }
      }, 15000); // 15 seconds after page load
      return () => clearTimeout(timer);
    }
  }, [currentScan, showKoFiPrompt]);

  if (!currentScan) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: 'var(--void-black)' }}
      >
        <div className="border-b border-cogitator-green-dim/30 pb-4 mb-6">
          <h1 className="text-[clamp(1.2rem,5vw,1.5rem)] text-balance font-bold gothic-text auspex-text mb-3">
            ◆ ARCHIVE EMPTY ◆
          </h1>
          <p className="text-cogitator-green-dim tech-text text-sm mb-6">
            No scan data found in the archives. Initiate a new scan to continue.
          </p>
          <button
            onClick={() => router.push('/miniature')}
            className="w-full py-4 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic touch-target auspex-text font-bold cyber-text"
          >
            INITIATE NEW SCAN
          </button>
        </div>
      </div>
    );
  }

  const handleScanAnother = () => {
    clearCurrentScan();
    router.push('/miniature');
  };

  return (
    <div className="min-h-screen pb-24 pt-8 px-6" style={{ background: 'var(--void-black)' }}>
      {/* Scanline effect */}
      <div className="scanline" />

      <div className="max-w-2xl mx-auto space-y-6">
        {currentScan.analysisSource === 'local' && <LocalAuspexBadge />}
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-[clamp(1.5rem,5vw,1.875rem)] text-balance font-bold gothic-text mb-2 auspex-text relative inline-block">
            <DecryptionHeader text="◆ SCAN COMPLETE ◆" />
            <motion.div 
              className="absolute -inset-2 bg-cogitator-green/20 mix-blend-screen pointer-events-none"
              animate={{ opacity: [0, 1, 0], scaleY: [0, 1.2, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
            />
          </h1>
          <p className="text-cogitator-green-dim tech-text">
            Auspex has identified {currentScan.detectedColors.length} colour signatures
          </p>
          <motion.div
            className="mt-2 text-xs text-brass cyber-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ◆ COGITATOR STATUS: ANALYSIS COMPLETE ◆
          </motion.div>
        </motion.div>

        {/* Global Extracted Colors Overview */}
        <HexPalette 
          colors={currentScan.detectedColors.map(c => ({
            hex: c.hex,
            family: c.family,
            percentage: c.percentage,
            name: c.family || 'Unknown'
          }))} 
        />

        {/* Detected Colors with ReticleReveal and PaintRecipeCard */}
        <div className="space-y-6">
          {currentScan.detectedColors.map((color, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="gothic-frame rounded-lg p-1 depth-3">
                <div className="bg-dark-gothic rounded-lg p-4 textured">
                  {/* Color Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 border-2 border-cogitator-green auspex-glow flex-shrink-0"
                      style={{ 
                        backgroundColor: color.hex,
                        clipPath: 'polygon(30% 0%, 100% 0, 100% 70%, 70% 100%, 0 100%, 0 30%)'
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold auspex-text gothic-text truncate">
                        {color.family || 'UNKNOWN'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <HexChip hex={color.hex} theme="cogitator" />
                        <span className="text-xs text-cogitator-green-dim/80 tech-text">
                          {color.percentage?.toFixed(1)}% coverage
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RETICLE REVEAL - THE MAGIC MOMENT */}
                  <ReticleReveal
                    colorName={color.family || 'Colour'}
                    colorHex={color.hex}
                    reticleImage={
                      color.reticle ? `data:image/jpeg;base64,${color.reticle}` : undefined
                    }
                    originalImage={currentScan.imageUrl}
                    reticlePositions={
                      currentScan.imageUrl && currentScan.detectedColors.some((c) => c.position)
                        ? currentScan.detectedColors.flatMap((c, i) =>
                            c.position
                              ? [{ x: c.position.x, y: c.position.y, color: c.hex, active: i === index }]
                              : []
                          )
                        : undefined
                    }
                  />

                  {/* Paint Recipe Card - NEW: Per-color brand selection */}
                  {color.paintRecipe ? (
                    <div className="mt-6">
                      <h4 className="text-sm font-bold auspex-text mb-3 gothic-text text-center text-shadow-sm">
                        ◆ SACRED FORMULATIONS ◆
                      </h4>
                      <PaintRecipeCard
                        colorFamily={color.family || 'Unknown'}
                        colorHex={color.hex}
                        paintRecipe={color.paintRecipe}
                        mode="miniature"
                        coverage={color.percentage}
                      />
                    </div>
                  ) : color.paintMatches ? (
                    // Legacy fallback: old paintMatches format
                    <div className="mt-6">
                      <PaintResults
                        colorName={color.family || 'Colour'}
                        colorHex={color.hex}
                        paintMatches={color.paintMatches}
                        mode="miniature"
                      />
                    </div>
                  ) : currentScan.recommendedPaints &&
                    currentScan.recommendedPaints.length > 0 ? (
                    // Ultimate fallback: global recommended paints
                    <div className="mt-6 p-4 rounded-lg border border-cogitator-green/20 bg-cogitator-green/5 depth-1">
                      <h4 className="text-sm font-bold auspex-text mb-3 gothic-text text-center text-shadow-sm">
                        ◆ SACRED FORMULATIONS ◆
                      </h4>
                      <div className="space-y-2">
                        <PaintList
                          paints={currentScan.recommendedPaints.slice(0, 3)}
                          title=""
                          showAddButtons={true}
                          emptyMessage=""
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            onClick={handleScanAnother}
            className="w-full py-4 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic touch-target textured"
            whileHover={{
              boxShadow: '0 0 20px var(--cogitator-green-glow)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--cogitator-green)"
                strokeWidth="2"
              >
                <path
                  d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="auspex-text font-bold cyber-text">INITIATE NEW SCAN</span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/cart')}
            className="w-full py-4 px-6 rounded-lg border-2 border-brass bg-dark-gothic touch-target textured"
            whileHover={{
              boxShadow: '0 0 15px var(--brass)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brass)"
                strokeWidth="2"
              >
                <rect
                  x="3"
                  y="8"
                  width="18"
                  height="13"
                  rx="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M3 13h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-brass font-bold cyber-text">VIEW SUPPLY REQUISITION</span>
            </div>
          </motion.button>

          <ShareButton mode="miniature" onShareClick={() => setShowShareModal(true)} />

          {/* Give Feedback Button */}
          <motion.button
            onClick={triggerFeedback}
            className="w-full py-3 px-6 rounded-lg border border-brass/50 bg-brass/10 touch-target"
            whileHover={{
              boxShadow: '0 0 10px var(--brass)',
              scale: 1.01,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brass)"
                strokeWidth="2"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-brass text-sm tech-text">Give Feedback</span>
            </div>
          </motion.button>
        </motion.div>

        {/* Ko-fi Support Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
        >
          <KoFiBanner source="miniature_results" mode="miniature" />
        </motion.div>

        {/* Cogitator Report - Enhanced parchment panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="parchment-bg rounded-lg p-5 text-sm depth-2 border-2 border-brass/30">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--void-black)"
                strokeWidth="2"
                opacity="0.7"
              >
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 1v6m0 6v6M1 12h6m6 0h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                />
              </svg>
              <h3 className="font-bold text-void-black gothic-text text-center text-base">
                COGITATOR REPORT
              </h3>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--void-black)"
                strokeWidth="2"
                opacity="0.7"
              >
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M12 1v6m0 6v6M1 12h6m6 0h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                />
              </svg>
            </div>
            <div className="w-16 h-px bg-void-black/30 mx-auto mb-3" />
            <ul className="space-y-2 text-void-black/90 tech-text text-xs leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>Background removed via servo-skull image processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>
                  {currentScan.detectedColors.length} dominant colour signatures identified
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>
                  Paint recipes include BASE, SHADE, HIGHLIGHT, and WASH recommendations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>
                  Delta-E ({'\u0394'}E) indicates colour purity rating (lower = more accurate)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>Tap &quot;REVEAL LOCATION&quot; to view colour placement on miniature</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {showShareModal && (
        <ShareModal
          mode="miniature"
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
        mode="miniature"
      />

      {/* Ko-fi Prompt */}
      {showKoFiPrompt && (
        <KoFiPrompt
          trigger={koFiTrigger}
          forceShow={koFiTrigger === 'feedback'}
          onDismiss={() => setShowKoFiPrompt(false)}
          mode="miniature"
        />
      )}
    </div>
  );
}
