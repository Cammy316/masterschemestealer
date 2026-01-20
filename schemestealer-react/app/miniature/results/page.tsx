/**
 * Miniscan results page - displays detected colors and paint recommendations
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ColorPalette } from '@/components/ColorPalette';
import { PaintList } from '@/components/PaintCard';

export default function MiniscanResultsPage() {
  const router = useRouter();
  const { currentScan, clearCurrentScan } = useAppStore();

  React.useEffect(() => {
    // Redirect if no scan result
    if (!currentScan || currentScan.mode !== 'miniature') {
      router.push('/miniature');
    }
  }, [currentScan, router]);

  if (!currentScan) {
    return null;
  }

  const handleScanAnother = () => {
    clearCurrentScan();
    router.push('/miniature');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scan Complete! 🎨
        </h1>
        <p className="text-gray-600">
          I found {currentScan.detectedColors.length} colors on your miniature
        </p>
      </div>

      {/* Scanned image */}
      {currentScan.imageData && (
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <img
            src={currentScan.imageData}
            alt="Scanned miniature"
            className="w-full h-auto"
          />
        </Card>
      )}

      {/* Detected colors */}
      {currentScan.detectedColors.length > 0 && (
        <Card variant="elevated" padding="lg">
          <ColorPalette
            colors={currentScan.detectedColors}
            title="Colors Detected on Your Miniature"
            showPercentages={true}
          />
        </Card>
      )}

      {/* Paint recommendations */}
      {currentScan.recommendedPaints.length > 0 && (
        <Card variant="elevated" padding="lg">
          <PaintList
            paints={currentScan.recommendedPaints}
            title="Recommended Paint Matches"
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
        >
          Scan Another Miniature
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
      <Card variant="outlined" padding="md" className="bg-blue-50 border-blue-200">
        <div className="text-sm text-gray-700">
          <p className="font-semibold mb-2">💡 How it works:</p>
          <ul className="space-y-1 text-gray-600">
            <li>• I removed the background and analyzed your miniature</li>
            <li>• Found {currentScan.detectedColors.length} dominant colors using advanced color detection</li>
            <li>• Matched them to {currentScan.recommendedPaints.length} paints from major brands</li>
            <li>• Delta-E (ΔE) shows color accuracy (lower = better match)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
