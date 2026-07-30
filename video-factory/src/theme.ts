// Brand tokens mirrored from schemestealer-react/app/globals.css so factory renders
// read as the same product. Kept as a small hand-copied subset (the app CSS is not
// importable into a Remotion bundle); if the app palette shifts, update these.

export const COLOURS = {
  void: '#05070a',
  voidRaised: '#0c1016',
  ink: '#e8f0e8',
  inkDim: '#8a9a8a',

  // Imperial / Miniscan (green) identity — used by T1/T2 default skin
  green: '#00FF41',
  greenDim: '#00AA2A',
  greenDark: '#007A1F',
  gold: '#FFD700',
  goldDark: '#BFA000',

  // Warp / Inspiration (purple) identity
  purple: '#8B5CF6',
  purpleDark: '#6D28D9',
  purpleLight: '#A78BFA',
  pink: '#EC4899',

  // Semantic
  danger: '#F4433A',
  cosmic: '#1e1b4b',
} as const;

export type Skin = 'imperial' | 'warp';

export function skinColours(skin: Skin) {
  return skin === 'warp'
    ? { accent: COLOURS.purple, accentDim: COLOURS.purpleDark, accentLight: COLOURS.purpleLight }
    : { accent: COLOURS.green, accentDim: COLOURS.greenDim, accentLight: COLOURS.gold };
}

// 9:16 master spec (campaign §1 acceptance criteria).
export const VIDEO = {
  width: 1080,
  height: 1920,
  fps: 30,
} as const;

// ΔE band → verdict copy (British English). Mirrors the app's band language.
export function bandVerdict(deltaE: number): { label: string; heresy: boolean } {
  if (deltaE < 1.0) return { label: 'IDENTICAL TO THE EYE', heresy: false };
  if (deltaE < 2.0) return { label: 'YOUR EYES CANNOT TELL', heresy: false };
  if (deltaE < 2.5) return { label: 'ALL BUT IDENTICAL', heresy: false };
  if (deltaE <= 3.5) return { label: 'CLOSE ENOUGH — OR HERESY?', heresy: true };
  return { label: 'A FAIR MATCH', heresy: false };
}

// Fonts: loaded via @remotion/google-fonts in src/fonts.ts (deterministic at render).
export const FONT = {
  display: 'var(--font-display)',
  mono: 'var(--font-mono)',
} as const;
