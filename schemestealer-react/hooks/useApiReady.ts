'use client';

import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '@/lib/apiClient';

/**
 * Polls /api/ready until the backend scanners have finished initialising.
 * Pass skip=true (e.g. when offline mode is on) to skip polling and return ready immediately.
 */
export function useApiReady(skip = false): boolean {
  const [ready, setReady] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (skip) {
      setReady(true);
      return;
    }

    const check = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ready`, {
          signal: AbortSignal.timeout(4000),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.ready) {
            setReady(true);
            if (timerRef.current) clearInterval(timerRef.current);
          }
        }
      } catch {
        // server not ready yet — keep polling
      }
    };

    check();
    timerRef.current = setInterval(check, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [skip]);

  return ready;
}
