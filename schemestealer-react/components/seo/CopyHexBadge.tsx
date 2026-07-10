'use client';

import { useState } from 'react';

export function CopyHexBadge({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 sm:px-4 border border-gray-800 bg-charcoal/30 hover:bg-charcoal/50 hover:border-gray-600 active:scale-95 transition-all rounded-sm mt-4 cursor-pointer group shadow-sm"
      aria-label="Copy hex code"
    >
      <span className="text-gray-400 uppercase tracking-widest text-[10px] sm:text-xs">Hex:</span>
      <span className="text-imperial-gold drop-shadow-[0_0_8px_currentColor] font-mono text-xs sm:text-sm font-bold tracking-wider transition-all">
        {hex}
      </span>
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--cogitator-green)" strokeWidth="3" className="sm:w-3.5 sm:h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-500 group-hover:text-gray-300 transition-colors sm:w-3.5 sm:h-3.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      )}
    </button>
  );
}
