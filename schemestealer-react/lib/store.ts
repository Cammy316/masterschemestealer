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

      // Mode and scan actions
      setMode: (mode: ScanMode) => set({ currentMode: mode, error: null }),

      setScanResult: (result: ScanResult) =>
        set((state) => ({
          currentScan: result,
          scanHistory: [result, ...state.scanHistory.slice(0, 9)], // Keep last 10 scans
          isScanning: false,
          isLoading: false,
          error: null,
        })),

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
    }),
    {
      name: 'schemestealer-storage', // LocalStorage key
      partialize: (state) => ({
        // Only persist cart and scan history
        cart: state.cart,
        scanHistory: state.scanHistory,
      }),
    }
  )
);
