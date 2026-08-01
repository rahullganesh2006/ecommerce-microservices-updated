import { o as __toESM } from "./_runtime.mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { A as Package, Q as Clock, X as Download, tt as CircleCheck, u as Truck } from "./_libs/lucide-react.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.orders-DOGMlUon.js
var import_jsx_runtime = require_jsx_runtime();
async function downloadInvoice(order, customerEmail) {
	const { default: jsPDF } = await import("./_libs/jspdf.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const { default: autoTable } = await import("./_libs/jspdf-autotable.mjs").then((n) => n.t);
	const doc = new jsPDF();
	doc.setFillColor(23, 23, 23);
	doc.rect(0, 0, 210, 40, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFontSize(24);
	doc.setFont("helvetica", "bold");
	doc.text("CloudCart.", 14, 25);
	doc.setFontSize(10);
	doc.setFont("helvetica", "normal");
	doc.text("INVOICE", 170, 25);
	doc.setTextColor(40, 40, 40);
	doc.setFontSize(10);
	doc.setFont("helvetica", "bold");
	doc.text("Invoice To:", 14, 55);
	doc.setFont("helvetica", "normal");
	doc.text(customerEmail, 14, 62);
	doc.text(`Shipping Address: ${order.shipping_address || "N/A"}`, 14, 69);
	doc.setFont("helvetica", "bold");
	doc.text("Order ID:", 130, 55);
	doc.text("Order Date:", 130, 62);
	doc.text("Status:", 130, 69);
	doc.setFont("helvetica", "normal");
	doc.text(order.order_id, 160, 55);
	const orderDate = new Date(parseInt(order.order_id.split("-")[1] || "0")).toLocaleDateString();
	doc.text(orderDate !== "Invalid Date" ? orderDate : "N/A", 160, 62);
	doc.text(order.order_status, 160, 69);
	autoTable(doc, {
		startY: 85,
		head: [[
			"#",
			"Item Description",
			"Qty",
			"Unit Price",
			"Total"
		]],
		body: order.items.map((item, idx) => [
			(idx + 1).toString(),
			item.product_name || item.product_id,
			item.quantity.toString(),
			`$${item.unit_price.toFixed(2)}`,
			`$${(item.quantity * item.unit_price).toFixed(2)}`
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
		},
		styles: {
			fontSize: 9,
			cellPadding: 5
		},
		columnStyles: {
			0: { cellWidth: 10 },
			1: { cellWidth: 80 },
			2: {
				cellWidth: 20,
				halign: "center"
			},
			3: {
				cellWidth: 30,
				halign: "right"
			},
			4: {
				cellWidth: 40,
				halign: "right"
			}
		}
	});
	const finalY = doc.lastAutoTable.finalY + 10;
	doc.setFontSize(10);
	doc.text("Subtotal:", 130, finalY);
	doc.text("Tax (18%):", 130, finalY + 7);
	doc.setFont("helvetica", "bold");
	doc.text("Grand Total:", 130, finalY + 15);
	const subtotal = order.items.reduce((acc, i) => acc + i.unit_price * i.quantity, 0);
	const tax = subtotal * .18;
	const grand = subtotal + tax + (subtotal > 500 ? 0 : 15);
	doc.setFont("helvetica", "normal");
	doc.text(`$${subtotal.toFixed(2)}`, 190, finalY, { align: "right" });
	doc.text(`$${tax.toFixed(2)}`, 190, finalY + 7, { align: "right" });
	doc.setFont("helvetica", "bold");
	doc.text(`$${grand.toFixed(2)}`, 190, finalY + 15, { align: "right" });
	doc.setFont("helvetica", "italic");
	doc.setFontSize(8);
	doc.setTextColor(150, 150, 150);
	doc.text("Thank you for your business!", 105, 280, { align: "center" });
	doc.save(`Invoice_${order.order_id}.pdf`);
}
var STATUS_ICON = {
	Placed: Clock,
	Processing: Package,
	Delivered: CircleCheck,
	Cancelled: Clock
};
function formatOrderDate(order_id) {
	const parts = order_id.split("-");
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
function OrdersPage() {
	const user = useAuth((s) => s.user);
	const { data: response, isLoading } = useQuery({
		queryKey: ["orders"],
		queryFn: () => api.orders.list()
	});
	const myOrders = (response?.data || []).filter((o) => o.customer_id === user?.email).sort((a, b) => b.order_id.localeCompare(a.order_id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-6 text-2xl font-semibold tracking-tight",
		children: "Your orders"
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground border border-dashed rounded-xl",
		children: "Loading your orders..."
	}) : myOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground border border-dashed rounded-xl",
		children: "You have no active orders."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: myOrders.map((o, index) => {
			const Icon = STATUS_ICON[o.order_status] || Package;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				initial: {
					opacity: 0,
					y: 20
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: {
					duration: .4,
					delay: index * .1,
					ease: "easeOut"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft transition hover:shadow-elegant",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-wrap items-center gap-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: o.order_id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: formatOrderDate(o.order_id)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 flex flex-col gap-0.5",
										children: o.items?.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-foreground/80",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold",
													children: [item.quantity, "x"]
												}),
												" ",
												item.product_name || item.product_id
											]
										}, idx))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: o.order_status === "Delivered" ? "default" : o.order_status === "Cancelled" ? "destructive" : "secondary",
								children: o.order_status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-sm font-semibold",
									children: ["₹", o.total_amount]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => downloadInvoice(o, user?.email || ""),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), " Invoice"]
							})
						]
					}), o.order_status !== "Cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border px-5 py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2 text-xs",
							children: [
								"Ordered",
								"Packed",
								"Shipped",
								"Delivered"
							].map((s, i) => {
								let currentStep = 0;
								if (o.order_status === "Processing") currentStep = 1;
								if (o.order_status === "Shipped") currentStep = 2;
								if (o.order_status === "Delivered") currentStep = 3;
								const isCompleted = i <= currentStep;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-1 items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-2 rounded-full ${isCompleted ? "bg-primary" : "bg-muted"}` }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: isCompleted ? "text-foreground" : "text-muted-foreground",
											children: s
										}),
										i < 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "relative h-px flex-1 overflow-hidden bg-muted",
											children: i < currentStep && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
												className: "absolute inset-0 bg-primary",
												initial: { x: "-100%" },
												animate: { x: 0 },
												transition: {
													duration: .8,
													delay: .2 + index * .1
												}
											})
										})
									]
								}, s);
							})
						}), o.order_status !== "Delivered" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-1.5 text-xs text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3.5 w-3.5" }), " Expected delivery: 2-3 days"]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border px-5 py-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-destructive",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-2 w-2 rounded-full bg-destructive" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Order Cancelled" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-destructive/20" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Refund initiated"
								})
							]
						})
					})]
				})
			}, o.order_id);
		})
	})] });
}
//#endregion
export { OrdersPage as component };
