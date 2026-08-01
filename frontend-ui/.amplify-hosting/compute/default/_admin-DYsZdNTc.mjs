import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as AvatarFallback, t as Avatar } from "./_ssr/avatar-CcHbQ4nc.mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { n as cognitoLogout } from "./_ssr/cognito-auth-BqXre1jH.mjs";
import { A as Package, B as LayoutDashboard, J as FileText, L as LogOut, P as Menu, S as Settings, Z as CreditCard, a as Warehouse, lt as Bell, ot as ChartColumn, s as Users, v as ShoppingBag } from "./_libs/lucide-react.mjs";
import { a as DropdownMenuSeparator, c as SheetContent, i as DropdownMenuLabel, l as SheetTitle, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, s as Sheet, t as DropdownMenu, u as SheetTrigger } from "./_ssr/sheet-BJJZVaCD.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin-DYsZdNTc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAV = [
	{
		to: "/admin/dashboard",
		icon: LayoutDashboard,
		label: "Dashboard"
	},
	{
		to: "/admin/products",
		icon: Package,
		label: "Products"
	},
	{
		to: "/admin/inventory",
		icon: Warehouse,
		label: "Inventory"
	},
	{
		to: "/admin/orders",
		icon: ShoppingBag,
		label: "Orders"
	},
	{
		to: "/admin/payments",
		icon: CreditCard,
		label: "Payments"
	},
	{
		to: "/admin/customers",
		icon: Users,
		label: "Customers"
	},
	{
		to: "/admin/analytics",
		icon: ChartColumn,
		label: "Analytics"
	},
	{
		to: "/admin/reports",
		icon: FileText,
		label: "Reports"
	},
	{
		to: "/admin/settings",
		icon: Settings,
		label: "Settings"
	}
];
function SidebarInner({ pathname, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col bg-sidebar text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 px-6 py-5 border-b border-sidebar-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-glow overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/logo.jpg",
					alt: "Angadi Hub Logo",
					className: "w-full h-full object-cover"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-sm font-semibold tracking-tight",
				children: "Angadi Hub"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] uppercase tracking-wider text-sidebar-foreground/60",
				children: "Admin Console"
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "flex-1 space-y-1 overflow-y-auto p-3",
			children: NAV.map((n) => {
				const active = pathname.startsWith(n.to);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: n.to,
					onClick: onNavigate,
					className: `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"}`,
					children: [
						active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.label })
					]
				}, n.to);
			})
		})]
	});
}
function AdminLayout() {
	const nav = useNavigate();
	const logout = useAuth((s) => s.logout);
	const user = useAuth((s) => s.user);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
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
		className: "flex min-h-screen bg-muted/30",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "hidden w-64 shrink-0 lg:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-y-0 left-0 w-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, { pathname })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-14 items-center gap-3 px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open: mobileOpen,
							onOpenChange: setMobileOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									className: "lg:hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "left",
								className: "w-64 p-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "sr-only",
									children: "Navigation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarInner, {
									pathname,
									onNavigate: () => setMobileOpen(false)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden flex-1 items-center gap-2 text-sm sm:flex ml-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Admin Console"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground/50",
									children: "/"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground capitalize",
									children: pathname.split("/").filter(Boolean).pop()?.replace("-", " ") || "Dashboard"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "icon",
								className: "relative h-9 w-9",
								onClick: () => nav({ to: "/admin/notifications" }),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
										className: "h-7 w-7",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-gradient-brand text-xs text-primary-foreground",
											children: user?.name?.split(" ").map((n) => n[0]).join("")
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "hidden text-left text-xs sm:block",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium leading-tight",
											children: user?.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-muted-foreground",
											children: "Administrator"
										})]
									})]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
								align: "end",
								className: "w-56",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, { children: user?.email }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
										onClick: () => nav({ to: "/admin/settings" }),
										children: "Settings"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: handleLogout,
										className: "text-destructive focus:text-destructive",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "mr-2 h-4 w-4" }), " Sign out"]
									})
								]
							})] })]
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.main, {
				initial: {
					opacity: 0,
					y: 8
				},
				animate: {
					opacity: 1,
					y: 0
				},
				transition: { duration: .25 },
				className: "flex-1 p-4 sm:p-6 lg:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}, pathname)]
		})]
	});
}
//#endregion
export { AdminLayout as component };
