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
import { ShareButton } from '@/components/ShareButton';
import { ShareModal } from '@/components/ShareModal';

export default function InspirationResultsPage() {
  const router = useRouter();
  const { currentScan, clearCurrentScan } = useAppStore();
  const [showShareModal, setShowShareModal] = useState(false);

  React.useEffect(() => {
    // Redirect if no scan result
    if (!currentScan || currentScan.mode !== 'inspiration') {
      router.push('/inspiration');
    }
  }, [currentScan, router]);

  if (!currentScan) {
    return null;
  }

  const handleScanAnother = () => {
    clearCurrentScan();
    router.push('/inspiration');
  };

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 void-bg">
      {/* Starfield background */}
      <div className="starfield-bg fixed inset-0 -z-10" />

      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold gothic-text mb-2 warp-text text-shadow-lg">
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

        {/* Source image with ethereal frame */}
        {currentScan.imageData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="warp-border rounded-2xl overflow-hidden p-1">
              <div className="bg-dark-gothic rounded-xl overflow-hidden">
                <img src={currentScan.imageData} alt="Inspiration source" className="w-full h-auto" />
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
            <div className="warp-border rounded-2xl p-1 depth-3">
              <div className="bg-dark-gothic rounded-xl p-6 textured">
                <ColorPalette colors={currentScan.detectedColors} title="◆ EXTRACTED ESSENCE ◆" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Paint Recommendations - Per Color with PaintRecipeCard */}
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
              <div className="warp-border rounded-2xl p-1 depth-2">
                <div className="bg-dark-gothic rounded-xl p-6 textured">
                  {/* Color Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0"
                      style={{
                        backgroundColor: color.hex,
                        boxShadow: `0 0 15px ${color.hex}40`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold warp-text gothic-text truncate">
                        {color.family || `Color ${index + 1}`}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-sm text-warp-purple-light/70 tech-text">
                          {color.percentage?.toFixed(1)}%
                        </span>
                        <span className="text-sm text-warp-teal/70 tech-text">{color.hex}</span>
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
                    />
                  ) : color.paintMatches ? (
                    // Legacy fallback: old paintMatches format
                    <PaintResults
                      colorName={color.family || `Color ${index + 1}`}
                      colorHex={color.hex}
                      paintMatches={color.paintMatches}
                      mode="inspiration"
                    />
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}

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
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <motion.button
            onClick={handleScanAnother}
            className="w-full py-4 px-6 rounded-lg relative overflow-hidden touch-target warp-border textured"
            style={{
              background: 'linear-gradient(135deg, var(--warp-purple-dark), var(--warp-pink))',
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 30px var(--ethereal-glow)',
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
              animate={{
                x: ['-200%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />

            <div className="flex items-center justify-center gap-3 relative z-10">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="warp-text font-bold cyber-text text-base">
                CHANNEL THE WARP AGAIN
              </span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/cart')}
            className="w-full py-4 px-6 rounded-lg border-2 border-warp-teal bg-dark-gothic touch-target textured"
            whileHover={{
              boxShadow: '0 0 20px var(--warp-teal)',
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
                stroke="var(--warp-teal)"
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
              <span className="text-warp-teal font-bold cyber-text">VIEW REQUISITIONS</span>
            </div>
          </motion.button>

          <ShareButton mode="inspiration" onShareClick={() => setShowShareModal(true)} />
        </motion.div>

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="warp-border rounded-lg p-1 depth-2">
            <div className="bg-cosmic-purple rounded-lg p-5 text-sm textured">
              <div className="flex items-center justify-center gap-2 mb-3">
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
                <h3 className="font-bold text-warp-purple-light gothic-text text-center">
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
              <div className="w-16 h-px bg-warp-purple-light/30 mx-auto mb-3" />
              <ul className="space-y-2 text-white/90 tech-text text-xs leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-warp-purple-light/70 flex-shrink-0">►</span>
                  <span>
                    These {currentScan.detectedColors.length} colors form a harmonious scheme
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warp-pink/70 flex-shrink-0">►</span>
                  <span>Each color shows BASE, SHADE, HIGHLIGHT, and WASH recommendations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warp-teal/70 flex-shrink-0">►</span>
                  <span>Switch brands per color using the tabs above each recipe</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warp-purple-light/70 flex-shrink-0">►</span>
                  <span>
                    Delta-E ({'\u0394'}E) shows paint accuracy (lower = closer match)
                  </span>
                </li>
              </ul>
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
            imageUrl: currentScan.imageData,
          }}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
