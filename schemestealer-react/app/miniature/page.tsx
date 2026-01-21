/**
 * Miniscan mode - Cogitator-themed scanning for painted miniatures
 * Imperial aesthetic with auspex green and gothic frames
 */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { scanMiniature, ApiError } from '@/lib/api';
import { CogitatorUpload } from '@/components/miniscan/CogitatorUpload';
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';
import { motion } from 'framer-motion';

export default function MiniscanPage() {
  const router = useRouter();
  const { setMode, setScanResult } = useAppStore();
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
      // Call API to scan miniature
      const result = await scanMiniature(file);
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
    <div className="min-h-screen pb-24 pt-8 px-4" style={{ background: 'var(--void-black)' }}>
      {/* Scanline overlay */}
      <div className="scanline" />

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
          <div className="gothic-frame rounded-lg p-1">
            <div className="bg-dark-gothic rounded-lg p-4 border-2 border-error">
              <div className="flex items-center gap-3">
                <span className="text-3xl">⚠️</span>
                <div>
                  <div className="text-error font-bold cyber-text text-sm mb-1">
                    ◆ SYSTEM ALERT ◆
                  </div>
                  <p className="text-error/80 text-xs tech-text">{error}</p>
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
