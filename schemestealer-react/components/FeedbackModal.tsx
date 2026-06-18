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
        frameGradient: 'linear-gradient(135deg, var(--brass-dark) 0%, var(--bronze) 50%, var(--brass-dark) 100%)',
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
        frameGradient: 'linear-gradient(135deg, var(--warp-purple-dark) 0%, var(--warp-pink) 50%, var(--warp-purple-dark) 100%)',
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
    // Servo-skull icons for Cogitator theme
    const glowColor = isSelected ? 'drop-shadow(0 0 8px var(--cogitator-green-glow))' : 'none';
    const fillColor = isSelected ? 'var(--brass)' : 'var(--cogitator-green)';
    const opacity = isSelected ? 1 : 0.3;

    // Different skull states based on rating
    const eyeColor = rating >= 4 ? 'var(--cogitator-green)' : rating <= 2 ? '#ff4444' : '#666';
    const hasCracks = rating <= 2;
    const hasAugments = rating >= 4;

    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill={fillColor}
        style={{ filter: glowColor, opacity, transition: 'all 0.2s ease' }}
      >
        {/* Main skull */}
        <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" />
        {/* Eye sockets */}
        <circle cx="9" cy="10" r="1.5" fill={eyeColor} />
        <circle cx="15" cy="10" r="1.5" fill={eyeColor} />
        {/* Jaw */}
        <path d="M8 17h8v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z" />
        {/* Mechanical augments for high ratings */}
        {hasAugments && (
          <>
            <circle cx="6" cy="6" r="1" fill="var(--cogitator-green)" opacity="0.8" />
            <circle cx="18" cy="6" r="1" fill="var(--cogitator-green)" opacity="0.8" />
          </>
        )}
        {/* Cracks for low ratings */}
        {hasCracks && (
          <path d="M8 5l1 3-0.5 1M16 5l-1 3 0.5 1" stroke="#333" strokeWidth="0.3" fill="none" />
        )}
        {/* Nose */}
        <path d="M11 12l1 2 1-2z" fill="#0d0d0d" />
        {/* Teeth */}
        <path d="M9 14h6" stroke="#0d0d0d" strokeWidth="0.5" />
      </svg>
    );
  } else {
    // Warp spirit/eye icons for Inspiration theme
    const glowColor = isSelected ? 'drop-shadow(0 0 10px var(--ethereal-glow))' : 'none';
    const opacity = isSelected ? 1 : 0.3;

    // Different states based on rating
    const outerColor = isSelected ? 'var(--warp-purple-light)' : 'var(--warp-purple)';
    const innerColor = rating >= 4 ? 'var(--warp-pink)' : rating <= 2 ? '#ff4444' : 'var(--warp-purple)';
    const pupilColor = rating >= 4 ? 'var(--warp-teal)' : rating <= 2 ? '#660000' : 'var(--warp-pink)';
    const hasTendrils = rating >= 4;
    const hasCorruption = rating <= 2;

    return (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        style={{ filter: glowColor, opacity, transition: 'all 0.2s ease' }}
      >
        {/* Ethereal orb */}
        <circle cx="12" cy="12" r="10" fill={outerColor} opacity="0.4" />
        <circle cx="12" cy="12" r="7" fill={innerColor} opacity="0.6" />
        {/* Eye */}
        <ellipse cx="12" cy="12" rx="4" ry="5" fill="#0d0d0d" />
        {/* Pupil */}
        <circle cx="12" cy="12" r={rating >= 4 ? 2 : rating <= 2 ? 0.8 : 1.5} fill={pupilColor} />
        {/* Warp tendrils for high ratings */}
        {hasTendrils && (
          <g stroke="var(--warp-pink)" strokeWidth="1" opacity="0.6">
            <path d="M4 12c3-1.5 4-3 4-5" fill="none" />
            <path d="M20 12c-3-1.5-4-3-4-5" fill="none" />
            <path d="M12 20c1.5-3 3-4 5-4" fill="none" />
            <path d="M12 4c-1.5 3-3 4-5 4" fill="none" />
          </g>
        )}
        {/* Corruption marks for low ratings */}
        {hasCorruption && (
          <g stroke="#ff4444" strokeWidth="0.8" opacity="0.6">
            <line x1="6" y1="6" x2="9" y2="9" />
            <line x1="18" y1="6" x2="15" y2="9" />
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
    <div className={`rounded-lg p-1 border ${theme.modalBorder}`} style={{ background: theme.frameGradient }}>
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
          style={{ background: theme.frameGradient }}
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
                  <div className={`mt-6 rounded-lg p-1 inline-block border ${theme.frameBorder}`} style={{ background: theme.frameGradient }}>
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
                  className={`flex-1 py-3 px-4 rounded ${theme.buttonBg} ${theme.buttonText} font-bold`}
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    onClick={handleClose}
                    className={`flex-1 py-3 px-4 rounded border ${theme.checkboxBorder} ${theme.accentColorDim} hover:border-current transition-colors`}
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={`flex-1 py-3 px-4 rounded font-bold transition-all ${
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
