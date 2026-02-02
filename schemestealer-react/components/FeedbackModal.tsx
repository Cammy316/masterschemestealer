/**
 * FeedbackModal Component
 * W40K themed feedback collection with colour-level corrections
 * Collects ratings, corrections, and issue categories for ML training
 */

'use client';

import React, { useState } from 'react';
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
// Skull Rating Component
// ============================================================================

function SkullRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex justify-center gap-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <button
          key={rating}
          onClick={() => onChange(rating)}
          className={`transition-all duration-200 ${
            rating <= value
              ? 'text-brass scale-110'
              : 'text-cogitator-green/30 hover:text-cogitator-green/50'
          }`}
          type="button"
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            {/* Skull icon */}
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h1v1c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1h1c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm-2 13h-1v-1h1v1zm5 0h-1v-1h1v1zm1.5-5c-.83 0-1.5-.67-1.5-1.5S15.67 7 16.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm-9 0c-.83 0-1.5-.67-1.5-1.5S6.67 7 7.5 7 9 7.67 9 8.5 8.33 10 7.5 10z"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

// ============================================================================
// Colour Correction Row Component
// ============================================================================

interface ColourCorrectionRowProps {
  colour: Color;
  index: number;
  correction: ColourCorrection;
  onChange: (correction: ColourCorrection) => void;
}

function ColourCorrectionRow({ colour, index, correction, onChange }: ColourCorrectionRowProps) {
  const handleCorrectToggle = (isCorrect: boolean) => {
    onChange({
      ...correction,
      wasCorrect: isCorrect,
      correctedFamily: isCorrect ? undefined : correction.correctedFamily,
    });
  };

  return (
    <div className="gothic-frame rounded-lg p-1">
      <div className="bg-void-black/80 rounded-lg p-3">
        <div className="flex items-center gap-3 mb-2">
          {/* Colour swatch */}
          <div
            className="w-10 h-10 rounded border-2 border-cogitator-green/50 flex-shrink-0"
            style={{ backgroundColor: colour.hex }}
          />

          {/* Predicted family */}
          <div className="flex-1 min-w-0">
            <div className="text-sm text-cogitator-green-dim tech-text">Detected as:</div>
            <div className="font-bold auspex-text truncate">{colour.family || 'Unknown'}</div>
          </div>

          {/* Correct/Wrong toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => handleCorrectToggle(true)}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                correction.wasCorrect
                  ? 'bg-cogitator-green text-void-black'
                  : 'border border-cogitator-green/30 text-cogitator-green/50 hover:border-cogitator-green'
              }`}
              type="button"
            >
              Correct
            </button>
            <button
              onClick={() => handleCorrectToggle(false)}
              className={`px-3 py-1 rounded text-sm font-bold transition-all ${
                !correction.wasCorrect
                  ? 'bg-blood-red text-void-black'
                  : 'border border-blood-red/30 text-blood-red/50 hover:border-blood-red'
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
            className="mt-3 space-y-2 border-t border-cogitator-green/20 pt-3"
          >
            <div>
              <label className="text-xs text-cogitator-green-dim block mb-1">
                Correct colour family:
              </label>
              <select
                value={correction.correctedFamily || ''}
                onChange={(e) => onChange({ ...correction, correctedFamily: e.target.value })}
                className="w-full bg-void-black border border-cogitator-green/30 rounded px-3 py-2 text-cogitator-green focus:border-cogitator-green outline-none"
              >
                <option value="">Select family...</option>
                {COLOUR_FAMILIES.map((family) => (
                  <option key={family} value={family}>{family}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-cogitator-green-dim block mb-1">
                Actual paint used (optional):
              </label>
              <input
                type="text"
                value={correction.actualPaintUsed || ''}
                onChange={(e) => onChange({ ...correction, actualPaintUsed: e.target.value })}
                placeholder="e.g., Kantor Blue"
                className="w-full bg-void-black border border-cogitator-green/30 rounded px-3 py-2 text-cogitator-green focus:border-cogitator-green outline-none placeholder-cogitator-green/30"
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
          className="gothic-frame rounded-lg p-1 w-full max-w-lg max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-dark-gothic rounded-lg overflow-hidden textured">
            {/* Header */}
            <div className="p-4 border-b border-cogitator-green/30 text-center">
              <h2 className="text-xl font-bold gothic-text auspex-text">
                Rate This Colour Analysis
              </h2>
              <p className="text-sm text-cogitator-green-dim mt-1 tech-text">
                Your feedback improves the Machine Spirit
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
                  <div className="text-4xl mb-4">⚔️</div>
                  <h3 className="text-xl font-bold auspex-text gothic-text mb-2">
                    The Emperor Protects
                  </h3>
                  <p className="text-cogitator-green-dim mb-6">
                    Your feedback strengthens the Omnissiah&apos;s wisdom
                  </p>

                  {/* Ko-fi Prompt */}
                  <div className="gothic-frame rounded-lg p-1 inline-block">
                    <a
                      href="https://ko-fi.com/schemestealer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-brass/20 rounded-lg px-6 py-3 hover:bg-brass/30 transition-colors"
                    >
                      <div className="text-brass font-bold gothic-text">
                        Fuel the Machine Spirit
                      </div>
                      <div className="text-xs text-brass/70">
                        Buy me a Recaf on Ko-fi
                      </div>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Rating */}
                  <div className="text-center">
                    <div className="text-sm text-cogitator-green-dim mb-3">
                      How accurate was this scan?
                    </div>
                    <SkullRating value={rating} onChange={setRating} />
                    {rating > 0 && (
                      <div className="text-xs text-brass mt-2">
                        {rating <= 2 ? 'Machine Spirit requires recalibration' :
                         rating === 3 ? 'Acceptable accuracy' :
                         rating === 4 ? 'Good accuracy' :
                         'Excellent accuracy - Praise the Omnissiah!'}
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
                        <div className="text-sm text-cogitator-green-dim text-center border-t border-cogitator-green/20 pt-4">
                          Mark which colours were incorrect:
                        </div>

                        {detectedColours.map((colour, index) => (
                          <ColourCorrectionRow
                            key={index}
                            colour={colour}
                            index={index}
                            correction={corrections[index]}
                            onChange={(c) => handleCorrectionChange(index, c)}
                          />
                        ))}

                        {/* Issue Categories */}
                        <div className="border-t border-cogitator-green/20 pt-4">
                          <div className="text-sm text-cogitator-green-dim mb-3">
                            What issues did you notice?
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {ISSUE_CATEGORIES.map((category) => (
                              <button
                                key={category.id}
                                onClick={() => toggleIssueCategory(category.id)}
                                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                                  issueCategories.includes(category.id)
                                    ? 'bg-cogitator-green text-void-black'
                                    : 'border border-cogitator-green/30 text-cogitator-green/70 hover:border-cogitator-green'
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
                    <div className="border-t border-cogitator-green/20 pt-4">
                      <div className="text-sm text-cogitator-green-dim mb-2">
                        Your painting experience:
                      </div>
                      <div className="flex gap-2">
                        {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setExperienceLevel(level)}
                            className={`flex-1 px-3 py-2 rounded text-sm font-medium transition-all ${
                              experienceLevel === level
                                ? 'bg-brass text-void-black'
                                : 'border border-brass/30 text-brass/70 hover:border-brass'
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
                    <div className="space-y-3 border-t border-cogitator-green/20 pt-4">
                      <div>
                        <label className="text-sm text-cogitator-green-dim block mb-1">
                          Additional comments (optional):
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Any other feedback..."
                          rows={2}
                          className="w-full bg-void-black border border-cogitator-green/30 rounded px-3 py-2 text-cogitator-green focus:border-cogitator-green outline-none placeholder-cogitator-green/30 resize-none"
                        />
                      </div>

                      <div>
                        <label className="text-sm text-cogitator-green-dim block mb-1">
                          Email for follow-up (optional):
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-void-black border border-cogitator-green/30 rounded px-3 py-2 text-cogitator-green focus:border-cogitator-green outline-none placeholder-cogitator-green/30"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-cogitator-green/30 flex gap-3">
              {showThankYou ? (
                <button
                  onClick={handleClose}
                  className="flex-1 py-3 px-4 rounded bg-cogitator-green text-void-black font-bold"
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 rounded border border-cogitator-green/30 text-cogitator-green/70 hover:border-cogitator-green transition-colors"
                  >
                    Skip
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className={`flex-1 py-3 px-4 rounded font-bold transition-all ${
                      rating === 0 || isSubmitting
                        ? 'bg-cogitator-green/30 text-void-black/50 cursor-not-allowed'
                        : 'bg-cogitator-green text-void-black hover:bg-cogitator-green-bright'
                    }`}
                  >
                    {isSubmitting ? 'Transmitting...' : 'Submit Feedback'}
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
