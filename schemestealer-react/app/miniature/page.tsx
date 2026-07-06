/**
 * Miniscan mode - Cogitator-themed scanning for painted miniatures
 * Imperial aesthetic with auspex green and gothic frames
 */

'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { CogitatorUpload } from '@/components/miniscan/CogitatorUpload';
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';
import { ModelDownloadProgress } from '@/components/shared/ModelDownloadProgress';
import { ScanReveal } from '@/components/miniscan/ScanReveal';
import { motion } from 'framer-motion';
import { useApiReady } from '@/hooks/useApiReady';
import { useScan } from '@/hooks/useScan';
import { prepareMiniatureImage } from '@/lib/backgroundRemoval';

export default function MiniscanPage() {
  const router = useRouter();
  const setMode = useAppStore((s) => s.setMode);
  const setScanResult = useAppStore((s) => s.setScanResult);
  const apiReady = useApiReady();
  const [showReveal, setShowReveal] = useState(false);
  const [modelProgress, setModelProgress] = useState<number | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Resize then remove the background in the browser (with model-download
  // progress). The backend requires a client-side RGBA PNG, so on failure this
  // throws and the scan surfaces an error (with the local-auspex fallback).
  const preprocess = useCallback(
    (file: File): Promise<File> => prepareMiniatureImage(file, { onProgress: setModelProgress }),
    []
  );

  const { isProcessing, error, result, scan, retry, fallbackToOffline, markCommitted } = useScan(
    'miniature',
    { preprocess }
  );

  React.useEffect(() => {
    setMode('miniature');
  }, [setMode]);

  // When a scan completes, show the reveal animation (commit happens after it).
  React.useEffect(() => {
    if (result) setShowReveal(true);
  }, [result]);

  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    setShowReveal(false);
    // Create a local object URL for the initial wireframe scan animation
    if (localImageUrl) {
      URL.revokeObjectURL(localImageUrl);
    }
    setLocalImageUrl(URL.createObjectURL(file));
    scan(file);
  };

  const handleRevealComplete = () => {
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

  const offlineMode = useAppStore(s => s.offlineMode);
  const setOfflineMode = useAppStore(s => s.setOfflineMode);

  // Display a subtle warm-up banner instead of gating the entire UI
  const apiWarmupBanner = !apiReady && !isProcessing && !offlineMode && (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/80 border border-green-500/50 rounded-full px-4 py-2 flex flex-col sm:flex-row items-center gap-3 shadow-[0_0_10px_rgba(0,255,65,0.2)] backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="text-green-500">
          ⚙
        </motion.div>
        <span className="text-xs text-green-500 tech-text uppercase tracking-widest">
          Machine Spirit Waking (~60s)
        </span>
      </div>
      <button 
        onClick={() => setOfflineMode(true)}
        className="text-[10px] text-brass border border-brass/50 rounded px-2 py-1 hover:bg-brass/20 transition-colors uppercase font-bold tracking-widest mt-2 sm:mt-0"
      >
        USE LOCAL AUSPEX
      </button>
    </motion.div>
  );

  // If we have an active scan (processing) or are showing the reveal, we still 
  // render the main layout but pass the state down to CogitatorUpload so it can
  // handle the integrated cinematic sequence inside its CRT screen.


  return (
    <div className="min-h-dvh pb-24 pt-[clamp(0.75rem,3vh,2rem)] px-4 cogitator-screen" style={{ background: 'var(--void-black)' }}>
      {apiWarmupBanner}
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
        className="max-w-2xl mx-auto mb-[clamp(1rem,3vh,2rem)] text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(1.5rem,5vw,1.875rem)] text-balance font-bold gothic-text mb-2 auspex-text">
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

      {/* Upload & Scan Area */}
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CogitatorUpload
          onFileSelect={handleFileSelect}
          onCameraActivate={handleCameraActivate}
          disabled={isProcessing || showReveal}
          isProcessing={isProcessing}
          showReveal={showReveal}
          localImageUrl={localImageUrl}
          result={result}
          modelProgress={modelProgress}
          onRevealComplete={handleRevealComplete}
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
              {error.retryable && (
                <button
                  onClick={fallbackToOffline}
                  className="mt-2 w-full py-3 px-6 rounded-lg border border-brass/50 bg-brass/10 touch-target text-brass"
                >
                  <span className="block text-sm font-bold cyber-text">◆ USE LOCAL AUSPEX ◆</span>
                  <span className="block text-xs tech-text text-brass/70 mt-0.5">
                    Faster, but less precise — runs on this device
                  </span>
                </button>
              )}
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
        <div className="rounded-lg p-4 text-sm border border-cogitator-green/30 bg-black/60 relative overflow-hidden group shadow-[0_0_15px_rgba(0,255,65,0.05)]">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,255,65,0.03)_2px,rgba(0,255,65,0.03)_4px)] pointer-events-none" />
          <h3 className="font-bold mb-3 text-cogitator-green cyber-text text-center text-shadow-sm flex items-center justify-center gap-2">
            <span className="text-cogitator-green/60">⚙</span>
            OPERATIONAL GUIDANCE
            <span className="text-cogitator-green/60">⚙</span>
          </h3>
          <ul className="space-y-2 text-cogitator-green/80 tech-text text-xs relative z-10 pl-2 border-l border-cogitator-green/20 mx-4">
            <li className="flex items-start gap-2">
              <span className="text-cogitator-green/50 mt-0.5">{'>'}</span>
              Ensure adequate illumination for optimal pict-capture
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cogitator-green/50 mt-0.5">{'>'}</span>
              Center miniature within targeting reticle
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cogitator-green/50 mt-0.5">{'>'}</span>
              Avoid reflective surfaces that may confuse the auspex
            </li>
            <li className="flex items-start gap-2">
              <span className="text-cogitator-green/50 mt-0.5">{'>'}</span>
              For best results, photograph against neutral background
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
