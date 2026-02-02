/**
 * Analytics Page Tracker Component
 * Automatically tracks page views on route changes
 */

'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { analytics } from '@/lib/analytics';

export function AnalyticsPageTracker() {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    // Only track if pathname actually changed
    if (pathname && pathname !== previousPathname.current) {
      const referrer = previousPathname.current || undefined;
      analytics.trackPageView(pathname, referrer);
      previousPathname.current = pathname;
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
}

export default AnalyticsPageTracker;
