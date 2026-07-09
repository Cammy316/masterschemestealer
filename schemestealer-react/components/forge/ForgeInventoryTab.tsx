"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CustomDropdown } from '@/components/shared/CustomDropdown';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { InventoryHexGrid } from '@/components/forge/InventoryHexGrid';
import type { Paint } from '@/lib/types';
import { apiClient } from '@/lib/apiClient';

interface RackAnalysisResult {
  coverage_pct: number;
  suggestions: {
    paint_id: string;
    name: string;
    brand: string;
    hex: string;
    gap_size: number;
  }[];
}

function RackAnalysisPanel({ inventory }: { inventory: Paint[] }) {
  const [result, setResult] = useState<RackAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      try {
        const inventoryIds = inventory.map(p => p.id || (p as any).paint_id || `${p.brand}-${p.name}`);
        const data = await apiClient.post<RackAnalysisResult>('/api/forge/rack-analysis', {
          inventory: inventoryIds
        });
        setResult(data);
        setError(null);
      } catch (err) {
        console.error('Rack analysis failed', err);
        setError("Failed to analyse rack. The server might be unavailable.");
      } finally {
        setLoading(false);
      }
    };
    
    const timeout = setTimeout(analyze, 1000);
    return () => clearTimeout(timeout);
  }, [inventory]);

  if (!result && !loading && !error) return null;

  return (
    <div className="mt-8 p-6 bg-void-black/40 border border-imperial-gold/20 rounded-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <h3 className="text-xl font-bold text-imperial-gold gothic-text tracking-wider mb-2">RACK ANALYSIS</h3>
      
      {loading ? (
        <p className="text-sm text-gray-400">Analyzing collection geometry...</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : result && (
        <>
          <p className="text-sm text-gray-400 mb-6">Gamut Coverage: <span className="text-white font-bold">{result.coverage_pct}%</span></p>
          
          <div className="space-y-3 relative z-10">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recommended Additions</h4>
            {result.suggestions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {result.suggestions.map(s => (
                  <div key={s.paint_id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded">
                    <div className="w-8 h-8 rounded-full border border-white/20 flex-shrink-0" style={{ backgroundColor: s.hex }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-semibold truncate">{s.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{s.brand}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Your collection is highly comprehensive.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface ForgeInventoryTabProps {
  inventory: Paint[];
  removeFromInventory: (paintId: string) => void;
  setIsAddModalOpen: (open: boolean) => void;
  lastAddedId: string | null;
  pendingAnimationIds: string[];
}

export default function ForgeInventoryTab({ 
  inventory, 
  removeFromInventory, 
  setIsAddModalOpen, 
  lastAddedId, 
  pendingAnimationIds 
}: ForgeInventoryTabProps) {
  const [filterBrand, setFilterBrand] = useState('ALL');
  const [filterColor, setFilterColor] = useState('ALL');

  const filteredInventory = React.useMemo(() => {
    return inventory.filter(p => {
      if (filterBrand !== 'ALL' && p.brand.toUpperCase() !== filterBrand) return false;
      if (filterColor !== 'ALL' && (p.colorFamily || 'UNKNOWN').toUpperCase() !== filterColor) return false;
      return true;
    });
  }, [inventory, filterBrand, filterColor]);

  const dynamicBrandFilters = React.useMemo(() => {
    const brands = new Set(['ALL']);
    inventory.forEach(p => brands.add(p.brand.toUpperCase()));
    return Array.from(brands);
  }, [inventory]);

  const dynamicColorFilters = React.useMemo(() => {
    const colors = new Set(['ALL']);
    inventory.forEach(p => {
      if (p.colorFamily) colors.add(p.colorFamily.toUpperCase());
    });
    return Array.from(colors);
  }, [inventory]);

  return (
    <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
      {/* Filters and Tooltip */}
      <div className="flex justify-between items-center relative z-50">
        {inventory.length > 0 ? (
          <div className="flex gap-2">
            <CustomDropdown 
              value={filterBrand}
              options={dynamicBrandFilters}
              onChange={setFilterBrand}
            />
            <CustomDropdown 
              value={filterColor}
              options={dynamicColorFilters}
              onChange={setFilterColor}
              formatOption={(val) => val === 'ALL' ? 'ALL COLORS' : val}
            />
          </div>
        ) : <div />}
        <InfoTooltip 
          position="left"
          text={
            <div className="space-y-1.5">
              <strong className="text-imperial-gold block mb-1">COLLECTION BENEFITS:</strong>
              <ul className="list-disc pl-3 space-y-0.5 text-gray-400">
                <li><span className="text-gray-300">Miniscan</span> prioritises matches to colours you own.</li>
                <li><span className="text-gray-300">Forge Mix</span> unlocks custom mixing from your library.</li>
              </ul>
            </div>
          } 
        />
      </div>

      {/* Gamified Silhouette Grid */}
      <div className="relative overflow-hidden p-1 -m-1">
        <InventoryHexGrid 
          inventory={filteredInventory}
          onAddPaint={() => setIsAddModalOpen(true)}
          onRemovePaint={removeFromInventory}
          lastAddedId={lastAddedId}
          pendingAnimationIds={pendingAnimationIds}
        />
      </div>

      <RackAnalysisPanel inventory={inventory} />
    </motion.div>
  );
}
