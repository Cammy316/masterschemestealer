/**
 * FeedbackModal Component
 * W40K themed feedback collection with colour-level corrections
 * Theme-aware: green for miniature, purple for inspiration
 * Collects ratings, corrections, and issue categories for ML training
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Color, ScanMode } from '@/lib/types';

// ============================================================================
// Types
// ============================================================================

export interface ColourCorrection {
  colourIndex: number;
  originalFamily: string;
  wasCorrect: boolean;
  correctedFamily?: string;
  actualPaintUsed?: string;
}

export interface FeedbackSubmission {
  scanId: string;
  sessionId: string;
  rating: number;
  colourCorrections: ColourCorrection[];
  issueCategories: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | null;
  comment: string;
  email: string;
  timestamp: string;
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: FeedbackSubmission) => void;
  scanId: string;
  sessionId: string;
  detectedColours: Color[];
  mode: ScanMode;
}

// ============================================================================
// Constants
// ============================================================================

const COLOUR_FAMILIES = [
  'Black', 'Blue', 'Bronze', 'Brown', 'Copper', 'Cyan', 'Flesh', 'Gold',
  'Green', 'Grey', 'Magenta', 'Orange', 'Pink', 'Purple', 'Red', 'Silver',
  'Tan', 'Turquoise', 'White', 'Yellow'
];

const ISSUE_CATEGORIES = [
  { id: 'wrong_colours', label: 'Wrong colours detected' },
  { id: 'poor_recommendations', label: 'Poor paint recommendations' },
  { id: 'missing_colours', label: 'Missing colours' },
  { id: 'too_many_colours', label: 'Too many colours' },
  { id: 'metallics_wrong', label: 'Metallics detected incorrectly' },
];

// ============================================================================
// Theme Configuration
// ============================================================================

function useThemeColors(mode: ScanMode) {
  return useMemo(() => mode === 'miniature'
    ? {
        // Cogitator / Imperial theme
        frameBorder: 'border-brass',
        frameSurface: 'var(--dark-gothic)',
        frameGlow: 'rgba(0, 0, 0, 0.5)',
        headerBg: 'bg-amber-950/30',
        headerBorder: 'border-amber-900/30',
        headerText: 'text-amber-500',
        headerTextDim: 'text-amber-500/60',
        modalBorder: 'border-amber-900/50',
        modalBg: 'bg-dark-gothic',
        buttonBg: 'bg-cogitator-green',
        buttonHover: 'hover:bg-cogitator-green-dim',
        buttonText: 'text-void-black',
        accentColor: 'text-cogitator-green',
        accentColorDim: 'text-cogitator-green-dim',
        checkboxBorder: 'border-amber-900/30',
        checkboxChecked: 'bg-cogitator-green border-cogitator-green',
        inputBg: 'bg-void-black/50',
        inputBorder: 'border-amber-900/30',
        inputFocus: 'focus:border-cogitator-green',
        ratingActive: 'text-brass',
        ratingInactive: 'text-cogitator-green/30',
        ratingHover: 'hover:text-cogitator-green/50',
        wrongBg: 'bg-red-900',
        wrongBorder: 'border-red-500/30',
        wrongText: 'text-red-500/50',
        wrongHover: 'hover:border-red-500',
        title: 'RATE THIS COLOUR ANALYSIS',
        subtitle: 'Your feedback improves the Machine Spirit',
        thankYouTitle: 'THE EMPEROR PROTECTS',
        thankYouText: 'Your feedback strengthens the Omnissiah\'s wisdom',
        thankYouIcon: '⚙️',
        lowRatingText: 'Machine Spirit requires recalibration',
        midRatingText: 'Acceptable accuracy',
        goodRatingText: 'Good accuracy',
        highRatingText: 'Excellent accuracy - Praise the Omnissiah!',
        submitText: 'Transmitting...',
      }
    : {
        // Warp / Chaos theme
        frameBorder: 'border-warp-purple',
        frameSurface: 'var(--void-blue)',
        frameGlow: 'var(--ethereal-glow)',
        headerBg: 'bg-purple-950/30',
        headerBorder: 'border-warp-purple/30',
        headerText: 'text-warp-purple-light',
        headerTextDim: 'text-warp-purple-light/60',
        modalBorder: 'border-warp-purple/50',
        modalBg: 'bg-void-blue',
        buttonBg: 'bg-warp-purple',
        buttonHover: 'hover:bg-warp-purple-dark',
        buttonText: 'text-white',
        accentColor: 'text-warp-purple-light',
        accentColorDim: 'text-warp-purple-light/60',
        checkboxBorder: 'border-warp-purple/30',
        checkboxChecked: 'bg-warp-purple border-warp-purple',
        inputBg: 'bg-cosmic-purple/50',
        inputBorder: 'border-warp-purple/30',
        inputFocus: 'focus:border-warp-pink',
        ratingActive: 'text-warp-pink',
        ratingInactive: 'text-warp-purple/30',
        ratingHover: 'hover:text-warp-purple/50',
        wrongBg: 'bg-red-900/50',
        wrongBorder: 'border-red-500/30',
        wrongText: 'text-red-400/50',
        wrongHover: 'hover:border-red-400',
        title: 'RATE THIS COLOUR ANALYSIS',
        subtitle: 'Your feedback strengthens the Warp connection',
        thankYouTitle: 'OFFERING ACCEPTED',
        thankYouText: 'The Warp acknowledges your gift',
        thankYouIcon: '🌀',
        lowRatingText: 'The Warp\'s vision was clouded',
        midRatingText: 'The veil was pierced adequately',
        goodRatingText: 'The Warp reveals clearly',
        highRatingText: 'Perfect communion with the Immaterium!',
        submitText: 'Channelling...',
      }
  , [mode]);
}

// ============================================================================
// Rating Icon Component - Theme-aware
// ============================================================================

function RatingIcon({
  rating,
  isSelected,
  mode
}: {
  rating: number;
  isSelected: boolean;
  mode: ScanMode;
}) {
  if (mode === 'miniature') {
    const glowColor = isSelected ? 'drop-shadow(0 0 8px var(--cogitator-green-glow))' : 'none';
    const opacity = isSelected ? 1 : 0.3;
    const fill = isSelected ? 'var(--brass)' : '#666';
    const eye = isSelected ? 'var(--cogitator-green)' : '#222';
    const badEye = isSelected ? '#ff4444' : '#222';

    return (
      <svg
        width="36" height="36" viewBox="0 0 24 24"
        style={{ filter: glowColor, opacity, transition: 'all 0.2s ease' }}
      >
        {rating === 1 && (
          // Stage 1: Broken (Cracked, missing jaw, red dead eye)
          <g>
            <path d="M12 2C7.5 2 4 5.5 4 10c0 2.5 1.5 4.5 3.5 5.5l1-2 1.5 1 2-2 2 2 1.5-1 1 2C18.5 14.5 20 12.5 20 10c0-4.5-3.5-8-8-8z" fill={fill} />
            <circle cx="9" cy="11" r="2" fill={badEye} />
            <circle cx="15" cy="11" r="2" fill="#111" />
            <path d="M11 14l1 2 1-2z" fill="#111" />
            <path d="M6 4l2 3-1 2M17 5l-1.5 2 1 2" stroke="#111" strokeWidth="1" fill="none" />
            {isSelected && <path d="M16 16l-1 2 2 1-3 2" stroke="#ffaa00" strokeWidth="1" fill="none" />}
          </g>
        )}
        {rating === 2 && (
          // Stage 2: Damaged (Minor cracks, jaw intact but crooked, dull red eyes)
          <g>
            <path d="M12 2C7.5 2 4 5.5 4 10c0 2.5 1.5 4.5 3.5 5.5V18l1.5 1h6l1.5-1v-2.5C18.5 14.5 20 12.5 20 10c0-4.5-3.5-8-8-8z" fill={fill} />
            <circle cx="9" cy="11" r="2" fill={badEye} />
            <circle cx="15" cy="11" r="2" fill={badEye} />
            <path d="M11 14l1 2 1-2z" fill="#111" />
            <path d="M8 18l8-1" stroke="#111" strokeWidth="1.5" />
            <path d="M15 4l-1 3" stroke="#111" strokeWidth="1" fill="none" />
          </g>
        )}
        {rating === 3 && (
          // Stage 3: Functional (Standard skull, green eyes, straight jaw)
          <g>
            <path d="M12 2C7.5 2 4 5.5 4 10c0 2.5 1.5 4.5 3.5 5.5V19a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3.5C18.5 14.5 20 12.5 20 10c0-4.5-3.5-8-8-8z" fill={fill} />
            <circle cx="9" cy="11" r="2" fill={eye} />
            <circle cx="15" cy="11" r="2" fill={eye} />
            <path d="M11 14l1 2 1-2z" fill="#111" />
            <path d="M8 17h8M9 19h6M10 17v2M12 17v2M14 17v2" stroke="#111" strokeWidth="1" />
          </g>
        )}
        {rating === 4 && (
          // Stage 4: Enhanced (Standard + mechanical augments, brighter eyes)
          <g>
            <path d="M12 2C7.5 2 4 5.5 4 10c0 2.5 1.5 4.5 3.5 5.5V19a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-3.5C18.5 14.5 20 12.5 20 10c0-4.5-3.5-8-8-8z" fill={fill} />
            <path d="M4 10h16" stroke={fill} strokeWidth="2" />
            <circle cx="9" cy="11" r="2.5" fill={eye} />
            <circle cx="15" cy="11" r="2.5" fill={eye} />
            <path d="M11 14l1 2 1-2z" fill="#111" />
            <path d="M8 17h8M9 19h6M10 17v2M12 17v2M14 17v2" stroke="#111" strokeWidth="1" />
            {/* Augments */}
            <circle cx="5" cy="7" r="1.5" fill={eye} />
            <circle cx="19" cy="7" r="1.5" fill={eye} />
            <path d="M5 7v-4h2" stroke={fill} strokeWidth="1.5" fill="none" />
          </g>
        )}
        {rating === 5 && (
          // Stage 5: Blessed (Iron halo, pristine, glowing)
          <g>
            {/* Iron Halo */}
            <circle cx="12" cy="10" r="11" stroke="var(--brass)" strokeWidth="1" strokeDasharray="2 3" fill="none" opacity="0.8" />
            <path d="M12 0v2M4 4l1.5 1.5M20 4l-1.5 1.5M2 10h2M22 10h-2" stroke="var(--brass)" strokeWidth="1.5" />
            {/* Pristine Skull */}
            <path d="M12 3C8 3 5 6 5 10c0 2 1 3.5 2.5 4.5V19a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-4.5C18 13.5 19 12 19 10c0-4-3-7-7-7z" fill={fill} />
            <circle cx="9.5" cy="10.5" r="2.5" fill={eye} />
            <circle cx="14.5" cy="10.5" r="2.5" fill={eye} />
            <path d="M11 14l1 2 1-2z" fill="#111" />
            <path d="M8 17h8M9 19h6M10 17v2M12 17v2M14 17v2" stroke="#111" strokeWidth="1" />
            <path d="M12 4l1 2h-2z" fill="var(--brass)" />
          </g>
        )}
      </svg>
    );
  } else {
    // Warp Eyes for Inspiration theme
    const glowColor = isSelected ? 'drop-shadow(0 0 10px var(--ethereal-glow))' : 'none';
    const opacity = isSelected ? 1 : 0.3;
    const outer = isSelected ? 'var(--warp-purple-light)' : 'var(--warp-purple)';
    const core = isSelected ? 'var(--warp-pink)' : '#222';
    const badCore = isSelected ? '#ff4444' : '#222';

    return (
      <svg
        width="36" height="36" viewBox="0 0 24 24"
        style={{ filter: glowColor, opacity, transition: 'all 0.2s ease' }}
      >
        {rating === 1 && (
          // Stage 1: Bleeding, closed eye
          <g>
            <path d="M4 12c4-2 12-2 16 0-4 2-12 2-16 0z" fill={outer} opacity="0.5" />
            <path d="M4 12c4 1 12 1 16 0" stroke={outer} strokeWidth="1.5" fill="none" />
            <path d="M12 12v6M9 11v4M15 11v5" stroke={badCore} strokeWidth="1" strokeLinecap="round" />
          </g>
        )}
        {rating === 2 && (
          // Stage 2: Slit eye, erratic tendrils
          <g>
            <path d="M3 12c5-3 13-3 18 0-5 3-13 3-18 0z" fill={outer} opacity="0.6" />
            <ellipse cx="12" cy="12" rx="2" ry="4" fill={badCore} />
            <path d="M12 2v4M12 18v4M4 4l3 3M20 20l-3-3" stroke={outer} strokeWidth="1" opacity="0.5" />
          </g>
        )}
        {rating === 3 && (
          // Stage 3: Functional Warp Eye
          <g>
            <path d="M2 12c6-5 14-5 20 0-6 5-14 5-20 0z" fill={outer} opacity="0.7" />
            <circle cx="12" cy="12" r="5" fill={core} />
            <ellipse cx="12" cy="12" rx="2" ry="4" fill="#111" />
          </g>
        )}
        {rating === 4 && (
          // Stage 4: Enhanced Warp Eye (glowing, tendrils)
          <g>
            <path d="M1 12c6-6 16-6 22 0-6 6-16 6-22 0z" fill={outer} opacity="0.8" />
            <circle cx="12" cy="12" r="6" fill={core} />
            <ellipse cx="12" cy="12" rx="1.5" ry="5" fill="#111" />
            <circle cx="12" cy="12" r="2" fill="var(--warp-teal)" />
            <path d="M12 2c-2 2-2 6 0 8M12 22c2-2 2-6 0-8M2 12c2 2 6 2 8 0M22 12c-2-2-6-2-8 0" stroke={core} strokeWidth="1" fill="none" opacity="0.5" />
          </g>
        )}
        {rating === 5 && (
          // Stage 5: Omniscient Third Eye (fully open, intense glow)
          <g>
            <circle cx="12" cy="12" r="11" fill={outer} opacity="0.3" />
            <circle cx="12" cy="12" r="9" fill={outer} opacity="0.6" />
            <circle cx="12" cy="12" r="7" fill={core} />
            <circle cx="12" cy="12" r="3" fill="var(--warp-teal)" />
            <circle cx="12" cy="12" r="1" fill="#fff" />
            {/* Radiating energy */}
            <path d="M12 0v3M12 21v3M0 12h3M21 12h3M3.5 3.5l2 2M18.5 18.5l2 2M20.5 3.5l-2 2M3.5 20.5l2-2" stroke="var(--warp-teal)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </g>
        )}
      </svg>
    );
  }
}

// ============================================================================
// Skull Rating Component - Theme-aware
// ============================================================================

function SkullRating({
  value,
  onChange,
  mode
}: {
  value: number;
  onChange: (v: number) => void;
  mode: ScanMode;
}) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <motion.button
          key={rating}
          onClick={() => onChange(rating)}
          className="p-1 rounded-lg transition-all"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          type="button"
        >
          <RatingIcon
            rating={rating}
            isSelected={rating <= value}
            mode={mode}
          />
        </motion.button>
      ))}
    </div>
  );
}

// ============================================================================
// Colour Correction Row Component - Theme-aware
// ============================================================================

interface ColourCorrectionRowProps {
  colour: Color;
  index: number;
  correction: ColourCorrection;
  onChange: (correction: ColourCorrection) => void;
  mode: ScanMode;
}

function ColourCorrectionRow({ colour, correction, onChange, mode }: ColourCorrectionRowProps) {
  const theme = useThemeColors(mode);

  const handleCorrectToggle = (isCorrect: boolean) => {
    onChange({
      ...correction,
      wasCorrect: isCorrect,
      correctedFamily: isCorrect ? undefined : correction.correctedFamily,
    });
  };

  return (
    <div className={`rounded-lg p-1 border ${theme.modalBorder}`} style={{ background: theme.frameSurface }}>
      <div className={`${theme.modalBg} rounded-lg p-3`}>
        <div className="flex items-center gap-3 mb-2">
          {/* Colour swatch */}
          <div
            className={`w-10 h-10 rounded border-2 ${theme.modalBorder} flex-shrink-0`}
            style={{ backgroundColor: colour.hex }}
          />

          {/* Predicted family */}
          <div className="flex-1 min-w-0">
            <div className={`text-sm ${theme.accentColorDim} tech-text`}>Detected as:</div>
            <div className={`font-bold ${theme.accentColor} truncate`}>{colour.family || 'Unknown'}</div>
          </div>

          {/* Correct/Wrong toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCorrectToggle(true)}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                correction.wasCorrect
                  ? `${theme.buttonBg} ${theme.buttonText}`
                  : `border ${theme.checkboxBorder} ${theme.accentColorDim} hover:${theme.accentColor}`
              }`}
              type="button"
            >
              Correct
            </button>
            <button
              onClick={() => handleCorrectToggle(false)}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                !correction.wasCorrect
                  ? `${theme.wrongBg} text-white`
                  : `border ${theme.wrongBorder} ${theme.wrongText} ${theme.wrongHover}`
              }`}
              type="button"
            >
              Wrong
            </button>
          </div>
        </div>

        {/* Correction fields - show when marked wrong */}
        {!correction.wasCorrect && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-3 space-y-2 border-t ${theme.checkboxBorder} pt-3`}
          >
            <div>
              <label className={`text-xs ${theme.accentColorDim} block mb-1`}>
                Correct colour family:
              </label>
              <select
                value={correction.correctedFamily || ''}
                onChange={(e) => onChange({ ...correction, correctedFamily: e.target.value })}
                className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded px-3 py-2 ${theme.accentColor} ${theme.inputFocus} outline-none`}
              >
                <option value="">Select family...</option>
                {COLOUR_FAMILIES.map((family) => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`text-xs ${theme.accentColorDim} block mb-1`}>
                Actual paint used (optional):
              </label>
              <input
                type="text"
                value={correction.actualPaintUsed || ''}
                onChange={(e) => onChange({ ...correction, actualPaintUsed: e.target.value })}
                placeholder="e.g., Kantor Blue"
                className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded px-3 py-2 ${theme.accentColor} ${theme.inputFocus} outline-none placeholder-opacity-30`}
                style={{ '::placeholder': { opacity: 0.3 } } as React.CSSProperties}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Main FeedbackModal Component
// ============================================================================

export function FeedbackModal({
  isOpen,
  onClose,
  onSubmit,
  scanId,
  sessionId,
  detectedColours,
  mode,
}: FeedbackModalProps) {
  const theme = useThemeColors(mode);

  // State
  const [rating, setRating] = useState(0);
  const [corrections, setCorrections] = useState<ColourCorrection[]>(() =>
    detectedColours.map((colour, index) => ({
      colourIndex: index,
      originalFamily: colour.family || 'Unknown',
      wasCorrect: true,
    }))
  );
  const [issueCategories, setIssueCategories] = useState<string[]>([]);
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced' | null>(null);
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  // Show expanded corrections section when rating is low
  const showCorrections = rating > 0 && rating <= 3;

  const handleCorrectionChange = (index: number, correction: ColourCorrection) => {
    const newCorrections = [...corrections];
    newCorrections[index] = correction;
    setCorrections(newCorrections);
  };

  const toggleIssueCategory = (categoryId: string) => {
    setIssueCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getRatingText = () => {
    if (rating <= 2) return theme.lowRatingText;
    if (rating === 3) return theme.midRatingText;
    if (rating === 4) return theme.goodRatingText;
    return theme.highRatingText;
  };

  const handleSubmit = async () => {
    if (rating === 0) return;

    setIsSubmitting(true);

    const feedback: FeedbackSubmission = {
      scanId,
      sessionId,
      rating,
      colourCorrections: corrections,
      issueCategories,
      experienceLevel,
      comment,
      email,
      timestamp: new Date().toISOString(),
    };

    try {
      await onSubmit(feedback);
      setShowThankYou(true);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setShowThankYou(false);
    setRating(0);
    setCorrections(detectedColours.map((colour, index) => ({
      colourIndex: index,
      originalFamily: colour.family || 'Unknown',
      wasCorrect: true,
    })));
    setIssueCategories([]);
    setExperienceLevel(null);
    setComment('');
    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-void-black/90 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className={`rounded-lg p-1 w-full max-w-lg max-h-[90vh] overflow-hidden border-2 ${theme.frameBorder}`}
          style={{ background: theme.frameSurface, boxShadow: `0 0 24px ${theme.frameGlow}` }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`${theme.modalBg} rounded-lg overflow-hidden textured`}>
            {/* Header */}
            <div className={`p-4 border-b ${theme.headerBorder} text-center ${theme.headerBg}`}>
              <h2 className={`text-xl font-bold gothic-text ${theme.headerText}`}>
                {theme.title}
              </h2>
              <p className={`text-sm ${theme.headerTextDim} mt-1 tech-text`}>
                {theme.subtitle}
              </p>
            </div>

            {/* Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
              {showThankYou ? (
                /* Thank You State */
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <motion.div
                    className="text-4xl mb-4"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    {theme.thankYouIcon}
                  </motion.div>
                  <h3 className={`text-xl font-bold ${theme.accentColor} gothic-text mb-2`}>
                    {theme.thankYouTitle}
                  </h3>
                  <p className={theme.accentColorDim}>
                    {theme.thankYouText}
                  </p>

                  {/* Ko-fi Prompt */}
                  <div className={`mt-6 rounded-lg p-1 inline-block border ${theme.frameBorder}`} style={{ background: theme.frameSurface }}>
                    <a
                      href="https://ko-fi.com/schemestealer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block ${theme.modalBg} rounded-lg px-6 py-3 hover:opacity-80 transition-opacity`}
                    >
                      <div className={`${theme.ratingActive} font-bold gothic-text`}>
                        {mode === 'miniature' ? 'Fuel the Machine Spirit' : 'Empower the Warp'}
                      </div>
                      <div className={`text-xs ${theme.accentColorDim}`}>
                        {mode === 'miniature' ? 'Buy me a Recaf on Ko-fi' : 'Offer tribute on Ko-fi'}
                      </div>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Rating */}
                  <div className="text-center">
                    <div className={`text-sm ${theme.accentColorDim} mb-3`}>
                      How accurate was this scan?
                    </div>
                    <SkullRating value={rating} onChange={setRating} mode={mode} />
                    {rating > 0 && (
                      <div className={`text-xs ${theme.ratingActive} mt-2`}>
                        {getRatingText()}
                      </div>
                    )}
                  </div>

                  {/* Colour Corrections - Show when rating <= 3 */}
                  <AnimatePresence>
                    {showCorrections && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className={`text-sm ${theme.accentColorDim} text-center border-t ${theme.checkboxBorder} pt-4`}>
                          Mark which colours were incorrect:
                        </div>

                        {detectedColours.map((colour, index) => (
                          <ColourCorrectionRow
                            key={index}
                            colour={colour}
                            index={index}
                            correction={corrections[index]}
                            onChange={(c) => handleCorrectionChange(index, c)}
                            mode={mode}
                          />
                        ))}

                        {/* Issue Categories */}
                        <div className={`border-t ${theme.checkboxBorder} pt-4`}>
                          <div className={`text-sm ${theme.accentColorDim} mb-3`}>
                            What issues did you notice?
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ISSUE_CATEGORIES.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => toggleIssueCategory(category.id)}
                                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                  issueCategories.includes(category.id)
                                    ? `${theme.buttonBg} ${theme.buttonText}`
                                    : `border ${theme.checkboxBorder} ${theme.accentColorDim} hover:border-current`
                                }`}
                                type="button"
                              >
                                {category.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Experience Level */}
                  {rating > 0 && (
                    <div className={`border-t ${theme.checkboxBorder} pt-4`}>
                      <div className={`text-sm ${theme.accentColorDim} mb-2`}>
                        Your painting experience:
                      </div>
                      <div className="flex gap-2">
                        {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setExperienceLevel(level)}
                            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                              experienceLevel === level
                                ? `${theme.ratingActive} bg-current/20`
                                : `border ${theme.checkboxBorder} ${theme.accentColorDim} hover:border-current`
                            }`}
                            type="button"
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Optional Fields */}
                  {rating > 0 && (
                    <div className={`space-y-3 border-t ${theme.checkboxBorder} pt-4`}>
                      <div>
                        <label className={`text-sm ${theme.accentColorDim} block mb-1`}>
                          Additional comments (optional):
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Any other feedback..."
                          rows={2}
                          className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded px-3 py-2 ${theme.accentColor} ${theme.inputFocus} outline-none resize-none`}
                        />
                      </div>

                      <div>
                        <label className={`text-sm ${theme.accentColorDim} block mb-1`}>
                          Email for follow-up (optional):
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className={`w-full ${theme.inputBg} border ${theme.inputBorder} rounded px-3 py-2 ${theme.accentColor} ${theme.inputFocus} outline-none`}
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${theme.headerBorder} flex gap-3`}>
              {showThankYou ? (
                <button
                  onClick={handleClose}
                  className={`flex-1 py-3 px-4 rounded ${theme.buttonBg} ${theme.buttonText} font-bold cyber-text`}
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    onClick={handleClose}
                    className={`flex-1 py-3 px-4 rounded border ${theme.checkboxBorder} ${theme.accentColor} hover:bg-white/5 transition-colors cyber-text text-sm`}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={`flex-1 py-3 px-4 rounded font-bold transition-all cyber-text text-sm ${
                      rating === 0 || isSubmitting
                        ? `${theme.buttonBg}/30 ${theme.buttonText}/50 cursor-not-allowed opacity-50`
                        : `${theme.buttonBg} ${theme.buttonText} ${theme.buttonHover}`
                    }`}
                  >
                    {isSubmitting ? theme.submitText : 'Submit Feedback'}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
