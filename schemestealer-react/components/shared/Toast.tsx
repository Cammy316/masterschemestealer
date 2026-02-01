/**
 * Toast Notification System
 * W40K themed toast notifications with Framer Motion animations
 */

'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToastStore, Toast as ToastType, ToastType as ToastVariant } from '@/lib/useToast';

/**
 * Individual Toast component
 */
interface ToastItemProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const getStyles = (type: ToastVariant) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-900/95 to-green-800/95',
          border: 'border-green-500',
          text: 'text-green-400',
          icon: '✓',
          glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-900/95 to-red-800/95',
          border: 'border-red-500',
          text: 'text-red-400',
          icon: '✕',
          glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        };
      case 'warning':
        return {
          bg: 'bg-gradient-to-r from-amber-900/95 to-amber-800/95',
          border: 'border-amber-500',
          text: 'text-amber-400',
          icon: '⚠',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-900/95 to-blue-800/95',
          border: 'border-blue-500',
          text: 'text-blue-400',
          icon: 'ℹ',
          glow: 'shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        };
    }
  };

  const styles = getStyles(toast.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30,
      }}
      className={`
        relative overflow-hidden rounded-lg border-2 ${styles.border} ${styles.bg} ${styles.glow}
        backdrop-blur-sm max-w-sm w-full
      `}
    >
      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 ${styles.text.replace('text-', 'bg-')}`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{
            duration: toast.duration / 1000,
            ease: 'linear',
          }}
        />
      )}

      <div className="flex items-start gap-3 p-4">
        {/* Icon */}
        <motion.span
          className={`text-xl ${styles.text} flex-shrink-0`}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
        >
          {styles.icon}
        </motion.span>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium leading-relaxed break-words">
            {toast.message}
          </p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className={`flex-shrink-0 ${styles.text} hover:text-white transition-colors p-1 -m-1 rounded`}
          aria-label="Dismiss notification"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Toast Container - renders at the bottom of the screen
 * Place this component once in your app (e.g., in ClientProvider or layout)
 */
export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[60] flex flex-col-reverse gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onDismiss={removeToast} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

/**
 * Simple single toast component (for backwards compatibility)
 * Use ToastContainer + useToast for multiple toasts
 */
interface SimpleToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, onClose, duration = 2000 }: SimpleToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full shadow-2xl ${
        type === 'success'
          ? 'bg-green-600 text-white border-2 border-green-400'
          : 'bg-red-600 text-white border-2 border-red-400'
      }`}
    >
      <div className="flex items-center gap-2 font-semibold text-sm whitespace-nowrap">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 500, damping: 15 }}
        >
          {type === 'success' ? '✓' : '✕'}
        </motion.span>
        <span>{message}</span>
      </div>
    </motion.div>
  );
}

export default ToastContainer;
