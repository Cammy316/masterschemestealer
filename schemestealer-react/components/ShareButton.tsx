/**
 * Share Button Component
 * Provides social sharing functionality with native share API support
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  data: {
    type: 'miniscan' | 'inspiration';
    imageUrl: string;
    colors: Array<{ hex: string; name: string; percentage: number }>;
    paints?: Array<{ name: string; brand: string }>;
  };
  className?: string;
}

export function ShareButton({ data, className = '' }: ShareButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleShare = async () => {
    // Check if native share is available (mobile)
    if (navigator.share && isMobileDevice()) {
      try {
        const shareData = {
          title: `My ${data.type === 'miniscan' ? 'Miniature' : 'Color Palette'} - SchemeStealer`,
          text: data.type === 'miniscan'
            ? `Check out the colors I identified on my miniature!`
            : `Check out this color palette I extracted!`,
          url: window.location.href,
        };

        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
        console.log('Share cancelled');
      }
    } else {
      // Show custom modal for desktop
      setShowModal(true);
    }
  };

  const themeColors = data.type === 'miniscan'
    ? 'border-green-500 text-green-400 hover:bg-green-500/10'
    : 'border-purple-500 text-purple-400 hover:bg-purple-500/10';

  return (
    <>
      <motion.button
        onClick={handleShare}
        className={`px-4 py-2 rounded-lg border-2 font-semibold transition-colors responsive-body ${themeColors} ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="mr-2">📤</span>
        TRANSMIT RESULTS
      </motion.button>

      {showModal && (
        <ShareModal
          data={data}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function isMobileDevice(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
