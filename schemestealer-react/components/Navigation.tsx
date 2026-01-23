/**
 * Navigation component - W40K themed bottom navigation bar
 * Dynamic theming based on active route (Cogitator/Warp/Neutral)
 * Hides on scroll down, shows on scroll up for better UX
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { useScrollDirection } from '@/hooks/useScrollDirection';

export function Navigation() {
  const pathname = usePathname();
  const cartItems = useAppStore((state) => state.cart);
  const { scrollDirection, isAtTop, isNearBottom } = useScrollDirection();

  const [isHovered, setIsHovered] = React.useState(false);
  const [revealedByTap, setRevealedByTap] = React.useState(false);
  const tapTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path);
  const cartCount = cartItems.length;

  // Enhanced visibility logic
  const isVisible =
    isAtTop || // Always visible at top
    isNearBottom || // Always visible near bottom
    scrollDirection === 'up' || // Show when scrolling up
    scrollDirection === null || // Show when not scrolling
    isHovered || // Show when hovered
    revealedByTap; // Show when tapped

  // Handle tap anywhere on screen to reveal nav
  React.useEffect(() => {
    const handleTap = (e: TouchEvent | MouseEvent) => {
      // Only trigger if nav is currently hidden
      if (!isVisible && !isAtTop && !isNearBottom) {
        setRevealedByTap(true);

        // Clear existing timer
        if (tapTimerRef.current) {
          clearTimeout(tapTimerRef.current);
        }

        // Hide after 5 seconds
        tapTimerRef.current = setTimeout(() => {
          setRevealedByTap(false);
        }, 5000);
      }
    };

    document.addEventListener('touchstart', handleTap);
    document.addEventListener('click', handleTap);

    return () => {
      document.removeEventListener('touchstart', handleTap);
      document.removeEventListener('click', handleTap);
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }
    };
  }, [isVisible, isAtTop, isNearBottom]);

  // Don't show nav on home page - check AFTER all hooks are called
  if (pathname === '/') {
    return null;
  }

  return (
    <>
      <motion.nav
        className="fixed bottom-0 left-0 right-0 bg-dark-gothic shadow-lg z-50 safe-area-bottom"
        style={{
          borderTop: '1px solid var(--brass)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)',
        }}
        animate={{
          y: isVisible ? 0 : '100%',
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="max-w-2xl mx-auto px-2">
          <div className="flex items-center justify-around h-16">
          {/* Home */}
          <NavLink
            href="/"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Home"
            isActive={pathname === '/'}
            theme="neutral"
          />

          {/* Miniscan - Cogitator theme with servo-skull icon */}
          <NavLink
            href="/miniature"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {/* Simplified skull shape */}
                <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                {/* Eye sockets */}
                <circle cx="9" cy="10" r="1.5" fill="currentColor" />
                <circle cx="15" cy="10" r="1.5" fill="currentColor" />
                {/* Jaw */}
                <path d="M8 17h8v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            label="Miniscan"
            isActive={isActive('/miniature')}
            theme="cogitator"
          />

          {/* Inspiration - Warp theme with vortex icon */}
          <NavLink
            href="/inspiration"
            icon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {/* Spiral/vortex shape */}
                <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z" opacity="0.3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 6c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6 2.7-6 6-6z" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
            }
            label="Inspiration"
            isActive={isActive('/inspiration')}
            theme="warp"
          />

          {/* Cart - Brass/neutral theme with crate icon */}
          <NavLink
            href="/cart"
            icon={
              <div className="relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {/* Supply crate shape */}
                  <rect x="3" y="8" width="18" height="13" rx="1" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 13h18M3 17h18" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Handle */}
                  <path d="M8 8V6a4 4 0 0 1 8 0v2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
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
      </motion.nav>

      {/* Visual indicator when nav is hidden - tap to reveal hint */}
      {!isVisible && !isAtTop && (
        <motion.div
          className="fixed bottom-2 left-1/2 z-40 pointer-events-none"
          style={{
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-800/90 border border-gray-600/50"
            animate={{
              boxShadow: [
                '0 0 10px rgba(156, 163, 175, 0.3)',
                '0 0 20px rgba(156, 163, 175, 0.5)',
                '0 0 10px rgba(156, 163, 175, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-gray-400"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
            <span className="text-xs text-gray-400 font-medium">Tap to show menu</span>
          </motion.div>
        </motion.div>
      )}
    </>
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
