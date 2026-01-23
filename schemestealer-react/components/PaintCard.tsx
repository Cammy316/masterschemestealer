'use client';

import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useAppStore } from '@/lib/store';
import type { Paint } from '@/lib/types';
import { getPaintId } from '@/lib/utils';

interface PaintCardProps {
  paint: {
    name: string;
    brand: string;
    hex: string;
    deltaE: number;
  };
  mode: 'miniature' | 'inspiration';
  onAddToCart?: () => void;
}

export function PaintCard({ paint, mode, onAddToCart }: PaintCardProps) {
  const { copied, copyToClipboard } = useCopyToClipboard(2000);

  const themeColors = mode === 'miniature'
    ? { primary: 'bg-green-600', border: 'border-green-500', text: 'text-green-500' }
    : { primary: 'bg-purple-600', border: 'border-purple-500', text: 'text-purple-400' };

  return (
    <div className={`p-3 bg-gray-800 rounded-lg border ${themeColors.border} border-opacity-30`}>
      {/* Row 1: Swatch, Name, Add Button */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-12 h-12 rounded border border-gray-700 flex-shrink-0"
          style={{ backgroundColor: paint.hex }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate text-sm">{paint.name}</p>
          <p className="text-xs text-gray-400">{paint.brand}</p>
        </div>
        {onAddToCart && (
          <button
            onClick={onAddToCart}
            className={`${themeColors.primary} text-white px-4 py-2 rounded font-semibold text-sm min-h-[44px] flex-shrink-0`}
          >
            Add
          </button>
        )}
      </div>

      {/* Row 2: Delta-E Badge and Copy Button */}
      <div className="flex items-center gap-2">
        <div className={`px-3 py-1 rounded-full ${themeColors.primary} bg-opacity-20 border ${themeColors.border} flex-shrink-0`}>
          <span className={`text-xs font-mono ${themeColors.text}`}>
            ΔE: {paint.deltaE.toFixed(1)}
          </span>
        </div>
        <button
          onClick={() => copyToClipboard(paint.hex)}
          className="flex-1 px-3 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold min-h-[44px] transition-colors"
        >
          {copied ? '✓ Copied' : `Copy ${paint.hex}`}
        </button>
      </div>
    </div>
  );
}

interface PaintListProps {
  paints: Paint[];
  title?: string;
  emptyMessage?: string;
  showAddButtons?: boolean;
  maxDisplay?: number;
}

export function PaintList({
  paints,
  title = 'Recommended Paints',
  emptyMessage = 'No paint recommendations yet',
  showAddButtons = true,
  maxDisplay,
}: PaintListProps) {
  const { cart, currentMode, addToCart, currentScan } = useAppStore();

  if (!paints || paints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const displayPaints = maxDisplay ? paints.slice(0, maxDisplay) : paints;
  const cartPaintIds = new Set(cart.map(item => getPaintId(item.paint)));
  const mode = currentMode || 'miniature';

  const handleAddToCart = (paint: Paint) => {
    addToCart(paint, currentMode || undefined, currentScan?.id);
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}

      <div className="space-y-3">
        {displayPaints.map((paint, index) => {
          const inCart = cartPaintIds.has(getPaintId(paint));

          return (
            <PaintCard
              key={`${paint.brand}-${paint.name}-${index}`}
              paint={{
                name: paint.name,
                brand: paint.brand,
                hex: paint.hex,
                deltaE: paint.deltaE || 0,
              }}
              mode={mode}
              onAddToCart={showAddButtons && !inCart ? () => handleAddToCart(paint) : undefined}
            />
          );
        })}
      </div>

      {maxDisplay && paints.length > maxDisplay && (
        <p className="text-sm text-gray-500 text-center pt-2">
          +{paints.length - maxDisplay} more paints
        </p>
      )}
    </div>
  );
}
