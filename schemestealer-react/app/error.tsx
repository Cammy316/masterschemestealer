'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to our analytics endpoint
    // Fallback telemetry check since we might not have the store fully initialized if it crashes early
    let isTelemetryEnabled = false;
    try {
      const storeStr = localStorage.getItem('schemestealer-storage');
      if (storeStr) {
        const parsed = JSON.parse(storeStr);
        if (parsed?.state?.isTelemetryEnabled) {
          isTelemetryEnabled = true;
        }
      }
    } catch (e) {
      // Ignore
    }

    if (isTelemetryEnabled) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      if (apiUrl) {
        fetch(apiUrl + '/api/analytics/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            events: [{
              event_type: 'fatal_error',
              timestamp: new Date().toISOString(),
              payload: { message: error.message, digest: error.digest, stack: error.stack }
            }]
          })
        }).catch(() => {});
      }
    }
  }, [error]);

  return (
    <main className="min-h-dvh bg-void-black text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 border border-error/50 p-8 bg-[#2a0000]/40 rounded relative overflow-hidden">
        {/* Scanline overlay for aesthetic */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255, 0, 0, 0.05) 2px, rgba(255, 0, 0, 0.05) 4px)'
        }}></div>
        
        <h1 className="text-3xl gothic-text text-error tracking-widest text-shadow relative z-10">System Failure</h1>
        <h2 className="text-lg tech-text text-gray-300 uppercase tracking-widest relative z-10">Cogitator Error</h2>
        <div className="bg-black/50 p-4 rounded text-left border border-error/20 overflow-x-auto relative z-10">
          <p className="text-gray-400 text-xs font-mono whitespace-pre-wrap break-words">
            {error.message || "An unexpected error occurred during execution."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative z-10">
          <button
            onClick={() => reset()}
            className="inline-block border border-error text-error px-6 py-3 rounded hover:bg-error/20 transition-colors tech-text tracking-widest uppercase text-sm"
          >
            Reboot Machine Spirit
          </button>
          <Link
            href="/"
            className="inline-block border border-gray-600 text-gray-300 px-6 py-3 rounded hover:bg-gray-800 transition-colors tech-text tracking-widest uppercase text-sm"
          >
            Return to Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
