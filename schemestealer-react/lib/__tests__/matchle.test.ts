import { describe, it, expect } from 'vitest';
import {
  CANDIDATES_PER_ROUND,
  CLOSE_ENOUGH_DELTA_E,
  MAX_BEST_DELTA_E,
  MAX_DISTRACTOR_DELTA_E,
  MIN_WINNING_MARGIN,
  ROUNDS_PER_GAME,
  buildDailyRounds,
  buildPracticeRound,
  buildShareText,
  dayNumberFor,
  generateShareGrid,
  hashSeed,
  nearestEmojiSquare,
  resultEmoji,
  scoreRound,
  seededRandom,
  targetPool,
  todayISO,
  type MatchleRound,
} from '../matchle';
import { PAINT_DATABASE } from '../paintDatabase';
import { deltaE2000 } from '../deltaE';

const byId = new Map(PAINT_DATABASE.map((p) => [p.paint_id, p]));

/** Consecutive dates from an ISO start, for the property tests. */
function dates(startISO: string, count: number): string[] {
  const out: string[] = [];
  const t0 = Date.parse(startISO + 'T00:00:00Z');
  for (let i = 0; i < count; i++) {
    out.push(new Date(t0 + i * 86_400_000).toISOString().slice(0, 10));
  }
  return out;
}

describe('seededRandom / hashSeed', () => {
  // Intent: everyone must get the same puzzle on the same day. If generation
  // drifted between renders the daily would stop being shared, and the share
  // grid would compare two different games.
  it('is deterministic for a given seed', () => {
    const a = seededRandom(1234);
    const b = seededRandom(1234);
    for (let i = 0; i < 50; i++) expect(a()).toBe(b());
  });

  it('decorrelates adjacent dates', () => {
    expect(hashSeed('2026-08-12')).not.toBe(hashSeed('2026-08-13'));
  });

  it('stays in [0,1)', () => {
    const r = seededRandom(99);
    for (let i = 0; i < 300; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('targetPool', () => {
  // Intent: answers narrow, candidates wide — the asymmetry that makes Wordle
  // feel fair. Swatchle drew answers from all 1,312 paints across six brands,
  // so a Citadel-only painter had no path on an AK day.
  it('is a curated subset, not the whole database', () => {
    const pool = targetPool();
    expect(pool.length).toBeGreaterThan(100);
    expect(pool.length).toBeLessThan(PAINT_DATABASE.length / 2);
  });

  it('resolves every id and excludes metallics', () => {
    for (const p of targetPool()) {
      expect(byId.has(p.paint_id)).toBe(true);
      expect(p.metallic).toBe(false);
    }
  });
});

describe('buildDailyRounds — determinism', () => {
  // Intent: this is the promise the whole daily rests on.
  it('returns identical rounds for the same date', () => {
    expect(buildDailyRounds('2026-08-12')).toEqual(buildDailyRounds('2026-08-12'));
  });

  it('returns different puzzles on different dates', () => {
    const a = buildDailyRounds('2026-08-12').map((r) => r.target.paintId);
    const b = buildDailyRounds('2026-08-13').map((r) => r.target.paintId);
    expect(a).not.toEqual(b);
  });

  it('gives the right shape', () => {
    const rounds = buildDailyRounds('2026-08-12');
    expect(rounds).toHaveLength(ROUNDS_PER_GAME);
    for (const r of rounds) expect(r.candidates).toHaveLength(CANDIDATES_PER_ROUND);
  });

  it('never repeats a target within one game', () => {
    for (const d of dates('2026-08-12', 30)) {
      const ids = buildDailyRounds(d).map((r) => r.target.paintId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

/**
 * The fairness property test.
 *
 * This is the most important test in the file. Swatchle's real defect was not a
 * bug in any one function — every function worked — it was that nothing
 * anywhere asserted the puzzle was *answerable*. A full year is checked because
 * a defect that appears on one day in eighty is exactly the kind that ships.
 */
describe('buildDailyRounds — fairness holds for a full year', () => {
  const YEAR = dates('2026-08-12', 365);

  it('every round is answerable, on every day of a year', () => {
    for (const date of YEAR) {
      const rounds = buildDailyRounds(date);
      expect(rounds, date).toHaveLength(ROUNDS_PER_GAME);

      for (const round of rounds) {
        const target = byId.get(round.target.paintId)!;
        expect(target, `${date}: unresolvable target`).toBeTruthy();

        const answer = round.candidates[round.answerIndex];

        // The declared answer really is the nearest of those shown.
        const sorted = round.candidates.slice().sort((a, b) => a.deltaE - b.deltaE);
        expect(sorted[0].paintId, `${date}: answerIndex is not the nearest`).toBe(answer.paintId);

        // The match is a real match, not the least-bad of a bad set.
        expect(answer.deltaE, `${date}: best ΔE too far`).toBeLessThanOrEqual(MAX_BEST_DELTA_E);

        // It beats the runner-up clearly, so the round is not a coin flip.
        expect(
          sorted[1].deltaE - sorted[0].deltaE,
          `${date}: winning margin too thin`,
        ).toBeGreaterThanOrEqual(MIN_WINNING_MARGIN - 0.05);

        // Every distractor sits in the same colour neighbourhood as the
        // target. THIS is the constraint that makes it a game: without it the
        // generator produced a yellow target against ΔE 0.8 / 25.9 / 26.9 /
        // 35.4, which asks "which of these is yellow", not "which is closest".
        for (const c of round.candidates) {
          expect(c.deltaE, `${date}: distractor outside the neighbourhood`).toBeLessThanOrEqual(
            MAX_DISTRACTOR_DELTA_E + 0.05,
          );
        }

        // It is a cross-brand conversion question: no candidate shares the
        // target's brand, and no two candidates share a brand with each other.
        const brands = round.candidates.map((c) => c.brand);
        expect(brands, `${date}: candidate from the target's own brand`).not.toContain(
          round.target.brand,
        );
        expect(new Set(brands).size, `${date}: duplicate brands`).toBe(brands.length);

        // Distinct paints, none of them the target itself.
        const ids = round.candidates.map((c) => c.paintId);
        expect(new Set(ids).size, `${date}: duplicate candidates`).toBe(ids.length);
        expect(ids, `${date}: target offered as its own candidate`).not.toContain(
          round.target.paintId,
        );

        // Metallics are excluded at both ends: a LAB comparison of two golds is
        // a question the maths cannot honestly answer.
        expect(target.metallic, `${date}: metallic target`).toBe(false);
        for (const c of round.candidates) {
          expect(byId.get(c.paintId)!.metallic, `${date}: metallic candidate`).toBe(false);
        }
      }
    }
  });

  // Intent: the ΔE shown on reveal is the product's own claim about itself. If
  // it disagreed with the engine the game would be teaching the wrong number.
  it('reported ΔEs match deltaE2000 to the displayed precision', () => {
    for (const date of dates('2026-08-12', 40)) {
      for (const round of buildDailyRounds(date)) {
        const target = byId.get(round.target.paintId)!;
        for (const c of round.candidates) {
          const expected = Math.round(deltaE2000(target.lab, byId.get(c.paintId)!.lab) * 10) / 10;
          expect(c.deltaE, `${date} ${c.paintId}`).toBeCloseTo(expected, 5);
        }
      }
    }
  });

  // Intent: the constraints reject targets, and rejecting too many would leave a
  // tiny usable pool repeating every fortnight. An earlier rule demanded the
  // winner beat the next-nearest paint in the WHOLE database, which rejected
  // 76% of the pool and left about 82 targets for 1,825 rounds a year.
  it('draws on a wide spread of targets across a year', () => {
    const seen = new Set<string>();
    for (const date of YEAR) {
      for (const round of buildDailyRounds(date)) seen.add(round.target.paintId);
    }
    expect(seen.size).toBeGreaterThan(150);
  });

  // Intent: a fixed answer position would be learnable in a week and the game
  // would be over.
  it('does not park the answer at one position', () => {
    const counts = new Array(CANDIDATES_PER_ROUND).fill(0);
    for (const date of YEAR) {
      for (const round of buildDailyRounds(date)) counts[round.answerIndex]++;
    }
    const total = counts.reduce((a, b) => a + b, 0);
    for (const c of counts) expect(c / total).toBeGreaterThan(0.15);
  });
});

describe('buildPracticeRound', () => {
  it('is deterministic per seed and varies across seeds', () => {
    expect(buildPracticeRound(7)).toEqual(buildPracticeRound(7));
    expect(buildPracticeRound(7).target.paintId).not.toBe(buildPracticeRound(8).target.paintId);
  });

  // Intent: practice must be the same game as the daily, or practising teaches
  // the wrong instincts.
  it('obeys the same fairness rules', () => {
    for (let seed = 0; seed < 120; seed++) {
      const r = buildPracticeRound(seed * 2654435761);
      const sorted = r.candidates.slice().sort((a, b) => a.deltaE - b.deltaE);
      expect(sorted[0].deltaE).toBeLessThanOrEqual(MAX_BEST_DELTA_E);
      expect(sorted[1].deltaE - sorted[0].deltaE).toBeGreaterThanOrEqual(MIN_WINNING_MARGIN - 0.05);
      expect(r.candidates).toHaveLength(CANDIDATES_PER_ROUND);
    }
  });
});

describe('scoring', () => {
  const round: MatchleRound = {
    target: { paintId: 't', name: 'T', brand: 'Citadel', hex: '#ff0000' },
    candidates: [
      { paintId: 'a', name: 'A', brand: 'Vallejo', hex: '#ff0000', deltaE: 1.0 },
      { paintId: 'b', name: 'B', brand: 'AK', hex: '#ee0000', deltaE: 2.2 },
      { paintId: 'c', name: 'C', brand: 'Pro Acryl', hex: '#cc0000', deltaE: 8.0 },
      { paintId: 'd', name: 'D', brand: 'Two Thin Coats', hex: '#990000', deltaE: 14.0 },
    ],
    answerIndex: 0,
  };

  it('costs nothing when correct', () => {
    expect(scoreRound(round, 0)).toEqual({ pickedIndex: 0, correct: true, cost: 0 });
  });

  // Intent: cost is what makes a near-miss feel different from a blunder, and
  // it is the tiebreak between two players on the same hits.
  it('charges the gap to the best available, not the raw ΔE', () => {
    expect(scoreRound(round, 1).cost).toBeCloseTo(1.2, 5);
    expect(scoreRound(round, 3).cost).toBeCloseTo(13, 5);
  });
});

describe('share', () => {
  // Intent: Swatchle's grid was directional arrows carrying variation
  // selectors — they misalign across clients — and contained no colour at all,
  // in a game about colour.
  it('has no arrows or variation selectors', () => {
    const rounds = buildDailyRounds('2026-08-12');
    const results = rounds.map((r) => scoreRound(r, r.answerIndex));
    const grid = generateShareGrid(rounds, results);
    expect(grid).not.toMatch(/\u{FE0F}/u);
    expect(grid).not.toMatch(/[➡⬅🔼🔽]/u);
  });

  it('is two rows of one square per round', () => {
    const rounds = buildDailyRounds('2026-08-12');
    const results = rounds.map((r) => scoreRound(r, 0));
    const [colours, marks] = generateShareGrid(rounds, results).split('\n');
    expect(Array.from(colours)).toHaveLength(ROUNDS_PER_GAME);
    expect(Array.from(marks)).toHaveLength(ROUNDS_PER_GAME);
  });

  it('distinguishes correct, close and wrong', () => {
    expect(resultEmoji({ pickedIndex: 0, correct: true, cost: 0 })).toBe('🟩');
    expect(resultEmoji({ pickedIndex: 1, correct: false, cost: CLOSE_ENOUGH_DELTA_E - 0.1 })).toBe('🟨');
    expect(resultEmoji({ pickedIndex: 2, correct: false, cost: 9 })).toBe('🟥');
  });

  it('maps hexes to sensible squares', () => {
    expect(nearestEmojiSquare('#dd2e44')).toBe('🟥');
    expect(nearestEmojiSquare('#55acee')).toBe('🟦');
    expect(nearestEmojiSquare('#000000')).toBe('⬛');
    expect(nearestEmojiSquare('#ffffff')).toBe('⬜');
  });

  it('builds share text with the score, the link and no answers', () => {
    const rounds = buildDailyRounds('2026-08-12');
    const results = rounds.map((r) => scoreRound(r, r.answerIndex));
    const text = buildShareText({ dayNumber: 3, rounds, results, streak: 4 });
    expect(text).toContain('Matchle #3');
    expect(text).toContain(`5/${ROUNDS_PER_GAME}`);
    expect(text).toContain('🔥4');
    expect(text).toContain('https://schemestealer.com/daily');
    // Intent: the grid is spoiler-free — no paint names in the shared text.
    for (const r of rounds) expect(text).not.toContain(r.target.name);
  });

  it('omits the streak flame at a streak of one', () => {
    const rounds = buildDailyRounds('2026-08-12');
    const results = rounds.map((r) => scoreRound(r, 0));
    expect(buildShareText({ dayNumber: 1, rounds, results, streak: 1 })).not.toContain('🔥');
  });
});

describe('day numbering', () => {
  // Intent: Swatchle's day number was an index into a 400-entry file, so it
  // froze at 400 and the puzzle silently repeated forever. This is arithmetic
  // on a fixed epoch and cannot run out.
  it('counts from the epoch and never runs out', () => {
    expect(dayNumberFor('2026-08-12')).toBe(1);
    expect(dayNumberFor('2026-08-13')).toBe(2);
    expect(dayNumberFor('2030-08-12')).toBeGreaterThan(1400);
  });

  it('clamps before the epoch rather than going negative', () => {
    expect(dayNumberFor('2020-01-01')).toBe(1);
  });

  it('todayISO is a local YYYY-MM-DD', () => {
    expect(todayISO(new Date(2026, 7, 12, 23, 30))).toBe('2026-08-12');
  });
});
