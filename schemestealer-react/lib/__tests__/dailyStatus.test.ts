import { describe, it, expect } from 'vitest';
import { formatTimeToMidnight } from '../dailyStatus';

describe('formatTimeToMidnight', () => {
  it('counts the final seconds before midnight', () => {
    expect(formatTimeToMidnight(new Date('2026-06-15T23:59:30'))).toBe('00:00:30');
  });

  it('zero-pads all fields at midday', () => {
    expect(formatTimeToMidnight(new Date('2026-06-15T12:30:15'))).toBe('11:29:45');
  });

  it('documents the exact-midnight quirk: a full day remains', () => {
    // At the exact stroke of midnight the next reset is 24h away — the display
    // shows 24:00:00 for that instant rather than 00:00:00.
    expect(formatTimeToMidnight(new Date('2026-06-15T00:00:00'))).toBe('24:00:00');
  });
});
