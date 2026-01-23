'use client';

import { useState } from 'react';
import { PaintCardHorizontal } from './PaintCardHorizontal';

interface Paint {
  name: string;
  brand: string;
  type: string;
  hex: string;
  deltaE: number;
}

interface BrandAccordionSectionProps {
  brandName: string;
  brandIcon: string;
  paints: Paint[];
  mode: 'miniature' | 'inspiration';
  defaultOpen?: boolean;
  onAddToCart?: (paint: Paint) => void;
}

export function BrandAccordionSection({
  brandName,
  brandIcon,
  paints,
  mode,
  defaultOpen = false,
  onAddToCart,
}: BrandAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const themeColors = mode === 'miniature'
    ? {
        border: 'border-green-500',
        text: 'text-green-500',
        bg: 'bg-green-600',
        font: 'font-imperial'
      }
    : {
        border: 'border-purple-500',
        text: 'text-purple-400',
        bg: 'bg-purple-600',
        font: 'font-warp'
      };

  if (paints.length === 0) return null;

  return (
    <div className={`border-2 ${themeColors.border} border-opacity-50 rounded-lg overflow-hidden`}>
      {/* Accordion header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 flex items-center justify-between ${themeColors.bg} bg-opacity-20 hover:bg-opacity-30 transition-colors`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{brandIcon}</span>
          <h3 className={`text-lg font-bold ${themeColors.text} ${themeColors.font} uppercase tracking-wide`}>
            {brandName}
          </h3>
          <span className="text-sm text-gray-400">
            ({paints.length} {paints.length === 1 ? 'match' : 'matches'})
          </span>
        </div>
        <svg
          className={`w-6 h-6 ${themeColors.text} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Accordion content - horizontal scrolling */}
      {isOpen && (
        <div className="p-4 bg-gray-900 bg-opacity-50">
          {/* Horizontal scroll container */}
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            <div className="flex gap-3 pb-2">
              {paints.map((paint, index) => (
                <PaintCardHorizontal
                  key={index}
                  paint={paint}
                  mode={mode}
                  onAddToCart={() => onAddToCart?.(paint)}
                />
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          {paints.length > 1 && (
            <p className="text-xs text-gray-500 text-center mt-2">
              ← Swipe to see more matches →
            </p>
          )}
        </div>
      )}
    </div>
  );
}
