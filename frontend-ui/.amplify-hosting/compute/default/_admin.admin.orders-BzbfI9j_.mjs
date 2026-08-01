import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { ct as Calendar, r as X } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./_ssr/table-DJOO1b-0.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-BgKcOzjx.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BHv1JhlL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.orders-BzbfI9j_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function getOrderDateObj(order_id) {
	const parts = order_id.split("-");
	if (parts.length > 1) {
		const ts = parseInt(parts[1], 10);
		if (!isNaN(ts)) return new Date(ts);
	}
	return null;
}
function formatOrderDate(order_id) {
	const d = getOrderDateObj(order_id);
	return d ? d.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric"
	}) : "Unknown date";
}
var VALID_TRANSITIONS = {
	"Placed": ["Processing", "Cancelled"],
	"Processing": ["Shipped", "Cancelled"],
	"Shipped": ["Delivered"],
	"Delivered": [],
	"Cancelled": []
};
var STATUS_STYLES = {
	"Placed": "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20 hover:bg-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20",
	"Processing": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
	"Shipped": "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20",
	"Delivered": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
	"Cancelled": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
};
function OrderTable({ list, isLoading }) {
	const queryClient = useQueryClient();
	const updateStatus = useMutation({
		mutationFn: (params) => api.orders.update(params.id, { order_status: params.status }),
		onSuccess: () => {
			toast.success("Order status updated");
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		},
		onError: (err) => {
			let msg = err.message || "Failed to update order status";
			try {
				if (msg.includes("API 400:")) {
					const jsonStr = msg.split("API 400: ")[1];
					const parsed = JSON.parse(jsonStr);
					if (parsed.detail) msg = parsed.detail;
				}
			} catch (e) {}
			toast.error(msg);
		}
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-8 text-center text-muted-foreground border border-dashed rounded-xl mt-4",
		children: "Loading orders..."
	});
	if (list.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-8 text-center text-muted-foreground border border-dashed rounded-xl mt-4",
		children: "No orders found"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
		className: "mt-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Items" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: list.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: o.order_id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [o.customer_id.split("@")[0], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: o.customer_id
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatOrderDate(o.order_id) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-1 py-1",
				children: o.items?.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs whitespace-nowrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-semibold text-foreground",
							children: [item.quantity, "x"]
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: item.product_name || item.product_id
						})
					]
				}, idx))
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", o.total_amount] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				defaultValue: o.order_status,
				onValueChange: (val) => updateStatus.mutate({
					id: o.order_id,
					status: val
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: `w-[110px] h-7 px-2.5 text-[11px] font-medium ${STATUS_STYLES[o.order_status || "Placed"] || "bg-muted"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
					"Placed",
					"Processing",
					"Shipped",
					"Delivered",
					"Cancelled"
				].map((val) => {
					const currentStatus = o.order_status || "Placed";
					const allowed = VALID_TRANSITIONS[currentStatus] || [];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: val,
						disabled: !(val === currentStatus || allowed.includes(val)),
						className: "font-medium cursor-pointer",
						children: val
					}, val);
				}) })]
			}) })
		] }, o.order_id)) })]
	});
}
function AdminOrders() {
	const { data: response, isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: () => api.orders.list()
	});
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const orders = (response?.data || []).filter((o) => {
		if (!startDate && !endDate) return true;
		const oDate = getOrderDateObj(o.order_id);
		if (!oDate) return false;
		const orderTime = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate()).getTime();
		let pass = true;
		if (startDate) {
			const s = new Date(startDate);
			if (orderTime < new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime()) pass = false;
		}
		if (endDate) {
			const e = new Date(endDate);
			if (orderTime > new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime()) pass = false;
		}
		return pass;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-end justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Orders"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"Order Service · ",
				isLoading ? "..." : orders.length,
				" total"
			]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						className: "pl-9 w-[140px] cursor-pointer",
						value: startDate,
						onChange: (e) => setStartDate(e.target.value),
						onClick: (e) => "showPicker" in HTMLInputElement.prototype && e.currentTarget.showPicker(),
						title: "Start Date"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted-foreground text-sm",
					children: "to"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						className: "pl-9 w-[140px] cursor-pointer",
						value: endDate,
						onChange: (e) => setEndDate(e.target.value),
						onClick: (e) => "showPicker" in HTMLInputElement.prototype && e.currentTarget.showPicker(),
						title: "End Date"
					})]
				}),
				(startDate || endDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					onClick: () => {
						setStartDate("");
						setEndDate("");
					},
					title: "Clear filter",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})
			]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "all",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "all",
							children: "All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "Placed",
							children: "Placed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "Processing",
							children: "Processing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "Delivered",
							children: "Delivered"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "Cancelled",
							children: "Cancelled"
						})
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTable, {
							list: orders,
							isLoading
						})
					}),
					[
						"Placed",
						"Processing",
						"Delivered",
						"Cancelled"
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: s,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderTable, {
							list: orders.filter((o) => o.order_status === s),
							isLoading
						})
					}, s))
				]
			})
		})
	})] });
}
//#endregion
export { AdminOrders as component };
