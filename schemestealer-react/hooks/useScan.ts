'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { scanMiniature, scanInspiration } from '@/lib/api';
import { detectColorsOffline } from '@/lib/offlineColorDetection';
import { enhanceWithMultiBrandMatches } from '@/lib/paintMatcher';
import { mlLogger } from '@/lib/mlDataLogger';
import { mapScanError, type ScanError } from '@/lib/errorMessages';
import type { ScanMode, ScanResult } from '@/lib/types';

interface UseScanOptions {
  /**
   * Optional per-mode preprocessing applied to the file before the ONLINE scan
   * call (e.g. miniature browser background removal). Not used in offline mode.
   * Prompt 4 modifies the preprocess function itself, not this hook.
   */
  preprocess?: (file: File) => Promise<File>;
}

interface UseScanReturn {
  isProcessing: boolean;
  error: ScanError | null;
  result: ScanResult | null;
  scan: (file: File) => Promise<void>;
  /** Re-run the last attempted scan without re-selecting the file. */
  retry: () => Promise<void>;
  reset: () => void;
  /** Page calls this after committing the result to the store, so the hook hands
   * over object-URL ownership and won't revoke it on unmount. */
  markCommitted: () => void;
}

/**
 * Owns the entire scan flow for a mode so the pages don't duplicate it:
 * ML logging start/complete, the offline branch, the API call (with optional
 * preprocess), structured error mapping, and object-URL hygiene for failed
 * scans. The committed scan's object URL is owned by the store (revoked when
 * replaced or cleared); the hook only revokes transient/failed-scan URLs within
 * its own mount, so navigating to the results page never breaks the image.
 */
export function useScan(mode: ScanMode, options: UseScanOptions = {}): UseScanReturn {
  const offlineMode = useAppStore((s) => s.offlineMode);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<ScanError | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const lastFileRef = useRef<File | null>(null);
  // URL of an uncommitted result this hook produced; revoked if the next scan
  // replaces it before the page commits it, or if the scan fails.
  const pendingUrlRef = useRef<string | null>(null);
  // Keep the latest preprocess without making scan() identity churn. The ref is
  // synced in an effect (never written during render).
  const preprocessRef = useRef(options.preprocess);
  useEffect(() => {
    preprocessRef.current = options.preprocess;
  }, [options.preprocess]);

  const revokePending = useCallback(() => {
    const url = pendingUrlRef.current;
    if (url && typeof window !== 'undefined' && url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
    pendingUrlRef.current = null;
  }, []);

  const runScan = useCallback(
    async (file: File) => {
      lastFileRef.current = file;
      revokePending(); // drop any prior uncommitted result's URL
      setIsProcessing(true);
      setError(null);

      await mlLogger.startScan(mode, file);

      try {
        let scanResult: ScanResult;

        if (offlineMode) {
          scanResult = await detectColorsOffline(file, mode, {
            numColors: mode === 'miniature' ? 6 : 5,
            numPaintMatches: 5,
          });
          scanResult = enhanceWithMultiBrandMatches(scanResult, 3);
        } else {
          const fileToScan = preprocessRef.current ? await preprocessRef.current(file) : file;
          scanResult =
            mode === 'miniature' ? await scanMiniature(fileToScan) : await scanInspiration(fileToScan);
        }

        if (scanResult.imageUrl?.startsWith('blob:')) {
          pendingUrlRef.current = scanResult.imageUrl;
        }

        mlLogger.logScanComplete(scanResult);
        setResult(scanResult);
        setIsProcessing(false);
      } catch (err) {
        if (process.env.NODE_ENV === 'development') console.error('Scan error:', err);
        revokePending(); // failed scan's object URL never reaches the store
        setError(mapScanError(err, mode));
        setIsProcessing(false);
      }
    },
    [mode, offlineMode, revokePending]
  );

  const scan = useCallback((file: File) => runScan(file), [runScan]);

  const retry = useCallback(async () => {
    if (lastFileRef.current) await runScan(lastFileRef.current);
  }, [runScan]);

  const reset = useCallback(() => {
    revokePending();
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, [revokePending]);

  const markCommitted = useCallback(() => {
    // The store now owns this scan's object URL (and will revoke it when it is
    // replaced or cleared); release hook ownership so unmount won't revoke it.
    pendingUrlRef.current = null;
  }, []);

  // If the page unmounts before committing the result (e.g. navigating away
  // mid-reveal), revoke the still-uncommitted object URL. A committed URL has
  // already been released via markCommitted, so this is a no-op for it.
  useEffect(() => () => revokePending(), [revokePending]);

  return { isProcessing, error, result, scan, retry, reset, markCommitted };
}
