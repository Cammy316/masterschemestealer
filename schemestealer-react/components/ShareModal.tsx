'use client';

import { useState } from 'react';

interface ShareModalProps {
  mode: 'miniature' | 'inspiration';
  data: {
    colors: Array<{ hex: string; name: string; percentage: number }>;
    imageUrl?: string;
  };
  onClose: () => void;
}

export function ShareModal({ mode, data, onClose }: ShareModalProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<'instagram' | 'hd'>('instagram');

  const themeColors = mode === 'miniature'
    ? { border: 'border-green-500', text: 'text-green-500', bg: 'bg-green-600' }
    : { border: 'border-purple-500', text: 'text-purple-400', bg: 'bg-purple-600' };

  const handlePlatformShare = (platform: string) => {
    const text = mode === 'miniature'
      ? 'Check out the paint colors I identified using SchemeStealer!'
      : 'Check out this color palette from SchemeStealer!';
    const url = window.location.href;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);
    try {
      // Placeholder - actual image generation to be implemented
      const canvas = document.createElement('canvas');
      const size = imageSize === 'instagram' ? { width: 1080, height: 1080 } : { width: 1920, height: 1080 };
      canvas.width = size.width;
      canvas.height = size.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Simple placeholder implementation
        ctx.fillStyle = mode === 'miniature' ? '#0a0a0a' : '#1a0a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add colors
        const swatchSize = 150;
        const gap = 20;
        data.colors.forEach((color, i) => {
          const x = 50 + (i % 3) * (swatchSize + gap);
          const y = 100 + Math.floor(i / 3) * (swatchSize + gap);
          ctx.fillStyle = color.hex;
          ctx.fillRect(x, y, swatchSize, swatchSize);

          // Text
          ctx.fillStyle = '#ffffff';
          ctx.font = '20px sans-serif';
          ctx.fillText(color.name, x, y + swatchSize + 25);
          ctx.fillText(color.hex, x, y + swatchSize + 50);
        });

        // Watermark
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px sans-serif';
        ctx.fillText('SCHEMESTEALER', canvas.width - 120, canvas.height - 20);
      }

      setShareImageUrl(canvas.toDataURL('image/png'));
    } catch (error) {
      console.error('Image generation failed:', error);
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDownload = () => {
    if (!shareImageUrl) return;
    const link = document.createElement('a');
    link.href = shareImageUrl;
    link.download = `schemestealer-${mode}-${Date.now()}.png`;
    link.click();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg bg-gray-900 rounded-lg border-2 ${themeColors.border} p-6 max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${themeColors.text}`}>Share Results</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl w-8 h-8">×</button>
        </div>

        {/* Platform buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handlePlatformShare('twitter')}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 hover:border-blue-400 text-white font-semibold transition-colors"
          >
            Share to Twitter
          </button>
          <button
            onClick={() => handlePlatformShare('reddit')}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 hover:border-orange-500 text-white font-semibold transition-colors"
          >
            Share to Reddit
          </button>
          <button
            onClick={() => handlePlatformShare('facebook')}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-700 hover:border-blue-600 text-white font-semibold transition-colors"
          >
            Share to Facebook
          </button>
        </div>

        {/* Image generation */}
        <div className="border-t-2 border-gray-700 pt-6">
          <h3 className="text-sm text-gray-400 mb-3">Generate Share Image:</h3>

          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setImageSize('instagram')}
              className={`flex-1 px-4 py-2 rounded font-semibold ${
                imageSize === 'instagram' ? `${themeColors.bg} text-white` : 'bg-gray-800 text-gray-400'
              }`}
            >
              Instagram
            </button>
            <button
              onClick={() => setImageSize('hd')}
              className={`flex-1 px-4 py-2 rounded font-semibold ${
                imageSize === 'hd' ? `${themeColors.bg} text-white` : 'bg-gray-800 text-gray-400'
              }`}
            >
              HD
            </button>
          </div>

          {!shareImageUrl ? (
            <button
              onClick={handleGenerateImage}
              disabled={generatingImage}
              className={`w-full ${themeColors.bg} text-white font-bold py-3 rounded-lg transition-opacity disabled:opacity-50`}
            >
              {generatingImage ? 'Generating...' : 'Generate Image'}
            </button>
          ) : (
            <div className="space-y-3">
              <img src={shareImageUrl} alt="Share preview" className="w-full rounded border-2 border-gray-700" />
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className={`flex-1 ${themeColors.bg} text-white font-bold py-3 rounded-lg`}
                >
                  Download
                </button>
                <button
                  onClick={() => setShareImageUrl(null)}
                  className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
