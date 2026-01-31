/**
 * ShoppingCart component - displays cart items with quantity controls
 */

'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { getPaintId, getTotalCartItems, calculatePaintCost, formatCurrency, PAINT_PRICES } from '@/lib/utils';

export function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useAppStore();

  const totalItems = getTotalCartItems(cart);

  if (cart.length === 0) {
    return (
      <div className="text-center py-12 textured">
        <div className="flex justify-center mb-4">
          {/* Munitorum crate icon */}
          <svg width="96" height="96" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="16" width="48" height="40" rx="2" fill="#2a2010" stroke="#8B7355" strokeWidth="2" />
            <line x1="8" y1="28" x2="56" y2="28" stroke="#8B7355" strokeWidth="1" />
            <line x1="8" y1="40" x2="56" y2="40" stroke="#8B7355" strokeWidth="1" />
            <circle cx="32" cy="36" r="8" fill="#1a1508" stroke="#8B7355" strokeWidth="1" />
            <text x="32" y="40" textAnchor="middle" fill="#8B7355" fontSize="10">☠</text>
            <circle cx="12" cy="20" r="2" fill="#8B7355" />
            <circle cx="52" cy="20" r="2" fill="#8B7355" />
            <circle cx="12" cy="52" r="2" fill="#8B7355" />
            <circle cx="52" cy="52" r="2" fill="#8B7355" />
            <path d="M24 12 L24 16 M40 12 L40 16" stroke="#8B7355" strokeWidth="2" />
            <path d="M24 12 Q32 8 40 12" stroke="#8B7355" strokeWidth="2" fill="none" />
          </svg>
        </div>
        <h3 className="responsive-section-title font-semibold text-amber-500 mb-2 gothic-text text-shadow">
          SUPPLY REQUISITION EMPTY
        </h3>
        <p className="text-gray-500 tech-text responsive-label">
          No items awaiting requisition
        </p>
        <p className="text-gray-500 mt-2 responsive-label">
          Scan a miniature or channel the warp to add paints
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
      <div className="mt-6 p-4 border-2 border-dashed border-amber-900/30 rounded text-center">
        <div className="text-amber-500/40 responsive-label tracking-wider mb-2">
          ADMINISTRATUM USE ONLY
        </div>
        <div className="text-amber-600 font-bold tracking-[0.2em] responsive-section-title">
          PENDING REQUISITION
        </div>
        <div className="text-amber-500/50 responsive-label mt-2">
          {totalItems} ITEM{totalItems !== 1 ? 'S' : ''} TOTAL
        </div>
      </div>

      {/* Clear all button */}
      {cart.length > 0 && (
        <button
          onClick={clearCart}
          className="w-full py-3 px-4 border border-red-500/30 bg-red-950/20 rounded responsive-label text-red-500/80 hover:bg-red-950/40 hover:border-red-500/50 transition-colors"
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
    <div className="flex items-center gap-3 p-3 border border-amber-900/20 bg-black/30 rounded">
      {/* Manifest number */}
      <div className="text-amber-500/50 font-mono responsive-label">
        [{String(index + 1).padStart(2, '0')}]
      </div>

      {/* Color swatch */}
      <div
        className="w-8 h-8 rounded border border-amber-900/30 flex-shrink-0"
        style={{ backgroundColor: item.paint.hex }}
      />

      {/* Paint info */}
      <div className="flex-1 min-w-0">
        <div className="text-amber-100 font-semibold responsive-label truncate">
          {item.paint.name}
        </div>
        <div className="text-amber-500/60 responsive-label">
          {item.paint.brand} {item.addedFrom && `• ${modeIcons[item.addedFrom]}`}
        </div>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          className="w-7 h-7 rounded bg-amber-900/20 hover:bg-amber-900/40 active:bg-amber-900/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors border border-amber-900/30"
        >
          <span className="text-amber-500 font-semibold">−</span>
        </button>

        <span className="w-6 text-center font-semibold text-amber-500 responsive-label">
          {item.quantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-7 h-7 rounded bg-amber-900/20 hover:bg-amber-900/40 active:bg-amber-900/60 flex items-center justify-center transition-colors border border-amber-900/30"
        >
          <span className="text-amber-500 font-semibold">+</span>
        </button>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="flex-shrink-0 text-red-500/70 hover:text-red-500 p-2"
        aria-label="Remove item"
      >
        ✕
      </button>
    </div>
  );
}

/**
 * Cost Summary - shows estimated paint costs by brand
 */
interface CostSummaryProps {
  cart: Array<{
    paint: { name: string; brand: string; hex: string };
    quantity: number;
  }>;
  totalItems: number;
}

function CostSummary({ cart, totalItems }: CostSummaryProps) {
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
    <div className="mt-4 p-4 border border-amber-900/30 bg-amber-950/10 rounded-lg">
      <h4 className="text-sm font-bold text-amber-500 gothic-text text-center mb-3">
        ◆ ESTIMATED COSTS ◆
      </h4>

      {/* Brand breakdown */}
      <div className="space-y-2 mb-4">
        {Object.entries(brandTotals).map(([brand, data]) => (
          <div key={brand} className="flex justify-between text-sm">
            <span className="text-amber-400/80">
              {brand} <span className="text-amber-500/50">×{data.count}</span>
            </span>
            <span className="text-amber-300 font-mono">
              {formatCurrency(data.cost)}
            </span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-amber-900/30 mb-3" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-amber-500 font-semibold">
          ESTIMATED TOTAL
        </span>
        <span className="text-amber-300 font-bold text-lg font-mono">
          {formatCurrency(totalCost)}
        </span>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-amber-500/50 mt-3 text-center tech-text">
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
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
      {totalItems > 9 ? '9+' : totalItems}
    </span>
  );
}
