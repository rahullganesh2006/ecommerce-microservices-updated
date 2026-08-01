import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, j as redirect, m as createFileRoute, p as lazyRouteComponent, s as Scripts, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Route$24 } from "../_customer.shop.products_._productId-WdH1PwYu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BhmPeA9x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DgSWsI1y.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-brand shadow-elegant",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-3xl font-bold text-primary-foreground",
						children: "404"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-semibold tracking-tight text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "This route doesn't exist in the Angadi Hub platform."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-soft transition hover:shadow-elegant",
						children: "Return home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The service returned an unexpected error. Try again or head home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-lg bg-gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$23 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Angadi Hub Commerce — Enterprise Serverless E-Commerce" },
			{
				name: "description",
				content: "Enterprise serverless e-commerce platform powered by AWS microservices, Cognito auth, and role-based dashboards."
			},
			{
				name: "author",
				content: "Angadi Hub"
			},
			{
				property: "og:title",
				content: "Angadi Hub Commerce Platform"
			},
			{
				property: "og:description",
				content: "Enterprise Serverless E-Commerce powered by AWS Microservices."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/logo.jpg",
				type: "image/jpeg"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			style: { fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif" },
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$23.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			position: "top-right",
			richColors: true
		})]
	});
}
var $$splitComponentImporter$22 = () => import("./unauthorized-B3dOwWwI.mjs");
var Route$22 = createFileRoute("/unauthorized")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./login-DMt_qv4a.mjs");
var Route$21 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — Angadi Hub Commerce" }, {
		name: "description",
		content: "Sign in to the Angadi Hub enterprise commerce platform."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("../_customer-y_WmxQxA.mjs");
var Route$20 = createFileRoute("/_customer")({
	beforeLoad: ({ location }) => {
		if (typeof window === "undefined") return;
		const { isAuthenticated, user } = useAuth.getState();
		if (!isAuthenticated || !user) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
		if (user.role !== "CUSTOMER") throw redirect({ to: "/unauthorized" });
	},
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("../_admin-DYsZdNTc.mjs");
var Route$19 = createFileRoute("/_admin")({
	beforeLoad: ({ location }) => {
		if (typeof window === "undefined") return;
		const { isAuthenticated, user } = useAuth.getState();
		if (!isAuthenticated || !user) throw redirect({
			to: "/login",
			search: { redirect: location.href }
		});
		if (user.role !== "ADMIN") throw redirect({ to: "/unauthorized" });
	},
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./routes-DTEZEvkE.mjs");
var Route$18 = createFileRoute("/")({
	beforeLoad: () => {
		if (typeof window === "undefined") return;
		const { isAuthenticated, user } = useAuth.getState();
		if (!isAuthenticated || !user) throw redirect({ to: "/login" });
		throw redirect({ to: user.role === "ADMIN" ? "/admin/dashboard" : "/shop" });
	},
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("../_customer.shop.index-DLScRjxe.mjs");
var Route$17 = createFileRoute("/_customer/shop/")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("../_customer.shop.wishlist-okWkT784.mjs");
var Route$16 = createFileRoute("/_customer/shop/wishlist")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("../_customer.shop.settings-CgRNGi9o.mjs");
var Route$15 = createFileRoute("/_customer/shop/settings")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("../_customer.shop.profile-mCaG31XY.mjs");
var Route$14 = createFileRoute("/_customer/shop/profile")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("../_customer.shop.products-DRGYvjmO.mjs");
var Route$13 = createFileRoute("/_customer/shop/products")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("../_customer.shop.orders-DOGMlUon.mjs");
var Route$12 = createFileRoute("/_customer/shop/orders")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("../_customer.shop.checkout-C8cjKZOI.mjs");
var Route$11 = createFileRoute("/_customer/shop/checkout")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("../_customer.shop.cart-DaEe5qLW.mjs");
var Route$10 = createFileRoute("/_customer/shop/cart")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("../_admin.admin.settings-BYkXZZlh.mjs");
var Route$9 = createFileRoute("/_admin/admin/settings")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("../_admin.admin.reports-Bo-Kiihf.mjs");
var Route$8 = createFileRoute("/_admin/admin/reports")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("../_admin.admin.products-CknVMOy5.mjs");
var Route$7 = createFileRoute("/_admin/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("../_admin.admin.payments-XicNly2P.mjs");
var Route$6 = createFileRoute("/_admin/admin/payments")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("../_admin.admin.orders-BzbfI9j_.mjs");
var Route$5 = createFileRoute("/_admin/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("../_admin.admin.notifications-BTMvUle4.mjs");
var Route$4 = createFileRoute("/_admin/admin/notifications")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("../_admin.admin.inventory-BWGax8Sf.mjs");
var Route$3 = createFileRoute("/_admin/admin/inventory")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("../_admin.admin.dashboard-BarLWynR.mjs");
var Route$2 = createFileRoute("/_admin/admin/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("../_admin.admin.customers-Cl-a3JZq.mjs");
var Route$1 = createFileRoute("/_admin/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("../_admin.admin.analytics-RRCP-R34.mjs");
var Route = createFileRoute("/_admin/admin/analytics")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var UnauthorizedRoute = Route$22.update({
	id: "/unauthorized",
	path: "/unauthorized",
	getParentRoute: () => Route$23
});
var LoginRoute = Route$21.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$23
});
var CustomerRoute = Route$20.update({
	id: "/_customer",
	getParentRoute: () => Route$23
});
var AdminRoute = Route$19.update({
	id: "/_admin",
	getParentRoute: () => Route$23
});
var IndexRoute = Route$18.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$23
});
var CustomerShopIndexRoute = Route$17.update({
	id: "/shop/",
	path: "/shop/",
	getParentRoute: () => CustomerRoute
});
var CustomerShopWishlistRoute = Route$16.update({
	id: "/shop/wishlist",
	path: "/shop/wishlist",
	getParentRoute: () => CustomerRoute
});
var CustomerShopSettingsRoute = Route$15.update({
	id: "/shop/settings",
	path: "/shop/settings",
	getParentRoute: () => CustomerRoute
});
var CustomerShopProfileRoute = Route$14.update({
	id: "/shop/profile",
	path: "/shop/profile",
	getParentRoute: () => CustomerRoute
});
var CustomerShopProductsRoute = Route$13.update({
	id: "/shop/products",
	path: "/shop/products",
	getParentRoute: () => CustomerRoute
});
var CustomerShopOrdersRoute = Route$12.update({
	id: "/shop/orders",
	path: "/shop/orders",
	getParentRoute: () => CustomerRoute
});
var CustomerShopCheckoutRoute = Route$11.update({
	id: "/shop/checkout",
	path: "/shop/checkout",
	getParentRoute: () => CustomerRoute
});
var CustomerShopCartRoute = Route$10.update({
	id: "/shop/cart",
	path: "/shop/cart",
	getParentRoute: () => CustomerRoute
});
var AdminAdminSettingsRoute = Route$9.update({
	id: "/admin/settings",
	path: "/admin/settings",
	getParentRoute: () => AdminRoute
});
var AdminAdminReportsRoute = Route$8.update({
	id: "/admin/reports",
	path: "/admin/reports",
	getParentRoute: () => AdminRoute
});
var AdminAdminProductsRoute = Route$7.update({
	id: "/admin/products",
	path: "/admin/products",
	getParentRoute: () => AdminRoute
});
var AdminAdminPaymentsRoute = Route$6.update({
	id: "/admin/payments",
	path: "/admin/payments",
	getParentRoute: () => AdminRoute
});
var AdminAdminOrdersRoute = Route$5.update({
	id: "/admin/orders",
	path: "/admin/orders",
	getParentRoute: () => AdminRoute
});
var AdminAdminNotificationsRoute = Route$4.update({
	id: "/admin/notifications",
	path: "/admin/notifications",
	getParentRoute: () => AdminRoute
});
var AdminAdminInventoryRoute = Route$3.update({
	id: "/admin/inventory",
	path: "/admin/inventory",
	getParentRoute: () => AdminRoute
});
var AdminAdminDashboardRoute = Route$2.update({
	id: "/admin/dashboard",
	path: "/admin/dashboard",
	getParentRoute: () => AdminRoute
});
var AdminAdminCustomersRoute = Route$1.update({
	id: "/admin/customers",
	path: "/admin/customers",
	getParentRoute: () => AdminRoute
});
var AdminAdminAnalyticsRoute = Route.update({
	id: "/admin/analytics",
	path: "/admin/analytics",
	getParentRoute: () => AdminRoute
});
var CustomerShopProductsProductIdRoute = Route$24.update({
	id: "/shop/products_/$productId",
	path: "/shop/products/$productId",
	getParentRoute: () => CustomerRoute
});
var AdminRouteChildren = {
	AdminAdminAnalyticsRoute,
	AdminAdminCustomersRoute,
	AdminAdminDashboardRoute,
	AdminAdminInventoryRoute,
	AdminAdminNotificationsRoute,
	AdminAdminOrdersRoute,
	AdminAdminPaymentsRoute,
	AdminAdminProductsRoute,
	AdminAdminReportsRoute,
	AdminAdminSettingsRoute
};
var AdminRouteWithChildren = AdminRoute._addFileChildren(AdminRouteChildren);
var CustomerRouteChildren = {
	CustomerShopCartRoute,
	CustomerShopCheckoutRoute,
	CustomerShopOrdersRoute,
	CustomerShopProductsRoute,
	CustomerShopProfileRoute,
	CustomerShopSettingsRoute,
	CustomerShopWishlistRoute,
	CustomerShopIndexRoute,
	CustomerShopProductsProductIdRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRouteWithChildren,
	CustomerRoute: CustomerRoute._addFileChildren(CustomerRouteChildren),
	LoginRoute,
	UnauthorizedRoute
};
var routeTree = Route$23._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
