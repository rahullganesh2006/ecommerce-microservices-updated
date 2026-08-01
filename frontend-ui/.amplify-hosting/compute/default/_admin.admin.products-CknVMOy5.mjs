import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { C as Search, E as Plus, k as Pencil, p as Trash2, z as LoaderCircle } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./_ssr/table-DJOO1b-0.mjs";
import { t as Badge } from "./_ssr/badge-D1Dupn2y.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as Label } from "./_ssr/label-BPuF5-mq.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./_ssr/dialog-Y9HmOov6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.products-CknVMOy5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminProducts() {
	const [q, setQ] = (0, import_react.useState)("");
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = (0, import_react.useState)(false);
	const queryClient = useQueryClient();
	const { data: response, isLoading } = useQuery({
		queryKey: ["products"],
		queryFn: () => api.products.list()
	});
	const list = (response?.data || []).filter((p) => p.product_name.toLowerCase().includes(q.toLowerCase()) || p.product_id.toLowerCase().includes(q.toLowerCase()));
	const [formData, setFormData] = (0, import_react.useState)({
		product_id: `P${Math.floor(Math.random() * 1e4)}`,
		product_name: "",
		description: "",
		category: "",
		price: "",
		stock: "",
		image: ""
	});
	const [editFormData, setEditFormData] = (0, import_react.useState)({
		product_id: "",
		product_name: "",
		description: "",
		category: "",
		price: "",
		stock: "",
		image: ""
	});
	const createProductMutation = useMutation({
		mutationFn: async () => {
			const priceNum = parseFloat(formData.price);
			const stockNum = parseInt(formData.stock, 10);
			await api.products.create({
				product_id: formData.product_id,
				product_name: formData.product_name,
				description: formData.description,
				category: formData.category,
				price: priceNum,
				stock: stockNum,
				image: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
			});
			await api.inventory.create({
				inventory_id: `inv_${formData.product_id}`,
				product_id: formData.product_id,
				available_stock: stockNum,
				reserved_stock: 0,
				warehouse_location: "Primary Fulfillment Center"
			});
		},
		onSuccess: () => {
			toast.success("Product created successfully!");
			setIsDialogOpen(false);
			setFormData({
				product_id: `P${Math.floor(Math.random() * 1e4)}`,
				product_name: "",
				description: "",
				category: "",
				price: "",
				stock: "",
				image: ""
			});
			queryClient.invalidateQueries({ queryKey: ["products"] });
			queryClient.invalidateQueries({ queryKey: ["inventory"] });
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Failed to create product");
		}
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		createProductMutation.mutate();
	};
	const updateProductMutation = useMutation({
		mutationFn: async () => {
			const priceNum = parseFloat(editFormData.price);
			await api.products.update(editFormData.product_id, {
				product_name: editFormData.product_name,
				description: editFormData.description,
				category: editFormData.category,
				price: priceNum,
				image: editFormData.image
			});
		},
		onSuccess: () => {
			toast.success("Product updated successfully!");
			setIsEditDialogOpen(false);
			queryClient.invalidateQueries({ queryKey: ["products"] });
		},
		onError: (err) => {
			toast.error(err instanceof Error ? err.message : "Failed to update product");
		}
	});
	const handleEditSubmit = (e) => {
		e.preventDefault();
		updateProductMutation.mutate();
	};
	const openEditDialog = (p) => {
		setEditFormData({
			product_id: p.product_id,
			product_name: p.product_name,
			description: p.description,
			category: p.category,
			price: p.price.toString(),
			stock: p.stock.toString(),
			image: p.image || ""
		});
		setIsEditDialogOpen(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex flex-wrap items-center justify-between gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Products"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage your catalog via Product Service"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "bg-gradient-brand",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " New product"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[425px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add New Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create a new product in the catalog. It will automatically be registered in the live inventory system." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product ID (SKU)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formData.product_id,
									onChange: (e) => setFormData({
										...formData,
										product_id: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formData.product_name,
									onChange: (e) => setFormData({
										...formData,
										product_name: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.category,
										onChange: (e) => setFormData({
											...formData,
											category: e.target.value
										}),
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.01",
										value: formData.price,
										onChange: (e) => setFormData({
											...formData,
											price: e.target.value
										}),
										required: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Initial Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: formData.stock,
									onChange: (e) => setFormData({
										...formData,
										stock: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formData.description,
									onChange: (e) => setFormData({
										...formData,
										description: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image URL (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formData.image,
									onChange: (e) => setFormData({
										...formData,
										image: e.target.value
									}),
									placeholder: "https://example.com/image.jpg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsDialogOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: createProductMutation.isPending,
									children: [createProductMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save Product"]
								})]
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isEditDialogOpen,
				onOpenChange: setIsEditDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[425px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Update product details. Note: Product ID and Stock cannot be changed here (Stock is managed by Inventory Service)." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEditSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Product ID (SKU)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editFormData.product_id,
									disabled: true,
									className: "bg-muted text-muted-foreground"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editFormData.product_name,
									onChange: (e) => setEditFormData({
										...editFormData,
										product_name: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editFormData.category,
										onChange: (e) => setEditFormData({
											...editFormData,
											category: e.target.value
										}),
										required: true
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Price" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.01",
										value: editFormData.price,
										onChange: (e) => setEditFormData({
											...editFormData,
											price: e.target.value
										}),
										required: true
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: editFormData.stock,
									disabled: true,
									className: "bg-muted text-muted-foreground"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editFormData.description,
									onChange: (e) => setEditFormData({
										...editFormData,
										description: e.target.value
									}),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Image URL (Optional)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editFormData.image,
									onChange: (e) => setEditFormData({
										...editFormData,
										image: e.target.value
									}),
									placeholder: "https://example.com/image.jpg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsEditDialogOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									disabled: updateProductMutation.isPending,
									children: [updateProductMutation.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save Changes"]
								})]
							})
						]
					})]
				})
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "shadow-soft",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mb-4 max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search products…",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "SKU" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Price" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Master Stock" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Actions"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "text-center py-8 text-muted-foreground",
				children: "Loading products..."
			}) }) : list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "text-center py-8 text-muted-foreground",
				children: "No products found."
			}) }) : list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
						alt: "",
						className: "h-10 w-10 rounded-lg object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: p.product_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground line-clamp-1 max-w-[200px]",
						children: p.description
					})] })]
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-muted-foreground",
					children: p.product_id
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.category }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", p.price] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.stock === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "destructive",
					children: "Out"
				}) : p.stock < 20 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					className: "bg-warning/10 text-warning border-0",
					children: [p.stock, " left"]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: p.stock }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "text-right",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => openEditDialog(p),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "icon",
						variant: "ghost",
						onClick: () => toast.success("Delete coming soon"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})]
				})
			] }, p.product_id)) })] })]
		})
	})] });
}
//#endregion
export { AdminProducts as component };
