"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CustomDropdown } from '@/components/shared/CustomDropdown';
import { InfoTooltip } from '@/components/shared/InfoTooltip';
import { InventoryHexGrid } from '@/components/forge/InventoryHexGrid';
import type { Paint } from '@/lib/types';

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
    </motion.div>
  );
}
