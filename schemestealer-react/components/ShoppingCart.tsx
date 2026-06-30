/**
 * ShoppingCart component - displays cart items with quantity controls
 * Upgraded to Dataslate styling (Void-Black/Brass)
 */

'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { getPaintId, getTotalCartItems, formatCurrency, PAINT_PRICES } from '@/lib/utils';

export function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useAppStore();

  const totalItems = getTotalCartItems(cart);

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-800 bg-charcoal/20 rounded-lg mt-8">
        <div className="flex justify-center mb-6">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="opacity-50">
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
        <h3 className="text-xl font-bold text-brass mb-3 gothic-text tracking-widest text-shadow">
          REQUISITION EMPTY
        </h3>
        <p className="text-gray-400 tech-text text-sm">
          No items awaiting requisition.
        </p>
        <p className="text-gray-500 mt-2 text-xs uppercase tracking-widest">
          Scan a miniature to discover paints.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Item list styled as military manifest */}
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

      {/* Cost Summary */}
      <CostSummary cart={cart} totalItems={totalItems} />

      {/* Approval stamp area */}
      <div className="mt-8 p-4 border border-dashed border-gray-700 bg-charcoal/20 rounded text-center">
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

      {/* Clear all button */}
      {cart.length > 0 && (
        <button
          onClick={clearCart}
          className="w-full mt-4 py-4 px-4 border border-red-900/30 bg-red-950/20 rounded text-xs tech-text uppercase tracking-widest text-red-500 hover:bg-red-950/40 hover:border-red-500/50 transition-colors"
        >
          ✕ CLEAR REQUISITION
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
          className="w-8 h-8 rounded bg-void-black hover:bg-gray-800 active:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors border border-gray-700"
        >
          <span className="text-brass font-bold">−</span>
        </button>

        <span className="w-6 text-center font-bold text-white text-sm">
          {item.quantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded bg-void-black hover:bg-gray-800 active:bg-gray-700 flex items-center justify-center transition-colors border border-gray-700"
        >
          <span className="text-brass font-bold">+</span>
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-red-900 hover:text-red-500 px-3 py-2 transition-colors"
        aria-label="Remove item"
      >
        ✕
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
