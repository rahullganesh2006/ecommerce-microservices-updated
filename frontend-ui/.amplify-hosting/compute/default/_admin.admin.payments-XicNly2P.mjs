import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { Z as CreditCard, et as CircleX, it as ChevronDown, rt as ChevronRight, tt as CircleCheck, w as RefreshCcw } from "./_libs/lucide-react.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./_ssr/table-DJOO1b-0.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.payments-XicNly2P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatPaymentDate(payment_id, payment_time) {
	if (payment_time) try {
		const d = new Date(payment_time);
		if (!isNaN(d.getTime())) return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	} catch (e) {}
	const parts = payment_id.split("-");
	if (parts.length > 1) {
		const ts = parseInt(parts[1], 10);
		if (!isNaN(ts)) return new Date(ts).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric"
		});
	}
	return "Unknown date";
}
function AdminPayments() {
	const { data: response, isLoading: loadingPayments } = useQuery({
		queryKey: ["payments"],
		queryFn: () => api.payments.list()
	});
	const { data: ordersResponse, isLoading: loadingOrders } = useQuery({
		queryKey: ["orders"],
		queryFn: () => api.orders.list()
	});
	const isLoading = loadingPayments || loadingOrders;
	const orders = ordersResponse?.data || [];
	const [expanded, setExpanded] = (0, import_react.useState)({});
	const toggleRow = (id) => setExpanded((prev) => ({
		...prev,
		[id]: !prev[id]
	}));
	const payments = (0, import_react.useMemo)(() => {
		return [...response?.data || []].sort((a, b) => {
			const timeA = a.payment_time ? new Date(a.payment_time).getTime() : 0;
			const timeB = b.payment_time ? new Date(b.payment_time).getTime() : 0;
			if (timeA && timeB && timeA !== timeB) return timeB - timeA;
			return b.payment_id.localeCompare(a.payment_id);
		});
	}, [response]);
	const success = payments.filter((p) => {
		const s = p.payment_status?.toUpperCase();
		return s === "SUCCESS" || s === "COMPLETED";
	});
	const failed = payments.filter((p) => p.payment_status?.toUpperCase() === "FAILED");
	const revenue = success.reduce((n, p) => n + Number(p.amount || 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Payments"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Payment Service · transaction ledger"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-3",
			children: [
				{
					l: "Revenue",
					v: `₹${revenue.toFixed(2)}`,
					i: CreditCard,
					tone: "text-primary bg-primary/10"
				},
				{
					l: "Successful",
					v: isLoading ? "..." : success.length,
					i: CircleCheck,
					tone: "text-success bg-success/10"
				},
				{
					l: "Failed",
					v: isLoading ? "..." : failed.length,
					i: CircleX,
					tone: "text-destructive bg-destructive/10"
				}
			].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "shadow-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-9 w-9 items-center justify-center rounded-lg ${k.tone}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.i, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 text-2xl font-bold",
							children: k.v
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: k.l
						})
					]
				})
			}, k.l))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payment ID" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Amount" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "text-center py-8 text-muted-foreground border-dashed border",
					children: "Loading payments..."
				}) }) : payments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "text-center py-8 text-muted-foreground border-dashed border",
					children: "No payments found"
				}) }) : payments.map((p) => {
					const isExpanded = expanded[p.payment_id];
					const order = orders.find((o) => o.order_id === p.order_id);
					const hasItems = order && order.items && order.items.length > 0;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: hasItems ? "cursor-pointer hover:bg-muted/50 transition-colors" : "",
						onClick: () => hasItems && toggleRow(p.payment_id),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [hasItems ? isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-sm",
									children: p.payment_id
								})]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "text-muted-foreground",
								children: p.order_id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.payment_method }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", p.amount] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatPaymentDate(p.payment_id, p.payment_time) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: p.payment_status?.toUpperCase() === "SUCCESS" || p.payment_status?.toUpperCase() === "COMPLETED" ? "default" : p.payment_status?.toUpperCase() === "FAILED" ? "destructive" : "secondary",
								children: [p.payment_status?.toUpperCase() === "REFUNDED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCcw, { className: "mr-1 h-3 w-3" }), p.payment_status]
							}) })
						]
					}), isExpanded && hasItems && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
						className: "bg-muted/10 hover:bg-muted/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							colSpan: 6,
							className: "p-0 border-b",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-10 py-5 border-l-2 border-primary ml-4 my-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full max-w-2xl",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-[1fr_80px_100px] gap-4 mb-3 pb-2 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Item" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center",
													children: "Qty"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-right",
													children: "Total"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-3",
											children: order.items.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-[1fr_80px_100px] gap-4 text-sm items-center",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-foreground",
														children: item.product_name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-center text-muted-foreground",
														children: item.quantity
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-right tabular-nums text-muted-foreground",
														children: ["₹", (item.unit_price * item.quantity).toFixed(2)]
													})
												]
											}, idx))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-[1fr_100px] gap-4 mt-5 pt-3 border-t",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-right text-muted-foreground font-medium uppercase tracking-wider text-[10px] flex items-center justify-end",
												children: "Transaction Total"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right font-bold tabular-nums text-base",
												children: ["₹", p.amount]
											})]
										})
									]
								})
							})
						})
					})] }, p.payment_id);
				}) })] })
			})
		})
	] });
}
//#endregion
export { AdminPayments as component };
