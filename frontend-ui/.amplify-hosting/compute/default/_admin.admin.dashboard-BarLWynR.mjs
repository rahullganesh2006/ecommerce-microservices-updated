import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { A as Package, W as IndianRupee, d as TriangleAlert, f as TrendingUp, s as Users, v as ShoppingBag } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, o as Area, r as BarChart, s as CartesianGrid, t as AreaChart } from "./_libs/recharts+[...].mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.dashboard-BarLWynR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatOrderDate(order_id) {
	const parts = order_id.split("-");
	if (parts.length > 1) {
		const ts = parseInt(parts[1], 10);
		if (!isNaN(ts)) return new Date(ts);
	}
	return /* @__PURE__ */ new Date();
}
function AdminDashboard() {
	const { data: ordersRes } = useQuery({
		queryKey: ["dashboard-orders"],
		queryFn: () => api.orders.list()
	});
	const { data: productsRes } = useQuery({
		queryKey: ["dashboard-products"],
		queryFn: () => api.products.list()
	});
	const { data: inventoryRes } = useQuery({
		queryKey: ["dashboard-inventory"],
		queryFn: () => api.inventory.list()
	});
	const { data: paymentsRes } = useQuery({
		queryKey: ["dashboard-payments"],
		queryFn: () => api.payments.list()
	});
	const orders = ordersRes?.data || [];
	const products = productsRes?.data || [];
	const inventory = inventoryRes?.data || [];
	const payments = paymentsRes?.data || [];
	const queryClient = useQueryClient();
	const addStockMutation = useMutation({
		mutationFn: async (item) => {
			const newStock = item.stock + 100;
			await api.inventory.update(item.inventory_id, { available_stock: newStock });
			if (item.original_product) await api.products.update(item.product_id, { stock: newStock });
			return item;
		},
		onSuccess: (item) => {
			toast.success(`Added 100 stock to ${item.product_name}`);
			queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
			queryClient.invalidateQueries({ queryKey: ["dashboard-inventory"] });
		},
		onError: () => {
			toast.error("Failed to replenish stock");
		}
	});
	const dashboardData = (0, import_react.useMemo)(() => {
		let totalRevenue = 0;
		let todaysOrders = 0;
		const uniqueCustomers = /* @__PURE__ */ new Set();
		const dailyRev = {};
		const dailyOrders = {};
		for (let i = 6; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			const dayStr = d.toLocaleDateString("default", {
				month: "short",
				day: "numeric"
			});
			dailyRev[dayStr] = 0;
			dailyOrders[dayStr] = 0;
		}
		const todayStr = (/* @__PURE__ */ new Date()).toLocaleDateString("default", {
			month: "short",
			day: "numeric"
		});
		orders.forEach((o) => {
			uniqueCustomers.add(o.customer_id);
			const dayStr = formatOrderDate(o.order_id).toLocaleDateString("default", {
				month: "short",
				day: "numeric"
			});
			if (dayStr === todayStr) todaysOrders++;
			if (dailyOrders[dayStr] !== void 0) dailyOrders[dayStr]++;
		});
		payments.forEach((p) => {
			const s = p.payment_status?.toUpperCase();
			if (s === "SUCCESS" || s === "COMPLETED") {
				totalRevenue += Number(p.amount || 0);
				let date = null;
				if (p.payment_time) {
					const parsed = new Date(p.payment_time);
					if (!isNaN(parsed.getTime())) date = parsed;
				}
				if (!date && p.payment_id && p.payment_id.includes("-")) {
					const ts = parseInt(p.payment_id.split("-")[1], 10);
					if (!isNaN(ts) && ts > 0xe8d4a51000) date = new Date(ts);
				}
				if (!date && p.order_id && p.order_id.includes("-")) {
					const ts = parseInt(p.order_id.split("-")[1], 10);
					if (!isNaN(ts) && ts > 0xe8d4a51000) date = new Date(ts);
				}
				if (!date) date = /* @__PURE__ */ new Date();
				const dayStr = date.toLocaleDateString("default", {
					month: "short",
					day: "numeric"
				});
				if (dailyRev[dayStr] !== void 0) dailyRev[dayStr] += Number(p.amount || 0);
				else dailyRev[dayStr] = (dailyRev[dayStr] || 0) + Number(p.amount || 0);
			}
		});
		const revenueByDay = Object.keys(dailyRev).sort((a, b) => (/* @__PURE__ */ new Date(`${a} ${(/* @__PURE__ */ new Date()).getFullYear()}`)).getTime() - (/* @__PURE__ */ new Date(`${b} ${(/* @__PURE__ */ new Date()).getFullYear()}`)).getTime()).map((m) => ({
			m,
			r: dailyRev[m]
		}));
		const ordersByDay = Object.keys(dailyOrders).sort((a, b) => (/* @__PURE__ */ new Date(`${a} ${(/* @__PURE__ */ new Date()).getFullYear()}`)).getTime() - (/* @__PURE__ */ new Date(`${b} ${(/* @__PURE__ */ new Date()).getFullYear()}`)).getTime()).map((d) => ({
			d,
			o: dailyOrders[d]
		}));
		return {
			totalRevenue,
			todaysOrders,
			activeCustomers: uniqueCustomers.size,
			revenueByDay,
			ordersByDay
		};
	}, [orders]);
	const KPIS = [
		{
			l: "Total revenue",
			v: `₹${dashboardData.totalRevenue.toLocaleString()}`,
			i: IndianRupee,
			tone: "text-success"
		},
		{
			l: "Total orders",
			v: orders.length.toLocaleString(),
			i: ShoppingBag,
			tone: "text-success"
		},
		{
			l: "Today's orders",
			v: dashboardData.todaysOrders.toString(),
			i: TrendingUp,
			tone: "text-success"
		},
		{
			l: "Active customers",
			v: dashboardData.activeCustomers.toLocaleString(),
			i: Users,
			tone: "text-success"
		}
	];
	const lowStock = (0, import_react.useMemo)(() => {
		return inventory.filter((inv) => inv.available_stock >= 0 && inv.available_stock < 20).map((inv) => {
			const product = products.find((p) => p.product_id === inv.product_id);
			return {
				inventory_id: inv.inventory_id,
				product_id: inv.product_id,
				product_name: product?.product_name || `Product ${inv.product_id.substring(0, 8)}`,
				stock: inv.available_stock,
				original_product: product
			};
		});
	}, [inventory, products]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Real-time overview of Angadi Hub operations"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: KPIS.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: i * .05 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-start justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.i, { className: "h-4 w-4" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 text-2xl font-bold tracking-tight",
									children: k.v
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: k.l
								})
							]
						})
					})
				}, k.l))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center justify-between",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Revenue"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Last 7 days"
							})] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: dashboardData.revenueByDay,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
											id: "rev",
											x1: "0",
											y1: "0",
											x2: "0",
											y2: "1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "0%",
												stopColor: "var(--color-primary)",
												stopOpacity: .5
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
												offset: "100%",
												stopColor: "var(--color-primary)",
												stopOpacity: 0
											})]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "m",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false,
											tickFormatter: (val) => `₹${val}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: 8
										} }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
											type: "monotone",
											dataKey: "r",
											stroke: "var(--color-primary)",
											strokeWidth: 2,
											fill: "url(#rev)"
										})
									]
								})
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Orders this week"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-64",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: dashboardData.ordersByDay,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											vertical: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "d",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											cursor: { fill: "var(--color-muted)" },
											contentStyle: {
												background: "var(--color-card)",
												border: "1px solid var(--color-border)",
												borderRadius: 8
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "o",
											name: "Orders",
											fill: "var(--color-chart-2)",
											radius: [
												6,
												6,
												0,
												0
											]
										})
									]
								})
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Latest orders"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "Live"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 divide-y divide-border",
							children: [[...orders].reverse().slice(0, 5).map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: o.order_id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: o.customer_id
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: o.order_status === "Delivered" ? "default" : o.order_status === "Cancelled" ? "destructive" : "secondary",
										children: o.order_status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold",
										children: ["₹", o.total_amount.toFixed(2)]
									})
								]
							}, o.order_id)), orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground py-4",
								children: "No recent orders found."
							})]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Low stock alerts"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 space-y-3",
							children: [lowStock.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 group",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 truncate text-sm",
										children: p.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "bg-warning/10 text-warning shrink-0",
										children: p.stock
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-6 text-[10px] px-2 opacity-0 transition-opacity group-hover:opacity-100 shrink-0",
										onClick: () => addStockMutation.mutate(p),
										disabled: addStockMutation.isPending,
										children: "+100"
									})
								]
							}, p.product_id)), lowStock.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "All good."
							})]
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
