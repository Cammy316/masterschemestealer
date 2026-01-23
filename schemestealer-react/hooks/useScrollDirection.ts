/**
 * useScrollDirection hook
 * Detects scroll direction and position to hide/show navigation
 */

'use client';

import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if near bottom (within 100px)
      const distanceFromBottom = documentHeight - (scrollY + windowHeight);
      setIsNearBottom(distanceFromBottom < 100);

      // Always show nav when at top of page
      if (scrollY < 10) {
        setIsAtTop(true);
        setScrollDirection(null);
        ticking = false;
        return;
      }

      setIsAtTop(false);

      // Require minimum scroll amount to trigger
      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      setScrollDirection(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDirection);
        ticking = true;
      }
    };

    // Initial check
    updateScrollDirection();

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return { scrollDirection, isAtTop, isNearBottom };
}
