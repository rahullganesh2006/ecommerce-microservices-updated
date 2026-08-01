import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { C as Search } from "./_libs/lucide-react.mjs";
import { v as useSearch } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { n as useQuery } from "./_libs/tanstack__react-query.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-BHv1JhlL.mjs";
import { t as ProductCard } from "./_ssr/product-card-DODxGFxF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.products-DRGYvjmO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductsPage() {
	const initialCategory = useSearch({ strict: false })?.category || "all";
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)(initialCategory);
	const [sort, setSort] = (0, import_react.useState)("featured");
	const { data: response, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: () => api.products.list()
	});
	const products = response?.data || [];
	const categories = ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];
	const filtered = (0, import_react.useMemo)(() => {
		let list = products.filter((p) => p.product_name.toLowerCase().includes(q.toLowerCase()));
		if (cat !== "all") list = list.filter((p) => p.category === cat);
		if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
		if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
		if (sort === "rating") list = [...list].sort((a, b) => 0);
		return list;
	}, [
		q,
		cat,
		sort,
		products
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "All products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					"Browse our full catalog of ",
					products.length,
					" items"
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-col gap-3 sm:flex-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search products…",
						className: "pl-9"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: cat,
					onValueChange: setCat,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full sm:w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c,
						children: c === "all" ? "All categories" : c
					}, c)) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: sort,
					onValueChange: setSort,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-full sm:w-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "featured",
							children: "Featured"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "price-asc",
							children: "Price: low to high"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "price-desc",
							children: "Price: high to low"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "rating",
							children: "Highest rated"
						})
					] })]
				})
			]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground",
			children: "Loading products..."
		}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground",
			children: "No products found"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6",
			children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.product_id))
		})
	] });
}
//#endregion
export { ProductsPage as component };
