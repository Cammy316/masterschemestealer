/**
 * Full-screen progress indicator shown while the one-time in-browser background
 * removal model downloads (first miniature scan only). Cogitator-themed.
 */

'use client';

import { motion } from 'framer-motion';

interface ModelDownloadProgressProps {
  percent: number; // 0–100
}

export function ModelDownloadProgress({ percent }: ModelDownloadProgressProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div
      className="min-h-screen flex items-center justify-center cogitator-screen px-6"
      style={{ background: 'var(--void-black)' }}
    >
      <div className="text-center w-full max-w-xs">
        <motion.div
          className="text-5xl mb-6"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          ⚙
        </motion.div>
        <h2 className="text-lg font-bold gothic-text auspex-text mb-2">
          AWAKENING THE MACHINE SPIRIT
        </h2>
        <p className="text-cogitator-green-dim tech-text text-xs mb-4">
          Downloading the one-time processing model… {clamped}%
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-cogitator-green/15 overflow-hidden border border-cogitator-green/30">
          <motion.div
            className="h-full bg-cogitator-green"
            style={{ boxShadow: '0 0 10px var(--cogitator-green-glow)' }}
            initial={{ width: 0 }}
            animate={{ width: `${clamped}%` }}
            transition={{ ease: 'easeOut', duration: 0.3 }}
          />
        </div>

        <p className="text-cogitator-green-dim/50 tech-text text-xs mt-4">
          One-time download — future scans are instant.
        </p>
      </div>
    </div>
  );
}

export default ModelDownloadProgress;
