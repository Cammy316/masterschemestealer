import { describe, it, expect } from 'vitest';
import { hasPlayedToday, formatTimeToMidnight } from '../dailyStatus';

const TODAY = '2026-06-15';
const YESTERDAY = '2026-06-14';

// hasPlayedToday gates the home screen's Swatchle badge (LIVE vs SOLVED ✓) —
// a wrong answer either nags players who already solved today's puzzle or
// hides the call-to-action from those who haven't.
describe('hasPlayedToday', () => {
  it('returns false when nothing is stored', () => {
    expect(hasPlayedToday(null, TODAY)).toBe(false);
  });

  it('returns false for malformed JSON instead of throwing', () => {
    expect(hasPlayedToday('{not json', TODAY)).toBe(false);
  });

  it('returns true when today ended in a win', () => {
    expect(hasPlayedToday(JSON.stringify({ lastPlayedDate: TODAY, status: 'won' }), TODAY)).toBe(true);
  });

  it('returns true when today ended in a loss (played is played)', () => {
    expect(hasPlayedToday(JSON.stringify({ lastPlayedDate: TODAY, status: 'lost' }), TODAY)).toBe(true);
  });

  it('returns false while today\'s game is still in progress', () => {
    expect(hasPlayedToday(JSON.stringify({ lastPlayedDate: TODAY, status: 'playing' }), TODAY)).toBe(false);
  });

  it('returns false when the finished game was yesterday\'s', () => {
    expect(hasPlayedToday(JSON.stringify({ lastPlayedDate: YESTERDAY, status: 'won' }), TODAY)).toBe(false);
  });
});

// Drives the NEXT SWATCHLE IN countdown on the completion card and StatsModal.
// Mid-June dates avoid DST transitions skewing the midnight maths.
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
