/**
 * Shopping cart page - Supply Requisition
 * With affiliate links, brand/region preferences
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart } from '@/components/ShoppingCart';
import { BrandSelector, type PaintBrand } from '@/components/BrandSelector';
import { RegionSelector, type Region } from '@/components/RegionSelector';
import { useAppStore } from '@/lib/store';

// Affiliate link generators (placeholder URLs)
const AFFILIATE_MERCHANTS: Record<Region, { name: string; searchUrl: (query: string) => string }[]> = {
  uk: [
    { name: 'Element Games', searchUrl: (q) => `https://elementgames.co.uk/search?q=${encodeURIComponent(q)}` },
    { name: 'Wayland Games', searchUrl: (q) => `https://waylandgames.co.uk/search?q=${encodeURIComponent(q)}` },
    { name: 'Triple Helix', searchUrl: (q) => `https://triplehelixwargames.com/search?q=${encodeURIComponent(q)}` },
  ],
  us: [
    { name: 'Miniature Market', searchUrl: (q) => `https://miniaturemarket.com/search?q=${encodeURIComponent(q)}` },
    { name: 'Games Workshop US', searchUrl: (q) => `https://warhammer.com/search?q=${encodeURIComponent(q)}` },
  ],
  eu: [
    { name: 'Games Workshop EU', searchUrl: (q) => `https://warhammer.com/search?q=${encodeURIComponent(q)}` },
  ],
  au: [
    { name: 'Games Workshop AU', searchUrl: (q) => `https://warhammer.com/search?q=${encodeURIComponent(q)}` },
  ],
  global: [
    { name: 'Amazon', searchUrl: (q) => `https://amazon.com/s?k=${encodeURIComponent(q)}` },
    { name: 'eBay', searchUrl: (q) => `https://ebay.com/sch/i.html?_nkw=${encodeURIComponent(q)}` },
  ],
};

export default function CartPage() {
  const cart = useAppStore((state) => state.cart);
  const [selectedBrand, setSelectedBrand] = useState<PaintBrand>('all');
  const [selectedRegion, setSelectedRegion] = useState<Region>('global');

  // Filter paints by selected brand
  const filteredCart = selectedBrand === 'all'
    ? cart
    : cart.filter(item => item.paint.brand.toLowerCase().includes(selectedBrand.replace('_', ' ')));

  const merchants = AFFILIATE_MERCHANTS[selectedRegion] || AFFILIATE_MERCHANTS.global;

  return (
    <div
      className="min-h-screen pb-24 pt-8 px-4"
      style={{
        background: `
          radial-gradient(circle at 20px 20px, #2a2a2a 2px, transparent 2px),
          radial-gradient(circle at 60px 20px, #2a2a2a 2px, transparent 2px),
          radial-gradient(circle at 20px 60px, #2a2a2a 2px, transparent 2px),
          radial-gradient(circle at 60px 60px, #2a2a2a 2px, transparent 2px),
          linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)
        `,
        backgroundSize: '80px 80px, 80px 80px, 80px 80px, 80px 80px, 100% 100%',
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header - Military Munitorum Style */}
        <motion.div
          className="text-center border-b border-amber-900/30 pb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="8" width="18" height="13" rx="1" />
              <path d="M3 13h18M3 17h18M8 8V6a4 4 0 0 1 8 0v2" />
            </svg>
            <h1 className="responsive-header font-bold gothic-text text-amber-500">
              SUPPLY REQUISITION
            </h1>
            <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="8" width="18" height="13" rx="1" />
              <path d="M3 13h18M3 17h18M8 8V6a4 4 0 0 1 8 0v2" />
            </svg>
          </div>
          <p className="text-amber-500/60 tech-text responsive-label">
            Departmento Munitorum - Paint Division
          </p>
        </motion.div>

        {/* Manifest header - only show if cart has items */}
        {cart.length > 0 && (
          <motion.div
            className="border border-amber-900/30 bg-amber-950/20 p-3 rounded"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex justify-between text-amber-500/80 text-sm font-mono">
              <span>MANIFEST #{Date.now().toString().slice(-6)}</span>
              <span>ITEMS: {cart.length}</span>
            </div>
            <div className="text-amber-500/50 text-xs mt-1">
              STATUS: AWAITING APPROVAL
            </div>
          </motion.div>
        )}

        {/* Main Cart Display */}
        <ShoppingCart />

        {/* Preferences & Affiliate Links - Only show if cart has items */}
        {cart.length > 0 && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Preferences Section */}
            <div className="warp-border rounded-lg p-1">
              <div className="bg-dark-gothic rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 text-brass gothic-text text-center">
                  ◆ ACQUISITION PREFERENCES ◆
                </h3>

                <div className="flex flex-wrap gap-3 justify-center">
                  <BrandSelector
                    value={selectedBrand}
                    onChange={setSelectedBrand}
                    compact
                  />
                  <RegionSelector
                    value={selectedRegion}
                    onChange={setSelectedRegion}
                    compact
                  />
                </div>

                <motion.p
                  className="text-center text-xs text-brass/60 mt-3 tech-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Filter paints by forge • Select supply realm for merchants
                </motion.p>
              </div>
            </div>

            {/* Affiliate Links Section */}
            <div className="warp-border rounded-lg p-1">
              <div className="bg-dark-gothic rounded-lg p-4">
                <h3 className="text-lg font-bold mb-4 text-brass gothic-text text-center">
                  🛒 APPROVED MERCHANTS 🛒
                </h3>

                <p className="text-xs text-brass/70 text-center mb-4 tech-text">
                  Acquire your paints from these vetted supply depots ({selectedRegion.toUpperCase()})
                </p>

                <div className="space-y-2">
                  {merchants.map((merchant, index) => (
                    <motion.div
                      key={merchant.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <a
                        href={merchant.searchUrl('miniature paints')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <motion.div
                          className="flex items-center justify-between p-3 rounded-lg border-2 border-brass bg-charcoal touch-target"
                          whileHover={{
                            scale: 1.02,
                            boxShadow: '0 0 20px var(--brass)',
                            backgroundColor: 'var(--brass-dark)',
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">🏪</span>
                            <div>
                              <div className="text-sm font-bold text-brass cyber-text">
                                {merchant.name}
                              </div>
                              <div className="text-xs text-brass/60 tech-text">
                                Search for paints
                              </div>
                            </div>
                          </div>
                          <span className="text-brass text-xl">→</span>
                        </motion.div>
                      </a>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="mt-4 p-3 rounded-lg"
                  style={{ backgroundColor: 'var(--parchment)' }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-xs text-void-black/80 tech-text">
                    <strong className="gothic-text">⚠ DATABANK NOTE:</strong> These are general merchant search links.
                    Copy paint names from your cart and paste into merchant search for specific products.
                    Affiliate links coming in future updates.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Empty Cart Actions */}
        {cart.length === 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/miniature">
              <motion.button
                className="w-full py-4 px-6 rounded-lg border-2 border-cogitator-green bg-dark-gothic touch-target"
                whileHover={{
                  boxShadow: '0 0 20px var(--cogitator-green-glow)',
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">💀</span>
                  <span className="auspex-text font-bold cyber-text">
                    INITIATE MINISCAN
                  </span>
                </div>
              </motion.button>
            </Link>

            <Link href="/inspiration">
              <motion.button
                className="w-full py-4 px-6 rounded-lg relative overflow-hidden touch-target warp-border"
                style={{
                  background: 'linear-gradient(135deg, var(--warp-purple-dark), var(--warp-pink))',
                }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: '0 0 30px var(--ethereal-glow)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">✧</span>
                  <span className="warp-text font-bold cyber-text text-base">
                    CHANNEL THE WARP
                  </span>
                </div>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
