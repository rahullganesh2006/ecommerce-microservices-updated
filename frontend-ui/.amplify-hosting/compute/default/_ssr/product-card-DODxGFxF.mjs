import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BprOe8gQ.mjs";
import { K as Heart, _ as ShoppingCart, m as Star } from "../_libs/lucide-react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as motion } from "../_libs/framer-motion.mjs";
import { t as api } from "./api-client-DDlHUadL.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as DialogContent, s as DialogTrigger, t as Dialog } from "./dialog-Y9HmOov6.mjs";
import { t as useCart } from "./cart-store-D2Bmtscz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-DODxGFxF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const add = useCart((s) => s.add);
	const wishlisted = useCart((s) => s.wishlist.includes(product.product_id));
	const toggleWish = useCart((s) => s.toggleWishlist);
	const oos = product.stock === 0;
	useNavigate();
	const [open, setOpen] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			whileHover: { y: -4 },
			transition: {
				type: "spring",
				stiffness: 300
			},
			className: "group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-elegant",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.image_url || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
								alt: product.product_name,
								loading: "lazy",
								className: "h-full w-full object-cover transition duration-500 group-hover:scale-105"
							}),
							oos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "destructive",
								className: "absolute left-3 top-3",
								children: "Out of stock"
							}),
							!oos && product.stock < 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "absolute left-3 top-3 bg-warning text-warning-foreground",
								children: "Low stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-1.5 shadow-lg",
									children: "Quick View"
								})
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: (e) => {
						e.preventDefault();
						toggleWish(product.product_id);
					},
					className: cn("absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background z-10", wishlisted && "text-destructive"),
					"aria-label": "Wishlist",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-4 w-4", wishlisted && "fill-current") })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: product.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 line-clamp-1 font-medium",
							children: product.product_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-warning text-warning" }), " 4.5"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-lg font-semibold",
								children: ["₹", product.price]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								disabled: oos,
								onClick: () => {
									add(product);
									toast.success(`${product.product_name} added to cart`);
								},
								className: "bg-gradient-brand shadow-soft hover:shadow-elegant",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-1.5 h-3.5 w-3.5" }), " Add"]
							})]
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-w-4xl w-[95vw] md:w-full p-0 overflow-hidden bg-background border-border sm:rounded-2xl",
			children: open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickViewContent, {
				productId: product.product_id,
				close: () => setOpen(false)
			})
		})]
	});
}
function QuickViewContent({ productId, close }) {
	const { data: detailedProduct, isLoading } = useQuery({
		queryKey: ["product", productId],
		queryFn: () => api.products.get(productId)
	});
	const add = useCart((s) => s.add);
	const wishlisted = useCart((s) => s.wishlist.includes(productId));
	const toggleWish = useCart((s) => s.toggleWishlist);
	const nav = useNavigate();
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-[500px] flex items-center justify-center text-muted-foreground",
		children: "Loading live details..."
	});
	if (!detailedProduct) return null;
	const oos = detailedProduct.stock === 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid md:grid-cols-2 h-full max-h-[85vh] overflow-y-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-square md:aspect-auto md:h-full bg-muted/20",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
				initial: {
					opacity: 0,
					scale: 1.05
				},
				animate: {
					opacity: 1,
					scale: 1
				},
				transition: { duration: .4 },
				src: detailedProduct.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
				alt: detailedProduct.product_name,
				className: "w-full h-full object-cover"
			}), oos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "destructive",
				className: "absolute left-4 top-4 text-sm px-3 py-1 shadow-lg",
				children: "Out of stock"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-6 sm:p-10 flex flex-col justify-center bg-background",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .1 },
					className: "text-sm font-medium text-primary mb-2 uppercase tracking-wider",
					children: detailedProduct.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .15 },
					className: "text-3xl font-bold tracking-tight mb-2 leading-tight",
					children: detailedProduct.product_name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .2 },
					className: "flex items-center gap-4 mb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-warning font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-current" }),
							" 4.8 ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: "(124 reviews)"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .25 },
					className: "text-3xl font-bold tracking-tight mb-6 text-foreground/90",
					children: ["₹", detailedProduct.price]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
					initial: {
						opacity: 0,
						x: 20
					},
					animate: {
						opacity: 1,
						x: 0
					},
					transition: { delay: .3 },
					className: "text-muted-foreground text-base leading-relaxed mb-8",
					children: detailedProduct.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 20
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: { delay: .35 },
					className: "flex items-center gap-3 mb-6 mt-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						className: "flex-1 bg-gradient-brand shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all rounded-xl h-12",
						disabled: oos,
						onClick: () => {
							add(detailedProduct);
							toast.success(`${detailedProduct.product_name} added to cart`);
							close();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-2 h-4 w-4" }), " Add to Cart"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "outline",
						className: cn("h-12 w-12 rounded-xl transition-colors shadow-sm", wishlisted && "border-destructive text-destructive bg-destructive/5"),
						onClick: () => toggleWish(detailedProduct.product_id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-5 w-5 transition-transform hover:scale-110", wishlisted && "fill-current") })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: { opacity: 0 },
					animate: { opacity: 1 },
					transition: { delay: .4 },
					className: "flex items-center justify-between pt-6 border-t border-border/50 text-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "link",
						className: "px-0 text-primary",
						onClick: () => {
							close();
							nav({ to: `/shop/products/${detailedProduct.product_id}` });
						},
						children: "View Full Details →"
					})
				})
			]
		})]
	});
}
//#endregion
export { ProductCard as t };
