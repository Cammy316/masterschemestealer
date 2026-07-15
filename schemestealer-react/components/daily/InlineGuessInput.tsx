'use client';

import React, { useState, useRef, useEffect, useMemo, KeyboardEvent } from 'react';
import { PaintData } from '@/lib/paintDatabase';
import { searchPaints } from '@/lib/paintSearch';

interface InlineGuessInputProps {
  guessNumber: number;
  onSelect: (paint: PaintData) => void;
}

export function InlineGuessInput({ guessNumber, onSelect }: InlineGuessInputProps) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filteredPaints = useMemo(() => {
    return searchPaints(query, 8);
  }, [query]);

  useEffect(() => {
    if (focused && listRef.current && highlightedIndex >= 0) {
      const element = listRef.current.children[highlightedIndex] as HTMLElement;
      if (element) {
        element.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, focused]);

  const handleFocus = () => {
    setFocused(true);
    setTimeout(() => {
      if (wrapperRef.current) {
        wrapperRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
      }
      
      const onResize = () => {
        if (wrapperRef.current) {
          wrapperRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', onResize);
        }
      };
      
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', onResize);
      }
    }, 300);
  };

  const handleBlur = () => {
    setFocused(false);
  };

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
        inputRef.current?.blur();
      }
    } else if (e.key === 'Escape') {
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const showDropdown = query.length > 0 && focused;

  return (
    <div ref={wrapperRef} className="relative scroll-mt-4 w-full">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlightedIndex(0);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={`GUESS ${guessNumber} OF 6 — TYPE A PAINT NAME`}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint="go"
        role="combobox"
        aria-expanded={showDropdown}
        className="h-14 w-full text-base bg-[var(--cogitator-green)]/10 border border-[var(--cogitator-green)] text-white text-center font-mono tracking-widest outline-none placeholder:text-[var(--cogitator-green)]/40 focus:border-[var(--imperial-gold)] focus:ring-1 focus:ring-[var(--imperial-gold)]/50 transition-colors"
      />
      
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1 z-[var(--z-dropdown)] bg-[#0a0f0a] border border-[var(--cogitator-green)] shadow-[0_4px_20px_rgba(0,255,65,0.15)] rounded-sm max-h-[240px] overflow-y-auto">
          {filteredPaints.length > 0 ? (
            <ul ref={listRef} className="py-1">
              {filteredPaints.map((paint, idx) => {
                const isHighlighted = idx === highlightedIndex;
                return (
                  <li
                    key={paint.paint_id}
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseDown={(e) => e.preventDefault()} // CRITICAL: prevent blur before click
                    onClick={() => {
                      onSelect(paint);
                      inputRef.current?.blur();
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`min-h-[44px] touch-target px-4 py-2 flex items-center gap-3 cursor-pointer transition-colors border-l-4 ${
                      isHighlighted
                        ? 'bg-[var(--cogitator-green)]/20 border-[var(--cogitator-green)]'
                        : 'border-transparent hover:bg-[var(--cogitator-green)]/10'
                    }`}
                  >
                    <div 
                      className="w-5 h-5 rounded-full border border-white/20 shrink-0" 
                      style={{ backgroundColor: paint.hex }}
                    />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-base font-bold text-white truncate">{paint.name}</span>
                      <span className="text-[11px] text-[var(--cogitator-green)]/70 uppercase tracking-widest truncate">{paint.brand}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="min-h-[44px] touch-target px-4 py-3 flex items-center justify-center text-red-400 text-[11px] font-mono tracking-widest">
              NO MATCHING PAINTS
            </div>
          )}
        </div>
      )}
    </div>
  );
}
