/**
 * Miniscan mode - Cogitator-themed scanning for painted miniatures
 * Imperial aesthetic with auspex green and gothic frames
 */

'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { removeBackground } from '@imgly/background-removal';
import { CogitatorUpload } from '@/components/miniscan/CogitatorUpload';
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';
import { ScanReveal } from '@/components/miniscan/ScanReveal';
import { motion } from 'framer-motion';
import { useApiReady } from '@/hooks/useApiReady';
import { useScan } from '@/hooks/useScan';

export default function MiniscanPage() {
  const router = useRouter();
  const setMode = useAppStore((s) => s.setMode);
  const setScanResult = useAppStore((s) => s.setScanResult);
  const offlineMode = useAppStore((s) => s.offlineMode);
  const apiReady = useApiReady(offlineMode);
  const [showReveal, setShowReveal] = useState(false);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Miniature mode removes the background in the browser, then sends the RGBA
  // PNG to the backend. Prompt 4 modifies this preprocess; the hook is untouched.
  const preprocess = useCallback(async (file: File): Promise<File> => {
    try {
      const bgRemovedBlob = await removeBackground(file);
      return new File([bgRemovedBlob], file.name.replace(/\.[^.]+$/, '.png'), {
        type: 'image/png',
      });
    } catch {
      // Browser bg removal failed — the server will handle it.
      return file;
    }
  }, []);

  const { isProcessing, error, result, scan, retry, markCommitted } = useScan('miniature', {
    preprocess,
  });

  React.useEffect(() => {
    setMode('miniature');
  }, [setMode]);

  // When a scan completes, show the reveal animation (commit happens after it).
  React.useEffect(() => {
    if (result) setShowReveal(true);
  }, [result]);

  const handleFileSelect = (file: File) => {
    setShowReveal(false);
    scan(file);
  };

  const handleRevealComplete = () => {
    // Animation complete — commit to store and navigate. The store now owns the
    // object URL lifecycle, so release it from the hook.
    if (result) {
      setScanResult(result);
      markCommitted();
      router.push('/miniature/results');
    }
  };

  const handleCameraActivate = () => {
    cameraInputRef.current?.click();
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  // Show warm-up screen while backend scanner is initialising
  if (!apiReady) {
    return (
      <div className="min-h-screen flex items-center justify-center cogitator-screen" style={{ background: 'var(--void-black)' }}>
        <div className="text-center px-8">
          <motion.div
            className="text-5xl mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          >
            ⚙
          </motion.div>
          <h2 className="text-xl font-bold gothic-text auspex-text mb-2">
            MACHINE SPIRIT AWAKENING
          </h2>
          <p className="text-cogitator-green-dim tech-text text-sm mb-6">
            Initialising Cogitator arrays... please wait
          </p>
          <motion.div
            className="flex gap-2 justify-center"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-green-500" />
            ))}
          </motion.div>
          <p className="text-cogitator-green-dim/50 tech-text text-xs mt-6">
            First activation after dormancy takes ~60 seconds
          </p>
        </div>
      </div>
    );
  }

  // Show loading animation while processing
  if (isProcessing) {
    return <LoadingAnimation mode="miniature" />;
  }

  // Show reveal animation after scan complete
  if (showReveal && result && result.imageUrl) {
    // Prepare reticle data for bloom animation
    // Use a reference frame of 1000x1000 and distribute colors evenly
    const centerX = 500;
    const centerY = 500;
    const radius = 200; // pixels from center

    const reticleData = result.detectedColors.map((color, index) => {
      // Distribute colors evenly in a circle
      const angle = (index * (Math.PI * 2)) / result.detectedColors.length;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      return {
        x,
        y,
        color: color.hex,
        name: color.family || `Color ${index + 1}`,
      };
    });

    return (
      <div className="min-h-screen pb-24 pt-8 px-4 cogitator-screen" style={{ background: 'var(--void-black)' }}>
        <div className="max-w-2xl mx-auto">
          <ScanReveal
            imageUrl={result.imageUrl}
            reticleData={reticleData}
            onComplete={handleRevealComplete}
          />
        </div>
      </div>
    );
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
                  <p className="text-error/90 text-xs tech-text leading-relaxed">{error.flavour}</p>
                  <p className="text-cogitator-green-dim/90 text-xs tech-text leading-relaxed mt-1">
                    {error.plain}
                  </p>
                </div>
              </div>
              {error.retryable && (
                <button
                  onClick={retry}
                  className="mt-4 w-full py-3 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic touch-target tech-text text-sm font-bold auspex-text"
                >
                  ◆ RE-ESTABLISH VOX LINK ◆
                </button>
              )}
              {/* Prompt 4 extension point: offline-fallback button goes here. */}
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
