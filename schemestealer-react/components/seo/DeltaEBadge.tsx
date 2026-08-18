import React from 'react';

import { DELTA_BAND_WORD } from '@/lib/deltaE';

interface DeltaEBadgeProps {
  deltaE: number;
  /** A band from the fixed vocabulary — see DELTA_BAND_WORD in lib/deltaE. */
  band: string;
  className?: string;
  showLabel?: boolean;
}

/**
 * The words come from `DELTA_BAND_WORD`, the same source the recipe card reads,
 * so the badge on a `/convert` page and the badge on a scan cannot describe the
 * same ΔE differently (ledger L6). Only the skinning is local: this surface is
 * the Imperial SEO page and has its own four-step colour ladder, whereas the
 * card is mode-themed.
 */
export function DeltaEBadge({ deltaE, band, className = '', showLabel = true }: DeltaEBadgeProps) {
  const word = (b: keyof typeof DELTA_BAND_WORD) => DELTA_BAND_WORD[b].toUpperCase();

  let label = "UNKNOWN";
  let colorClass = "";
  let borderClass = "";
  let glowClass = "";

  switch (band) {
    case 'perfect':
      label = `${word('perfect')} MATCH`;
      colorClass = "text-[var(--cogitator-green)]";
      borderClass = "border-[var(--cogitator-green)]";
      glowClass = "auspex-glow shadow-[0_0_10px_rgba(0,255,65,0.3)]";
      break;
    case 'close':
      label = `${word('close')} MATCH`;
      colorClass = "text-blue-400";
      borderClass = "border-blue-400";
      glowClass = "shadow-[0_0_10px_rgba(96,165,250,0.3)]";
      break;
    case 'fair':
      label = `${word('fair')} MATCH`;
      colorClass = "text-yellow-500";
      borderClass = "border-yellow-500";
      glowClass = "shadow-[0_0_10px_rgba(234,179,8,0.3)]";
      break;
    case 'distant':
      label = `${word('distant')} MATCH`;
      colorClass = "text-red-500";
      borderClass = "border-red-500";
      glowClass = "shadow-[0_0_10px_rgba(239,68,68,0.3)]";
      break;
    case 'none':
    default:
      // Beyond the matcher's ΔE 30 ceiling there is nothing to call a match.
      // This used to fall through to "DISTANT MATCH", which asserts the paint
      // IS within the ceiling — the one thing `none` means it is not.
      label = word('none');
      colorClass = "text-red-500";
      borderClass = "border-red-500";
      glowClass = "shadow-[0_0_10px_rgba(239,68,68,0.3)]";
      break;
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm border ${borderClass} px-2 py-1 rounded-sm ${glowClass} ${className}`}>
      {showLabel && (
        <span className={`text-[9px] uppercase tracking-widest ${colorClass} font-bold opacity-90 mb-0.5 whitespace-nowrap`}>
          {label}
        </span>
      )}
      <span className={`cyber-text text-sm ${colorClass} whitespace-nowrap`}>
        ΔE {deltaE.toFixed(1)}
      </span>
    </div>
  );
}
