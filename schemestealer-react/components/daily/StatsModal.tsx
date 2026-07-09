'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GameState {
  guesses: any[];
  status: 'playing' | 'won' | 'lost';
  lastPlayedDate: string;
  streak: number;
  maxStreak: number;
  played: number;
  won: number;
  guessDistribution: number[];
}

interface StatsModalProps {
  gameState: GameState;
  onClose: () => void;
  onShare: () => void;
}

export function StatsModal({ gameState, onClose, onShare }: StatsModalProps) {
  const [timeToMidnight, setTimeToMidnight] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeToMidnight(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const winPercent = gameState.played > 0 ? Math.round((gameState.won / gameState.played) * 100) : 0;
  const maxGuessCount = Math.max(...gameState.guessDistribution, 1); // Avoid division by zero

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-[#0a0f0a] border-2 border-[var(--cogitator-green)]/50 p-6 rounded-sm max-w-sm w-full shadow-[0_0_30px_rgba(0,255,65,0.2)]"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl gothic-text text-[var(--cogitator-green)]">SERVICE RECORD</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white">✕</button>
        </div>

        <div className="flex justify-between mb-8 text-center text-gray-300 tech-text">
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{gameState.played}</span>
            <span className="text-xs">Played</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{winPercent}</span>
            <span className="text-xs">Win %</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{gameState.streak}</span>
            <span className="text-xs">Current Streak</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-bold text-white">{gameState.maxStreak}</span>
            <span className="text-xs">Max Streak</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-400 mb-3 uppercase tracking-widest">Guess Distribution</h3>
        <div className="flex flex-col gap-2 mb-8 font-mono text-sm">
          {gameState.guessDistribution.map((count, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-4 text-right text-gray-500">{i + 1}</div>
              <div className="flex-1 bg-black/50 h-5 relative">
                <div 
                  className={`h-full ${count > 0 ? (gameState.status === 'won' && gameState.guesses.length === i + 1 ? 'bg-[var(--cogitator-green)] text-black' : 'bg-gray-600 text-white') : 'bg-transparent'} flex items-center justify-end px-2 text-xs font-bold transition-all`}
                  style={{ width: `${Math.max((count / maxGuessCount) * 100, 5)}%` }}
                >
                  {count > 0 ? count : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        {gameState.status !== 'playing' && (
          <div className="flex justify-between items-center border-t border-[var(--cogitator-green)]/30 pt-6">
            <div className="text-center w-1/2 border-r border-[var(--cogitator-green)]/30">
              <p className="text-xs text-[var(--cogitator-green)]/70 mb-1 tech-text">NEXT AUGURY IN</p>
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
      </motion.div>
    </div>
  );
}
