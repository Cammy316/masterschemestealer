/**
 * Matchle — the daily "which of these is the closest match?" game.
 *
 * Replaces Swatchle, which was a recall quiz wearing a deduction puzzle's
 * clothes: it showed you the target swatch, then spent six guesses quantifying
 * what your eyes had already told you. The hard part was remembering which of
 * 1,312 pot names mapped to a colour, and no clue narrowed the NAME space, so
 * there was no convergence and a loss felt arbitrary rather than close.
 *
 * Matchle asks the question the product actually answers: given this paint,
 * which of these four from other brands is the nearest match? One tap, no
 * typing, no recall — and a wrong answer still teaches you a number.
 *
 * ---
 *
 * THERE IS NO PUZZLE FILE, AND THAT IS THE POINT.
 *
 * Swatchle shipped 400 days of answers inside the client bundle, readable in
 * about thirty seconds. Matchle cannot be spoiled: all four candidate hexes are
 * on screen and CIEDE2000 is public maths, so the answer is computable from
 * what the player can already see. That IS the game.
 *
 * So rounds are generated deterministically from the date. Same day, same
 * rounds, everywhere — without shipping a secret, and without the file running
 * out (Swatchle silently repeated its last puzzle forever once the 400 days
 * elapsed, so everyone kept "winning" a stale answer with an intact streak).
 *
 * This module is deliberately free of React and DOM so the fairness rules below
 * can be property-tested across a full year in milliseconds.
 */

import { PAINT_DATABASE, type PaintData } from './paintDatabase';
import { deltaE2000 } from './deltaE';
import MATCHLE_POOL from './data/matchle_pool.json';

/** Changing this reshuffles every future day. Treat as frozen once live. */
const MATCHLE_SALT = 'SCHEMESTEALER_MATCHLE_V1';

/** Rounds per daily. Five gives a score with real spread and a share grid that
 *  tells a story, in about a minute. */
export const ROUNDS_PER_GAME = 5;
/** Candidates shown per round. */
export const CANDIDATES_PER_ROUND = 4;

/**
 * Fairness constraints. These are the whole reason Matchle should feel fair
 * where Swatchle did not, so they are enforced at generation and asserted in
 * the tests rather than left to chance.
 */
/** The true nearest candidate must actually BE a match, not the least-bad of a
 *  bad set. */
export const MAX_BEST_DELTA_E = 6;
/** The winner must be discernibly better than the nearest DISTRACTOR, or the
 *  round is a coin flip dressed as a question — which is exactly the complaint
 *  Swatchle earned by drawing answers from all six brands at once. */
export const MIN_WINNING_MARGIN = 1.5;
/**
 * How far a distractor may sit from the target.
 *
 * This is the single number that decides whether the game is interesting.
 * Without it, distractors were drawn from the whole database and came back as
 * unrelated colours — a real generated round offered a yellow target against
 * ΔE 0.8 / 25.9 / 26.9 / 35.4, which is not "which is closest" but "which of
 * these four is yellow". Every candidate now has to be in the same colour
 * neighbourhood, so the eye has to work and the answer is arguable.
 */
export const MAX_DISTRACTOR_DELTA_E = 14;
/** A pick within this of the best counts as "close" on the share grid. Being
 *  nearly right should look different from being wrong. */
export const CLOSE_ENOUGH_DELTA_E = 1.5;

export interface MatchleCandidate {
  paintId: string;
  name: string;
  brand: string;
  hex: string;
  /** Distance from the target. Never hidden — it is revealed on tap. */
  deltaE: number;
}

export interface MatchleRound {
  target: { paintId: string; name: string; brand: string; hex: string };
  /** Presentation order is already shuffled; index 0 is not the answer. */
  candidates: MatchleCandidate[];
  /** Index into `candidates` of the true nearest. */
  answerIndex: number;
}

export interface MatchleResult {
  /** Which candidate the player tapped. */
  pickedIndex: number;
  correct: boolean;
  /** How much worse the pick was than the best available, in ΔE. 0 when correct. */
  cost: number;
}

// ---- deterministic randomness -----------------------------------------------

/** FNV-1a. Small, dependency-free, and good enough to decorrelate adjacent
 *  dates — which is all that is needed to stop consecutive days rhyming. */
export function hashSeed(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** mulberry32 — the same generator the audio engine uses, for the same reason:
 *  a game that regenerated differently on each render would break the "everyone
 *  gets the same puzzle" promise the daily is built on. */
export function seededRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- eligibility -------------------------------------------------------------

/**
 * Metallics are excluded from both ends.
 *
 * A LAB comparison of two metallics is close to meaningless — the flake, not
 * the pigment, is what the eye reads — so asking which of two golds is nearer
 * would be a question the maths cannot honestly answer.
 */
function isComparable(p: PaintData): boolean {
  return !p.metallic && p.matchable !== false;
}

let _byId: Map<string, PaintData> | null = null;
function paintsById(): Map<string, PaintData> {
  if (!_byId) _byId = new Map(PAINT_DATABASE.map((p) => [p.paint_id, p]));
  return _byId;
}

let _targets: PaintData[] | null = null;
/** The curated target pool, resolved and filtered. Answers narrow, candidates
 *  wide — the asymmetry Wordle uses to stay fair. */
export function targetPool(): PaintData[] {
  if (!_targets) {
    const byId = paintsById();
    _targets = (MATCHLE_POOL as string[])
      .map((id) => byId.get(id))
      .filter((p): p is PaintData => !!p && isComparable(p));
  }
  return _targets;
}

let _candidates: PaintData[] | null = null;
/** Everything comparable, for candidates. Wider than the target pool on
 *  purpose. */
function candidatePool(): PaintData[] {
  if (!_candidates) _candidates = PAINT_DATABASE.filter(isComparable);
  return _candidates;
}

// ---- round construction ------------------------------------------------------

function shuffle<T>(items: T[], rnd: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Try to build one valid round from a target. Returns null when the target
 * cannot produce a fair question — the caller reseeds and picks another.
 *
 * Failing is normal and expected: plenty of paints have no close cross-brand
 * neighbour, or have two equally close ones. Rejecting those is the mechanism
 * that makes every shipped round answerable.
 */
function tryBuildRound(target: PaintData, rnd: () => number): MatchleRound | null {
  const others = candidatePool().filter(
    (p) => p.brand !== target.brand && p.paint_id !== target.paint_id,
  );
  if (others.length < CANDIDATES_PER_ROUND) return null;

  const scored = others
    .map((p) => ({ paint: p, deltaE: deltaE2000(target.lab, p.lab) }))
    .sort((a, b) => a.deltaE - b.deltaE);

  const best = scored[0];
  if (best.deltaE > MAX_BEST_DELTA_E) return null;

  /**
   * Distractors have to be TEMPTING, which means near the target — but clearly
   * beaten by the winner. The window is what makes the round a question:
   * everything on screen is the same sort of colour, and only one is actually
   * the match.
   *
   * The separation is required against the shown distractors rather than
   * against the next-nearest paint in the whole database. The question asked is
   * "which of THESE four", so a closer paint that is not on screen does not
   * make the round unfair — and demanding a global margin rejected 76% of the
   * curated pool, which would have left about 82 usable targets repeating
   * roughly twice a month.
   */
  const eligible = scored.filter(
    (e) =>
      e.paint.paint_id !== best.paint.paint_id &&
      e.deltaE - best.deltaE >= MIN_WINNING_MARGIN &&
      e.deltaE <= MAX_DISTRACTOR_DELTA_E,
  );

  // One brand each, so the round reads as a real cross-brand conversion.
  const pickedBrands = new Set<string>([best.paint.brand]);
  const distractors: typeof scored = [];
  for (const entry of shuffle(eligible, rnd)) {
    if (distractors.length >= CANDIDATES_PER_ROUND - 1) break;
    if (pickedBrands.has(entry.paint.brand)) continue;
    pickedBrands.add(entry.paint.brand);
    distractors.push(entry);
  }
  if (distractors.length < CANDIDATES_PER_ROUND - 1) return null;

  const chosen = shuffle([best, ...distractors], rnd);
  const answerIndex = chosen.findIndex((c) => c.paint.paint_id === best.paint.paint_id);

  return {
    target: {
      paintId: target.paint_id,
      name: target.name,
      brand: target.brand,
      hex: target.hex,
    },
    candidates: chosen.map((c) => ({
      paintId: c.paint.paint_id,
      name: c.paint.name,
      brand: c.paint.brand,
      hex: c.paint.hex,
      deltaE: Math.round(c.deltaE * 10) / 10,
    })),
    answerIndex,
  };
}

/** Build one round from a seed, retrying with fresh targets until the fairness
 *  rules hold. */
export function buildRound(seed: number): MatchleRound {
  const pool = targetPool();
  for (let attempt = 0; attempt < 200; attempt++) {
    const rnd = seededRandom(seed + attempt * 0x9e3779b9);
    const target = pool[Math.floor(rnd() * pool.length)];
    const round = target ? tryBuildRound(target, rnd) : null;
    if (round) return round;
  }
  // Unreachable in practice — the pool is 379 paints and most have a close
  // cross-brand neighbour. Throwing beats returning an unfair round silently.
  throw new Error('matchle: could not build a fair round');
}

/** The day's five rounds. Deterministic in `dateISO` (YYYY-MM-DD), with no
 *  repeated target inside a single game. */
export function buildDailyRounds(dateISO: string): MatchleRound[] {
  const base = hashSeed(dateISO + MATCHLE_SALT);
  const rounds: MatchleRound[] = [];
  const used = new Set<string>();
  let salt = 0;
  while (rounds.length < ROUNDS_PER_GAME) {
    const round = buildRound(base + salt * 7919 + rounds.length * 104729);
    salt++;
    if (used.has(round.target.paintId)) continue;
    used.add(round.target.paintId);
    rounds.push(round);
    if (salt > 500) break; // defensive; never hit with a 379-paint pool
  }
  return rounds;
}

/** A practice round from an arbitrary seed — unlimited play from the same
 *  generator, so practice is never a different game from the daily. */
export function buildPracticeRound(seed: number): MatchleRound {
  return buildRound(seed >>> 0);
}

// ---- scoring -----------------------------------------------------------------

export function scoreRound(round: MatchleRound, pickedIndex: number): MatchleResult {
  const best = round.candidates[round.answerIndex].deltaE;
  const picked = round.candidates[pickedIndex].deltaE;
  return {
    pickedIndex,
    correct: pickedIndex === round.answerIndex,
    cost: Math.round((picked - best) * 10) / 10,
  };
}

export interface MatchleScore {
  hits: number;
  /** Total ΔE given away. Lower is better; it is the tiebreak between two
   *  players on the same hits, and the reason a near-miss is worth caring
   *  about. */
  cost: number;
}

export function totalScore(results: MatchleResult[]): MatchleScore {
  return {
    hits: results.filter((r) => r.correct).length,
    cost: Math.round(results.reduce((sum, r) => sum + r.cost, 0) * 10) / 10,
  };
}

// ---- share -------------------------------------------------------------------

/**
 * The nine emoji squares, with the approximate sRGB each renders as.
 *
 * Swatchle's share grid was directional arrows — which carry variation
 * selectors and so misalign across clients — and contained no colour at all,
 * in a game about colour. Mapping each target to its nearest square puts the
 * palette itself in the post, so somebody scrolling past sees a colour puzzle
 * without reading a word.
 */
const EMOJI_SQUARES: { emoji: string; rgb: [number, number, number] }[] = [
  { emoji: '🟥', rgb: [221, 46, 68] },
  { emoji: '🟧', rgb: [244, 144, 12] },
  { emoji: '🟨', rgb: [253, 203, 88] },
  { emoji: '🟩', rgb: [120, 177, 89] },
  { emoji: '🟦', rgb: [85, 172, 238] },
  { emoji: '🟪', rgb: [170, 142, 214] },
  { emoji: '🟫', rgb: [153, 106, 68] },
  { emoji: '⬛', rgb: [49, 55, 61] },
  { emoji: '⬜', rgb: [230, 231, 232] },
];

function hexToRgbTriple(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return Number.isFinite(n) ? [(n >> 16) & 255, (n >> 8) & 255, n & 255] : [0, 0, 0];
}

/** Nearest emoji square to a hex. Plain squared-RGB distance: this is a
 *  nine-way bucketing for a chat message, not a colour-accuracy claim, and the
 *  project keeps CIEDE2000 for the places where the number is load-bearing. */
export function nearestEmojiSquare(hex: string): string {
  const [r, g, b] = hexToRgbTriple(hex);
  let bestEmoji = EMOJI_SQUARES[0].emoji;
  let bestDist = Infinity;
  for (const sq of EMOJI_SQUARES) {
    const d = (r - sq.rgb[0]) ** 2 + (g - sq.rgb[1]) ** 2 + (b - sq.rgb[2]) ** 2;
    if (d < bestDist) {
      bestDist = d;
      bestEmoji = sq.emoji;
    }
  }
  return bestEmoji;
}

export function resultEmoji(result: MatchleResult): string {
  if (result.correct) return '🟩';
  return result.cost <= CLOSE_ENOUGH_DELTA_E ? '🟨' : '🟥';
}

/** Two rows: the palette that was asked about, then how it went. */
export function generateShareGrid(rounds: MatchleRound[], results: MatchleResult[]): string {
  const colours = rounds.map((r) => nearestEmojiSquare(r.target.hex)).join('');
  const marks = results.map(resultEmoji).join('');
  return `${colours}\n${marks}`;
}

export function buildShareText(opts: {
  dayNumber: number;
  rounds: MatchleRound[];
  results: MatchleResult[];
  streak: number;
}): string {
  const { hits, cost } = totalScore(opts.results);
  const streak = opts.streak > 1 ? `  🔥${opts.streak}` : '';
  return (
    // "cost" earns its word: a bare "ΔE 32.8" next to "1/5" reads like a score,
    // and a reader who does not already know the game would take the big number
    // for a good one. Lower is better, and the label is what says so.
    `Matchle #${opts.dayNumber}  ${hits}/${ROUNDS_PER_GAME}  ΔE cost ${cost.toFixed(1)}${streak}\n\n` +
    `${generateShareGrid(opts.rounds, opts.results)}\n` +
    `https://schemestealer.com/daily`
  );
}

// ---- day numbering -----------------------------------------------------------

/** Matchle #1. Fixed so the number is stable forever rather than depending on
 *  the length of a puzzle file. */
export const MATCHLE_EPOCH = '2026-08-12';

export function dayNumberFor(dateISO: string): number {
  const start = Date.parse(MATCHLE_EPOCH + 'T00:00:00Z');
  const day = Date.parse(dateISO + 'T00:00:00Z');
  if (!Number.isFinite(start) || !Number.isFinite(day)) return 1;
  return Math.max(1, Math.floor((day - start) / 86_400_000) + 1);
}

/** Local calendar date as YYYY-MM-DD. `en-CA` yields exactly that format, and
 *  the daily must roll over on the player's midnight, not UTC's. */
export function todayISO(now: Date = new Date()): string {
  return now.toLocaleDateString('en-CA');
}
