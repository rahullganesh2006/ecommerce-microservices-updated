import { API } from "@/api/config";
import type {
  Product, ProductCreate, ApiResponse,
  CartResponse, AddToCartRequest, CartItemResponse, CheckoutResponse,
  Inventory,
  Order, OrderCreate,
  Payment, PaymentCreate,
} from "./types";

function getToken(): string | null {
  const stored = localStorage.getItem("cloudcart.auth");
  if (!stored) return null;
  try {
    const state = JSON.parse(stored);
    return state.state?.tokens?.accessToken ?? null;
  } catch {
    return null;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  baseUrl: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${baseUrl.replace(/\/+$/, "")}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...authHeaders(),
  } as Record<string, string>;
  if (options.headers && typeof options.headers === "object" && !Array.isArray(options.headers)) {
    Object.assign(headers, options.headers as Record<string, string>);
  }
  console.log(`[API] ${options.method ?? "GET"} ${url}`);
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.text().catch(() => "(empty)");
    const msg = `API ${res.status}: ${body}`;
    console.error(`[API] Error: ${msg}`);
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  // ─── Products ──────────────────────────────────────────
  products: {
    list: () =>
      request<ApiResponse<Product[]>>(API.PRODUCT, "/products/"),
    get: (id: string) =>
      request<Product>(API.PRODUCT, `/products/${id}`),
    create: (data: ProductCreate) =>
      request<ApiResponse<Product>>(API.PRODUCT, "/products/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<ProductCreate>) =>
      request<ApiResponse<Product>>(API.PRODUCT, `/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<ApiResponse<null>>(API.PRODUCT, `/products/${id}`, {
        method: "DELETE",
      }),
  },

  // ─── Cart ───────────────────────────────────────────────
  cart: {
    add: (data: AddToCartRequest) =>
      request<ApiResponse<CartItemResponse>>(API.CART, "/cart/add", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    getCustomerCart: (customerId: string) =>
      request<CartResponse>(API.CART, `/cart/customer/${customerId}`),
    update: (cartId: string, data: { quantity: number }) =>
      request<ApiResponse<CartItemResponse>>(API.CART, `/cart/update/${cartId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    remove: (cartId: string) =>
      request<ApiResponse<null>>(API.CART, `/cart/remove/${cartId}`, {
        method: "DELETE",
      }),
    checkout: (customerId: string, data: { payment_method: string; shipping_address: string; items: any[] }) =>
      request<CheckoutResponse>(API.CART, `/cart/checkout/${customerId}`, {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  // ─── Inventory ──────────────────────────────────────────
  inventory: {
    list: () =>
      request<ApiResponse<Inventory[]>>(API.INVENTORY, "/inventory/"),
    get: (id: string) =>
      request<Inventory>(API.INVENTORY, `/inventory/${id}`),
    create: (data: Inventory) =>
      request<ApiResponse<Inventory>>(API.INVENTORY, "/inventory/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Inventory>) =>
      request<ApiResponse<Inventory>>(API.INVENTORY, `/inventory/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<ApiResponse<null>>(API.INVENTORY, `/inventory/${id}`, {
        method: "DELETE",
      }),
    reserve: (id: string, quantity: number) =>
      request<ApiResponse<Inventory>>(API.INVENTORY, `/inventory/${id}/reserve?quantity=${quantity}`, {
        method: "POST",
      }),
    release: (id: string, quantity: number) =>
      request<ApiResponse<Inventory>>(API.INVENTORY, `/inventory/${id}/release?quantity=${quantity}`, {
        method: "POST",
      }),
    confirm: (id: string, quantity: number) =>
      request<ApiResponse<Inventory>>(API.INVENTORY, `/inventory/${id}/confirm?quantity=${quantity}`, {
        method: "POST",
      }),
  },

  // ─── Orders ─────────────────────────────────────────────
  orders: {
    list: () =>
      request<ApiResponse<Order[]>>(API.ORDER, "/orders/"),
    get: (id: string) =>
      request<Order>(API.ORDER, `/orders/${id}`),
    create: (data: OrderCreate) =>
      request<ApiResponse<Order>>(API.ORDER, "/orders/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Order>) =>
      request<ApiResponse<Order>>(API.ORDER, `/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<ApiResponse<null>>(API.ORDER, `/orders/${id}`, {
        method: "DELETE",
      }),
  },

  // ─── Payments ───────────────────────────────────────────
  payments: {
    list: () =>
      request<ApiResponse<Payment[]>>(API.PAYMENT, "/payments/"),
    get: (id: string) =>
      request<Payment>(API.PAYMENT, `/payments/${id}`),
    create: (data: PaymentCreate) =>
      request<ApiResponse<Payment>>(API.PAYMENT, "/payments/", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (id: string, data: Partial<Payment>) =>
      request<ApiResponse<Payment>>(API.PAYMENT, `/payments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request<ApiResponse<null>>(API.PAYMENT, `/payments/${id}`, {
        method: "DELETE",
      }),
  },
};
