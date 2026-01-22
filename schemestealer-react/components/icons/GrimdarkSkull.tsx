/**
 * Grimdark Servo-Skull Icon
 * Detailed, menacing skull with mechanical elements for Miniscan mode
 */

'use client';

export function GrimdarkSkullIcon({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Metallic gradient for skull */}
        <linearGradient id="skullMetal" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="30%" stopColor="#2a2a2a" />
          <stop offset="70%" stopColor="#1a1a1a" />
          <stop offset="100%" stopColor="#0a0a0a" />
        </linearGradient>

        {/* Eye glow */}
        <radialGradient id="eyeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff41" />
          <stop offset="50%" stopColor="#00aa2a" />
          <stop offset="100%" stopColor="#004410" />
        </radialGradient>

        {/* Drop shadow filter */}
        <filter id="skullShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.8" />
        </filter>
      </defs>

      {/* Main skull shape */}
      <g filter="url(#skullShadow)">
        {/* Cranium */}
        <ellipse cx="32" cy="26" rx="20" ry="18" fill="url(#skullMetal)" />

        {/* Brow ridge */}
        <path
          d="M14 28 Q20 22 32 22 Q44 22 50 28"
          stroke="#4a4a4a"
          strokeWidth="3"
          fill="none"
        />

        {/* Left eye socket */}
        <ellipse cx="24" cy="28" rx="6" ry="7" fill="#000" />
        <ellipse cx="24" cy="28" rx="4" ry="5" fill="url(#eyeGlow)">
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
          />
        </ellipse>

        {/* Right eye socket */}
        <ellipse cx="40" cy="28" rx="6" ry="7" fill="#000" />
        <ellipse cx="40" cy="28" rx="4" ry="5" fill="url(#eyeGlow)">
          <animate
            attributeName="opacity"
            values="0.8;1;0.8"
            dur="2s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </ellipse>

        {/* Nasal cavity */}
        <path
          d="M32 32 L29 40 L32 42 L35 40 Z"
          fill="#0a0a0a"
        />

        {/* Upper jaw */}
        <path
          d="M18 42 Q32 48 46 42 L44 46 Q32 50 20 46 Z"
          fill="url(#skullMetal)"
        />

        {/* Teeth */}
        <g fill="#2a2a2a" stroke="#1a1a1a" strokeWidth="0.5">
          <rect x="22" y="44" width="3" height="5" rx="0.5" />
          <rect x="26" y="44" width="3" height="5" rx="0.5" />
          <rect x="30" y="44" width="3" height="5" rx="0.5" />
          <rect x="34" y="44" width="3" height="5" rx="0.5" />
          <rect x="38" y="44" width="3" height="5" rx="0.5" />
        </g>

        {/* Mechanical details - rivets */}
        <circle cx="15" cy="24" r="1.5" fill="#3a3a3a" />
        <circle cx="49" cy="24" r="1.5" fill="#3a3a3a" />
        <circle cx="12" cy="32" r="1" fill="#3a3a3a" />
        <circle cx="52" cy="32" r="1" fill="#3a3a3a" />

        {/* Cracks/damage for grimdark feel */}
        <path
          d="M44 18 L46 22 L44 24"
          stroke="#1a1a1a"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M20 20 L18 24"
          stroke="#1a1a1a"
          strokeWidth="0.5"
          fill="none"
        />

        {/* Small cog/gear accent on top */}
        <circle cx="32" cy="16" r="4" fill="none" stroke="#3a3a3a" strokeWidth="1" />
        <circle cx="32" cy="16" r="2" fill="#2a2a2a" />

        {/* Gear teeth */}
        <path
          d="M32 12 L32 14 M28 13 L29 15 M36 13 L35 15 M32 20 L32 18 M28 19 L29 17 M36 19 L35 17"
          stroke="#3a3a3a"
          strokeWidth="0.5"
        />
      </g>
    </svg>
  );
}
