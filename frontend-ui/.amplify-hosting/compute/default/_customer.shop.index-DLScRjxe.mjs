import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { A as Package, M as Monitor, O as Percent, V as Laptop, dt as ArrowRight, ft as ArrowLeft, g as Smartphone, h as Sparkles, i as Watch, q as Headphones, r as X, st as Camera, u as Truck } from "./_libs/lucide-react.mjs";
import { _ as useNavigate, g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as AnimatePresence, t as motion } from "./_libs/framer-motion.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as ProductCard } from "./_ssr/product-card-DODxGFxF.mjs";
import { t as useEmblaCarousel } from "./_libs/embla-carousel-react+[...].mjs";
import { t as Autoplay } from "./_libs/embla-carousel-autoplay.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.index-DLScRjxe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CarouselContext = import_react.createContext(null);
function useCarousel() {
	const context = import_react.useContext(CarouselContext);
	if (!context) throw new Error("useCarousel must be used within a <Carousel />");
	return context;
}
var Carousel = import_react.forwardRef(({ orientation = "horizontal", opts, setApi, plugins, className, children, ...props }, ref) => {
	const [carouselRef, api] = useEmblaCarousel({
		...opts,
		axis: orientation === "horizontal" ? "x" : "y"
	}, plugins);
	const [canScrollPrev, setCanScrollPrev] = import_react.useState(false);
	const [canScrollNext, setCanScrollNext] = import_react.useState(false);
	const onSelect = import_react.useCallback((api) => {
		if (!api) return;
		setCanScrollPrev(api.canScrollPrev());
		setCanScrollNext(api.canScrollNext());
	}, []);
	const scrollPrev = import_react.useCallback(() => {
		api?.scrollPrev();
	}, [api]);
	const scrollNext = import_react.useCallback(() => {
		api?.scrollNext();
	}, [api]);
	const handleKeyDown = import_react.useCallback((event) => {
		if (event.key === "ArrowLeft") {
			event.preventDefault();
			scrollPrev();
		} else if (event.key === "ArrowRight") {
			event.preventDefault();
			scrollNext();
		}
	}, [scrollPrev, scrollNext]);
	import_react.useEffect(() => {
		if (!api || !setApi) return;
		setApi(api);
	}, [api, setApi]);
	import_react.useEffect(() => {
		if (!api) return;
		onSelect(api);
		api.on("reInit", onSelect);
		api.on("select", onSelect);
		return () => {
			api?.off("select", onSelect);
		};
	}, [api, onSelect]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselContext.Provider, {
		value: {
			carouselRef,
			api,
			opts,
			orientation: orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
			scrollPrev,
			scrollNext,
			canScrollPrev,
			canScrollNext
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			onKeyDownCapture: handleKeyDown,
			className: cn("relative", className),
			role: "region",
			"aria-roledescription": "carousel",
			...props,
			children
		})
	});
});
Carousel.displayName = "Carousel";
var CarouselContent = import_react.forwardRef(({ className, ...props }, ref) => {
	const { carouselRef, orientation } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: carouselRef,
		className: "overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref,
			className: cn("flex", orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col", className),
			...props
		})
	});
});
CarouselContent.displayName = "CarouselContent";
var CarouselItem = import_react.forwardRef(({ className, ...props }, ref) => {
	const { orientation } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		role: "group",
		"aria-roledescription": "slide",
		className: cn("min-w-0 shrink-0 grow-0 basis-full", orientation === "horizontal" ? "pl-4" : "pt-4", className),
		...props
	});
});
CarouselItem.displayName = "CarouselItem";
var CarouselPrevious = import_react.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollPrev, canScrollPrev } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant,
		size,
		className: cn("absolute  h-8 w-8 rounded-full", orientation === "horizontal" ? "-left-12 top-1/2 -translate-y-1/2" : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollPrev,
		onClick: scrollPrev,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Previous slide"
		})]
	});
});
CarouselPrevious.displayName = "CarouselPrevious";
var CarouselNext = import_react.forwardRef(({ className, variant = "outline", size = "icon", ...props }, ref) => {
	const { orientation, scrollNext, canScrollNext } = useCarousel();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		variant,
		size,
		className: cn("absolute h-8 w-8 rounded-full", orientation === "horizontal" ? "-right-12 top-1/2 -translate-y-1/2" : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className),
		disabled: !canScrollNext,
		onClick: scrollNext,
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Next slide"
		})]
	});
});
CarouselNext.displayName = "CarouselNext";
function CustomerHome() {
	useAuth((s) => s.user);
	const nav = useNavigate();
	const [showAd, setShowAd] = (0, import_react.useState)(false);
	const autoplayPlugin = import_react.useRef(Autoplay({
		delay: 3e3,
		stopOnInteraction: false
	}));
	const { data: response, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: () => api.products.list()
	});
	const products = response?.data || [];
	const recommended = products.slice(0, 4);
	const latest = products.slice(4, 8);
	const categoriesWithImage = Array.from(new Set(products.map((p) => p.category).filter(Boolean))).map((c) => {
		return {
			name: c,
			image: products.find((p) => p.category === c && p.image)?.image || null
		};
	});
	const CATEGORY_STYLES = {
		"phones": {
			i: Smartphone,
			color: "from-blue-500 to-cyan-400"
		},
		"laptops": {
			i: Laptop,
			color: "from-purple-500 to-pink-400"
		},
		"audio": {
			i: Headphones,
			color: "from-amber-400 to-orange-500"
		},
		"wearables": {
			i: Watch,
			color: "from-emerald-400 to-teal-500"
		},
		"cameras": {
			i: Camera,
			color: "from-rose-400 to-red-500"
		},
		"accessories": {
			i: Monitor,
			color: "from-indigo-400 to-blue-500"
		}
	};
	const FALLBACK_STYLE = {
		i: Package,
		color: "from-slate-500 to-gray-400"
	};
	(0, import_react.useEffect)(() => {
		if (products.length > 0 && !sessionStorage.getItem("hasSeenAd")) {
			const timer = setTimeout(() => {
				setShowAd(true);
				sessionStorage.setItem("hasSeenAd", "true");
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [products]);
	const latestAdProduct = products.length > 0 ? products[products.length - 1] : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Carousel, {
				opts: { loop: true },
				plugins: [autoplayPlugin.current],
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CarouselContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
						initial: {
							opacity: 0,
							y: 12
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: "relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-elegant h-[400px] flex items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-cover bg-center",
								style: { backgroundImage: "url('/images/banners/carousel_banner_1_1785478567235.jpg')" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative max-w-2xl z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-blue-300" }), " Premium Collection"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-md",
										children: [
											"Next-Gen Tech, ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-blue-300",
												children: "Unleashed."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 max-w-lg text-white/90 drop-shadow-sm text-lg",
										children: "Experience the future with our curated selection of high-performance devices."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											className: "bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/shop/products",
												children: ["Shop Now ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
											})
										})
									})
								]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						className: "relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-elegant h-[400px] flex items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-cover bg-center",
								style: { backgroundImage: "url('/images/banners/carousel_banner_2_1785478579139.jpg')" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative max-w-2xl z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-3 w-3 text-purple-300" }), " Lightning Fast"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-md",
										children: [
											"Ultra-Fast ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-purple-300",
												children: "Delivery."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 max-w-lg text-white/90 drop-shadow-sm text-lg",
										children: "Order today, receive it tomorrow. Our serverless fulfillment gets it to you faster."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8 flex gap-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											className: "bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-500/30",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/shop/orders",
												children: "Track Orders"
											})
										})
									})
								]
							})
						]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CarouselItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.section, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						className: "relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-elegant h-[400px] flex items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute inset-0 bg-cover bg-center",
								style: { backgroundImage: "url('/images/banners/carousel_banner_3_1785478591370.jpg')" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/30" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative max-w-2xl z-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "h-3 w-3 text-pink-300" }), " Special Offer"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-md",
										children: [
											"Big Savings ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-pink-300",
												children: "Every Day."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 max-w-lg text-white/90 drop-shadow-sm text-lg",
										children: "Explore massive discounts on top-tier electronics. Don't miss out."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-8",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											asChild: true,
											size: "lg",
											className: "bg-pink-600 hover:bg-pink-500 text-white rounded-full shadow-lg shadow-pink-500/30",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/shop/products",
												children: ["View Deals ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 h-4 w-4" })]
											})
										})
									})
								]
							})
						]
					}) })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex items-end justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold tracking-tight",
					children: "Shop by Category"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x",
				children: categoriesWithImage.map((c, i) => {
					const style = CATEGORY_STYLES[c.name.toLowerCase()] || FALLBACK_STYLE;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 8
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: i * .05 },
						className: "snap-start shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: `/shop/products?category=${encodeURIComponent(c.name)}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								className: "shadow-soft transition-all hover:shadow-elegant hover:-translate-y-1 w-28 sm:w-32 cursor-pointer border-transparent hover:border-primary/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "flex flex-col items-center justify-center gap-3 p-4 sm:p-5",
									children: [c.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-16 w-16 items-center justify-center rounded-full overflow-hidden border-2 border-muted bg-white shadow-sm",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: c.image,
											alt: c.name,
											className: "w-full h-full object-cover"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${style.color} text-white shadow-sm`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(style.i, { className: "h-7 w-7" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs sm:text-sm font-medium text-center truncate w-full px-1",
										children: c.name
									})]
								})
							})
						})
					}, c.name);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold tracking-tight",
					children: "Recommended for you"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Based on your recent activity"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/products",
						children: "View all"
					})
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-12 text-center text-muted-foreground border border-dashed rounded-xl",
				children: "Loading products..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
				children: recommended.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.product_id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-end justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-semibold tracking-tight",
					children: "Latest arrivals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop/products",
						children: "View all"
					})
				})]
			}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-12 text-center text-muted-foreground border border-dashed rounded-xl",
				children: "Loading products..."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6",
				children: latest.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.product_id))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: showAd && latestAdProduct && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						scale: .95,
						y: 20
					},
					animate: {
						opacity: 1,
						scale: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						scale: .95,
						y: 20
					},
					transition: {
						type: "spring",
						duration: .5
					},
					className: "relative w-full max-w-lg overflow-hidden rounded-3xl bg-background shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowAd(false),
							className: "absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur hover:bg-black/40 transition",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative h-64 w-full",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: latestAdProduct.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
									alt: latestAdProduct.product_name,
									className: "h-full w-full object-cover"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "absolute bottom-4 left-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10 text-white mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-pink-300" }), " New Arrival"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-2xl font-bold text-white shadow-sm",
										children: latestAdProduct.product_name
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground line-clamp-2 mb-6",
								children: latestAdProduct.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-2xl font-bold tracking-tight",
									children: ["₹", latestAdProduct.price]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										setShowAd(false);
										nav({ to: `/shop/products/${latestAdProduct.product_id}` });
									},
									className: "bg-gradient-brand shadow-soft hover:shadow-elegant rounded-full px-6",
									children: "Buy Now"
								})]
							})]
						})
					]
				})
			}) })
		]
	});
}
//#endregion
export { CustomerHome as component };
