'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PaintCardHorizontalProps {
  paint: {
    name: string;
    brand: string;
    type: string; // Base, Shade, Layer, Highlight, Dry, Air, Contrast
    hex: string;
    deltaE: number;
  };
  mode: 'miniature' | 'inspiration';
  onAddToCart?: () => void;
}

export function PaintCardHorizontal({ paint, mode, onAddToCart }: PaintCardHorizontalProps) {
  const { copied, copyToClipboard } = useCopyToClipboard(2000);

  const themeColors = mode === 'miniature'
    ? { primary: 'bg-green-600', text: 'text-green-500', border: 'border-green-500' }
    : { primary: 'bg-purple-600', text: 'text-purple-400', border: 'border-purple-500' };

  return (
    <div className={`flex-shrink-0 w-64 p-3 bg-gray-800 rounded-lg border-2 ${themeColors.border} border-opacity-30 space-y-2`}>
      {/* Paint swatch and name */}
      <div className="flex items-center gap-2">
        <div
          className="w-12 h-12 rounded border-2 border-gray-700 flex-shrink-0"
          style={{ backgroundColor: paint.hex }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-white text-sm truncate">{paint.name}</p>
          <p className="text-xs text-gray-400">{paint.type}</p>
        </div>
      </div>

      {/* Delta-E badge */}
      <div className={`w-full px-3 py-1 rounded ${themeColors.primary} bg-opacity-20 border ${themeColors.border} text-center`}>
        <span className={`text-xs font-bold ${themeColors.text}`}>
          ΔE: {paint.deltaE.toFixed(1)}
        </span>
      </div>

      {/* Hex code and copy */}
      <button
        onClick={() => copyToClipboard(paint.hex)}
        className="w-full px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono transition-colors"
      >
        {copied ? '✓ Copied' : paint.hex}
      </button>

      {/* Add button */}
      {onAddToCart && (
        <button
          onClick={onAddToCart}
          className={`w-full ${themeColors.primary} hover:opacity-90 text-white px-3 py-2 rounded font-semibold text-sm transition-opacity`}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
}
