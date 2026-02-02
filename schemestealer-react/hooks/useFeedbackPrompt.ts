/**
 * useFeedbackPrompt Hook
 * Manages automatic feedback prompt timing and session tracking
 * Auto-prompts after configurable delay, can be dismissed per session
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

// ============================================================================
// Types
// ============================================================================

interface UseFeedbackPromptOptions {
  scanId: string | undefined;
  delay?: number; // Default 10 seconds
  enabled?: boolean;
}

interface UseFeedbackPromptReturn {
  shouldShow: boolean;
  dismiss: () => void;
  triggerManually: () => void;
  hasBeenShown: boolean;
}

// ============================================================================
// Constants
// ============================================================================

const DISMISSED_SCANS_KEY = 'schemestealer-feedback-dismissed';
const DEFAULT_DELAY_MS = 10000; // 10 seconds

// ============================================================================
// Session Storage Helpers
// ============================================================================

function getDismissedScans(): Set<string> {
  if (typeof window === 'undefined') return new Set();

  try {
    const stored = sessionStorage.getItem(DISMISSED_SCANS_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function addDismissedScan(scanId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const dismissed = getDismissedScans();
    dismissed.add(scanId);
    // Only keep last 50 to prevent storage bloat
    const arr = Array.from(dismissed).slice(-50);
    sessionStorage.setItem(DISMISSED_SCANS_KEY, JSON.stringify(arr));
  } catch (error) {
    console.warn('Failed to save dismissed scan:', error);
  }
}

function wasScandDismissed(scanId: string): boolean {
  return getDismissedScans().has(scanId);
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
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if already dismissed for this scan
  const wasDismissed = scanId ? wasScandDismissed(scanId) : false;

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  // Set up auto-prompt timer
  useEffect(() => {
    // Don't show if:
    // - No scanId
    // - Feature disabled
    // - Already dismissed for this scan
    // - Already shown
    if (!scanId || !enabled || wasDismissed || hasBeenShown) {
      return;
    }

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new timer
    timerRef.current = setTimeout(() => {
      setShouldShow(true);
      setHasBeenShown(true);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [scanId, delay, enabled, wasDismissed, hasBeenShown]);

  // Dismiss handler - marks this scan as dismissed for the session
  const dismiss = useCallback(() => {
    if (scanId) {
      addDismissedScan(scanId);
    }
    setShouldShow(false);

    // Clear the timer if still running
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, [scanId]);

  // Manual trigger - shows modal immediately
  const triggerManually = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShouldShow(true);
    setHasBeenShown(true);
  }, []);

  return {
    shouldShow,
    dismiss,
    triggerManually,
    hasBeenShown,
  };
}

export default useFeedbackPrompt;
