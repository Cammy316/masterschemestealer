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
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';
import { motion } from 'framer-motion';
import { useApiReady } from '@/hooks/useApiReady';
import { useScan } from '@/hooks/useScan';

export default function InspirationPage() {
  const router = useRouter();
  const setMode = useAppStore((s) => s.setMode);
  const setScanResult = useAppStore((s) => s.setScanResult);
  const apiReady = useApiReady();
  const [hasUploaded, setHasUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isProcessing, error, result, scan, retry, fallbackToOffline, markCommitted } =
    useScan('inspiration');

  React.useEffect(() => {
    setMode('inspiration');
  }, [setMode]);

  // Commit and navigate once a scan completes.
  React.useEffect(() => {
    if (result) {
      setScanResult(result);
      markCommitted();
      router.push('/inspiration/results');
    }
  }, [result, setScanResult, markCommitted, router]);

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

  // Show warm-up screen while backend scanner is initialising
  if (!apiReady) {
    return (
      <div className="min-h-dvh flex items-center justify-center void-bg">
        <CosmicBackground />
        <div className="text-center px-8 relative z-10">
          <motion.div
            className="text-5xl mb-6"
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ◆
          </motion.div>
          <h2 className="text-xl font-bold gothic-text warp-text mb-2">
            WARP CONDUIT STABILISING
          </h2>
          <p className="text-warp-purple-light gothic-text text-sm mb-6">
            Communing with the Immaterium... please wait
          </p>
          <motion.div
            className="flex gap-2 justify-center"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-purple-500" />
            ))}
          </motion.div>
          <p className="text-warp-purple-light/40 gothic-text text-xs mt-6">
            First activation after dormancy takes ~60 seconds
          </p>
        </div>
      </div>
    );
  }

  // We no longer return the LoadingAnimation early here.
  // Instead, the WarpPortal component stays mounted and uses the isActive={isProcessing}
  // prop to transition into its "Hyper-Drive" loading state!

  return (
    <div className="min-h-dvh pb-24 void-bg overflow-x-hidden">
      {/* Full-page fixed starfield */}
      <CosmicBackground />

      {/* Header */}
      <motion.div
        className="max-w-2xl mx-auto pt-4 sm:pt-8 px-4 text-center relative z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isProcessing ? 0 : 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-[clamp(1.2rem,5vw,1.875rem)] text-balance font-bold gothic-text mb-2 warp-text text-shadow-lg" style={{ textShadow: '0 0 20px var(--ethereal-glow-strong)' }}>
          ◆ IMMATERIUM CONDUIT ◆
        </h1>
        <p className="text-warp-purple-light text-sm gothic-text">
          Offer a visual sacrifice to divine its chromatic essence
        </p>
      </motion.div>

      {/* Warp Portal - THE HERO */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <WarpPortal
          onActivate={handlePortalActivate}
          isActive={isProcessing}
          disabled={isProcessing}
          hasUploaded={hasUploaded}
        />
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

      {/* Instructions - Hide during processing so focus is entirely on the portal */}
      {!isProcessing && (
        <motion.div
          className="max-w-2xl mx-auto px-4 mt-8 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div
          className="rounded-lg p-4 text-sm relative overflow-hidden group shadow-[0_0_15px_rgba(139,92,246,0.15)]"
          style={{
            background: 'linear-gradient(135deg, rgba(30,27,75,0.8), rgba(15,15,35,0.9))',
            border: '1px solid var(--warp-purple)',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
          <h3 className="font-bold mb-3 text-warp-purple-light gothic-text text-center text-shadow-sm flex items-center justify-center gap-2">
            <span className="text-warp-purple-light/50 text-xs">◆</span>
            CHANNELING GUIDANCE
            <span className="text-warp-purple-light/50 text-xs">◆</span>
          </h3>
          <ul className="space-y-2 text-warp-purple-light/90 text-xs font-medium relative z-10 pl-2 mx-4" style={{ borderLeft: '1px solid rgba(139,92,246,0.3)' }}>
            <li className="flex items-start gap-2">
              <span className="text-warp-purple-light/50 mt-0.5 text-[10px]">✧</span>
              Upload any image: artwork, sunsets, photographs, landscapes
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warp-purple-light/50 mt-0.5 text-[10px]">✧</span>
              The Warp will extract 5-8 dominant hues from your offering
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warp-purple-light/50 mt-0.5 text-[10px]">✧</span>
              Receive paint recommendations to manifest these colors
            </li>
            <li className="flex items-start gap-2">
              <span className="text-warp-purple-light/50 mt-0.5 text-[10px]">✧</span>
              No background removal - the entire image feeds the ritual
            </li>
          </ul>
        </div>
      </motion.div>
      )}

    </div>
  );
}
