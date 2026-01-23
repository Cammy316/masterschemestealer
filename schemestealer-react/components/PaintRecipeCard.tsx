'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PaintRecipeCardProps {
  paint: {
    name: string;
    brand: string;
    type: string; // base, layer, shade, highlight
    hex: string;
    deltaE: number;
  };
  mode: 'miniature' | 'inspiration';
  onAddToCart?: () => void;
}

export function PaintRecipeCard({ paint, mode, onAddToCart }: PaintRecipeCardProps) {
  const { copied, copyToClipboard } = useCopyToClipboard(2000);

  const themeColors = mode === 'miniature'
    ? { primary: 'bg-green-600', text: 'text-green-500', border: 'border-green-500' }
    : { primary: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' };

  return (
    <div className={`p-3 bg-gray-800/80 rounded-lg border-2 ${themeColors.border} border-opacity-30 hover:border-opacity-60 transition-all`}>
      {/* Paint swatch */}
      <div
        className="w-full h-16 rounded border-2 border-gray-700 mb-2"
        style={{ backgroundColor: paint.hex }}
      />

      {/* Paint name */}
      <p className="font-bold text-white text-sm mb-1 truncate" title={paint.name}>
        {paint.name}
      </p>

      {/* Delta-E badge */}
      <div className={`w-full px-2 py-1 rounded ${themeColors.primary} bg-opacity-20 border ${themeColors.border} text-center mb-2`}>
        <span className={`text-xs font-bold ${themeColors.text}`}>
          ΔE: {paint.deltaE.toFixed(1)}
        </span>
      </div>

      {/* Hex code and copy */}
      <button
        onClick={() => copyToClipboard(paint.hex)}
        className="w-full px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono transition-colors mb-2"
      >
        {copied ? '✓ Copied' : paint.hex}
      </button>

      {/* Add button */}
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          className={`w-full ${themeColors.primary} hover:opacity-90 text-white px-3 py-2 rounded font-semibold text-sm transition-opacity`}
        >
          Add
        </button>
      )}
    </div>
  );
}
