import { describe, it, expect } from 'vitest';
import { formatModelProgress } from '../utils';

// The onProgress callback in prepareMiniatureImage emits 0-100 integers (then null
// when the download finishes). The UI previously multiplied by 100 and showed up to
// "10000%" on a first-ever scan — these tests pin the unit contract.
describe('formatModelProgress', () => {
  it('returns null when no download is in flight', () => {
    expect(formatModelProgress(null)).toBeNull();
    expect(formatModelProgress(undefined)).toBeNull();
    expect(formatModelProgress(NaN)).toBeNull();
  });

  it('renders 0% at download start (falsy zero must still render)', () => {
    expect(formatModelProgress(0)).toBe('DOWNLOADING PATTERNS... 0%');
  });

  it('renders whole percentages as-is', () => {
    expect(formatModelProgress(42)).toBe('DOWNLOADING PATTERNS... 42%');
    expect(formatModelProgress(100)).toBe('DOWNLOADING PATTERNS... 100%');
  });

  it('rounds fractional percentages', () => {
    expect(formatModelProgress(99.6)).toBe('DOWNLOADING PATTERNS... 100%');
  });

  it('clamps out-of-range values', () => {
    expect(formatModelProgress(150)).toBe('DOWNLOADING PATTERNS... 100%');
    expect(formatModelProgress(-5)).toBe('DOWNLOADING PATTERNS... 0%');
  });
});
