'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import { ForgeBackground } from '@/components/ForgeBackground';
import { useAppStore } from '@/lib/store';
import type { Paint } from '@/lib/types';

// Themed fallback: without one the tab area is blank until the chunk loads.
function TabLoading() {
  return (
    <div className="py-16 text-center text-brass/60 tech-text text-[11px] uppercase tracking-widest animate-pulse">
      CONSULTING THE COGITATOR…
    </div>
  );
}

const ForgeInventoryTab = dynamic(() => import('@/components/forge/ForgeInventoryTab'), { ssr: false, loading: () => <TabLoading /> });
const ForgeMixTab = dynamic(() => import('@/components/forge/ForgeMixTab'), { ssr: false, loading: () => <TabLoading /> });
const ForgeRequisitionTab = dynamic(() => import('@/components/forge/ForgeRequisitionTab'), { ssr: false, loading: () => <TabLoading /> });
const DynamicAddPaintModal = dynamic(() => import('@/components/forge/AddPaintModal'), { ssr: false });

export default function ForgePage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'forgemix' | 'requisition'>('inventory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  const [newlyAddedQueue, setNewlyAddedQueue] = useState<string[]>([]);
  const [pendingAnimationIds, setPendingAnimationIds] = useState<string[]>([]);
  
  const cart = useAppStore((state) => state.cart);
  const inventory = useAppStore((state) => state.inventory);
  const addToInventory = useAppStore((state) => state.addToInventory);
  const removeFromInventory = useAppStore((state) => state.removeFromInventory);
  const addToCart = useAppStore((state) => state.addToCart);
  
  const [manifestId] = useState(() => Date.now().toString().slice(-6));

  const getPaintId = (p: Paint) => p.id || p.name.toLowerCase().replace(/\s+/g, '-');

  const handleAddPaint = (paint: Paint) => {
    addToInventory(paint);
    const pid = getPaintId(paint);
    setNewlyAddedQueue(prev => [...prev, pid]);
    setPendingAnimationIds(prev => [...prev, pid]);
  };

  React.useEffect(() => {
    if (!isAddModalOpen && newlyAddedQueue.length > 0) {
      const idsToAnimate = [...newlyAddedQueue];
      setNewlyAddedQueue([]); // Clear immediately so effect doesn't re-run

      let delay = 0;
      idsToAnimate.forEach((id) => {
        setTimeout(() => {
          // Un-ghost the node just before animating
          setPendingAnimationIds(prev => prev.filter(p => p !== id));
          setLastAddedId(id);
          setTimeout(() => setLastAddedId(null), 800);
        }, delay);
        delay += 600;
      });
    }
  }, [isAddModalOpen, newlyAddedQueue]);

  return (
    <div className="flex-1 bg-void-black text-white pt-8 px-4 relative overflow-hidden">
      <ForgeBackground />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8 mt-4">
           <h1 className="text-5xl md:text-7xl cyber-text font-black tracking-widest text-shadow-lg" style={{ color: '#ffb300', textShadow: '0 0 10px rgba(255,170,0,0.8), 0 0 30px rgba(255,170,0,0.5)' }}>THE FORGE</h1>
           <p className="text-gray-400 tech-text text-xs uppercase tracking-widest mt-2">Inventory • Alchemy • Requisitions</p>
        </div>
        
        {/* 3-TAB SEGMENTED TOGGLE */}
        <div className="flex p-1 bg-charcoal/80 border border-gray-800 rounded-lg relative overflow-hidden shadow-lg backdrop-blur-md">
           {['inventory', 'forgemix', 'requisition'].map((tab) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-3 text-[11px] sm:text-xs font-bold tracking-wide sm:tracking-widest uppercase z-10 transition-colors whitespace-nowrap ${activeTab === tab ? 'text-void-black' : 'text-gray-400 hover:text-brass'}`}
             >
               {tab === 'forgemix' ? 'FORGE MIX' : tab}
               {tab === 'inventory' && inventory.length > 0 && ` (${inventory.length})`}
               {tab === 'requisition' && cart.length > 0 && ` (${cart.length})`}
             </button>
           ))}
           
           {/* Slider background */}
           <motion.div 
             className="absolute top-1 bottom-1 w-[calc(33.33%-4px)] bg-brass rounded-md z-0"
             animate={{ x: activeTab === 'inventory' ? 0 : activeTab === 'forgemix' ? '100%' : '200%' }}
             transition={{ type: "spring", stiffness: 300, damping: 30 }}
           />
        </div>
        
        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'inventory' && (
            <ForgeInventoryTab 
              inventory={inventory}
              removeFromInventory={removeFromInventory}
              setIsAddModalOpen={setIsAddModalOpen}
              lastAddedId={lastAddedId}
              pendingAnimationIds={pendingAnimationIds}
            />
          )}

          {activeTab === 'forgemix' && (
            <ForgeMixTab 
              inventory={inventory}
              addToInventory={addToInventory}
              addToCart={addToCart}
              setLastAddedId={setLastAddedId}
            />
          )}

          {activeTab === 'requisition' && (
            <ForgeRequisitionTab 
              manifestId={manifestId}
            />
          )}
        </AnimatePresence>

      </div>

      <DynamicAddPaintModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAddPaint={handleAddPaint}
      />
    </div>
  );
}
