/**
 * Miniscan mode - Cogitator-themed scanning for painted miniatures
 * Imperial aesthetic with auspex green and gothic frames
 */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { scanMiniature, ApiError } from '@/lib/api';
import { detectColorsOffline } from '@/lib/offlineColorDetection';
import { CogitatorUpload } from '@/components/miniscan/CogitatorUpload';
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';
import { motion } from 'framer-motion';

export default function MiniscanPage() {
  const router = useRouter();
  const { setMode, setScanResult, offlineMode } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMode('miniature');
  }, [setMode]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      let result;

      if (offlineMode) {
        // Use offline color detection
        result = await detectColorsOffline(file, 'miniature', {
          numColors: 6,
          numPaintMatches: 5,
        });
      } else {
        // Call API to scan miniature
        result = await scanMiniature(file);
      }

      setScanResult(result);
      router.push('/miniature/results');
    } catch (err) {
      console.error('Scan error:', err);

      let errorMessage = 'COGITATOR ERROR: Failed to process scan data';
      if (err instanceof ApiError) {
        errorMessage = `AUSPEX FAILURE: ${err.message}`;
      } else if (err instanceof Error && err.message.includes('Network')) {
        errorMessage = 'VOX CONNECTION LOST: Cannot reach cogitator mainframe (localhost:8000)';
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleCameraActivate = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  if (isProcessing) {
    return <LoadingAnimation mode="miniature" />;
  }

  return (
    <div className="min-h-screen pb-24 pt-8 px-4 cogitator-screen" style={{ background: 'var(--void-black)' }}>
      {/* Targeting brackets - corner overlays */}
      <div className="fixed inset-4 pointer-events-none z-20">
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-500/30" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-green-500/30" />
        {/* Bottom Left */}
        <div className="absolute bottom-20 left-0 w-8 h-8 border-l-2 border-b-2 border-green-500/30" />
        {/* Bottom Right */}
        <div className="absolute bottom-20 right-0 w-8 h-8 border-r-2 border-b-2 border-green-500/30" />
      </div>

      {/* Status readout corner */}
      <div className="fixed top-6 right-4 text-green-500/40 text-xs font-mono z-20 pointer-events-none">
        <div>SIG: 98.2%</div>
        <div>RNG: OPTM</div>
      </div>

      {/* Header */}
      <motion.div
        className="max-w-2xl mx-auto mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gothic-text mb-2 auspex-text">
          ◆ MINISCAN PROTOCOL ◆
        </h1>
        <p className="text-cogitator-green-dim tech-text text-sm">
          Identify sacred paint formulations from painted miniatures
        </p>
        <motion.div
          className="mt-2 text-xs text-brass cyber-text"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ⚙ MACHINE SPIRIT STATUS: ACTIVE ⚙
        </motion.div>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CogitatorUpload
          onFileSelect={handleFileSelect}
          onCameraActivate={handleCameraActivate}
          disabled={isProcessing}
        />
      </motion.div>

      {/* Hidden camera input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleCameraChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <motion.div
          className="max-w-2xl mx-auto mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="gothic-frame rounded-lg p-1 textured">
            <div className="bg-dark-gothic rounded-lg p-4 border-2 border-error depth-2">
              <div className="flex items-center gap-3">
                {/* Warning icon - Imperial aquila with exclamation */}
                <div className="flex-shrink-0">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-error font-bold cyber-text text-sm mb-1 text-shadow-sm">
                    ◆ SYSTEM ALERT ◆
                  </div>
                  <p className="text-error/90 text-xs tech-text leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        className="max-w-2xl mx-auto mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="parchment-bg rounded-lg p-4 text-sm">
          <h3 className="font-bold mb-2 text-void-black gothic-text text-center">
            ⚙ OPERATIONAL GUIDANCE ⚙
          </h3>
          <ul className="space-y-1 text-void-black/80 tech-text text-xs">
            <li>• Ensure adequate illumination for optimal pict-capture</li>
            <li>• Center miniature within targeting reticle</li>
            <li>• Avoid reflective surfaces that may confuse the auspex</li>
            <li>• For best results, photograph against neutral background</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
