'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export function ForgeBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);
  const [flareActive, setFlareActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Set initial position to center
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
      mouseY.set(window.innerHeight / 2);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Flare logic
    let flareStartTimeout: NodeJS.Timeout;
    let flareEndTimeout: NodeJS.Timeout;

    const endFlare = () => {
      setFlareActive(false);
      // Schedule next flare 60-90 seconds from now
      flareStartTimeout = setTimeout(startFlare, 60000 + Math.random() * 30000);
    };

    const startFlare = () => {
      setFlareActive(true);
      // End flare after 8 seconds
      flareEndTimeout = setTimeout(endFlare, 8000);
    };
    
    // Start the first flare shortly after load so the user can see it
    flareStartTimeout = setTimeout(startFlare, 3000 + Math.random() * 2000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(flareStartTimeout);
      clearTimeout(flareEndTimeout);
    };
  }, [mouseX, mouseY]);

  // Create the dynamic background style for the spotlight
  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      circle 600px at ${mouseX}px ${mouseY}px,
      rgba(218, 165, 32, 0.15),
      transparent 80%
    )
  `;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void-black">
      
      {/* 1. Fluid Orbs (Morphing Heat) */}
      <motion.div 
        className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[100px] mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(220,50,0,0.8), transparent 70%)' }}
        animate={{
          x: ['0%', '20%', '-10%', '0%'],
          y: ['0%', '-20%', '10%', '0%'],
          scale: [1, 1.2, 0.9, 1],
          opacity: [0.2, 0.6, 0.2]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] rounded-full blur-[120px] mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(200,100,0,0.6), transparent 70%)' }}
        animate={{
          x: ['0%', '-20%', '10%', '0%'],
          y: ['0%', '20%', '-10%', '0%'],
          scale: [1, 1.1, 0.8, 1],
          opacity: [0.2, 0.5, 0.2]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* 1.2 Bottom Forge Glow */}
      {mounted && (
        <motion.div 
          className="absolute bottom-[-10%] left-[-10%] right-[-10%] h-[40vh] pointer-events-none mix-blend-screen z-10 origin-bottom"
          style={{
            background: 'radial-gradient(ellipse at bottom center, rgba(255, 120, 0, 0.8) 0%, rgba(220, 60, 0, 0.4) 40%, transparent 70%)'
          }}
          animate={{ 
            scaleY: flareActive ? 1.1 : 0.6,
            scaleX: flareActive ? 1.05 : 1.0,
            opacity: flareActive ? 0.7 : 0.25
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
        />
      )}

      {/* 1.5 Rising Embers */}
      {mounted && (
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 10;
            const duration = 15 + Math.random() * 15; // Slowed down from 6 to 15+
            const size = 2 + Math.random() * 4;
            return (
              <motion.div
                key={`ember-${i}`}
                className="absolute bottom-[-5%] rounded-full bg-amber-400 mix-blend-screen"
                style={{ 
                  width: size, 
                  height: size, 
                  left: `${left}%`,
                  boxShadow: '0 0 8px 2px rgba(245, 158, 11, 0.8)'
                }}
                animate={{
                  y: ['0vh', '-105vh'],
                  x: ['0px', '30px', '-30px', '20px', '0px'],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  y: { duration, repeat: Infinity, ease: 'linear', delay },
                  x: { duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut', delay },
                  opacity: { duration, repeat: Infinity, ease: 'easeInOut', delay },
                }}
              />
            );
          })}
          
          {/* Flare Burst Embers */}
          {flareActive && Array.from({ length: 30 }).map((_, i) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 3; // Fast spawn
            const duration = 8 + Math.random() * 8; // Faster rise
            const size = 3 + Math.random() * 5; // Slightly larger
            return (
              <motion.div
                key={`flare-ember-${i}`}
                className="absolute bottom-[-5%] rounded-full bg-amber-300 mix-blend-screen"
                style={{ 
                  width: size, 
                  height: size, 
                  left: `${left}%`,
                  boxShadow: '0 0 12px 3px rgba(251, 191, 36, 0.9)'
                }}
                animate={{
                  y: ['0vh', '-105vh'],
                  x: ['0px', '40px', '-40px', '30px', '0px'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  y: { duration, ease: 'easeOut', delay },
                  x: { duration: duration * 0.8, ease: 'easeInOut', delay },
                  opacity: { duration, ease: 'easeInOut', delay },
                }}
              />
            );
          })}
        </div>
      )}

      {/* 2. Mouse-Tracking Spotlight */}
      {mounted && (
        <motion.div 
          className="absolute inset-0 z-10 opacity-60 mix-blend-color-dodge"
          style={{ background: spotlightStyle }}
        />
      )}

      {/* 3. Base Hex Grid Texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='69.2820323027551' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 17.32050807568877l-20 11.547005383792516L0 17.32050807568877V-5.773502691896258l20-11.547005383792516 20 11.547005383792516V17.32050807568877zm0 46.18802153517006l-20 11.547005383792516-20-11.547005383792516V40.4145188432738l20-11.547005383792516 20 11.547005383792516v23.09401076758503z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '40px'
        }}
      />
      
      {/* 4. Film Grain / Noise Overlay */}
      <div className="absolute inset-0 z-20 opacity-[0.15] mix-blend-overlay pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

    </div>
  );
}
