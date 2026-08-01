import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { A as Package, d as TriangleAlert, lt as Bell, tt as CircleCheck, z as LoaderCircle } from "./_libs/lucide-react.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.notifications-BTMvUle4.js
var import_jsx_runtime = require_jsx_runtime();
function NotificationsPage() {
	const { data: productsRes, isLoading: isLoadingProducts } = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => api.products.list()
	});
	const { data: ordersRes, isLoading: isLoadingOrders } = useQuery({
		queryKey: ["admin-orders"],
		queryFn: () => api.orders.list()
	});
	if (isLoadingProducts || isLoadingOrders) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl flex items-center justify-center py-20 text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }), " Fetching latest updates..."]
	});
	const products = productsRes?.data || [];
	const orders = ordersRes?.data || [];
	const notifications = [];
	for (const p of products) if (p.stock < 20) notifications.push({
		id: `low-stock-${p.product_id}`,
		i: TriangleAlert,
		tone: "text-warning bg-warning/10",
		t: "Low stock alert",
		d: `${p.product_name} (${p.stock} left)`,
		ts: Date.now() - Math.random() * 864e5,
		time: "Recent"
	});
	for (const o of orders) {
		const parts = o.order_id.split("-");
		let ts = Date.now() - Math.random() * 864e5;
		if (parts.length > 1) {
			const parsed = parseInt(parts[1], 10);
			if (!isNaN(parsed)) ts = parsed;
		}
		const diffMin = Math.floor((Date.now() - ts) / 6e4);
		let timeStr = "";
		if (diffMin < 60) timeStr = `${Math.max(1, diffMin)}m ago`;
		else if (diffMin < 1440) timeStr = `${Math.floor(diffMin / 60)}h ago`;
		else timeStr = `${Math.floor(diffMin / 1440)}d ago`;
		notifications.push({
			id: `new-order-${o.order_id}`,
			i: Package,
			tone: "text-primary bg-primary/10",
			t: "New order received",
			d: `${o.order_id} for $${o.total_amount.toFixed(2)}`,
			ts,
			time: timeStr
		});
		if (o.order_status === "Delivered") notifications.push({
			id: `delivered-${o.order_id}`,
			i: CircleCheck,
			tone: "text-success bg-success/10",
			t: "Order delivered",
			d: `${o.order_id} has been delivered to customer`,
			ts: ts + 864e5,
			time: timeStr
		});
	}
	notifications.push({
		id: "system-1",
		i: Bell,
		tone: "text-muted-foreground bg-muted",
		t: "System deploy",
		d: "Angadi Hub Architecture updated to use Microservices",
		ts: 0,
		time: "System"
	});
	notifications.sort((a, b) => b.ts - a.ts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Notifications"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border",
					children: [notifications.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-4 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `flex h-9 w-9 items-center justify-center rounded-lg ${n.tone}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.i, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: n.t
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm text-muted-foreground",
									children: n.d
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: n.time
							})
						]
					}, n.id)), notifications.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-8 text-center text-muted-foreground",
						children: "You have no notifications."
					})]
				})
			})
		})]
	});
}
//#endregion
export { NotificationsPage as component };
