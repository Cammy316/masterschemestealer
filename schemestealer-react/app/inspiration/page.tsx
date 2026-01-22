/**
 * Inspiration mode - Warp Portal themed page for extracting color palettes
 * Chaos aesthetic with swirling portal and ethereal effects
 */

'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { scanInspiration, ApiError } from '@/lib/api';
import { WarpPortal } from '@/components/inspiration/WarpPortal';
import { LoadingAnimation } from '@/components/shared/LoadingAnimations';
import { motion } from 'framer-motion';

export default function InspirationPage() {
  const router = useRouter();
  const { setMode, setScanResult } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setMode('inspiration');
  }, [setMode]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);

    try {
      // Call API to scan inspiration image
      const result = await scanInspiration(file);
      setScanResult(result);
      router.push('/inspiration/results');
    } catch (err) {
      console.error('Scan error:', err);

      let errorMessage = 'THE VEIL REJECTS YOUR OFFERING';
      if (err instanceof ApiError) {
        errorMessage = `WARP DISTURBANCE: ${err.message}`;
      } else if (err instanceof Error && err.message.includes('Network')) {
        errorMessage = 'IMMATERIUM BREACH: Cannot establish connection to the Warp (localhost:8000)';
      }

      setError(errorMessage);
      setIsProcessing(false);
    }
  };

  const handlePortalActivate = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  if (isProcessing) {
    return <LoadingAnimation mode="inspiration" />;
  }

  return (
    <div className="min-h-screen pb-24 void-bg">
      {/* Starfield background */}
      <div className="starfield-bg fixed inset-0 pointer-events-none" />

      {/* Header */}
      <motion.div
        className="max-w-2xl mx-auto pt-8 px-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold gothic-text mb-2 warp-text">
          ◆ INSPIRATION PROTOCOL ◆
        </h1>
        <p className="text-warp-purple-light text-sm gothic-text">
          Extract chromatic essence from the Immaterium
        </p>
        <motion.div
          className="mt-2 text-xs text-warp-teal font-medium"
          animate={{
            opacity: [0.5, 1, 0.5],
            textShadow: [
              '0 0 10px var(--ethereal-glow)',
              '0 0 20px var(--ethereal-glow)',
              '0 0 10px var(--ethereal-glow)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ◆ THE WARP AWAITS ◆
        </motion.div>
      </motion.div>

      {/* Warp Portal - THE HERO */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <WarpPortal
          onActivate={handlePortalActivate}
          isActive={isProcessing}
          disabled={isProcessing}
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
                  <p className="text-warp-purple-light/80 text-xs font-medium leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions */}
      <motion.div
        className="max-w-2xl mx-auto px-4 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div
          className="rounded-lg p-4 text-sm"
          style={{
            background: 'linear-gradient(135deg, var(--cosmic-purple), var(--void-blue))',
            border: '1px solid var(--warp-purple)',
          }}
        >
          <h3 className="font-bold mb-2 text-white gothic-text text-center">
            ◆ CHANNELING GUIDANCE ◆
          </h3>
          <ul className="space-y-1 text-white/80 text-xs font-medium">
            <li>• Upload any image: artwork, sunsets, photographs, landscapes</li>
            <li>• The Warp will extract 5-8 dominant hues from your offering</li>
            <li>• Receive paint recommendations to manifest these colors</li>
            <li>• No background removal - the entire image feeds the ritual</li>
          </ul>
        </div>
      </motion.div>

    </div>
  );
}
