'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import proofSchemes from '@/lib/data/proof_schemes.json';
import { PAINT_DATABASE } from '@/lib/paintDatabase';
import { PAINT_PRICES } from '@/lib/utils';

const paintMap = new Map(PAINT_DATABASE.map(p => [p.paint_id, p]));

export function RecipeProofStrip() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIndex(Math.floor(Math.random() * proofSchemes.length));
    setMounted(true);
    
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % proofSchemes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return <div className="w-full mt-4 flex flex-col items-center opacity-80 max-w-sm mx-auto h-[60px]" />;
  }

  const scheme = proofSchemes[index];

  let citPrice = 0;
  scheme.originalPalette.forEach(id => {
    const p = paintMap.get(id);
    if (p) {
      citPrice += PAINT_PRICES[p.brand] || 4.00;
    }
  });

  let budPrice = 0;
  scheme.budgetPalette.forEach(id => {
    const p = paintMap.get(id);
    if (p) {
      budPrice += PAINT_PRICES[p.brand] || 4.00;
    }
  });

  return (
    <div className="w-full mt-4 flex flex-col items-center opacity-80 max-w-sm mx-auto h-[60px] relative overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={scheme.model}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="absolute inset-0 flex flex-col items-center justify-center w-full"
        >
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2 font-mono truncate max-w-[280px]">{scheme.model}</p>
          
          <div className="flex w-full items-center justify-between text-xs font-mono">
            {/* Original */}
            <div className="flex gap-1">
              {scheme.originalPalette.map(id => {
                const p = paintMap.get(id);
                return <div key={id} className="w-4 h-4 rounded-sm border border-black/50" style={{backgroundColor: p?.hex}} title={p?.name} />
              })}
            </div>
            
            <span className="text-gray-500 mx-2 text-[10px]">→</span>
            
            {/* Budget */}
            <div className="flex gap-1">
              {scheme.budgetPalette.map(id => {
                const p = paintMap.get(id);
                return <div key={id} className="w-4 h-4 rounded-sm border border-black/50 shadow-[0_0_8px_rgba(212,175,55,0.4)]" style={{backgroundColor: p?.hex}} title={p?.name} />
              })}
            </div>
          </div>
          <div className="flex w-full justify-between mt-1 px-1">
            <span className="text-[11px] text-gray-500 uppercase tracking-widest">Citadel (£{citPrice.toFixed(2)})</span>
            <span className="text-[11px] text-[var(--imperial-gold)] uppercase tracking-widest font-bold">Budget Match (£{budPrice.toFixed(2)})</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
