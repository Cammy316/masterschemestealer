/**
 * PaintCard component - displays paint recommendation with match quality
 */

'use client';

import React from 'react';
import type { Paint } from '@/lib/types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatDeltaE, getMatchQuality, getPaintId } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface PaintCardProps {
  paint: Paint;
  onAddToCart?: (paint: Paint) => void;
  showAddButton?: boolean;
  inCart?: boolean;
  detectedColorHex?: string; // The original detected color this paint matches
  mode?: 'miniature' | 'inspiration';
}

export function PaintCard({
  paint,
  onAddToCart,
  showAddButton = true,
  inCart = false,
  detectedColorHex,
  mode,
}: PaintCardProps) {
  const { addToCart, currentMode, currentScan } = useAppStore();
  const matchQuality = getMatchQuality(paint.deltaE);
  const { copied: copiedDetected, copyToClipboard: copyDetected } = useCopyToClipboard(2000);
  const { copied: copiedPaint, copyToClipboard: copyPaint } = useCopyToClipboard(2000);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(paint);
    } else {
      addToCart(paint, currentMode || undefined, currentScan?.id);
    }
  };

  const qualityColors = {
    excellent: 'text-green-600 bg-green-50',
    good: 'text-blue-600 bg-blue-50',
    fair: 'text-yellow-600 bg-yellow-50',
    poor: 'text-gray-600 bg-gray-50',
  };

  return (
    <Card variant="elevated" padding="none" className="overflow-hidden">
      <div className="flex items-center p-4 space-x-4">
        {/* Color swatch */}
        <div
          className="w-16 h-16 rounded-lg shadow-md border-2 border-gray-200 flex-shrink-0"
          style={{ backgroundColor: paint.hex }}
          title={paint.hex}
        />

        {/* Paint info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {paint.name}
          </h4>
          <p className="text-sm text-gray-600">{paint.brand}</p>

          {paint.deltaE !== undefined && (
            <div className="mt-1">
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${qualityColors[matchQuality]}`}>
                {formatDeltaE(paint.deltaE)}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                ΔE: {paint.deltaE.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Copy buttons */}
        {detectedColorHex && (
          <div className="flex flex-col gap-1">
            {/* Copy detected color */}
            <button
              onClick={() => copyDetected(detectedColorHex)}
              className="px-2 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors min-w-[70px]"
              title="Copy detected color hex"
            >
              {copiedDetected ? '✓ Copied' : 'Copy Match'}
            </button>

            {/* Copy paint hex */}
            <button
              onClick={() => copyPaint(paint.hex)}
              className="px-2 py-1 rounded text-xs font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors min-w-[70px]"
              title="Copy paint hex"
            >
              {copiedPaint ? '✓ Copied' : 'Copy Paint'}
            </button>
          </div>
        )}

        {/* Add to cart button */}
        {showAddButton && (
          <div className="flex-shrink-0">
            {inCart ? (
              <div className="text-xs text-green-600 font-medium">
                ✓ In Cart
              </div>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onClick={handleAddToCart}
                className="whitespace-nowrap"
              >
                Add
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
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
  const { cart } = useAppStore();

  if (!paints || paints.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  const displayPaints = maxDisplay ? paints.slice(0, maxDisplay) : paints;
  const cartPaintIds = new Set(cart.map(item => getPaintId(item.paint)));

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      )}

      <div className="space-y-3">
        {displayPaints.map((paint, index) => (
          <PaintCard
            key={`${paint.brand}-${paint.name}-${index}`}
            paint={paint}
            showAddButton={showAddButtons}
            inCart={cartPaintIds.has(getPaintId(paint))}
          />
        ))}
      </div>

      {maxDisplay && paints.length > maxDisplay && (
        <p className="text-sm text-gray-500 text-center pt-2">
          +{paints.length - maxDisplay} more paints
        </p>
      )}
    </div>
  );
}
