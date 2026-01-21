/**
 * Miniscan results page - Cogitator-themed display with ReticleReveal
 * The "magic moment" page with hidden-by-default reticle reveals
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { ReticleReveal } from '@/components/miniscan/ReticleReveal';
import { PaintList } from '@/components/PaintCard';
import { motion } from 'framer-motion';

export default function MiniscanResultsPage() {
  const router = useRouter();
  const { currentScan, clearCurrentScan } = useAppStore();

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
            ⚙ COGITATOR STATUS: ANALYSIS COMPLETE ⚙
          </motion.div>
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
              <div className="gothic-frame rounded-lg p-1">
                <div className="bg-dark-gothic rounded-lg p-4">
                  {/* Color Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-16 h-16 rounded-lg border-2 border-cogitator-green auspex-glow flex-shrink-0"
                      style={{ backgroundColor: color.hex }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold auspex-text gothic-text truncate">
                        {color.family || 'UNKNOWN'}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm text-cogitator-green-dim tech-text">
                          Coverage: {color.percentage?.toFixed(1)}%
                        </span>
                        <span className="text-sm text-brass tech-text">
                          {color.hex}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RETICLE REVEAL - THE MAGIC MOMENT */}
                  <ReticleReveal
                    colorName={color.family || 'Color'}
                    colorHex={color.hex}
                    reticleImage={color.reticle ? `data:image/jpeg;base64,${color.reticle}` : undefined}
                    originalImage={currentScan.imageData}
                  />

                  {/* Paint Recommendations for this color */}
                  {currentScan.recommendedPaints && currentScan.recommendedPaints.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-bold auspex-text mb-3 gothic-text">
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
                  )}
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
            className="w-full py-4 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic touch-target"
            whileHover={{
              boxShadow: '0 0 20px var(--cogitator-green-glow)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🔄</span>
              <span className="auspex-text font-bold cyber-text">
                INITIATE NEW SCAN
              </span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/cart')}
            className="w-full py-4 px-6 rounded-lg border-2 border-brass bg-dark-gothic touch-target"
            whileHover={{
              boxShadow: '0 0 15px var(--brass)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🛒</span>
              <span className="text-brass font-bold cyber-text">
                VIEW SUPPLY REQUISITION
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
          <div className="parchment-bg rounded-lg p-4 text-sm">
            <h3 className="font-bold mb-2 text-void-black gothic-text text-center">
              ⚙ COGITATOR REPORT ⚙
            </h3>
            <ul className="space-y-1 text-void-black/80 tech-text text-xs">
              <li>• Background removed via servo-skull image processing</li>
              <li>• {currentScan.detectedColors.length} dominant color signatures identified</li>
              <li>• {currentScan.recommendedPaints?.length || 0} paint formulations matched from sacred archives</li>
              <li>• Delta-E (ΔE) indicates color purity rating (lower = more accurate)</li>
              <li>• Tap "REVEAL LOCATION" buttons to view color placement on miniature</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
