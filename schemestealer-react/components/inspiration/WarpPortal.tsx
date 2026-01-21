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

  return (
    <div className="relative flex items-center justify-center min-h-[400px] py-8">
      {/* Background starfield effect */}
      <div className="absolute inset-0 starfield-bg rounded-2xl overflow-hidden" />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
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
