// Central mock data for microservices demo (Product, Inventory, Order, Payment)
export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  description: string;
  stock: number;
  sku: string;
}

const IMG = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=800&q=80`;

export const products: Product[] = [
  { id: "p1", name: "Aurora Wireless Headphones", category: "Audio", price: 249, image: IMG("1505740420928-5e560c06d30e"), rating: 4.8, description: "Studio-grade active noise cancelling headphones with 40h battery.", stock: 128, sku: "AUR-001" },
  { id: "p2", name: "Nimbus Smartwatch Pro", category: "Wearables", price: 399, image: IMG("1546868871-7041f2a55e12"), rating: 4.7, description: "Health tracking, AMOLED display, LTE connectivity.", stock: 62, sku: "NIM-042" },
  { id: "p3", name: "Cirrus Mechanical Keyboard", category: "Accessories", price: 179, image: IMG("1587829741301-dc798b83add3"), rating: 4.9, description: "Hot-swappable switches, aluminum chassis, RGB.", stock: 210, sku: "CIR-114" },
  { id: "p4", name: "Stratus 4K Monitor", category: "Displays", price: 599, image: IMG("1527443224154-c4a3942d3acf"), rating: 4.6, description: "27-inch 4K IPS, 144Hz, USB-C 90W PD.", stock: 34, sku: "STR-027" },
  { id: "p5", name: "Zenith Ergonomic Mouse", category: "Accessories", price: 89, image: IMG("1527814050087-3793815479db"), rating: 4.5, description: "Precision optical sensor, silent clicks.", stock: 8, sku: "ZEN-089" },
  { id: "p6", name: "Vertex Laptop Stand", category: "Accessories", price: 65, image: IMG("1587829741301-dc798b83add3"), rating: 4.4, description: "Aluminum, height adjustable, cable management.", stock: 0, sku: "VER-065" },
  { id: "p7", name: "Halo Wireless Charger", category: "Power", price: 45, image: IMG("1583394838336-acd977736f90"), rating: 4.3, description: "15W Qi fast charging with cooling fan.", stock: 400, sku: "HAL-015" },
  { id: "p8", name: "Pulse USB-C Hub", category: "Accessories", price: 79, image: IMG("1618384887929-16ec33fab9ef"), rating: 4.6, description: "8-in-1 hub with HDMI, SD, USB-A/C, ethernet.", stock: 18, sku: "PUL-108" },
];

export interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: "Pending" | "Processing" | "Delivered" | "Cancelled";
  date: string;
  items: number;
}

export const orders: Order[] = [
  { id: "ORD-8842", customer: "Jamie Chen", email: "customer@cloudcart.io", total: 428, status: "Processing", date: "2026-07-14", items: 2 },
  { id: "ORD-8841", customer: "Priya Nair", email: "priya@example.com", total: 249, status: "Delivered", date: "2026-07-13", items: 1 },
  { id: "ORD-8840", customer: "Marcus Reed", email: "marcus@example.com", total: 1298, status: "Delivered", date: "2026-07-12", items: 3 },
  { id: "ORD-8839", customer: "Sofia Herrera", email: "sofia@example.com", total: 89, status: "Pending", date: "2026-07-12", items: 1 },
  { id: "ORD-8838", customer: "Kenji Tanaka", email: "kenji@example.com", total: 599, status: "Cancelled", date: "2026-07-11", items: 1 },
  { id: "ORD-8837", customer: "Ada Osei", email: "ada@example.com", total: 244, status: "Delivered", date: "2026-07-10", items: 2 },
];

export const revenueByMonth = [
  { m: "Jan", r: 42000 }, { m: "Feb", r: 51000 }, { m: "Mar", r: 48000 },
  { m: "Apr", r: 62000 }, { m: "May", r: 71000 }, { m: "Jun", r: 84000 },
  { m: "Jul", r: 92500 },
];

export const ordersByDay = [
  { d: "Mon", o: 42 }, { d: "Tue", o: 55 }, { d: "Wed", o: 61 },
  { d: "Thu", o: 48 }, { d: "Fri", o: 73 }, { d: "Sat", o: 88 }, { d: "Sun", o: 64 },
];

export interface Payment {
  id: string;
  order: string;
  amount: number;
  method: "Card" | "UPI" | "Net Banking" | "Wallet";
  status: "Success" | "Failed" | "Refunded";
  date: string;
}

export const payments: Payment[] = [
  { id: "PAY-9921", order: "ORD-8842", amount: 428, method: "Card", status: "Success", date: "2026-07-14" },
  { id: "PAY-9920", order: "ORD-8841", amount: 249, method: "UPI", status: "Success", date: "2026-07-13" },
  { id: "PAY-9919", order: "ORD-8840", amount: 1298, method: "Card", status: "Success", date: "2026-07-12" },
  { id: "PAY-9918", order: "ORD-8839", amount: 89, method: "Wallet", status: "Failed", date: "2026-07-12" },
  { id: "PAY-9917", order: "ORD-8838", amount: 599, method: "Net Banking", status: "Refunded", date: "2026-07-11" },
];

export interface Customer {
  id: string;
  name: string;
  email: string;
  orders: number;
  spent: number;
  joined: string;
}

export const customers: Customer[] = [
  { id: "c1", name: "Jamie Chen", email: "customer@cloudcart.io", orders: 12, spent: 3421, joined: "2025-02-11" },
  { id: "c2", name: "Priya Nair", email: "priya@example.com", orders: 8, spent: 1892, joined: "2025-04-02" },
  { id: "c3", name: "Marcus Reed", email: "marcus@example.com", orders: 21, spent: 8734, joined: "2024-11-19" },
  { id: "c4", name: "Sofia Herrera", email: "sofia@example.com", orders: 3, spent: 412, joined: "2026-01-08" },
  { id: "c5", name: "Kenji Tanaka", email: "kenji@example.com", orders: 15, spent: 4521, joined: "2025-06-27" },
];
