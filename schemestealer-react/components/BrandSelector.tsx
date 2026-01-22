/**
 * BrandSelector - Filter paint recommendations by brand
 * Persists selection to localStorage
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type PaintBrand = 'all' | 'citadel' | 'vallejo' | 'army_painter' | 'reaper' | 'scale75' | 'pro_acryl';

const BRANDS: { value: PaintBrand; label: string; icon: string }[] = [
  { value: 'all', label: 'All Brands', icon: '⚙' },
  { value: 'citadel', label: 'Citadel', icon: '🏛️' },
  { value: 'vallejo', label: 'Vallejo', icon: '🎨' },
  { value: 'army_painter', label: 'Army Painter', icon: '🖌️' },
  { value: 'reaper', label: 'Reaper', icon: '💀' },
  { value: 'scale75', label: 'Scale75', icon: '⚔️' },
  { value: 'pro_acryl', label: 'Pro Acryl', icon: '✨' },
];

const STORAGE_KEY = 'schemeSteal:preferredBrand';

interface BrandSelectorProps {
  value?: PaintBrand;
  onChange?: (brand: PaintBrand) => void;
  compact?: boolean;
}

export function BrandSelector({ value: controlledValue, onChange, compact = false }: BrandSelectorProps) {
  const [selectedBrand, setSelectedBrand] = useState<PaintBrand>('all');
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (controlledValue === undefined) {
      const stored = localStorage.getItem(STORAGE_KEY) as PaintBrand | null;
      if (stored && BRANDS.some(b => b.value === stored)) {
        setSelectedBrand(stored);
      }
    }
  }, [controlledValue]);

  // Use controlled value if provided
  const currentBrand = controlledValue !== undefined ? controlledValue : selectedBrand;
  const currentBrandInfo = BRANDS.find(b => b.value === currentBrand) || BRANDS[0];

  const handleSelect = (brand: PaintBrand) => {
    if (controlledValue === undefined) {
      setSelectedBrand(brand);
      localStorage.setItem(STORAGE_KEY, brand);
    }

    if (onChange) {
      onChange(brand);
    }

    setIsOpen(false);
  };

  if (compact) {
    return (
      <div className="relative inline-block">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-brass bg-dark-gothic touch-target"
          whileHover={{
            boxShadow: '0 0 15px var(--brass)',
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg">{currentBrandInfo.icon}</span>
          <span className="text-brass text-sm font-bold cyber-text">
            {currentBrandInfo.label}
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-brass"
          >
            ▼
          </motion.span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                className="absolute top-full mt-2 left-0 w-48 bg-dark-gothic border-2 border-brass rounded-lg shadow-xl z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {BRANDS.map((brand) => (
                  <motion.button
                    key={brand.value}
                    onClick={() => handleSelect(brand.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left touch-target"
                    style={{
                      backgroundColor: brand.value === currentBrand ? 'var(--brass-dark)' : 'transparent',
                      borderBottom: '1px solid var(--charcoal)',
                    }}
                    whileHover={{
                      backgroundColor: 'var(--brass-dark)',
                      x: 4,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{brand.icon}</span>
                    <span
                      className="text-sm font-medium cyber-text"
                      style={{
                        color: brand.value === currentBrand ? 'var(--imperial-gold)' : 'var(--brass)',
                      }}
                    >
                      {brand.label}
                    </span>
                    {brand.value === currentBrand && (
                      <motion.span
                        className="ml-auto text-imperial-gold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full card version
  return (
    <div className="warp-border rounded-lg p-1">
      <div className="bg-dark-gothic rounded-lg p-4">
        <h3 className="text-lg font-bold mb-4 text-brass gothic-text text-center">
          ⚙ PREFERRED PAINT FORGE ⚙
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {BRANDS.map((brand) => (
            <motion.button
              key={brand.value}
              onClick={() => handleSelect(brand.value)}
              className="flex flex-col items-center justify-center p-3 rounded-lg border-2 touch-target"
              style={{
                borderColor: brand.value === currentBrand ? 'var(--imperial-gold)' : 'var(--brass)',
                backgroundColor: brand.value === currentBrand ? 'var(--brass-dark)' : 'var(--charcoal)',
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 15px var(--brass)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="text-3xl mb-1">{brand.icon}</span>
              <span
                className="text-xs font-bold cyber-text text-center"
                style={{
                  color: brand.value === currentBrand ? 'var(--imperial-gold)' : 'var(--brass)',
                }}
              >
                {brand.label}
              </span>

              {brand.value === currentBrand && (
                <motion.div
                  className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'var(--imperial-gold)',
                    color: 'var(--void-black)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  ✓
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>

        <motion.p
          className="text-center text-xs text-brass/60 mt-4 tech-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Selection persisted to local databank
        </motion.p>
      </div>
    </div>
  );
}

export default BrandSelector;
