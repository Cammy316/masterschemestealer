/**
 * RegionSelector - Select region for affiliate links and availability
 * Persists selection to localStorage
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Region = 'uk' | 'us' | 'eu' | 'au' | 'global';

const REGIONS: { value: Region; label: string; icon: string; flag: string }[] = [
  { value: 'uk', label: 'United Kingdom', icon: '🇬🇧', flag: 'UK' },
  { value: 'us', label: 'United States', icon: '🇺🇸', flag: 'US' },
  { value: 'eu', label: 'European Union', icon: '🇪🇺', flag: 'EU' },
  { value: 'au', label: 'Australia', icon: '🇦🇺', flag: 'AU' },
  { value: 'global', label: 'Global', icon: '🌍', flag: 'INT' },
];

const STORAGE_KEY = 'schemeSteal:preferredRegion';

interface RegionSelectorProps {
  value?: Region;
  onChange?: (region: Region) => void;
  compact?: boolean;
}

export function RegionSelector({ value: controlledValue, onChange, compact = false }: RegionSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<Region>('global');
  const [isOpen, setIsOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (controlledValue === undefined) {
      const stored = localStorage.getItem(STORAGE_KEY) as Region | null;
      if (stored && REGIONS.some(r => r.value === stored)) {
        setSelectedRegion(stored);
      }
    }
  }, [controlledValue]);

  // Use controlled value if provided
  const currentRegion = controlledValue !== undefined ? controlledValue : selectedRegion;
  const currentRegionInfo = REGIONS.find(r => r.value === currentRegion) || REGIONS[4];

  const handleSelect = (region: Region) => {
    if (controlledValue === undefined) {
      setSelectedRegion(region);
      localStorage.setItem(STORAGE_KEY, region);
    }

    if (onChange) {
      onChange(region);
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
          <span className="text-lg">{currentRegionInfo.icon}</span>
          <span className="text-brass text-sm font-bold cyber-text">
            {currentRegionInfo.flag}
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
                className="absolute top-full mt-2 right-0 w-56 bg-dark-gothic border-2 border-brass rounded-lg shadow-xl z-50 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {REGIONS.map((region) => (
                  <motion.button
                    key={region.value}
                    onClick={() => handleSelect(region.value)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left touch-target"
                    style={{
                      backgroundColor: region.value === currentRegion ? 'var(--brass-dark)' : 'transparent',
                      borderBottom: '1px solid var(--charcoal)',
                    }}
                    whileHover={{
                      backgroundColor: 'var(--brass-dark)',
                      x: 4,
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-2xl">{region.icon}</span>
                    <div className="flex-1">
                      <div
                        className="text-sm font-medium cyber-text"
                        style={{
                          color: region.value === currentRegion ? 'var(--imperial-gold)' : 'var(--brass)',
                        }}
                      >
                        {region.label}
                      </div>
                    </div>
                    {region.value === currentRegion && (
                      <motion.span
                        className="text-imperial-gold"
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
          🌍 SUPPLY REALM 🌍
        </h3>

        <div className="space-y-2">
          {REGIONS.map((region) => (
            <motion.button
              key={region.value}
              onClick={() => handleSelect(region.value)}
              className="w-full flex items-center gap-4 p-3 rounded-lg border-2 touch-target"
              style={{
                borderColor: region.value === currentRegion ? 'var(--imperial-gold)' : 'var(--brass)',
                backgroundColor: region.value === currentRegion ? 'var(--brass-dark)' : 'var(--charcoal)',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 0 15px var(--brass)',
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <span className="text-3xl">{region.icon}</span>
              <div className="flex-1 text-left">
                <div
                  className="text-sm font-bold cyber-text"
                  style={{
                    color: region.value === currentRegion ? 'var(--imperial-gold)' : 'var(--brass)',
                  }}
                >
                  {region.label}
                </div>
                <div className="text-xs text-brass/60 tech-text">
                  {region.flag}
                </div>
              </div>

              {region.value === currentRegion && (
                <motion.div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
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
          Determines affiliate merchant links and availability
        </motion.p>
      </div>
    </div>
  );
}

export default RegionSelector;
