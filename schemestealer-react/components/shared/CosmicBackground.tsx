'use client';

import React from 'react';

// Generates a massive box-shadow string to render hundreds of stars with a single DOM element
function generateStars(count: number, size: number, maxBlur: number = 0) {
  let value = '';
  for (let i = 0; i < count; i++) {
    // Generate static values to prevent hydration mismatches if this was SSR, 
    // but this is a client component. Still, deterministic generation is nice.
    // However, since it's only rendered on client, Math.random is fine.
    const x = Math.floor(Math.random() * 2000);
    const y = Math.floor(Math.random() * 2000);
    const opacity = (0.4 + Math.random() * 0.6).toFixed(2);
    value += `${x}px ${y}px ${maxBlur > 0 ? Math.floor(Math.random() * maxBlur) + 'px ' : ''}rgba(255, 255, 255, ${opacity})`;
    if (i < count - 1) value += ', ';
  }
  return value;
}

export const CosmicBackground = React.memo(function CosmicBackground() {
  const [layers, setLayers] = React.useState<{shadow: string, size: number, animationDuration: number}[]>([]);

  React.useEffect(() => {
    setLayers([
      { shadow: generateStars(150, 1, 0), size: 1, animationDuration: 30 },
      { shadow: generateStars(70, 2, 1), size: 2, animationDuration: 40 },
      { shadow: generateStars(30, 3, 2), size: 3, animationDuration: 50 },
    ]);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-void-black">
      <style>{`
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-1000px); }
        }
        @keyframes twinkle-drift {
          0% { opacity: 0.8; transform: translateY(0); }
          50% { opacity: 0.4; }
          100% { opacity: 0.8; transform: translateY(-1000px); }
        }
        .star-layer {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
        }
        .star-layer::after {
          content: " ";
          position: absolute;
          top: 2000px;
          left: 0;
          border-radius: 50%;
          width: inherit;
          height: inherit;
          box-shadow: inherit;
        }
      `}</style>
      
      {layers.map((layer, index) => (
        <div
          key={index}
          className="star-layer"
          style={{
            width: `${layer.size}px`,
            height: `${layer.size}px`,
            boxShadow: layer.shadow,
            animation: `twinkle-drift ${layer.animationDuration}s linear infinite`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(139,92,246,0.1)_0%,rgba(139,92,246,0)_80%)] pointer-events-none" />
    </div>
  );
});
