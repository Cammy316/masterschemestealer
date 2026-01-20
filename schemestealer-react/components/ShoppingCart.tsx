/**
 * ShoppingCart component - displays cart items with quantity controls
 */

'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import { Button } from './ui/Button';
import { getPaintId, getTotalCartItems } from '@/lib/utils';

export function ShoppingCart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useAppStore();

  const totalItems = getTotalCartItems(cart);

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Your cart is empty
        </h3>
        <p className="text-gray-600">
          Scan a miniature or find inspiration to add paints to your cart
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <p className="text-sm text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {cart.map((item) => (
          <CartItem
            key={getPaintId(item.paint)}
            item={item}
            onRemove={() => removeFromCart(getPaintId(item.paint))}
            onUpdateQuantity={(qty) => updateQuantity(getPaintId(item.paint), qty)}
          />
        ))}
      </div>

      {/* Summary */}
      <Card variant="elevated" padding="lg" className="bg-blue-50">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Paints:</span>
            <span className="text-xl font-bold text-blue-600">{totalItems}</span>
          </div>

          <div className="pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600 mb-3">
              Note: This is a shopping list. Prices and purchasing options coming soon!
            </p>
            <Button variant="primary" size="lg" fullWidth disabled>
              Export List (Coming Soon)
            </Button>
          </div>
        </div>
      </Card>
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
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {
  const handleIncrement = () => {
    onUpdateQuantity(item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const modeIcons = {
    miniature: '🎨',
    inspiration: '✨',
  };

  return (
    <Card variant="outlined" padding="none">
      <div className="flex items-center p-4 space-x-4">
        {/* Color swatch */}
        <div
          className="w-12 h-12 rounded-lg shadow-sm border border-gray-200 flex-shrink-0"
          style={{ backgroundColor: item.paint.hex }}
        />

        {/* Paint info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 truncate">
            {item.paint.name}
          </h4>
          <p className="text-sm text-gray-600">{item.paint.brand}</p>
          {item.addedFrom && (
            <p className="text-xs text-gray-500 mt-1">
              {modeIcons[item.addedFrom]} From {item.addedFrom === 'miniature' ? 'Miniscan' : 'Inspiration'}
            </p>
          )}
        </div>

        {/* Quantity controls */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={handleDecrement}
            disabled={item.quantity <= 1}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <span className="text-lg font-semibold">−</span>
          </button>

          <span className="w-8 text-center font-semibold text-gray-900">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrement}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors"
          >
            <span className="text-lg font-semibold">+</span>
          </button>
        </div>

        {/* Remove button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 text-red-600 hover:text-red-700 active:text-red-800 p-2"
          aria-label="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </Card>
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
