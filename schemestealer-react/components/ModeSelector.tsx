/**
 * ModeSelector - Imperial Command Terminal / Mission Select
 * Professional two-column layout with W40K theming
 */

'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import type { ScanMode } from '@/lib/types';
import { GrimdarkSkullIcon } from '@/components/icons/GrimdarkSkull';

export function ModeSelector() {
  const router = useRouter();
  const setMode = useAppStore((state) => state.setMode);

  const handleModeSelect = (mode: ScanMode) => {
    setMode(mode);
    router.push(`/${mode}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent relative overflow-x-hidden overflow-y-auto">
      {/* Vignette effect */}
      <div
        className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 py-4">
        {/* System Status Indicator */}
        <motion.div
          className="mb-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-green-500/30 rounded-full bg-black/50">
            <span className="pulse-glow text-green-400 w-1.5 h-1.5 rounded-full bg-green-400" aria-hidden />
            <span className="text-green-500 text-xs font-mono tracking-wider">
              {'>'} MACHINE SPIRIT STATUS: <span className="text-green-400">ACTIVE</span>
            </span>
          </div>
        </motion.div>

        {/* Header - Compact and Responsive */}
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div className="flex flex-col items-center mb-2">
            <div className="flex items-center gap-3">
              <span className="text-amber-500/80 text-2xl drop-shadow-md">⚙</span>
              <h1
                className="font-bold gothic-text text-[clamp(1.5rem,6vw,3rem)] text-balance bg-[linear-gradient(to_bottom,var(--imperial-gold)_0%,var(--brass)_100%)] text-transparent bg-clip-text drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)] tracking-[0.15em]"
              >
                SCHEMESTEALER
              </h1>
              <span className="text-amber-500/80 text-2xl drop-shadow-md">⚙</span>
            </div>
            <div className="h-px w-64 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mt-3"></div>
          </motion.div>
          <motion.p
            className="text-brass/70 tech-text responsive-label"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Chromatic Analysis & Pattern Recognition System
          </motion.p>
        </motion.div>

        {/* Mission Select Cards - Stack on mobile, side-by-side on desktop */}
        <motion.div
          className="w-full max-w-4xl flex flex-col md:flex-row gap-6 mb-4 overflow-visible px-4 md:px-0 min-h-[60vh]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {/* Miniscan Card - Left (The Dataslate) */}
          <motion.button
            onClick={() => handleModeSelect('miniature')}
            className="group relative rounded-xl overflow-hidden flex-1 touch-target outline-none bg-[#051005] bg-[linear-gradient(rgba(0,255,65,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,65,0.03)_1px,transparent_1px)] bg-[size:20px_20px] border-4 border-t-[#3a4a3a] border-l-[#2a3a2a] border-r-[#1a2a1a] border-b-[#0a1a0a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_20px_rgba(0,0,0,0.5)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Corner Hazard Stripes */}
            <div className="absolute top-0 left-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(0_0,100%_0,0_100%)]" />
            <div className="absolute top-0 right-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(-45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(0_0,100%_0,100%_100%)]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(-45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(0_0,0_100%,100%_100%)]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 opacity-70 pointer-events-none z-20 bg-[repeating-linear-gradient(45deg,#000_0,#000_4px,#ffb800_4px,#ffb800_8px)] [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

            {/* Rivets */}
            <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)] z-30 pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)] z-30 pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)] z-30 pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#111] shadow-[0_1px_1px_rgba(255,255,255,0.2)] z-30 pointer-events-none" />

            {/* Hover Scanner Beam (Robust CSS Animation) */}
            {/* Visible on mobile by default, full opacity on desktop hover */}
            <div className="absolute inset-x-0 h-1 bg-[var(--cogitator-green)] opacity-40 md:opacity-0 md:group-hover:opacity-80 z-10 blur-sm pointer-events-none" style={{ top: '-10%', animation: 'scanBeam 3s linear infinite' }} />
            <div className="absolute inset-x-0 h-1 bg-[#fff] opacity-60 md:opacity-0 md:group-hover:opacity-100 z-10 pointer-events-none shadow-[0_0_20px_var(--cogitator-green)]" style={{ top: '-10%', animation: 'scanBeam 3s linear infinite' }} />
            
            <style>{`
              @keyframes scanBeam {
                0% { top: -10%; }
                100% { top: 110%; }
              }
            `}</style>

            {/* Content container */}
            <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full">
              
              {/* High-Fidelity Servo-Skull Icon */}
              <div className="mb-4">
                <svg width="72" height="72" viewBox="0 0 100 100" fill="none" className="drop-shadow-[0_0_15px_rgba(0,255,65,0.2)] group-hover:drop-shadow-[0_0_25px_rgba(0,255,65,0.5)] transition-all duration-300">
                  <path d="M50 15 C30 15 20 30 20 45 C20 55 25 65 35 70 L35 80 L65 80 L65 70 C75 65 80 55 80 45 C80 30 70 15 50 15Z" fill="url(#dataslateSkull)" stroke="#1a1a1a" strokeWidth="2" />
                  {/* Stylized Neon Servo-Skull */}
                  
                  {/* Thick Mechanical Cables */}
                  <path d="M35 70 Q 20 85 30 100" stroke="#020617" strokeWidth="6" fill="none" />
                  <path d="M40 70 Q 30 85 45 100" stroke="#1e293b" strokeWidth="3" fill="none" strokeDasharray="3 3" />
                  <path d="M65 70 Q 80 85 70 100" stroke="#020617" strokeWidth="6" fill="none" />
                  
                  {/* Skull Base - Clean, bone-white, highly recognizable */}
                  <path d="M20 45 C 20 15, 80 15, 80 45 C 80 65, 70 85, 65 85 L 35 85 C 30 85, 20 65, 20 45 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="3" />
                  
                  {/* Metallic Forehead Plate */}
                  <path d="M30 20 Q 50 10 70 20 L 65 30 Q 50 25 35 30 Z" fill="#64748b" stroke="#0f172a" strokeWidth="2" />
                  <circle cx="50" cy="21" r="2" fill="#0f172a" />
                  
                  {/* Left Eye Socket (Hollow) */}
                  <ellipse cx="65" cy="48" rx="7" ry="9" fill="#0f172a" />
                  
                  {/* Massive Bionic Right Eye (Neon Green) */}
                  {/* Outer casing */}
                  <circle cx="35" cy="50" r="16" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
                  {/* Inner Lens */}
                  <circle cx="35" cy="50" r="12" fill="#020617" />
                  {/* Neon Glow Ring */}
                  <circle cx="35" cy="50" r="12" fill="none" stroke="var(--cogitator-green)" strokeWidth="2" opacity="0.8" className="drop-shadow-[0_0_5px_rgba(0,255,65,1)]" />
                  {/* Neon Core Pupil */}
                  <circle cx="35" cy="50" r="6" fill="var(--cogitator-green)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  {/* Lens glare */}
                  <circle cx="32" cy="47" r="2.5" fill="#fff" opacity="0.9" />
                  
                  {/* Nostril Cavity */}
                  <path d="M47 62 L 53 62 L 55 72 L 45 72 Z" fill="#0f172a" />

                  {/* Jaw / Teeth Grid */}
                  <path d="M35 78 L 65 78 L 60 85 L 40 85 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="2" />
                  <line x1="45" y1="78" x2="45" y2="85" stroke="#0f172a" strokeWidth="2" />
                  <line x1="50" y1="78" x2="50" y2="85" stroke="#0f172a" strokeWidth="2" />
                  <line x1="55" y1="78" x2="55" y2="85" stroke="#0f172a" strokeWidth="2" />
                  
                  {/* Cybernetic Antenna */}
                  <line x1="80" y1="45" x2="90" y2="40" stroke="#0f172a" strokeWidth="3" />
                  <circle cx="90" cy="40" r="2" fill="var(--cogitator-green)" className="drop-shadow-[0_0_3px_rgba(0,255,65,1)]" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="responsive-section-title font-bold gothic-text mb-1 drop-shadow-[0_0_10px_rgba(0,255,65,0.5)]" style={{ color: 'var(--cogitator-green)' }}>
                MINISCAN
              </h2>
              <p className="text-[var(--cogitator-green)]/60 responsive-label mb-2 tracking-[0.2em] uppercase">Protocol</p>

              <p className="text-gray-400 responsive-label text-center mb-4 leading-relaxed max-w-[200px]">
                Identify paints on your miniatures via pict-capture
              </p>

              <div className="px-4 py-2 border-2 border-[var(--cogitator-green)]/30 rounded bg-black/40 group-hover:bg-[var(--cogitator-green)]/10 group-hover:border-[var(--cogitator-green)] transition-colors duration-300">
                <span className="text-[var(--cogitator-green)] font-bold cyber-text tracking-widest text-sm drop-shadow-[0_0_5px_rgba(0,255,65,0.8)]">
                  INITIATE SCAN
                </span>
              </div>
            </div>
          </motion.button>

          {/* Inspiration Card - Right (The Reliquary) */}
          <motion.button
            onClick={() => handleModeSelect('inspiration')}
            className="group relative rounded-xl overflow-hidden flex-1 touch-target outline-none bg-[#0a001a] bg-[radial-gradient(circle_at_center,#1a0033_0%,#050011_100%)] border-4 border-t-[#cda85f] border-l-[#8b6d36] border-r-[#6a5020] border-b-[#4a3a1d] shadow-[inset_0_0_40px_rgba(0,0,0,0.9),0_10px_20px_rgba(0,0,0,0.5)]"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Space / Portal Background */}
            <div 
              className="absolute inset-0 z-0 pointer-events-none opacity-60 bg-[radial-gradient(circle_at_50%_30%,#6b21a8_0%,#2e1065_40%,#050011_80%)]"
            />

            {/* Background Flash (Desktop Hover Only) */}
            <div 
              className="absolute inset-0 bg-[#4c1d95]/40 mix-blend-screen opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10"
              style={{ animation: 'warpFlash 2s infinite' }}
            />
            
            <style>{`
              .lightning {
                stroke-dasharray: 100;
                stroke-dashoffset: 100;
                animation: strike 2.5s infinite;
              }
              .lightning-delay-1 { animation-delay: 0.5s; }
              .lightning-delay-2 { animation-delay: 1.2s; }
              
              @keyframes strike {
                0% { stroke-dashoffset: 100; opacity: 1; }
                15% { stroke-dashoffset: 0; opacity: 1; }
                20% { opacity: 0; }
                25% { opacity: 1; }
                30% { opacity: 0; }
                100% { stroke-dashoffset: 0; opacity: 0; }
              }
              
              @keyframes warpFlash {
                0%, 85%, 100% { opacity: 0; }
                90% { opacity: 0.8; }
                92% { opacity: 0.2; }
                95% { opacity: 1; }
              }
            `}</style>
            
            {/* Content container */}
            <div className="relative z-20 p-6 flex flex-col items-center justify-center h-full">
              
              {/* Eye of the Warp Icon & Lightning */}
              <div className="mb-4 relative flex items-center justify-center">
                
                {/* Warp Lightning (Anchored exactly behind the eye) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] opacity-50 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0">
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="w-full h-full overflow-visible">
                    {/* Main Fork 1 - Top Left */}
                    <g stroke="#c084fc" strokeWidth="1.5" fill="none" className="lightning" style={{ filter: 'drop-shadow(0 0 10px #9333ea)' }}>
                      <path d="M50,50 L42,32 L47,22 L30,15 L20,25 L10,-5 L0,15" pathLength="100" />
                      <path d="M47,22 L55,2 L50,-15" pathLength="100" strokeWidth="0.75" />
                      <path d="M30,15 L25,-5" pathLength="100" strokeWidth="0.5" />
                    </g>
                    
                    {/* Main Fork 2 - Bottom Right */}
                    <g stroke="#e879f9" strokeWidth="2" fill="none" className="lightning lightning-delay-1" style={{ filter: 'drop-shadow(0 0 15px #c084fc)' }}>
                      <path d="M50,50 L58,58 L52,70 L75,75 L80,95 L115,100" pathLength="100" />
                      <path d="M52,70 L45,85 L50,115" pathLength="100" strokeWidth="1" />
                      <path d="M75,75 L85,65 L115,70" pathLength="100" strokeWidth="1" />
                    </g>

                    {/* Main Fork 3 - Bottom Left & Top Right */}
                    <g stroke="#a855f7" strokeWidth="1" fill="none" className="lightning lightning-delay-2" style={{ filter: 'drop-shadow(0 0 12px #7e22ce)' }}>
                      <path d="M50,50 L35,60 L25,50 L15,85 L-10,75" pathLength="100" />
                      <path d="M50,50 L65,35 L70,15 L90,25 L115,-5" pathLength="100" />
                      <path d="M70,15 L80,-10" pathLength="100" strokeWidth="0.5" />
                    </g>
                  </svg>
                </div>

                <svg width="72" height="72" viewBox="0 0 100 100" fill="none" className="relative z-10 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)] group-hover:drop-shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-all duration-300">
                  {/* Jagged Tear Base */}
                  <path d="M10 50 Q 30 20 50 15 Q 70 20 90 50 Q 70 80 50 85 Q 30 80 10 50 Z" fill="#000" stroke="#cda85f" strokeWidth="2" strokeLinejoin="round" />
                  {/* Inner Warp Vortex */}
                  <path d="M20 50 Q 35 30 50 25 Q 65 30 80 50 Q 65 70 50 75 Q 35 70 20 50 Z" fill="url(#warpVortex)" />
                  {/* Pupil / Rift Core */}
                  <ellipse cx="50" cy="50" rx="8" ry="18" fill="#fff" filter="blur(2px)">
                    <animate attributeName="rx" values="8;4;8" dur="3s" repeatCount="indefinite" />
                  </ellipse>
                  {/* Chaotic Energy Spikes */}
                  <path d="M10 50 L 5 45 M 90 50 L 95 45 M 50 15 L 48 5 M 50 85 L 52 95 M 25 30 L 18 20 M 75 30 L 82 20 M 25 70 L 18 80 M 75 70 L 82 80" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" />
                  
                  <defs>
                    <radialGradient id="warpVortex" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fff" />
                      <stop offset="30%" stopColor="#c084fc" />
                      <stop offset="70%" stopColor="#6b21a8" />
                      <stop offset="100%" stopColor="#2e1065" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>

              {/* Title */}
              <h2 className="responsive-section-title font-bold gothic-text mb-1 drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" style={{ color: 'var(--warp-purple-light)' }}>
                INSPIRATION
              </h2>
              <p className="text-purple-400/60 responsive-label mb-2 tracking-[0.2em] uppercase">Protocol</p>

              <p className="text-gray-400 responsive-label text-center mb-4 leading-relaxed max-w-[200px]">
                Extract chromatic essences from the warp
              </p>

              <div className="px-4 py-2 border-2 border-[#8b5cf6]/30 rounded bg-black/40 group-hover:bg-[#8b5cf6]/20 group-hover:border-[#8b5cf6] transition-colors duration-300">
                <span className="text-[#c084fc] font-bold cyber-text tracking-widest text-sm drop-shadow-[0_0_5px_rgba(192,132,252,0.8)]">
                  CHANNEL WARP
                </span>
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Bottom instruction */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="responsive-label text-gray-500 tech-text">
            SELECT YOUR PROTOCOL
          </p>
        </motion.div>
      </div>
    </div>
  );
}
