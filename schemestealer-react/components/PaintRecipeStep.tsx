'use client';

import { useState } from 'react';
import { PaintRecipeCard } from './PaintRecipeCard';

interface Paint {
  name: string;
  brand: string;
  type: string;
  hex: string;
  deltaE: number;
}

interface PaintRecipeStepProps {
  stepName: 'BASE' | 'LAYER' | 'SHADE' | 'HIGHLIGHT';
  paints: Paint[];
  mode: 'miniature' | 'inspiration';
  onAddToCart?: (paint: Paint) => void;
}

export function PaintRecipeStep({ stepName, paints, mode, onAddToCart }: PaintRecipeStepProps) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  const themeColors = mode === 'miniature'
    ? { text: 'text-green-500', border: 'border-green-500', font: 'font-imperial' }
    : { text: 'text-purple-400', border: 'border-purple-500', font: 'font-warp' };

  if (!paints || paints.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">No {stepName.toLowerCase()} paint match</p>
        <p className="text-gray-600 text-xs mt-1">Try a variant from another color</p>
      </div>
    );
  }

  const closestMatch = paints[0]; // Lowest Delta-E
  const alternatives = paints.slice(1); // Remaining paints

  return (
    <div>
      {/* Step header */}
      <h4 className={`text-sm font-bold ${themeColors.text} ${themeColors.font} uppercase tracking-wider mb-2 text-center`}>
        {stepName}
      </h4>

      {/* Closest match */}
      <PaintRecipeCard
        paint={closestMatch}
        mode={mode}
        onAddToCart={() => onAddToCart?.(closestMatch)}
      />

      {/* Alternatives accordion */}
      {alternatives.length > 0 && (
        <div className="mt-2">
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className={`w-full text-xs ${themeColors.text} hover:underline text-center py-1`}
          >
            {showAlternatives ? '▲' : '▼'} {alternatives.length} alternative{alternatives.length > 1 ? 's' : ''}
          </button>

          {showAlternatives && (
            <div className="mt-2 space-y-2 pl-2 border-l-2 border-gray-700">
              {alternatives.map((paint, index) => (
                <PaintRecipeCard
                  key={index}
                  paint={paint}
                  mode={mode}
                  onAddToCart={() => onAddToCart?.(paint)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
