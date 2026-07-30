export interface Product {
  product_id: string;
  product_name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image: string | null;
}

export interface ProductCreate {
  product_id: string;
  product_name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  image?: string;
}

export interface CartItemResponse {
  cart_id: string;
  customer_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface CartResponse {
  customer_id: string;
  items: CartItemResponse[];
  total_items: number;
  cart_total: number;
}

export interface AddToCartRequest {
  customer_id: string;
  product_id: string;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

export interface CheckoutResponse {
  customer_id: string;
  subtotal: number;
  gst: number;
  shipping_charge: number;
  grand_total: number;
}

export interface Inventory {
  inventory_id: string;
  product_id: string;
  available_stock: number;
  reserved_stock: number;
  warehouse_location: string;
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping_address: string;
  order_status: string;
}

export interface OrderCreate {
  order_id: string;
  customer_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  shipping_address: string;
}

export interface Payment {
  payment_id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  payment_method: string;
  cashback: number;
  final_amount: number;
  fraud_score: number;
  risk_level: string;
  payment_status: string;
  transaction_id: string;
  payment_time: string;
}

export interface PaymentCreate {
  payment_id: string;
  order_id: string;
  customer_id: string;
  amount: number;
  payment_method: string;
}

export type PaymentMethod = "card" | "upi" | "netbanking" | "wallet" | "cod";

export const PAYMENT_METHOD_MAP: Record<PaymentMethod, string> = {
  card: "CARD",
  upi: "UPI",
  netbanking: "NET_BANKING",
  wallet: "WALLET",
  cod: "COD",
};

export interface ApiResponse<T> {
  message?: string;
  data?: T;
  count?: number;
}
