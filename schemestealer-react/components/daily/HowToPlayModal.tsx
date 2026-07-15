'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface HowToPlayModalProps {
  onClose: () => void;
}

export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
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
          className="absolute top-4 right-4 text-gray-500 hover:text-white touch-target flex items-center justify-center w-11 h-11"
        >
          ✕
        </button>

        <h2 className="text-xl gothic-text text-[var(--cogitator-green)] mb-6 text-center">HOW TO PLAY</h2>

        <div className="text-sm text-gray-300 space-y-4">
          <p>
            Guess the secret paint in six tries. Every guess must be a real paint — start typing in the empty row to search.
          </p>
          <ul className="space-y-2 list-none p-0 m-0">
            <li>① Look at the colour swatch at the top — that's the mystery paint.</li>
            <li>② Type a paint name into the empty row and pick it from the list.</li>
            <li>③ Use the clues after each guess to close in on the answer.</li>
          </ul>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="font-bold text-white mb-4 tracking-widest text-xs uppercase">Example Clues</h3>
            
            <div className="flex flex-col gap-1.5 mb-4 p-2 bg-white/5 rounded-sm">
              <div className="flex w-full h-6 rounded-sm overflow-hidden border border-white/10 shadow-sm">
                <div className="flex-1 relative flex items-center justify-center bg-[#9e2a2b]">
                  <span className="bg-black/60 text-white/90 px-2 py-0.5 rounded-sm text-[11px] font-bold tracking-widest backdrop-blur-sm">YOU</span>
                </div>
                <div className="w-0.5 bg-black/50 z-10" />
                <div className="flex-1 relative flex items-center justify-center bg-[#2f4f4f]">
                  <span className="bg-black/60 text-white/90 px-2 py-0.5 rounded-sm text-[11px] font-bold tracking-widest backdrop-blur-sm">TARGET</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 mb-2">
                <strong className="text-white">Swatch bar:</strong> Your guess on the left, the mystery paint on the right.
              </p>

              <div className="flex items-center justify-between px-0.5 mt-2">
                <span className="text-sm font-bold text-white truncate max-w-[70%]">Mephiston Red</span>
                <div className="px-2 py-0.5 rounded-sm text-[11px] font-bold uppercase tracking-widest bg-[#d29922]/20 border border-[#d29922]/50 text-[#d29922]">
                  RED
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1 mb-2">
                <strong className="text-white">Colour family:</strong> green = same colour family, amber = a neighbouring family, red = far away.
              </p>
              
              <div className="grid grid-cols-3 gap-2 h-9 mt-2">
                <div className="flex items-center justify-center border border-white/10 bg-black/40 rounded-sm">
                  <span className="text-[11px] font-bold text-gray-300">
                    ← COOLER
                  </span>
                </div>
                <div className="flex items-center justify-center border border-white/10 bg-black/40 rounded-sm">
                  <span className="text-[11px] font-bold text-gray-300 flex items-center gap-1">
                    ▼ DARKER
                  </span>
                </div>
                <div className="flex flex-col border border-white/10 bg-black/40 rounded-sm relative overflow-hidden">
                  <div 
                    className="absolute left-0 top-0 bottom-0 z-0 opacity-40 transition-all duration-1000 bg-[#ff9800]"
                    style={{ width: `70%` }}
                  />
                  <div className="relative z-10 w-full h-full flex items-center justify-between px-2">
                     <span className="text-[11px] font-bold text-gray-400">▲</span>
                     <span className="text-[11px] font-bold text-white">HOT</span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-2 space-y-2">
                <strong className="text-white block">Hue cell:</strong> WARMER means the answer sits closer to red and orange than your guess; COOLER means closer to blue and green. A tick means the hue matches.<br/><br/>
                <strong className="text-white block">Lightness cell:</strong> LIGHTER or DARKER — is the answer a lighter or darker shade?<br/><br/>
                <strong className="text-white block">Heat bar:</strong> How close your guess looks overall — the fuller and hotter the bar (COLD → WARM → HOT), the closer you are. The small arrow shows whether you're getting closer (▲) or further away (▼) than your previous guess. (For the curious: it's driven by the colour-difference score ΔE.)
              </p>
            </div>
          </div>
          
          <div className="border-t border-[var(--cogitator-green)]/30 pt-4 mt-6">
            <p className="text-center font-mono text-[11px] text-[var(--cogitator-green)]/60 uppercase">A new Swatchle appears at midnight, local time.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
