/**
 * Warp Portal - Swirling magical portal for Inspiration mode
 * The centerpiece hero component with layered animations
 */

'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface WarpPortalProps {
  onActivate: () => void;
  isActive?: boolean;
  disabled?: boolean;
}

export function WarpPortal({ onActivate, isActive = false, disabled = false }: WarpPortalProps) {
  const portalRef = useRef<HTMLButtonElement>(null);

  // Generate 250 realistic stars with varying sizes
  const stars = React.useMemo(() => {
    return [...Array(250)].map((_, i) => {
      const size = Math.random() < 0.7 ? 1 : Math.random() < 0.9 ? 1.5 : 2;
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleDuration: 2 + Math.random() * 4,
        twinkleDelay: Math.random() * 3,
      };
    });
  }, []);

  // Generate 25 floating particles that drift toward portal center
  const particles = React.useMemo(() => {
    return [...Array(25)].map((_, i) => {
      const angle = (Math.PI * 2 * i) / 25;
      const distance = 150 + Math.random() * 200;
      return {
        id: i,
        startX: 50 + Math.cos(angle) * (distance / 5),
        startY: 50 + Math.sin(angle) * (distance / 5),
        size: 1 + Math.random() * 2,
        duration: 4 + Math.random() * 3,
        delay: Math.random() * 5,
      };
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-[400px] py-8">
      {/* Realistic starfield - 250+ individual stars */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden bg-void-black">
        {stars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
            }}
            animate={{
              opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
              scale: [0.8, 1, 0.8],
            }}
            transition={{
              duration: star.twinkleDuration,
              repeat: Infinity,
              delay: star.twinkleDelay,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Enhanced floating particles - drift toward portal center */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.startX}%`,
              top: `${particle.startY}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(139,92,246,0.4))',
              boxShadow: '0 0 6px rgba(255,255,255,0.6)',
            }}
            animate={{
              x: [`0%`, `${(50 - particle.startX) * 3}%`],
              y: [`0%`, `${(50 - particle.startY) * 3}%`],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.2, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeIn',
            }}
          />
        ))}
      </div>

      {/* Main portal button */}
      <motion.button
        ref={portalRef}
        onClick={onActivate}
        disabled={disabled}
        className="relative w-64 h-64 rounded-full focus:outline-none focus-visible-warp disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        animate={{
          filter: isActive ? 'brightness(1.5)' : 'brightness(1)',
        }}
      >
        {/* Outer ring - slow rotation */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-40"
          style={{
            background: 'conic-gradient(from 0deg, var(--warp-purple), var(--warp-pink), var(--warp-teal), var(--warp-purple))',
            filter: 'blur(20px)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Middle ring - counter rotation */}
        <motion.div
          className="absolute inset-8 rounded-full opacity-60"
          style={{
            background: 'conic-gradient(from 180deg, var(--warp-teal), var(--warp-purple), var(--warp-pink), var(--warp-teal))',
            filter: 'blur(15px)',
          }}
          animate={{ rotate: -360 }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Inner ring - fast rotation */}
        <motion.div
          className="absolute inset-16 rounded-full opacity-70"
          style={{
            background: 'radial-gradient(circle, var(--warp-purple), var(--warp-pink))',
            filter: 'blur(10px)',
          }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Pulsing core */}
        <motion.div
          className="absolute inset-20 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.9), var(--warp-purple-light), transparent)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Ripple effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white"
          initial={{ scale: 0.8, opacity: 0 }}
          whileHover={{
            scale: [0.8, 1.2],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <motion.div
            className="text-center px-4"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="warp-text text-xl font-bold mb-2 gothic-text drop-shadow-lg">
              {isActive ? 'CHANNELING...' : 'TOUCH THE VEIL'}
            </div>
            <div className="text-xs text-white/70 font-medium">
              {isActive ? 'The Warp Stirs' : 'Enter the Immaterium'}
            </div>
          </motion.div>
        </div>

        {/* Energy bolts */}
        {!disabled && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-12 bg-gradient-to-b from-transparent via-white to-transparent"
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: 'top center',
                }}
                animate={{
                  rotate: [i * 60, i * 60 + 360],
                  opacity: [0, 1, 0],
                  scaleY: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </>
        )}
      </motion.button>

      {/* Instruction text */}
      {!isActive && (
        <motion.div
          className="absolute bottom-8 left-0 right-0 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-white/60 font-medium px-4">
            Upload an image or take a photo to extract its chromatic essence
          </p>
        </motion.div>
      )}
    </div>
  );
}

export default WarpPortal;
