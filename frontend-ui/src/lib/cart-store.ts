import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./types";
import { api } from "./api-client";

interface CartItem { product: Product; qty: number; cart_id?: string }

interface CartState {
  items: CartItem[];
  wishlist: string[];
  add: (p: Product, qty?: number) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setQty: (id: string, qty: number) => Promise<void>;
  clear: () => void;
  toggleWishlist: (id: string) => void;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      wishlist: [],
      add: async (p, qty = 1) => {
        const stored = localStorage.getItem("cloudcart.auth");
        let customerId = "";
        try {
          const state = JSON.parse(stored ?? "{}");
          customerId = state.state?.user?.email ?? "";
        } catch {}
        
        let cart_id: string | undefined = undefined;
        if (customerId) {
          try {
            const res = await api.cart.add({ customer_id: customerId, product_id: p.product_id, quantity: qty });
            cart_id = res.data?.cart_id;
            // Only update local state if backend succeeds
            set((s) => {
              const existing = s.items.find((i) => i.product.product_id === p.product_id);
              if (existing) {
                return { items: s.items.map((i) => i.product.product_id === p.product_id ? { ...i, qty: i.qty + qty, cart_id: cart_id ?? i.cart_id } : i) };
              }
              return { items: [...s.items, { product: p, qty, cart_id }] };
            });
          } catch (e) {
            console.error("Failed to sync add to backend", e);
            throw e;
          }
        } else {
          // Guest mode fallback
          set((s) => {
            const existing = s.items.find((i) => i.product.product_id === p.product_id);
            if (existing) {
              return { items: s.items.map((i) => i.product.product_id === p.product_id ? { ...i, qty: i.qty + qty } : i) };
            }
            return { items: [...s.items, { product: p, qty }] };
          });
        }
      },
      remove: async (id) => {
        const item = get().items.find((i) => i.product.product_id === id);
        if (item && item.cart_id) {
          try {
            await api.cart.remove(item.cart_id);
            set((s) => ({ items: s.items.filter((i) => i.product.product_id !== id) }));
          } catch (e) {
            console.error("Failed to sync remove to backend", e);
            // Optionally throw e so the UI can show a toast
            throw e;
          }
        } else {
          set((s) => ({ items: s.items.filter((i) => i.product.product_id !== id) }));
        }
      },
      setQty: async (id, qty) => {
        const item = get().items.find((i) => i.product.product_id === id);
        const newQty = Math.max(1, qty);
        if (item && item.cart_id) {
          try {
            await api.cart.update(item.cart_id, { quantity: newQty });
            set((s) => ({
              items: s.items.map((i) => i.product.product_id === id ? { ...i, qty: newQty } : i)
            }));
          } catch (e) {
            console.error("Failed to sync update to backend", e);
            throw e;
          }
        } else {
          set((s) => ({
            items: s.items.map((i) => i.product.product_id === id ? { ...i, qty: newQty } : i)
          }));
        }
      },
      clear: () => set({ items: [] }),
      toggleWishlist: (id) => set((s) => ({
        wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id]
      })),
      subtotal: () => get().items.reduce((n, i) => n + i.product.price * i.qty, 0),
    }),
    { name: "cloudcart.cart" },
  ),
);
