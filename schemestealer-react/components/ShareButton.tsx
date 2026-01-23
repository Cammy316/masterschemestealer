'use client';

import { useState } from 'react';

interface ShareButtonProps {
  mode: 'miniature' | 'inspiration';
  onShareClick: () => void;
}

export function ShareButton({ mode, onShareClick }: ShareButtonProps) {
  const themeColors = mode === 'miniature'
    ? 'bg-green-600 hover:bg-green-700 border-green-500'
    : 'bg-purple-600 hover:bg-purple-700 border-purple-500';

  return (
    <button
      onClick={onShareClick}
      className={`w-full ${themeColors} text-white px-6 py-3 rounded-lg font-bold border-2 transition-all min-h-[52px] flex items-center justify-center gap-2`}
    >
      <span>Share Results</span>
    </button>
  );
}
