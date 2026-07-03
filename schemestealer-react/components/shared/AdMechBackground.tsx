'use client';

import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const AdMechBackground = React.memo(function AdMechBackground() {
  const [mounted, setMounted] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" style={{ backgroundColor: '#050a05' }}>
      <style>{`
        @keyframes gear-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gear-spin-rev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes binary-rain {
          from { transform: translateY(0); }
          to { transform: translateY(250vh); }
        }
        @keyframes ember-float {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate(var(--x-drift), var(--y-drift)) scale(var(--end-scale)); opacity: 0; }
        }
        .gear-1 { animation: gear-spin 120s linear infinite; transform-origin: center; }
        .gear-2 { animation: gear-spin-rev 180s linear infinite; transform-origin: center; }
        .gear-3 { animation: gear-spin-rev 150s linear infinite; transform-origin: center; }
      `}</style>
      
      {/* Base Grimy Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,40,10,0.1)_0%,rgba(5,10,5,0.9)_80%)] z-0" />
      
      {/* Industrial Grid & Plasteel Plating */}
      <div 
        className="absolute inset-0 opacity-15 z-0" 
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Falling Binary Rain */}
      {mounted && !shouldReduceMotion && (
        <div className="absolute inset-0 z-0 opacity-25 overflow-hidden" style={{ color: '#00ff41', textShadow: '0 0 5px #00ff41', fontFamily: 'monospace', fontSize: '14px', lineHeight: '14px', whiteSpace: 'pre' }}>
          {[...Array(20)].map((_, colIndex) => {
            const r1 = (colIndex * 13) % 100 / 100;
            const r2 = (colIndex * 29) % 100 / 100;
            const r3 = (colIndex * 47) % 100 / 100;
            
            return (
              <div
                key={colIndex}
                className="absolute top-[-100%]"
                style={{ 
                  left: `${(colIndex * 5) + (r1 * 2)}%`,
                  animation: `binary-rain ${20 + r2 * 20}s linear ${r3 * -20}s infinite`
                }}
              >
                {[...Array(40)].map((_, rowIndex) => {
                  const isOne = ((colIndex * 37 + rowIndex * 19) % 100 / 100) > 0.5;
                  return (
                    <div key={rowIndex} className="opacity-75">
                      {isOne ? '1' : '0'}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}

      {/* Slow Falling Embers */}
      {mounted && !shouldReduceMotion && (
        <div className="absolute inset-0 z-20">
          {[...Array(15)].map((_, i) => {
            const r1 = (i * 17) % 100 / 100;
            const r2 = (i * 31) % 100 / 100;
            const r3 = (i * 43) % 100 / 100;
            const r4 = (i * 59) % 100 / 100;
            const r5 = (i * 73) % 100 / 100;
            const r6 = (i * 89) % 100 / 100;

            return (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: r1 * 3 + 2 + 'px',
                  height: r1 * 3 + 2 + 'px',
                  backgroundColor: '#ffaa00',
                  boxShadow: '0 0 10px #ff5500',
                  left: r2 * 100 + '%',
                  top: '-20px',
                  '--x-drift': `${(r4 - 0.5) * 150}px`,
                  '--y-drift': `${800 + r3 * 400}px`,
                  '--end-scale': `${r5 * 1.5 + 0.5}`,
                  animation: `ember-float ${15 + r6 * 15}s linear ${r1 * 15}s infinite`
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* Massive Turning Gears & Architecture */}
      <svg
        className="absolute inset-0 w-full h-full object-cover z-10 opacity-70"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1920 1080"
      >
        <defs>
          <radialGradient id="gearGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0, 255, 65, 0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          
          <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0f0f0f" />
            <stop offset="20%" stopColor="#333" />
            <stop offset="50%" stopColor="#444" />
            <stop offset="80%" stopColor="#222" />
            <stop offset="100%" stopColor="#0f0f0f" />
          </linearGradient>
        </defs>

        <circle cx="400" cy="800" r="400" fill="url(#gearGlow)" />
        <circle cx="1500" cy="300" r="500" fill="url(#gearGlow)" />

        {/* Gear 1 - Bottom Left */}
        <g transform="translate(300, 900)" opacity="0.8">
          <g className={!shouldReduceMotion ? "gear-1" : ""}>
            <circle cx="0" cy="0" r="350" fill="#151515" stroke="#333" strokeWidth="20" />
            <circle cx="0" cy="0" r="280" fill="none" stroke="#222" strokeWidth="40" strokeDasharray="60 40" />
            <circle cx="0" cy="0" r="100" fill="#111" stroke="#444" strokeWidth="15" />
            {[0, 60, 120, 180, 240, 300].map(angle => (
              <line key={angle} x1="0" y1="100" x2="0" y2="300" stroke="#222" strokeWidth="40" transform={`rotate(${angle})`} />
            ))}
            {[...Array(36)].map((_, i) => (
              <rect key={i} x="-20" y="-390" width="40" height="40" fill="#333" transform={`rotate(${i * 10})`} />
            ))}
          </g>
        </g>

        {/* Gear 2 - Interlocking Bottom Left */}
        <g transform="translate(800, 1150)" opacity="0.7">
          <g className={!shouldReduceMotion ? "gear-2" : ""}>
            <circle cx="0" cy="0" r="250" fill="#111" stroke="#2a2a2a" strokeWidth="15" />
            <circle cx="0" cy="0" r="80" fill="#151515" stroke="#444" strokeWidth="10" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <line key={angle} x1="0" y1="80" x2="0" y2="250" stroke="#1f1f1f" strokeWidth="25" transform={`rotate(${angle})`} />
            ))}
            {[...Array(24)].map((_, i) => (
              <rect key={i} x="-15" y="-280" width="30" height="30" fill="#2a2a2a" transform={`rotate(${i * 15})`} />
            ))}
          </g>
        </g>

        {/* Gear 3 - Top Right */}
        <g transform="translate(1600, 100)" opacity="0.9">
          <g className={!shouldReduceMotion ? "gear-3" : ""}>
            <circle cx="0" cy="0" r="450" fill="#151515" stroke="#333" strokeWidth="30" />
            <circle cx="0" cy="0" r="150" fill="#111" stroke="#444" strokeWidth="20" />
            {[0, 90, 180, 270].map(angle => (
              <g key={angle} transform={`rotate(${angle})`}>
                <line x1="0" y1="150" x2="0" y2="450" stroke="#222" strokeWidth="60" />
                <circle cx="0" cy="300" r="40" fill="#0d0d0d" stroke="#333" strokeWidth="5" />
              </g>
            ))}
            {[...Array(48)].map((_, i) => (
              <path key={i} d="M -25 -450 L -15 -500 L 15 -500 L 25 -450 Z" fill="#333" transform={`rotate(${i * 7.5})`} />
            ))}
          </g>
        </g>

        {/* Heavy Cables & Pipes */}
        <g opacity="1">
          <rect x="-50" y="-50" width="150" height="1200" fill="url(#pipeGrad)" />
          <rect x="100" y="-50" width="80" height="1200" fill="url(#pipeGrad)" />
          <path d="M 50 0 Q 150 500 50 1080" fill="none" stroke="#151515" strokeWidth="40" />
          <path d="M 120 0 Q 30 600 120 1080" fill="none" stroke="#0a0a0a" strokeWidth="30" />
          <path d="M -20 100 Q 200 300 50 600 T -20 1000" fill="none" stroke="#2a2a2a" strokeWidth="15" strokeDasharray="10 5" />
          <rect x="1800" y="-50" width="200" height="1200" fill="url(#pipeGrad)" />
          <rect x="1720" y="-50" width="80" height="1200" fill="url(#pipeGrad)" />
          <path d="M 1850 0 Q 1700 400 1900 1080" fill="none" stroke="#1f1f1f" strokeWidth="50" />
          <path d="M 1950 100 Q 1600 500 1950 900" fill="none" stroke="#333" strokeWidth="20" strokeDasharray="15 5" />
        </g>
      </svg>
    </div>
  );
});
