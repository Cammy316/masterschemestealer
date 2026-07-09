'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PAINT_DATABASE, PaintData } from '@/lib/paintDatabase';
import { GuessAutocomplete } from './GuessAutocomplete';
import dailyPuzzles from '@/lib/data/daily_puzzles.json';
import { deltaE2000 } from '@/lib/deltaE';
import { DeltaEBadge } from '@/components/seo/DeltaEBadge';
import analytics from '@/lib/analytics';
import { StatsModal } from './StatsModal';
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

  const localDateStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
  const puzzle = dailyPuzzles.days[localDateStr as keyof typeof dailyPuzzles.days];
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

    const shareText = `The Daily Augury #${dayNumber}  ${score}/6  🔥${gameState.streak}\n\n${grid}\nhttps://schemestealer.com/daily`;

    analytics.trackDailyShared();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SchemeStealer Daily Augury',
          text: shareText,
        });
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }
    
    try {
      await navigator.clipboard.writeText(shareText);
      // Would ideally show a toast here
      alert("Copied results to clipboard!");
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  if (!mounted || !targetPaint) {
    return <div className="flex justify-center items-center h-64 text-[var(--cogitator-green)]">INITIALISING AUSPEX...</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col min-h-screen">
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="gothic-text text-[var(--cogitator-green)] text-3xl drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">The Daily Augury</h1>
        <button 
          onClick={() => setShowStats(true)}
          className="p-2 bg-[var(--cogitator-green)]/10 text-[var(--cogitator-green)] border border-[var(--cogitator-green)]/30 rounded-sm hover:bg-[var(--cogitator-green)]/20 transition-colors"
        >
          📊
        </button>
      </div>
      
      {/* Game Board */}
      <div className="flex-1">
        {/* Header row */}
        <div className="grid grid-cols-4 gap-2 mb-2 text-center text-xs font-mono text-[var(--cogitator-green)]/60 uppercase tracking-widest hidden md:grid">
          <div>Brand</div>
          <div>Family</div>
          <div>Lightness</div>
          <div>Match</div>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          {Array.from({ length: MAX_GUESSES }).map((_, i) => {
            const guess = gameState.guesses[i];
            
            if (!guess) {
              return (
                <div key={i} className="h-16 border border-[var(--cogitator-green)]/20 bg-black/30 rounded-sm flex items-center justify-center">
                  <span className="text-[var(--cogitator-green)]/10 font-mono text-xl">{i + 1}</span>
                </div>
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
                className="grid grid-cols-4 gap-2 h-16"
              >
                {/* 1. Brand */}
                <div className={`flex items-center justify-center border ${guess.brandMatch ? 'bg-[var(--cogitator-green)]/20 border-[var(--cogitator-green)] text-[var(--cogitator-green)]' : 'bg-red-900/20 border-red-500/50 text-red-400'} rounded-sm`}>
                  <div className="text-center">
                    <div className="text-xs opacity-70 mb-1">BRAND</div>
                    <div className="font-bold text-sm truncate px-1 max-w-full">{paint.brand}</div>
                  </div>
                </div>

                {/* 2. Family */}
                <div className={`flex items-center justify-center border ${
                  guess.familyMatch === 'exact' ? 'bg-[var(--cogitator-green)]/20 border-[var(--cogitator-green)] text-[var(--cogitator-green)]' : 
                  guess.familyMatch === 'adjacent' ? 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400' : 
                  'bg-red-900/20 border-red-500/50 text-red-400'
                } rounded-sm`}>
                  <div className="text-center">
                    <div className="text-xs opacity-70 mb-1">FAMILY</div>
                    <div className="font-bold text-sm truncate px-1 max-w-full capitalize">{paint.family || paint.colorFamily}</div>
                  </div>
                </div>

                {/* 3. Lightness */}
                <div className={`flex flex-col items-center justify-center border ${guess.lightnessDirection === 'match' ? 'bg-[var(--cogitator-green)]/20 border-[var(--cogitator-green)] text-[var(--cogitator-green)]' : 'bg-yellow-600/20 border-yellow-500/50 text-yellow-400'} rounded-sm`}>
                  <div className="text-xs opacity-70 mb-1">LIGHTNESS</div>
                  {guess.lightnessDirection === 'match' && <span className="font-bold">✓ MATCH</span>}
                  {guess.lightnessDirection === 'lighter' && <span className="font-bold">▲ GO LIGHTER</span>}
                  {guess.lightnessDirection === 'darker' && <span className="font-bold">▼ GO DARKER</span>}
                </div>

                {/* 4. Match Band */}
                <div className="flex items-center justify-center relative">
                  <div className="absolute top-1 left-2 text-[10px] opacity-70 z-10 tech-text">{paint.name}</div>
                  <DeltaEBadge deltaE={guess.deltaE} band={guess.deltaEBand} className="w-full h-full" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {gameState.status === 'playing' ? (
          <GuessAutocomplete onSelect={handleGuess} disabled={gameState.status !== 'playing'} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center p-6 border-2 border-[var(--imperial-gold)] bg-black/60 rounded-sm"
          >
            <h2 className="text-2xl gothic-text text-[var(--imperial-gold)] mb-4">
              {gameState.status === 'won' ? 'MISSION SUCCESSFUL' : 'MISSION FAILED'}
            </h2>
            <div className="flex items-center gap-4 mb-6">
              <motion.div 
                initial={{ filter: "blur(15px)" }}
                animate={{ filter: "blur(0px)" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="w-16 h-16 rounded-sm border-2 border-white/20" 
                style={{ backgroundColor: targetPaint.hex }} 
              />
              <div>
                <p className="text-sm text-gray-400 mb-1">TARGET COGNO-MEME IDENTIFIED:</p>
                <p className="text-xl font-bold text-white">{targetPaint.name}</p>
                <p className="text-[var(--imperial-gold)] tracking-widest uppercase">{targetPaint.brand}</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="bg-black/80 border border-gray-600 rounded-sm p-4 text-center font-mono text-xs whitespace-pre">
                <p className="text-[var(--cogitator-green)] mb-2">The Daily Augury #{Object.keys(dailyPuzzles.days).sort().indexOf(localDateStr) + 1} {gameState.status === 'won' ? gameState.guesses.length : 'X'}/6 🔥{gameState.streak}</p>
                {generateShareGrid(gameState.guesses)}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
              <button 
                onClick={handleShare}
                className="px-6 py-2 bg-[#2ea043] text-white font-bold rounded-sm flex items-center gap-2 hover:bg-[#3fb950] transition-colors"
              >
                <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor"><path fillRule="evenodd" d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zM6.379 5.227A.25.25 0 006 5.442v3.992a.25.25 0 00.379.214l3.12-1.996a.25.25 0 000-.428L6.379 5.227z"></path></svg>
                SHARE TACTICAL REPORT
              </button>
              
              <Link 
                href={`/paints/${targetPaint.brand.toLowerCase().replace(/[^a-z0-9]/g, '-')}/${targetPaint.paint_id}`}
                className="px-6 py-2 bg-transparent border border-gray-500 text-gray-300 font-bold rounded-sm hover:bg-white/5 transition-colors"
              >
                FULL DOSSIER ON THIS PAINT
              </Link>
            </div>
            
            <div className="mt-8 text-center border-t border-white/10 pt-6 w-full">
              <p className="text-gray-400 mb-4 font-mono text-sm">PROCEED TO PRIMARY OBJECTIVE?</p>
              <Link
                href="/miniature"
                className="px-8 py-3 bg-gradient-to-r from-[var(--imperial-gold)] to-[var(--brass)] text-black font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all inline-block shadow-lg"
              >
                SCAN YOUR OWN MINIATURE
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
      </AnimatePresence>
    </div>
  );
}
