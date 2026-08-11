/**
 * Canvas-side theme tokens for the exported clip.
 *
 * WHY THIS EXISTS. The skin's accent colour was written out in three separate
 * places — `accentFor()` in revealCompose, the grid/halo pair in
 * `paintBackdrop()`, and the model scanline in `buildBaseLayer()` — and the
 * third one was never given a skin at all. It painted `rgba(0, 255, 65, 0.03)`
 * unconditionally, so a warp export drew IMPERIAL GREEN scanlines across the
 * model while everything around them was purple.
 *
 * Capture only sees the canvas, so none of this can come from CSS custom
 * properties at render time. These values are transcribed from
 * `app/globals.css` (imperial: `--auspex-green`; warp: `--warp-purple` /
 * `--warp-purple-light`) and are the single source of truth for anything the
 * exporter draws in a skin colour.
 */

import type { RevealSkin } from './revealLayers';

export interface RevealTheme {
  /** Primary accent — HUD chrome, brackets, headline type. */
  accent: string;
  /** Deeper variant for fills that sit behind type. */
  accentDeep: string;
  /** Scanline wash over the model in the greyscale base layer. */
  scanline: string;
  /** Backdrop targeting grid. */
  backdropLine: string;
  /** Backdrop halo behind the model. */
  backdropHalo: string;
  /** Low-emphasis text (sub-headings, brand names). */
  muted: string;
}

/**
 * Imperial values are byte-identical to the constants they replace, so the
 * existing suites stay green without a single fixture edit — that is the point
 * of doing the consolidation as its own commit.
 */
export const REVEAL_THEME: Record<RevealSkin, RevealTheme> = {
  imperial: {
    accent: '#00FF41',
    accentDeep: '#00A82B',
    scanline: 'rgba(0, 255, 65, 0.03)',
    backdropLine: 'rgba(0, 255, 65, 0.045)',
    backdropHalo: 'rgba(0, 255, 65, 0.07)',
    muted: '#c8d8cc',
  },
  warp: {
    accent: '#A78BFA', // --warp-purple-light
    accentDeep: '#6D28D9', // --warp-purple-dark
    scanline: 'rgba(139, 92, 246, 0.03)', // --warp-purple
    backdropLine: 'rgba(139, 92, 246, 0.05)',
    backdropHalo: 'rgba(139, 92, 246, 0.08)',
    muted: '#cdc6e4',
  },
};

export function themeFor(skin: RevealSkin): RevealTheme {
  return REVEAL_THEME[skin] ?? REVEAL_THEME.imperial;
}

/** Primary accent for a skin. Kept as its own export because it is by far the
 *  most common lookup and reads better than `themeFor(skin).accent` at call
 *  sites that want nothing else. */
export function accentFor(skin: RevealSkin): string {
  return themeFor(skin).accent;
}
