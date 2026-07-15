'use client';

import React from 'react';

interface ServoSkullProps {
  className?: string;
  isScanning?: boolean;
}

export function ServoSkull({ className = '', isScanning = false }: ServoSkullProps) {
  return (
    <div
      className={`relative ${className} ${isScanning ? 'animate-[float_1.5s_ease-in-out_infinite]' : 'animate-[float_3s_ease-in-out_infinite]'}`}
    >
      <div style={isScanning ? { animation: 'patrol 4s ease-in-out infinite alternate' } : {}} className="relative w-full h-full flex items-center justify-center">
      <style>{`
        @keyframes svg-searchlight {
          0%   { transform: rotate(-15deg) scaleY(0.8); animation-timing-function: ease-in-out; }
          33%  { transform: rotate(15deg) scaleY(1.3); animation-timing-function: ease-in-out; }
          66%  { transform: rotate(-5deg) scaleY(0.9); animation-timing-function: ease-in-out; }
          100% { transform: rotate(-15deg) scaleY(0.8); }
        }
        @keyframes patrol {
          0%   { transform: translateX(-40px); }
          100% { transform: translateX(40px); }
        }
      `}</style>

      {/* Halo Glow */}
      <div className="absolute inset-0 bg-cogitator-green/20 blur-[20px] rounded-full scale-110" />

      {/* Upgraded High-Fidelity Servo-Skull SVG */}
      <svg width="80" height="90" viewBox="0 0 100 110" fill="none" className="relative z-10 drop-shadow-xl overflow-visible">
        <defs>
          <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0, 255, 65, 0.6)" />
            <stop offset="100%" stopColor="rgba(0, 255, 65, 0)" />
          </linearGradient>
          <linearGradient id="skullBone" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e3dccc" />
            <stop offset="60%" stopColor="#8c8577" />
            <stop offset="100%" stopColor="#2c2a26" />
          </linearGradient>
          <linearGradient id="metalPlate" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id="brassFit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c89f50" />
            <stop offset="100%" stopColor="#5c4415" />
          </linearGradient>
        </defs>

        {/* --- WIRES AND CABLES (Behind) --- */}
        <path d="M25 70 Q10 85 15 110" stroke="#111" strokeWidth="6" fill="none" />
        <path d="M25 70 Q10 85 15 110" stroke="#333" strokeWidth="2" fill="none" strokeDasharray="3 2" />
        
        <path d="M35 80 Q30 95 32 110" stroke="#1a1a1a" strokeWidth="4" fill="none" />
        
        <path d="M75 70 Q90 85 85 110" stroke="#111" strokeWidth="5" fill="none" />
        <path d="M75 70 Q90 85 85 110" stroke="url(#brassFit)" strokeWidth="1.5" fill="none" />
        
        <path d="M65 80 Q70 95 68 110" stroke="#1a1a1a" strokeWidth="4" fill="none" />

        {/* --- MAIN CRANIUM --- */}
        {/* Bone base */}
        <path 
          d="M50 10 C25 10 15 28 15 45 C15 58 22 68 32 75 L35 85 L65 85 L68 75 C78 68 85 58 85 45 C85 28 75 10 50 10Z" 
          fill="url(#skullBone)" 
          stroke="#000" 
          strokeWidth="1.5" 
        />
        
        {/* Cranial Sutures / Cracks */}
        <path d="M48 10 Q45 25 38 30" stroke="#3a3731" strokeWidth="1.5" fill="none" />
        <path d="M65 20 Q55 30 62 40" stroke="#3a3731" strokeWidth="1" fill="none" />

        {/* --- CYBERNETIC IMPLANTS --- */}
        {/* Forehead Plating */}
        <path d="M35 12 L65 12 L60 25 L40 25 Z" fill="url(#metalPlate)" stroke="#000" strokeWidth="1" />
        <circle cx="45" cy="18" r="1.5" fill="#000" />
        <circle cx="55" cy="18" r="1.5" fill="#000" />

        {/* Right side neural-jack array */}
        <path d="M82 35 L88 38 L88 52 L82 55 Z" fill="url(#metalPlate)" stroke="#000" />
        <line x1="88" y1="40" x2="92" y2="40" stroke="url(#brassFit)" strokeWidth="2" />
        <line x1="88" y1="45" x2="95" y2="45" stroke="url(#brassFit)" strokeWidth="2" />
        <line x1="88" y1="50" x2="93" y2="50" stroke="url(#brassFit)" strokeWidth="2" />

        {/* --- OPTICS / EYES --- */}
        {/* Left Bionic Eye (Scanner) */}
        <path d="M22 42 C22 35 28 32 35 32 C42 32 48 35 48 42 C48 50 42 55 35 55 C28 55 22 50 22 42 Z" fill="#050505" stroke="#000" strokeWidth="2" />
        {/* Metal ring */}
        <circle cx="35" cy="43.5" r="10" fill="none" stroke="url(#metalPlate)" strokeWidth="3" />
        <circle cx="35" cy="43.5" r="12" fill="none" stroke="#111" strokeWidth="1" />
        
        {/* Glowing Lens */}
        <circle cx="35" cy="43.5" r="7" fill="#0a2a0a" stroke="url(#brassFit)" strokeWidth="1.5" />
        <circle cx="35" cy="43.5" r="4" fill="var(--cogitator-green)" filter="drop-shadow(0 0 4px var(--cogitator-green))">
          <animate attributeName="opacity" values={isScanning ? "0.8;1;0.8" : "0.5;0.8;0.5"} dur={isScanning ? "0.5s" : "2s"} repeatCount="indefinite" />
        </circle>
        {/* Optical target lines */}
        <line x1="26" y1="43.5" x2="31" y2="43.5" stroke="var(--cogitator-green)" strokeWidth="1" opacity="0.7" />
        <line x1="39" y1="43.5" x2="44" y2="43.5" stroke="var(--cogitator-green)" strokeWidth="1" opacity="0.7" />
        <line x1="35" y1="34" x2="35" y2="39" stroke="var(--cogitator-green)" strokeWidth="1" opacity="0.7" />
        <line x1="35" y1="48" x2="35" y2="53" stroke="var(--cogitator-green)" strokeWidth="1" opacity="0.7" />

        {/* Right Bionic Eye (Secondary) */}
        <path d="M52 42 C52 35 58 32 65 32 C72 32 78 35 78 42 C78 50 72 55 65 55 C58 55 52 50 52 42 Z" fill="#050505" stroke="#000" strokeWidth="2" />
        {/* Tactical slit visor */}
        <rect x="55" y="38" width="20" height="8" fill="url(#metalPlate)" stroke="#111" rx="2" />
        <line x1="58" y1="42" x2="72" y2="42" stroke="var(--error)" strokeWidth="2" filter="drop-shadow(0 0 2px var(--error))">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite" />
        </line>
        <line x1="60" y1="42" x2="63" y2="42" stroke="#fff" strokeWidth="2" />

        {/* --- NOSE CAVITY --- */}
        <path d="M45 58 L50 68 L55 58 Q50 52 45 58 Z" fill="#0a0a0a" stroke="#111" strokeWidth="1" />
        <path d="M49 58 L50 65 L51 58" stroke="#1a1a1a" strokeWidth="1" fill="none" />

        {/* --- MAXILLA & TEETH --- */}
        <path d="M32 75 Q50 82 68 75 L65 85 L35 85 Z" fill="url(#metalPlate)" stroke="#000" strokeWidth="1" />
        
        {/* Metal Teeth Grid */}
        <g fill="#0a0a0a" stroke="url(#brassFit)" strokeWidth="0.5">
          <rect x="37" y="78" width="4" height="7" rx="1" />
          <rect x="43" y="79" width="4" height="6" rx="1" />
          <rect x="48" y="79.5" width="4" height="5.5" rx="1" />
          <rect x="53" y="79" width="4" height="6" rx="1" />
          <rect x="59" y="78" width="4" height="7" rx="1" />
        </g>

        {/* Under-jaw mechanical box (Auspex sensor) */}
        <rect x="42" y="86" width="16" height="10" fill="url(#metalPlate)" stroke="#000" rx="2" />
        <circle cx="50" cy="91" r="3" fill="var(--cogitator-green)" filter="drop-shadow(0 0 2px var(--cogitator-green))">
          <animate attributeName="opacity" values={isScanning ? "1;0.2;1" : "0.5;0.5"} dur={isScanning ? "0.2s" : "2s"} repeatCount="indefinite" />
        </circle>
        
        {/* Side breathing vents */}
        <path d="M22 60 L28 65 L28 72 L22 68 Z" fill="#000" />
        <line x1="23" y1="63" x2="27" y2="66" stroke="#444" />
        <line x1="23" y1="65" x2="27" y2="68" stroke="#444" />

        <path d="M78 60 L72 65 L72 72 L78 68 Z" fill="#000" />
        <line x1="77" y1="63" x2="73" y2="66" stroke="#444" />
        <line x1="77" y1="65" x2="73" y2="68" stroke="#444" />

        {/* Volumetric Laser Sweep Beam */}
        <g 
          style={{ 
            transformOrigin: '35px 43.5px',
            opacity: isScanning ? 1 : 0,
            transform: isScanning ? 'scale(1)' : 'scale(0.1)',
            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <g style={{ transformOrigin: '35px 43.5px', animation: 'svg-searchlight 5s infinite' }}>
            <polygon 
              points="31,43.5 39,43.5 150,400 -80,400" 
              fill="url(#beamGradient)" 
              className="mix-blend-screen"
            />
          </g>
        </g>
      </svg>
      </div>
    </div>
  );
}
