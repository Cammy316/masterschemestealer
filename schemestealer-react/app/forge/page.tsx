'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from '@/components/ShoppingCart';
import { BrandSelector, type PaintBrand } from '@/components/BrandSelector';
import { RegionSelector, type Region } from '@/components/RegionSelector';
import { ForgeBackground } from '@/components/ForgeBackground';
import AddPaintModal from '@/components/forge/AddPaintModal';
import { useAppStore } from '@/lib/store';
import type { Paint } from '@/lib/types';
import { getPaintId } from '@/lib/utils';
import { mixColorsWeighted, findTopAlternativeMatches, simulateBasecoat } from '@/lib/colorMath';
import { PAINT_DATABASE } from '@/lib/paintDatabase';

const AFFILIATE_MERCHANTS: Record<Region, { name: string; searchUrl: (query: string) => string }[]> = {
  uk: [{ name: 'Element Games', searchUrl: (q) => `https://elementgames.co.uk/search?q=${encodeURIComponent(q)}` }],
  us: [{ name: 'Miniature Market', searchUrl: (q) => `https://miniaturemarket.com/search?q=${encodeURIComponent(q)}` }],
  eu: [{ name: 'Games Workshop EU', searchUrl: (q) => `https://warhammer.com/search?q=${encodeURIComponent(q)}` }],
  au: [{ name: 'Games Workshop AU', searchUrl: (q) => `https://warhammer.com/search?q=${encodeURIComponent(q)}` }],
  global: [{ name: 'Amazon', searchUrl: (q) => `https://amazon.com/s?k=${encodeURIComponent(q)}` }],
};


const TEST_PAINT_NAMES = [
  'Mephiston Red',
  'Abaddon Black',
  'Retributor Armour',
  'Nuln Oil',
  'Macragge Blue',
  'Leadbelcher',
  'Ultramarine', 
  'Greenskin',
];

const DEV_TEST_PAINTS: Paint[] = PAINT_DATABASE
  .filter(pd => TEST_PAINT_NAMES.includes(pd.name))
  .map(pd => ({
    id: pd.paint_id,
    name: pd.name,
    brand: pd.brand,
    hex: pd.hex,
    type: pd.type,
    colorFamily: pd.colorFamily,
    rgb: [pd.rgb.r, pd.rgb.g, pd.rgb.b],
    lab: [pd.lab.l, pd.lab.a, pd.lab.b],
  }));

const WIREFRAME_ICONS = [
  // 1. Vial/Cylinder
  <svg key="vial" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><ellipse cx="12" cy="5" rx="6" ry="2" /><ellipse cx="12" cy="19" rx="6" ry="2" /><line x1="6" y1="5" x2="6" y2="19" /><line x1="18" y1="5" x2="18" y2="19" /><path d="M6 12c0 1.1 2.7 2 6 2s6-.9 6-2" /></svg>,
  // 2. Crystal (Octahedron)
  <svg key="crystal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><polygon points="12,2 20,12 12,22 4,12" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="12" y1="2" x2="12" y2="22" /><line x1="12" y1="2" x2="15" y2="12" /><line x1="12" y1="2" x2="9" y2="12" /><line x1="12" y1="22" x2="15" y2="12" /><line x1="12" y1="22" x2="9" y2="12" /></svg>,
  // 3. Pyramid
  <svg key="pyramid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><polygon points="12,3 21,18 3,18" /><line x1="12" y1="3" x2="16" y2="18" /><line x1="12" y1="3" x2="8" y2="18" /><line x1="3" y1="18" x2="12" y2="15" /><line x1="21" y1="18" x2="12" y2="15" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
  // 4. Wireframe Sphere
  <svg key="sphere" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><circle cx="12" cy="12" r="10" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="4" ry="10" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="12" y1="2" x2="12" y2="22" /></svg>,
  // 5. Data Node Hex Array
  <svg key="node" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><polygon points="12,2 21,7 21,17 12,22 3,17 3,7" /><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="8" /><line x1="12" y1="22" x2="12" y2="16" /><line x1="3" y1="7" x2="8" y2="10" /><line x1="21" y1="17" x2="15" y2="14" /><line x1="21" y1="7" x2="15" y2="10" /><line x1="3" y1="17" x2="8" y2="14" /></svg>,
  // 6. Tesseract
  <svg key="tesseract" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><rect x="2" y="2" width="14" height="14" /><rect x="8" y="8" width="14" height="14" /><line x1="2" y1="2" x2="8" y2="8" /><line x1="16" y1="2" x2="22" y2="8" /><line x1="2" y1="16" x2="8" y2="22" /><line x1="16" y1="16" x2="22" y2="22" /></svg>,
  // 7. Engine Block
  <svg key="engine" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><rect x="4" y="6" width="16" height="12" rx="2" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="8" y1="6" x2="8" y2="18" /><line x1="12" y1="6" x2="12" y2="18" /><line x1="16" y1="6" x2="16" y2="18" /><circle cx="12" cy="12" r="2" fill="none" /></svg>,
  // 8. DNA Helix
  <svg key="dna" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><path d="M7 4s-3 3-3 8 3 8 3 8" /><path d="M17 4s3 3 3 8-3 8-3 8" /><line x1="7" y1="6" x2="17" y2="6" /><line x1="4.5" y1="10" x2="19.5" y2="10" /><line x1="4" y1="14" x2="20" y2="14" /><line x1="6.5" y1="18" x2="17.5" y2="18" /></svg>,
  // 9. Hourglass (Chronometer)
  <svg key="hourglass" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><polygon points="6,2 18,2 14,12 18,22 6,22 10,12" /><line x1="6" y1="2" x2="18" y2="2" /><line x1="6" y1="22" x2="18" y2="22" /><line x1="10" y1="12" x2="14" y2="12" /></svg>,
  // 10. Prism
  <svg key="prism" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><polygon points="12,2 22,20 2,20" /><line x1="12" y1="2" x2="12" y2="20" /><line x1="12" y1="2" x2="18" y2="16" /><line x1="12" y1="20" x2="18" y2="16" /><line x1="22" y1="20" x2="18" y2="16" /></svg>,
  // 11. Radar / Dish
  <svg key="radar" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><path d="M4 10a8 8 0 0 1 16 0" /><path d="M2 12a10 10 0 0 1 20 0" /><line x1="12" y1="10" x2="12" y2="22" /><polygon points="9,22 15,22 12,18" /><circle cx="12" cy="10" r="2" /></svg>,
  // 12. CPU Core
  <svg key="cpu" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><rect x="6" y="6" width="12" height="12" /><rect x="10" y="10" width="4" height="4" /><line x1="6" y1="8" x2="2" y2="8" /><line x1="6" y1="12" x2="2" y2="12" /><line x1="6" y1="16" x2="2" y2="16" /><line x1="18" y1="8" x2="22" y2="8" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="18" y1="16" x2="22" y2="16" /><line x1="8" y1="6" x2="8" y2="2" /><line x1="12" y1="6" x2="12" y2="2" /><line x1="16" y1="6" x2="16" y2="2" /><line x1="8" y1="18" x2="8" y2="22" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="16" y1="18" x2="16" y2="22" /></svg>,
  // 13. Drone Eye
  <svg key="drone" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /><path d="M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>,
  // 14. Battery Cell
  <svg key="battery" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><rect x="6" y="4" width="12" height="16" rx="2" ry="2" /><rect x="9" y="2" width="6" height="2" /><line x1="6" y1="8" x2="18" y2="8" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="6" y1="16" x2="18" y2="16" /><path d="M12 12l2-3h-4l2-3" /></svg>,
  // 15. Magnetic Toroid
  <svg key="toroid" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><ellipse cx="12" cy="12" rx="10" ry="6" /><ellipse cx="12" cy="12" rx="4" ry="2" /><path d="M2 12c0 3.31 4.48 6 10 6s10-2.69 10-6" /><line x1="12" y1="6" x2="12" y2="10" /><line x1="12" y1="14" x2="12" y2="18" /><line x1="4" y1="9" x2="7" y2="11" /><line x1="20" y1="9" x2="17" y2="11" /><line x1="4" y1="15" x2="7" y2="13" /><line x1="20" y1="15" x2="17" y2="13" /></svg>,
  // 16. Orbital Satellite
  <svg key="satellite" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-8 h-8 text-amber-500/30 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]"><rect x="10" y="8" width="4" height="8" /><polygon points="10,8 14,8 12,4" /><polygon points="10,16 14,16 12,20" /><rect x="2" y="10" width="6" height="4" /><rect x="16" y="10" width="6" height="4" /><line x1="8" y1="12" x2="10" y2="12" /><line x1="14" y1="12" x2="16" y2="12" /></svg>
];

export default function ForgePage() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'forgemix' | 'requisition'>('inventory');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterBrand, setFilterBrand] = useState('ALL');
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);
  
  const cart = useAppStore((state) => state.cart);
  const inventory = useAppStore((state) => state.inventory);
  const addToInventory = useAppStore((state) => state.addToInventory);
  const removeFromInventory = useAppStore((state) => state.removeFromInventory);
  const addToCart = useAppStore((state) => state.addToCart);
  const preferredBrands = useAppStore((state) => state.preferredBrands);
  const setPreferredBrands = useAppStore((state) => state.setPreferredBrands);
  const preferredRegion = useAppStore((state) => state.preferredRegion) as Region;
  const setPreferredRegion = useAppStore((state) => state.setPreferredRegion);
  const [manifestId] = useState(() => Date.now().toString().slice(-6));

  const merchants = AFFILIATE_MERCHANTS[preferredRegion] || AFFILIATE_MERCHANTS.global;

  const filteredInventory = filterBrand === 'ALL' 
    ? inventory 
    : inventory.filter(p => p.brand.toUpperCase() === filterBrand);

  const dynamicBrandFilters = React.useMemo(() => {
    const brands = new Set(['ALL']);
    inventory.forEach(p => {
      brands.add(p.brand.toUpperCase());
    });
    return Array.from(brands);
  }, [inventory]);

  const [recipe, setRecipe] = useState<{paint: Paint, parts: number}[]>([]);
  const [primer, setPrimer] = useState<'none'|'#000000'|'#808080'|'#DDD1B4'|'#FFFFFF'>('none');
  const [customName, setCustomName] = useState('');
  const [showPrimerToggle, setShowPrimerToggle] = useState(false);
  const [showSaveInput, setShowSaveInput] = useState(false);
  
  const [mixFilterBrand, setMixFilterBrand] = useState('ALL');
  const [mixFilterColor, setMixFilterColor] = useState('ALL');

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
  
  const mixedHex = React.useMemo(() => {
    return mixColorsWeighted(recipe.map(r => ({ hex: r.paint.hex, parts: r.parts }))) || '#1A1A1A';
  }, [recipe]);

  const topMatches = React.useMemo(() => {
    if (recipe.length === 0 || mixedHex === '#1A1A1A') return [];
    return findTopAlternativeMatches(mixedHex);
  }, [mixedHex, recipe.length]);

  const simulatedHex = React.useMemo(() => {
    if (primer === 'none' || recipe.length === 0) return mixedHex;
    return simulateBasecoat(mixedHex, primer);
  }, [mixedHex, primer, recipe.length]);

  const totalSlots = 60;
  const lockedSlotsCount = Math.max(0, totalSlots - filteredInventory.length);
  
  // Pre-generate random properties for locked slots so they don't change on re-render
  // We use a look-back strategy to prevent duplicate icons horizontally and vertically 
  // across all responsive grid column sizes (4, 5, 6, and 8).
  const [lockedSlots] = useState(() => {
    const slots: { iconIndex: number; bgPosition: string }[] = [];
    for (let i = 0; i < totalSlots; i++) {
      let iconIndex = 0;
      let isValid = false;
      
      while (!isValid) {
        iconIndex = Math.floor(Math.random() * WIREFRAME_ICONS.length);
        isValid = true;
        
        if (i > 0 && slots[i - 1].iconIndex === iconIndex) isValid = false;
        if (i >= 4 && slots[i - 4].iconIndex === iconIndex) isValid = false;
        if (i >= 5 && slots[i - 5].iconIndex === iconIndex) isValid = false;
        if (i >= 6 && slots[i - 6].iconIndex === iconIndex) isValid = false;
        if (i >= 8 && slots[i - 8].iconIndex === iconIndex) isValid = false;
      }
      
      slots.push({
        iconIndex,
        bgPosition: `${Math.floor(Math.random() * 100)}% ${Math.floor(Math.random() * 100)}%`,
      });
    }
    return slots;
  });

  const handleAddPaint = (paint: Paint) => {
    addToInventory(paint);
    setLastAddedId(getPaintId(paint));
    setIsAddModalOpen(false);
    
    // Clear the flash effect after 1 second
    setTimeout(() => setLastAddedId(null), 1000);
  };

  return (
    <div className="min-h-screen bg-void-black text-white pb-24 pt-8 px-4 relative overflow-hidden">
      <ForgeBackground />

      <div className="max-w-3xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-8 mt-4">
           <h1 className="text-5xl md:text-7xl cyber-text font-black tracking-widest text-shadow-lg" style={{ color: '#ffb300', textShadow: '0 0 10px rgba(255,170,0,0.8), 0 0 30px rgba(255,170,0,0.5)' }}>THE FORGE</h1>
           <p className="text-gray-400 tech-text text-xs uppercase tracking-widest mt-2">Inventory • Alchemy • Requisitions</p>
        </div>
        
        {/* 3-TAB SEGMENTED TOGGLE */}
        <div className="flex p-1 bg-charcoal/80 border border-gray-800 rounded-lg relative overflow-hidden shadow-lg backdrop-blur-md">
           {['inventory', 'forgemix', 'requisition'].map((tab, idx) => (
             <button 
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`flex-1 py-3 text-[10px] sm:text-xs font-bold tracking-widest uppercase z-10 transition-colors ${activeTab === tab ? 'text-void-black' : 'text-gray-400 hover:text-brass'}`}
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
             <motion.div key="inventory" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
                
                {/* Inventory Header & Add Button */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-charcoal/50 border border-gray-800 p-4 rounded-lg backdrop-blur-sm">
                  <div>
                    <h3 className="text-xl text-imperial-gold gothic-text tracking-widest text-shadow">
                      {inventory.length} {inventory.length === 1 ? 'PAINT' : 'PAINTS'} UNLOCKED
                    </h3>
                  </div>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="mt-4 sm:mt-0 py-2 px-6 bg-void-black border border-brass/50 text-brass hover:bg-brass/20 hover:border-brass rounded text-xs uppercase tracking-widest tech-text transition-all shadow-[0_0_10px_rgba(184,134,11,0.1)]"
                  >
                    + ADD PAINT
                  </button>
                </div>

                {/* Brand Filter Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {dynamicBrandFilters.map(brand => (
                    <button
                      key={brand}
                      onClick={() => setFilterBrand(brand)}
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all ${
                        filterBrand === brand 
                        ? 'bg-brass text-void-black shadow-[0_0_10px_rgba(184,134,11,0.5)]' 
                        : 'bg-void-black/50 border border-gray-800 text-gray-500 hover:text-brass hover:border-gray-600'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>

                {/* Gamified Silhouette Grid */}
                <div className="relative overflow-hidden p-1 -m-1">
                  {/* Shimmer Sweep Animation */}
                  <motion.div 
                    className="absolute top-[-50%] bottom-[-50%] w-[50%] bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 pointer-events-none z-30"
                    animate={{ 
                      x: ['-300%', '600%'],
                      opacity: [0, 1, 1, 0] 
                    }}
                    transition={{ 
                      duration: 3, 
                      delay: 15,
                      repeat: Infinity, 
                      repeatDelay: 60, 
                      ease: "linear",
                      times: [0, 0.1, 0.9, 1]
                    }}
                  />

                  <motion.div 
                    className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3 relative"
                    animate={lastAddedId ? { y: [0, 8, -6, 4, -2, 0] } : { y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnimatePresence>
                    {/* UNLOCKED PAINTS */}
                    {filteredInventory.map((paint) => {
                      const id = getPaintId(paint);
                      const isNew = lastAddedId === id;
                      
                      return (
                        <motion.div 
                          key={id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: isNew ? [1.4, 0.9, 1.05, 1] : 1 }}
                          transition={{ duration: isNew ? 0.5 : 0.3, ease: isNew ? "easeOut" : "easeInOut" }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="aspect-square rounded-lg border-2 border-brass bg-charcoal/90 flex flex-col items-center justify-center p-2 relative overflow-hidden group shadow-[0_4px_15px_rgba(0,0,0,0.5)]"
                        >
                          {/* ✕ Remove Button */}
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeFromInventory(id); }}
                            className="absolute top-1 right-1 w-5 h-5 bg-red-900/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] z-20 hover:bg-red-600"
                          >
                            ✕
                          </button>

                          {/* Flash overlay and shockwave for newly added paint */}
                          {isNew && (
                            <>
                              <motion.div 
                                className="absolute inset-0 z-10 mix-blend-screen"
                                style={{ backgroundColor: paint.hex }}
                                animate={{ opacity: [1, 0] }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                              <motion.div 
                                className="absolute inset-0 z-0 rounded-lg border-4"
                                style={{ borderColor: paint.hex }}
                                animate={{ scale: [1, 1.8], opacity: [1, 0] }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                              />
                            </>
                          )}

                          {/* 3D Hexagon Paint Swatch */}
                          <div 
                            className="w-10 h-11 mb-2 relative z-10 flex items-center justify-center drop-shadow-md"
                            style={{
                              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                              backgroundColor: paint.hex,
                              boxShadow: 'inset 0 4px 6px rgba(255,255,255,0.3), inset 0 -4px 6px rgba(0,0,0,0.4)'
                            }}
                          >
                             {/* Glossy highlight */}
                             <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent" />
                          </div>
                          
                          <div className="bg-black/60 w-[110%] px-1 py-0.5 mt-1 border-y border-gray-800/50 relative z-10">
                            <div className="text-[9px] sm:text-[10px] font-bold text-center leading-tight truncate w-full uppercase text-white drop-shadow-md">
                              {paint.name}
                            </div>
                            <div className="text-[7px] text-brass/90 truncate w-full text-center mt-0.5 drop-shadow-md">
                              {paint.brand}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* LOCKED MYSTERY SLOTS (Vaults) */}
                    {Array.from({ length: lockedSlotsCount }).map((_, index) => {
                      const vault = lockedSlots[index % lockedSlots.length];
                      return (
                        <motion.div 
                          key={`locked-${index}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="aspect-square rounded-lg border border-gray-900 bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden shadow-[inset_0_4px_10px_rgba(0,0,0,0.8)]"
                        >
                          {/* Procedurally Offset Inner hex texture for vault */}
                          <div className="absolute inset-0 opacity-20 mix-blend-overlay" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='34.64101615137754' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 8.660254037844386l-10 5.773502691896258L0 8.660254037844386V-2.886751345948129l10-5.773502691896258 10 5.773502691896258V8.660254037844386zm0 23.09401076758503l-10 5.773502691896258-10-5.773502691896258V20.2072594216369l10-5.773502691896258 10 5.773502691896258v11.547005383792516z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                            backgroundSize: '15px',
                            backgroundPosition: vault.bgPosition
                          }} />
                          
                          {/* Matrix Icon */}
                          <div className="relative z-10 text-gray-500 drop-shadow-md">
                            {WIREFRAME_ICONS[vault.iconIndex]}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  </motion.div>
                </div>

             </motion.div>
          )}

          {activeTab === 'forgemix' && (
             <motion.div key="forgemix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mt-8 space-y-6">
                {/* 1. The Canvas (Output Swatch & Wet Palette Gradient) */}
                <div className="bg-[#111] border border-gray-800 rounded-xl p-6 relative overflow-hidden shadow-2xl flex flex-col items-center">
                  <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay"></div>
                  
                  {/* Action Icons (Floating left and right) */}
                  {recipe.length > 0 && (
                    <>
                      <button 
                        onClick={() => { setShowPrimerToggle(!showPrimerToggle); setShowSaveInput(false); }}
                        className={`absolute top-6 left-6 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 ${showPrimerToggle ? 'bg-brass text-void-black' : 'bg-charcoal border border-gray-700 text-gray-400 hover:text-white'}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/></svg>
                      </button>
                      <button 
                        onClick={() => { setShowSaveInput(!showSaveInput); setShowPrimerToggle(false); }}
                        className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all z-20 ${showSaveInput ? 'bg-brass text-void-black' : 'bg-charcoal border border-gray-700 text-gray-400 hover:text-white'}`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                      </button>
                    </>
                  )}

                  {/* Popovers */}
                  <AnimatePresence>
                    {showPrimerToggle && recipe.length > 0 && (
                      <motion.div 
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
                              className={`flex flex-col items-center gap-1 opacity-80 hover:opacity-100 transition-opacity ${primer === p.id ? 'opacity-100' : ''}`}
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
                            className="flex-1 bg-charcoal border border-gray-700 rounded px-2 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brass transition-colors min-w-0"
                          />
                          <button
                            disabled={!customName.trim()}
                            onClick={() => {
                              const newId = 'custom-' + Date.now();
                              addToInventory({ id: newId, name: customName.trim(), brand: 'Custom', hex: mixedHex, type: 'Custom Mix' });
                              setCustomName('');
                              setShowSaveInput(false);
                              setLastAddedId(newId);
                              setTimeout(() => setLastAddedId(null), 1000);
                            }}
                            className="px-3 bg-brass text-void-black text-[10px] font-bold tracking-widest uppercase rounded hover:bg-imperial-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            SAVE
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* The Containment Field (Swatch) */}
                  <div className="relative w-32 h-32 flex items-center justify-center mt-2 mb-4 z-10">
                    <motion.div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: simulatedHex,
                        boxShadow: recipe.length > 0 ? `0 0 40px ${simulatedHex}80, inset 0 0 20px rgba(255,255,255,0.2)` : 'inset 0 0 20px rgba(0,0,0,0.8)'
                      }}
                      animate={{ scale: recipe.length > 0 ? [1, 1.05, 1] : 1 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    
                    {/* Removed the SVG wireframe, keeping it as a sleek liquid drop */}
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
                <div className="space-y-2">
                  <div className="flex justify-between items-end mb-2 px-1">
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
                                <div className="text-[10px] font-bold text-white uppercase truncate">{ingredient.paint.name}</div>
                                <div className="text-[8px] text-brass uppercase tracking-widest truncate">{ingredient.paint.brand}</div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <div className="flex items-center gap-1 border-r border-gray-800 pr-2">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => setRecipe(prev => { const n = [...prev]; [n[idx-1], n[idx]] = [n[idx], n[idx-1]]; return n; })}
                                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                                >
                                  ↑
                                </button>
                                <button
                                  disabled={idx === recipe.length - 1}
                                  onClick={() => setRecipe(prev => { const n = [...prev]; [n[idx+1], n[idx]] = [n[idx], n[idx+1]]; return n; })}
                                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                                >
                                  ↓
                                </button>
                              </div>
                              
                              <div className="flex items-center gap-2 bg-void-black/80 rounded border border-gray-800 px-1 py-0.5">
                                <button 
                                  onClick={() => {
                                    if (ingredient.parts <= 1) setRecipe(prev => prev.filter(r => getPaintId(r.paint) !== paintId));
                                    else setRecipe(prev => prev.map(r => getPaintId(r.paint) === paintId ? { ...r, parts: r.parts - 1 } : r));
                                  }}
                                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded"
                                >-</button>
                                <div className="text-[10px] font-mono font-bold text-imperial-gold w-10 text-center select-none">
                                  {ingredient.parts} PT
                                </div>
                                <button 
                                  onClick={() => setRecipe(prev => prev.map(r => getPaintId(r.paint) === paintId ? { ...r, parts: r.parts + 1 } : r))}
                                  className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded"
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
                              <div className="text-[9px] font-bold text-white uppercase truncate">{match.name}</div>
                              <div className="text-[8px] text-brass uppercase tracking-widest">{match.brand}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div className={`text-[9px] font-bold tech-text ${Number(match.delta_e) < 2 ? 'text-green-400' : Number(match.delta_e) < 4 ? 'text-amber-400' : 'text-red-400'}`}>
                              ΔE: {match.delta_e}
                            </div>
                            <button
                              onClick={() => addToCart(match)}
                              className="text-[8px] px-1.5 py-0.5 bg-charcoal border border-gray-700 hover:border-brass hover:text-brass text-gray-400 rounded uppercase tracking-widest transition-colors"
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
                      <div className="flex gap-2">
                        <select 
                          value={mixFilterBrand}
                          onChange={(e) => setMixFilterBrand(e.target.value)}
                          className="bg-charcoal border border-gray-700 text-gray-400 text-[10px] rounded px-2 py-1 uppercase tracking-widest outline-none focus:border-brass"
                        >
                          {mixInventoryBrands.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                        <select 
                          value={mixFilterColor}
                          onChange={(e) => setMixFilterColor(e.target.value)}
                          className="bg-charcoal border border-gray-700 text-gray-400 text-[10px] rounded px-2 py-1 uppercase tracking-widest outline-none focus:border-brass"
                        >
                          {mixInventoryColors.map(c => <option key={c} value={c}>{c === 'ALL' ? 'ALL COLORS' : c}</option>)}
                        </select>
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
                              <div className="text-[9px] font-bold text-white uppercase truncate">{paint.name}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
             </motion.div>
          )}

          {activeTab === 'requisition' && (
             <motion.div key="requisition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6 mt-8">
                {/* Same Requisition content as before */}
                {cart.length > 0 && (
                  <div className="border border-brass/30 bg-brass/5 p-3 rounded flex justify-between text-brass text-sm font-mono tech-text backdrop-blur-sm">
                    <span suppressHydrationWarning>MANIFEST #{manifestId}</span>
                    <span>ITEMS: {cart.length}</span>
                  </div>
                )}
                <ShoppingCart />
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MANUAL ADD MODAL */}
      <AddPaintModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
    </div>
  );
}
