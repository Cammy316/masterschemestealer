'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ColorPoint {
  x: number;
  y: number;
  color: string;
  name: string;
}

interface ActiveAuspexScanProps {
  localImageUrl: string | null;
  resultImageUrl?: string | null;
  isProcessing: boolean;
  showReveal: boolean;
  reticleData?: ColorPoint[];
  onRevealComplete?: () => void;
  progress?: number | null;
}

export function ActiveAuspexScan({
  localImageUrl,
  resultImageUrl,
  isProcessing,
  showReveal,
  reticleData = [],
  onRevealComplete,
  progress,
}: ActiveAuspexScanProps) {
  const [phase, setPhase] = useState<'loading' | 'wind-down' | 'wipe' | 'done'>('loading');
  const wipeControls = useAnimation();
  const [crosshairs, setCrosshairs] = useState<ColorPoint[]>([]);

  // Stable random sequences to satisfy React purity
  const dataSeq = React.useMemo(() => Math.random().toString(16).substring(2, 6).toUpperCase(), []);
  const loadSeqs = React.useMemo(() => [...Array(4)].map(() => Math.random().toString(36).substring(2, 8).toUpperCase()), []);
  const reticleSeqs = React.useMemo(() => 
    reticleData.map(() => Math.floor(Math.random()*65535).toString(16).toUpperCase().padStart(4, '0')), 
  [reticleData.length]);

  // Calculate actual normalized positions based on image aspect ratio
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [normalizedReticles, setNormalizedReticles] = useState<(ColorPoint & { id: string })[]>([]);

  // Timeout ids live in a ref cleared on UNMOUNT ONLY: `phase` is a dep of
  // the wipe effect, so a per-run cleanup would cancel the in-flight chain
  // the moment phase flips to 'wind-down'. The unmount clear also makes the
  // chain single-shot under StrictMode's dev double-invoke (mount → cleanup
  // → mount), which used to schedule TWO chains and fire onRevealComplete
  // twice — double-committing the scan and revoking its live blob URL.
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completedRef = useRef(false);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    if (showReveal && phase === 'loading') {
      setPhase('wind-down');

      // Calculate reticle positions based on actual rendered image size
      if (imgRef.current && containerRef.current) {
        const img = imgRef.current;
        const scaleX = img.clientWidth;
        const scaleY = img.clientHeight;

        const mapped = reticleData.map((r, i) => ({
          ...r,
          id: `reticle-${i}`,
          x: r.x * scaleX,
          y: r.y * scaleY,
        }));
        setNormalizedReticles(mapped);
      }

      // Start the wipe: wind-down beat → wipe → done → complete (once).
      timeoutsRef.current.push(setTimeout(() => {
        setPhase('wipe');

        // Spawn crosshairs based on Y-coordinate passing
        if (imgRef.current) {
          reticleData.forEach((r) => {
            // Rough estimate of when the sweep hits this point (0 to 3000ms)
            const yPercent = r.y / 1000;
            timeoutsRef.current.push(setTimeout(() => {
              setCrosshairs(prev => [...prev, r]);
            }, yPercent * 3000));
          });
        }

        // Complete
        timeoutsRef.current.push(setTimeout(() => {
          setPhase('done');
          timeoutsRef.current.push(setTimeout(() => {
            if (!completedRef.current) {
              completedRef.current = true;
              onRevealComplete?.();
            }
          }, 1000));
        }, 3200));
      }, 300));
    }
  }, [showReveal, phase, reticleData, wipeControls, onRevealComplete]);

  if (!localImageUrl && !resultImageUrl) return null;

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden flex justify-center border-2 border-cogitator-green/30 rounded shadow-[0_0_20px_rgba(0,255,65,0.1)] min-h-[300px]">
      
      {/* 
        LAYER 1: The Wireframe (Loading State) 
        This is always visible at the back.
      */}
      <div className="relative w-full h-full bg-[#030804]">
        {/* Safe, non-inverting green tint filter */}
        <div className="relative w-full h-full">
          <img 
            ref={imgRef}
            src={localImageUrl!} 
            alt="Scanning..." 
            className="w-full h-auto object-contain max-h-[60vh] opacity-30"
            style={{ filter: 'sepia(100%) hue-rotate(70deg) saturate(300%) brightness(0.5) contrast(200%)' }} 
          />
          
          {/* Volumetric Phosphor Sweep (Pure CSS animation to prevent main-thread freezing) */}
          {(phase === 'loading' || phase === 'wind-down') && (
            <div 
              className="absolute left-0 right-0 h-[150px] animate-[scan-line_2s_linear_infinite] pointer-events-none mix-blend-screen"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,255,65,0.05) 50%, rgba(0,255,65,0.4) 95%, rgba(0,255,65,0.9) 100%)',
              borderBottom: '3px solid var(--cogitator-green)',
              boxShadow: '0 10px 20px rgba(0, 255, 65, 0.4)'
            }}
          />
        )}

        {/* CRT Scanlines */}
        <div className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay" style={{ background: 'repeating-linear-gradient(to bottom, transparent, transparent 2px, #00FF41 2px, #00FF41 3px)' }} />
        
        {/* Heavy Vignette to shadow bright backgrounds */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 40%, #030804 90%)' }} />
        
        {/* Digital Data Crunching / Tactical Overlays */}
        {phase === 'loading' && (
          <div className="absolute inset-0 pointer-events-none p-2 flex flex-col justify-between">
            {/* Top Bar */}
            <div className="flex justify-between items-start text-[10px] text-cogitator-green font-mono">
              <div className="bg-black/50 px-2 py-1 border border-cogitator-green/30 backdrop-blur-sm">
                {progress ? (
                  <div>DOWNLOADING PATTERNS... {Math.round(progress * 100)}%</div>
                ) : (
                  <div className="animate-pulse">
                    EXTRACTING CHROMATIC DATA...<br/>
                    <span className="opacity-70">0x{dataSeq}</span>
                  </div>
                )}
              </div>
              <div className="bg-black/50 px-2 py-1 border border-cogitator-green/30 backdrop-blur-sm text-right">
                <span className="opacity-70">TARGET LOCK</span><br/>
                <span className="animate-pulse">ACQUIRING</span>
              </div>
            </div>
            
            {/* Bottom Bar */}
            <div className="flex justify-between items-end text-[9px] text-cogitator-green-dim font-mono">
              <div className="flex flex-col gap-0.5">
                {loadSeqs.map((seq, i) => (
                  <div key={i} className="opacity-50">SEQ_{i}: {seq}</div>
                ))}
              </div>
              <div className="text-right">
                <div className="opacity-50">SYS.OP: NOMINAL</div>
                <div className="opacity-50">TEMP: 34.2C</div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* 
        LAYER 2: The Final Reveal Wipe 
        This overlay drops down, revealing the full color image (resultImageUrl)
      */}
      {(phase === 'wipe' || phase === 'done') && (
        <motion.div 
          className="absolute top-0 left-0 w-full overflow-hidden border-b-[3px] border-cogitator-green shadow-[0_5px_20px_var(--cogitator-green)]"
          initial={{ height: '0%' }}
          animate={{ height: '100%' }}
          transition={{ duration: 3, ease: 'linear' }}
          style={{ zIndex: 10 }}
        >
          <img 
            src={resultImageUrl || localImageUrl!} 
            alt="Result" 
            className="w-full h-auto object-contain max-h-[60vh]"
          />
          
          {/* High-Tech Neon Grid Overlay */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(0,255,65,0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,255,65,0.3) 1px, transparent 1px),
                linear-gradient(to right, rgba(0,255,65,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(0,255,65,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
              backgroundPosition: 'center'
            }}
          />
          
          {/* Inner pulse glow on the revealed area */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,255,65,0.2)] border border-cogitator-green/30" />

          {/* Sweeping Scanner Bar (anchored to the bottom of the wipe) */}
          <div className="absolute bottom-0 left-0 right-0 h-[50px] pointer-events-none mix-blend-screen"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,255,65,0.8))',
              borderBottom: '3px solid var(--cogitator-green)',
              boxShadow: '0 10px 30px rgba(0, 255, 65, 0.8)'
            }}
          />
        </motion.div>
      )}

      {/* 
        LAYER 3: Crosshairs & Lock-ons 
      */}
      {(phase === 'wipe' || phase === 'done') && normalizedReticles.map((reticle, index) => {
        const isActive = crosshairs.includes(reticleData[index]);
        if (!isActive) return null;
        
        return (
          <motion.div
            key={reticle.id}
            className="absolute z-20 pointer-events-none flex items-center gap-2"
            style={{ left: reticle.x, top: reticle.y }}
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
          >
            {/* Crosshair Target */}
            <div className="relative w-8 h-8 -translate-x-4 -translate-y-4">
              <div className="absolute inset-0 border-2 border-cogitator-green rounded-full animate-ping opacity-20" style={{ animationDuration: '1s' }} />
              <div className="absolute inset-0 border-2 border-cogitator-green opacity-80" />
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-cogitator-green -translate-y-1/2" />
              <div className="absolute left-1/2 top-0 w-[2px] h-full bg-cogitator-green -translate-x-1/2" />
              <div className="absolute inset-2 bg-cogitator-green/50 rounded-full" />
            </div>
            
            {/* Decoded Text */}
            <motion.div 
              className="bg-black/80 border border-cogitator-green/50 px-2 py-1 whitespace-nowrap"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-[10px] text-cogitator-green-dim font-mono mb-[2px]">0x{reticleSeqs[index] || 'A1B2'} {'->'}</div>
              <div className="text-xs text-cogitator-green font-bold font-mono tracking-widest">{reticle.name.toUpperCase()}</div>
            </motion.div>
          </motion.div>
        );
      })}

      {/* Flash effect on completion */}
      {phase === 'done' && (
        <motion.div 
          className="absolute inset-0 bg-cogitator-green z-30 mix-blend-screen"
          initial={{ opacity: 0.8 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      )}
    </div>
  );
}
