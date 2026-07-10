'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConsentState, setConsent } from '@/lib/analytics';

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check after mount to avoid hydration mismatch
    const state = getConsentState();
    if (state === 'pending') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setShow(false);
  };

  const handleDecline = () => {
    setConsent(false);
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className="fixed bottom-[calc(var(--nav-height)+env(safe-area-inset-bottom)+1rem)] left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-[var(--z-dropdown)] bg-void-black/95 backdrop-blur-md border border-gray-800 rounded-lg shadow-2xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-imperial-gold font-bold text-sm tracking-wider uppercase mb-1">
                Telemetry Auspex
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                We use minimal, anonymised telemetry to improve our servitors and detect heresy. No personal data is sold. Do you consent to auspex scanning?
              </p>
            </div>
            <button
              onClick={() => setShow(false)}
              aria-label="Dismiss"
              className="text-gray-600 hover:text-gray-300 transition-colors touch-target flex items-center justify-center -mt-2 -mr-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="flex gap-2 mt-1">
            <button
              onClick={handleAccept}
              className="flex-1 touch-target bg-brass/20 hover:bg-brass/30 text-imperial-gold border border-brass/50 rounded px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Accept
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 touch-target bg-transparent hover:bg-gray-800 text-gray-400 border border-gray-700 rounded px-3 py-2 text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
