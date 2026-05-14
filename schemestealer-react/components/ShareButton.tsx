'use client';

import { motion } from 'framer-motion';

interface ShareButtonProps {
  mode: 'miniature' | 'inspiration';
  onShareClick: () => void;
}

export function ShareButton({ mode, onShareClick }: ShareButtonProps) {
  const theme = mode === 'miniature'
    ? {
        border: 'border-cogitator-green',
        text: 'text-cogitator-green',
        bg: 'bg-dark-gothic',
        glow: 'var(--cogitator-green-glow)',
        hoverGlow: '0 0 20px var(--cogitator-green-glow)',
        label: 'SHARE RESULTS',
      }
    : {
        border: 'border-warp-purple',
        text: 'text-warp-purple-light',
        bg: 'bg-void-blue',
        glow: 'var(--ethereal-glow)',
        hoverGlow: '0 0 20px var(--ethereal-glow)',
        label: 'SHARE ESSENCE',
      };

  return (
    <motion.button
      onClick={onShareClick}
      className={`w-full py-4 px-6 rounded-lg border-2 ${theme.border} ${theme.bg} touch-target textured`}
      whileHover={{
        boxShadow: theme.hoverGlow,
        scale: 1.02,
      }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-center gap-3">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={theme.text}
        >
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <span className={`${theme.text} font-bold cyber-text`}>
          {theme.label}
        </span>
      </div>
    </motion.button>
  );
}

export default ShareButton;
