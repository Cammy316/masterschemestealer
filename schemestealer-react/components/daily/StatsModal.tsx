'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatTimeToMidnight } from '@/lib/dailyStatus';
import { useTimeToMidnight } from '@/hooks/useTimeToMidnight';
import { ROUNDS_PER_GAME } from '@/lib/matchle';
import type { MatchleState } from '@/lib/matchleState';

interface StatsModalProps {
  state: MatchleState;
  dayNumber: number;
  onClose: () => void;
  onShare: () => void;
}

/**
 * The service record.
 *
 * Swatchle's version showed a guess distribution — how many turns it took to
 * land the answer. Matchle has no turns, so the distribution is now hits per
 * game (0–5), which is the shape of the actual skill curve, plus the best ΔE
 * ever given away.
 */
export function StatsModal({ state, dayNumber, onClose, onShare }: StatsModalProps) {
  const now = useTimeToMidnight();
  const timeToMidnight = formatTimeToMidnight(now);

  const perfectPercent = state.played > 0 ? Math.round((state.perfect / state.played) * 100) : 0;
  const maxInDistribution = Math.max(...state.hitDistribution, 1);
  const todayHits = state.results.filter((r) => r.correct).length;

  // Lock body scroll while open (plain fixed overlay, not a Dialog).
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    // z-modal token: raw z-50 sat BELOW the z-100 bottom nav, which stayed
    // visible and tappable through the backdrop.
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0f0a] border-2 border-[var(--cogitator-green)]/50 p-6 rounded-sm max-w-sm w-full max-h-[90dvh] overflow-y-auto shadow-[0_0_30px_rgba(0,255,65,0.2)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl gothic-text text-[var(--cogitator-green)]">SERVICE RECORD</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-white touch-target flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="flex justify-between mb-8 text-center text-gray-300 tech-text">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{state.played}</span>
            <span className="text-xs">Played</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{perfectPercent}</span>
            <span className="text-xs">Perfect %</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{state.streak}</span>
            <span className="text-xs">Streak</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{state.maxStreak}</span>
            <span className="text-xs">Max Streak</span>
          </div>
        </div>

        {state.bestCost !== null && (
          <p className="text-center text-sm text-gray-300 tech-text mb-6">
            Best round:{' '}
            <span className="text-[var(--cogitator-green)] font-bold">
              ΔE {state.bestCost.toFixed(1)}
            </span>{' '}
            given away
          </p>
        )}

        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">
          Correct per game
        </h3>
        <div className="flex flex-col gap-2 mb-8 font-mono text-sm">
          {state.hitDistribution.map((count, hits) => (
            <div key={hits} className="flex items-center gap-2">
              <div className="w-4 text-right text-gray-500">{hits}</div>
              <div className="flex-1 bg-black/50 h-5 relative">
                <div
                  className={`h-full ${
                    count > 0
                      ? state.status === 'complete' && todayHits === hits
                        ? 'bg-[var(--cogitator-green)] text-black'
                        : 'bg-gray-600 text-white'
                      : 'bg-transparent'
                  } flex items-center justify-end px-2 text-xs font-bold transition-all`}
                  style={{ width: `${Math.max((count / maxInDistribution) * 100, 5)}%` }}
                >
                  {count > 0 ? count : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {state.status === 'complete' && (
          <div className="flex justify-between items-center border-t border-[var(--cogitator-green)]/30 pt-6">
            <div className="text-center w-1/2 border-r border-[var(--cogitator-green)]/30">
              <p className="text-xs text-[var(--cogitator-green)]/70 mb-1 tech-text">
                NEXT MATCHLE IN
              </p>
              <p className="text-xl font-mono text-[var(--cogitator-green)]">{timeToMidnight}</p>
            </div>
            <div className="w-1/2 flex justify-center pl-4">
              <button
                onClick={onShare}
                className="w-full py-3 bg-[var(--cogitator-green)] text-black font-bold uppercase tracking-widest tech-text rounded-sm hover:brightness-110 transition-colors"
              >
                SHARE
              </button>
            </div>
          </div>
        )}

        <p className="sr-only">Matchle #{dayNumber}</p>
      </motion.div>
    </div>
  );
}
