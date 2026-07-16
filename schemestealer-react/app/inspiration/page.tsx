/**
 * Inspiration mode - Warp Portal themed page for extracting color palettes
 * Chaos aesthetic with swirling portal and ethereal effects
 */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { WarpPortal } from '@/components/inspiration/WarpPortal';
import { CosmicBackground } from '@/components/shared/CosmicBackground';
import { HowToScanModal } from '@/components/shared/HowToScanModal';
import { AnimatePresence, motion } from 'framer-motion';
import { WarmupStrip } from '@/components/shared/WarmupStrip';
import { useApiReady } from '@/hooks/useApiReady';
import { useScan } from '@/hooks/useScan';

export default function InspirationPage() {
  const router = useRouter();
  const setMode = useAppStore((s) => s.setMode);
  const setScanResult = useAppStore((s) => s.setScanResult);
  const apiReady = useApiReady();
  const [hasUploaded, setHasUploaded] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showHowToScan, setShowHowToScan] = useState(false);

  const { isProcessing, error, result, scan, retry, fallbackToOffline, markCommitted } =
    useScan('inspiration');

  React.useEffect(() => {
    setMode('inspiration');
  }, [setMode]);

  // Commit and navigate once a scan completes. Trigger the burst transition!
  React.useEffect(() => {
    if (result && !isBursting) {
      setIsBursting(true);
      setScanResult(result);
      markCommitted();
      
      // Delay navigation to let the vortex burst animation play
      setTimeout(() => {
        router.push('/inspiration/results');
      }, 700);
    }
  }, [result, setScanResult, markCommitted, router, isBursting]);

  // Reset the portal's uploaded state when an error surfaces so it can retry.
  React.useEffect(() => {
    if (error) setHasUploaded(false);
  }, [error]);

  const handleFileSelect = (file: File) => {
    setHasUploaded(true);
    scan(file);
  };

  const handlePortalActivate = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const offlineMode = useAppStore(s => s.offlineMode);
  const setOfflineMode = useAppStore(s => s.setOfflineMode);

  // We no longer use inline apiWarmupBanner

  // Instead, the WarpPortal component stays mounted and uses the isActive={isProcessing}
  // prop to transition into its "Hyper-Drive" loading state!

  return (
    <div className="flex-1 void-bg overflow-x-hidden">
      {/* Full-page fixed starfield */}
      <CosmicBackground />

      {/* Header */}
      <motion.div
        className="max-w-2xl mx-auto mb-2 sm:mb-4 text-center relative pt-2 sm:pt-4 px-4 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: (isProcessing || isBursting) ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(1.2rem,5vw,1.875rem)] text-balance font-bold gothic-text mb-2 warp-text text-shadow-lg" style={{ textShadow: '0 0 20px var(--ethereal-glow-strong)' }}>
          ◆ IMMATERIUM CONDUIT ◆
        </h1>
        <p className="text-warp-purple-light text-sm gothic-text mb-1 sm:mb-2 leading-tight">
          Offer a visual sacrifice to divine its chromatic essence
        </p>
        <button
          onClick={() => setShowHowToScan(true)}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-mono text-[var(--warp-purple-light)]/60 hover:text-[var(--warp-purple-light)] transition-colors touch-target px-2 py-1 rounded hover:bg-[var(--warp-purple)]/20"
        >
          <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center opacity-80">?</span>
          <span>Channeling Guide</span>
        </button>
      </motion.div>

      <WarmupStrip
        theme="warp"
        open={!apiReady && !isProcessing && !offlineMode}
        onUseLocal={() => setOfflineMode(true)}
      />

      {/* Warp Portal - THE HERO */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <WarpPortal
          onActivate={handlePortalActivate}
          isActive={isProcessing || isBursting}
          disabled={isProcessing}
          hasUploaded={hasUploaded}
        />

        {/* Portal-Centered Burst Effects */}
        {isBursting && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-[var(--z-modal)]">
            {/* The Singular Collapse */}
            <motion.div
              className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_50px_20px_rgba(255,255,255,1)]"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{ duration: 0.3, ease: 'easeIn' }}
            />
            {/* The Burst Wave */}
            <motion.div
              className="absolute rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(236,72,153,0.9) 0%, rgba(139,92,246,0.8) 40%, rgba(20,184,166,0.4) 80%, rgba(0,0,0,0) 100%)',
                mixBlendMode: 'screen'
              }}
              initial={{ width: 0, height: 0, opacity: 1 }}
              animate={{ width: '300vw', height: '300vw', opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            />
          </div>
        )}
      </motion.div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error message */}
      {error && (
        <motion.div
          className="max-w-2xl mx-auto px-4 mt-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="warp-border rounded-lg p-1 depth-2">
            <div className="bg-void-blue rounded-lg p-4 textured">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="flex-shrink-0"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--warp-pink)" strokeWidth="2">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>
                <div>
                  <div className="text-warp-pink font-bold gothic-text text-sm mb-1 text-shadow-sm">
                    ◆ WARP ANOMALY ◆
                  </div>
                  <p className="text-warp-purple-light/80 text-xs font-medium leading-relaxed">
                    {error.flavour}
                  </p>
                  <p className="text-warp-purple-light/60 text-xs font-medium leading-relaxed mt-1">
                    {error.plain}
                  </p>
                </div>
              </div>
              {error.retryable && (
                <button
                  onClick={retry}
                  className="mt-4 w-full py-3 px-6 rounded-lg border-2 border-purple-500 bg-void-blue touch-target text-sm font-bold warp-text"
                >
                  ◆ RE-ESTABLISH VOX LINK ◆
                </button>
              )}
              {error.retryable && (
                <button
                  onClick={fallbackToOffline}
                  className="mt-2 w-full py-3 px-6 rounded-lg border border-warp-teal/50 bg-warp-teal/10 touch-target text-warp-teal"
                >
                  <span className="block text-sm font-bold">◆ USE LOCAL AUSPEX ◆</span>
                  <span className="block text-xs text-warp-teal/70 mt-0.5">
                    Faster, but less precise — runs on this device
                  </span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {(!isProcessing && !isBursting) && (
        <AnimatePresence>
          {showHowToScan && <HowToScanModal onClose={() => setShowHowToScan(false)} />}
        </AnimatePresence>
      )}

      {/* Vortex Burst Screen Wash */}
      {isBursting && (
        <div className="fixed inset-0 z-[var(--z-modal)] pointer-events-none">
          {/* Screen wash */}
          <motion.div 
            className="absolute inset-0 bg-warp-purple/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
        </div>
      )}
    </div>
  );
}
