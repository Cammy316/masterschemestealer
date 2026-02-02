/**
 * Client Provider Component
 * Wraps client-side providers including ErrorBoundary, ToastContainer, and ML Logger
 */

'use client';

import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastContainer } from './shared/Toast';
import { mlLogger } from '@/lib/mlDataLogger';
import { analytics } from '@/lib/analytics';
import { AnalyticsPageTracker } from './AnalyticsPageTracker';

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  // Initialize ML logger and analytics on app start
  useEffect(() => {
    mlLogger.initialize();
    analytics.initialize();

    // Cleanup on unmount
    return () => {
      mlLogger.destroy();
      analytics.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      <AnalyticsPageTracker />
      {children}
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default ClientProvider;
