/**
 * Zustand store for SchemeSteal app state management
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppStore, ScanMode, ScanResult, Paint, CartItem } from './types';

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMode: null,
      currentScan: null,
      scanHistory: [],
      cart: [],
      isScanning: false,
      isLoading: false,
      error: null,
      offlineMode: false,

      // Mode and scan actions
      setMode: (mode: ScanMode) => set({ currentMode: mode, error: null }),

      setScanResult: (result: ScanResult) => {
        try {
          // Create a persistable version without large base64 images
          const persistableResult = {
            ...result,
            imageUrl: undefined,
            imageData: undefined,
          };

          set((state) => ({
            currentScan: result, // Keep full result in memory
            scanHistory: [persistableResult, ...state.scanHistory.slice(0, 9)], // Keep last 10 scans without images
            isScanning: false,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          // If still quota exceeded, clear history and try again
          if (error instanceof Error && error.name === 'QuotaExceededError') {
            console.warn('LocalStorage quota exceeded, clearing scan history');
            set((state) => ({
              currentScan: result,
              scanHistory: [], // Clear history to free space
              isScanning: false,
              isLoading: false,
              error: null,
            }));
          } else {
            throw error;
          }
        }
      },

      clearCurrentScan: () =>
        set({
          currentScan: null,
          currentMode: null,
          error: null,
        }),

      // Cart actions
      addToCart: (paint: Paint, mode?: ScanMode, scanId?: string) =>
        set((state) => {
          // Check if paint already exists in cart
          const existingItemIndex = state.cart.findIndex(
            (item) => item.paint.name === paint.name && item.paint.brand === paint.brand
          );

          if (existingItemIndex >= 0) {
            // Increase quantity
            const newCart = [...state.cart];
            newCart[existingItemIndex].quantity += 1;
            return { cart: newCart };
          }

          // Add new item
          const newItem: CartItem = {
            paint,
            quantity: 1,
            addedFrom: mode,
            scanId,
          };

          return { cart: [...state.cart, newItem] };
        }),

      removeFromCart: (paintId: string) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => `${item.paint.brand}-${item.paint.name}` !== paintId
          ),
        })),

      updateQuantity: (paintId: string, quantity: number) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            `${item.paint.brand}-${item.paint.name}` === paintId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      // UI actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),

      setError: (error: string | null) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),

      // Offline mode
      setOfflineMode: (enabled: boolean) => set({ offlineMode: enabled }),
    }),
    {
      name: 'schemestealer-storage', // LocalStorage key
      partialize: (state) => ({
        // Only persist cart, scan history (without images), and offline mode preference
        cart: state.cart,
        scanHistory: state.scanHistory,
        offlineMode: state.offlineMode,
      }),
    }
  )
);
