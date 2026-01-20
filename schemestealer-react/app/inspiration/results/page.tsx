/**
 * Inspiration results page - displays color palette and paint recommendations
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ColorPalette } from '@/components/ColorPalette';
import { PaintList } from '@/components/PaintCard';

export default function InspirationResultsPage() {
  const router = useRouter();
  const { currentScan, clearCurrentScan } = useAppStore();

  React.useEffect(() => {
    // Redirect if no scan result
    if (!currentScan || currentScan.mode !== 'inspiration') {
      router.push('/inspiration');
    }
  }, [currentScan, router]);

  if (!currentScan) {
    return null;
  }

  const handleScanAnother = () => {
    clearCurrentScan();
    router.push('/inspiration');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Color Palette Extracted! ✨
        </h1>
        <p className="text-gray-600">
          I found {currentScan.detectedColors.length} inspiring colors in your image
        </p>
      </div>

      {/* Source image */}
      {currentScan.imageData && (
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <img
            src={currentScan.imageData}
            alt="Inspiration source"
            className="w-full h-auto"
          />
        </Card>
      )}

      {/* Color palette */}
      {currentScan.detectedColors.length > 0 && (
        <Card variant="elevated" padding="lg">
          <ColorPalette
            colors={currentScan.detectedColors}
            title="Your Color Palette"
            showPercentages={true}
          />
        </Card>
      )}

      {/* Paint recommendations */}
      {currentScan.recommendedPaints.length > 0 && (
        <Card variant="elevated" padding="lg">
          <PaintList
            paints={currentScan.recommendedPaints}
            title="Paints to Recreate This Palette"
            showAddButtons={true}
          />
        </Card>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleScanAnother}
          className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
        >
          Find More Inspiration
        </Button>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => router.push('/cart')}
        >
          View Cart
        </Button>
      </div>

      {/* Info card */}
      <Card variant="outlined" padding="md" className="bg-purple-50 border-purple-200">
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-2">💡 How to use this palette:</p>
          <ul className="space-y-1 text-gray-600">
            <li>• These {currentScan.detectedColors.length} colors create a cohesive miniature color scheme</li>
            <li>• Use the dominant colors for armor/main areas</li>
            <li>• Use accent colors for details and highlights</li>
            <li>• Add recommended paints to your cart to recreate this look</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
