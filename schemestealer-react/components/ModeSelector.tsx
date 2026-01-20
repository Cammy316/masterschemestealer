/**
 * ModeSelector - Home page component for choosing between Miniscan and Inspiration modes
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { useAppStore } from '@/lib/store';
import type { ScanMode } from '@/lib/types';

export function ModeSelector() {
  const router = useRouter();
  const setMode = useAppStore((state) => state.setMode);

  const handleModeSelect = (mode: ScanMode) => {
    setMode(mode);
    router.push(`/${mode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            SchemeSteal
          </h1>
          <p className="text-lg text-gray-600">
            Find perfect paint colors for your miniatures
          </p>
        </div>

        {/* Mode Cards */}
        <div className="space-y-6">
          {/* Miniscan Mode */}
          <Card variant="elevated" padding="lg" className="border-2 border-blue-200 hover:border-blue-400 transition-colors">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Scan My Miniature
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Already painted a miniature? Take a photo and I'll identify the colors you used,
                then recommend matching paints from major brands.
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Perfect for:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "What paints did I use on this mini 2 years ago?"</li>
                <li>• "I bought a pre-painted mini, what colors are these?"</li>
                <li>• "I want to paint more minis in this same scheme"</li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleModeSelect('miniature')}
            >
              Scan My Miniature
            </Button>
          </Card>

          {/* Inspiration Mode */}
          <Card variant="elevated" padding="lg" className="border-2 border-purple-200 hover:border-purple-400 transition-colors">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Color Inspiration
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Snap a photo of anything that inspires you - artwork, sunsets, movies, nature.
                I'll extract a color palette and find matching paints to recreate those colors.
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-sm text-gray-700 mb-2">Perfect for:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• "Love this album cover's colors for my army"</li>
                <li>• "This sunset has perfect oranges and purples"</li>
                <li>• "Turn this fantasy art into a paint scheme"</li>
              </ul>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => handleModeSelect('inspiration')}
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            >
              Find Color Inspiration
            </Button>
          </Card>
        </div>

        {/* Footer info */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>Powered by advanced color detection for Warhammer & miniature painters</p>
        </div>
      </div>
    </div>
  );
}
