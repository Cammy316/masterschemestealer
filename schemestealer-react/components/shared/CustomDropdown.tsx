'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  formatOption?: (val: string) => string;
}

export function CustomDropdown({ value, options, onChange, formatOption = (v) => v }: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative z-30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between min-w-[120px] bg-charcoal border text-[10px] rounded px-3 py-1.5 uppercase tracking-widest outline-none transition-all active:scale-95 ${isOpen ? 'border-brass text-imperial-gold shadow-[0_0_8px_rgba(184,134,11,0.3)]' : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'}`}
      >
        <span className="truncate mr-2">{formatOption(value)}</span>
        <svg 
          width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={`flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-imperial-gold' : ''}`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 w-full max-h-48 overflow-y-auto bg-[#0a0a0a] border border-gray-700 rounded shadow-[0_4px_20px_rgba(0,0,0,0.8)] backdrop-blur-md scrollbar-hide"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-[10px] uppercase tracking-widest transition-colors ${value === opt ? 'bg-brass/20 text-imperial-gold font-bold' : 'text-gray-400 hover:bg-charcoal hover:text-white'}`}
              >
                {formatOption(opt)}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
