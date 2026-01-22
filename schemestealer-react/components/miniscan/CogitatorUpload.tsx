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
          {/* Servo-skull icon with glow */}
          <motion.div
            className="flex justify-center mb-4"
            animate={{
              filter: [
                'drop-shadow(0 0 10px var(--cogitator-green))',
                'drop-shadow(0 0 20px var(--cogitator-green))',
                'drop-shadow(0 0 10px var(--cogitator-green))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="1.5">
              {/* Servo-skull design */}
              <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="10" r="1.5" fill="var(--cogitator-green)" />
              <circle cx="15" cy="10" r="1.5" fill="var(--cogitator-green)" />
              <path d="M8 17h8v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" />
              {/* Mechanical details */}
              <circle cx="12" cy="6" r="0.5" fill="var(--brass)" />
              <path d="M9 14h6" strokeLinecap="round" />
            </svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
                  <line x1="12" y1="11" x2="12" y2="17" strokeLinecap="round" />
                  <line x1="9" y1="14" x2="15" y2="14" strokeLinecap="round" />
                </svg>
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
