/**
 * Navigation component - bottom navigation bar for mobile
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { CartBadge } from './ShoppingCart';
import { useAppStore } from '@/lib/store';

export function Navigation() {
  const pathname = usePathname();
  const cart = useAppStore((state) => state.cart);

  // Don't show nav on home page
  if (pathname === '/') {
    return null;
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {/* Home */}
          <NavLink
            href="/"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            }
            label="Home"
            isActive={pathname === '/'}
          />

          {/* Miniscan */}
          <NavLink
            href="/miniature"
            icon={
              <span className="text-2xl">🎨</span>
            }
            label="Miniscan"
            isActive={isActive('/miniature')}
          />

          {/* Inspiration */}
          <NavLink
            href="/inspiration"
            icon={
              <span className="text-2xl">✨</span>
            }
            label="Inspiration"
            isActive={isActive('/inspiration')}
          />

          {/* Cart */}
          <NavLink
            href="/cart"
            icon={
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <CartBadge />
              </div>
            }
            label="Cart"
            isActive={isActive('/cart')}
          />
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavLink({ href, icon, label, isActive }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg transition-colors min-w-[64px]',
        isActive
          ? 'text-blue-600 bg-blue-50'
          : 'text-gray-600 hover:text-gray-900 active:bg-gray-100'
      )}
    >
      <div className="flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
}
