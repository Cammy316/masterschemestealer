'use client';

/**
 * Matchle — five one-tap rounds of "which of these is the closest match?".
 *
 * Replaces Swatchle. The old game asked you to recall which of 1,312 pot names
 * matched a swatch and typed guesses into a combobox; this one asks the question
 * the product actually answers, in one tap, with the ΔE revealed either way.
 *
 * Deliberately absent: a text input (there is nothing to type), a losing
 * condition (finishing is the habit; hits and ΔE cost express skill), and a
 * puzzle file (rounds are generated from the date — see lib/matchle.ts).
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CLOSE_ENOUGH_DELTA_E,
  ROUNDS_PER_GAME,
  buildDailyRounds,
  buildPracticeRound,
  buildShareText,
  dayNumberFor,
  scoreRound,
  todayISO,
  totalScore,
  type MatchleRound,
} from '@/lib/matchle';
import {
  MATCHLE_HELP_KEY,
  MATCHLE_STORAGE_KEY,
  completeGame,
  emptyState,
  loadState,
  type MatchleState,
} from '@/lib/matchleState';
import { analytics } from '@/lib/analytics';
import { HowToPlayModal } from './HowToPlayModal';
import { StatsModal } from './StatsModal';

type Mode = 'daily' | 'practice';

export function MatchleGame() {
  const [today, setToday] = useState<string | null>(null);
  const [state, setState] = useState<MatchleState | null>(null);
  const [mode, setMode] = useState<Mode>('daily');
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [startedSent, setStartedSent] = useState(false);
  /**
   * The current round's pick, held BEFORE it is committed.
   *
   * The reveal is the payoff — "you picked the Vallejo at ΔE 2.9, the Army
   * Painter was 1.4" is the moment being wrong turns into learning something,
   * and auto-advancing past it would throw away the best thing the game does.
   * So a pick reveals, and a second tap moves on.
   */
  const [pending, setPending] = useState<number | null>(null);

  // Practice is its own little world: a seed, the round it produced, and the
  // pick. It never touches the daily's persisted record.
  const [practiceSeed, setPracticeSeed] = useState(0);
  const [practicePick, setPracticePick] = useState<number | null>(null);
  const [practiceScore, setPracticeScore] = useState({ played: 0, hits: 0 });

  // Hydration: the date and localStorage are client-only, so the first paint
  // must not depend on them.
  useEffect(() => {
    const t = todayISO();
    setToday(t);
    setState(loadState(localStorage.getItem(MATCHLE_STORAGE_KEY), t));
    if (!localStorage.getItem(MATCHLE_HELP_KEY)) setShowHelp(true);
    setPracticeSeed(Math.floor(Math.random() * 0xffffffff));
  }, []);

  useEffect(() => {
    if (state && today) localStorage.setItem(MATCHLE_STORAGE_KEY, JSON.stringify(state));
  }, [state, today]);

  const rounds = useMemo(() => (today ? buildDailyRounds(today) : []), [today]);
  const dayNumber = useMemo(() => (today ? dayNumberFor(today) : 1), [today]);

  const practiceRound = useMemo(
    () => (practiceSeed ? buildPracticeRound(practiceSeed) : null),
    [practiceSeed],
  );

  const roundIndex = state?.results.length ?? 0;
  const isComplete = state?.status === 'complete';
  const activeRound: MatchleRound | null =
    mode === 'practice' ? practiceRound : (rounds[roundIndex] ?? null);
  const pickedIndex = mode === 'practice' ? practicePick : pending;
  const revealed = pickedIndex !== null;

  const pick = useCallback(
    (index: number) => {
      if (mode === 'practice') {
        if (practicePick !== null || !practiceRound) return;
        setPracticePick(index);
        setPracticeScore((s) => ({
          played: s.played + 1,
          hits: s.hits + (index === practiceRound.answerIndex ? 1 : 0),
        }));
        return;
      }
      if (!state || isComplete || !activeRound || pending !== null) return;

      // Fired on the FIRST tap, not on completion. Swatchle only counted a
      // player once they finished, so the Phase 4 gate ("100 daily players")
      // has been reading completions and under-counting itself.
      if (!startedSent) {
        analytics.trackDailyStarted();
        setStartedSent(true);
      }
      setPending(index);
    },
    [mode, practicePick, practiceRound, state, isComplete, activeRound, pending, startedSent],
  );

  /** Commit the revealed round and move on. */
  const advance = useCallback(() => {
    if (!state || pending === null || !activeRound) return;
    const results = [...state.results, scoreRound(activeRound, pending)];
    setPending(null);
    if (results.length >= ROUNDS_PER_GAME) {
      const done = completeGame(state, results);
      setState(done);
      analytics.trackDailyPlayed();
      analytics.trackDailyWon(totalScore(results).hits);
      if (done.streak > 1) analytics.trackDailyStreakContinued(done.streak);
      setTimeout(() => setShowStats(true), 900);
    } else {
      setState({ ...state, results });
    }
  }, [state, pending, activeRound]);

  const handleShare = useCallback(async () => {
    if (!state || state.status !== 'complete') return;
    const text = buildShareText({
      dayNumber,
      rounds,
      results: state.results,
      streak: state.streak,
    });
    analytics.trackDailyShared();
    try {
      if (navigator.share) {
        await navigator.share({ text });
        return;
      }
    } catch {
      /* user dismissed the sheet — fall through to the clipboard */
    }
    try {
      await navigator.clipboard.writeText(text);
      setToast('Copied to clipboard');
      setTimeout(() => setToast(null), 2200);
    } catch {
      setToast('Could not copy');
      setTimeout(() => setToast(null), 2200);
    }
  }, [state, rounds, dayNumber]);

  const nextPractice = useCallback(() => {
    setPracticePick(null);
    setPracticeSeed(Math.floor(Math.random() * 0xffffffff));
  }, []);

  if (!state || !today) {
    return (
      <div className="flex justify-center items-center h-64 text-[var(--cogitator-green)] text-[11px] tech-text">
        INITIALISING AUSPEX...
      </div>
    );
  }

  const score = totalScore(state.results);

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-28 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h1 className="gothic-text text-[var(--cogitator-green)] text-3xl sm:text-4xl drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] tracking-wider">
          Matchle
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHelp(true)}
            aria-label="How to play"
            className="touch-target w-10 h-10 bg-transparent text-[var(--cogitator-green)] border border-[var(--cogitator-green)]/30 rounded-sm hover:bg-[var(--cogitator-green)]/10 transition-colors flex items-center justify-center font-mono font-bold text-xl"
          >
            ?
          </button>
          <button
            onClick={() => setShowStats(true)}
            aria-label="Statistics"
            className="touch-target w-10 h-10 bg-[var(--cogitator-green)]/10 text-[var(--cogitator-green)] border border-[var(--cogitator-green)]/30 rounded-sm hover:bg-[var(--cogitator-green)]/20 transition-colors flex items-center justify-center"
          >
            ▤
          </button>
        </div>
      </div>

      {/* Mode switch. Practice exists because a visitor arriving from TikTok
          should be able to play six in a row, not be told to come back
          tomorrow — scarcity converts attention into habit, it does not create
          attention. */}
      <div className="flex gap-1 mb-4 mt-3">
        {(['daily', 'practice'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => {
              setPending(null);
              setMode(m);
            }}
            className={`flex-1 py-2 text-[11px] uppercase tracking-widest tech-text rounded-sm border transition-colors ${
              mode === m
                ? 'bg-[var(--cogitator-green)] text-black border-[var(--cogitator-green)] font-bold'
                : 'bg-transparent text-[var(--cogitator-green)]/70 border-[var(--cogitator-green)]/25 hover:bg-[var(--cogitator-green)]/10'
            }`}
          >
            {m === 'daily' ? `Daily #${dayNumber}` : 'Practice'}
          </button>
        ))}
      </div>

      {/* Progress pips — the daily's only scoreboard while playing. */}
      {mode === 'daily' && (
        <div className="flex items-center justify-center gap-2 mb-5">
          {Array.from({ length: ROUNDS_PER_GAME }).map((_, i) => {
            const r = state.results[i];
            const cls = !r
              ? 'bg-transparent border-[var(--cogitator-green)]/30'
              : r.correct
                ? 'bg-[var(--cogitator-green)] border-[var(--cogitator-green)]'
                : r.cost <= CLOSE_ENOUGH_DELTA_E
                  ? 'bg-amber-400 border-amber-400'
                  : 'bg-red-500/80 border-red-500';
            return <div key={i} className={`w-8 h-2 rounded-full border ${cls} transition-colors`} />;
          })}
        </div>
      )}

      {mode === 'daily' && isComplete ? (
        <CompleteCard
          dayNumber={dayNumber}
          hits={score.hits}
          cost={score.cost}
          streak={state.streak}
          onShare={handleShare}
          onStats={() => setShowStats(true)}
          onPractice={() => setMode('practice')}
        />
      ) : activeRound ? (
        <RoundCard
          round={activeRound}
          revealed={revealed}
          pickedIndex={pickedIndex}
          onPick={pick}
          caption={
            mode === 'practice'
              ? `Practice · ${practiceScore.hits}/${practiceScore.played} correct`
              : `Round ${roundIndex + 1} of ${ROUNDS_PER_GAME}`
          }
        />
      ) : null}

      {mode === 'practice' && practicePick !== null && (
        <button
          data-testid="matchle-advance"
          onClick={nextPractice}
          className="w-full mt-4 py-3 bg-[var(--cogitator-green)] text-black font-bold uppercase tracking-widest tech-text rounded-sm hover:brightness-110 transition-colors touch-target"
        >
          Next round
        </button>
      )}

      {mode === 'daily' && !isComplete && pending !== null && (
        <button
          data-testid="matchle-advance"
          onClick={advance}
          className="w-full mt-4 py-3 bg-[var(--cogitator-green)] text-black font-bold uppercase tracking-widest tech-text rounded-sm hover:brightness-110 transition-colors touch-target"
        >
          {roundIndex + 1 >= ROUNDS_PER_GAME ? 'See results' : 'Next round'}
        </button>
      )}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="fixed left-1/2 -translate-x-1/2 bottom-28 z-[var(--z-modal)] px-6 py-3 bg-[var(--cogitator-green)] text-black font-bold rounded-sm shadow-xl uppercase tracking-widest text-xs"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {showHelp && (
        <HowToPlayModal
          onClose={() => {
            setShowHelp(false);
            localStorage.setItem(MATCHLE_HELP_KEY, '1');
          }}
        />
      )}
      {showStats && (
        <StatsModal
          state={state}
          dayNumber={dayNumber}
          onClose={() => setShowStats(false)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

// ---- round ------------------------------------------------------------------

function RoundCard({
  round,
  revealed,
  pickedIndex,
  onPick,
  caption,
}: {
  round: MatchleRound;
  revealed: boolean;
  pickedIndex: number | null;
  onPick: (i: number) => void;
  caption: string;
}) {
  return (
    <div>
      <p className="text-center text-[11px] tech-text text-[var(--cogitator-green)]/70 uppercase tracking-widest mb-3">
        {caption}
      </p>

      {/* The target. Large, because every judgement is made against it. */}
      <div className="rounded-sm border border-[var(--cogitator-green)]/30 bg-black/40 overflow-hidden mb-5">
        <div className="h-28 w-full" style={{ backgroundColor: round.target.hex }} />
        <div className="px-3 py-2 text-center">
          <p
            data-testid="matchle-target-name"
            className="text-white font-bold tech-text text-lg leading-tight"
          >
            {round.target.name}
          </p>
          <p className="text-[11px] text-gray-400 uppercase tracking-widest tech-text">
            {round.target.brand}
          </p>
        </div>
      </div>

      <p className="text-center text-sm text-gray-300 tech-text mb-3">
        Which is the closest match?
      </p>

      <div className="grid grid-cols-2 gap-3">
        {round.candidates.map((c, i) => {
          const isAnswer = i === round.answerIndex;
          const isPicked = i === pickedIndex;
          const border = !revealed
            ? 'border-[var(--cogitator-green)]/25'
            : isAnswer
              ? 'border-[var(--cogitator-green)] shadow-[0_0_16px_rgba(0,255,65,0.35)]'
              : isPicked
                ? 'border-red-500'
                : 'border-white/10 opacity-60';
          return (
            <button
              key={c.paintId}
              data-testid="matchle-candidate"
              onClick={() => onPick(i)}
              disabled={revealed}
              className={`text-left rounded-sm border-2 bg-black/40 overflow-hidden transition-all touch-target ${border} ${
                revealed ? 'cursor-default' : 'hover:brightness-110 active:scale-[0.98]'
              }`}
            >
              <div className="h-20 w-full" style={{ backgroundColor: c.hex }} />
              <div className="px-2 py-2">
                <p className="text-white text-[13px] font-bold tech-text leading-tight line-clamp-2">
                  {c.name}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider tech-text">
                  {c.brand}
                </p>
                {/* The number is only ever shown AFTER a pick. Before it, this
                    is a perception question; after it, it is the product
                    explaining itself. */}
                {revealed && (
                  <p
                    className={`text-[11px] font-mono mt-1 ${
                      isAnswer ? 'text-[var(--cogitator-green)]' : 'text-gray-400'
                    }`}
                  >
                    ΔE {c.deltaE.toFixed(1)}
                    {isAnswer ? ' · closest' : ''}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ---- completion --------------------------------------------------------------

function CompleteCard({
  dayNumber,
  hits,
  cost,
  streak,
  onShare,
  onStats,
  onPractice,
}: {
  dayNumber: number;
  hits: number;
  cost: number;
  streak: number;
  onShare: () => void;
  onStats: () => void;
  onPractice: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-sm border border-[var(--cogitator-green)]/40 bg-black/40 p-6 text-center"
    >
      <p className="text-[11px] tech-text text-[var(--cogitator-green)]/70 uppercase tracking-widest">
        Matchle #{dayNumber} complete
      </p>
      <p className="text-5xl font-bold text-white my-3 tech-text">
        {hits}
        <span className="text-2xl text-gray-500">/{ROUNDS_PER_GAME}</span>
      </p>
      {/* ΔE cost is the tiebreak and the reason a near-miss is worth caring
          about: it is how much accuracy you gave away, not just whether you
          were right. */}
      <p className="text-sm text-gray-300 tech-text">
        ΔE given away: <span className="text-white font-bold">{cost.toFixed(1)}</span>
      </p>
      {streak > 1 && (
        <p className="text-sm text-[var(--cogitator-green)] tech-text mt-1">🔥 {streak} day streak</p>
      )}

      <div className="flex gap-2 mt-6">
        <button
          onClick={onShare}
          className="flex-1 py-3 bg-[var(--cogitator-green)] text-black font-bold uppercase tracking-widest tech-text rounded-sm hover:brightness-110 transition-colors touch-target"
        >
          Share
        </button>
        <button
          onClick={onStats}
          className="flex-1 py-3 border border-[var(--cogitator-green)]/40 text-[var(--cogitator-green)] font-bold uppercase tracking-widest tech-text rounded-sm hover:bg-[var(--cogitator-green)]/10 transition-colors touch-target"
        >
          Stats
        </button>
      </div>
      <button
        onClick={onPractice}
        className="w-full mt-2 py-3 text-[var(--cogitator-green)]/80 text-[11px] uppercase tracking-widest tech-text hover:text-[var(--cogitator-green)] transition-colors touch-target"
      >
        Keep playing · practice mode
      </button>
    </motion.div>
  );
}
