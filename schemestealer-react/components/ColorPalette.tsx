/**
 * ColorPalette component - displays detected colors as swatches
 */

'use client';

import React from 'react';
import type { Color } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ColorPaletteProps {
  colors: Color[];
  title?: string;
  showPercentages?: boolean;
  className?: string;
}

export function ColorPalette({
  colors,
  title = 'Detected Colors',
  showPercentages = true,
  className,
}: ColorPaletteProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div className={cn('', className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {colors.map((color, index) => (
          <ColorSwatch
            key={index}
            color={color}
            showPercentage={showPercentages}
          />
        ))}
      </div>
    </div>
  );
}

interface ColorSwatchProps {
  color: Color;
  showPercentage?: boolean;
}

function ColorSwatch({ color, showPercentage = true }: ColorSwatchProps) {
  return (
    <div className="flex flex-col space-y-2">
      <div
        className="w-full h-20 rounded-lg shadow-md border-2 border-gray-200 transition-transform active:scale-95"
        style={{ backgroundColor: color.hex }}
        title={color.hex}
      />
      <div className="text-sm text-center">
        <div className="font-mono font-semibold text-gray-700">
          {color.hex}
        </div>
        {showPercentage && color.percentage !== undefined && (
          <div className="text-xs text-gray-500">
            {color.percentage.toFixed(1)}%
          </div>
        )}
        {color.family && (
          <div className="text-xs font-medium text-blue-600 mt-1">
            {color.family}
          </div>
        )}
      </div>
    </div>
  );
}
