/**
 * Matchle's persisted state — separated from the component so the rollover and
 * streak rules can be tested without rendering anything.
 *
 * Swatchle kept this logic inline in its component, which is why a subtle
 * mutation bug (`guessDistribution[i] += 1` on the array still referenced by
 * state) sat there unnoticed: there was nowhere to test it from.
 */

import { ROUNDS_PER_GAME, todayISO, type MatchleResult } from './matchle';

/**
 * A NEW key, not Swatchle's.
 *
 * `schemestealer-daily-augury` is a declared frozen key, and Matchle's shape is
 * incompatible with what is stored behind it. Reusing the name would hide a
 * different object behind a frozen contract; a new key plus a documented
 * invariant update is the honest version. Existing Swatchle streaks end, which
 * is correct — they measure a game that no longer exists.
 */
export const MATCHLE_STORAGE_KEY = 'schemestealer-matchle';
export const MATCHLE_HELP_KEY = 'schemestealer-matchle-help-seen';

export interface MatchleState {
  /** The day this state describes, as a local YYYY-MM-DD. */
  lastPlayedDate: string;
  /** One entry per completed round; length is also the current round index. */
  results: MatchleResult[];
  status: 'playing' | 'complete';
  streak: number;
  maxStreak: number;
  played: number;
  /** Games where every round was correct. */
  perfect: number;
  /** Index is hits (0..ROUNDS_PER_GAME), value is how many games scored that. */
  hitDistribution: number[];
  /** Lowest ΔE cost ever achieved on a completed daily; null until one lands. */
  bestCost: number | null;
}

export function emptyState(today = todayISO()): MatchleState {
  return {
    lastPlayedDate: today,
    results: [],
    status: 'playing',
    streak: 0,
    maxStreak: 0,
    played: 0,
    perfect: 0,
    hitDistribution: new Array(ROUNDS_PER_GAME + 1).fill(0),
    bestCost: null,
  };
}

/** Yesterday, in the same local-calendar terms as `todayISO`. */
export function previousDay(todayStr: string): string {
  const d = new Date(todayStr + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
}

/**
 * Load persisted state, rolling over to a fresh board when the day has changed.
 *
 * Tolerant of anything unparseable or shaped wrong, including a leftover
 * Swatchle object if the key is ever reused: a corrupt blob must give the
 * player a playable board, never a crash on a page they arrived at from TikTok.
 */
export function loadState(raw: string | null, today = todayISO()): MatchleState {
  let parsed: Partial<MatchleState> | null = null;
  try {
    parsed = raw ? (JSON.parse(raw) as Partial<MatchleState>) : null;
  } catch {
    parsed = null;
  }

  const base = emptyState(today);
  if (!parsed || typeof parsed !== 'object') return base;

  const carried: MatchleState = {
    ...base,
    streak: Number.isFinite(parsed.streak) ? (parsed.streak as number) : 0,
    maxStreak: Number.isFinite(parsed.maxStreak) ? (parsed.maxStreak as number) : 0,
    played: Number.isFinite(parsed.played) ? (parsed.played as number) : 0,
    perfect: Number.isFinite(parsed.perfect) ? (parsed.perfect as number) : 0,
    hitDistribution:
      Array.isArray(parsed.hitDistribution) && parsed.hitDistribution.length === ROUNDS_PER_GAME + 1
        ? (parsed.hitDistribution as number[])
        : base.hitDistribution,
    bestCost: typeof parsed.bestCost === 'number' ? parsed.bestCost : null,
    lastPlayedDate: typeof parsed.lastPlayedDate === 'string' ? parsed.lastPlayedDate : today,
  };

  // Same day: resume exactly where they left off, mid-game included.
  if (carried.lastPlayedDate === today) {
    return {
      ...carried,
      results: Array.isArray(parsed.results) ? (parsed.results as MatchleResult[]) : [],
      status: parsed.status === 'complete' ? 'complete' : 'playing',
    };
  }

  // A new day. The streak survives only if the last game was yesterday.
  return {
    ...carried,
    lastPlayedDate: today,
    results: [],
    status: 'playing',
    streak: carried.lastPlayedDate === previousDay(today) ? carried.streak : 0,
  };
}

/**
 * Fold a finished game into the running record.
 *
 * Returns a NEW object throughout — `hitDistribution` is rebuilt rather than
 * incremented in place, which is the mutation bug Swatchle shipped.
 *
 * Note the streak advances on COMPLETION, not on a perfect score. Matchle has
 * no losing condition by design: finishing five rounds is the habit worth
 * rewarding, and the hits and ΔE cost are what express skill. Punishing a 3/5
 * with a broken streak would reintroduce exactly the anxiety that made
 * Swatchle's wide answer pool feel unfair.
 */
export function completeGame(state: MatchleState, results: MatchleResult[]): MatchleState {
  const hits = results.filter((r) => r.correct).length;
  const cost = Math.round(results.reduce((s, r) => s + r.cost, 0) * 10) / 10;

  const hitDistribution = state.hitDistribution.slice();
  hitDistribution[Math.min(hits, ROUNDS_PER_GAME)] += 1;

  const streak = state.streak + 1;
  return {
    ...state,
    results,
    status: 'complete',
    played: state.played + 1,
    perfect: state.perfect + (hits === ROUNDS_PER_GAME ? 1 : 0),
    streak,
    maxStreak: Math.max(state.maxStreak, streak),
    hitDistribution,
    bestCost: state.bestCost === null ? cost : Math.min(state.bestCost, cost),
  };
}

/** Whether today's daily is already finished — drives the home-screen badge. */
export function hasPlayedToday(raw: string | null, today = todayISO()): boolean {
  try {
    const parsed = raw ? JSON.parse(raw) : null;
    return !!parsed && parsed.lastPlayedDate === today && parsed.status === 'complete';
  } catch {
    return false;
  }
}
