/**
 * Toast Notification Store
 * Zustand-based toast management with W40K theming support
 */

import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  createdAt: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  // Convenience methods
  success: (message: string, duration?: number) => string;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
}

const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message: string, type: ToastType = 'info', duration: number = 5000): string => {
    const id = generateId();
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      createdAt: Date.now(),
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  // Convenience methods
  success: (message: string, duration?: number) => {
    return get().addToast(message, 'success', duration);
  },

  error: (message: string, duration?: number) => {
    return get().addToast(message, 'error', duration ?? 7000); // Errors stay longer
  },

  warning: (message: string, duration?: number) => {
    return get().addToast(message, 'warning', duration ?? 6000);
  },

  info: (message: string, duration?: number) => {
    return get().addToast(message, 'info', duration);
  },
}));

/**
 * Hook for toast notifications
 * Returns all toast state and actions
 */
export function useToast() {
  const store = useToastStore();
  return store;
}

export default useToast;
