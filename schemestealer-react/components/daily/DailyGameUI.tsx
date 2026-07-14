'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAINT_DATABASE, PaintData } from '@/lib/paintDatabase';
import { PaintSearchModal } from './PaintSearchModal';
import dailyPuzzles from '@/lib/data/daily_puzzles.json';
import { deltaE2000 } from '@/lib/deltaE';
import { hueDirection, HueDirection, proximityPercentage, proximityLabel, Guess, generateShareGrid } from '@/lib/colourClues';
import analytics from '@/lib/analytics';
import { StatsModal } from './StatsModal';
import { HowToPlayModal } from './HowToPlayModal';

export interface GameState {
  guesses: Guess[];
  status: 'playing' | 'won' | 'lost';
  lastPlayedDate: string;
  streak: number;
  maxStreak: number;
  played: number;
  won: number;
  guessDistribution: number[];
}

const MAX_GUESSES = 6;

export function DailyGameUI() {
  const [mounted, setMounted] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    guesses: [],
    status: 'playing',
    lastPlayedDate: '',
    streak: 0,
    maxStreak: 0,
    played: 0,
    won: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
  });
  const [showStats, setShowStats] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const localDateStr = new Date().toLocaleDateString('en-CA');
  
  const puzzleKey = useMemo(() => {
    if (dailyPuzzles.days[localDateStr as keyof typeof dailyPuzzles.days]) return localDateStr;
    const keys = Object.keys(dailyPuzzles.days).sort();
    const past = keys.filter((k) => k <= localDateStr);
    return past[past.length - 1] ?? keys[0];
  }, [localDateStr]);
  const puzzle = dailyPuzzles.days[puzzleKey as keyof typeof dailyPuzzles.days];
  const targetPaint = puzzle ? PAINT_DATABASE.find(p => p.paint_id === puzzle.answer) : null;
  
  const dayNumber = useMemo(() => {
    return Object.keys(dailyPuzzles.days).sort().indexOf(puzzleKey) + 1;
  }, [puzzleKey]);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('schemestealer-daily-augury');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        if (parsed.lastPlayedDate !== localDateStr) {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toLocaleDateString('en-CA');
          
          let streak = parsed.streak;
          if (parsed.lastPlayedDate !== yesterdayStr) {
            streak = 0;
          }
          
          setGameState({
            ...parsed,
            guesses: [],
            status: 'playing',
            lastPlayedDate: localDateStr,
            streak,
          });
        } else {
          setGameState(parsed);
        }
      } catch (e) {
        console.error("Failed to parse daily state", e);
      }
    } else {
      setGameState(prev => ({ ...prev, lastPlayedDate: localDateStr }));
    }
  }, [localDateStr]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('schemestealer-daily-augury', JSON.stringify(gameState));
    }
  }, [gameState, mounted]);

  const handleGuess = (paint: PaintData) => {
    if (!targetPaint || gameState.status !== 'playing' || gameState.guesses.length >= MAX_GUESSES) return;

    let familyMatch: 'exact' | 'adjacent' | 'far' = 'far';
    if (paint.colorFamily === targetPaint.colorFamily) {
      familyMatch = 'exact';
    } else {
      const adjacents = (dailyPuzzles.familyAdjacency as any)[paint.colorFamily] || [];
      if (adjacents.includes(targetPaint.colorFamily)) {
        familyMatch = 'adjacent';
      }
    }

    let lightnessDirection: 'match' | 'lighter' | 'darker' = 'match';
    const diff = targetPaint.lab.l - paint.lab.l;
    if (Math.abs(diff) < 1.0) {
      lightnessDirection = 'match';
    } else if (diff > 0) {
      lightnessDirection = 'lighter';
    } else {
      lightnessDirection = 'darker';
    }

    const hueDir = hueDirection(paint.lab, targetPaint.lab);
    const de = deltaE2000(paint.lab, targetPaint.lab);

    const guess: Guess = {
      paint_id: paint.paint_id,
      familyMatch,
      hueDirection: hueDir,
      lightnessDirection,
      deltaE: de,
    };

    const newGuesses = [...gameState.guesses, guess];
    let newStatus: 'playing' | 'won' | 'lost' = gameState.status;
    
    const isWin = paint.paint_id === targetPaint.paint_id;
    if (isWin) {
      newStatus = 'won';
    } else if (newGuesses.length >= MAX_GUESSES) {
      newStatus = 'lost';
    }

    let { streak, maxStreak, played, won, guessDistribution } = gameState;
    
    if (newStatus !== 'playing') {
      played += 1;
      analytics.trackDailyPlayed();
      
      if (isWin) {
        won += 1;
        streak += 1;
        if (streak > maxStreak) maxStreak = streak;
        guessDistribution[newGuesses.length - 1] += 1;
        analytics.trackDailyWon(newGuesses.length);
        analytics.trackDailyStreakContinued(streak);
      } else {
        streak = 0;
      }
      setTimeout(() => setShowStats(true), 1500);
    }

    setGameState({
      guesses: newGuesses,
      status: newStatus,
      lastPlayedDate: localDateStr,
      streak,
      maxStreak,
      played,
      won,
      guessDistribution,
    });
  };

  const handleShare = async () => {
    if (gameState.status === 'playing') return;
    const score = gameState.status === 'won' ? gameState.guesses.length : 'X';
    const grid = generateShareGrid(gameState.guesses);
    const shareText = `Swatchle #${dayNumber}  ${score}/6  🔥${gameState.streak}\n\n${grid}\nhttps://schemestealer.com/daily`;

    analytics.trackDailyShared();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SchemeStealer Swatchle',
          text: shareText,
        });
        return;
      } catch (err) {}
    }
    
    try {
      await navigator.clipboard.writeText(shareText);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  if (!mounted || !targetPaint) {
    return <div className="flex justify-center items-center h-64 text-[var(--cogitator-green)]">INITIALISING AUSPEX...</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto p-4 flex flex-col min-h-dvh">
      <div className="flex justify-between items-center mb-8">
        <h1 className="gothic-text text-[var(--cogitator-green)] text-4xl drop-shadow-[0_0_8px_rgba(0,255,65,0.4)] tracking-wider">Swatchle</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowHowToPlay(true)}
            aria-label="How to play"
            className="touch-target w-10 h-10 bg-transparent text-[var(--cogitator-green)] border border-[var(--cogitator-green)]/30 rounded-sm hover:bg-[var(--cogitator-green)]/10 transition-colors flex items-center justify-center font-mono font-bold text-xl"
          >
            ?
          </button>
          <button
            onClick={() => setShowStats(true)}
            aria-label="Service record"
            className="touch-target w-10 h-10 bg-[var(--cogitator-green)]/10 text-[var(--cogitator-green)] border border-[var(--cogitator-green)]/30 rounded-sm hover:bg-[var(--cogitator-green)]/20 transition-colors flex items-center justify-center"
          >
            📊
          </button>
        </div>
      </div>
      
      <div className="flex-1">
        {gameState.status === 'playing' && (
          <div className="flex flex-col items-center mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div 
              className="w-24 h-24 rounded-3xl shadow-[0_0_20px_rgba(0,0,0,0.5)] mb-4 border-2 border-white/10" 
              style={{ backgroundColor: targetPaint.hex }} 
            />
            <h2 className="text-xl text-white font-bold tracking-widest mb-1">IDENTIFY THIS PAINT</h2>
            <p className="text-sm text-[var(--cogitator-green)]/70">Swatchle #{dayNumber} · 6 guesses</p>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-8">
          {Array.from({ length: MAX_GUESSES }).map((_, i) => {
            const guess = gameState.guesses[i];
            
            if (!guess) {
              const isActive = i === gameState.guesses.length && gameState.status === 'playing';
              return (
                <button 
                  key={i} 
                  onClick={() => isActive && setIsSearchModalOpen(true)}
                  disabled={!isActive}
                  className={`w-full h-14 border rounded-sm flex items-center justify-center transition-all ${
                    isActive 
                      ? 'border-[var(--cogitator-green)] bg-[var(--cogitator-green)]/10 cursor-pointer animate-pulse' 
                      : 'border-[var(--cogitator-green)]/20 bg-black/30 cursor-default'
                  }`}
                >
                  <span className={`${isActive ? 'text-[var(--cogitator-green)]/60' : 'text-[var(--cogitator-green)]/10'} font-mono text-sm tracking-widest`}>
                    {isActive ? 'TAP TO GUESS' : ''}
                  </span>
                </button>
              );
            }

            const paint = PAINT_DATABASE.find(p => p.paint_id === guess.paint_id);
            if (!paint) return null;

            const proxPct = proximityPercentage(guess.deltaE);
            const proxLbl = proximityLabel(guess.deltaE);

            let trend = '—';
            if (i > 0) {
              const prevDe = gameState.guesses[i-1].deltaE;
              if (guess.deltaE < prevDe) trend = '▲';
              else if (guess.deltaE > prevDe) trend = '▼';
            }

            const getBarColor = (lbl: string) => {
              if (lbl === 'WIN') return '#2ea043';
              if (lbl === 'HOT') return '#ff9800';
              if (lbl === 'WARM') return '#ffc107';
              return '#f44336';
            };

            return (
              <motion.div 
                key={i}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-1.5 mb-2"
              >
                <div className="flex w-full h-6 rounded-sm overflow-hidden border border-white/10 shadow-sm">
                  <div className="flex-1 relative flex items-center justify-center" style={{ backgroundColor: paint.hex }}>
                    <span className="bg-black/60 text-white/90 px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest backdrop-blur-sm">YOU</span>
                  </div>
                  <div className="w-0.5 bg-black/50 z-10" />
                  <div className="flex-1 relative flex items-center justify-center" style={{ backgroundColor: targetPaint.hex }}>
                    <span className="bg-black/60 text-white/90 px-2 py-0.5 rounded-sm text-[8px] font-bold tracking-widest backdrop-blur-sm">TARGET</span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-0.5">
                  <span className="text-sm font-bold text-white truncate max-w-[70%]">{paint.name}</span>
                  <div className={`px-2 py-0.5 rounded-sm text-[9px] font-bold uppercase tracking-widest ${
                    guess.familyMatch === 'exact' ? 'bg-[#2ea043]/20 border border-[#2ea043]/50 text-[#2ea043]' : 
                    guess.familyMatch === 'adjacent' ? 'bg-[#d29922]/20 border border-[#d29922]/50 text-[#d29922]' : 
                    'bg-red-900/20 border border-red-500/30 text-red-400'
                  }`}>
                    {paint.family || paint.colorFamily}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 h-9">
                  <div className="flex items-center justify-center border border-white/10 bg-black/40 rounded-sm">
                    <span className="text-[10px] font-bold text-gray-300">
                      {guess.hueDirection === 'achromatic' ? '—' : 
                       guess.hueDirection === 'match' ? '✓ HUE' : 
                       guess.hueDirection === 'warmer' ? '→ WARMER' : '← COOLER'}
                    </span>
                  </div>

                  <div className="flex items-center justify-center border border-white/10 bg-black/40 rounded-sm">
                    <span className="text-[10px] font-bold text-gray-300 flex items-center gap-1">
                       {guess.lightnessDirection === 'match' ? '✓ LIGHT' : 
                        guess.lightnessDirection === 'lighter' ? '▲ LIGHTER' : '▼ DARKER'}
                    </span>
                  </div>

                  <div className="flex flex-col border border-white/10 bg-black/40 rounded-sm relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 z-0 opacity-40 transition-all duration-1000"
                      style={{ width: `${proxPct}%`, backgroundColor: getBarColor(proxLbl) }}
                    />
                    <div className="relative z-10 w-full h-full flex items-center justify-between px-2">
                       <span className="text-[10px] font-bold text-gray-400">{trend}</span>
                       <span className="text-[10px] font-bold text-white">{proxLbl === 'WIN' ? '🎯' : proxLbl}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {gameState.status !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center p-6 border border-[var(--imperial-gold)]/50 bg-black/80 backdrop-blur-md rounded-sm mt-4 shadow-[0_0_30px_rgba(212,175,55,0.15)]"
          >
            <h2 className="text-3xl gothic-text text-[var(--imperial-gold)] mb-6 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">
              {gameState.status === 'won' ? 'MISSION SUCCESSFUL' : 'MISSION FAILED'}
            </h2>
            
            <div className="w-full bg-[#0a0f0a] border border-white/10 rounded-sm p-4 mb-6 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22h20L12 2zm0 3.8l7.1 14.2H4.9L12 5.8z"/></svg>
              </div>
              <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-3">Target Paint</p>
              <div className="flex items-center gap-4 z-10">
                <motion.div 
                  initial={{ filter: "blur(15px)" }}
                  animate={{ filter: "blur(0px)" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="w-16 h-16 rounded-full border-2 border-white/20 shadow-lg shrink-0" 
                  style={{ backgroundColor: targetPaint.hex }} 
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white leading-tight">{targetPaint.name}</span>
                  <span className="text-sm text-[var(--cogitator-green)]/80 uppercase tracking-wider">{targetPaint.brand}</span>
                </div>
              </div>
            </div>

            <div className="w-full mb-6 relative">
              <div className="flex w-full h-10 rounded-sm overflow-hidden border border-white/20">
                {gameState.guesses.map((g, idx) => {
                  const gp = PAINT_DATABASE.find(p => p.paint_id === g.paint_id);
                  return (
                    <div key={idx} className="flex-1 relative border-r border-black/20" style={{ backgroundColor: gp?.hex }}>
                       {idx < gameState.guesses.length - 1 && (
                         <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-r from-transparent to-black/20 z-10" />
                       )}
                    </div>
                  );
                })}
                <div className="flex-1 relative bg-black/20 overflow-hidden">
                   <div className="absolute inset-0" style={{ backgroundColor: targetPaint.hex }} />
                   <div className="absolute inset-0 flex items-center justify-center text-sm drop-shadow-md z-10">🎯</div>
                </div>
              </div>
            </div>

            <div className="flex w-full gap-3 mb-6">
              <button
                onClick={handleShare}
                className="flex-1 bg-[var(--cogitator-green)] text-black font-bold py-3 px-4 rounded-sm hover:bg-[#2ea043] transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
                SHARE
              </button>
              <button
                onClick={() => setShowStats(true)}
                className="flex-1 bg-[var(--cogitator-green)]/10 border border-[var(--cogitator-green)]/30 text-[var(--cogitator-green)] font-bold py-3 px-4 rounded-sm hover:bg-[var(--cogitator-green)]/20 transition-colors flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 16 16" width="18" height="18" fill="currentColor"><path fillRule="evenodd" d="M2 2a1 1 0 011-1h10a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V2zm2 1v10h8V3H4zm3.5 2a.5.5 0 00-.5.5v3a.5.5 0 001 0v-3a.5.5 0 00-.5-.5zm2 1.5a.5.5 0 00-.5.5v1.5a.5.5 0 001 0V7a.5.5 0 00-.5-.5zm-4 1a.5.5 0 00-.5.5v.5a.5.5 0 001 0V8a.5.5 0 00-.5-.5z"></path></svg>
                DOSSIER
              </button>
            </div>

            <div className="w-full">
              <a
                href="/"
                className="w-full bg-[var(--imperial-gold)]/20 border border-[var(--imperial-gold)]/50 text-[var(--imperial-gold)] font-bold py-3 px-4 rounded-sm hover:bg-[var(--imperial-gold)]/30 transition-colors flex items-center justify-center gap-2 tracking-widest text-sm"
              >
                <span>SCAN YOUR MINIATURE</span>
              </a>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showStats && (
          <StatsModal 
            gameState={gameState} 
            onClose={() => setShowStats(false)} 
            onShare={handleShare}
          />
        )}
        {showHowToPlay && (
          <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
        )}
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-[var(--cogitator-green)] text-black font-bold rounded-sm shadow-xl flex items-center gap-2 whitespace-nowrap uppercase tracking-widest text-xs border border-[var(--cogitator-green)]/30"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path fillRule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
            Tactical Report Copied
          </motion.div>
        )}
      </AnimatePresence>
      
      <PaintSearchModal 
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={(paint) => {
          handleGuess(paint);
          setIsSearchModalOpen(false);
        }}
      />
    </div>
  );
}
