import React from 'react';

interface DeltaEBadgeProps {
  deltaE: number;
  band: string; // 'perfect', 'close', 'fair', 'distant'
  className?: string;
  showLabel?: boolean;
}

export function DeltaEBadge({ deltaE, band, className = '', showLabel = true }: DeltaEBadgeProps) {
  let label = "UNKNOWN";
  let colorClass = "";
  let borderClass = "";
  let glowClass = "";

  switch (band) {
    case 'perfect':
      label = "PERFECT MATCH";
      colorClass = "text-[var(--cogitator-green)]";
      borderClass = "border-[var(--cogitator-green)]";
      glowClass = "auspex-glow shadow-[0_0_10px_rgba(0,255,65,0.3)]";
      break;
    case 'close':
      label = "CLOSE MATCH";
      colorClass = "text-blue-400";
      borderClass = "border-blue-400";
      glowClass = "shadow-[0_0_10px_rgba(96,165,250,0.3)]";
      break;
    case 'fair':
      label = "FAIR MATCH";
      colorClass = "text-yellow-500";
      borderClass = "border-yellow-500";
      glowClass = "shadow-[0_0_10px_rgba(234,179,8,0.3)]";
      break;
    case 'distant':
    default:
      label = "DISTANT MATCH";
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
