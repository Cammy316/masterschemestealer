/**
 * Client Provider Component
 * Wraps client-side providers including ErrorBoundary, ToastContainer, and ML Logger
 */

'use client';

import { ReactNode, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastContainer } from './shared/Toast';
import { mlLogger } from '@/lib/mlDataLogger';

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  // Initialize ML logger on app start
  useEffect(() => {
    mlLogger.initialize();

    // Cleanup on unmount
    return () => {
      mlLogger.destroy();
    };
  }, []);

  return (
    <ErrorBoundary>
      {children}
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default ClientProvider;
