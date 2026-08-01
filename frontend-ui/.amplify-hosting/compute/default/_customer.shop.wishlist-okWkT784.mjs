import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { K as Heart } from "./_libs/lucide-react.mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as useCart } from "./_ssr/cart-store-D2Bmtscz.mjs";
import { t as ProductCard } from "./_ssr/product-card-DODxGFxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.wishlist-okWkT784.js
var import_jsx_runtime = require_jsx_runtime();
function WishlistPage() {
	const wishlist = useCart((s) => s.wishlist);
	const { data: response, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: () => api.products.list()
	});
	const items = (response?.data || []).filter((p) => wishlist.includes(p.product_id));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-6 text-2xl font-semibold tracking-tight",
		children: "Your wishlist"
	}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 text-center text-muted-foreground border border-dashed rounded-xl",
		children: "Loading your wishlist..."
	}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-md py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-7 w-7 text-muted-foreground" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No items saved yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-4 bg-gradient-brand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop/products",
					children: "Discover products"
				})
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
		children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.product_id))
	})] });
}
//#endregion
export { WishlistPage as component };
