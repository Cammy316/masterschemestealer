'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import proofSchemes from '@/lib/data/proof_schemes.json';
import { PAINT_DATABASE } from '@/lib/paintDatabase';

function RecipeProofStrip() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % proofSchemes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const scheme = proofSchemes[index];

  return (
    <div className="w-full mt-4 flex flex-col items-center opacity-80 max-w-sm mx-auto">
      <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-mono">{scheme.model}</p>
      
      <div className="flex w-full items-center justify-between text-xs font-mono">
        {/* Original */}
        <div className="flex gap-1">
          {scheme.originalPalette.map(id => {
            const p = PAINT_DATABASE.find(x => x.paint_id === id);
            return <div key={id} className="w-4 h-4 rounded-sm border border-black/50" style={{backgroundColor: p?.hex}} title={p?.name} />
          })}
        </div>
        
        <span className="text-gray-500 mx-2 text-[10px]">→</span>
        
        {/* Budget */}
        <div className="flex gap-1">
          {scheme.budgetPalette.map(id => {
            const p = PAINT_DATABASE.find(x => x.paint_id === id);
            return <div key={id} className="w-4 h-4 rounded-sm border border-black/50 shadow-[0_0_8px_rgba(212,175,55,0.4)]" style={{backgroundColor: p?.hex}} title={p?.name} />
          })}
        </div>
      </div>
      <div className="flex w-full justify-between mt-1 px-1">
        <span className="text-[8px] text-gray-500 uppercase tracking-widest">Citadel (£11.35)</span>
        <span className="text-[8px] text-[var(--imperial-gold)] uppercase tracking-widest font-bold">Vallejo/Army Painter (£7.65)</span>
      </div>
    </div>
  );
}

export function ModeSelector() {
  const router = useRouter();
  const setMode = useAppStore((state) => state.setMode);

  return (
    <div className="min-h-dvh flex flex-col bg-transparent relative overflow-x-hidden overflow-y-auto">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

      <div className="relative z-10 flex flex-col items-center flex-1 px-4 py-8">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 justify-center mb-2">
            <span className="text-amber-500/80 text-xl drop-shadow-md">⚙</span>
            <h1 className="font-bold gothic-text text-3xl md:text-5xl text-balance bg-[linear-gradient(to_bottom,var(--imperial-gold)_0%,var(--brass)_100%)] text-transparent bg-clip-text tracking-[0.15em] drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
              SCHEMESTEALER
            </h1>
            <span className="text-amber-500/80 text-xl drop-shadow-md">⚙</span>
          </div>
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto mb-4" />
          
          {/* Value Proposition */}
          <p className="text-gray-300 max-w-md mx-auto text-sm md:text-base leading-relaxed tracking-wide font-medium">
            Replicate <strong className="text-[var(--imperial-gold)]">any</strong> miniature painting scheme for half the price using the paints you already own.
          </p>
        </motion.div>

        {/* Hero Miniscan */}
        <motion.div
          className="w-full max-w-2xl mb-6 relative group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => {
              setMode('miniature');
              router.push('/miniature');
            }}
            className="w-full touch-target outline-none bg-[#051005] bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:20px_20px] rounded-xl border-4 border-t-[#3a4a3a] border-l-[#2a3a2a] border-r-[#1a2a1a] border-b-[#0a1a0a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)] hover:border-t-[#4a5a4a] hover:shadow-[inset_0_0_30px_rgba(0,255,65,0.15),0_10px_30px_rgba(0,255,65,0.2)] transition-all overflow-hidden flex flex-col items-center p-8 min-h-[40vh] justify-center relative"
          >
            {/* Corner Hazard Stripes */}
            <div className="absolute top-0 left-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(0_0,100%_0,0_100%)]" />
            <div className="absolute top-0 right-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(-45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(-45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(0_0,0_100%,100%_100%)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

            <div className="relative z-10 w-20 h-20 rounded-full bg-[var(--cogitator-green)]/10 border-2 border-[var(--cogitator-green)]/50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--cogitator-green)]/20 transition-all duration-300 shadow-[0_0_20px_rgba(0,255,65,0.2)]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                <circle cx="12" cy="13" r="4"></circle>
              </svg>
            </div>
            
            <h2 className="relative z-10 text-2xl md:text-3xl gothic-text text-[var(--cogitator-green)] tracking-widest drop-shadow-[0_0_8px_rgba(0,255,65,0.5)] mb-2">
              SCAN YOUR MINIATURE
            </h2>
            <p className="relative z-10 text-gray-400 text-sm font-mono tracking-widest uppercase opacity-80 mb-8">Initiate Auspex Protocol</p>

            <div className="relative z-10 w-full">
              <RecipeProofStrip />
            </div>
          </button>
        </motion.div>

        {/* Secondary Row */}
        <motion.div
          className="w-full max-w-2xl grid grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Inspiration Gallery */}
          <button
            onClick={() => {
              setMode('inspiration');
              router.push('/inspiration');
            }}
            className="flex flex-col items-center justify-center bg-[#0a001a] bg-[radial-gradient(circle_at_center,#1a0033_0%,#050011_100%)] border-4 border-t-[#cda85f] border-l-[#8b6d36] border-r-[#6a5020] border-b-[#4a3a1d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.5)] hover:border-t-[#dfba71] transition-all rounded-xl p-6 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.2)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="relative z-10 w-16 h-16 mb-4 flex items-center justify-center drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
              {/* Polaroid Fan Visual */}
              <div className="absolute w-12 h-14 bg-gray-200 rounded-sm border-[3px] border-white shadow-lg -rotate-12 group-hover:-rotate-[20deg] group-hover:-translate-x-2 transition-transform duration-300" />
              <div className="absolute w-12 h-14 bg-gray-300 rounded-sm border-[3px] border-white shadow-lg rotate-12 group-hover:rotate-[20deg] group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute w-12 h-14 bg-white rounded-sm border-[3px] border-white shadow-lg group-hover:scale-110 transition-transform duration-300 z-10 flex flex-col p-1">
                 <div className="flex-1 bg-[radial-gradient(circle_at_center,#4c1d95_0%,#1e1b4b_100%)] w-full overflow-hidden relative">
                   <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                 </div>
              </div>
            </div>
            <span className="relative z-10 text-[var(--warp-purple-light)] font-bold tracking-widest text-sm uppercase drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">Inspiration</span>
            <span className="relative z-10 text-[10px] text-[var(--imperial-gold)]/70 uppercase tracking-widest mt-1">Immaterium Conduit</span>
          </button>

          {/* Swatchle */}
          <button
            onClick={() => router.push('/daily')}
            className="flex flex-col items-center justify-center bg-[#1a110a] bg-[radial-gradient(ellipse_at_top,#2a1810_0%,#0a0805_100%)] border-4 border-t-[#8b5a2b] border-l-[#6a4220] border-r-[#4a2e16] border-b-[#2a1a0c] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.5)] hover:border-t-[#a36b35] transition-all rounded-xl p-6 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,184,0,0.1)_0%,transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/30 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,0.8)]" />
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">Live</span>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center mb-4 gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
               <div className="flex gap-1.5 text-sm">➡️ 🔼 🧊</div>
               <div className="flex gap-1.5 text-sm">🟩 🟩 🎯</div>
            </div>
            <span className="relative z-10 text-white font-bold tracking-widest text-sm uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">Swatchle</span>
            <span className="relative z-10 text-[10px] text-[var(--imperial-gold)] uppercase tracking-widest mt-1 font-bold">Play Today's Puzzle</span>
          </button>

        </motion.div>
      </div>
    </div>
  );
}
