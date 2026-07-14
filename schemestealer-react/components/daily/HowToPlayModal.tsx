'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  // Lock body scroll while open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0a0f0a] border border-[var(--cogitator-green)]/30 p-6 rounded-sm max-w-sm w-full max-h-[90dvh] overflow-y-auto shadow-2xl relative"
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white touch-target flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-xl gothic-text text-[var(--cogitator-green)] mb-6 text-center">HOW TO PLAY</h2>

        <div className="text-sm text-gray-300 space-y-4">
          <p>
            Guess the target <strong className="text-[var(--cogitator-green)] text-base">SWATCHLE</strong> paint in 6 tries.
          </p>
          <p>
            After each guess, the color of the tiles will change to show how close your guess was to the target.
          </p>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="font-bold text-white mb-2 tracking-widest text-xs uppercase">Examples</h3>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-1 h-8">
                <div className="flex-1 flex items-center justify-center bg-[#2ea043]/20 border border-[#2ea043] text-[#2ea043] rounded-sm text-xs font-bold">✓ BRAND</div>
              </div>
              <p className="text-xs">The target paint is from the <strong className="text-white">same brand</strong> as your guess.</p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-1 h-8">
                <div className="flex-1 flex items-center justify-center bg-[#d29922]/20 border border-[#d29922] text-[#d29922] rounded-sm text-xs font-bold capitalize">adjacent family</div>
              </div>
              <p className="text-xs">Yellow means your color is in a <strong className="text-white">closely adjacent</strong> color family (e.g., Red vs Magenta).</p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-1 h-8">
                <div className="flex-1 flex flex-col items-center justify-center bg-[#2ea043]/20 border border-[#2ea043] text-[#2ea043] rounded-sm font-bold">
                  <span className="text-[9px] opacity-60 mb-0.5 font-mono tracking-widest leading-none">LIGHT</span>
                  <span className="leading-none">▲</span>
                </div>
              </div>
              <p className="text-xs">The arrow points towards the target. An up arrow means the target paint is <strong className="text-white">lighter</strong> than your guess.</p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-1 h-8">
                <div className="flex-1 flex items-center justify-center bg-blue-500/20 border border-blue-500 text-blue-400 rounded-sm text-xs font-bold">ΔE 2.1</div>
              </div>
              <p className="text-xs">The <strong className="text-white">Match (Delta E)</strong> score tells you how visually close the colors are. Look for perfect Green matches!</p>
            </div>
          </div>
          
          <div className="border-t border-[var(--cogitator-green)]/30 pt-4 mt-6">
            <p className="text-center font-mono text-[10px] text-[var(--cogitator-green)]/60 uppercase">A new Swatchle is available each day!</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
