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
import { HowToScanModal } from '@/components/shared/HowToScanModal';
import { AnimatePresence } from 'framer-motion';
import { WarmupStrip } from '@/components/shared/WarmupStrip';

// Component to display scrolling/changing technogargle text
function Technogargle() {
  const [sig, setSig] = useState('98.2');
  const [rng, setRng] = useState('OPTM');
  const [hex, setHex] = useState('0x4F2A');

  React.useEffect(() => {
    const interval = setInterval(() => {
      // Randomly change values every second for "thinking" effect
      setSig((90 + Math.random() * 9.9).toFixed(1));
      
      const states = ['OPTM', 'SCAN', 'SYNC', 'CALC', 'ACTV'];
      setRng(states[Math.floor(Math.random() * states.length)]);
      
      setHex('0x' + Math.floor(Math.random() * 65535).toString(16).toUpperCase().padStart(4, '0'));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-6 right-4 text-green-500/40 text-[10px] font-mono z-20 pointer-events-none text-right flex flex-col items-end leading-tight">
      <motion.div
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        SIG: {sig}%
      </motion.div>
      <motion.div
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.1, repeat: Infinity, delay: 0.5 }}
      >
        SYS: {rng}
      </motion.div>
      <motion.div
        className="text-[8px] mt-0.5 opacity-50"
      >
        {hex}
      </motion.div>
    </div>
  );
}

export default function MiniscanPage() {
  const router = useRouter();
  const setMode = useAppStore((s) => s.setMode);
  const setScanResult = useAppStore((s) => s.setScanResult);
  const apiReady = useApiReady();
  const [showReveal, setShowReveal] = useState(false);
  const [modelProgress, setModelProgress] = useState<number | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showHowToScan, setShowHowToScan] = useState(false);

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

  // We no longer use inline apiWarmupBanner

  // If we have an active scan (processing) or are showing the reveal, we still 
  // render the main layout but pass the state down to CogitatorUpload so it can
  // handle the integrated cinematic sequence inside its CRT screen.


  return (
    <div className="min-h-dvh pt-8 sm:pt-10 px-4 cogitator-screen flex flex-col" style={{ background: 'var(--void-black)' }}>
      {/* Targeting brackets - corner overlays */}
      <div className="fixed inset-4 pointer-events-none z-20">
        {/* Top Left */}
        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-green-500/30" />
        {/* Top Right */}
        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-green-500/30" />
      </div>

      {/* Status readout corner */}
      <Technogargle />

      {/* Header */}
      <motion.div
        className="max-w-2xl mx-auto w-full mb-0 sm:mb-4 text-center relative shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(1.5rem,5vw,1.875rem)] text-balance font-bold gothic-text mb-1 sm:mb-2 auspex-text">
          ◆ MINISCAN PROTOCOL ◆
        </h1>
        <p className="text-cogitator-green-dim tech-text text-xs sm:text-sm mb-1 sm:mb-2 leading-tight">
          Identify sacred paint formulations from painted miniatures
        </p>
        <button
          onClick={() => setShowHowToScan(true)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-[var(--cogitator-green)]/60 hover:text-[var(--cogitator-green)] transition-colors touch-target px-2 py-1 rounded hover:bg-[var(--cogitator-green)]/10"
        >
          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center opacity-80">?</span>
          <span>How to use</span>
        </button>
      </motion.div>

      {(!apiReady && !isProcessing && !offlineMode) && (
        <WarmupStrip theme="cogitator" onUseLocal={() => setOfflineMode(true)} />
      )}

      {/* Upload Component */}
      <motion.div
        className="max-w-2xl mx-auto w-full flex-1 flex flex-col pb-24 sm:pb-32"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <CogitatorUpload
          onFileSelect={handleFileSelect}
          onCameraActivate={handleCameraActivate}
          disabled={isProcessing || showReveal || !!result}
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

      <AnimatePresence>
        {showHowToScan && <HowToScanModal onClose={() => setShowHowToScan(false)} />}
      </AnimatePresence>
    </div>
  );
}
