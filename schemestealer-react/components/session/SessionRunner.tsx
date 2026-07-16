'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import analytics from '@/lib/analytics';
import dataslateContent from '@/lib/data/dataslate_content.json';

// Default dry times (in minutes) per the new plan
const DEFAULT_DRY_TIMES = {
  base: 3, // Rapid cure for base coats
  highlight: 0,
  shade: 15,
  wash: 15, // 15m for depth layer
};

function formatTimeLeft(ms: number) {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Scramble text effect for Dataslate
function ScrambleText({ text }: { text: string }) {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    const interval = setInterval(() => {
      setDisplay(
        text.split('')
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1;
    }, 20);
    return () => clearInterval(interval);
  }, [text]);

  return <span>{display}</span>;
}

export function SessionRunner() {
  const router = useRouter();
  const activeSession = useAppStore(s => s.activeSession);
  const updateSessionStep = useAppStore(s => s.updateSessionStep);
  const setActiveSession = useAppStore(s => s.setActiveSession);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [tick, setTick] = useState(0);
  const [dataslateEntry, setDataslateEntry] = useState<{ text: string; attribution?: string } | null>(null);
  // SSR renders the empty state (no localStorage); gate the main branch on mount so
  // the client's first render matches and hydration never mismatches.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dataslate rotator — shuffled deck, so nothing repeats until the whole
  // pool has been shown (the old random pick could show the same entry twice
  // in a row). Randomness stays inside the effect for hydration safety.
  useEffect(() => {
    const pool: { text: string; attribution?: string }[] = [
      ...dataslateContent.painting_tips.map((text) => ({ text })),
      ...dataslateContent.lore_quotes,
    ];
    let deck: number[] = [];
    let pos = 0;
    const reshuffle = () => {
      const last = deck[deck.length - 1];
      do {
        deck = pool.map((_, i) => i);
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
      } while (pool.length > 1 && deck[0] === last);
      pos = 0;
    };
    reshuffle();
    setDataslateEntry(pool[deck[pos++]]);

    const interval = setInterval(() => {
      if (pos >= deck.length) reshuffle();
      setDataslateEntry(pool[deck[pos++]]);
    }, 20000); // cycle every 20s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Robust Wake Lock
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
      // Idempotent: skip when a lock is already held.
      if (wakeLock && wakeLock.released === false) return;
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await (navigator as any).wakeLock.request('screen');
        }
      } catch (err) {
        console.error('Wake Lock error:', err);
      }
    };

    requestWakeLock();

    const handleVisibilityChange = () => {
      // Retry on every return to visibility — the old `wakeLock !== null`
      // guard meant a failed INITIAL request was never retried.
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock !== null) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);

  // Hook must run unconditionally (before any early return) or finishing/aborting a
  // session changes the hook count mid-render and React throws.
  const allSteps = useMemo(() => {
    return (activeSession?.colours ?? []).flatMap(c =>
      c.steps.map(s => ({ ...s, colourIndex: c.colourIndex, target: c.colourIndex + 1, hex: c.hex, brand: c.brand }))
    );
  }, [activeSession]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      setNotificationsEnabled(true);
      analytics.trackNotificationOptIn();
    }
  };

  const notifyDryingComplete = async (paintName: string, role: string) => {
    if (notificationsEnabled || ('Notification' in window && Notification.permission === 'granted')) {
      const title = 'Phase Complete';
      const options = {
        body: `The ${role} for ${paintName} has finished drying.`,
        icon: '/icon512_maskable.png',
        data: { url: '/session' }
      };

      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, options);
        } catch (e) {
          new Notification(title, options);
        }
      } else {
        new Notification(title, options);
      }
    }
  };

  // Reconcile drying timers
  useEffect(() => {
    if (!activeSession) return;
    activeSession.colours.forEach((colour) => {
      colour.steps.forEach((step) => {
        if (step.status === 'drying' && step.dryUntil && step.dryUntil - Date.now() <= 0) {
          updateSessionStep(colour.colourIndex, step.role, 'done');
          analytics.trackStepCompleted(step.role, step.paintName);
          // Only notify for timers that JUST finished — reopening a tab hours
          // later must not fire a burst of stale notifications at once.
          const overdueMs = Date.now() - step.dryUntil;
          if (overdueMs < 60_000) {
            notifyDryingComplete(step.paintName, step.role);
          }
        }
      });
    });
  }, [tick, activeSession]);

  const finishSession = () => {
    if (activeSession) {
      const start = new Date(activeSession.startedAt).getTime();
      const duration = Math.round((Date.now() - start) / 1000 / 60);
      analytics.trackSessionFinished(activeSession.scanId, duration);
      setActiveSession(null);
      router.push('/');
    }
  };

  // allSteps.length === 0 also guards a degenerate session (no steps), which would
  // otherwise render NaN% completion and an instant MISSION SUCCESS.
  if (!mounted || !activeSession || allSteps.length === 0) {
    return (
      <div className="flex-1 bg-void-black text-[var(--cogitator-green)] flex flex-col gap-6 items-center justify-center tech-text px-6">
        <span>NO ACTIVE SESSION</span>
        <button
          onClick={() => router.push('/')}
          className="touch-target px-6 border border-[var(--cogitator-green)]/50 rounded-sm hover:bg-[var(--cogitator-green)]/10 transition-colors tracking-widest"
        >
          RETURN TO BASE
        </button>
      </div>
    );
  }

  // Phase computation
  const baseSteps = allSteps.filter(s => s.role === 'base');
  const depthSteps = allSteps.filter(s => s.role === 'shade' || s.role === 'wash');
  const highlightSteps = allSteps.filter(s => s.role === 'highlight');

  const baseDone = baseSteps.every(s => s.status === 'done');
  const depthDone = depthSteps.every(s => s.status === 'done');
  const highlightDone = highlightSteps.every(s => s.status === 'done');

  let currentPhase = 1;
  let phaseTitle = 'PHASE I: FOUNDATION';
  let activeSteps = baseSteps;
  
  if (baseDone) {
    if (depthDone) {
      if (highlightDone) {
        currentPhase = 4;
        phaseTitle = 'MISSION SUCCESS';
      } else {
        currentPhase = 3;
        phaseTitle = 'PHASE III: BRILLIANCE';
        activeSteps = highlightSteps;
      }
    } else {
      currentPhase = 2;
      phaseTitle = 'PHASE II: DEPTH';
      activeSteps = depthSteps;
    }
  }

  const completedStepsCount = allSteps.filter(s => s.status === 'done').length;
  const progressPercent = (completedStepsCount / allSteps.length) * 100;
  
  // Is the current phase fully in an "Idle Curing" state?
  const isIdleCuring = activeSteps.length > 0 && activeSteps.every(s => s.status === 'done' || s.status === 'drying');
  // Find max dry time left in current phase
  let maxDryLeft = 0;
  activeSteps.forEach(s => {
    if (s.status === 'drying' && s.dryUntil) {
      const left = s.dryUntil - Date.now();
      if (left > maxDryLeft) maxDryLeft = left;
    }
  });

  return (
    <div className="flex-1 bg-void-black flex flex-col relative text-[var(--cogitator-green)] font-sans">
      {/* Header with Progress Bar */}
      {/* page-local stacking only (z-10/z-20 here order content over the backdrop); overlay chrome uses the --z-* tokens */}
      <div className="pt-6 px-4 pb-4 border-b border-[var(--cogitator-green)]/30 bg-black/80 backdrop-blur-md z-20 sticky top-0">
        {/* flex-wrap: at ≤340px the title + buttons exceed the row width — the old
            root overflow-hidden CLIPPED the ABORT button off-screen; wrapping keeps
            both reachable. */}
        <div className="flex flex-wrap justify-between items-center gap-y-2 mb-3">
          <div>
            <h1 className="gothic-text text-xl tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">
              {phaseTitle}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {(!('Notification' in window) || Notification.permission !== 'granted') && (
              <button
                onClick={requestNotificationPermission}
                className="touch-target px-3 border border-yellow-500/50 text-yellow-500 text-[11px] tech-text rounded-sm hover:bg-yellow-500/10 transition-colors"
              >
                ENABLE ALERTS
              </button>
            )}
            <button
              onClick={finishSession}
              className="touch-target px-3 py-1 border border-red-500/50 text-red-400 text-[11px] tech-text rounded-sm hover:bg-red-500/10 transition-colors"
            >
              ABORT
            </button>
          </div>
        </div>
        
        {/* Mission Readiness Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between text-[11px] tech-text mb-1 opacity-80">
            <span>MISSION COMPLETION</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-black border border-[var(--cogitator-green)]/30 rounded-sm overflow-hidden relative">
            <motion.div 
              className="absolute top-0 left-0 bottom-0 bg-[var(--cogitator-green)] shadow-[0_0_10px_var(--cogitator-green)]"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {currentPhase === 4 ? (
        /* MISSION SUCCESS SCREEN */
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 flex flex-col z-10"
        >
          {/* my-auto centres when there is room; when the viewport is short
              (landscape phones) the body scrolls instead of clipping. */}
          <div className="my-auto flex flex-col items-center p-6 text-center w-full">
            <div className="w-32 h-32 mb-6 rounded-full border-4 border-[var(--imperial-gold)] shadow-[0_0_40px_var(--imperial-gold)] flex items-center justify-center">
              <span className="text-6xl">🏆</span>
            </div>
            <h2 className="gothic-text text-4xl text-[var(--imperial-gold)] drop-shadow-[0_0_10px_var(--imperial-gold)] mb-2">
              MISSION SUCCESS
            </h2>
            <p className="tech-text text-lg opacity-80 mb-8">
              Total Session Time: {Math.round((Date.now() - new Date(activeSession.startedAt).getTime()) / 60000)} minutes
            </p>
            <button
              onClick={finishSession}
              className="w-full max-w-sm py-4 bg-[var(--imperial-gold)] text-black font-bold uppercase tracking-widest tech-text rounded-sm shadow-[0_0_20px_rgba(255,184,0,0.5)] hover:brightness-110 transition-all"
            >
              RETURN TO BASE
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col px-4 py-6 z-10">
          {isIdleCuring && maxDryLeft > 0 ? (
            /* IDLE CURING SCREEN (Dataslate) */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="w-32 h-32 mb-6 relative">
                <div className="absolute inset-0 border-4 border-[var(--warning)] rounded-full border-t-transparent animate-spin" style={{ animationDuration: '3s' }} />
                <div className="absolute inset-2 border-2 border-[var(--warning)]/50 rounded-full border-b-transparent animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }} />
                <div className="absolute inset-0 flex items-center justify-center tech-text text-xl font-bold text-[var(--warning)] drop-shadow-[0_0_8px_var(--warning)]">
                  {formatTimeLeft(maxDryLeft)}
                </div>
              </div>
              <h3 className="tech-text text-xl text-[var(--warning)] tracking-widest mb-8">IDLE CURING</h3>
              
              <div className="w-full max-w-md lg:max-w-xl bg-black/60 border border-[var(--cogitator-green)]/30 p-6 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--cogitator-green)] to-transparent opacity-50" />
                <div className="text-[11px] tech-text text-[var(--cogitator-green)]/60 mb-3 uppercase tracking-widest border-b border-[var(--cogitator-green)]/20 pb-2">
                  <ScrambleText text="DATALINK ESTABLISHED // TRANSMISSION INCOMING" />
                </div>
                <div className="min-h-[100px] flex flex-col items-center justify-center">
                  <p className="font-serif italic text-lg leading-relaxed text-[var(--cogitator-green)]/90 text-center text-balance">
                    {dataslateEntry?.attribution ? `"${dataslateEntry.text}"` : dataslateEntry?.text}
                  </p>
                  {dataslateEntry?.attribution && (
                    <p className="w-full text-right text-[11px] tech-text text-[var(--cogitator-green)]/50 mt-2 uppercase tracking-widest">
                      — {dataslateEntry.attribution}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            /* ACTIVE CHECKLIST */
            <div className="flex flex-col gap-4 max-w-lg lg:max-w-2xl mx-auto w-full">
              <AnimatePresence>
                {activeSteps.map((step, idx) => {
                  const override = activeSession.dryTimeOverrides[step.role];
                  const dryTimeMinutes = override !== undefined ? override : DEFAULT_DRY_TIMES[step.role];
                  const hasTimer = dryTimeMinutes > 0;
                  
                  const isDone = step.status === 'done';
                  const isDrying = step.status === 'drying';
                  
                  let timeLeftMs = 0;
                  if (isDrying && step.dryUntil) {
                    timeLeftMs = Math.max(0, step.dryUntil - Date.now());
                  }

                  const handleTap = () => {
                    if (step.status === 'pending') {
                      if (hasTimer) {
                        const dryUntil = Date.now() + dryTimeMinutes * 60 * 1000;
                        updateSessionStep(step.colourIndex, step.role, 'drying', dryUntil);
                      } else {
                        updateSessionStep(step.colourIndex, step.role, 'done');
                        analytics.trackStepCompleted(step.role, step.paintName);
                      }
                    } else if (step.status === 'drying') {
                      updateSessionStep(step.colourIndex, step.role, 'done');
                      analytics.trackStepCompleted(step.role, step.paintName);
                    }
                  };

                  return (
                    <motion.button
                      key={`${step.colourIndex}-${step.role}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={handleTap}
                      disabled={isDone}
                      className={`relative w-full p-4 rounded-sm border text-left flex items-center justify-between transition-all group overflow-hidden ${
                        isDone 
                          ? 'border-[var(--imperial-gold)] bg-[var(--imperial-gold)]/10 text-[var(--imperial-gold)]' 
                          : isDrying
                            ? 'border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--warning)]'
                            : 'border-[var(--cogitator-green)]/40 bg-[#0a0f0a] text-[var(--cogitator-green)] hover:bg-[var(--cogitator-green)]/20 shadow-[0_0_10px_rgba(0,255,65,0.05)] hover:shadow-[0_0_15px_rgba(0,255,65,0.2)]'
                      }`}
                    >
                      {/* Particle explosion effect hack: when clicking pending->done, we could render a CSS animation, but styling handles the flash. */}
                      {isDrying && (
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-[var(--warning)]/20 transition-all duration-1000 ease-linear"
                          style={{ width: `${100 - (timeLeftMs / (dryTimeMinutes * 60 * 1000) * 100)}%` }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-4">
                        {/* Target Indicator */}
                        <div className="flex flex-col items-center justify-center border-r border-current/20 pr-4">
                          <span className="text-[11px] tech-text opacity-70 mb-1">TARGET</span>
                          <span className="font-bold text-lg">{step.target}</span>
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 rounded-full border border-current/50" style={{ background: step.hex ?? '#333' }} />
                            <div className="text-[11px] uppercase tracking-widest opacity-70">{step.brand}</div>
                          </div>
                          <div className="font-bold tech-text text-sm sm:text-base">{step.paintName}</div>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center gap-3">
                        {isDone ? (
                          <span className="text-[var(--imperial-gold)] drop-shadow-[0_0_8px_var(--imperial-gold)] font-bold tracking-widest text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            APPLIED
                          </span>
                        ) : isDrying ? (
                          <div className="flex flex-col items-end">
                            <span className="text-[11px] opacity-70 tracking-widest mb-1">CURING</span>
                            <span className="font-mono font-bold text-base">{formatTimeLeft(timeLeftMs)}</span>
                          </div>
                        ) : (
                          <span className="opacity-60 group-hover:opacity-100 tracking-widest text-xs transition-opacity border border-current/30 px-3 py-2 rounded-sm bg-current/5 whitespace-nowrap">
                            {hasTimer ? `APPLY (${dryTimeMinutes}m)` : 'MARK APPLIED'}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>

              {/* Persistent small dataslate ticker at bottom of active list */}
              {!isIdleCuring && (
                <div className="mt-8 mb-4 border border-[var(--cogitator-green)]/20 bg-black/40 p-4 rounded-sm">
                  <div className="flex items-center gap-2 mb-2 text-[var(--cogitator-green)]/50 text-[11px] tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--cogitator-green)]/50 animate-pulse" />
                    DATA SLATE ACTIVE
                  </div>
                  <p className="font-serif italic text-sm leading-relaxed text-[var(--cogitator-green)]/70 text-center">
                    {dataslateEntry?.attribution ? `"${dataslateEntry.text}"` : dataslateEntry?.text}
                  </p>
                  {dataslateEntry?.attribution && (
                    <p className="text-right text-[11px] tech-text text-[var(--cogitator-green)]/40 mt-2 uppercase tracking-widest">
                      — {dataslateEntry.attribution}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
