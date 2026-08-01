import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { K as Heart, _ as ShoppingCart, b as ShieldCheck, ft as ArrowLeft, m as Star, u as Truck } from "./_libs/lucide-react.mjs";
import { _ as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as useCart } from "./_ssr/cart-store-D2Bmtscz.mjs";
import { t as Route } from "./_customer.shop.products_._productId-WdH1PwYu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.products_._productId-Bdf8cQaA.js
var import_jsx_runtime = require_jsx_runtime();
function ProductDetailPage() {
	const { productId } = Route.useParams();
	const nav = useNavigate();
	const add = useCart((s) => s.add);
	const wishlisted = useCart((s) => s.wishlist.includes(productId));
	const toggleWish = useCart((s) => s.toggleWishlist);
	const { data: product, isLoading, error } = useQuery({
		queryKey: ["product", productId],
		queryFn: () => api.products.get(productId)
	});
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-24 text-center text-muted-foreground",
		children: "Loading product details..."
	});
	if (error || !product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-24 text-center text-destructive",
		children: "Product not found."
	});
	const oos = product.stock === 0;
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: { staggerChildren: .1 }
		}
	};
	const itemVariants = {
		hidden: {
			opacity: 0,
			y: 20
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 300,
				damping: 24
			}
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: "hidden",
		animate: "visible",
		variants: containerVariants,
		className: "max-w-6xl mx-auto px-4 py-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			variants: itemVariants,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "ghost",
				size: "sm",
				onClick: () => nav({ to: "/shop/products" }),
				className: "mb-6 -ml-3 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Shop"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-2 gap-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				variants: itemVariants,
				className: "relative aspect-square overflow-hidden rounded-3xl bg-muted/20 border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.img, {
					initial: { scale: 1.1 },
					animate: { scale: 1 },
					transition: {
						duration: .6,
						ease: "easeOut"
					},
					src: product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
					alt: product.product_name,
					className: "w-full h-full object-cover"
				}), oos && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "destructive",
					className: "absolute left-4 top-4 text-sm px-3 py-1 shadow-lg",
					children: "Out of stock"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants: itemVariants,
						className: "text-sm font-medium text-primary mb-2 uppercase tracking-wider",
						children: product.category
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h1, {
						variants: itemVariants,
						className: "text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight",
						children: product.product_name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: itemVariants,
						className: "flex items-center gap-4 mb-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1 text-warning font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5 fill-current" }),
								" 4.8 ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground font-normal",
									children: "(124 reviews)"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: ["• SKU: ", product.product_id]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: itemVariants,
						className: "text-4xl font-bold tracking-tight mb-6 text-foreground/90",
						children: ["₹", product.price]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						variants: itemVariants,
						className: "text-muted-foreground text-lg leading-relaxed mb-8",
						children: product.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: itemVariants,
						className: "flex items-center gap-4 mb-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							className: "flex-1 bg-gradient-brand shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all text-lg h-14 rounded-2xl",
							disabled: oos,
							onClick: () => {
								add(product);
								toast.success(`${product.product_name} added to cart`);
								nav({ to: "/shop/cart" });
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "mr-2 h-5 w-5" }),
								" ",
								oos ? "Out of Stock" : "Add to Cart"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "outline",
							className: cn("h-14 w-14 rounded-2xl border-border hover:bg-muted/50 transition-colors shadow-sm", wishlisted && "border-destructive text-destructive bg-destructive/5"),
							onClick: () => toggleWish(product.product_id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: cn("h-6 w-6 transition-transform hover:scale-110", wishlisted && "fill-current") })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						variants: itemVariants,
						className: "grid grid-cols-2 gap-4 pt-8 border-t border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-primary/10 p-2 rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" })
							}), " Free Lightning Delivery"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-primary/10 p-2 rounded-lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" })
							}), " 1 Year Warranty"]
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { ProductDetailPage as component };
