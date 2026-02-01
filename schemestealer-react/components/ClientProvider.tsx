/**
 * Client Provider Component
 * Wraps client-side providers including ErrorBoundary and ToastContainer
 */

'use client';

import { ReactNode } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { ToastContainer } from './shared/Toast';

interface ClientProviderProps {
  children: ReactNode;
}

export function ClientProvider({ children }: ClientProviderProps) {
  return (
    <ErrorBoundary>
      {children}
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default ClientProvider;
