/**
 * Inspiration results page - Warp Portal themed display
 * Big beautiful color swatches with ethereal effects
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { ColorPalette } from '@/components/inspiration/ColorPalette';
import { PaintList } from '@/components/PaintCard';

export default function InspirationResultsPage() {
  const router = useRouter();
  const { currentScan, clearCurrentScan } = useAppStore();

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
          <h1 className="text-3xl font-bold gothic-text mb-2 warp-text">
            ✧ ESSENCE EXTRACTED ✧
          </h1>
          <p className="text-warp-purple-light tech-text">
            {currentScan.detectedColors.length} chromatic signatures manifested from the Immaterium
          </p>
          <motion.div
            className="mt-2 text-xs text-warp-teal cyber-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ✦ WARP EXTRACTION COMPLETE ✦
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
                <img
                  src={currentScan.imageData}
                  alt="Inspiration source"
                  className="w-full h-auto"
                />
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
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="warp-border rounded-2xl p-1">
              <div className="bg-dark-gothic rounded-xl p-6">
                <ColorPalette
                  colors={currentScan.detectedColors}
                  title="🎨 EXTRACTED ESSENCE"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Paint Recommendations */}
        {currentScan.recommendedPaints && currentScan.recommendedPaints.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="warp-border rounded-2xl p-1">
              <div className="bg-dark-gothic rounded-xl p-6">
                <h3 className="text-xl font-bold warp-text gothic-text mb-4 text-center">
                  ✧ MATERIAL FORMULATIONS ✧
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
            className="w-full py-4 px-6 rounded-lg relative overflow-hidden touch-target warp-border"
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
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
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
              <span className="text-2xl">✦</span>
              <span className="warp-text font-bold cyber-text text-base">
                CHANNEL THE WARP AGAIN
              </span>
            </div>
          </motion.button>

          <motion.button
            onClick={() => router.push('/cart')}
            className="w-full py-4 px-6 rounded-lg border-2 border-warp-teal bg-dark-gothic touch-target"
            whileHover={{
              boxShadow: '0 0 20px var(--warp-teal)',
              scale: 1.02,
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">🛒</span>
              <span className="text-warp-teal font-bold cyber-text">
                VIEW REQUISITIONS
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
          <div className="warp-border rounded-lg p-1">
            <div className="bg-cosmic-purple rounded-lg p-4 text-sm">
              <h3 className="font-bold mb-3 text-warp-purple-light gothic-text text-center">
                ✧ PALETTE GUIDANCE ✧
              </h3>
              <ul className="space-y-2 text-white/80 tech-text text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-warp-purple-light">✦</span>
                  <span>These {currentScan.detectedColors.length} colors form a harmonious scheme</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warp-pink">✦</span>
                  <span>Dominant colors (higher %) for primary areas</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warp-teal">✦</span>
                  <span>Accent colors for details and highlights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-warp-purple-light">✦</span>
                  <span>Delta-E (ΔE) shows paint accuracy (lower = closer match)</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
