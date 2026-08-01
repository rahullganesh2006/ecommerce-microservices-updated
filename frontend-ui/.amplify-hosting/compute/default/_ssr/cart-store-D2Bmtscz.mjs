import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as api } from "./api-client-DDlHUadL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-store-D2Bmtscz.js
var useCart = create()(persist((set, get) => ({
	items: [],
	wishlist: [],
	add: async (p, qty = 1) => {
		const stored = localStorage.getItem("cloudcart.auth");
		let customerId = "";
		try {
			customerId = JSON.parse(stored ?? "{}").state?.user?.email ?? "";
		} catch {}
		let cart_id = void 0;
		if (customerId) try {
			set((s) => {
				if (s.items.find((i) => i.product.product_id === p.product_id)) return { items: s.items.map((i) => i.product.product_id === p.product_id ? {
					...i,
					qty: i.qty + qty
				} : i) };
				return { items: [...s.items, {
					product: p,
					qty
				}] };
			});
			cart_id = (await api.cart.add({
				customer_id: customerId,
				product_id: p.product_id,
				quantity: qty
			})).data?.cart_id;
			if (cart_id) set((s) => ({ items: s.items.map((i) => i.product.product_id === p.product_id ? {
				...i,
				cart_id
			} : i) }));
		} catch (e) {
			console.error("Failed to sync add to backend", e);
			throw e;
		}
		else set((s) => {
			if (s.items.find((i) => i.product.product_id === p.product_id)) return { items: s.items.map((i) => i.product.product_id === p.product_id ? {
				...i,
				qty: i.qty + qty
			} : i) };
			return { items: [...s.items, {
				product: p,
				qty
			}] };
		});
	},
	remove: async (id) => {
		const item = get().items.find((i) => i.product.product_id === id);
		if (item && item.cart_id) try {
			set((s) => ({ items: s.items.filter((i) => i.product.product_id !== id) }));
			await api.cart.remove(item.cart_id);
		} catch (e) {
			console.error("Failed to sync remove to backend", e);
			throw e;
		}
		else set((s) => ({ items: s.items.filter((i) => i.product.product_id !== id) }));
	},
	setQty: async (id, qty) => {
		const item = get().items.find((i) => i.product.product_id === id);
		const newQty = Math.max(1, qty);
		if (item && item.cart_id) try {
			set((s) => ({ items: s.items.map((i) => i.product.product_id === id ? {
				...i,
				qty: newQty
			} : i) }));
			await api.cart.update(item.cart_id, { quantity: newQty });
		} catch (e) {
			console.error("Failed to sync update to backend", e);
			throw e;
		}
		else set((s) => ({ items: s.items.map((i) => i.product.product_id === id ? {
			...i,
			qty: newQty
		} : i) }));
	},
	clear: () => set({ items: [] }),
	toggleWishlist: (id) => set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((x) => x !== id) : [...s.wishlist, id] })),
	subtotal: () => get().items.reduce((n, i) => n + i.product.price * i.qty, 0)
}), { name: "cloudcart.cart" }));
//#endregion
export { useCart as t };
