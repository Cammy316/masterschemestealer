/**
 * ShoppingCart component - displays cart items with quantity controls
 * Upgraded to Dataslate styling (Void-Black/Brass)
 */

'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { getPaintId, getTotalCartItems, formatCurrency, PAINT_PRICES } from '@/lib/utils';

export function ShoppingCart({ manifestId }: { manifestId?: string }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useAppStore();

  const totalItems = getTotalCartItems(cart);

  if (cart.length === 0) {
    return (
      <div className="relative w-full bg-[#050505] border-[6px] border-charcoal/90 outline outline-1 outline-brass/40 rounded-sm overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] mt-8 ring-1 ring-inset ring-brass/20 text-center py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.15)_0%,transparent_70%)] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="flex justify-center mb-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-70 drop-shadow-[0_0_8px_rgba(184,134,11,0.5)]">
              <rect x="8" y="16" width="48" height="40" rx="2" fill="var(--charcoal)" stroke="var(--brass)" strokeWidth="2" />
              <line x1="8" y1="28" x2="56" y2="28" stroke="var(--brass)" strokeWidth="1" />
              <line x1="8" y1="40" x2="56" y2="40" stroke="var(--brass)" strokeWidth="1" />
              <circle cx="32" cy="36" r="8" fill="var(--void-black)" stroke="var(--brass)" strokeWidth="1" />
              <text x="32" y="40" textAnchor="middle" fill="var(--brass)" fontSize="10">☠</text>
              <circle cx="12" cy="20" r="2" fill="var(--brass)" />
              <circle cx="52" cy="20" r="2" fill="var(--brass)" />
              <circle cx="12" cy="52" r="2" fill="var(--brass)" />
              <circle cx="52" cy="52" r="2" fill="var(--brass)" />
              <path d="M24 12 L24 16 M40 12 L40 16" stroke="var(--brass)" strokeWidth="2" />
              <path d="M24 12 Q32 8 40 12" stroke="var(--brass)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-imperial-gold mb-3 gothic-text tracking-widest drop-shadow-[0_0_8px_rgba(184,134,11,0.6)]">
            REQUISITION EMPTY
          </h3>
          <p className="text-gray-400 tech-text text-sm uppercase tracking-widest">
            No items awaiting requisition.
          </p>
          <p className="text-gray-500 mt-2 text-xs uppercase tracking-widest">
            Scan a miniature to discover paints.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Item list styled as military manifest inside a Brass Viewport */}
      <div className="relative w-full bg-[#050505] border-[6px] border-charcoal/90 outline outline-1 outline-brass/40 rounded-sm overflow-hidden shadow-[inset_0_0_80px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-brass/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,134,11,0.15)_0%,transparent_70%)] pointer-events-none mix-blend-screen" />
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
        
        <div className="relative z-10 p-4">
          {manifestId && (
            <div className="border border-brass/30 bg-brass/5 p-3 rounded-sm flex justify-between text-brass text-sm font-mono tech-text backdrop-blur-sm mb-4">
              <span suppressHydrationWarning>MANIFEST #{manifestId}</span>
              <span>ITEMS: {cart.length}</span>
            </div>
          )}

          <div className="space-y-3">
            {cart.map((item, index) => (
              <CartItem
                key={getPaintId(item.paint)}
                item={item}
                index={index}
                onRemove={() => removeFromCart(getPaintId(item.paint))}
                onUpdateQuantity={(qty) => updateQuantity(getPaintId(item.paint), qty)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Cost Summary in Viewport */}
      <div className="relative w-full bg-[#050505] border-4 border-charcoal/90 outline outline-1 outline-brass/40 rounded-sm overflow-hidden shadow-[inset_0_0_40px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-brass/20">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
        <div className="relative z-10 p-5">
          <CostSummary cart={cart} totalItems={totalItems} />
        </div>
      </div>

      {/* Approval stamp area */}
      <div className="p-4 border border-dashed border-gray-700 bg-[#050505] rounded-sm text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }} />
        <div className="relative z-10">
          <div className="text-gray-500 tech-text text-[10px] uppercase tracking-wider mb-2">
            ADMINISTRATUM USE ONLY
          </div>
          <div className="text-imperial-gold font-bold tracking-[0.2em] text-lg gothic-text">
            PENDING REQUISITION
          </div>
          <div className="text-gray-400 text-xs tech-text mt-2 uppercase tracking-widest">
            {totalItems} ITEM{totalItems !== 1 ? 'S' : ''} TOTAL
          </div>
        </div>
      </div>

      {/* Clear all button */}
      {cart.length > 0 && (
        <button
          onClick={clearCart}
          className="w-full mt-4 py-4 px-4 border-2 border-red-900 bg-red-950/40 rounded-sm text-sm font-bold uppercase tracking-widest text-red-500 hover:bg-red-900 hover:text-white hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all shadow-inner relative overflow-hidden group"
        >
          <div className="absolute inset-0 opacity-20 group-hover:opacity-10 transition-opacity" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
          <span className="relative z-10 flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
            CLEAR CART
          </span>
        </button>
      )}
    </div>
  );
}

interface CartItemProps {
  item: {
    paint: {
      name: string;
      brand: string;
      hex: string;
    };
    quantity: number;
    addedFrom?: 'miniature' | 'inspiration';
  };
  index: number;
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function CartItem({ item, index, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const modeIcons = {
    miniature: '◆',
    inspiration: '✦',
  };

  return (
    <div className="flex items-center gap-3 p-3 border border-gray-800 bg-charcoal/60 rounded hover:bg-charcoal transition-colors">
      {/* Manifest number */}
      <div className="text-gray-600 font-mono text-[10px]">
        [{String(index + 1).padStart(2, '0')}]
      </div>

      {/* Color swatch */}
      <div
        className="w-10 h-10 rounded border border-gray-700 flex-shrink-0 shadow-inner"
        style={{ backgroundColor: item.paint.hex }}
      />

      {/* Paint info */}
      <div className="flex-1 min-w-0 ml-2">
        <div className="text-white font-bold text-sm sm:text-base truncate">
          {item.paint.name}
        </div>
        <div className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
          {item.paint.brand} {item.addedFrom && `• ${modeIcons[item.addedFrom]}`}
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          className="w-8 h-8 rounded-sm bg-black/80 hover:bg-charcoal active:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-all border-y-2 border-x border-b-gray-900 border-t-gray-600 border-x-gray-800 shadow-inner"
        >
          <span className="text-imperial-gold font-bold drop-shadow-[0_0_2px_rgba(184,134,11,0.5)]">−</span>
        </button>

        <span className="w-6 text-center font-bold text-imperial-gold text-sm font-mono drop-shadow-[0_0_4px_rgba(184,134,11,0.5)]">
          {item.quantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded-sm bg-black/80 hover:bg-charcoal active:bg-gray-800 flex items-center justify-center transition-all border-y-2 border-x border-b-gray-900 border-t-gray-600 border-x-gray-800 shadow-inner"
        >
          <span className="text-imperial-gold font-bold drop-shadow-[0_0_2px_rgba(184,134,11,0.5)]">+</span>
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-sm bg-red-950/20 text-red-900 hover:bg-red-950/60 hover:text-red-500 border border-transparent hover:border-red-900/50 transition-all ml-1"
        aria-label="Remove item"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
  );
}

interface CostSummaryProps {
  cart: Array<{
    paint: { name: string; brand: string; hex: string };
    quantity: number;
  }>;
  totalItems: number;
}

function CostSummary({ cart }: CostSummaryProps) {
  // Group by brand and calculate costs
  const brandTotals = cart.reduce((acc, item) => {
    const brand = item.paint.brand;
    if (!acc[brand]) {
      acc[brand] = { count: 0, cost: 0 };
    }
    const price = PAINT_PRICES[brand] || 4.00;
    acc[brand].count += item.quantity;
    acc[brand].cost += price * item.quantity;
    return acc;
  }, {} as Record<string, { count: number; cost: number }>);

  const totalCost = Object.values(brandTotals).reduce((sum, b) => sum + b.cost, 0);

  return (
    <div className="mt-6 p-5 border border-gray-800 bg-charcoal/40 rounded-lg">
      <h4 className="text-sm font-bold text-brass gothic-text text-center mb-4 tracking-widest">
        ESTIMATED COSTS
      </h4>

      {/* Brand breakdown */}
      <div className="space-y-3 mb-4">
        {Object.entries(brandTotals).map(([brand, data]) => (
          <div key={brand} className="flex justify-between text-sm items-center">
            <span className="text-gray-300 font-bold">
              {brand} <span className="text-gray-500 font-normal ml-1">×{data.count}</span>
            </span>
            <span className="text-imperial-gold font-mono tracking-wider">
              {formatCurrency(data.cost)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-4" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-brass font-bold tracking-widest uppercase text-sm">
          Estimated Total
        </span>
        <span className="text-imperial-gold font-bold text-xl font-mono tracking-wider">
          {formatCurrency(totalCost)}
        </span>
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-gray-500 mt-4 text-center tech-text uppercase tracking-widest">
        Based on average retail prices. Actual costs may vary by retailer.
      </p>
    </div>
  );
}

export function CartBadge() {
  const cart = useAppStore((state) => state.cart);
  const totalItems = getTotalCartItems(cart);

  if (totalItems === 0) return null;

  return (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
      {totalItems > 9 ? '9+' : totalItems}
    </span>
  );
}
