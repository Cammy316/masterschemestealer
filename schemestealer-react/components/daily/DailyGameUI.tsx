'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAINT_DATABASE, PaintData } from '@/lib/paintDatabase';
import { PaintSearchModal } from './PaintSearchModal';
import dailyPuzzles from '@/lib/data/daily_puzzles.json';
import { deltaE2000 } from '@/lib/deltaE';
import { DeltaEBadge } from '@/components/seo/DeltaEBadge';
import analytics from '@/lib/analytics';
import { StatsModal } from './StatsModal';
import { HowToPlayModal } from './HowToPlayModal';
import Link from 'next/link';

interface Guess {
  paint_id: string;
  brandMatch: boolean;
  familyMatch: 'exact' | 'adjacent' | 'far';
  lightnessDirection: 'match' | 'lighter' | 'darker';
  deltaE: number;
  deltaEBand: 'perfect' | 'close' | 'fair' | 'distant';
}

interface GameState {
  guesses: Guess[];
  status: 'playing' | 'won' | 'lost';
  lastPlayedDate: string;
  streak: number;
  maxStreak: number;
  played: number;
  won: number;
  guessDistribution: number[]; // Index 0 is 1 guess, 1 is 2 guesses, etc.
}

const MAX_GUESSES = 6;
const DELTA_E_THRESHOLDS = {
  perfect: 1.0,
  close: 2.0,
  fair: 10.0,
};

function getDeltaEBand(de: number) {
  if (de <= DELTA_E_THRESHOLDS.perfect) return 'perfect';
  if (de <= DELTA_E_THRESHOLDS.close) return 'close';
  if (de <= DELTA_E_THRESHOLDS.fair) return 'fair';
  return 'distant';
}

function generateShareGrid(guesses: Guess[]) {
  let grid = '';
  for (const g of guesses) {
    // 1. Brand: green/red
    grid += g.brandMatch ? '🟩' : '🟥';
    
    // 2. Family: green/yellow/red
    if (g.familyMatch === 'exact') grid += '🟩';
    else if (g.familyMatch === 'adjacent') grid += '🟨';
    else grid += '🟥';
    
    // 3. Lightness: Up/Down arrow or green square
    if (g.lightnessDirection === 'match') grid += '🟩';
    else if (g.lightnessDirection === 'lighter') grid += '🔼';
    else grid += '🔽';
    
    // 4. DeltaE: perfect=green, close=blue, fair=yellow, distant=red
    if (g.deltaEBand === 'perfect') grid += '🟩';
    else if (g.deltaEBand === 'close') grid += '🟦';
    else if (g.deltaEBand === 'fair') grid += '🟨';
    else grid += '🟥';
    
    grid += '\n';
  }
  return grid;
}

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

  const localDateStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  // Fall back to the nearest available puzzle day rather than a dead
  // "INITIALISING AUSPEX…" screen — the file is date-keyed from a fixed
  // generation date, so devices ahead/behind that timezone (or beyond the
  // generated window) would otherwise find no entry for "today".
  const puzzleKey = useMemo(() => {
    if (dailyPuzzles.days[localDateStr as keyof typeof dailyPuzzles.days]) return localDateStr;
    const keys = Object.keys(dailyPuzzles.days).sort();
    const past = keys.filter((k) => k <= localDateStr);
    return past[past.length - 1] ?? keys[0];
  }, [localDateStr]);
  const puzzle = dailyPuzzles.days[puzzleKey as keyof typeof dailyPuzzles.days];
  const targetPaint = puzzle ? PAINT_DATABASE.find(p => p.paint_id === puzzle.answer) : null;

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('schemestealer-daily-augury');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState;
        
        // Reset state for a new day if necessary
        if (parsed.lastPlayedDate !== localDateStr) {
          // If the last played date was exactly yesterday, keep the streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toLocaleDateString('en-CA');
          
          let streak = parsed.streak;
          if (parsed.lastPlayedDate !== yesterdayStr) {
            streak = 0; // Streak broken
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
        console.error("Failed to parse daily augury state", e);
      }
    } else {
      setGameState(prev => ({ ...prev, lastPlayedDate: localDateStr }));
    }
  }, [localDateStr]);

  // Save to local storage whenever game state changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('schemestealer-daily-augury', JSON.stringify(gameState));
    }
  }, [gameState, mounted]);

  const handleGuess = (paint: PaintData) => {
    if (!targetPaint || gameState.status !== 'playing' || gameState.guesses.length >= MAX_GUESSES) return;

    const brandMatch = paint.brand === targetPaint.brand;
    
    // Family match logic using the adjacency matrix
    let familyMatch: 'exact' | 'adjacent' | 'far' = 'far';
    if (paint.colorFamily === targetPaint.colorFamily) {
      familyMatch = 'exact';
    } else {
      const adjacents = (dailyPuzzles.familyAdjacency as any)[paint.colorFamily] || [];
      if (adjacents.includes(targetPaint.colorFamily)) {
        familyMatch = 'adjacent';
      }
    }

    // Lightness direction: comparing lab.l
    let lightnessDirection: 'match' | 'lighter' | 'darker' = 'match';
    const diff = targetPaint.lab.l - paint.lab.l;
    if (Math.abs(diff) < 1.0) {
      lightnessDirection = 'match';
    } else if (diff > 0) {
      lightnessDirection = 'lighter'; // Target is lighter, so player needs to go lighter
    } else {
      lightnessDirection = 'darker'; // Target is darker
    }

    const de = deltaE2000(paint.lab, targetPaint.lab);
    const deltaEBand = getDeltaEBand(de);

    const guess: Guess = {
      paint_id: paint.paint_id,
      brandMatch,
      familyMatch,
      lightnessDirection,
      deltaE: de,
      deltaEBand,
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
        streak = 0; // Lost, streak broken
      }
      
      // Auto-show stats after a brief delay
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
    
    const dayNumber = Object.keys(dailyPuzzles.days).sort().indexOf(localDateStr) + 1;
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
      } catch (err) {
        // Fallback to clipboard
      }
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
    // max-w-xl: the four-cell grid is phone-shaped — at max-w-4xl each cell
    // stretched to ~215px on desktop
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
      
      {/* Game Board */}
      <div className="flex-1">
        {/* Header row removed to save vertical space on mobile */}

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

            return (
              <motion.div 
                key={i}
                initial={{ rotateX: -90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-1 mb-2"
              >
                {/* Paint Name Header */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-bold text-white truncate">{paint.name}</span>
                  <span className="text-[10px] text-[var(--cogitator-green)]/70 uppercase tracking-wider">{paint.brand}</span>
                </div>
                
                {/* 4 Clue Boxes */}
                <div className="grid grid-cols-4 gap-2 h-14">
                  {/* 1. Brand */}
                  <div className={`flex flex-col items-center justify-center border ${guess.brandMatch ? 'bg-[#2ea043]/20 border-[#2ea043] text-[#2ea043]' : 'bg-red-900/20 border-red-500/50 text-red-400'} rounded-sm`}>
                    <span className="text-[9px] opacity-60 mb-0.5 font-mono tracking-widest">BRAND</span>
                    <span className="font-bold text-lg leading-none">{guess.brandMatch ? '✓' : '✗'}</span>
                  </div>

                  {/* 2. Family */}
                  <div className={`flex flex-col items-center justify-center border ${
                    guess.familyMatch === 'exact' ? 'bg-[#2ea043]/20 border-[#2ea043] text-[#2ea043]' : 
                    guess.familyMatch === 'adjacent' ? 'bg-[#d29922]/20 border-[#d29922] text-[#d29922]' : 
                    'bg-red-900/20 border-red-500/50 text-red-400'
                  } rounded-sm overflow-hidden`}>
                    <span className="text-[9px] opacity-60 mb-0.5 font-mono tracking-widest">FAMILY</span>
                    <span className="font-bold text-xs capitalize truncate px-1 w-full text-center">{paint.family || paint.colorFamily}</span>
                  </div>

                  {/* 3. Lightness */}
                  <div className={`flex flex-col items-center justify-center border ${guess.lightnessDirection === 'match' ? 'bg-[#2ea043]/20 border-[#2ea043] text-[#2ea043]' : 'bg-[#d29922]/20 border-[#d29922] text-[#d29922]'} rounded-sm`}>
                    <span className="text-[9px] opacity-60 mb-0.5 font-mono tracking-widest">LIGHT</span>
                    <div className="flex items-center">
                      {guess.lightnessDirection === 'match' && <span className="font-bold text-lg leading-none">✓</span>}
                      {guess.lightnessDirection === 'lighter' && <span className="font-bold text-lg leading-none">▲</span>}
                      {guess.lightnessDirection === 'darker' && <span className="font-bold text-lg leading-none">▼</span>}
                    </div>
                  </div>

                  {/* 4. Match Band */}
                  <div className="flex items-center justify-center h-full">
                    <DeltaEBadge deltaE={guess.deltaE} band={guess.deltaEBand} className="w-full h-full justify-center !py-0" showLabel={false} />
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
            
            {/* Target Paint Card */}
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
                <div className="flex flex-col justify-center">
                  <p className="text-2xl font-bold text-white leading-tight">{targetPaint.name}</p>
                  <p className="text-[var(--imperial-gold)] tracking-widest uppercase text-xs">{targetPaint.brand}</p>
                </div>
              </div>
            </div>

            {/* Visual Share Grid */}
            <div className="bg-[#050a05] border border-[var(--cogitator-green)]/30 rounded-sm p-4 mb-6 w-full flex flex-col items-center">
              <p className="text-[var(--cogitator-green)] text-xs mb-3 font-mono">
                Swatchle #{Object.keys(dailyPuzzles.days).sort().indexOf(localDateStr) + 1} {gameState.status === 'won' ? gameState.guesses.length : 'X'}/6 🔥{gameState.streak}
              </p>
              <div className="flex flex-col gap-1">
                {gameState.guesses.map((g, i) => (
                  <div key={i} className="flex gap-1">
                    <div className={`w-5 h-5 rounded-sm ${g.brandMatch ? 'bg-[#2ea043]' : 'bg-red-600'}`} />
                    <div className={`w-5 h-5 rounded-sm ${g.familyMatch === 'exact' ? 'bg-[#2ea043]' : g.familyMatch === 'adjacent' ? 'bg-[#d29922]' : 'bg-red-600'}`} />
                    <div className={`w-5 h-5 rounded-sm flex items-center justify-center text-black text-[10px] ${g.lightnessDirection === 'match' ? 'bg-[#2ea043]' : 'bg-blue-500'}`}>
                      {g.lightnessDirection === 'match' ? '' : g.lightnessDirection === 'lighter' ? '▲' : '▼'}
                    </div>
                    <div className={`w-5 h-5 rounded-sm ${g.deltaEBand === 'perfect' ? 'bg-[#2ea043]' : g.deltaEBand === 'close' ? 'bg-blue-500' : g.deltaEBand === 'fair' ? 'bg-[#d29922]' : 'bg-red-600'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col w-full gap-3">
              <div className="flex gap-3">
                <button
                  onClick={handleShare}
                  className="flex-1 touch-target py-3 bg-[var(--cogitator-green)] text-black font-bold text-sm tracking-widest rounded-sm hover:brightness-110 transition-colors flex items-center justify-center gap-2"
                >
                  <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path fillRule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v3.992a.25.25 0 00.379.214l3.12-1.996a.25.25 0 000-.428L6.379 5.227z"></path></svg>
                  SHARE
                </button>
                <Link 
                  href={`/paints/${targetPaint.brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${targetPaint.paint_id}`}
                  className="flex-1 touch-target py-3 bg-transparent border border-white/20 text-white font-bold text-sm tracking-widest rounded-sm hover:bg-white/5 transition-colors flex items-center justify-center"
                >
                  DOSSIER
                </Link>
              </div>
              
              <Link
                href="/miniature"
                className="w-full py-4 mt-2 bg-gradient-to-r from-[var(--imperial-gold)] to-[var(--brass)] text-black font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all text-center flex flex-col items-center justify-center shadow-lg"
              >
                <span className="text-[10px] opacity-70 mb-0.5 font-mono">PRIMARY OBJECTIVE</span>
                <span>SCAN YOUR MINIATURE</span>
              </Link>
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
