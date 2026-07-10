'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export function DailyAuguryBanner({ className }: { className?: string }) {
  const router = useRouter();
  const [playedToday, setPlayedToday] = useState(true); // Default to true to prevent flash
  
  useEffect(() => {
    try {
      const localDateStr = new Date().toLocaleDateString('en-CA');
      const saved = localStorage.getItem('schemestealer-daily-augury');
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlayedToday(parsed.lastPlayedDate === localDateStr && parsed.status !== 'playing');
      } else {
        setPlayedToday(false);
      }
    } catch (e) {
      setPlayedToday(false);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className={`w-full max-w-4xl mx-auto px-4 ${className ?? 'mt-8 mb-12'}`}
    >
      <button 
        onClick={() => router.push('/daily')}
        className="w-full relative group overflow-hidden rounded-sm border-2 border-[var(--cogitator-green)]/40 bg-[#0a0f0a] hover:bg-[var(--cogitator-green)]/10 transition-colors p-4 flex items-center justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,255,65,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] group-hover:animate-[shimmer_2s_infinite]" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center border border-[var(--cogitator-green)]/50 rounded-sm bg-black relative">
            <span className="text-[var(--cogitator-green)] text-2xl">👁</span>
            {!playedToday && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--cogitator-green)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--cogitator-green)]"></span>
              </span>
            )}
          </div>
          <div className="text-left">
            <h3 className="gothic-text text-xl text-[var(--cogitator-green)] mb-1">THE DAILY AUGURY</h3>
            <p className="tech-text text-xs text-[var(--cogitator-green)]/60">Identify the daily cogno-meme paint</p>
          </div>
        </div>
        
        <div className="relative z-10 hidden sm:flex items-center gap-2 px-4 py-2 bg-black/50 border border-[var(--cogitator-green)]/30">
          <span className="tech-text text-[var(--cogitator-green)] font-bold tracking-widest text-sm uppercase">
            {playedToday ? 'VIEW RECORD' : 'COMMENCE SCAN'}
          </span>
          <span className="text-[var(--cogitator-green)]">→</span>
        </div>
      </button>
    </motion.div>
  );
}
