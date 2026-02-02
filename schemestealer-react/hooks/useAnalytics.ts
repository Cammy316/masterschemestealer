/**
 * useAnalytics Hook
 * Provides typed analytics methods and auto-tracks page views on route change
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { analytics, type AnalyticsEventName } from '@/lib/analytics';

// ============================================================================
// Types
// ============================================================================

interface UseAnalyticsReturn {
  /** Track a custom event */
  trackEvent: (name: AnalyticsEventName, properties?: Record<string, string | number | boolean | null>) => void;
  /** Track page view manually */
  trackPageView: (path?: string, referrer?: string) => void;
  /** Track scan started */
  trackScanStarted: (mode: 'miniature' | 'inspiration') => void;
  /** Track scan completed */
  trackScanCompleted: (mode: 'miniature' | 'inspiration', numColours: number, processingTimeMs: number) => void;
  /** Track paint added to cart */
  trackPaintAddedToCart: (paintName: string, brand: string, price?: number) => void;
  /** Track paint removed from cart */
  trackPaintRemovedFromCart: (paintName: string, brand: string) => void;
  /** Track affiliate link clicked */
  trackAffiliateLinkClicked: (retailer: string, paintName: string, paintBrand: string) => void;
  /** Track share initiated */
  trackShareInitiated: (method: 'copy' | 'download' | 'social') => void;
  /** Track feedback submitted */
  trackFeedbackSubmitted: (rating: number, hasCorrections: boolean) => void;
  /** Track pro upgrade clicked */
  trackProUpgradeClicked: () => void;
  /** Track Ko-fi clicked */
  trackKoFiClicked: (source: string) => void;
}

// ============================================================================
// Hook Implementation
// ============================================================================

export function useAnalytics(options?: { autoTrackPageViews?: boolean }): UseAnalyticsReturn {
  const { autoTrackPageViews = true } = options || {};
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);
  const isInitialized = useRef(false);

  // Initialize analytics on first use
  useEffect(() => {
    if (!isInitialized.current) {
      analytics.initialize();
      isInitialized.current = true;
    }
  }, []);

  // Auto-track page views on route change
  useEffect(() => {
    if (!autoTrackPageViews) return;

    // Only track if pathname actually changed
    if (pathname && pathname !== previousPathname.current) {
      const referrer = previousPathname.current || undefined;
      analytics.trackPageView(pathname, referrer);
      previousPathname.current = pathname;
    }
  }, [pathname, autoTrackPageViews]);

  // Memoized track functions
  const trackEvent = useCallback(
    (name: AnalyticsEventName, properties?: Record<string, string | number | boolean | null>) => {
      analytics.track(name, properties || {});
    },
    []
  );

  const trackPageView = useCallback((path?: string, referrer?: string) => {
    analytics.trackPageView(path || window.location.pathname, referrer);
  }, []);

  const trackScanStarted = useCallback((mode: 'miniature' | 'inspiration') => {
    analytics.trackScanStarted(mode);
  }, []);

  const trackScanCompleted = useCallback(
    (mode: 'miniature' | 'inspiration', numColours: number, processingTimeMs: number) => {
      analytics.trackScanCompleted(mode, numColours, processingTimeMs);
    },
    []
  );

  const trackPaintAddedToCart = useCallback((paintName: string, brand: string, price?: number) => {
    analytics.trackPaintAddedToCart(paintName, brand, price);
  }, []);

  const trackPaintRemovedFromCart = useCallback((paintName: string, brand: string) => {
    analytics.trackPaintRemovedFromCart(paintName, brand);
  }, []);

  const trackAffiliateLinkClicked = useCallback(
    (retailer: string, paintName: string, paintBrand: string) => {
      analytics.trackAffiliateLinkClicked(retailer, paintName, paintBrand);
    },
    []
  );

  const trackShareInitiated = useCallback((method: 'copy' | 'download' | 'social') => {
    analytics.trackShareInitiated(method);
  }, []);

  const trackFeedbackSubmitted = useCallback((rating: number, hasCorrections: boolean) => {
    analytics.trackFeedbackSubmitted(rating, hasCorrections);
  }, []);

  const trackProUpgradeClicked = useCallback(() => {
    analytics.trackProUpgradeClicked();
  }, []);

  const trackKoFiClicked = useCallback((source: string) => {
    analytics.trackKoFiClicked(source);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackScanStarted,
    trackScanCompleted,
    trackPaintAddedToCart,
    trackPaintRemovedFromCart,
    trackAffiliateLinkClicked,
    trackShareInitiated,
    trackFeedbackSubmitted,
    trackProUpgradeClicked,
    trackKoFiClicked,
  };
}

export default useAnalytics;
