'use client';

import React from 'react';

export const CleanThematicBackground = React.memo(function CleanThematicBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" style={{ backgroundColor: '#050a05' }}>
      {/* Base Grimy Atmosphere with soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,40,10,0.15)_0%,rgba(5,10,5,0.95)_80%)] z-0" />
      
      {/* Subtle Dot Grid */}
      <div 
        className="absolute inset-0 opacity-10 z-0" 
        style={{
          backgroundImage: 'radial-gradient(rgba(0, 255, 65, 0.4) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />
    </div>
  );
});
