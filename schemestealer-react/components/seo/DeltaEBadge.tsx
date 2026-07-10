import React from 'react';

interface DeltaEBadgeProps {
  deltaE: number;
  band: string; // 'perfect', 'close', 'fair', 'distant'
  className?: string;
}

export function DeltaEBadge({ deltaE, band, className = '' }: DeltaEBadgeProps) {
  let label = "UNKNOWN";
  let colorClass = "";
  let borderClass = "";
  let glowClass = "";

  switch (band) {
    case 'perfect':
      label = "PERFECT MATCH";
      colorClass = "text-cogitator-green";
      borderClass = "border-cogitator-green";
      glowClass = "auspex-glow shadow-[0_0_10px_rgba(0,255,65,0.3)]";
      break;
    case 'close':
      label = "CLOSE MATCH";
      colorClass = "text-info";
      borderClass = "border-info";
      glowClass = "shadow-[0_0_10px_var(--info)]";
      break;
    case 'fair':
      label = "FAIR MATCH";
      colorClass = "text-warning";
      borderClass = "border-warning";
      // No crt-flicker here: a 10Hz infinite flash on body copy is a
      // photosensitivity risk and reads as a rendering glitch.
      glowClass = "shadow-[0_0_10px_var(--warning)]";
      break;
    case 'distant':
    default:
      label = "DISTANT MATCH";
      colorClass = "text-error";
      borderClass = "border-error";
      glowClass = "shadow-[0_0_10px_var(--error)]";
      break;
  }

  return (
    <div className={`inline-flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm border ${borderClass} px-4 py-2 rounded-sm ${glowClass} ${className}`}>
      <span className={`text-[10px] uppercase tracking-widest ${colorClass} font-bold opacity-90 mb-1`}>
        {label}
      </span>
      <span className={`cyber-text text-base ${colorClass}`}>
        &Delta;E {deltaE.toFixed(1)}
      </span>
    </div>
  );
}
