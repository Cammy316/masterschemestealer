/**
 * Share Modal Component
 * Provides platform-specific sharing options and shareable image generation
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { copyForDiscord } from '@/lib/clipboard';
import { generateShareImage } from '@/lib/shareImageGenerator';

interface ShareModalProps {
  data: {
    type: 'miniscan' | 'inspiration';
    imageUrl: string;
    colors: Array<{ hex: string; name: string; percentage: number }>;
    paints?: Array<{ name: string; brand: string }>;
  };
  onClose: () => void;
}

export function ShareModal({ data, onClose }: ShareModalProps) {
  const [generatingImage, setGeneratingImage] = useState(false);
  const [shareableImageUrl, setShareableImageUrl] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [imageSize, setImageSize] = useState<'instagram' | 'hd'>('instagram');

  const theme = data.type === 'miniscan'
    ? { primary: 'green', accent: '#00FF66', border: 'border-green-500/50', text: 'text-green-500' }
    : { primary: 'purple', accent: '#8B5CF6', border: 'border-purple-500/50', text: 'text-purple-400' };

  const handlePlatformShare = (platform: string) => {
    const text = data.type === 'miniscan'
      ? `Check out the colors I identified on my miniature using SchemeStealer!`
      : `Check out this color palette I extracted using SchemeStealer!`;

    const url = window.location.href;

    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?title=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&description=${encodeURIComponent(text)}`,
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleCopyDiscord = async () => {
    const result = await copyForDiscord(data);
    if (result.type === 'success') {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleGenerateImage = async () => {
    setGeneratingImage(true);

    try {
      const imageUrl = await generateShareImage({
        mode: data.type === 'miniscan' ? 'miniature' : 'inspiration',
        data: {
          colors: data.colors.map(c => ({
            hex: c.hex,
            name: c.name,
            percentage: c.percentage,
          })),
          imageUrl: data.imageUrl,
          paints: data.paints,
        },
        size: imageSize,
      });

      setShareableImageUrl(imageUrl);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate share image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleDownload = () => {
    if (!shareableImageUrl) return;

    const link = document.createElement('a');
    link.href = shareableImageUrl;
    link.download = `schemestealer-${data.type}-${Date.now()}.png`;
    link.click();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`relative max-w-md w-full rounded-lg border-2 p-6 ${theme.border} bg-gray-900`}
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl transition-colors"
          >
            ×
          </button>

          {/* Header */}
          <h2 className={`responsive-header font-bold mb-6 text-center ${theme.text}`}>
            TRANSMIT RESULTS
          </h2>

          {/* Platform buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <PlatformButton
              label="Twitter"
              icon="𝕏"
              onClick={() => handlePlatformShare('twitter')}
              hoverColor="hover:border-blue-400"
            />

            <PlatformButton
              label="Reddit"
              icon="📱"
              onClick={() => handlePlatformShare('reddit')}
              hoverColor="hover:border-orange-400"
            />

            <PlatformButton
              label="Facebook"
              icon="f"
              onClick={() => handlePlatformShare('facebook')}
              hoverColor="hover:border-blue-600"
            />

            <PlatformButton
              label="Pinterest"
              icon="📌"
              onClick={() => handlePlatformShare('pinterest')}
              hoverColor="hover:border-red-500"
            />
          </div>

          {/* Discord - copy formatted text */}
          <motion.button
            onClick={handleCopyDiscord}
            className={`w-full mb-6 px-4 py-3 rounded-lg border-2 border-gray-600 hover:border-indigo-400 transition-colors responsive-body font-semibold ${
              copySuccess ? 'bg-indigo-500 text-white' : 'text-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{copySuccess ? '✓' : '💬'}</span>
            {copySuccess ? 'Copied!' : 'Copy for Discord'}
          </motion.button>

          {/* Copy link */}
          <motion.button
            onClick={handleCopyLink}
            className={`w-full px-4 py-3 rounded-lg border border-gray-600 transition-colors responsive-body ${
              copySuccess ? 'bg-green-500 text-white' : 'text-gray-400 hover:text-white hover:border-gray-500'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{copySuccess ? '✓' : '🔗'}</span>
            {copySuccess ? 'Link Copied!' : 'Copy Link'}
          </motion.button>

          {/* Image generation section */}
          <div className="border-t-2 border-gray-700 pt-6 mt-6">
            <h3 className={`text-sm ${theme.text} mb-3 font-bold text-center`}>
              Generate Share Image
            </h3>

            {/* Size selector */}
            <div className="flex gap-3 mb-4">
              <button
                onClick={() => setImageSize('instagram')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all responsive-body ${
                  imageSize === 'instagram'
                    ? `${theme.primary === 'green' ? 'bg-green-600' : 'bg-purple-600'} text-white`
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Instagram (1080x1080)
              </button>
              <button
                onClick={() => setImageSize('hd')}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all responsive-body ${
                  imageSize === 'hd'
                    ? `${theme.primary === 'green' ? 'bg-green-600' : 'bg-purple-600'} text-white`
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                HD (1920x1080)
              </button>
            </div>

            {/* Generate button */}
            {!shareableImageUrl && (
              <motion.button
                onClick={handleGenerateImage}
                disabled={generatingImage}
                className={`w-full ${theme.primary === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed responsive-body`}
                whileHover={{ scale: generatingImage ? 1 : 1.02 }}
                whileTap={{ scale: generatingImage ? 1 : 0.98 }}
              >
                {generatingImage ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⚙️</span>
                    Generating...
                  </span>
                ) : (
                  <span>🖼️ Generate Share Image</span>
                )}
              </motion.button>
            )}

            {/* Preview and download */}
            {shareableImageUrl && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
                  <img
                    src={shareableImageUrl}
                    alt="Share preview"
                    className="w-full h-auto"
                  />
                </div>

                <div className="flex gap-3">
                  <motion.button
                    onClick={handleDownload}
                    className={`flex-1 ${theme.primary === 'green' ? 'bg-green-600 hover:bg-green-700' : 'bg-purple-600 hover:bg-purple-700'} text-white font-bold py-3 rounded-lg transition-all responsive-body`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    ⬇️ Download Image
                  </motion.button>

                  <motion.button
                    onClick={() => setShareableImageUrl(null)}
                    className="px-6 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold transition-all responsive-body"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Regenerate
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Individual platform button component
 */
function PlatformButton({
  label,
  icon,
  onClick,
  hoverColor,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  hoverColor: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`px-4 py-3 rounded-lg border-2 border-gray-600 ${hoverColor} transition-colors responsive-body font-semibold text-gray-300`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </motion.button>
  );
}
