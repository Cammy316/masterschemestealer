/**
 * Cogitator Upload - Gothic-themed upload area for Miniscan mode
 * Imperial aesthetic with brass frames and auspex green accents
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { ServoSkull } from './ServoSkull';
import { ActiveAuspexScan } from './ActiveAuspexScan';
import type { ScanResult } from '@/lib/types';

interface CogitatorUploadProps {
  onFileSelect: (file: File) => void;
  onCameraActivate: () => void;
  disabled?: boolean;
  
  isProcessing?: boolean;
  showReveal?: boolean;
  localImageUrl?: string | null;
  result?: ScanResult | null;
  modelProgress?: number | null;
  onRevealComplete?: () => void;
}

export function CogitatorUpload({ 
  onFileSelect, 
  onCameraActivate, 
  disabled = false,
  isProcessing = false,
  showReveal = false,
  localImageUrl,
  result,
  modelProgress,
  onRevealComplete
}: CogitatorUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative max-w-2xl mx-auto w-full">
      {/* Brass Casing */}
      <div 
        className="rounded-xl p-2 md:p-3 shadow-2xl relative"
        style={{
          background: 'linear-gradient(135deg, #1a1510 0%, #4a3e20 20%, #8b7337 50%, #4a3e20 80%, #1a1510 100%)',
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.8)',
          border: '1px solid #a38947'
        }}
      >
        {/* Rivets */}
        {[
          'top-3 left-3', 'top-3 right-3', 
          'bottom-3 left-3', 'bottom-3 right-3'
        ].map(pos => (
          <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full bg-[#1a1510] border border-[#a38947] shadow-inner z-20`} />
        ))}

        {/* CRT Screen Frame */}
        <div 
          className="rounded-lg p-4 md:p-8 relative overflow-hidden flex flex-col"
          style={{
            backgroundColor: '#031005',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.9), inset 0 0 20px rgba(0,255,0,0.15)',
            border: '2px solid #0a0a0a',
          }}
        >
          {/* Active Auspex Grid */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,255,0,0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,255,0,0.4) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* CRT Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none mix-blend-overlay z-10" />

          {/* Slow Scrolling Hex Memory Addresses */}
          <div className="absolute left-1 top-0 bottom-0 w-10 overflow-hidden pointer-events-none opacity-20 select-none z-0 hidden sm:block">
            <motion.div 
              className="flex flex-col gap-1 text-[10px] text-green-500 font-mono tracking-tighter"
              animate={{ y: [0, -1000] }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i}>0x{Math.floor(((i * 997) % 65535)).toString(16).toUpperCase().padStart(4, '0')}</div>
              ))}
            </motion.div>
          </div>
          <div className="absolute right-1 top-0 bottom-0 w-10 overflow-hidden pointer-events-none opacity-20 select-none z-0 hidden sm:block">
            <motion.div 
              className="flex flex-col gap-1 text-[10px] text-green-500 font-mono tracking-tighter items-end"
              animate={{ y: [-1000, 0] }}
              transition={{ duration: 70, repeat: Infinity, ease: 'linear' }}
            >
              {Array.from({ length: 60 }).map((_, i) => (
                <div key={i}>0x{Math.floor(((i * 701) % 65535)).toString(16).toUpperCase().padStart(4, '0')}</div>
              ))}
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 sm:px-6">
            
            {(isProcessing || showReveal) && localImageUrl ? (
              <div className="flex flex-col items-center">
                <ServoSkull className="w-16 h-16 mb-4 z-20 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]" isScanning={isProcessing} />
                <ActiveAuspexScan 
                  localImageUrl={localImageUrl}
                  resultImageUrl={result?.imageUrl}
                  isProcessing={isProcessing}
                  showReveal={showReveal}
                  progress={modelProgress}
                  onRevealComplete={onRevealComplete}
                  reticleData={
                    result?.detectedColors.map((c, i) => ({
                      x: c.position?.x ?? 500,
                      y: c.position?.y ?? 500,
                      color: c.hex,
                      name: c.family || `Color ${i + 1}`,
                    })) || []
                  }
                />
              </div>
            ) : (
              <>
                <div className="flex justify-center mb-6">
                  <ServoSkull className="w-20 h-24" isScanning={false} />
                </div>

                {/* Title */}
                <h2 className="auspex-text text-[clamp(1rem,4.5vw,1.25rem)] text-balance font-bold text-center mb-2 gothic-text" style={{ textShadow: '0 0 10px var(--cogitator-green)' }}>
                  ◆ INITIALIZE AUSPEX SCAN ◆
                </h2>
                <p className="text-cogitator-green-dim text-sm text-center mb-6 tech-text">
                  Upload cogitator data or activate pict-capture servo-skull
                </p>

                {/* Buttons */}
                <div className="space-y-3">
              {/* Camera button */}
              <motion.button
                onClick={onCameraActivate}
                disabled={disabled}
                className="w-full py-4 px-6 rounded-lg border border-cogitator-green bg-black/60 hover:bg-cogitator-green/10 touch-target disabled:opacity-50"
                style={{ boxShadow: 'inset 0 0 15px rgba(0,255,0,0.05)' }}
                whileHover={disabled ? {} : {
                  boxShadow: 'inset 0 0 20px rgba(0,255,0,0.15), 0 0 15px var(--cogitator-green-glow)',
                  scale: 1.01,
                }}
                whileTap={disabled ? {} : { scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="auspex-text font-bold cyber-text tracking-widest text-sm">
                    ACTIVATE PICT-CAPTURE
                  </span>
                </div>
              </motion.button>

              {/* Upload button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />
              <motion.button
                onClick={handleUploadClick}
                disabled={disabled}
                className="w-full py-4 px-6 rounded-lg border border-brass bg-black/60 hover:bg-brass/10 cursor-pointer touch-target disabled:opacity-50"
                style={{ boxShadow: 'inset 0 0 15px rgba(163,137,71,0.05)' }}
                whileHover={disabled ? {} : {
                  boxShadow: 'inset 0 0 20px rgba(163,137,71,0.15), 0 0 15px rgba(163,137,71,0.5)',
                  scale: 1.01,
                }}
                whileTap={disabled ? {} : { scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--brass)" strokeWidth="2">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="12" y1="11" x2="12" y2="17" strokeLinecap="round" />
                    <line x1="9" y1="14" x2="15" y2="14" strokeLinecap="round" />
                  </svg>
                  <span className="text-brass font-bold cyber-text tracking-widest text-sm">
                    UPLOAD FROM ARCHIVE
                  </span>
                </div>
              </motion.button>
            </div>

            {/* Info text */}
            <motion.p
              className="text-center text-[10px] text-cogitator-green-dim mt-6 tech-text uppercase tracking-widest"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              [ Recommended: Clear lighting, miniature centered ]
            </motion.p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CogitatorUpload;
