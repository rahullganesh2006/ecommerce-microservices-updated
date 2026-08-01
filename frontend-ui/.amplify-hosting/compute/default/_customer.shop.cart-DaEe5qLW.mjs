import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { E as Plus, N as Minus, dt as ArrowRight, p as Trash2, v as ShoppingBag } from "./_libs/lucide-react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as AnimatePresence, t as motion } from "./_libs/framer-motion.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as useCart } from "./_ssr/cart-store-D2Bmtscz.mjs";
import { t as Separator } from "./_ssr/separator-CUD9g08h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.cart-DaEe5qLW.js
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const items = useCart((s) => s.items);
	const setQty = useCart((s) => s.setQty);
	const remove = useCart((s) => s.remove);
	const subtotal = useCart((s) => s.subtotal());
	const gst = subtotal * .18;
	const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15;
	const total = subtotal + gst + shipping;
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-7 w-7 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Your cart is empty"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Add products to see them here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6 bg-gradient-brand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop/products",
					children: "Browse products"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-2xl font-semibold tracking-tight",
			children: "Shopping cart"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: items.map((i) => {
				const pId = i.product.product_id || i.product.id;
				const pName = i.product.product_name || i.product.name;
				const pImage = i.product.image_url || i.product.image;
				const pPrice = i.product.price;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					layout: true,
					initial: {
						opacity: 0,
						y: 8
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						x: -20
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "shadow-soft",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "flex gap-4 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: pImage,
									alt: pName,
									className: "h-24 w-24 rounded-lg object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: "Product"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium",
											children: pName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 text-sm font-semibold",
											children: ["₹", pPrice]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center rounded-lg border border-border",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-8 w-8",
														onClick: () => setQty(pId, i.qty - 1),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "w-8 text-center text-sm",
														children: i.qty
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														size: "icon",
														variant: "ghost",
														className: "h-8 w-8",
														onClick: () => setQty(pId, i.qty + 1),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "ghost",
												className: "text-muted-foreground hover:text-destructive",
												onClick: () => remove(pId),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1 h-3.5 w-3.5" }), " Remove"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right font-semibold",
									children: ["₹", (pPrice * i.qty).toFixed(2)]
								})
							]
						})
					})
				}, pId);
			}) })
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "h-fit shadow-soft lg:sticky lg:top-24",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-semibold",
						children: "Order summary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 space-y-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Subtotal"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", subtotal.toFixed(2)] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "GST (18%)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", gst.toFixed(2)] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Shipping"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}` })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-base font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", total.toFixed(2)] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6 w-full bg-gradient-brand shadow-soft hover:shadow-elegant",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop/checkout",
							children: ["Checkout ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-center text-xs text-muted-foreground",
						children: "Secure payment via AWS Payment Service"
					})
				]
			})
		})]
	});
}
//#endregion
export { CartPage as component };
