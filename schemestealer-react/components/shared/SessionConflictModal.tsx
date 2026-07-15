'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { themeForMode } from '@/components/shared/theme';

interface SessionConflictModalProps {
  isOpen: boolean;
  mode: 'miniature' | 'inspiration';
  onClose: () => void;
  onReplace: () => void;
  onMerge: () => void;
}

export function SessionConflictModal({ isOpen, mode, onClose, onReplace, onMerge }: SessionConflictModalProps) {
  const isWarp = mode === 'inspiration';
  
  const containerClass = isWarp 
    ? "bg-void-black/95 border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] backdrop-blur-xl"
    : "bg-dark-gothic border-2 border-cogitator-green/50 shadow-[0_0_30px_rgba(0,255,65,0.15)] textured";
    
  const textClass = isWarp ? "text-purple-100" : "auspex-text";
  const primaryButtonClass = isWarp
    ? "bg-warp-purple text-white hover:bg-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
    : "bg-cogitator-green text-void-black hover:bg-[#00cc33] hover:shadow-[0_0_15px_rgba(0,255,65,0.4)]";
  const secondaryButtonClass = isWarp
    ? "border border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
    : "border border-cogitator-green/50 text-cogitator-green hover:bg-cogitator-green/10";
  const dangerButtonClass = isWarp
    ? "border border-red-500/50 text-red-400 hover:bg-red-500/10"
    : "border border-error/50 text-error hover:bg-error/10";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-md rounded-xl overflow-hidden p-6 ${containerClass}`}
          >
            <div className="mb-6">
              <h2 className={`text-xl font-bold mb-2 ${textClass} ${!isWarp && 'gothic-text'}`}>
                Active Session Detected
              </h2>
              <p className={`text-sm opacity-80 ${isWarp ? 'text-purple-200' : 'text-cogitator-green-dim tech-text'}`}>
                You already have a painting session in progress. How would you like to proceed with these new paints?
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onMerge}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${primaryButtonClass}`}
              >
                Merge with Current Session
              </button>
              
              <button
                onClick={onReplace}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all ${dangerButtonClass}`}
              >
                Clear Current & Start Fresh
              </button>
              
              <button
                onClick={onClose}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all mt-2 ${secondaryButtonClass}`}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
