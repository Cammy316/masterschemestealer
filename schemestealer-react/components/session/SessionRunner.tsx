'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import analytics from '@/lib/analytics';
import { GhostButton } from '@/components/shared/GhostButton';

// Default dry times (in minutes)
const DEFAULT_DRY_TIMES = {
  base: 0, // No dry time for base
  highlight: 0,
  shade: 15,
  wash: 20,
};

function formatTimeLeft(ms: number) {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function SessionRunner() {
  const router = useRouter();
  const activeSession = useAppStore(s => s.activeSession);
  const updateSessionStep = useAppStore(s => s.updateSessionStep);
  const setActiveSession = useAppStore(s => s.setActiveSession);
  
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Force re-render every second for timers
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!activeSession) {
      router.push('/');
    }
  }, [activeSession, router]);

  // Robust Wake Lock
  useEffect(() => {
    let wakeLock: any = null;
    const requestWakeLock = async () => {
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
      if (wakeLock !== null && document.visibilityState === 'visible') {
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

  // Handle snap scroll to update focused index
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = window.innerWidth * 0.8; // 80vw
    const newIndex = Math.round(scrollLeft / itemWidth);
    
    if (activeSession && newIndex >= 0 && newIndex < activeSession.colours.length) {
      setFocusedIndex(newIndex);
    }
  };

  const finishSession = () => {
    if (activeSession) {
      const start = new Date(activeSession.startedAt).getTime();
      const duration = Math.round((Date.now() - start) / 1000 / 60);
      analytics.trackSessionFinished(activeSession.scanId, duration);
      setActiveSession(null);
      router.push('/');
    }
  };

  if (!activeSession) {
    return <div className="min-h-screen bg-void-black text-[var(--cogitator-green)] flex items-center justify-center tech-text">NO ACTIVE SESSION</div>;
  }

  const focusedColour = activeSession.colours[focusedIndex];

  return (
    <div className="min-h-screen bg-void-black flex flex-col relative overflow-hidden text-[var(--cogitator-green)]">
      {/* Header */}
      <div className="pt-6 px-4 pb-2 border-b border-[var(--cogitator-green)]/30 flex justify-between items-center bg-black/50 backdrop-blur-sm z-10">
        <div>
          <h1 className="gothic-text text-xl tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">SESSION FORGE</h1>
          <p className="tech-text text-xs opacity-70">
            {activeSession.colours.length} TARGET{activeSession.colours.length !== 1 ? 'S' : ''} ACQUIRED
          </p>
        </div>
        <div className="flex items-center gap-3">
          {(!('Notification' in window) || Notification.permission !== 'granted') && (
            <button 
              onClick={requestNotificationPermission}
              className="px-3 py-1.5 border border-yellow-500/50 text-yellow-500 text-[10px] tech-text rounded-sm hover:bg-yellow-500/10 transition-colors"
            >
              ENABLE ALERTS
            </button>
          )}
          <button 
            onClick={finishSession}
            className="px-4 py-2 border border-red-500/50 text-red-400 text-xs tech-text rounded-sm hover:bg-red-500/10 transition-colors"
          >
            ABORT MISSION
          </button>
        </div>
      </div>

      {/* Horizontal Snap Scroll for Colours */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar py-6 z-10"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Padding items to center the first and last */}
        <div className="w-[10vw] flex-shrink-0 snap-center" />
        
        {activeSession.colours.map((colour, idx) => {
          const isFocused = idx === focusedIndex;
          return (
            <div 
              key={colour.colourIndex}
              className={`w-[80vw] flex-shrink-0 snap-center px-2 transition-all duration-300 ${isFocused ? 'opacity-100 scale-100' : 'opacity-40 scale-95'}`}
            >
              <div className="border border-[var(--cogitator-green)]/40 bg-black/40 p-4 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.1)] h-full flex flex-col items-center">
                <div className="text-xs uppercase tracking-widest opacity-60 mb-1">{colour.brand}</div>
                <div className="w-12 h-12 rounded-full border border-white/20 mb-3 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]" style={{ background: '#333' /* Ideally the target color hex could be mapped here if we stored it */ }} />
                <div className="font-bold text-sm tech-text text-center text-balance">
                  TARGET {colour.colourIndex + 1}
                </div>
              </div>
            </div>
          );
        })}
        
        <div className="w-[10vw] flex-shrink-0 snap-center" />
      </div>

      {/* Pagination indicators */}
      <div className="flex justify-center gap-2 mb-4 z-10">
        {activeSession.colours.map((_, idx) => (
          <div 
            key={idx} 
            className={`w-2 h-2 rounded-full transition-colors ${idx === focusedIndex ? 'bg-[var(--cogitator-green)] shadow-[0_0_5px_var(--cogitator-green)]' : 'bg-[var(--cogitator-green)]/20'}`}
          />
        ))}
      </div>

      {/* Smart Batching Banner */}
      {(() => {
        const dryingSteps = activeSession.colours.flatMap(c => 
          c.steps.filter(s => s.status === 'drying').map(s => ({ ...s, target: c.colourIndex + 1, colourIndex: c.colourIndex }))
        );
        
        if (dryingSteps.length === 0) return null;
        
        // Find pending small tasks in OTHER targets
        const pendingTasks = activeSession.colours.flatMap(c => 
          c.steps.filter(s => s.status === 'pending' && (s.role === 'base' || s.role === 'highlight')).map(s => ({ ...s, target: c.colourIndex + 1, colourIndex: c.colourIndex }))
        ).filter(t => !dryingSteps.some(d => d.colourIndex === t.colourIndex)); // Only suggest tasks on completely idle targets
        
        if (pendingTasks.length === 0) return null;
        
        const suggested = pendingTasks[0];
        
        return (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mx-4 mb-4 z-10 bg-[var(--imperial-gold)]/10 border border-[var(--imperial-gold)]/30 rounded-sm p-3 text-[var(--imperial-gold)]"
          >
            <div className="text-xs font-bold tracking-widest mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--imperial-gold)] animate-pulse" />
              WHILE THAT DRIES...
            </div>
            <p className="text-sm">
              You have time to apply the <span className="font-bold">{suggested.role}</span> for <span className="font-bold">Target {suggested.target}</span>.
            </p>
            <button 
              onClick={() => {
                setFocusedIndex(suggested.colourIndex);
                if (scrollContainerRef.current) {
                  const itemWidth = window.innerWidth * 0.8;
                  scrollContainerRef.current.scrollTo({ left: suggested.colourIndex * itemWidth, behavior: 'smooth' });
                }
              }}
              className="mt-2 text-xs border border-[var(--imperial-gold)]/50 px-3 py-1 rounded-sm hover:bg-[var(--imperial-gold)]/20 transition-colors"
            >
              JUMP TO TARGET {suggested.target}
            </button>
          </motion.div>
        );
      })()}

      {/* Vertical Steps Stack */}
      <div className="flex-1 overflow-y-auto px-4 pb-20 z-10">
        <AnimatePresence mode="wait">
          <motion.div 
            key={focusedIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col gap-3 max-w-lg mx-auto"
          >
            {focusedColour?.steps.map((step) => {
              const override = activeSession.dryTimeOverrides[step.role];
              const dryTimeMinutes = override !== undefined ? override : DEFAULT_DRY_TIMES[step.role];
              const hasTimer = dryTimeMinutes > 0;
              
              const isDone = step.status === 'done';
              const isDrying = step.status === 'drying';
              
              let timeLeftMs = 0;
              if (isDrying && step.dryUntil) {
                timeLeftMs = Math.max(0, step.dryUntil - Date.now());
                if (timeLeftMs === 0) {
                  // Timer popped
                  // Use setTimeout to avoid updating state during render
                  setTimeout(() => {
                    updateSessionStep(focusedColour.colourIndex, step.role, 'done');
                    analytics.trackStepCompleted(step.role, step.paintName);
                    notifyDryingComplete(step.paintName, step.role);
                  }, 0);
                }
              }

              const handleTap = () => {
                if (step.status === 'pending') {
                  if (hasTimer) {
                    const dryUntil = Date.now() + dryTimeMinutes * 60 * 1000;
                    updateSessionStep(focusedColour.colourIndex, step.role, 'drying', dryUntil);
                  } else {
                    updateSessionStep(focusedColour.colourIndex, step.role, 'done');
                    analytics.trackStepCompleted(step.role, step.paintName);
                  }
                } else if (step.status === 'drying') {
                  // Allow early completion
                  updateSessionStep(focusedColour.colourIndex, step.role, 'done');
                  analytics.trackStepCompleted(step.role, step.paintName);
                }
              };

              return (
                <button
                  key={step.role}
                  onClick={handleTap}
                  disabled={isDone}
                  className={`relative w-full p-4 rounded-sm border text-left flex items-center justify-between transition-all group overflow-hidden ${
                    isDone 
                      ? 'border-[var(--imperial-gold)] bg-[var(--imperial-gold)]/10 text-[var(--imperial-gold)]' 
                      : isDrying 
                        ? 'border-[var(--warning)] bg-[var(--warning)]/10 text-[var(--warning)] crt-flicker'
                        : 'border-[var(--cogitator-green)]/40 bg-[#0a0f0a] text-[var(--cogitator-green)] hover:bg-[var(--cogitator-green)]/10'
                  }`}
                >
                  {isDrying && (
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-[var(--warning)]/20 transition-all duration-1000 ease-linear"
                      style={{ 
                        width: `${100 - (timeLeftMs / (dryTimeMinutes * 60 * 1000) * 100)}%` 
                      }}
                    />
                  )}

                  <div className="relative z-10">
                    <div className="text-xs uppercase tracking-widest opacity-70 mb-1">{step.role}</div>
                    <div className="font-bold tech-text">{step.paintName}</div>
                  </div>

                  <div className="relative z-10 flex items-center gap-3">
                    {isDone ? (
                      <span className="text-[var(--imperial-gold)] drop-shadow-[0_0_8px_var(--imperial-gold)] font-bold tracking-widest text-sm">
                        PURIFIED
                      </span>
                    ) : isDrying ? (
                      <div className="flex flex-col items-end">
                        <span className="text-xs opacity-70 tracking-widest mb-1">DRYING</span>
                        <span className="font-mono font-bold text-lg">{formatTimeLeft(timeLeftMs)}</span>
                      </div>
                    ) : (
                      <span className="opacity-50 group-hover:opacity-100 tracking-widest text-sm transition-opacity">
                        {hasTimer ? 'START TIMER' : 'COMPLETE'}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Global Finish Button */}
      {activeSession.colours.every(c => c.steps.every(s => s.status === 'done')) && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-6 left-4 right-4 z-20"
        >
          <button
            onClick={finishSession}
            className="w-full py-4 bg-[var(--imperial-gold)] text-black font-bold uppercase tracking-widest tech-text rounded-sm shadow-[0_0_20px_rgba(255,184,0,0.5)] hover:brightness-110 transition-all"
          >
            CONCLUDE MISSION
          </button>
        </motion.div>
      )}
    </div>
  );
}
