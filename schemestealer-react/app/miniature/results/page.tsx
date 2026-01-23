/**
 * Miniscan results page - Cogitator-themed display with ReticleReveal
 * The "magic moment" page with hidden-by-default reticle reveals
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ReticleReveal } from '@/components/miniscan/ReticleReveal';
import { PaintList } from '@/components/PaintCard';
import { PaintResultsAccordion } from '@/components/PaintResultsAccordion';
import { ColorSwatchGrid } from '@/components/ColorSwatch';
import { ShareButton } from '@/components/ShareButton';
import { ShareModal } from '@/components/ShareModal';
import { motion } from 'framer-motion';
import type { Paint } from '@/lib/types';

export default function MiniscanResultsPage() {
  const router = useRouter();
  const { currentScan, clearCurrentScan } = useAppStore();
  const [showShareModal, setShowShareModal] = useState(false);

  React.useEffect(() => {
    // Redirect if no scan result
    if (!currentScan || currentScan.mode !== 'miniature') {
      router.push('/miniature');
    }
  }, [currentScan, router]);

  if (!currentScan) {
    return null;
  }

  const handleScanAnother = () => {
    clearCurrentScan();
    router.push('/miniature');
  };

  return (
    <div className="min-h-screen pb-24 pt-8 px-4" style={{ background: 'var(--void-black)' }}>
      {/* Scanline effect */}
      <div className="scanline" />

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gothic-text mb-2 auspex-text">
            ◆ SCAN COMPLETE ◆
          </h1>
          <p className="text-cogitator-green-dim tech-text">
            Auspex has identified {currentScan.detectedColors.length} color signatures
          </p>
          <motion.div
            className="mt-2 text-xs text-brass cyber-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ◆ COGITATOR STATUS: ANALYSIS COMPLETE ◆
          </motion.div>
        </motion.div>

        {/* Color Swatches */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ColorSwatchGrid
            colors={currentScan.detectedColors.map(color => ({
              hex: color.hex,
              name: color.family || 'Unknown',
              percentage: color.percentage || 0,
              rgb: color.rgb,
            }))}
            mode="miniature"
          />
        </motion.div>

        {/* Detected Colors with ReticleReveal */}
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
                  {/* RETICLE REVEAL - THE MAGIC MOMENT */}
                  <ReticleReveal
                    colorName={color.family || 'Color'}
                    colorHex={color.hex}
                    reticleImage={color.reticle ? `data:image/jpeg;base64,${color.reticle}` : undefined}
                    originalImage={currentScan.imageData}
                  />

                  {/* Paint Recommendations for this color */}
                  {color.paintMatches ? (
                    <div className="mt-6">
                      <PaintResultsAccordion
                        colorName={color.family || 'Color'}
                        colorHex={color.hex}
                        colorPercentage={color.percentage || 0}
                        paintsByBrand={{
                          citadel: (color.paintMatches.citadel || []).map(p => ({
                            name: p.name,
                            brand: p.brand,
                            type: p.type || 'Paint',
                            hex: p.hex,
                            deltaE: p.deltaE || 0,
                          })),
                          vallejo: (color.paintMatches.vallejo || []).map(p => ({
                            name: p.name,
                            brand: p.brand,
                            type: p.type || 'Paint',
                            hex: p.hex,
                            deltaE: p.deltaE || 0,
                          })),
                          armyPainter: (color.paintMatches.armyPainter || []).map(p => ({
                            name: p.name,
                            brand: p.brand,
                            type: p.type || 'Paint',
                            hex: p.hex,
                            deltaE: p.deltaE || 0,
                          })),
                        }}
                        mode="miniature"
                        onAddToCart={(paint: Paint) => {
                          const { addToCart, currentMode, currentScan } = useAppStore.getState();
                          addToCart(paint, currentMode || undefined, currentScan?.id);
                        }}
                      />
                    </div>
                  ) : currentScan.recommendedPaints && currentScan.recommendedPaints.length > 0 ? (
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="2">
                <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="auspex-text font-bold cyber-text">
                INITIATE NEW SCAN
              </span>
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="2">
                <rect x="3" y="8" width="18" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 13h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-brass font-bold cyber-text">
                VIEW SUPPLY REQUISITION
              </span>
            </div>
          </motion.button>

          <ShareButton
            mode="miniature"
            onShareClick={() => setShowShareModal(true)}
          />
        </motion.div>

        {/* Cogitator Report - Enhanced parchment panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="parchment-bg rounded-lg p-5 text-sm depth-2 border-2 border-brass/30">
            <div className="flex items-center justify-center gap-2 mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--void-black)" strokeWidth="2" opacity="0.7">
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
              </svg>
              <h3 className="font-bold text-void-black gothic-text text-center text-base">
                COGITATOR REPORT
              </h3>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--void-black)" strokeWidth="2" opacity="0.7">
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 1v6m0 6v6M1 12h6m6 0h6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
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
                <span>{currentScan.detectedColors.length} dominant color signatures identified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>{currentScan.recommendedPaints?.length || 0} paint formulations matched from sacred archives</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>Delta-E (ΔE) indicates color purity rating (lower = more accurate)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-void-black/60 flex-shrink-0">►</span>
                <span>Tap "REVEAL LOCATION" to view color placement on miniature</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      {showShareModal && (
        <ShareModal
          mode="miniature"
          data={{
            colors: currentScan.detectedColors.map(color => ({
              hex: color.hex,
              name: color.family || 'Unknown',
              percentage: color.percentage || 0,
            })),
            imageUrl: currentScan.imageData,
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
