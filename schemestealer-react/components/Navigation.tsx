/**
 * Navigation component - W40K themed bottom navigation bar
 * Dynamic theming based on active route (Cogitator/Warp/Neutral)
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export function Navigation() {
  const pathname = usePathname();
  const cartItems = useAppStore((state) => state.cart);

  // Don't show nav on home page
  if (pathname === '/') {
    return null;
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);
  const cartCount = cartItems.length;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-dark-gothic shadow-lg z-50 safe-area-bottom"
      style={{
        borderTop: '1px solid var(--brass)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
      }}
    >
      <div className="max-w-2xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {/* Home */}
          <NavLink
            href="/"
            icon="🏠"
            label="Home"
            isActive={pathname === '/'}
            theme="neutral"
          />

          {/* Miniscan - Cogitator theme */}
          <NavLink
            href="/miniature"
            icon="💀"
            label="Miniscan"
            isActive={isActive('/miniature')}
            theme="cogitator"
          />

          {/* Inspiration - Warp theme */}
          <NavLink
            href="/inspiration"
            icon="✧"
            label="Inspiration"
            isActive={isActive('/inspiration')}
            theme="warp"
          />

          {/* Cart - Brass/neutral theme */}
          <NavLink
            href="/cart"
            icon={
              <div className="relative">
                <span className="text-2xl">🛒</span>
                {cartCount > 0 && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: 'var(--imperial-gold)',
                      color: 'var(--void-black)',
                      boxShadow: '0 0 10px var(--imperial-gold)',
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.div>
                )}
              </div>
            }
            label="Cart"
            isActive={isActive('/cart')}
            theme="brass"
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
  theme: 'cogitator' | 'warp' | 'brass' | 'neutral';
}

function NavLink({ href, icon, label, isActive, theme }: NavLinkProps) {
  // Theme colors
  const themeColors = {
    cogitator: {
      active: 'var(--cogitator-green)',
      glow: 'var(--cogitator-green-glow)',
      bg: 'var(--cogitator-green-dark)',
    },
    warp: {
      active: 'var(--warp-purple-light)',
      glow: 'var(--ethereal-glow)',
      bg: 'var(--warp-purple-dark)',
    },
    brass: {
      active: 'var(--brass)',
      glow: 'rgba(184, 134, 11, 0.3)',
      bg: 'var(--brass-dark)',
    },
    neutral: {
      active: 'var(--text-secondary)',
      glow: 'rgba(156, 163, 175, 0.2)',
      bg: 'var(--charcoal)',
    },
  };

  const colors = themeColors[theme];

  return (
    <Link href={href} className="relative touch-target">
      <motion.div
        className="flex flex-col items-center justify-center px-3 py-2 rounded-lg relative"
        whileTap={{ scale: 0.9 }}
        animate={{
          backgroundColor: isActive ? colors.bg : 'transparent',
        }}
        transition={{ duration: 0.2 }}
      >
        {/* Active glow effect */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-lg"
            style={{
              boxShadow: `0 0 15px ${colors.glow}, inset 0 0 10px ${colors.glow}`,
            }}
            animate={{
              boxShadow: [
                `0 0 10px ${colors.glow}`,
                `0 0 20px ${colors.glow}`,
                `0 0 10px ${colors.glow}`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}

        {/* Icon */}
        <motion.div
          className="flex items-center justify-center text-2xl relative z-10"
          animate={{
            color: isActive ? colors.active : 'var(--text-secondary)',
            scale: isActive ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {icon}
        </motion.div>

        {/* Label */}
        <motion.span
          className="text-xs font-medium relative z-10 tech-text mt-1"
          animate={{
            color: isActive ? colors.active : 'var(--text-tertiary)',
            fontWeight: isActive ? 600 : 500,
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.span>

        {/* Active indicator line */}
        {isActive && (
          <motion.div
            className="absolute top-0 left-1/2 w-8 h-0.5 rounded-full"
            style={{
              backgroundColor: colors.active,
              boxShadow: `0 0 10px ${colors.glow}`,
            }}
            initial={{ scaleX: 0, x: '-50%' }}
            animate={{ scaleX: 1, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        )}
      </motion.div>
    </Link>
  );
}
