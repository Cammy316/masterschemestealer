'use client';

import React, { useEffect, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

export function ForgeBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

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
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        className="absolute top-[10%] left-[20%] w-[60vw] h-[60vw] sm:w-[40vw] sm:h-[40vw] rounded-full blur-[100px] opacity-30 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(139,0,0,0.8), transparent 70%)' }}
        animate={{
          x: ['0%', '20%', '-10%', '0%'],
          y: ['0%', '-20%', '10%', '0%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-[10%] right-[10%] w-[70vw] h-[70vw] sm:w-[50vw] sm:h-[50vw] rounded-full blur-[120px] opacity-20 mix-blend-screen"
        style={{ background: 'radial-gradient(circle, rgba(184,134,11,0.6), transparent 70%)' }}
        animate={{
          x: ['0%', '-20%', '10%', '0%'],
          y: ['0%', '20%', '-10%', '0%'],
          scale: [1, 1.1, 0.8, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

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
