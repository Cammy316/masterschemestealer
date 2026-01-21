/**
 * Cogitator Upload - Gothic-themed upload area for Miniscan mode
 * Imperial aesthetic with brass frames and auspex green accents
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CogitatorUploadProps {
  onFileSelect: (file: File) => void;
  onCameraActivate: () => void;
  disabled?: boolean;
}

export function CogitatorUpload({ onFileSelect, onCameraActivate, disabled = false }: CogitatorUploadProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Scanline effect */}
      <div className="scanline" />

      {/* Gothic frame container */}
      <div className="gothic-frame rounded-lg p-1">
        <div className="bg-dark-gothic rounded-lg p-8">
          {/* Skull icon with glow */}
          <motion.div
            className="text-6xl text-center mb-4"
            animate={{
              textShadow: [
                '0 0 10px var(--cogitator-green-glow)',
                '0 0 20px var(--cogitator-green-glow)',
                '0 0 10px var(--cogitator-green-glow)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💀
          </motion.div>

          {/* Title */}
          <h2 className="auspex-text text-xl font-bold text-center mb-2 gothic-text">
            ◆ INITIALIZE AUSPEX SCAN ◆
          </h2>
          <p className="text-cogitator-green-dim text-sm text-center mb-6 tech-text">
            Upload cogitator data or activate pict-capture servo-skull
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            {/* Camera button */}
            <motion.button
              onClick={onCameraActivate}
              disabled={disabled}
              className="w-full py-4 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic/50 hover:bg-dark-gothic touch-target disabled:opacity-50"
              whileHover={disabled ? {} : {
                boxShadow: '0 0 20px var(--cogitator-green-glow)',
                scale: 1.02,
              }}
              whileTap={disabled ? {} : { scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📸</span>
                <span className="auspex-text font-bold cyber-text">
                  ACTIVATE PICT-CAPTURE
                </span>
              </div>
            </motion.button>

            {/* Upload button */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={disabled}
            />
            <motion.button
              onClick={handleUploadClick}
              disabled={disabled}
              className="w-full py-4 px-6 rounded-lg border-2 border-brass bg-dark-gothic/50 hover:bg-dark-gothic cursor-pointer touch-target disabled:opacity-50"
              whileHover={disabled ? {} : {
                boxShadow: '0 0 15px var(--brass)',
                scale: 1.02,
              }}
              whileTap={disabled ? {} : { scale: 0.98 }}
            >
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl">📁</span>
                <span className="text-brass font-bold cyber-text">
                  UPLOAD FROM ARCHIVE
                </span>
              </div>
            </motion.button>
          </div>

          {/* Info text */}
          <motion.p
            className="text-center text-xs text-text-tertiary mt-4 tech-text"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ◆ Recommended: Clear lighting, miniature centered ◆
          </motion.p>
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-imperial-gold" />
      <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-imperial-gold" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-imperial-gold" />
      <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-imperial-gold" />
    </div>
  );
}

export default CogitatorUpload;
