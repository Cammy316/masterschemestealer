'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface HowToScanModalProps {
  onClose: () => void;
}

export function HowToScanModal({ onClose }: HowToScanModalProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0a0f0a] border border-[var(--imperial-gold)]/30 p-6 rounded-sm max-w-sm w-full max-h-[90dvh] overflow-y-auto shadow-2xl relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white touch-target flex items-center justify-center w-11 h-11"
        >
          ✕
        </button>

        <h2 className="text-xl gothic-text text-[var(--imperial-gold)] mb-6 text-center">HOW TO SCAN</h2>

        <div className="text-sm text-gray-300 space-y-4">
          <p>
            Upload a photo of a miniature (<strong>MINISCAN</strong>) or any inspiration image (<strong>INSPIRATION</strong>).
          </p>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="font-bold text-white mb-4 tracking-widest text-xs uppercase">Interaction Guide</h3>
            
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-sm">🔒</div>
                <div>
                  <strong className="text-white block mb-1">Lock Targets</strong>
                  Tap the padlock icon on a colour to lock it. This ensures it stays in your palette when you swap other paints.
                </div>
              </li>
              
              <li className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-sm text-[10px]">🎨</div>
                <div>
                  <strong className="text-white block mb-1">Brand Details</strong>
                  Tap any paint swatch to reveal its exact brand, name, and Delta-E match quality.
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-gray-900 border border-gray-700 rounded-sm text-[10px]">🔄</div>
                <div>
                  <strong className="text-white block mb-1">Substitutions</strong>
                  If you don't own a paint, the engine will automatically suggest the closest alternative from other brands.
                </div>
              </li>
            </ul>
          </div>
          
          <div className="border-t border-[var(--imperial-gold)]/30 pt-4 mt-6">
            <p className="text-center font-mono text-[10px] text-[var(--imperial-gold)]/60 uppercase tracking-widest">Auspex Pattern Recognition</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
