"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  key: string; // productId:variantId
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  variantName: string;
  image: string;
  unitPrice: number;
  quantity: number;
  maxStock: number;
};

type Promo = { code: string; percent: number };

type CartState = {
  items: CartItem[];
  promo: Promo | null;
  isOpen: boolean;
  add: (item: Omit<CartItem, "key" | "quantity">, quantity?: number) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setPromo: (promo: Promo | null) => void;
  open: () => void;
  close: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      promo: null,
      isOpen: false,
      add: (item, quantity = 1) =>
        set((s) => {
          const key = `${item.productId}:${item.variantId}`;
          const existing = s.items.find((i) => i.key === key);
          const items = existing
            ? s.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, item.maxStock) } : i,
              )
            : [...s.items, { ...item, key, quantity: Math.min(quantity, item.maxStock) }];
          return { items, isOpen: true };
        }),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.key === key ? { ...i, quantity: Math.max(0, Math.min(quantity, i.maxStock)) } : i))
            .filter((i) => i.quantity > 0),
        })),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      clear: () => set({ items: [], promo: null }),
      setPromo: (promo) => set({ promo }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "ferrum-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items, promo: s.promo }),
    },
  ),
);

export const cartSubtotal = (items: CartItem[]) => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
export const cartCount = (items: CartItem[]) => items.reduce((s, i) => s + i.quantity, 0);

/** true une fois le panier relu depuis localStorage (évite les écarts d'hydratation). */
export function useCartHydrated() {
  return useSyncExternalStore(
    (cb) => useCart.persist.onFinishHydration(cb),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
