import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/billing-store-UiWAZg61.js
var useBilling = create()(persist((set) => ({
	paymentMethods: [],
	addPaymentMethod: (method) => set((state) => {
		const isFirst = state.paymentMethods.length === 0;
		const newMethod = {
			...method,
			id: `pm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			isDefault: isFirst
		};
		return { paymentMethods: [...state.paymentMethods, newMethod] };
	}),
	removePaymentMethod: (id) => set((state) => {
		const filtered = state.paymentMethods.filter((m) => m.id !== id);
		if (state.paymentMethods.find((m) => m.id === id)?.isDefault && filtered.length > 0) filtered[0].isDefault = true;
		return { paymentMethods: filtered };
	}),
	setDefault: (id) => set((state) => ({ paymentMethods: state.paymentMethods.map((m) => ({
		...m,
		isDefault: m.id === id
	})) }))
}), { name: "cloudcart.billing" }));
//#endregion
export { useBilling as t };
