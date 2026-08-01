import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { J as FileText, X as Download, ct as Calendar, r as X } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.reports-Bo-Kiihf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function downloadInventoryReport(products) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 30, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Inventory Snapshot", 14, 20);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 40);
	doc.text(`Total Products: ${products.length}`, 14, 47);
	autoTable(doc, {
		startY: 55,
		head: [[
			"Product ID",
			"Name",
			"Unit Price",
			"Available Stock"
		]],
		body: products.map((p) => [
			p.product_id,
			p.product_name,
			`$${p.price.toFixed(2)}`,
			p.stock.toString()
		]),
		theme: "striped",
		headStyles: {
			fillColor: [
				23,
				23,
				23
			],
			textColor: [
				255,
				255,
				255
			]
		}
	});
	doc.save("Inventory_Report.pdf");
}
async function downloadOrdersReport(orders) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 30, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Orders Export", 14, 20);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 40);
	doc.text(`Total Orders: ${orders.length}`, 14, 47);
	autoTable(doc, {
		startY: 55,
		head: [[
			"Order ID",
			"Customer",
			"Status",
			"Amount"
		]],
		body: orders.map((o) => [
			o.order_id,
			o.customer_id,
			o.order_status,
			`$${o.total_amount.toFixed(2)}`
		]),
		theme: "striped",
		headStyles: {
			fillColor: [
				23,
				23,
				23
			],
			textColor: [
				255,
				255,
				255
			]
		}
	});
	doc.save("Orders_Report.pdf");
}
async function downloadRevenueReport(orders) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 30, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Revenue Report", 14, 20);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 40);
	let totalRevenue = 0;
	let deliveredRevenue = 0;
	orders.forEach((o) => {
		if (o.order_status !== "Cancelled") totalRevenue += o.total_amount;
		if (o.order_status === "Delivered") deliveredRevenue += o.total_amount;
	});
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text(`Total Gross Revenue: $${totalRevenue.toFixed(2)}`, 14, 55);
	doc.text(`Realized (Delivered) Revenue: $${deliveredRevenue.toFixed(2)}`, 14, 63);
	autoTable(doc, {
		startY: 75,
		head: [[
			"Order ID",
			"Amount",
			"Status"
		]],
		body: orders.filter((o) => o.order_status !== "Cancelled").map((o) => [
			o.order_id,
			`$${o.total_amount.toFixed(2)}`,
			o.order_status
		]),
		theme: "striped",
		headStyles: {
			fillColor: [
				23,
				23,
				23
			],
			textColor: [
				255,
				255,
				255
			]
		}
	});
	doc.save("Revenue_Report.pdf");
}
async function downloadCustomerSegmentsReport(orders) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 30, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Customer Segments", 14, 20);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 40);
	const customers = {};
	orders.forEach((o) => {
		if (o.order_status !== "Cancelled") {
			if (!customers[o.customer_id]) customers[o.customer_id] = {
				spent: 0,
				count: 0
			};
			customers[o.customer_id].spent += o.total_amount;
			customers[o.customer_id].count += 1;
		}
	});
	const sortedCustomers = Object.entries(customers).sort((a, b) => b[1].spent - a[1].spent);
	doc.text(`Total Active Customers: ${sortedCustomers.length}`, 14, 47);
	autoTable(doc, {
		startY: 55,
		head: [[
			"Customer Email",
			"Total Orders",
			"Total Spent",
			"Segment"
		]],
		body: sortedCustomers.map(([email, data]) => [
			email,
			data.count.toString(),
			`$${data.spent.toFixed(2)}`,
			data.spent > 500 ? "VIP" : data.spent > 100 ? "Regular" : "New"
		]),
		theme: "striped",
		headStyles: {
			fillColor: [
				23,
				23,
				23
			],
			textColor: [
				255,
				255,
				255
			]
		}
	});
	doc.save("Customer_Segments_Report.pdf");
}
async function downloadRefundsReport(orders) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 30, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Refunds & Cancellations", 14, 20);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 40);
	const cancelledOrders = orders.filter((o) => o.order_status === "Cancelled");
	let totalRefunded = 0;
	cancelledOrders.forEach((o) => {
		totalRefunded += o.total_amount;
	});
	doc.setFontSize(12);
	doc.setFont("helvetica", "bold");
	doc.text(`Total Amount Refunded: $${totalRefunded.toFixed(2)}`, 14, 55);
	autoTable(doc, {
		startY: 65,
		head: [[
			"Order ID",
			"Customer",
			"Refund Amount",
			"Status"
		]],
		body: cancelledOrders.map((o) => [
			o.order_id,
			o.customer_id,
			`$${o.total_amount.toFixed(2)}`,
			"Refund Initiated"
		]),
		theme: "striped",
		headStyles: {
			fillColor: [
				23,
				23,
				23
			],
			textColor: [
				255,
				255,
				255
			]
		}
	});
	doc.save("Refunds_Report.pdf");
}
async function downloadPaymentReconciliationReport(payments) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 30, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Payment Reconciliation", 14, 20);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text(`Generated on: ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 40);
	doc.text(`Total Processed Payments: ${payments.length}`, 14, 47);
	autoTable(doc, {
		startY: 55,
		head: [[
			"Payment ID",
			"Order ID",
			"Method",
			"Status",
			"Amount"
		]],
		body: payments.map((p) => [
			p.payment_id,
			p.order_id,
			p.payment_method,
			p.payment_status || "Completed",
			`$${p.amount.toFixed(2)}`
		]),
		theme: "striped",
		headStyles: {
			fillColor: [
				23,
				23,
				23
			],
			textColor: [
				255,
				255,
				255
			]
		}
	});
	doc.save("Payment_Reconciliation_Report.pdf");
}
function extractDateObj(id) {
	const parts = id.split("-");
	if (parts.length > 1) {
		const ts = parseInt(parts[1], 10);
		if (!isNaN(ts)) return new Date(ts);
	}
	return null;
}
function ReportsPage() {
	const { data: productsRes } = useQuery({
		queryKey: ["admin-products"],
		queryFn: () => api.products.list()
	});
	const { data: ordersRes } = useQuery({
		queryKey: ["admin-orders"],
		queryFn: () => api.orders.list()
	});
	const { data: paymentsRes } = useQuery({
		queryKey: ["admin-payments"],
		queryFn: () => api.payments.list()
	});
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const handleDownload = async (type) => {
		try {
			let filteredOrders = ordersRes?.data || [];
			let filteredPayments = paymentsRes?.data || [];
			if (startDate || endDate) {
				const matchDate = (id) => {
					const d = extractDateObj(id);
					if (!d) return false;
					const itemTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
					let pass = true;
					if (startDate) {
						const s = new Date(startDate);
						if (itemTime < new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime()) pass = false;
					}
					if (endDate) {
						const e = new Date(endDate);
						if (itemTime > new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime()) pass = false;
					}
					return pass;
				};
				filteredOrders = filteredOrders.filter((o) => matchDate(o.order_id));
				filteredPayments = filteredPayments.filter((p) => matchDate(p.payment_id));
			}
			if (type === "Revenue report") {
				if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
				await downloadRevenueReport(filteredOrders);
			} else if (type === "Orders export") {
				if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
				await downloadOrdersReport(filteredOrders);
			} else if (type === "Inventory snapshot") {
				if (!productsRes?.data) throw new Error("Data still loading, please wait...");
				await downloadInventoryReport(productsRes.data);
			} else if (type === "Customer segments") {
				if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
				await downloadCustomerSegmentsReport(filteredOrders);
			} else if (type === "Refunds") {
				if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
				await downloadRefundsReport(filteredOrders);
			} else if (type === "Payment reconciliation") {
				if (!paymentsRes?.data) throw new Error("Data still loading, please wait...");
				await downloadPaymentReconciliationReport(filteredPayments);
			} else {
				toast.info(`${type} generation is not supported yet.`);
				return;
			}
			toast.success(`${type} downloaded successfully`);
		} catch (e) {
			toast.error(e.message || "Failed to download report");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-end justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Reports"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Export operational and financial reports"
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
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
		children: [
			"Revenue report",
			"Orders export",
			"Inventory snapshot",
			"Customer segments",
			"Payment reconciliation",
			"Refunds"
		].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 font-medium",
						children: t
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Generated dynamically · PDF Format"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "mt-4",
						onClick: () => handleDownload(t),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), " Download PDF"]
					})
				]
			})
		}, t))
	})] });
}
//#endregion
export { ReportsPage as component };
