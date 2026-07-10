/**
 * Ko-fi Prompt Component
 * W40K themed "Buy me a Recaf" / "Fuel the Machine Spirit" prompts
 * Theme-aware: amber for miniature, purple for inspiration
 * Shows after scans (20% chance) or feedback submission (always)
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics';
import type { ScanMode } from '@/lib/types';

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
  /** Theme mode - determines styling */
  mode?: ScanMode;
}

interface KoFiBannerProps {
  /** Compact mode for footer/sidebar */
  compact?: boolean;
  /** Source for analytics tracking */
  source?: string;
  /** Theme mode - determines styling */
  mode?: ScanMode;
}

// ============================================================================
// Theme Configuration
// ============================================================================

function useThemeColors(mode: ScanMode = 'miniature') {
  return useMemo(() => mode === 'miniature'
    ? {
        // Cogitator / Imperial theme
        frameBorder: 'border-brass',
        frameSurface: 'var(--dark-gothic)',
        modalBg: 'bg-dark-gothic',
        buttonBg: 'bg-brass',
        buttonHover: 'hover:bg-amber-600',
        buttonText: 'text-void-black',
        buttonGlow: '0 0 15px var(--brass)',
        accentColor: 'text-brass',
        accentColorDim: 'text-cogitator-green-dim',
        borderColor: 'border-brass/30',
        hoverBg: 'hover:bg-brass/20',
        title: 'Fuel the Machine Spirit',
        subtitle: 'SchemeStealer is free to use. If it helps your hobby, consider buying me a Recaf to keep the cogitators running.',
        buttonLabel: 'Buy me a Recaf',
        dismissLabel: 'Maybe later',
        flavorText: '"The Omnissiah rewards those who maintain the sacred machinery"',
        icon: (
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
        ),
        iconSmall: (
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
        ),
        iconMedium: (
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
        ),
        bannerSubtitle: 'Support SchemeStealer on Ko-fi',
      }
    : {
        // Warp / Chaos theme
        frameBorder: 'border-warp-purple',
        frameSurface: 'var(--void-blue)',
        modalBg: 'bg-void-blue',
        buttonBg: 'bg-warp-purple',
        buttonHover: 'hover:bg-warp-purple-dark',
        buttonText: 'text-white',
        buttonGlow: '0 0 15px var(--ethereal-glow)',
        accentColor: 'text-warp-purple-light',
        accentColorDim: 'text-warp-purple-light/60',
        borderColor: 'border-warp-purple/30',
        hoverBg: 'hover:bg-warp-purple/20',
        title: 'Empower the Warp',
        subtitle: 'SchemeStealer is free to use. If it aids your artistic journey, consider offering tribute to fuel the Immaterium.',
        buttonLabel: 'Offer Tribute',
        dismissLabel: 'Perhaps another time',
        flavorText: '"The Warp rewards those who tend to its pathways"',
        icon: (
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto text-warp-purple-light"
          >
            {/* Warp portal / eye icon */}
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8" />
            <path d="M2 12c3-2 5-4 5-7M22 12c-3-2-5-4-5-7M12 22c2-3 4-5 7-5M12 2c-2 3-4 5-7 5" stroke="var(--warp-pink)" strokeWidth="1" opacity="0.6" />
          </svg>
        ),
        iconSmall: (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-warp-purple-light"
          >
            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
        ),
        iconMedium: (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-warp-purple-light flex-shrink-0"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
          </svg>
        ),
        bannerSubtitle: 'Support SchemeStealer on Ko-fi',
      }
  , [mode]);
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

export function KoFiPrompt({ trigger, forceShow = false, onDismiss, mode = 'miniature' }: KoFiPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const theme = useThemeColors(mode);

  // Lock body scroll while the overlay is open (this is a plain fixed div,
  // not a HeadlessUI Dialog, so the page scrolls beneath it otherwise).
  useEffect(() => {
    if (!isVisible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isVisible]);

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
          className="fixed inset-0 bg-void-black/80 z-[var(--z-modal)] flex items-center justify-center p-4"
          onClick={handleDismiss}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`rounded-lg p-1 max-w-sm w-full border ${theme.frameBorder}`}
            style={{ background: theme.frameSurface }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`${theme.modalBg} rounded-lg p-6 textured text-center`}>
              {/* Icon */}
              <div className="mb-4">
                {theme.icon}
              </div>

              {/* Title */}
              <h3 className={`text-xl font-bold gothic-text ${theme.accentColor} mb-2`}>
                {theme.title}
              </h3>

              {/* Description */}
              <p className={`${theme.accentColorDim} text-sm mb-4 tech-text`}>
                {theme.subtitle}
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <motion.button
                  onClick={handleKoFiClick}
                  className={`w-full py-3 px-6 rounded-lg ${theme.buttonBg} ${theme.buttonText} font-bold gothic-text`}
                  whileHover={{ scale: 1.02, boxShadow: theme.buttonGlow }}
                  whileTap={{ scale: 0.98 }}
                >
                  {theme.buttonLabel}
                </motion.button>

                <button
                  onClick={handleDismiss}
                  className={`w-full touch-target py-2 px-4 ${theme.accentColorDim} text-sm hover:${theme.accentColor} transition-colors`}
                >
                  {theme.dismissLabel}
                </button>
              </div>

              {/* Flavor text */}
              <p className={`text-xs ${theme.accentColorDim} mt-4 italic opacity-50`}>
                {theme.flavorText}
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

export function KoFiBanner({ compact = false, source = 'banner', mode = 'miniature' }: KoFiBannerProps) {
  const theme = useThemeColors(mode);

  const handleClick = () => {
    analytics.trackKoFiClicked(source);
    window.open(KOFI_URL, '_blank', 'noopener,noreferrer');
  };

  if (compact) {
    return (
      <motion.button
        onClick={handleClick}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${theme.borderColor} ${theme.hoverBg} transition-colors`}
        style={{ background: mode === 'miniature' ? 'rgba(184, 134, 11, 0.1)' : 'rgba(139, 92, 246, 0.1)' }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {theme.iconSmall}
        <span className={`${theme.accentColor} text-sm font-medium`}>{theme.buttonLabel}</span>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      className={`rounded-lg p-1 w-full border ${theme.frameBorder}`}
      style={{ background: theme.frameSurface }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className={`${theme.modalBg} rounded-lg px-4 py-3 flex items-center gap-3 ${theme.hoverBg} transition-colors`}>
        {theme.iconMedium}
        <div className="text-left">
          <div className={`${theme.accentColor} font-bold text-sm gothic-text`}>
            {theme.title}
          </div>
          <div className={`${theme.accentColorDim} text-xs`}>
            {theme.bannerSubtitle}
          </div>
        </div>
      </div>
    </motion.button>
  );
}

// ============================================================================
// Ko-fi Link Component (inline text link)
// ============================================================================

export function KoFiLink({ children, source = 'link', mode = 'miniature' }: { children?: React.ReactNode; source?: string; mode?: ScanMode }) {
  const theme = useThemeColors(mode);

  const handleClick = () => {
    analytics.trackKoFiClicked(source);
  };

  return (
    <a
      href={KOFI_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${theme.accentColor} hover:opacity-80 underline transition-colors`}
    >
      {children || theme.buttonLabel}
    </a>
  );
}

export default KoFiPrompt;
