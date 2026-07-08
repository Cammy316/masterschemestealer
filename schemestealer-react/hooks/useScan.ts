'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { scanMiniature, scanInspiration } from '@/lib/api';
import { mlLogger } from '@/lib/mlDataLogger';
import { useAppStore } from '@/lib/store';
import { mapScanError, type ScanError } from '@/lib/errorMessages';
import type { ScanMode, ScanResult } from '@/lib/types';

interface UseScanOptions {
  /**
   * Optional per-mode preprocessing applied to the file before the ONLINE scan
   * call (e.g. miniature browser background removal). Not used by the offline
   * fallback. The closure may report its own progress via page state.
   */
  preprocess?: (file: File) => Promise<File>;
}

interface UseScanReturn {
  isProcessing: boolean;
  error: ScanError | null;
  result: ScanResult | null;
  scan: (file: File) => Promise<void>;
  /** Re-run the last attempted scan against the backend (no re-selection). */
  retry: () => Promise<void>;
  /** Run the in-browser fallback engine on the last attempted file. */
  fallbackToOffline: () => Promise<void>;
  reset: () => void;
  /** Page calls this after committing the result to the store, so the hook hands
   * over object-URL ownership and won't revoke it on unmount. */
  markCommitted: () => void;
}

/**
 * Owns the scan flow for a mode: ML logging, the backend call (with optional
 * preprocess), structured error mapping, object-URL hygiene, and a hidden
 * in-browser fallback. The offline engine (and its paint DB) are dynamically
 * imported so they stay out of the main bundle — they load only if the backend
 * is unreachable and the user chooses the local fallback.
 */
export function useScan(mode: ScanMode, options: UseScanOptions = {}): UseScanReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<ScanError | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const lastFileRef = useRef<File | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
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

  // Record a produced result: track its object URL, ML-log it, surface it.
  const completeWith = useCallback((scanResult: ScanResult) => {
    if (scanResult.imageUrl?.startsWith('blob:')) {
      pendingUrlRef.current = scanResult.imageUrl;
    }
    mlLogger.logScanComplete(scanResult);
    setResult(scanResult);
    setIsProcessing(false);
  }, []);

  const runScan = useCallback(
    async (file: File) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      lastFileRef.current = file;
      revokePending(); // drop any prior uncommitted result's URL
      
      // If store is in offline mode, proactively skip the backend and preprocess
      if (useAppStore.getState().offlineMode) {
        return fallbackToOffline();
      }

      setIsProcessing(true);
      setError(null);

      await mlLogger.startScan(mode, file);

      try {
        const fileToScan = preprocessRef.current ? await preprocessRef.current(file) : file;
        const inventoryIds = useAppStore.getState().inventory.map(p => p.id || (p as any).paint_id || `${p.brand}-${p.name}`);
        
        const scanResult =
          mode === 'miniature' 
            ? await scanMiniature(fileToScan, controller.signal, inventoryIds) 
            : await scanInspiration(fileToScan, controller.signal, inventoryIds);
            
        if (controller.signal.aborted) return;
        
        completeWith(scanResult);
      } catch (err) {
        if (controller.signal.aborted) return;
        
        if (process.env.NODE_ENV === 'development') console.error('Scan error:', err);
        revokePending(); // failed scan's object URL never reaches the store
        setError(mapScanError(err, mode));
        setIsProcessing(false);
      }
    },
    [mode, revokePending, completeWith]
  );

  const scan = useCallback((file: File) => runScan(file), [runScan]);

  const retry = useCallback(async () => {
    if (lastFileRef.current) await runScan(lastFileRef.current);
  }, [runScan]);

  const fallbackToOffline = useCallback(async () => {
    const file = lastFileRef.current;
    if (!file) return;
    revokePending();
    setIsProcessing(true);
    setError(null);

    try {
      await mlLogger.startScan(mode, file);
      // Dynamically import the offline engine + matcher (keeps them, and the
      // paint DB, out of the main bundle).
      const [{ detectColorsOffline }, { enhanceWithMultiBrandMatches, enhanceWithPaintRecipes }] = await Promise.all([
        import('@/lib/offlineColorDetection'),
        import('@/lib/paintMatcher'),
      ]);
      let scanResult = await detectColorsOffline(file, mode, {
        numColors: mode === 'miniature' ? 6 : 5,
        numPaintMatches: 5,
      });
      scanResult = enhanceWithMultiBrandMatches(scanResult, 3); // analysisSource stays 'local'
      scanResult = enhanceWithPaintRecipes(scanResult);
      completeWith(scanResult);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') console.error('Local fallback error:', err);
      revokePending();
      setError(mapScanError(err, mode));
      setIsProcessing(false);
    }
  }, [mode, revokePending, completeWith]);

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
  // We also abort any pending API requests.
  useEffect(() => () => {
    revokePending();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, [revokePending]);

  return { isProcessing, error, result, scan, retry, fallbackToOffline, reset, markCommitted };
}
