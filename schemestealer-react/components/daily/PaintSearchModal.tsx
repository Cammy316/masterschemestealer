'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAINT_DATABASE, PaintData } from '@/lib/paintDatabase';

interface PaintSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (paint: PaintData) => void;
}

export function PaintSearchModal({ isOpen, onClose, onSelect }: PaintSearchModalProps) {
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter paints based on query
  const filteredPaints = React.useMemo(() => {
    if (!query) return [];
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    return PAINT_DATABASE.filter((paint) => {
      if (!paint.matchable) return false;
      const searchString = `${paint.brand} ${paint.name} ${paint.aliases.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchString.includes(term));
    }).slice(0, 50); // Limit results for performance
  }, [query]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setHighlightedIndex(0);
      // Small delay to ensure the modal is mounted before focusing
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Scroll into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const element = listRef.current.children[highlightedIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < filteredPaints.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPaints[highlightedIndex]) {
        onSelect(filteredPaints[highlightedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#050a05]/95 backdrop-blur-sm flex flex-col p-4 md:p-8"
        >
          {/* Header & Input */}
          <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 relative">
            <div className="flex justify-between items-center text-[var(--cogitator-green)]">
              <span className="font-mono text-sm tracking-widest uppercase">Select Paint</span>
              <button 
                onClick={onClose}
                className="text-2xl touch-target hover:text-white transition-colors"
                aria-label="Close search"
              >
                ✕
              </button>
            </div>
            
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Enter paint name (e.g. Mephiston Red)"
                className="w-full px-4 py-4 text-lg bg-[#0a0f0a] border-2 border-[var(--cogitator-green)] text-white rounded-sm focus:outline-none focus:border-[var(--imperial-gold)] transition-colors placeholder-[var(--cogitator-green)]/40 gothic-frame tech-text shadow-[0_0_15px_rgba(0,255,65,0.15)]"
                autoComplete="off"
                spellCheck="false"
              />
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--cogitator-green)] hover:text-white touch-target"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 w-full max-w-2xl mx-auto mt-4 overflow-hidden relative">
            {query && filteredPaints.length > 0 ? (
              <ul
                ref={listRef}
                className="h-full overflow-y-auto border border-[var(--cogitator-green)]/30 rounded-sm bg-black/50 scrollbar-thin scrollbar-thumb-[var(--cogitator-green)]/30"
              >
                {filteredPaints.map((paint, index) => (
                  <li
                    key={paint.paint_id}
                    onClick={() => {
                      onSelect(paint);
                      onClose();
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`px-4 py-4 cursor-pointer flex items-center justify-between border-b border-[var(--cogitator-green)]/10 last:border-0 transition-colors ${
                      highlightedIndex === index
                        ? 'bg-[var(--cogitator-green)]/20 text-white border-l-4 border-l-[var(--cogitator-green)]'
                        : 'text-[var(--cogitator-green)] hover:bg-[var(--cogitator-green)]/10 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      <div 
                        className="w-6 h-6 rounded-full border-2 border-white/20 shrink-0 shadow-lg" 
                        style={{ backgroundColor: paint.hex }}
                      />
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-lg truncate">{paint.name}</span>
                        <span className="text-xs opacity-70 uppercase tracking-widest">{paint.brand}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : query && filteredPaints.length === 0 ? (
              <div className="p-6 border border-red-500/50 bg-red-950/20 text-red-400 rounded-sm text-center tech-text">
                NO MATCHING PAINTS FOUND
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-[var(--cogitator-green)]/40 font-mono text-sm opacity-50">
                START TYPING TO SEARCH DATABASE
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
