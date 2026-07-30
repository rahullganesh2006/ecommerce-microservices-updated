import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./mock-data";

interface CartItem { product: Product; qty: number }

interface CartState {
  items: CartItem[];
  wishlist: string[];
  add: (p: Product, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toggleWishlist: (id: string) => void;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      add: (p, qty = 1) => set((s) => {
        const existing = s.items.find((i) => i.product.id === p.id);
        if (existing) {
          return { items: s.items.map((i) => i.product.id === p.id ? { ...i, qty: i.qty + qty } : i) };
        }
        return { items: [...s.items, { product: p, qty }] };
      }),
      remove: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      setQty: (id, qty) => set((s) => ({
        items: s.items.map((i) => i.product.id === id ? { ...i, qty: Math.max(1, qty) } : i)
      })),
      clear: () => set({ items: [] }),
      toggleWishlist: (id) => set((s) => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id]
      })),
      subtotal: () => get().items.reduce((n, i) => n + i.product.price * i.qty, 0),
    }),
    { name: "cloudcart.cart" },
  ),
);
