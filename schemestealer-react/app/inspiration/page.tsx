/**
 * Inspiration mode - Camera/upload page for extracting color palettes from any image
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera } from '@/components/Camera';
import { useAppStore } from '@/lib/store';
import { scanInspiration, ApiError } from '@/lib/api';

export default function InspirationPage() {
  const router = useRouter();
  const { setMode, setScanResult, setLoading, setError } = useAppStore();
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    setMode('inspiration');
  }, [setMode]);

  const handleImageCapture = async (imageData: string, file: File) => {
    setIsProcessing(true);
    setLoading(true);
    setError(null);

    try {
      // Call real API to scan inspiration image
      const result = await scanInspiration(file);

      // Save result to store
      setScanResult(result);

      // Navigate to results
      router.push('/inspiration/results');
    } catch (error) {
      console.error('Scan error:', error);

      // Check if this is an API error or network error
      let errorMessage = 'Failed to process image. Please try again.';

      if (error instanceof ApiError) {
        errorMessage = error.message;
      } else if (error instanceof Error && error.message.includes('Network')) {
        errorMessage = 'Cannot connect to backend. Please make sure the API server is running at http://localhost:8000';
      }

      setError(errorMessage);
      setIsProcessing(false);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Camera
        mode="inspiration"
        onImageCapture={handleImageCapture}
        isProcessing={isProcessing}
      />
    </div>
  );
}
