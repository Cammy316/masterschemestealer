'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/lib/apiClient';

let sessionReady = false;

export function markApiReady() {
  sessionReady = true;
}

// Poll fast at first (this also usefully warms the Render instance), then back
// off to a courteous cadence so we don't drain battery/data on mobile if the
// backend stays down for a long time.
const FAST_INTERVAL_MS = 5000;
const SLOW_INTERVAL_MS = 30000;
const BACKOFF_AFTER_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Polls /api/ready until the backend scanners have finished initialising.
 * Pass skip=true (e.g. when offline mode is on) to skip polling and return ready immediately.
 */
export function useApiReady(skip = false): boolean {
  const [polledReady, setPolledReady] = useState(sessionReady);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (skip || sessionReady) return;

    let cancelled = false;
    const startedAt = Date.now();

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const scheduleNext = () => {
      if (cancelled) return;
      const interval = Date.now() - startedAt >= BACKOFF_AFTER_MS ? SLOW_INTERVAL_MS : FAST_INTERVAL_MS;
      timerRef.current = setTimeout(check, interval);
    };

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ready`, {
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ready) {
            markApiReady();
            if (!cancelled) setPolledReady(true);
            clearTimer();
            return;
          }
        }
      } catch {
        // server not ready yet — keep polling
      }
      scheduleNext();
    };

    check();
    return () => {
      cancelled = true;
      clearTimer();
    };
  }, [skip]);

  return skip || polledReady || sessionReady;
}
