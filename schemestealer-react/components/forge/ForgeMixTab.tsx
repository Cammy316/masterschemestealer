"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { CustomDropdown } from '@/components/shared/CustomDropdown';
import { mixColorsWeighted, findTopAlternativeMatches, simulateBasecoat, effectiveCoverage } from '@/lib/colorMath';
import type { Paint } from '@/lib/types';

interface ForgeMixTabProps {
  inventory: Paint[];
  addToInventory: (paint: Paint) => void;
  addToCart: (paint: Paint) => void;
  setLastAddedId: (id: string | null) => void;
}

export default function ForgeMixTab({ inventory, addToInventory, addToCart, setLastAddedId }: ForgeMixTabProps) {
  const [recipe, setRecipe] = useState<{paint: Paint, parts: number}[]>([]);
  const [primer, setPrimer] = useState<'none'|'#000000'|'#808080'|'#DDD1B4'|'#FFFFFF'>('none');
  const [customName, setCustomName] = useState('');
  const [showPrimerToggle, setShowPrimerToggle] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  
  const [mixFilterBrand, setMixFilterBrand] = useState('ALL');
  const [mixFilterColor, setMixFilterColor] = useState('ALL');

  const primerButtonRef = useRef<HTMLButtonElement>(null);
  const primerPopoverRef = useRef<HTMLDivElement>(null);
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const savePopoverRef = useRef<HTMLDivElement>(null);

  const getPaintId = (p: Paint) => p.id || p.name.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (showPrimerToggle && 
          primerButtonRef.current && !primerButtonRef.current.contains(target) &&
          primerPopoverRef.current && !primerPopoverRef.current.contains(target)) {
        setShowPrimerToggle(false);
      }
      if (showSaveInput && 
          saveButtonRef.current && !saveButtonRef.current.contains(target) &&
          savePopoverRef.current && !savePopoverRef.current.contains(target)) {
        setShowSaveInput(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPrimerToggle, showSaveInput]);

  const filterableMixInventory = React.useMemo(() => {
    return inventory.filter(paint => {
      const t = (paint.type || '').toLowerCase();
      // Exclude washes, contrast, speedpaints for accurate mixing
      if (t.includes('wash') || t.includes('shade') || t.includes('contrast') || t.includes('speedpaint') || t.includes('xpress')) {
        return false;
      }
      return true;
    });
  }, [inventory]);

  const mixInventoryBrands = React.useMemo(() => {
    const brands = new Set(['ALL']);
    filterableMixInventory.forEach(p => brands.add(p.brand.toUpperCase()));
    return Array.from(brands);
  }, [filterableMixInventory]);

  const mixInventoryColors = React.useMemo(() => {
    const colors = new Set(['ALL']);
    filterableMixInventory.forEach(p => {
      if (p.colorFamily) colors.add(p.colorFamily.toUpperCase());
    });
    return Array.from(colors);
  }, [filterableMixInventory]);

  const filteredMixInventory = filterableMixInventory.filter(p => {
    if (mixFilterBrand !== 'ALL' && p.brand.toUpperCase() !== mixFilterBrand) return false;
    if (mixFilterColor !== 'ALL' && (p.colorFamily || 'UNKNOWN').toUpperCase() !== mixFilterColor) return false;
    return true;
  });
  
  // paintId lets the mixer use each paint's measured colour + opacity rating.
  const recipeIngredients = React.useMemo(() => {
    return recipe.map(r => ({ hex: r.paint.hex, parts: r.parts, paintId: r.paint.id }));
  }, [recipe]);

  const mixedHex = React.useMemo(() => {
    return mixColorsWeighted(recipeIngredients) || '#1A1A1A';
  }, [recipeIngredients]);

  const topMatches = React.useMemo(() => {
    if (recipe.length === 0 || mixedHex === '#1A1A1A') return [];
    return findTopAlternativeMatches(mixedHex);
  }, [mixedHex, recipe.length]);

  const simulatedHex = React.useMemo(() => {
    if (primer === 'none' || recipe.length === 0) return mixedHex;
    return simulateBasecoat(mixedHex, primer, effectiveCoverage(recipeIngredients));
  }, [mixedHex, primer, recipe.length, recipeIngredients]);

  return (
    <motion.div key="forgemix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
      {/* 1. The Canvas (Output Swatch & Wet Palette Gradient) */}
      <div className="bg-[#050505] border-[6px] border-charcoal/90 outline outline-1 outline-brass/40 rounded-sm p-6 relative overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-brass/20 flex flex-col items-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.15)_0%,transparent_70%)] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_2px,#000_4px)]" />
        
        {/* Action Icons (Floating left and right) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto">
          <InfoTooltip 
            position="left"
            text={
              <div className="space-y-1.5">
                <strong className="text-imperial-gold block mb-1">HOW TO MIX:</strong>
                <ul className="list-disc pl-3 space-y-0.5 text-gray-400">
                  <li><span className="text-gray-300">Select paints</span> from your Inventory below.</li>
                  <li><span className="text-gray-300">Adjust ratios</span> and toggle basecoats.</li>
                  <li><span className="text-gray-300">Preview</span> the final colour before using real paint.</li>
                </ul>
              </div>
            } 
          />
        </div>

        {recipe.length > 0 && (
          <>
            <button 
              ref={primerButtonRef}
              onClick={() => { setShowPrimerToggle(!showPrimerToggle); setShowSaveInput(false); }}
              className={`absolute top-4 left-4 w-10 h-10 rounded-sm flex items-center justify-center transition-all z-20 border-y-2 border-x border-b-gray-900 border-t-gray-600 border-x-gray-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] active:scale-95 ${showPrimerToggle ? 'bg-brass/20 border-brass/50 text-imperial-gold drop-shadow-[0_0_4px_rgba(184,134,11,0.5)]' : 'bg-black/80 text-gray-500 hover:text-imperial-gold hover:bg-charcoal'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
            </button>
            <button 
              ref={saveButtonRef}
              onClick={() => { setShowSaveInput(!showSaveInput); setShowPrimerToggle(false); }}
              className={`absolute top-4 right-4 w-10 h-10 rounded-sm flex items-center justify-center transition-all z-20 border-y-2 border-x border-b-gray-900 border-t-gray-600 border-x-gray-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] active:scale-95 ${showSaveInput ? 'bg-brass/20 border-brass/50 text-imperial-gold drop-shadow-[0_0_4px_rgba(184,134,11,0.5)]' : 'bg-black/80 text-gray-500 hover:text-imperial-gold hover:bg-charcoal'}`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            </button>
          </>
        )}

        {/* Popovers */}
        <AnimatePresence>
          {showPrimerToggle && recipe.length > 0 && (
            <motion.div 
              ref={primerPopoverRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-18 left-6 z-30 bg-void-black/95 border border-gray-700 rounded-lg p-3 backdrop-blur-md shadow-xl"
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-widest tech-text mb-2 text-center">Simulate Basecoat</div>
              <div className="flex justify-center gap-3">
                {[
                  { id: 'none', label: 'None', color: 'transparent' },
                  { id: '#000000', label: 'Black', color: '#000000' },
                  { id: '#808080', label: 'Grey', color: '#808080' },
                  { id: '#DDD1B4', label: 'Bone', color: '#DDD1B4' },
                  { id: '#FFFFFF', label: 'White', color: '#FFFFFF' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => setPrimer(p.id as any)}
                    className={`flex flex-col items-center gap-1 opacity-80 hover:opacity-100 active:scale-95 transition-all ${primer === p.id ? 'opacity-100' : ''}`}
                  >
                    <div className={`w-6 h-6 rounded-full border ${primer === p.id ? 'border-brass scale-110' : 'border-gray-600'} transition-transform`} style={{ backgroundColor: p.color, ...(p.id === 'none' && { backgroundImage: 'repeating-linear-gradient(45deg, #333 25%, transparent 25%, transparent 75%, #333 75%, #333), repeating-linear-gradient(45deg, #333 25%, #222 25%, #222 75%, #333 75%, #333)', backgroundPosition: '0 0, 4px 4px', backgroundSize: '8px 8px' }) }} />
                    <span className={`text-[8px] uppercase tracking-widest ${primer === p.id ? 'text-brass' : 'text-gray-500'}`}>{p.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {showSaveInput && recipe.length > 0 && (
            <motion.div 
              ref={savePopoverRef}
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-18 right-6 z-30 bg-void-black/95 border border-gray-700 rounded-lg p-3 backdrop-blur-md shadow-xl w-64"
            >
              <div className="flex gap-2">
                <input 
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Name your mix..."
                  className="flex-1 bg-[#050505] border border-gray-800 rounded-sm px-2 py-1.5 text-base text-imperial-gold placeholder-gray-600 focus:outline-none focus:border-brass/50 transition-colors min-w-0 shadow-inner"
                />
                <button
                  disabled={!customName.trim()}
                  onClick={() => {
                    const newId = 'custom-' + Date.now();
                    addToInventory({ id: newId, name: customName.trim(), brand: 'Custom', hex: mixedHex, type: 'Custom Mix', rgb: [0,0,0], lab: [0,0,0], colorFamily: 'Mixed' });
                    setCustomName('');
                    setShowSaveInput(false);
                    setLastAddedId(newId);
                    setTimeout(() => setLastAddedId(null), 1000);
                  }}
                  className="px-4 bg-[#050505] text-imperial-gold text-[10px] font-bold tracking-widest uppercase rounded-sm border border-brass/30 hover:bg-brass/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.8)] flex-shrink-0 active:scale-95"
                >
                  SAVE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* The Containment Field (Swatch) */}
        <div className="relative w-32 h-32 flex items-center justify-center mt-2 mb-4 z-10">
          {/* Centrifuge Ring */}
          {recipe.length > 0 && (
            <motion.svg 
              className="absolute inset-[-15%] w-[130%] h-[130%] pointer-events-none opacity-50 drop-shadow-[0_0_4px_rgba(184,134,11,0.5)]"
              viewBox="0 0 100 100"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <circle cx="50" cy="50" r="48" fill="none" stroke="var(--imperial-gold)" strokeWidth="1" strokeDasharray="4 8" />
              <circle cx="50" cy="50" r="44" fill="none" stroke="var(--brass)" strokeWidth="0.5" strokeDasharray="10 5 2 5" />
            </motion.svg>
          )}

          <motion.div 
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: simulatedHex,
              boxShadow: recipe.length > 0 ? `0 0 40px ${simulatedHex}80, inset 0 0 20px rgba(255,255,255,0.2)` : 'inset 0 0 20px rgba(0,0,0,0.8)'
            }}
            animate={{ scale: recipe.length > 0 ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full z-10 pointer-events-none" />
        </div>
        
        <div className="text-center z-10 mb-4">
          <div className="text-xl font-bold tracking-widest uppercase tech-text text-white drop-shadow-md">
            {recipe.length > 0 ? 'CUSTOM MIX' : 'EMPTY CRUCIBLE'}
          </div>
          <div className="text-xs text-brass tech-text mt-1 font-mono uppercase">
            {recipe.length > 0 ? mixedHex : 'AWAITING INGREDIENTS'}
          </div>
        </div>

        {/* The Wet Palette Transition Bar */}
        {recipe.length > 1 && (
          <div className="w-full relative z-10 mt-2">
            <div className="text-[9px] text-gray-500 uppercase tracking-widest tech-text mb-2 text-center">Wet Palette Transition</div>
            <div className="w-full h-6 relative overflow-hidden rounded-full border border-gray-700/50 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)]">
              <div 
                className="absolute inset-0 opacity-90"
                style={{
                  background: `linear-gradient(to right, ${recipe.map(r => r.paint.hex).join(', ')})`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none mix-blend-overlay" />
            </div>
          </div>
        )}
      </div>

      {/* 2. The Recipe Board */}
      <div className="space-y-2 mt-6">
        <div className="flex justify-between items-end mb-3 px-1">
          <h3 className="text-sm text-imperial-gold/80 cyber-text tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] uppercase">ACTIVE INGREDIENTS</h3>
          {recipe.length > 0 && (
            <button 
              onClick={() => setRecipe([])} 
              className="text-[10px] text-red-500/80 hover:text-red-400 uppercase tracking-widest font-bold"
            >
              [ CLEAR MIX ]
            </button>
          )}
        </div>
        
        {recipe.length === 0 ? (
          <div className="bg-void-black/50 border border-gray-800 border-dashed rounded-lg p-6 text-center text-gray-600 text-xs uppercase tracking-widest tech-text">
            Select paints from your inventory below to begin mixing
          </div>
        ) : (
          <AnimatePresence>
            {recipe.map((ingredient, idx) => {
              const paintId = getPaintId(ingredient.paint);
              return (
                <motion.div 
                  key={paintId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center justify-between bg-charcoal/80 border border-gray-800 rounded-lg p-2 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-5 h-6 relative flex items-center justify-center flex-shrink-0 drop-shadow-md" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', backgroundColor: ingredient.paint.hex, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)' }}>
                      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                    </div>
                    <div className="truncate">
                      <div className="text-[11px] font-bold text-white uppercase truncate">{ingredient.paint.name}</div>
                      <div className="text-[10px] text-brass uppercase tracking-widest truncate">{ingredient.paint.brand}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center border-r border-gray-800 pr-1">
                      <button
                        disabled={idx === 0}
                        aria-label="Move up"
                        onClick={() => setRecipe(prev => { const n = [...prev]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; return n; })}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        ↑
                      </button>
                      <button
                        disabled={idx === recipe.length - 1}
                        aria-label="Move down"
                        onClick={() => setRecipe(prev => { const n = [...prev]; [n[idx+1], n[idx]] = [n[idx], n[idx+1]]; return n; })}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                      >
                        ↓
                      </button>
                    </div>

                    <div className="flex items-center gap-1 bg-void-black/80 rounded border border-gray-800 px-1 py-0.5">
                      <button
                        aria-label="Fewer parts"
                        onClick={() => {
                          if (ingredient.parts <= 1) setRecipe(prev => prev.filter(r => getPaintId(r.paint) !== paintId));
                          else setRecipe(prev => prev.map(r => getPaintId(r.paint) === paintId ? { ...r, parts: r.parts - 1 } : r));
                        }}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                      >-</button>
                      <div className="text-[11px] font-mono font-bold text-imperial-gold w-10 text-center select-none">
                        {ingredient.parts} PT
                      </div>
                      <button
                        aria-label="More parts"
                        onClick={() => setRecipe(prev => prev.map(r => getPaintId(r.paint) === paintId ? { ...r, parts: r.parts + 1 } : r))}
                        className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                      >+</button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* 4. Top Brand Alternatives */}
      {topMatches.length > 0 && (
        <div className="pt-2">
          <h3 className="text-sm text-imperial-gold/80 cyber-text tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] uppercase mb-2 px-1">TOP BRAND ALTERNATIVES</h3>
          <div className="space-y-1.5">
            {topMatches.map((match, idx) => (
              <div key={idx} className="flex items-center gap-3 justify-between bg-[#111] p-1.5 rounded border border-gray-800/80 shadow-inner">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-6 relative flex items-center justify-center flex-shrink-0 drop-shadow-md" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', backgroundColor: match.hex, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)' }}>
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                  </div>
                  <div className="text-left truncate">
                    <div className="text-[11px] font-bold text-white uppercase truncate">{match.name}</div>
                    <div className="text-[10px] text-brass uppercase tracking-widest">{match.brand}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className={`text-[11px] font-bold tech-text ${Number(match.delta_e) < 2 ? 'text-green-400' : Number(match.delta_e) < 4 ? 'text-amber-400' : 'text-red-400'}`}>
                    ΔE: {match.delta_e}
                  </div>
                  <button
                    onClick={() => addToCart(match as any)}
                    className="touch-target text-[11px] px-2 bg-charcoal border border-gray-700 hover:border-brass hover:text-brass text-gray-400 rounded uppercase tracking-widest transition-colors"
                  >
                    + CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. The Injector (Inventory Selector) */}
      <div className="pt-4 border-t border-gray-800/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 px-1 gap-2">
          <h3 className="text-sm text-imperial-gold/80 cyber-text tracking-[0.2em] drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] uppercase">INVENTORY</h3>
          
          {filterableMixInventory.length > 0 && (
            <div className="flex gap-2 relative z-50">
              <CustomDropdown 
                value={mixFilterBrand}
                options={mixInventoryBrands}
                onChange={setMixFilterBrand}
              />
              <CustomDropdown 
                value={mixFilterColor}
                options={mixInventoryColors}
                onChange={setMixFilterColor}
                formatOption={(val) => val === 'ALL' ? 'ALL COLOURS' : val}
              />
            </div>
          )}
        </div>
        
        {filterableMixInventory.length === 0 ? (
          <div className="text-center p-4 bg-red-900/10 border border-red-900/30 rounded text-red-400/80 text-xs">
            {inventory.length === 0 ? 'Your inventory is empty. Add paints in the Inventory tab first!' : 'No valid paints found. Washes and Contrasts cannot be used in mixes.'}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 px-1 max-h-64 overflow-y-auto scrollbar-hide">
            {filteredMixInventory.map(paint => {
              const paintId = getPaintId(paint);
              const isActive = recipe.some(r => getPaintId(r.paint) === paintId);
              
              return (
                <button
                  key={paintId}
                  onClick={() => {
                    if (!isActive) {
                      setRecipe(prev => [...prev, { paint, parts: 1 }]);
                    }
                  }}
                  className={`flex items-center gap-2 p-1.5 pr-3 rounded-full border transition-all ${
                    isActive 
                      ? 'border-brass bg-brass/10 opacity-50 cursor-not-allowed' 
                      : 'border-gray-800 bg-charcoal hover:border-brass/70 hover:bg-charcoal/80 shadow-[0_2px_8px_rgba(0,0,0,0.5)]'
                  }`}
                >
                  <div className="w-5 h-6 relative flex items-center justify-center flex-shrink-0 drop-shadow-md" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', backgroundColor: paint.hex, boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.4)' }}>
                    <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent pointer-events-none" />
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
                        <span className="text-white text-[8px] font-bold">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="text-left max-w-[80px] sm:max-w-[100px]">
                    <div className="text-[11px] font-bold text-white uppercase truncate">{paint.name}</div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}
