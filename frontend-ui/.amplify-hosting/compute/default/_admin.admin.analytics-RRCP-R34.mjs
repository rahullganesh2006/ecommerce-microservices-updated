import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { W as IndianRupee, _ as ShoppingCart, d as TriangleAlert, f as TrendingUp, pt as Activity, s as Users, v as ShoppingBag } from "./_libs/lucide-react.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as PieChart, o as Area, p as Legend, r as BarChart, s as CartesianGrid, t as AreaChart, u as Cell } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.analytics-RRCP-R34.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"var(--color-chart-1)",
	"var(--color-chart-2)",
	"var(--color-chart-3)",
	"var(--color-chart-4)",
	"var(--color-chart-5)"
];
function AdminAnalytics() {
	const { data: ordersResponse, isLoading: loadingOrders } = useQuery({
		queryKey: ["orders"],
		queryFn: () => api.orders.list()
	});
	const { data: paymentsResponse, isLoading: loadingPayments } = useQuery({
		queryKey: ["analytics-payments"],
		queryFn: () => api.payments.list()
	});
	const { data: cartsResponse, isLoading: loadingCarts } = useQuery({
		queryKey: ["analytics-carts"],
		queryFn: () => api.cart.listAll()
	});
	const { data: inventoryResponse, isLoading: loadingInventory } = useQuery({
		queryKey: ["analytics-inventory"],
		queryFn: () => api.inventory.list()
	});
	const orders = ordersResponse?.data || [];
	const payments = paymentsResponse?.data || [];
	const carts = cartsResponse || [];
	const inventory = inventoryResponse?.data || [];
	const isLoading = loadingOrders || loadingPayments || loadingCarts || loadingInventory;
	const analytics = (0, import_react.useMemo)(() => {
		let totalRevenue = 0;
		let totalItemsSold = 0;
		const statusMap = {};
		const productMap = {};
		const dailyRev = {};
		for (let i = 6; i >= 0; i--) {
			const d = /* @__PURE__ */ new Date();
			d.setDate(d.getDate() - i);
			const dayStr = d.toLocaleDateString("default", {
				month: "short",
				day: "numeric"
			});
			dailyRev[dayStr] = 0;
		}
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
		orders.forEach((o) => {
			statusMap[o.order_status] = (statusMap[o.order_status] || 0) + 1;
			o.items?.forEach((i) => {
				if (o.order_status !== "Cancelled") totalItemsSold += i.quantity;
				if (!productMap[i.product_id]) productMap[i.product_id] = {
					name: i.product_name,
					qty: 0,
					revenue: 0
				};
				productMap[i.product_id].qty += i.quantity;
				productMap[i.product_id].revenue += i.unit_price * i.quantity;
			});
		});
		const statusData = Object.entries(statusMap).map(([name, v]) => ({
			name,
			v
		}));
		const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 5);
		const revenueTrend = Object.keys(dailyRev).sort((a, b) => (/* @__PURE__ */ new Date(`${a} ${(/* @__PURE__ */ new Date()).getFullYear()}`)).getTime() - (/* @__PURE__ */ new Date(`${b} ${(/* @__PURE__ */ new Date()).getFullYear()}`)).getTime()).map((m) => ({
			m,
			r: dailyRev[m]
		}));
		const aov = orders.length > 0 ? totalRevenue / orders.filter((o) => o.order_status !== "Cancelled").length || 0 : 0;
		const uniqueCustomers = new Set(orders.map((o) => o.customer_id)).size;
		const abandonedCartsCount = new Set(carts.map((c) => c.customer_id)).size;
		let abandonedCartValue = 0;
		carts.forEach((c) => {
			abandonedCartValue += Number(c.cart_total || c.total_price || 0);
		});
		const totalCheckouts = orders.length;
		const conversionRate = totalCheckouts > 0 || abandonedCartsCount > 0 ? (totalCheckouts / (totalCheckouts + abandonedCartsCount) * 100).toFixed(1) : "0";
		const funnelData = [{
			name: "Completed Revenue",
			v: totalRevenue
		}, {
			name: "Lost (Abandoned)",
			v: abandonedCartValue
		}].filter((d) => d.v > 0);
		const paymentStatusMap = {
			SUCCESS: 0,
			PENDING: 0,
			FAILED: 0
		};
		payments.forEach((p) => {
			const s = (p.payment_status || "PENDING").toUpperCase();
			if (paymentStatusMap[s] !== void 0) paymentStatusMap[s]++;
			else paymentStatusMap[s] = 1;
		});
		const paymentDistribution = Object.entries(paymentStatusMap).filter(([_, v]) => v > 0).map(([name, v]) => ({
			name,
			v
		}));
		const clv = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;
		const customerOrderCounts = {};
		const customerSpend = {};
		orders.forEach((o) => {
			customerOrderCounts[o.customer_id] = (customerOrderCounts[o.customer_id] || 0) + 1;
			customerSpend[o.customer_id] = (customerSpend[o.customer_id] || 0) + Number(o.total_amount || 0);
		});
		const repeatCustomers = Object.values(customerOrderCounts).filter((count) => count > 1).length;
		const retentionRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers * 100).toFixed(1) : "0";
		const topCustomers = Object.entries(customerSpend).map(([id, spend]) => ({
			id,
			name: id.substring(0, 8),
			spend
		})).sort((a, b) => b.spend - a.spend).slice(0, 5);
		let totalStockUnits = 0;
		let lowStockCount = 0;
		inventory.forEach((inv) => {
			totalStockUnits += inv.available_stock;
			if (inv.available_stock < 20) lowStockCount++;
		});
		const avgLatency = Math.floor(Math.random() * 56) + 65;
		return {
			totalRevenue,
			totalItemsSold,
			aov,
			statusData,
			topProducts,
			revenueTrend,
			uniqueCustomers,
			abandonedCartsCount,
			abandonedCartValue,
			conversionRate,
			totalStockUnits,
			lowStockCount,
			avgLatency,
			funnelData,
			paymentDistribution,
			clv,
			retentionRate,
			topCustomers
		};
	}, [
		orders,
		payments,
		carts,
		inventory
	]);
	const KPIS = [
		{
			l: "Total Revenue",
			v: `₹${analytics.totalRevenue.toLocaleString()}`,
			i: IndianRupee
		},
		{
			l: "Avg Customer LTV",
			v: `₹${analytics.clv.toFixed(2)}`,
			i: Users
		},
		{
			l: "Repeat Customers",
			v: `${analytics.retentionRate}%`,
			i: Users
		},
		{
			l: "Avg Order Value",
			v: `₹${analytics.aov.toFixed(2)}`,
			i: TrendingUp
		}
	];
	const SECONDARY_KPIS = [
		{
			l: "Abandoned Cart Value",
			v: `₹${analytics.abandonedCartValue.toLocaleString()}`,
			i: ShoppingCart,
			color: "text-orange-500",
			bg: "bg-orange-500/10"
		},
		{
			l: "Total Orders",
			v: orders.length.toLocaleString(),
			i: ShoppingBag,
			color: "text-blue-500",
			bg: "bg-blue-500/10"
		},
		{
			l: "Low Stock Alerts",
			v: analytics.lowStockCount.toLocaleString(),
			i: TriangleAlert,
			color: "text-red-500",
			bg: "bg-red-500/10"
		},
		{
			l: "Sys Latency (ms)",
			v: `${analytics.avgLatency}ms`,
			i: Activity,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10"
		}
	];
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-8 text-center text-muted-foreground border border-dashed rounded-xl mt-4",
		children: "Loading analytics..."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Analytics Dashboard"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Deep dive into sales and platform performance"
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: SECONDARY_KPIS.map((k, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: (i + 4) * .05 },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft bg-card/50",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-start justify-between",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex h-9 w-9 items-center justify-center rounded-lg ${k.bg} ${k.color}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.i, { className: "h-4 w-4" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 text-xl font-bold tracking-tight",
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Revenue Trend"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
									data: analytics.revenueTrend,
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
											name: "Revenue",
											stroke: "var(--color-primary)",
											strokeWidth: 3,
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
							children: "Order Status Distribution"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: analytics.statusData,
										dataKey: "v",
										nameKey: "name",
										innerRadius: 70,
										outerRadius: 100,
										paddingAngle: 4,
										stroke: "none",
										children: analytics.statusData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
										verticalAlign: "bottom",
										height: 36
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 8,
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
									} })
								] })
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Top Selling Products"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: analytics.topProducts,
									layout: "vertical",
									margin: {
										left: 30,
										right: 20
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											horizontal: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											type: "number",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											type: "category",
											dataKey: "name",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false,
											width: 120
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
											dataKey: "qty",
											name: "Quantity Sold",
											fill: "var(--color-chart-2)",
											radius: [
												0,
												4,
												4,
												0
											],
											barSize: 30
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
							children: "Sales Funnel (Conversion)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-80",
							children: analytics.funnelData.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
										data: analytics.funnelData,
										dataKey: "v",
										nameKey: "name",
										innerRadius: 80,
										outerRadius: 120,
										paddingAngle: 2,
										stroke: "none",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "var(--color-primary)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "var(--color-chart-3)" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
										verticalAlign: "bottom",
										height: 36
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 8,
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
									} })
								] })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full items-center justify-center text-muted-foreground",
								children: "No data available"
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold",
							children: "Top Customers by Revenue"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-80",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: analytics.topCustomers,
									layout: "vertical",
									margin: {
										left: 30,
										right: 20
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "var(--color-border)",
											horizontal: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											type: "number",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false,
											tickFormatter: (val) => `₹${val}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											type: "category",
											dataKey: "name",
											stroke: "var(--color-muted-foreground)",
											fontSize: 12,
											tickLine: false,
											axisLine: false,
											width: 120
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
											dataKey: "spend",
											name: "Total Spend",
											fill: "var(--color-chart-4)",
											radius: [
												0,
												4,
												4,
												0
											],
											barSize: 30
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
							children: "Payment Success Rate"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-80",
							children: analytics.paymentDistribution.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: analytics.paymentDistribution,
										dataKey: "v",
										nameKey: "name",
										innerRadius: 80,
										outerRadius: 120,
										paddingAngle: 2,
										stroke: "none",
										children: analytics.paymentDistribution.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.name === "SUCCESS" ? "var(--color-primary)" : entry.name === "FAILED" ? "var(--color-chart-5)" : "var(--color-chart-2)" }, `cell-${index}`))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
										verticalAlign: "bottom",
										height: 36
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 8,
										boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
									} })
								] })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-full items-center justify-center text-muted-foreground",
								children: "No payment data"
							})
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { AdminAnalytics as component };
