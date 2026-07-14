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
            Guess the target <strong className="text-[var(--cogitator-green)] text-base">SWATCHLE</strong> paint in 6 tries.
          </p>
          <p>
            After each guess, the clues will guide you towards the target colour.
          </p>
          <p className="text-xs italic text-gray-400">
            The small chip next to the paint name shows your color family match (Green: Exact, Yellow: Adjacent, Red: Far).
          </p>

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="font-bold text-white mb-4 tracking-widest text-xs uppercase">Examples</h3>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-2 h-8">
                <div className="flex-1 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-sm">
                  <span className="text-xs font-bold text-gray-300">→ WARMER</span>
                </div>
              </div>
              <p className="text-xs">
                <strong className="text-white">Hue:</strong> The target hue is <strong className="text-white">warmer</strong> than your guess (closer to orange-red).
              </p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-2 h-8">
                <div className="flex-1 flex items-center justify-center bg-gray-900 border border-gray-800 rounded-sm">
                  <span className="text-xs font-bold text-gray-300 flex items-center gap-1">▲ LIGHTER</span>
                </div>
              </div>
              <p className="text-xs">
                <strong className="text-white">Lightness:</strong> The target paint is <strong className="text-white">lighter</strong> than your guess.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex gap-2 mb-2 h-8">
                <div className="flex-1 flex flex-col bg-gray-900 border border-gray-800 rounded-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 bg-[#ff9800] opacity-40" style={{ width: '80%' }} />
                  <div className="relative z-10 w-full h-full flex items-center justify-between px-2">
                    <span className="text-[10px] font-bold text-gray-400">▲</span>
                    <span className="text-[10px] font-bold text-white">HOT</span>
                  </div>
                </div>
              </div>
              <p className="text-xs">
                <strong className="text-white">Proximity (Heat):</strong> Shows how visually close the colors are overall (ΔE). You are getting hotter!
              </p>
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
