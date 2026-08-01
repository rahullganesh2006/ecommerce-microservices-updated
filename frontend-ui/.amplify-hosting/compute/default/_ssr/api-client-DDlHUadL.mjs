//#region node_modules/.nitro/vite/services/ssr/assets/api-client-DDlHUadL.js
var API = {
	PRODUCT: "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/product-service",
	INVENTORY: "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/inventory-service",
	CART: "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/cart-service",
	PAYMENT: "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/payment-service",
	ORDER: "https://109pcwez22.execute-api.us-east-1.amazonaws.com/v1/order-service"
};
function getToken() {
	const stored = localStorage.getItem("cloudcart.auth");
	if (!stored) return null;
	try {
		return JSON.parse(stored).state?.tokens?.accessToken ?? null;
	} catch {
		return null;
	}
}
function authHeaders() {
	const token = getToken();
	return token ? { Authorization: `Bearer ${token}` } : {};
}
async function request(baseUrl, path, options = {}) {
	const url = `${baseUrl.replace(/\/+$/, "")}${path}`;
	const headers = {
		"Content-Type": "application/json",
		...authHeaders()
	};
	if (options.headers && typeof options.headers === "object" && !Array.isArray(options.headers)) Object.assign(headers, options.headers);
	console.log(`[API] ${options.method ?? "GET"} ${url}`);
	const res = await fetch(url, {
		...options,
		headers
	});
	if (!res.ok) {
		const body = await res.text().catch(() => "(empty)");
		const msg = `API ${res.status}: ${body}`;
		console.error(`[API] Error: ${msg}`);
		throw new Error(msg);
	}
	return res.json();
}
var api = {
	products: {
		list: () => request(API.PRODUCT, "/products/"),
		get: (id) => request(API.PRODUCT, `/products/${id}`),
		create: (data) => request(API.PRODUCT, "/products/", {
			method: "POST",
			body: JSON.stringify(data)
		}),
		update: (id, data) => request(API.PRODUCT, `/products/${id}`, {
			method: "PUT",
			body: JSON.stringify(data)
		}),
		delete: (id) => request(API.PRODUCT, `/products/${id}`, { method: "DELETE" })
	},
	cart: {
		listAll: () => request(API.CART, "/cart/all"),
		add: (data) => request(API.CART, "/cart/add", {
			method: "POST",
			body: JSON.stringify(data)
		}),
		getCustomerCart: (customerId) => request(API.CART, `/cart/customer/${customerId}`),
		update: (cartId, data) => request(API.CART, `/cart/update/${cartId}`, {
			method: "PUT",
			body: JSON.stringify(data)
		}),
		remove: (cartId) => request(API.CART, `/cart/remove/${cartId}`, { method: "DELETE" }),
		checkout: (customerId, data) => request(API.CART, `/cart/checkout/${customerId}`, {
			method: "POST",
			body: JSON.stringify(data)
		})
	},
	inventory: {
		list: () => request(API.INVENTORY, "/inventory/"),
		get: (id) => request(API.INVENTORY, `/inventory/${id}`),
		create: (data) => request(API.INVENTORY, "/inventory/", {
			method: "POST",
			body: JSON.stringify(data)
		}),
		update: (id, data) => request(API.INVENTORY, `/inventory/${id}`, {
			method: "PUT",
			body: JSON.stringify(data)
		}),
		delete: (id) => request(API.INVENTORY, `/inventory/${id}`, { method: "DELETE" }),
		reserve: (id, quantity) => request(API.INVENTORY, `/inventory/${id}/reserve?quantity=${quantity}`, { method: "POST" }),
		release: (id, quantity) => request(API.INVENTORY, `/inventory/${id}/release?quantity=${quantity}`, { method: "POST" }),
		confirm: (id, quantity) => request(API.INVENTORY, `/inventory/${id}/confirm?quantity=${quantity}`, { method: "POST" })
	},
	orders: {
		list: () => request(API.ORDER, "/orders/"),
		get: (id) => request(API.ORDER, `/orders/${id}`),
		create: (data) => request(API.ORDER, "/orders/", {
			method: "POST",
			body: JSON.stringify(data)
		}),
		update: (id, data) => request(API.ORDER, `/orders/${id}`, {
			method: "PUT",
			body: JSON.stringify(data)
		}),
		delete: (id) => request(API.ORDER, `/orders/${id}`, { method: "DELETE" })
	},
	payments: {
		list: () => request(API.PAYMENT, "/payments/"),
		get: (id) => request(API.PAYMENT, `/payments/${id}`),
		create: (data) => request(API.PAYMENT, "/payments/", {
			method: "POST",
			body: JSON.stringify(data)
		}),
		update: (id, data) => request(API.PAYMENT, `/payments/${id}`, {
			method: "PUT",
			body: JSON.stringify(data)
		}),
		delete: (id) => request(API.PAYMENT, `/payments/${id}`, { method: "DELETE" })
	}
};
//#endregion
export { api as t };
