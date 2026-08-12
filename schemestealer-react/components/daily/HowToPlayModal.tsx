'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CANDIDATES_PER_ROUND,
  MAX_DISTRACTOR_DELTA_E,
  ROUNDS_PER_GAME,
  targetPool,
} from '@/lib/matchle';

interface HowToPlayModalProps {
  onClose: () => void;
}

/**
 * The rules.
 *
 * It states the size of the target pool on purpose. Wordle's fairness comes
 * from answers being drawn from a narrow, curated list while guesses stay wide,
 * and *knowing* that is what makes a streak feel worth keeping. Swatchle drew
 * answers from all 1,312 paints and never said so, which is why an AK day felt
 * like a coin flip to a Citadel-only painter.
 */
export function HowToPlayModal({ onClose }: HowToPlayModalProps) {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const poolSize = targetPool().length;

  return (
    <div
      className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0a0f0a] border border-[var(--cogitator-green)]/30 p-6 rounded-sm max-w-sm w-full max-h-[90dvh] overflow-y-auto shadow-2xl relative"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-white touch-target flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-xl gothic-text text-[var(--cogitator-green)] mb-6 text-center">
          HOW TO PLAY
        </h2>

        <div className="space-y-4 text-sm text-gray-300 tech-text">
          <p>
            Each round shows one paint and{' '}
            <span className="text-white font-bold">{CANDIDATES_PER_ROUND} candidates</span> from
            other brands. Tap the one you think is the{' '}
            <span className="text-[var(--cogitator-green)] font-bold">closest match</span>.
          </p>

          <p>
            All {CANDIDATES_PER_ROUND} ΔE values are revealed after you pick — so you find out how
            close you were even when you get it wrong.
          </p>

          <div className="border border-[var(--cogitator-green)]/20 rounded-sm p-3 bg-black/40">
            <p className="text-xs uppercase tracking-widest text-[var(--cogitator-green)]/70 mb-2">
              ΔE — colour difference
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                <span className="text-white font-mono">0–1</span> · indistinguishable
              </li>
              <li>
                <span className="text-white font-mono">1–2</span> · a trained eye can tell
              </li>
              <li>
                <span className="text-white font-mono">2–10</span> · visible at a glance
              </li>
            </ul>
          </div>

          <p>
            {ROUNDS_PER_GAME} rounds a day. Your score is how many you got right, plus the{' '}
            <span className="text-white font-bold">ΔE you gave away</span> — how much accuracy you
            lost by not picking the nearest. Lower is better.
          </p>

          {/* Stating the pool is the point — see the note above the component. */}
          <div className="border-t border-[var(--cogitator-green)]/20 pt-4">
            <p className="text-xs text-gray-400">
              Targets are drawn from a curated pool of{' '}
              <span className="text-[var(--cogitator-green)] font-bold">{poolSize} paints</span> —
              no washes, no metallics, no obscure one-offs. Every round is checked before you see
              it: the nearest candidate is always a genuine match, and it always beats the
              runner-up clearly. Candidates are always within ΔE {MAX_DISTRACTOR_DELTA_E} of the
              target, so it is never a trick question.
            </p>
          </div>

          <p className="text-xs text-gray-500">
            Practice mode gives you unlimited rounds and never affects your streak.
          </p>
        </div>

        <div className="border-t border-[var(--cogitator-green)]/30 pt-4 mt-6">
          <p className="text-center font-mono text-[11px] text-[var(--cogitator-green)]/60 uppercase">
            A new Matchle appears at midnight, local time.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
