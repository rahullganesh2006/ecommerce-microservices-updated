import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-store-C1LOKWKa.js
var useAuth = create()(persist((set, get) => ({
	user: null,
	tokens: null,
	isAuthenticated: false,
	login: async (email, password) => {
		throw new Error("Use setAuth after login flow");
	},
	setAuth: (user, tokens) => {
		set({
			user,
			tokens,
			isAuthenticated: true
		});
	},
	updateUser: (data) => {
		const currentUser = get().user;
		if (currentUser) set({ user: {
			...currentUser,
			...data
		} });
	},
	logout: () => set({
		user: null,
		tokens: null,
		isAuthenticated: false
	}),
	refresh: async () => {}
}), { name: "cloudcart.auth" }));
//#endregion
export { useAuth as t };
