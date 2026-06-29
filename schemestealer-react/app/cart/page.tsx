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
import { SlabButton } from '@/components/shared/SlabButton';
import { SurfaceCard } from '@/components/shared/SurfaceCard';
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
  const preferredBrands = useAppStore((state) => state.preferredBrands);
  const setPreferredBrands = useAppStore((state) => state.setPreferredBrands);
  const preferredRegion = useAppStore((state) => state.preferredRegion) as Region;
  const setPreferredRegion = useAppStore((state) => state.setPreferredRegion);
  // Decorative manifest number — generated once on mount (kept out of render so
  // it doesn't change every render; the span suppresses hydration diffing).
  const [manifestId] = useState(() => Date.now().toString().slice(-6));

  const merchants = AFFILIATE_MERCHANTS[preferredRegion] || AFFILIATE_MERCHANTS.global;

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
            <svg className="w-8 h-8 text-amber-500/80 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="8" width="18" height="13" rx="1" />
              <path d="M3 13h18M3 17h18M8 8V6a4 4 0 0 1 8 0v2" />
            </svg>
            <h1 
              className="responsive-header font-bold gothic-text text-[clamp(1.5rem,6vw,3rem)] text-balance"
              style={{
                background: 'linear-gradient(to bottom, var(--imperial-gold) 0%, var(--brass) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.9))',
                letterSpacing: '0.1em'
              }}
            >
              SUPPLY REQUISITION
            </h1>
            <svg className="w-8 h-8 text-amber-500/80 drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="8" width="18" height="13" rx="1" />
              <path d="M3 13h18M3 17h18M8 8V6a4 4 0 0 1 8 0v2" />
            </svg>
          </div>
          <p className="text-brass/70 tech-text responsive-label">
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
              <span suppressHydrationWarning>MANIFEST #{manifestId}</span>
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
            <SurfaceCard theme="cogitator" className="p-4">
                <h3 className="text-lg font-bold mb-4 text-brass gothic-text text-center">
                  ◆ ACQUISITION PREFERENCES ◆
                </h3>

                <div className="flex flex-wrap gap-3 justify-center">
                  <BrandSelector
                    value={preferredBrands.includes('all') ? 'all' : preferredBrands[0] as PaintBrand}
                    onChange={(val) => setPreferredBrands([val])}
                    compact
                  />
                  <RegionSelector
                    value={preferredRegion}
                    onChange={setPreferredRegion}
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
            </SurfaceCard>

            {/* Affiliate Links Section */}
            <SurfaceCard theme="cogitator" className="p-4">
                <h3 className="text-lg font-bold mb-4 text-brass gothic-text text-center">
                  🛒 APPROVED MERCHANTS 🛒
                </h3>

                <p className="text-xs text-brass/70 text-center mb-4 tech-text">
                  Acquire your paints from these vetted supply depots ({preferredRegion.toUpperCase()})
                </p>
                
                {/* ASA Affiliate Disclosure */}
                <div className="mb-4 p-2 border border-brass/30 bg-brass/5 rounded text-center">
                  <p className="text-[10px] text-brass/60 uppercase">
                    Commissions may be earned from links on this page.
                  </p>
                </div>

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
            </SurfaceCard>
          </motion.div>
        )}

        {/* Empty Cart Actions */}
        {cart.length === 0 && (
          <motion.div
            className="space-y-6 flex flex-col items-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Empty Cart Graphic */}
            <div className="w-full max-w-md mx-auto bg-void-black/80 border-2 border-dashed border-brass/30 rounded-xl p-8 text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,134,11,0.05)_0%,transparent_70%)] pointer-events-none" />
              <motion.div 
                className="w-24 h-24 mx-auto mb-6 text-brass/40"
                animate={{ rotate: [0, 3, -3, 0], opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="drop-shadow-[0_0_15px_rgba(184,134,11,0.3)]">
                  <path d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 4L4 9M15 4l5 5M9 20l-5-5M15 20l5-5M12 4v16M4 12h16" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <h2 className="gothic-text text-xl font-bold text-brass/70 mb-2 tracking-wider drop-shadow-sm">REQUISITION EMPTY</h2>
              <p className="tech-text text-sm text-brass/50">Initiate a scan or channel the warp to discover sacred paints.</p>
            </div>

            <div className="w-full space-y-3">
              <Link href="/miniature">
              <SlabButton theme="cogitator">
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">💀</span>
                  <span className="cyber-text">INITIATE MINISCAN</span>
                </span>
              </SlabButton>
            </Link>

            <Link href="/inspiration">
              <SlabButton theme="warp">
                <span className="flex items-center justify-center gap-3">
                  <span className="text-2xl">✧</span>
                  <span className="cyber-text text-base">CHANNEL THE WARP</span>
                </span>
              </SlabButton>
            </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
