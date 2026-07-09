'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAINT_DATABASE, PaintData } from '@/lib/paintDatabase';

interface GuessAutocompleteProps {
  onSelect: (paint: PaintData) => void;
  disabled?: boolean;
}

export function GuessAutocomplete({ onSelect, disabled }: GuessAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter paints based on query (search brand and name)
  const filteredPaints = React.useMemo(() => {
    if (!query) return [];
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    return PAINT_DATABASE.filter((paint) => {
      // Exclude paints that can't be valid answers (washes, metallics, discontinued etc) based on the same rules, 
      // but actually for guessing, we might just let them guess any paint. The rules say "bounded to paintDatabase".
      // We will let them search any matchable paint to not spoil what's not in the pool.
      if (!paint.matchable) return false;
      
      const searchString = `${paint.brand} ${paint.name} ${paint.aliases.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchString.includes(term));
    }).slice(0, 50); // Limit results for performance
  }, [query]);

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen && query) setIsOpen(true);
      setHighlightedIndex(prev => (prev < filteredPaints.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredPaints[highlightedIndex]) {
        handleSelect(filteredPaints[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (paint: PaintData) => {
    onSelect(paint);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(0);
    // Return focus to input for next guess
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-md mx-auto" ref={containerRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (query) setIsOpen(true);
          }}
          disabled={disabled}
          placeholder="Enter a paint name (e.g. Mephiston Red)"
          className="w-full px-4 py-3 bg-[#0a0f0a] border-2 border-[var(--cogitator-green)]/30 text-[var(--cogitator-green)] rounded-sm focus:outline-none focus:border-[var(--cogitator-green)] transition-colors placeholder-[var(--cogitator-green)]/30 gothic-frame tech-text disabled:opacity-50"
          autoComplete="off"
          spellCheck="false"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cogitator-green)]/50 hover:text-[var(--cogitator-green)] p-1"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query && filteredPaints.length > 0 && (
          <motion.ul
            ref={listRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-[#0a0f0a] border border-[var(--cogitator-green)]/50 rounded-sm shadow-[0_4px_20px_rgba(0,0,0,0.8)] scrollbar-thin scrollbar-thumb-[var(--cogitator-green)]/30 scrollbar-track-transparent"
          >
            {filteredPaints.map((paint, index) => (
              <li
                key={paint.paint_id}
                onClick={() => handleSelect(paint)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-3 cursor-pointer flex items-center justify-between border-b border-[var(--cogitator-green)]/10 last:border-0 transition-colors ${
                  highlightedIndex === index
                    ? 'bg-[var(--cogitator-green)]/20 text-white'
                    : 'text-[var(--cogitator-green)]/80 hover:bg-[var(--cogitator-green)]/10'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div 
                    className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                    style={{ backgroundColor: paint.hex }}
                  />
                  <div className="flex flex-col truncate">
                    <span className="font-bold truncate">{paint.name}</span>
                    <span className="text-xs opacity-60 uppercase tracking-widest">{paint.brand}</span>
                  </div>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      
      {isOpen && query && filteredPaints.length === 0 && (
        <div className="absolute z-50 w-full mt-1 p-4 bg-[#0a0f0a] border border-red-500/50 text-red-400 rounded-sm shadow-xl text-center tech-text text-sm">
          NO MATCHING PAINTS IN DATABASE
        </div>
      )}
    </div>
  );
}
