/**
 * Ko-fi Prompt Component
 * W40K themed "Buy me a Recaf" / "Fuel the Machine Spirit" prompts
 * Shows after scans (20% chance) or feedback submission (always)
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics';

// ============================================================================
// Constants
// ============================================================================

const KOFI_URL = 'https://ko-fi.com/schemestealer';
const DISMISSED_KEY = 'schemestealer-kofi-dismissed';
const SHOW_PROBABILITY = 0.2; // 20% chance after scan

// ============================================================================
// Types
// ============================================================================

interface KoFiPromptProps {
  /** When to show: 'scan' (20% chance), 'feedback' (always), 'manual' */
  trigger: 'scan' | 'feedback' | 'manual';
  /** Optional: Force show regardless of probability */
  forceShow?: boolean;
  /** Callback when dismissed */
  onDismiss?: () => void;
}

interface KoFiBannerProps {
  /** Compact mode for footer/sidebar */
  compact?: boolean;
  /** Source for analytics tracking */
  source?: string;
}

// ============================================================================
// Session storage helpers
// ============================================================================

function wasDismissedThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(DISMISSED_KEY) === 'true';
}

function markDismissedThisSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(DISMISSED_KEY, 'true');
}

// ============================================================================
// Ko-fi Popup Component
// ============================================================================

export function KoFiPrompt({ trigger, forceShow = false, onDismiss }: KoFiPromptProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed this session
    if (wasDismissedThisSession() && !forceShow) {
      return;
    }

    // Determine if we should show based on trigger type
    let shouldShow = false;

    if (forceShow) {
      shouldShow = true;
    } else if (trigger === 'feedback') {
      // Always show after feedback
      shouldShow = true;
    } else if (trigger === 'scan') {
      // 20% chance after scan
      shouldShow = Math.random() < SHOW_PROBABILITY;
    } else if (trigger === 'manual') {
      shouldShow = true;
    }

    if (shouldShow) {
      // Slight delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [trigger, forceShow]);

  const handleDismiss = () => {
    setIsVisible(false);
    markDismissedThisSession();
    onDismiss?.();
  };

  const handleKoFiClick = () => {
    analytics.trackKoFiClicked(`popup_${trigger}`);
    window.open(KOFI_URL, '_blank', 'noopener,noreferrer');
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-void-black/80 z-50 flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="gothic-frame rounded-lg p-1 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-dark-gothic rounded-lg p-6 textured text-center">
              {/* Icon */}
              <div className="mb-4">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mx-auto text-brass"
                >
                  {/* Coffee cup / Recaf icon */}
                  <path
                    d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 1v3M10 1v3M14 1v3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold gothic-text text-brass mb-2">
                Fuel the Machine Spirit
              </h3>

              {/* Description */}
              <p className="text-cogitator-green-dim text-sm mb-4 tech-text">
                SchemeStealer is free to use. If it helps your hobby,
                consider buying me a Recaf to keep the cogitators running.
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleKoFiClick}
                  className="w-full py-3 px-6 rounded-lg bg-brass text-void-black font-bold gothic-text"
                  whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--brass)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Buy me a Recaf
                </motion.button>

                <button
                  onClick={handleDismiss}
                  className="w-full py-2 px-4 text-cogitator-green/50 text-sm hover:text-cogitator-green transition-colors"
                >
                  Maybe later
                </button>
              </div>

              {/* Flavor text */}
              <p className="text-xs text-cogitator-green/30 mt-4 italic">
                &quot;The Omnissiah rewards those who maintain the sacred machinery&quot;
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============================================================================
// Ko-fi Banner Component (for footer/sidebar)
// ============================================================================

export function KoFiBanner({ compact = false, source = 'banner' }: KoFiBannerProps) {
  const handleClick = () => {
    analytics.trackKoFiClicked(source);
    window.open(KOFI_URL, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <motion.button
        onClick={handleClick}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-brass/30 bg-brass/10 hover:bg-brass/20 transition-colors"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brass"
        >
          <path
            d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-brass text-sm font-medium">Buy me a Recaf</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className="gothic-frame rounded-lg p-1 w-full"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="bg-brass/10 rounded-lg px-4 py-3 flex items-center gap-3 hover:bg-brass/20 transition-colors">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-brass flex-shrink-0"
        >
          <path
            d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 1v3M10 1v3M14 1v3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="text-left">
          <div className="text-brass font-bold text-sm gothic-text">
            Fuel the Machine Spirit
          </div>
          <div className="text-brass/60 text-xs">
            Support SchemeStealer on Ko-fi
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Ko-fi Link Component (inline text link)
// ============================================================================

export function KoFiLink({ children, source = 'link' }: { children?: React.ReactNode; source?: string }) {
  const handleClick = () => {
    analytics.trackKoFiClicked(source);
  };

  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="text-brass hover:text-brass/80 underline transition-colors"
    >
      {children || 'Buy me a Recaf'}
    </a>
  );
}

export default KoFiPrompt;
