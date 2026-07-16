'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

interface HowToScanModalProps {
  onClose: () => void;
}

export function HowToScanModal({ onClose }: HowToScanModalProps) {
  const mode = useAppStore(s => s.currentMode);
  const isWarp = mode === 'inspiration';
  const titleColor = isWarp ? 'text-[var(--warp-purple-light)]' : 'text-[var(--cogitator-green)]';
  // Theme runs deeper than the title: frame + footer follow the page's palette.
  const frameBorder = isWarp ? 'border-[var(--warp-purple)]/40' : 'border-[var(--imperial-gold)]/30';
  const footerBorder = isWarp ? 'border-[var(--warp-purple)]/30' : 'border-[var(--imperial-gold)]/30';
  const footerText = isWarp ? 'text-[var(--warp-purple-light)]/60' : 'text-[var(--imperial-gold)]/60';
  const footerLabel = isWarp ? 'Warp-Divination Protocol' : 'Auspex Pattern Recognition';

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
        className={`bg-[#0a0f0a] border ${frameBorder} p-6 rounded-sm max-w-sm w-full max-h-[90dvh] overflow-y-auto shadow-2xl relative`}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white touch-target flex items-center justify-center w-11 h-11"
        >
          ✕
        </button>

        <h2 className={`text-xl gothic-text mb-6 text-center ${titleColor}`}>
          {isWarp ? 'CHANNELLING GUIDE' : 'HOW TO SCAN'}
        </h2>

        <div className="text-sm text-gray-300 space-y-4">
          {!isWarp ? (
            <>
              <ol className="list-decimal pl-5 space-y-2 text-xs">
                <li><strong className="text-white">good, even light</strong> — daylight or a desk lamp, no harsh shadows</li>
                <li><strong className="text-white">plain, neutral background</strong></li>
                <li><strong className="text-white">avoid gloss glare</strong> — tilt the model or diffuse the light</li>
                <li><strong className="text-white">fill the frame</strong> with the miniature.</li>
              </ol>
              <div className="mt-4">
                <h3 className="font-bold text-[var(--imperial-gold)] mb-1 text-xs uppercase tracking-widest">What You Get</h3>
                <p className="text-xs">The full paint recipe per colour with budget-brand matches.</p>
              </div>
            </>
          ) : (
            <>
              <ol className="list-decimal pl-5 space-y-2 text-xs">
                <li><strong className="text-white">any image works</strong> — art, sunsets, screenshots, photographs</li>
                <li><strong className="text-white">the conduit extracts</strong> 5–8 dominant hues</li>
                <li><strong className="text-white">each hue is matched</strong> to real paints across six brands</li>
                <li><strong className="text-white">the whole image is read</strong> (no background removal) — crop to the region you love first.</li>
              </ol>
            </>
          )}

          <div className="border-t border-gray-800 pt-4 mt-4">
            <h3 className="font-bold text-white mb-3 tracking-widest text-xs uppercase">After The Scan</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2">
                <span>🔒</span>
                <span><strong>Lock Targets:</strong> Tap the padlock to keep a colour when swapping other paints.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🎨</span>
                <span><strong>Brand Details:</strong> Tap any swatch for exact brand, name, and match quality.</span>
              </li>
              <li className="flex items-start gap-2">
                <span>🔄</span>
                <span><strong>Substitutions:</strong> Automatically find the closest alternatives from other brands.</span>
              </li>
            </ul>
          </div>
          
          <div className={`border-t ${footerBorder} pt-4 mt-6`}>
            <p className={`text-center font-mono text-[11px] ${footerText} uppercase tracking-widest`}>{footerLabel}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
