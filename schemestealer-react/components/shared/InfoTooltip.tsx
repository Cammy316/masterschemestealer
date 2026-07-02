import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function InfoTooltip({ text, position = 'bottom' }: { text: ReactNode; position?: 'top' | 'bottom' | 'left' | 'right' }) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsHovered(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center justify-center z-50 pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button 
        type="button"
        className="min-w-[44px] min-h-[44px] flex items-center justify-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass group"
        onClick={() => setIsHovered(!isHovered)}
        aria-label="Information"
      >
        <div className={`w-5 h-5 rounded-sm border-2 border-brass/50 text-imperial-gold flex items-center justify-center text-[10px] font-bold cursor-help transition-all shadow-inner group-active:scale-95 ${isHovered ? 'bg-brass/20 drop-shadow-[0_0_4px_rgba(184,134,11,0.5)] border-brass' : 'bg-black/80 group-hover:bg-charcoal group-hover:border-brass/80'}`}>
          ?
        </div>
      </button>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${positionClasses[position]} w-48 p-3 bg-void-black/95 border border-brass/50 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.8)] backdrop-blur-md text-[10px] text-gray-300 normal-case tracking-normal tech-text z-50`}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
