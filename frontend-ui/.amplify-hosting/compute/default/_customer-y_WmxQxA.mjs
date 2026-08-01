import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as AvatarFallback, t as Avatar } from "./_ssr/avatar-CcHbQ4nc.mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { n as cognitoLogout } from "./_ssr/cognito-auth-BqXre1jH.mjs";
import { A as Package, D as Phone, F as MapPin, G as House, I as Mail, K as Heart, L as LogOut, P as Menu, S as Settings, T as Receipt, U as Instagram, Y as Facebook, _ as ShoppingCart, c as User, l as Twitter, n as Youtube } from "./_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, c as SheetContent, i as DropdownMenuLabel, l as SheetTitle, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, s as Sheet, t as DropdownMenu, u as SheetTrigger } from "./_ssr/sheet-BJJZVaCD.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as useCart } from "./_ssr/cart-store-D2Bmtscz.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer-y_WmxQxA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/shop",
		icon: House,
		label: "Home"
	},
	{
		to: "/shop/products",
		icon: Package,
		label: "Products"
	},
	{
		to: "/shop/orders",
		icon: Receipt,
		label: "Orders"
	},
	{
		to: "/shop/wishlist",
		icon: Heart,
		label: "Wishlist"
	}
];
function CustomerLayout() {
	const nav = useNavigate();
	const logout = useAuth((s) => s.logout);
	const user = useAuth((s) => s.user);
	const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
	const wishCount = useCart((s) => s.wishlist.length);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [open, setOpen] = (0, import_react.useState)(false);
	async function handleLogout() {
		try {
			await cognitoLogout();
			logout();
			toast.success("Signed out successfully");
			nav({ to: "/login" });
		} catch (error) {
			console.error(error);
			toast.error("Failed to sign out");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 w-full items-center gap-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/shop",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-elegant overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/logo.jpg",
									alt: "Angadi Hub Logo",
									className: "w-full h-full object-cover"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base font-semibold tracking-tight",
								children: "Angadi Hub"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "ml-6 hidden items-center gap-1 md:flex",
							children: NAV.map((n) => {
								const active = pathname === n.to || n.to !== "/shop" && pathname.startsWith(n.to);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: n.to,
									className: `rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`,
									children: n.label
								}, n.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									className: "relative",
									onClick: () => nav({ to: "/shop/wishlist" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" }), wishCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px]",
										children: wishCount
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "icon",
									className: "relative",
									onClick: () => nav({ to: "/shop/cart" }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }), cartCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-gradient-brand px-1 text-[10px]",
										children: cartCount
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "ml-1 flex items-center rounded-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
											className: "h-8 w-8",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
												className: "bg-gradient-brand text-xs text-primary-foreground",
												children: user?.name?.split(" ").map((n) => n[0]).join("")
											})
										})
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "w-56",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuLabel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-sm font-medium",
											children: user?.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-normal text-muted-foreground",
											children: user?.email
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => nav({ to: "/shop/profile" }),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mr-2 h-4 w-4" }), " Profile"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => nav({ to: "/shop/settings" }),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "mr-2 h-4 w-4" }), " Settings"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: handleLogout,
											className: "text-destructive focus:text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
									open,
									onOpenChange: setOpen,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "md:hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
										side: "right",
										className: "w-72",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Menu" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-6 space-y-1",
											children: NAV.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: n.to,
												onClick: () => setOpen(false),
												className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4" }),
													" ",
													n.label
												]
											}, n.to))
										})]
									})]
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.main, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .25 },
				className: "mx-auto w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}, pathname),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "relative overflow-hidden border-t-0 bg-slate-950 pt-24 pb-12 mt-12 text-slate-300 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -top-64 -left-64 h-96 w-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-64 -right-64 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/shop",
											className: "flex items-center gap-3 group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-primary/25",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: "/logo.jpg",
													alt: "Angadi Hub Logo",
													className: "w-full h-full object-cover"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors",
												children: "Angadi Hub"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-slate-400 text-sm leading-relaxed max-w-xs font-medium",
											children: "Your premier destination for next-generation electronics and unbeatable tech deals. Elevating your digital lifestyle to new heights."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex gap-4 pt-2",
											children: [
												{
													Icon: Twitter,
													color: "hover:bg-sky-500 hover:text-white"
												},
												{
													Icon: Instagram,
													color: "hover:bg-pink-600 hover:text-white"
												},
												{
													Icon: Facebook,
													color: "hover:bg-blue-600 hover:text-white"
												},
												{
													Icon: Youtube,
													color: "hover:bg-red-600 hover:text-white"
												}
											].map(({ Icon, color }, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
												href: "#",
												className: `h-10 w-10 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm ${color}`,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
											}, i))
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-semibold text-white mb-6 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-1 bg-gradient-brand rounded-full inline-block" }), "Quick Links"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-4 text-sm font-medium",
									children: [
										{
											label: "Home Page",
											to: "/shop"
										},
										{
											label: "Shop All Products",
											to: "/shop/products"
										},
										{
											label: "Order Tracking",
											to: "/shop/orders"
										},
										{
											label: "My Wishlist",
											to: "/shop/wishlist"
										}
									].map((link, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: link.to,
										className: "group flex items-center gap-2 text-slate-400 hover:text-white transition-colors",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" }), link.label]
									}) }, i))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-lg font-semibold text-white mb-6 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-1 bg-gradient-brand rounded-full inline-block" }), "Contact Us"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-5 text-sm font-medium text-slate-400",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-4 group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "mt-1 group-hover:text-slate-200 transition-colors",
												children: [
													"Phase 1, Electronic City,",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
													"Bengaluru, Karnataka 560100, India"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-4 group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "group-hover:text-slate-200 transition-colors",
												children: "+91 98765 43210"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-center gap-4 group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "group-hover:text-slate-200 transition-colors",
												children: "support@angadihub.com"
											})]
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-lg font-semibold text-white mb-6 flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-8 h-1 bg-gradient-brand rounded-full inline-block" }), "Stay Updated"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-slate-400 mb-6 font-medium leading-relaxed",
										children: "Join our elite tech newsletter to receive the latest updates, pre-orders, and exclusive deals."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										className: "relative flex items-center",
										onSubmit: (e) => {
											e.preventDefault();
											toast.success("Subscribed successfully!");
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											placeholder: "Email address...",
											className: "bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 h-12 rounded-2xl pr-32 w-full",
											required: true
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "absolute right-1 h-10 rounded-xl bg-gradient-brand shadow-lg hover:shadow-primary/25 transition-all",
											children: "Subscribe"
										})]
									})
								] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row items-center justify-between border-t border-slate-800/60 pt-8 gap-6 text-xs font-medium text-slate-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-center md:text-left",
								children: [
									"© ",
									(/* @__PURE__ */ new Date()).getFullYear(),
									" Angadi Hub Commerce. All rights reserved."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap justify-center gap-4 md:gap-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "hover:text-white transition-colors",
										children: "Privacy Policy"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "hover:text-white transition-colors",
										children: "Terms of Service"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: "#",
										className: "hover:text-white transition-colors",
										children: "Cookie Policy"
									})
								]
							})]
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { CustomerLayout as component };
