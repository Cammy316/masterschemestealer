/**
 * Single source of truth for the two grimdark identities.
 *
 * Returns INLINE token values (CSS custom properties), not Tailwind class names —
 * the custom theme colours (brass, cogitator-green, warp-purple, …) are not
 * generated as Tailwind v4 utilities, so `text-brass`/`border-warp-purple` are
 * dead. Consuming these as inline `style` values keeps us on tokens (never raw
 * hexes) and actually applies.
 *
 *   cogitator = Miniscan / Imperial (auspex green, brass, parchment)
 *   warp      = Inspiration / Immaterium (warp purple, restrained magenta)
 *
 * The Cart is Imperial/Administratum — it uses the `cogitator` theme (brass frame).
 */

export type UITheme = 'cogitator' | 'warp';

export interface ThemeColors {
  /** Primary accent — buttons, tags, rune glow (green / purple). */
  primary: string;
  primaryDim: string;
  primaryLight: string;
  /** Secondary accent (brass / warp-pink). */
  accent: string;
  /** rgba glow for soft shadows. */
  glow: string;
  /** Standard panel surface. */
  surface: string;
  /** Deepest obsidian/void surface (heavy slabs). */
  surfaceDeep: string;
  /** Card frame border (tarnished brass for Imperial, purple for Warp). */
  frame: string;
  /** Text colour that sits on a solid `primary` fill. */
  onPrimary: string;
}

const COGITATOR: ThemeColors = {
  primary: 'var(--cogitator-green)',
  primaryDim: 'var(--cogitator-green-dim)',
  primaryLight: 'var(--cogitator-green)',
  accent: 'var(--brass)',
  glow: 'var(--cogitator-green-glow)',
  surface: 'var(--dark-gothic)',
  surfaceDeep: 'var(--void-black)',
  frame: 'var(--brass)',
  onPrimary: 'var(--void-black)',
};

const WARP: ThemeColors = {
  primary: 'var(--warp-purple)',
  primaryDim: 'var(--warp-purple-dark)',
  primaryLight: 'var(--warp-purple-light)',
  accent: 'var(--warp-pink)',
  glow: 'var(--ethereal-glow)',
  surface: 'var(--void-blue)',
  surfaceDeep: '#05050a',
  frame: 'var(--warp-purple)',
  onPrimary: '#ffffff',
};

export function getThemeColors(theme: UITheme): ThemeColors {
  return theme === 'warp' ? WARP : COGITATOR;
}

/** Map the app's ScanMode to a UITheme. */
export function themeForMode(mode: 'miniature' | 'inspiration'): UITheme {
  return mode === 'inspiration' ? 'warp' : 'cogitator';
}
