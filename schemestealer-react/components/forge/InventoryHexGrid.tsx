"use client";

import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Paint } from '@/lib/types';
import paintsData from '@/lib/data/paints_groundtruth.json';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface InventoryHexGridProps {
  inventory: Paint[];
  onAddPaint: () => void;
  onRemovePaint?: (paintId: string) => void;
  lastAddedId?: string | null;
}

// Convert ground truth format to internal
const allPaints: Paint[] = (paintsData as any[]).map(p => ({
  id: p.paint_id,
  name: p.name,
  brand: p.brand,
  hex: p.hex,
  type: p.category || 'Base',
  colorFamily: p.color_family
}));

// Quick HSL conversion for sorting by color
function hexToHue(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0;
  if (max !== min) {
    const d = max - min;
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return h;
}

const HEX_DIRECTIONS = [
  { q: 1, r: 0 }, { q: 1, r: -1 }, { q: 0, r: -1 },
  { q: -1, r: 0 }, { q: -1, r: 1 }, { q: 0, r: 1 }
];

function generateHexSpiral(count: number) {
  const results = [{ q: 0, r: 0 }];
  let radius = 1;
  while (results.length < count) {
    let q = -radius;
    let r = radius;
    for (const dir of HEX_DIRECTIONS) {
      for (let i = 0; i < radius; i++) {
        if (results.length < count) results.push({ q, r });
        q += dir.q;
        r += dir.r;
      }
    }
    radius++;
  }
  return results;
}

export function InventoryHexGrid({ inventory, onAddPaint, onRemovePaint, lastAddedId }: InventoryHexGridProps) {
  const [selectedPaintId, setSelectedPaintId] = useState<string | null>(null);

  // 1. Sort owned paints by Hue
  const ownedSorted = useMemo(() => {
    return [...inventory].sort((a, b) => hexToHue(a.hex) - hexToHue(b.hex));
  }, [inventory]);

  // 2. Determine "Ghost" paints (unowned)
  const ghostPaints = useMemo(() => {
    const ownedIds = new Set(inventory.map(p => p.id || p.name.toLowerCase().replace(/\s+/g, '-')));
    const unowned = allPaints.filter(p => !ownedIds.has(p.id!));
    // Generate a larger rim of ghost paints (approx 2 full rings)
    return unowned.slice(0, Math.min(42, unowned.length));
  }, [inventory]);

  // Total nodes needed
  const totalNodes = ownedSorted.length + ghostPaints.length;
  const coords = useMemo(() => generateHexSpiral(totalNodes), [totalNodes]);

  const hexSize = 38; // Radius of hex

  // Map paints to coordinates
  const renderNodes = useMemo(() => {
    const nodes = [];
    // Place owned paints in center
    for (let i = 0; i < ownedSorted.length; i++) {
      nodes.push({ paint: ownedSorted[i], coord: coords[i], isOwned: true });
    }
    // Place ghost paints on the rim
    for (let i = 0; i < ghostPaints.length; i++) {
      // Fade out as they get further away from the center
      const ghostOpacity = Math.max(0.02, 0.25 - (i / ghostPaints.length) * 0.23);
      nodes.push({ paint: ghostPaints[i], coord: coords[ownedSorted.length + i], isOwned: false, ghostOpacity });
    }
    return nodes;
  }, [ownedSorted, ghostPaints, coords]);

  // Fixed container height for the "Radar Window" view
  const containerHeight = 450;

  // SVG clip path for the hexagon
  const hexClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  return (
    <div className="relative w-full bg-[#0a0a0a] rounded-lg border border-gray-800/60 overflow-hidden shadow-inner mt-4" style={{ height: containerHeight }}>
      {/* Ad-Mech / Tech Background Overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(184, 134, 11, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(184, 134, 11, 0.15) 1px, transparent 1px)', backgroundSize: '38px 38px', backgroundPosition: '50% 50%' }} />
      {/* CRT Scanlines */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
      {/* Zoom / Pan Wrapper */}
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={2.5}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}>
              <div 
                style={{ width: 3000, height: 3000, position: 'relative' }}
                onClick={() => setSelectedPaintId(null)}
              >
                
                {inventory.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-6 text-center backdrop-blur-sm bg-black/40">
                    <h3 className="text-xl cyber-text text-imperial-gold/80 mb-2 drop-shadow-[0_0_8px_rgba(255,215,0,0.4)]">EMPTY DATABANKS</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-sm">Your organic hive is empty. Add paints to see your collection grow.</p>
                    <button 
                      onClick={onAddPaint}
                      className="py-2 px-8 bg-void-black border border-brass text-brass hover:bg-brass/20 rounded shadow-[0_0_15px_rgba(184,134,11,0.2)] transition-all font-bold tracking-widest text-xs uppercase cursor-pointer pointer-events-auto"
                    >
                      + ADD FIRST PAINT
                    </button>
                  </div>
                )}

                {/* The Hive Map (centered perfectly in the 3000x3000 canvas) */}
                <div className="absolute left-1/2 top-1/2 w-0 h-0">
                  <AnimatePresence>
          {renderNodes.map((node, i) => {
            const { q, r } = node.coord;
            // Pointy-top hex math
            const x = hexSize * Math.sqrt(3) * (q + r / 2);
            const y = hexSize * 3 / 2 * r;
            
            const paintId = node.paint.id || node.paint.name.toLowerCase().replace(/\s+/g, '-');
            const isSelected = selectedPaintId === paintId;
            const isNew = lastAddedId === paintId;

            return (
              <motion.div
                key={node.isOwned ? paintId : `ghost-${paintId}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isNew ? [1, 1.3, 1] : isSelected ? 1.2 : 1, 
                  zIndex: isSelected || isNew ? 50 : 10 
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  type: "spring", stiffness: 300, damping: 25, delay: i * 0.01,
                  ...(isNew && { duration: 1, ease: "easeOut", repeat: 2, repeatType: "reverse" })
                }}
                className="absolute flex items-center justify-center cursor-pointer group"
                style={{ 
                  left: x, 
                  top: y, 
                  width: hexSize * Math.sqrt(3), 
                  height: hexSize * 2,
                  transform: 'translate(-50%, -50%)' // center on coordinate
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  node.isOwned ? setSelectedPaintId(isSelected ? null : paintId) : onAddPaint();
                }}
              >
                {/* The Hexagon */}
                <div 
                  className={`w-[92%] h-[92%] relative transition-all duration-300 ${
                    node.isOwned 
                      ? isSelected ? 'brightness-125 scale-105' : 'brightness-100 hover:brightness-[1.5] hover:scale-110' 
                      : 'grayscale hover:opacity-50 border border-dashed border-gray-500'
                  }`}
                  style={{ 
                    clipPath: hexClipPath, 
                    backgroundColor: node.paint.hex,
                    boxShadow: node.isOwned ? 'inset 0 4px 10px rgba(255,255,255,0.3), inset 0 -4px 10px rgba(0,0,0,0.6)' : 'none',
                    opacity: node.isOwned ? 1 : node.ghostOpacity
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none mix-blend-overlay" />
                  
                  {/* Subtle shockwave pulse for new paints */}
                  {isNew && (
                    <motion.div 
                      className="absolute inset-0 bg-white mix-blend-overlay pointer-events-none"
                      animate={{ opacity: [0, 0.8, 0] }}
                      transition={{ duration: 1, repeat: 2 }}
                    />
                  )}
                  
                  {/* Subtle unowned icon */}
                  {!node.isOwned && (
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold text-lg pointer-events-none">+</div>
                  )}
                </div>

                {/* Popout Info Label for Owned Paints */}
                <AnimatePresence>
                  {isSelected && node.isOwned && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-charcoal/95 border border-gray-700 p-2 rounded shadow-xl whitespace-nowrap z-50 flex flex-col items-center pointer-events-auto"
                    >
                      <div className="font-bold text-white text-xs uppercase tracking-wider">{node.paint.name}</div>
                      <div className="text-[9px] text-brass uppercase tracking-widest">{node.paint.brand}</div>
                      
                      {onRemovePaint && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRemovePaint(paintId); }}
                          className="mt-2 text-[9px] text-red-500 hover:text-red-400 uppercase tracking-widest border-t border-gray-800 w-full pt-1"
                        >
                          Remove
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip for Unowned Ghosts */}
                <AnimatePresence>
                  {!node.isOwned && isSelected && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.9 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.9 }}
                       className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-charcoal/95 border border-gray-700 p-2 rounded shadow-xl whitespace-nowrap z-50 flex flex-col items-center pointer-events-none"
                     >
                       <div className="font-bold text-gray-400 text-xs uppercase tracking-wider">Unowned Pattern</div>
                       <div className="text-[9px] text-imperial-gold/70 uppercase tracking-widest">Tap to Scan/Add</div>
                     </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
                  </AnimatePresence>
                </div>
              </div>
            </TransformComponent>
            
            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
              <button onClick={() => zoomIn()} className="w-8 h-8 bg-black/60 border border-gray-700 hover:border-brass text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors">+</button>
              <button onClick={() => zoomOut()} className="w-8 h-8 bg-black/60 border border-gray-700 hover:border-brass text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors">-</button>
              <button onClick={() => resetTransform()} className="w-8 h-8 bg-black/60 border border-gray-700 hover:border-brass text-white rounded flex items-center justify-center backdrop-blur-sm transition-colors">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Stats overlay */}
      {inventory.length > 0 && (
        <div className="absolute top-4 left-4 bg-black/60 border border-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded flex flex-col z-20 pointer-events-none">
          <span className="text-[10px] text-gray-500 uppercase tracking-widest">Hive Capacity</span>
          <span className="text-sm text-imperial-gold cyber-text">{inventory.length} DATANODES</span>
        </div>
      )}
    </div>
  );
}
