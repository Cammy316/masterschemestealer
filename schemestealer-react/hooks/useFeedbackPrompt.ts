/**
 * useFeedbackPrompt Hook
 * Manages automatic feedback prompt timing and session tracking
 * Auto-prompts after configurable delay + exit intent, once per session
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

interface UseFeedbackPromptOptions {
  scanId: string | undefined;
  delay?: number; // Minimum wait time before exit intent triggers it (Default 30s)
  enabled?: boolean;
}

interface UseFeedbackPromptReturn {
  shouldShow: boolean;
  dismiss: () => void;
  triggerManually: () => void;
  hasBeenShown: boolean;
}

// ============================================================================
// Constants & Session State
// ============================================================================

const SESSION_SHOWN_KEY = 'schemestealer-feedback-shown-session';
const DEFAULT_DELAY_MS = 30000; // 30 seconds wait before exit intent works
const FALLBACK_DELAY_MS = 90000; // 90 seconds absolute fallback

function hasBeenShownThisSession(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_SHOWN_KEY) === 'true';
}

function markAsShownThisSession(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_SHOWN_KEY, 'true');
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useFeedbackPrompt({
  scanId,
  delay = DEFAULT_DELAY_MS,
  enabled = true,
}: UseFeedbackPromptOptions): UseFeedbackPromptReturn {
  const [shouldShow, setShouldShow] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const timeThresholdMet = useRef(false);

  const sessionAlreadyShown = hasBeenShownThisSession();

  useEffect(() => {
    // Don't setup listeners if:
    // - No scanId
    // - Feature disabled
    // - Already shown in this session
    // - Already shown in this component instance
    if (!scanId || !enabled || sessionAlreadyShown || hasBeenShown) {
      return;
    }

    // After delay, we are READY to show (time threshold met for exit intent)
    const delayTimer = setTimeout(() => {
      timeThresholdMet.current = true;
    }, delay);

    // Fallback: if they stay very long, just show it
    const fallbackTimer = setTimeout(() => {
      if (!hasBeenShownThisSession()) {
        setShouldShow(true);
        setHasBeenShown(true);
        markAsShownThisSession();
      }
    }, FALLBACK_DELAY_MS);

    // Exit intent listener
    const handleMouseLeave = (e: MouseEvent) => {
      // clientY <= 0 means mouse moved out the top of the viewport (likely towards tabs/address bar)
      if (e.clientY <= 0 && timeThresholdMet.current && !hasBeenShownThisSession()) {
        setShouldShow(true);
        setHasBeenShown(true);
        markAsShownThisSession();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(delayTimer);
      clearTimeout(fallbackTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [scanId, enabled, delay, sessionAlreadyShown, hasBeenShown]);

  // Dismiss handler - marks this session as dismissed
  const dismiss = useCallback(() => {
    markAsShownThisSession();
    setShouldShow(false);
  }, []);

  // Manual trigger - shows modal immediately
  const triggerManually = useCallback(() => {
    setShouldShow(true);
    setHasBeenShown(true);
    markAsShownThisSession();
  }, []);

  return {
    shouldShow,
    dismiss,
    triggerManually,
    hasBeenShown,
  };
}

export default useFeedbackPrompt;
