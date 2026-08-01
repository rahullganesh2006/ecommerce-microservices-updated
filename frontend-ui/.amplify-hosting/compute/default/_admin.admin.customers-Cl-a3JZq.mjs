import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as AvatarFallback, t as Avatar } from "./_ssr/avatar-CcHbQ4nc.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./_ssr/table-DJOO1b-0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.customers-Cl-a3JZq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const { data: response, isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: () => api.orders.list()
	});
	const groupedCustomers = (0, import_react.useMemo)(() => {
		const groups = (response?.data || []).reduce((acc, order) => {
			const email = order.customer_id;
			if (!acc[email]) acc[email] = {
				email,
				name: email.split("@")[0],
				orders: 0,
				spent: 0,
				joined: "Recently"
			};
			acc[email].orders += 1;
			acc[email].spent += order.total_amount;
			return acc;
		}, {});
		return Object.values(groups).sort((a, b) => b.spent - a.spent);
	}, [response]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Customers"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [isLoading ? "..." : groupedCustomers.length, " Active users"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total Orders" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Lifetime spend" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Joined" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 4,
				className: "text-center py-8 text-muted-foreground border-dashed border",
				children: "Loading customers..."
			}) }) : groupedCustomers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 4,
				className: "text-center py-8 text-muted-foreground border-dashed border",
				children: "No customers found"
			}) }) : groupedCustomers.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						className: "h-8 w-8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
							className: "bg-gradient-brand text-xs text-primary-foreground",
							children: c.name.substring(0, 2).toUpperCase()
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: c.email
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.orders }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", c.spent.toLocaleString()] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground",
					children: c.joined
				})
			] }, c.email)) })] })
		})
	})] });
}
//#endregion
export { AdminCustomers as component };
