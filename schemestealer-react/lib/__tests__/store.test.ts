/**
 * Zustand store — async race-condition contract.
 *
 * The danger: a user starts a Miniscan, then flips to Inspiration (or vice-versa)
 * before the backend Promise resolves. When the stale result finally lands it must
 * NOT overwrite the UI the user is now looking at. store.ts guards this in
 * setScanResult (lines ~50-58): a result whose `mode` differs from the live
 * `currentMode` is discarded. These tests pin that guard so a refactor can't
 * silently reintroduce cross-flow contamination.
 *
 * mlDataLogger is mocked because it pulls in apiClient, which touches `window` at
 * module load — irrelevant to state logic and unavailable in the node test env.
 */
import { beforeEach, describe, it, expect, vi } from 'vitest';

vi.mock('../mlDataLogger', () => ({
  mlLogger: { logCartAction: vi.fn() },
}));

import { useAppStore } from '../store';
import type { ScanResult, ScanMode } from '../types';

const makeScan = (mode: ScanMode, id = 's1'): ScanResult => ({
  id,
  mode,
  detectedColors: [],
  recommendedPaints: [],
  timestamp: new Date().toISOString(),
});

/** Reset only the data fields (merge, so the action functions survive). */
function resetStore(): void {
  useAppStore.setState({
    currentMode: null,
    currentScan: null,
    scanHistory: [],
    cart: [],
    isScanning: false,
    isLoading: false,
    error: null,
    offlineMode: false,
    preferredBrands: ['all'],
    preferredRegion: 'global',
  });
}

beforeEach(() => {
  resetStore();
  localStorage.clear();
});

describe('Zustand scan-result race guard', () => {
  it('discards a stale result when the user switched modes mid-scan', () => {
    const s = useAppStore.getState();
    s.setMode('miniature');           // user starts a Miniscan
    s.setMode('inspiration');         // …then flips to Inspiration before it resolves
    s.setScanResult(makeScan('miniature', 'stale')); // late miniature result lands

    const after = useAppStore.getState();
    expect(after.currentScan).toBeNull();            // not committed
    expect(after.currentMode).toBe('inspiration');   // UI unchanged
  });

  it('commits a result that matches the current mode', () => {
    const s = useAppStore.getState();
    s.setMode('inspiration');
    s.setScanResult(makeScan('inspiration', 'insp1'));

    const after = useAppStore.getState();
    expect(after.currentScan?.id).toBe('insp1');
    expect(after.currentScan?.mode).toBe('inspiration');
    expect(after.scanHistory).toHaveLength(1);
    expect(after.isScanning).toBe(false);
  });

  it('commits the first scan when no mode is set yet', () => {
    // currentMode === null → guard is bypassed (a cold first scan is allowed).
    useAppStore.getState().setScanResult(makeScan('miniature', 'first'));
    expect(useAppStore.getState().currentScan?.id).toBe('first');
  });

  it('keeps only the result matching the FINAL mode under rapid switching', () => {
    const s = useAppStore.getState();
    s.setMode('miniature');
    s.setMode('inspiration');
    s.setMode('miniature');                              // settles on miniature

    s.setScanResult(makeScan('inspiration', 'late-insp')); // stale → discarded
    expect(useAppStore.getState().currentScan).toBeNull();

    s.setScanResult(makeScan('miniature', 'good-mini'));   // matches → commits
    expect(useAppStore.getState().currentScan?.id).toBe('good-mini');
  });

  it('does not cross-contaminate scanHistory with a discarded result', () => {
    const s = useAppStore.getState();
    s.setMode('inspiration');
    s.setScanResult(makeScan('miniature', 'stale')); // discarded before commit
    expect(useAppStore.getState().scanHistory).toHaveLength(0);
  });

  it('clearCurrentScan resets both the scan and the mode', () => {
    const s = useAppStore.getState();
    s.setMode('miniature');
    s.setScanResult(makeScan('miniature', 'm1'));
    s.clearCurrentScan();

    const after = useAppStore.getState();
    expect(after.currentScan).toBeNull();
    expect(after.currentMode).toBeNull();
  });
});
