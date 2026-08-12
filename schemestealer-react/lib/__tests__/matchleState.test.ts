import { describe, it, expect } from 'vitest';
import {
  completeGame,
  emptyState,
  hasPlayedToday,
  loadState,
  previousDay,
  MATCHLE_STORAGE_KEY,
} from '../matchleState';
import { ROUNDS_PER_GAME, type MatchleResult } from '../matchle';

const hit = (): MatchleResult => ({ pickedIndex: 0, correct: true, cost: 0 });
const miss = (cost: number): MatchleResult => ({ pickedIndex: 1, correct: false, cost });

describe('storage key', () => {
  // Intent: `schemestealer-daily-augury` is a declared frozen key holding
  // Swatchle's shape. Reusing it would hide an incompatible object behind a
  // frozen contract.
  it('is not Swatchle\'s frozen key', () => {
    expect(MATCHLE_STORAGE_KEY).not.toBe('schemestealer-daily-augury');
  });
});

describe('loadState', () => {
  it('returns a playable board from nothing', () => {
    const s = loadState(null, '2026-08-12');
    expect(s.status).toBe('playing');
    expect(s.results).toEqual([]);
    expect(s.hitDistribution).toHaveLength(ROUNDS_PER_GAME + 1);
  });

  // Intent: this page is a TikTok landing target. A corrupt or foreign blob
  // must yield a playable board, never a crash.
  it('survives junk, and survives leftover Swatchle state', () => {
    expect(loadState('not json at all', '2026-08-12').status).toBe('playing');
    const swatchle = JSON.stringify({
      guesses: [{ paint_id: 'x' }],
      status: 'won',
      lastPlayedDate: '2026-08-12',
      streak: 4,
      guessDistribution: [0, 0, 1, 0, 0, 0],
    });
    const s = loadState(swatchle, '2026-08-12');
    expect(s.status).toBe('playing');
    expect(s.results).toEqual([]);
    // A six-slot Swatchle distribution must not be adopted as a six-slot
    // Matchle one — they mean different things and are different lengths.
    expect(s.hitDistribution).toHaveLength(ROUNDS_PER_GAME + 1);
  });

  it('resumes a half-finished game on the same day', () => {
    const saved = JSON.stringify({
      ...emptyState('2026-08-12'),
      results: [hit(), miss(2)],
    });
    const s = loadState(saved, '2026-08-12');
    expect(s.results).toHaveLength(2);
    expect(s.status).toBe('playing');
  });

  it('clears the board on a new day', () => {
    const saved = JSON.stringify(completeGame(emptyState('2026-08-12'), [hit()]));
    const s = loadState(saved, '2026-08-13');
    expect(s.results).toEqual([]);
    expect(s.status).toBe('playing');
  });

  // Intent: the streak is the retention mechanic; both directions matter.
  it('keeps the streak when yesterday was played, drops it after a gap', () => {
    const played = completeGame(emptyState('2026-08-12'), [hit()]);
    expect(played.streak).toBe(1);
    expect(loadState(JSON.stringify(played), '2026-08-13').streak).toBe(1);
    expect(loadState(JSON.stringify(played), '2026-08-15').streak).toBe(0);
  });

  it('carries lifetime totals across the rollover', () => {
    const played = completeGame(emptyState('2026-08-12'), [hit(), hit(), miss(3)]);
    const next = loadState(JSON.stringify(played), '2026-08-13');
    expect(next.played).toBe(1);
    expect(next.maxStreak).toBe(1);
    expect(next.hitDistribution[2]).toBe(1);
  });
});

describe('previousDay', () => {
  it('steps back across month and year boundaries', () => {
    expect(previousDay('2026-08-01')).toBe('2026-07-31');
    expect(previousDay('2027-01-01')).toBe('2026-12-31');
  });
});

describe('completeGame', () => {
  const results = [hit(), hit(), miss(2.5), hit(), miss(0.5)];

  // Intent: Swatchle mutated `guessDistribution` in place on the array still
  // referenced by state — fine today, fragile under strict mode, and untestable
  // where it lived.
  it('does not mutate the state it was given', () => {
    const before = emptyState('2026-08-12');
    const snapshot = JSON.parse(JSON.stringify(before));
    completeGame(before, results);
    expect(before).toEqual(snapshot);
  });

  it('records hits, cost and the distribution', () => {
    const s = completeGame(emptyState('2026-08-12'), results);
    expect(s.status).toBe('complete');
    expect(s.played).toBe(1);
    expect(s.hitDistribution[3]).toBe(1);
    expect(s.bestCost).toBeCloseTo(3, 5);
  });

  it('keeps the best cost, not the latest', () => {
    let s = completeGame(emptyState('2026-08-12'), [miss(9)]);
    s = completeGame({ ...s, status: 'playing' }, [miss(2)]);
    expect(s.bestCost).toBeCloseTo(2, 5);
    s = completeGame({ ...s, status: 'playing' }, [miss(7)]);
    expect(s.bestCost).toBeCloseTo(2, 5);
  });

  // Intent, and a deliberate design choice: Matchle has NO losing condition.
  // Finishing is the habit worth rewarding; hits and ΔE cost express skill.
  // Breaking a streak on a 3/5 would reintroduce the anxiety that made
  // Swatchle's wide answer pool feel unfair.
  it('advances the streak on completion regardless of score', () => {
    const bad = completeGame(emptyState('2026-08-12'), [miss(12), miss(9), miss(14)]);
    expect(bad.streak).toBe(1);
    expect(bad.maxStreak).toBe(1);
  });

  it('counts a perfect game separately', () => {
    const perfect = new Array(ROUNDS_PER_GAME).fill(null).map(hit);
    const s = completeGame(emptyState('2026-08-12'), perfect);
    expect(s.perfect).toBe(1);
    expect(s.hitDistribution[ROUNDS_PER_GAME]).toBe(1);
  });
});

describe('hasPlayedToday', () => {
  it('is true only for a completed game today', () => {
    const done = JSON.stringify(completeGame(emptyState('2026-08-12'), [hit()]));
    expect(hasPlayedToday(done, '2026-08-12')).toBe(true);
    expect(hasPlayedToday(done, '2026-08-13')).toBe(false);
    expect(hasPlayedToday(JSON.stringify(emptyState('2026-08-12')), '2026-08-12')).toBe(false);
    expect(hasPlayedToday(null, '2026-08-12')).toBe(false);
    expect(hasPlayedToday('{{{', '2026-08-12')).toBe(false);
  });
});
