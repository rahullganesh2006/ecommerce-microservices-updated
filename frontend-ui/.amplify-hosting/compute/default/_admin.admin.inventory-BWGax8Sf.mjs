import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { a as Warehouse, d as TriangleAlert, k as Pencil, z as LoaderCircle } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as Label } from "./_ssr/label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./_ssr/dialog-Y9HmOov6.mjs";
import { n as Root, t as Indicator } from "./_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.inventory-BWGax8Sf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Progress = import_react.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Indicator, {
		className: "h-full w-full flex-1 bg-primary transition-all",
		style: { transform: `translateX(-${100 - (value || 0)}%)` }
	})
}));
Progress.displayName = Root.displayName;
function AdminInventory() {
	const { data: productsRes, isLoading: loadingProducts } = useQuery({
		queryKey: ["products"],
		queryFn: () => api.products.list()
	});
	const { data: inventoryRes, isLoading: loadingInventory } = useQuery({
		queryKey: ["inventory"],
		queryFn: () => api.inventory.list()
	});
	const isLoading = loadingProducts || loadingInventory;
	const queryClient = useQueryClient();
	const [isAdjustOpen, setIsAdjustOpen] = (0, import_react.useState)(false);
	const [adjustData, setAdjustData] = (0, import_react.useState)({
		product_id: "",
		name: "",
		available_stock: 0,
		new_stock: 0
	});
	const updateStockMutation = useMutation({
		mutationFn: async () => {
			await api.inventory.update(`inv_${adjustData.product_id}`, { available_stock: adjustData.new_stock });
			await api.products.update(adjustData.product_id, { stock: adjustData.new_stock });
		},
		onSuccess: () => {
			toast.success("Stock level adjusted successfully!");
			setIsAdjustOpen(false);
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Failed to adjust stock");
		}
	});
	const handleAdjustSubmit = (e) => {
		e.preventDefault();
		updateStockMutation.mutate();
	};
	const openAdjustDialog = (item) => {
		setAdjustData({
			...item,
			new_stock: item.available_stock
		});
		setIsAdjustOpen(true);
	};
	const mergedData = (0, import_react.useMemo)(() => {
		const products = productsRes?.data || [];
		const inventory = inventoryRes?.data || [];
		return products.map((product) => {
			const invRow = inventory.find((i) => i.product_id === product.product_id);
			return {
				product_id: product.product_id,
				name: product.product_name,
				available_stock: invRow ? invRow.available_stock : product.stock
			};
		});
	}, [productsRes, inventoryRes]);
	const outOfStockCount = mergedData.filter((d) => d.available_stock === 0).length;
	const lowStockCount = mergedData.filter((d) => d.available_stock > 0 && d.available_stock < 20).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Inventory"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Real-time stock levels from Inventory Service"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warehouse, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "Total SKUs"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-2xl font-bold",
							children: isLoading ? "..." : mergedData.length
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "Low stock"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-2xl font-bold",
							children: isLoading ? "..." : lowStockCount
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "shadow-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 text-destructive" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-muted-foreground",
								children: "Out of stock"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-2xl font-bold",
							children: isLoading ? "..." : outOfStockCount
						})]
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-4 font-semibold",
					children: "Stock levels"
				}), isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-8 text-center text-muted-foreground",
					children: "Loading live inventory..."
				}) : mergedData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-8 text-center text-muted-foreground",
					children: "No active products found in catalog."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4",
					children: mergedData.map((item) => {
						const pct = Math.min(100, item.available_stock / 200 * 100);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: item.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: item.product_id
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									item.available_stock === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										children: "Out"
									}),
									item.available_stock > 0 && item.available_stock < 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-warning/10 text-warning border-0",
										children: "Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "tabular-nums font-semibold w-16 text-right",
										children: [item.available_stock, " units"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										className: "h-6 w-6 ml-2",
										onClick: () => openAdjustDialog(item),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3 w-3" })
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: pct,
							className: "h-2"
						})] }, item.product_id);
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: isAdjustOpen,
			onOpenChange: setIsAdjustOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-[425px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Adjust Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
					"Manually override the inventory level for ",
					adjustData.name,
					" (",
					adjustData.product_id,
					")."
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleAdjustSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: adjustData.available_stock,
								disabled: true,
								className: "bg-muted text-muted-foreground"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New Stock Level" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: "0",
								value: adjustData.new_stock,
								onChange: (e) => setAdjustData({
									...adjustData,
									new_stock: parseInt(e.target.value) || 0
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setIsAdjustOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: updateStockMutation.isPending,
								children: [updateStockMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save Changes"]
							})]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { AdminInventory as component };
