/**
 * Camera component - handles photo capture and upload for both modes
 */

'use client';

import React, { useRef, useState } from 'react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { compressImage, validateImageFile } from '@/lib/utils';

interface CameraProps {
  onImageCapture: (imageData: string, file: File) => void;
  mode: 'miniature' | 'inspiration';
  isProcessing?: boolean;
}

export function Camera({ onImageCapture, mode, isProcessing = false }: CameraProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      // Compress image for upload
      const compressed = await compressImage(file);
      setPreview(compressed);
      onImageCapture(compressed, file);
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image processing error:', err);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getModeText = () => {
    if (mode === 'miniature') {
      return {
        title: 'Scan Your Miniature',
        description: 'Take a clear photo of your painted miniature. Make sure it is well-lit and the colors are visible.',
        buttonText: 'Take Photo',
        icon: '🎨',
      };
    } else {
      return {
        title: 'Capture Your Inspiration',
        description: 'Snap a photo of anything that inspires you - artwork, nature, products, or anything with colors you love!',
        buttonText: 'Take Photo',
        icon: '✨',
      };
    }
  };

  const modeText = getModeText();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">{modeText.icon}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {modeText.title}
        </h2>
        <p className="text-gray-600">
          {modeText.description}
        </p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isProcessing}
      />

      {/* Preview or Camera button */}
      {preview ? (
        <Card variant="elevated" padding="none" className="overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto"
          />
          {!isProcessing && (
            <div className="p-4 space-y-3">
              <Button
                variant="outline"
                fullWidth
                onClick={handleRetake}
              >
                Retake Photo
              </Button>
            </div>
          )}
        </Card>
      ) : (
        <div className="space-y-4">
          <Card variant="elevated" padding="lg">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center text-gray-400">
                <svg
                  className="w-24 h-24 mx-auto mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <p className="text-sm">No image selected</p>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleCameraClick}
              disabled={isProcessing}
            >
              {modeText.buttonText}
            </Button>
          </Card>

          {/* Alternative: Upload from gallery */}
          <p className="text-center text-sm text-gray-500">
            Or select a photo from your gallery
          </p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Processing indicator */}
      {isProcessing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-blue-700 font-medium">
              Analyzing colors...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
