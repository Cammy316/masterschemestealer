/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a W40K themed error screen
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console (future: send to analytics service)
    console.error('[MACHINE SPIRIT MALFUNCTION]', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({ errorInfo });
  }

  handleReload = (): void => {
    window.location.reload();
  };

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-void-black">
          {/* Flickering scanline overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.03) 2px, rgba(255,0,0,0.03) 4px)',
            }}
          />

          <div className="relative w-full max-w-lg mx-4 p-8">
            {/* Error container with gothic frame */}
            <div
              className="relative rounded-lg p-1 depth-2"
              style={{
                background: 'linear-gradient(135deg, #8B0000, #4a0000)',
              }}
            >
              <div className="bg-void-black rounded-lg p-8 textured">
                {/* Skull icon */}
                <div className="flex justify-center mb-6">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="1.5"
                    className="animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 20px rgba(220, 38, 38, 0.5))',
                    }}
                  >
                    <path d="M12 2C8 2 5 5 5 9c0 2.5 1 4 2 5v3h10v-3c1-1 2-2.5 2-5 0-4-3-7-7-7z" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="10" r="1.5" fill="#DC2626" />
                    <circle cx="15" cy="10" r="1.5" fill="#DC2626" />
                    <path d="M8 17h8v2c0 1-1 2-2 2h-4c-1 0-2-1-2-2v-2z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 14h6" strokeLinecap="round" />
                    {/* Warning symbol on forehead */}
                    <path d="M12 5l-1 2h2l-1-2z" fill="#DC2626" />
                  </svg>
                </div>

                {/* Error title */}
                <h1
                  className="text-2xl font-bold text-center mb-4 gothic-text"
                  style={{
                    color: '#DC2626',
                    textShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
                  }}
                >
                  MACHINE SPIRIT MALFUNCTION
                </h1>

                {/* Error subtitle */}
                <p
                  className="text-center text-red-400/80 mb-6 cyber-text text-sm"
                >
                  ++ CRITICAL ERROR DETECTED ++
                </p>

                {/* Error message */}
                <div
                  className="rounded-lg p-4 mb-6"
                  style={{
                    background: 'rgba(220, 38, 38, 0.1)',
                    border: '1px solid rgba(220, 38, 38, 0.3)',
                  }}
                >
                  <p className="text-red-300 text-sm font-mono break-words">
                    {this.state.error?.message || 'An unknown error has occurred'}
                  </p>
                </div>

                {/* Recovery message */}
                <p className="text-center text-gray-400 text-sm mb-6 tech-text">
                  The cogitator has encountered an unrecoverable fault.
                  Initiating emergency protocols...
                </p>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={this.handleReload}
                    className="px-6 py-3 rounded-lg font-bold text-white transition-all duration-300 gothic-text"
                    style={{
                      background: 'linear-gradient(135deg, #DC2626, #991B1B)',
                      boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(220, 38, 38, 0.5)';
                      e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(220, 38, 38, 0.3)';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    PERFORM RITES OF REACTIVATION
                  </button>
                </div>

                {/* Tech-priest blessing */}
                <p
                  className="text-center text-gray-500 text-xs mt-6 cyber-text"
                  style={{ opacity: 0.6 }}
                >
                  ⚙ May the Omnissiah restore the Machine Spirit ⚙
                </p>
              </div>
            </div>

            {/* Corner decorations */}
            <div
              className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2"
              style={{ borderColor: '#8B0000' }}
            />
            <div
              className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2"
              style={{ borderColor: '#8B0000' }}
            />
            <div
              className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2"
              style={{ borderColor: '#8B0000' }}
            />
            <div
              className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2"
              style={{ borderColor: '#8B0000' }}
            />
          </div>

          {/* Pulsing red glow in background */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(220, 38, 38, 0.1) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
