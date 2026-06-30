"use client";

import React, { useState } from 'react';

interface SwatchCompareProps {
  sourceColor: string;
  sourceName: string;
  sourceBrand: string;
  targetColor: string;
  targetName: string;
  targetBrand: string;
}

export function SwatchCompare({
  sourceColor,
  sourceName,
  sourceBrand,
  targetColor,
  targetName,
  targetBrand,
}: SwatchCompareProps) {
  const [hoverState, setHoverState] = useState<'none' | 'source' | 'target'>('none');
  const [flashSource, setFlashSource] = useState(false);
  const [flashTarget, setFlashTarget] = useState(false);

  const copyToClipboard = (hex: string, isSource: boolean) => {
    navigator.clipboard.writeText(hex);
    if (isSource) {
      setFlashSource(true);
      setTimeout(() => setFlashSource(false), 300);
    } else {
      setFlashTarget(true);
      setTimeout(() => setFlashTarget(false), 300);
    }
  };

  const sourceFlex = hoverState === 'source' ? 7 : hoverState === 'target' ? 3 : 5;
  const targetFlex = hoverState === 'target' ? 7 : hoverState === 'source' ? 3 : 5;

  return (
    <div 
      className="relative w-full max-w-3xl mx-auto gothic-frame depth-2 overflow-hidden flex flex-col sm:flex-row h-80 sm:h-64 mb-8 group"
      onMouseLeave={() => setHoverState('none')}
    >
      {/* SOURCE SWATCH */}
      <div 
        className={`relative flex flex-col justify-end p-4 sm:p-6 transition-all duration-500 ease-out cursor-pointer ${flashSource ? 'brightness-150' : ''} textured`}
        style={{ 
          backgroundColor: sourceColor,
          flex: sourceFlex
        }}
        onMouseEnter={() => setHoverState('source')}
        onClick={() => copyToClipboard(sourceColor, true)}
        title={`Click to copy ${sourceColor}`}
      >
        <div className="bg-black/70 backdrop-blur-md p-3 rounded-sm border-l-2 border-brass w-full relative z-10 transition-transform duration-300">
          <p className="text-xs text-gray-400 uppercase tracking-widest">{sourceBrand}</p>
          <p className="text-white font-bold text-xl sm:text-2xl text-shadow-sm leading-tight truncate">{sourceName}</p>
          <div className="mt-2 flex items-center justify-between border-t border-gray-700/50 pt-2">
            <span className="tech-text text-sm text-brass tracking-wider">{sourceColor}</span>
            <span className={`text-[10px] uppercase transition-opacity duration-300 ${hoverState === 'source' ? 'opacity-100 text-brass' : 'opacity-0 text-gray-500 hidden sm:block'}`}>
              {flashSource ? 'Copied!' : 'Click to Copy'}
            </span>
          </div>
        </div>
      </div>
      
      {/* TARGET SWATCH */}
      <div 
        className={`relative flex flex-col justify-end p-4 sm:p-6 items-end text-right transition-all duration-500 ease-out cursor-pointer ${flashTarget ? 'brightness-150' : ''} textured`}
        style={{ 
          backgroundColor: targetColor,
          flex: targetFlex
        }}
        onMouseEnter={() => setHoverState('target')}
        onClick={() => copyToClipboard(targetColor, false)}
        title={`Click to copy ${targetColor}`}
      >
        <div className="bg-black/70 backdrop-blur-md p-3 rounded-sm border-r-2 border-cogitator-green w-full relative z-10 transition-transform duration-300">
          <p className="text-xs text-gray-400 uppercase tracking-widest">{targetBrand}</p>
          <p className="text-white font-bold text-xl sm:text-2xl text-shadow-sm leading-tight truncate">{targetName}</p>
          <div className="mt-2 flex items-center justify-between flex-row-reverse border-t border-gray-700/50 pt-2 w-full">
            <span className="tech-text text-sm text-cogitator-green tracking-wider">{targetColor}</span>
            <span className={`text-[10px] uppercase transition-opacity duration-300 ${hoverState === 'target' ? 'opacity-100 text-cogitator-green' : 'opacity-0 text-gray-500 hidden sm:block'}`}>
              {flashTarget ? 'Copied!' : 'Click to Copy'}
            </span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
