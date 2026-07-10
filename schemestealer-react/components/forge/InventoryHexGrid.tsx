"use client";

import React, { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Paint } from '@/lib/types';
import paintsData from '@/lib/data/paints_groundtruth.json';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface InventoryHexGridProps {
  inventory: Paint[];
  onAddPaint: () => void;
  onRemovePaint?: (paintId: string) => void;
  lastAddedId?: string | null;
  pendingAnimationIds?: string[];
}

interface HexNode {
  coord: { q: number, r: number, s?: number };
  paint: Paint;
  isOwned: boolean;
  ghostOpacity?: number;
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

function ScrambleString({ text }: { text: string }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let iteration = 0;
    const maxIterations = 6; // Fast scramble (300ms total)
    
    textRef.current.className = 'font-mono tracking-tighter';
    
    const interval = setInterval(() => {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          result += " ";
        } else {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
      }
      if (textRef.current) textRef.current.textContent = result;
      iteration++;
      
      if (iteration >= maxIterations) {
        clearInterval(interval);
        if (textRef.current) {
          textRef.current.textContent = text;
          textRef.current.className = '';
        }
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [text]);

  return <span ref={textRef}>{text}</span>;
}

function StatsOverlay({ count, isAnimating }: { count: number, isAnimating: boolean }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    
    if (isAnimating) {
      textRef.current.className = 'text-sm tracking-widest uppercase transition-colors duration-200 text-imperial-gold drop-shadow-[0_0_8px_rgba(184,134,11,0.6)] font-mono font-bold';
      const words = ["ANALYZING", "COGITATING", "ASSESSING", "COMPILING", "SYNTHESIZING", "EXTRACTING", "INDEXING", "CALCULATING", "PROCESSING"];
      const chars = "0123456789!@#$%^&*";
      let frame = 0;
      let currentWord = words[0];

      const interval = setInterval(() => {
        if (frame % 6 === 0) {
          // Change word every 6 frames (~300ms)
          currentWord = words[Math.floor(Math.random() * words.length)];
        }
        frame++;

        let scrambled = "";
        for (let i = 0; i < currentWord.length; i++) {
          // 25% chance to replace a character with a random symbol
          if (Math.random() > 0.75) {
            scrambled += chars.charAt(Math.floor(Math.random() * chars.length));
          } else {
            scrambled += currentWord[i];
          }
        }
        if (textRef.current) textRef.current.textContent = scrambled;
      }, 50);
      return () => clearInterval(interval);
    } else {
      textRef.current.className = 'text-sm tracking-widest uppercase transition-colors duration-200 text-imperial-gold drop-shadow-[0_0_8px_rgba(184,134,11,0.6)] cyber-text';
      textRef.current.textContent = `${count} PIGMENTS`;
    }
  }, [isAnimating, count]);

  return (
    <div className="absolute top-4 left-4 bg-charcoal/80 border border-brass/50 backdrop-blur-sm px-4 py-2 rounded-sm flex flex-col z-20 pointer-events-none min-w-[140px] items-start shadow-[0_0_15px_rgba(184,134,11,0.15)]">
      <span ref={textRef} className="text-sm tracking-widest uppercase transition-colors duration-200 text-imperial-gold drop-shadow-[0_0_8px_rgba(184,134,11,0.6)] cyber-text">
        {count} PIGMENTS
      </span>
    </div>
  );
}

export function InventoryHexGrid({ inventory, onAddPaint, onRemovePaint, lastAddedId, pendingAnimationIds = [] }: InventoryHexGridProps) {
  const [selectedPaintId, setSelectedPaintId] = useState<string | null>(null);

  // Global click handler to deselect paints when clicking anywhere outside the nodes
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-paint-node="true"]')) {
        setSelectedPaintId(null);
      }
    };
    
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

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
    // 2. Map to coords
    const nodes: HexNode[] = [];
    ownedSorted.forEach((paint, i) => {
      const paintId = paint.id || paint.name.toLowerCase().replace(/\s+/g, '-');
      const isPending = pendingAnimationIds.includes(paintId);
      nodes.push({ coord: coords[i], paint, isOwned: !isPending, ghostOpacity: isPending ? 0.3 : undefined });
    });
    // Place ghost paints on the rim
    for (let i = 0; i < ghostPaints.length; i++) {
      // Fade out as they get further away from the center
      const ghostOpacity = Math.max(0.02, 0.25 - (i / ghostPaints.length) * 0.23);
      nodes.push({ paint: ghostPaints[i], coord: coords[ownedSorted.length + i], isOwned: false, ghostOpacity });
    }
    return nodes;
  }, [ownedSorted, ghostPaints, coords, pendingAnimationIds]);

  // Fixed container height for the "Radar Window" view
  const containerHeight = 450;

  // SVG clip path for the hexagon
  const hexClipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

  return (
    <div className="relative w-full bg-[#050505] border-[6px] border-charcoal/90 outline outline-1 outline-brass/40 rounded-sm overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] mt-4 ring-1 ring-inset ring-brass/20" style={{ height: containerHeight }}>
      {/* Ambient Center Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.15)_0%,transparent_70%)] pointer-events-none mix-blend-screen" />
      {/* CRT Scanlines */}
      <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
      {/* Zoom / Pan Wrapper */}
      <TransformWrapper
        initialScale={1}
        minScale={0.2}
        maxScale={2.5}
        centerOnInit={true}
        wheel={{ step: 0.5, disabled: inventory.length === 0 }}
        panning={{ disabled: inventory.length === 0 }}
        pinch={{ disabled: inventory.length === 0 }}
        doubleClick={{ disabled: inventory.length === 0 }}
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
                data-paint-node="true"
                key={node.isOwned ? paintId : `ghost-${paintId}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isNew ? [1, 1.3, 1] : isSelected ? 1.2 : 1, 
                  zIndex: isSelected || isNew ? 50 : 10 
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ 
                  type: isNew ? "tween" : "spring",
                  ...(isNew ? { duration: 0.8, ease: "easeInOut" } : { stiffness: 300, damping: 25, delay: i * 0.01 })
                }}
                className="absolute flex items-center justify-center cursor-pointer group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brass z-10"
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
                {/* The Hexagon Base (Acts as border for unowned) */}
                <div 
                  className={`w-[92%] h-[92%] relative transition-all duration-300 ${
                    node.isOwned 
                      ? isSelected ? 'brightness-125 scale-105' : 'brightness-100 hover:brightness-[1.5] hover:scale-110' 
                      : 'bg-gray-800/50 hover:bg-imperial-gold group-hover:drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]'
                  }`}
                  style={{ 
                    clipPath: hexClipPath, 
                    backgroundColor: node.isOwned ? node.paint.hex : undefined,
                    boxShadow: node.isOwned ? 'inset 0 4px 10px rgba(255,255,255,0.3), inset 0 -4px 10px rgba(0,0,0,0.6)' : 'none',
                    opacity: node.isOwned ? 1 : node.ghostOpacity
                  }}
                >
                  {/* Inner Unowned Hexagon (Hides the center, revealing the outer div as a perfectly clipped border) */}
                  {!node.isOwned && (
                    <div 
                      className="absolute inset-[1.5px] bg-[#0a0a0a] transition-all duration-300"
                      style={{ clipPath: hexClipPath }}
                    />
                  )}

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
                    <div className="absolute inset-0 flex items-center justify-center text-white/50 font-bold text-lg pointer-events-none transition-colors duration-300 group-hover:text-imperial-gold">+</div>
                  )}
                </div>

                {/* Popout Info Label for Owned Paints */}
                <AnimatePresence>
                  {isSelected && node.isOwned && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-charcoal/95 border border-brass/50 p-3 rounded-sm shadow-[0_0_15px_rgba(184,134,11,0.15)] z-50 flex flex-col items-center pointer-events-auto backdrop-blur-sm min-w-[120px] max-w-[70vw] text-center"
                    >
                      <div className="font-bold text-imperial-gold text-xs uppercase tracking-wider drop-shadow-[0_0_8px_rgba(184,134,11,0.6)] break-words"><ScrambleString text={node.paint.name} /></div>
                      <div className="text-[10px] text-brass uppercase tracking-widest mt-0.5"><ScrambleString text={node.paint.brand} /></div>
                      
                      {onRemovePaint && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRemovePaint(`${node.paint.brand}-${node.paint.name}`); }}
                          className="mt-3 bg-red-950/40 border border-red-900/50 hover:bg-red-900/60 hover:border-red-500 text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest w-full py-1.5 px-4 rounded transition-colors shadow-[0_0_10px_rgba(220,38,38,0.1)]"
                        >
                          REMOVE
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
                       className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-charcoal/95 border border-gray-700/80 p-2 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] whitespace-nowrap z-50 flex flex-col items-center pointer-events-none backdrop-blur-sm"
                     >
                       <div className="font-bold text-gray-400 text-[10px] uppercase tracking-wider"><ScrambleString text="UNOWNED PATTERN" /></div>
                       <div className="text-[9px] text-brass/70 uppercase tracking-widest mt-1"><ScrambleString text="TAP TO SCAN" /></div>
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
              <button onClick={() => zoomIn()} aria-label="Zoom in" className="w-11 h-11 bg-black/80 border border-brass/50 hover:bg-brass/20 hover:border-brass text-imperial-gold rounded-sm flex items-center justify-center backdrop-blur-sm transition-all shadow-[0_0_10px_rgba(184,134,11,0.1)] hover:shadow-[0_0_15px_rgba(184,134,11,0.3)] active:scale-95">+</button>
              <button onClick={() => zoomOut()} aria-label="Zoom out" className="w-11 h-11 bg-black/80 border border-brass/50 hover:bg-brass/20 hover:border-brass text-imperial-gold rounded-sm flex items-center justify-center backdrop-blur-sm transition-all shadow-[0_0_10px_rgba(184,134,11,0.1)] hover:shadow-[0_0_15px_rgba(184,134,11,0.3)] active:scale-95">-</button>
              <button onClick={() => resetTransform()} aria-label="Reset zoom" className="w-11 h-11 bg-black/80 border border-brass/50 hover:bg-brass/20 hover:border-brass text-imperial-gold rounded-sm flex items-center justify-center backdrop-blur-sm transition-all shadow-[0_0_10px_rgba(184,134,11,0.1)] hover:shadow-[0_0_15px_rgba(184,134,11,0.3)] active:scale-95">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
            </div>
          </>
        )}
      </TransformWrapper>

      {/* Stats overlay */}
      {inventory.length > 0 && (
        <StatsOverlay count={inventory.length} isAnimating={pendingAnimationIds.length > 0} />
      )}

      {/* Floating Add Paint Button (Forge Theme) */}
      <AnimatePresence>
        {selectedPaintId === null && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20"
          >
            <button 
              onClick={onAddPaint}
              className="py-2.5 px-8 bg-void-black/90 border border-brass/50 hover:bg-brass/20 hover:border-brass text-imperial-gold hover:text-white rounded text-xs uppercase tracking-widest tech-text transition-all shadow-[0_0_15px_rgba(184,134,11,0.2)] backdrop-blur-sm active:scale-95"
            >
              + ADD PAINT
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
