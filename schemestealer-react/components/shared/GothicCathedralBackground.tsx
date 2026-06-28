'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function GothicCathedralBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" style={{ backgroundColor: '#0a0a0f' }}>
      {/* Deep Fog / Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#0a0a0f] z-0" />
      
      {/* Ambient Volumetric Lighting */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_50%_40%,rgba(163,137,71,0.08)_0%,transparent_60%)]" />

      {/* Floating Dust Motes & Incense Embers */}
      <div className="absolute inset-0 z-20 opacity-60">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              backgroundColor: i % 3 === 0 ? '#ffb800' : '#a38947',
              boxShadow: i % 3 === 0 ? '0 0 10px #ffb800' : '0 0 5px #a38947',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -Math.random() * 150 - 50],
              x: [0, (Math.random() - 0.5) * 80],
              opacity: [0, Math.random() * 0.8 + 0.2, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* SVG Architecture Layers - Increased Opacity & Brightness */}
      <svg
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1920 1080"
      >
        <defs>
          <linearGradient id="pillarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#15151c" />
            <stop offset="20%" stopColor="#252530" />
            <stop offset="80%" stopColor="#252530" />
            <stop offset="100%" stopColor="#0a0a0f" />
          </linearGradient>
          <linearGradient id="windowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 184, 0, 0.4)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="15" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Far Background: Distant Rose Window */}
        <g transform="translate(960, 250)" opacity="0.6" filter="url(#glow)">
          <circle cx="0" cy="0" r="180" fill="url(#windowGrad)" />
          {/* Tracery */}
          <circle cx="0" cy="0" r="175" stroke="#0a0a0f" strokeWidth="8" fill="none" />
          <circle cx="0" cy="0" r="50" stroke="#0a0a0f" strokeWidth="6" fill="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line
              key={angle}
              x1="0" y1="50" x2="0" y2="175"
              stroke="#0a0a0f" strokeWidth="6"
              transform={`rotate(${angle})`}
            />
          ))}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(angle => (
            <circle
              key={angle}
              cx="0" cy="112.5" r="35"
              stroke="#0a0a0f" strokeWidth="4" fill="none"
              transform={`rotate(${angle})`}
            />
          ))}
        </g>

        {/* Midground: Arches */}
        <g opacity="0.7">
          {/* Left Arch Series */}
          <path d="M0,1080 L300,1080 L300,400 Q450,150 900,100 L900,0 L0,0 Z" fill="#181822" />
          <path d="M0,1080 L150,1080 L150,450 Q300,250 800,200 L800,0 L0,0 Z" fill="#111118" />
          
          {/* Right Arch Series */}
          <path d="M1920,1080 L1620,1080 L1620,400 Q1470,150 1020,100 L1020,0 L1920,0 Z" fill="#181822" />
          <path d="M1920,1080 L1770,1080 L1770,450 Q1620,250 1120,200 L1120,0 L1920,0 Z" fill="#111118" />
        </g>

        {/* Foreground: Massive Pillars */}
        <g opacity="0.9">
          <rect x="-100" y="0" width="250" height="1080" fill="url(#pillarGrad)" />
          <rect x="1770" y="0" width="250" height="1080" fill="url(#pillarGrad)" />
          
          {/* Pillar details */}
          <rect x="-50" y="0" width="40" height="1080" fill="#050508" opacity="0.4" />
          <rect x="50" y="0" width="40" height="1080" fill="#050508" opacity="0.4" />
          <rect x="1820" y="0" width="40" height="1080" fill="#050508" opacity="0.4" />
          <rect x="1920" y="0" width="40" height="1080" fill="#050508" opacity="0.4" />
        </g>
      </svg>
    </div>
  );
}
