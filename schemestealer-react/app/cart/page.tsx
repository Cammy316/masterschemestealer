/**
 * Shopping cart page
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart } from '@/components/ShoppingCart';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/lib/store';

export default function CartPage() {
  const cart = useAppStore((state) => state.cart);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ShoppingCart />

      {cart.length === 0 && (
        <div className="mt-8 space-y-4">
          <Link href="/miniature">
            <Button variant="primary" size="lg" fullWidth>
              🎨 Scan a Miniature
            </Button>
          </Link>

          <Link href="/inspiration">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800"
            >
              ✨ Find Inspiration
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
