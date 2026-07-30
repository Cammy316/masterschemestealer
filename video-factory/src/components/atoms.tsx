// Shared visual atoms for both templates. All inline styles (Remotion renders a real
// browser, not Tailwind). Backdrop is intentionally STATIC (no time-based drift) so the
// loop-close QA pixel-diff between the first and last frame stays clean.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLOURS, type Skin, skinColours } from '../theme.js';
import { DISPLAY_FONT, MONO_FONT } from '../fonts.js';

export const Backdrop: React.FC<{ skin: Skin; children?: React.ReactNode }> = ({
  skin,
  children,
}) => {
  const { accentDim } = skinColours(skin);
  return (
    <AbsoluteFill style={{ backgroundColor: COLOURS.void }}>
      {/* faint static grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${accentDim}22 1px, transparent 1px), linear-gradient(90deg, ${accentDim}22 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.5,
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 35%, ${COLOURS.void} 85%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const SwatchBlock: React.FC<{
  hex: string;
  size: number;
  radius?: number;
  glow?: string;
  style?: React.CSSProperties;
}> = ({ hex, size, radius = 28, glow, style }) => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: hex,
      borderRadius: radius,
      boxShadow: glow ? `0 0 80px ${glow}` : '0 20px 60px rgba(0,0,0,0.6)',
      border: '2px solid rgba(255,255,255,0.14)',
      ...style,
    }}
  />
);

export const DisplayText: React.FC<{
  children: React.ReactNode;
  size: number;
  colour?: string;
  weight?: number;
  style?: React.CSSProperties;
}> = ({ children, size, colour = COLOURS.ink, weight = 700, style }) => (
  <div
    style={{
      fontFamily: DISPLAY_FONT,
      fontSize: size,
      fontWeight: weight,
      color: colour,
      lineHeight: 1.02,
      letterSpacing: '-0.5px',
      textTransform: 'uppercase',
      textAlign: 'center',
      textShadow: '0 2px 24px rgba(0,0,0,0.7)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const MonoText: React.FC<{
  children: React.ReactNode;
  size: number;
  colour?: string;
  style?: React.CSSProperties;
}> = ({ children, size, colour = COLOURS.inkDim, style }) => (
  <div
    style={{
      fontFamily: MONO_FONT,
      fontSize: size,
      color: colour,
      letterSpacing: '2px',
      textAlign: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);

// Angled "stamp" (ΔE verdict, buzzer, etc.)
export const Stamp: React.FC<{
  children: React.ReactNode;
  colour: string;
  size?: number;
  rotate?: number;
  style?: React.CSSProperties;
}> = ({ children, colour, size = 40, rotate = -7, style }) => (
  <div
    style={{
      fontFamily: DISPLAY_FONT,
      fontSize: size,
      fontWeight: 700,
      color: colour,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      padding: '14px 34px',
      border: `4px solid ${colour}`,
      borderRadius: 12,
      transform: `rotate(${rotate}deg)`,
      boxShadow: `0 0 40px ${colour}66`,
      backgroundColor: 'rgba(5,7,10,0.55)',
      ...style,
    }}
  >
    {children}
  </div>
);

// Small brand plate for outro / loop-close.
export const BrandPlate: React.FC<{ skin: Skin; sub?: string }> = ({
  skin,
  sub = 'scan yours free',
}) => {
  const { accent } = skinColours(skin);
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontFamily: DISPLAY_FONT,
          fontSize: 46,
          fontWeight: 700,
          color: accent,
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        SchemeStealer
      </div>
      <div style={{ fontFamily: MONO_FONT, fontSize: 26, color: COLOURS.inkDim, letterSpacing: '3px' }}>
        {sub}
      </div>
    </div>
  );
};
