/**
 * HexChip — a small tappable pill showing a colour's hex that copies it on tap.
 * Themed border (green Imperial / purple Warp). Flashes "Copied" briefly.
 */

'use client';

import { useState } from 'react';
import { copyHexCode } from '@/lib/clipboard';
import { getThemeColors, type UITheme } from '@/components/shared/theme';

export function HexChip({ hex, theme }: { hex: string; theme: UITheme }) {
  const c = getThemeColors(theme);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyHexCode(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="touch-target inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition-colors"
      style={{ border: `1px solid ${c.primary}`, color: c.primary, background: 'transparent' }}
      aria-label={`Copy hex ${hex}`}
    >
      <span>{copied ? 'Copied' : hex}</span>
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round" /></svg>
      )}
    </button>
  );
}

export default HexChip;
