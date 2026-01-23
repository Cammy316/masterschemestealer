'use client';

import { useState } from 'react';
import { PaintRecipeStep } from './PaintRecipeStep';

interface Paint {
  name: string;
  brand: string;
  type: string;
  hex: string;
  deltaE: number;
}

interface PaintsByStep {
  base: Paint[];
  layer: Paint[];
  shade: Paint[];
  highlight: Paint[];
}

interface BrandRecipeAccordionProps {
  brandName: string;
  brandIcon: string;
  paintsByStep: PaintsByStep;
  mode: 'miniature' | 'inspiration';
  defaultOpen?: boolean;
  onAddToCart?: (paint: Paint) => void;
}

export function BrandRecipeAccordion({
  brandName,
  brandIcon,
  paintsByStep,
  mode,
  defaultOpen = false,
  onAddToCart,
}: BrandRecipeAccordionProps) {
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

  const totalPaints =
    paintsByStep.base.length +
    paintsByStep.layer.length +
    paintsByStep.shade.length +
    paintsByStep.highlight.length;

  if (totalPaints === 0) return null;

  return (
    <div className={`border-2 ${themeColors.border} border-opacity-50 rounded-lg overflow-hidden`}>
      {/* Accordion header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 flex items-center justify-between ${themeColors.bg} bg-opacity-20 hover:bg-opacity-30 transition-colors`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{brandIcon}</span>
          <h3 className={`text-base sm:text-lg font-bold ${themeColors.text} ${themeColors.font} uppercase tracking-wide`}>
            {brandName}
          </h3>
          <span className="text-sm text-gray-400">
            ({totalPaints} {totalPaints === 1 ? 'paint' : 'paints'})
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

      {/* Accordion content - painting recipe grid */}
      {isOpen && (
        <div className="p-4 bg-gray-900 bg-opacity-50">
          {/* Recipe sequence header */}
          <div className={`text-center mb-4 pb-3 border-b-2 ${themeColors.border} border-opacity-30`}>
            <p className={`text-sm ${themeColors.text} ${themeColors.font} tracking-wider`}>
              PAINTING SEQUENCE
            </p>
            <p className="text-xs text-gray-400 mt-1">
              BASE → LAYER → SHADE → HIGHLIGHT
            </p>
          </div>

          {/* Grid of recipe steps - responsive */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PaintRecipeStep
              stepName="BASE"
              paints={paintsByStep.base}
              mode={mode}
              onAddToCart={onAddToCart}
            />
            <PaintRecipeStep
              stepName="LAYER"
              paints={paintsByStep.layer}
              mode={mode}
              onAddToCart={onAddToCart}
            />
            <PaintRecipeStep
              stepName="SHADE"
              paints={paintsByStep.shade}
              mode={mode}
              onAddToCart={onAddToCart}
            />
            <PaintRecipeStep
              stepName="HIGHLIGHT"
              paints={paintsByStep.highlight}
              mode={mode}
              onAddToCart={onAddToCart}
            />
          </div>

          {/* Helper text */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Showing closest match per step. Click ▼ to see alternatives.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
