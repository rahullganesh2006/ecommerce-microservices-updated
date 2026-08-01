import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { $ as Circle, Z as CreditCard, g as Smartphone, j as PackageOpen, o as Wallet, t as Zap, tt as CircleCheck, u as Truck, ut as Banknote, z as LoaderCircle } from "./_libs/lucide-react.mjs";
import { _ as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as AnimatePresence, t as motion } from "./_libs/framer-motion.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as api } from "./_ssr/api-client-DDlHUadL.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as Label } from "./_ssr/label-BPuF5-mq.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "./_libs/@radix-ui/react-radio-group+[...].mjs";
import { t as useCart } from "./_ssr/cart-store-D2Bmtscz.mjs";
import { t as useBilling } from "./_ssr/billing-store-UiWAZg61.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.checkout-C8cjKZOI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var PAYMENT_METHOD_MAP = {
	card: "CARD",
	upi: "UPI",
	netbanking: "NET_BANKING",
	wallet: "WALLET",
	cod: "COD"
};
var FADE_UP = {
	hidden: {
		opacity: 0,
		y: 20
	},
	show: {
		opacity: 1,
		y: 0,
		transition: {
			type: "spring",
			stiffness: 300,
			damping: 24
		}
	}
};
var STAGGER = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: { staggerChildren: .1 }
	}
};
function CheckoutPage() {
	const nav = useNavigate();
	const user = useAuth((s) => s.user);
	const items = useCart((s) => s.items);
	const subtotal = useCart((s) => s.subtotal());
	const clear = useCart((s) => s.clear);
	const [method, setMethod] = (0, import_react.useState)("card");
	const [processing, setProcessing] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [card, setCard] = (0, import_react.useState)({
		number: "",
		expiry: "",
		cvv: ""
	});
	const [upi, setUpi] = (0, import_react.useState)("");
	const [bank, setBank] = (0, import_react.useState)("");
	const [wallet, setWallet] = (0, import_react.useState)("");
	const tax = subtotal * .18;
	const shipping = subtotal > 500 ? 0 : 15;
	const total = subtotal + tax + shipping;
	function validate() {
		if (method === "card") {
			if (card.number.replace(/\D/g, "").length !== 16) {
				toast.error("Card number must be 16 digits");
				return false;
			}
			if (!card.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) {
				toast.error("Expiry must be in MM/YY format");
				return false;
			}
			if (card.cvv.replace(/\D/g, "").length < 3) {
				toast.error("CVV must be at least 3 digits");
				return false;
			}
		} else if (method === "upi") {
			if (!upi.includes("@") || upi.length < 5) {
				toast.error("Enter a valid UPI ID (e.g., name@bank)");
				return false;
			}
		} else if (method === "netbanking") {
			if (!bank.trim()) {
				toast.error("Please enter your bank name");
				return false;
			}
		} else if (method === "wallet") {
			if (wallet.replace(/\D/g, "").length < 10) {
				toast.error("Enter a valid 10-digit mobile number");
				return false;
			}
		}
		return true;
	}
	async function pay() {
		if (!user) {
			toast.error("Please sign in first");
			return;
		}
		if (!validate()) return;
		setProcessing(true);
		try {
			const backendPaymentMethod = PAYMENT_METHOD_MAP[method] || "CARD";
			const fullAddress = user?.address ? `${user.address}, ${user.city}, ${user.zip}` : "221 Baker Street, Apt 4B, Chennai, 600001";
			await api.cart.checkout(user.email, {
				payment_method: backendPaymentMethod,
				shipping_address: fullAddress,
				customer_name: user?.name,
				email_notifications: user?.emailNotifications ?? true,
				items: items.map((i) => ({
					product_id: i.product.product_id || i.product.id,
					product_name: i.product.product_name || i.product.name,
					quantity: i.qty,
					unit_price: i.product.price,
					total_price: i.product.price * i.qty,
					cart_id: i.cart_id
				}))
			});
			setProcessing(false);
			setSuccess(true);
			clear();
			toast.success("Order placed successfully");
			setTimeout(() => nav({ to: "/shop/orders" }), 3500);
		} catch (err) {
			setProcessing(false);
			toast.error(err instanceof Error ? err.message : "Payment failed");
		}
	}
	const { paymentMethods } = useBilling();
	const savedMethods = paymentMethods.map((pm) => ({
		id: pm.id,
		i: CreditCard,
		l: `${pm.type} ending in ${pm.last4}`,
		d: `Expires ${pm.expiry}`,
		isSaved: true
	}));
	const defaultMethods = [
		{
			id: "card",
			i: CreditCard,
			l: "Credit / Debit card",
			d: "Pay securely with your card",
			isSaved: false
		},
		{
			id: "upi",
			i: Smartphone,
			l: "UPI",
			d: "Google Pay, PhonePe, Paytm",
			isSaved: false
		},
		{
			id: "netbanking",
			i: Banknote,
			l: "Net banking",
			d: "All major banks supported",
			isSaved: false
		},
		{
			id: "wallet",
			i: Wallet,
			l: "Wallet",
			d: "Amazon Pay, Mobikwik",
			isSaved: false
		},
		{
			id: "cod",
			i: PackageOpen,
			l: "Cash on Delivery",
			d: "Pay when you receive the package",
			isSaved: false
		}
	];
	const methods = [...savedMethods, ...defaultMethods];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
		mode: "wait",
		children: success ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
			initial: { opacity: 0 },
			animate: { opacity: 1 },
			exit: { opacity: 0 },
			className: "flex h-[70vh] items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
				initial: {
					scale: .8,
					opacity: 0
				},
				animate: {
					scale: 1,
					opacity: 1
				},
				transition: {
					type: "spring",
					bounce: .5
				},
				className: "text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: { scale: 0 },
						animate: { scale: 1 },
						transition: {
							delay: .2,
							type: "spring",
							stiffness: 200
						},
						className: "mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12 text-success" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.h2, {
						initial: {
							opacity: 0,
							y: 10
						},
						animate: {
							opacity: 1,
							y: 0
						},
						transition: { delay: .4 },
						className: "text-3xl font-bold tracking-tight",
						children: "Order Confirmed!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.p, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: .6 },
						className: "mt-2 text-muted-foreground",
						children: "Your items are being prepared for shipping."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: { opacity: 0 },
						animate: { opacity: 1 },
						transition: { delay: 1 },
						className: "mt-8 flex items-center justify-center gap-2 text-sm text-primary",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Redirecting to orders..."]
					})
				]
			})
		}, "success-screen") : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			variants: STAGGER,
			initial: "hidden",
			animate: "show",
			exit: {
				opacity: 0,
				y: -20,
				transition: { duration: .3 }
			},
			className: "mx-auto max-w-5xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
				variants: FADE_UP,
				className: "mb-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold tracking-tight",
					children: "Cloud Cart Checkout"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-[1fr_380px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants: FADE_UP,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden border-border/50 shadow-soft transition-all hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-muted/30 px-6 py-4 border-b border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" }), " Shipping Address"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 sm:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs text-muted-foreground uppercase tracking-wider",
												children: "Full Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "bg-muted/30 focus-visible:bg-background",
												defaultValue: user?.name ?? "Customer"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs text-muted-foreground uppercase tracking-wider",
												children: "Phone"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "bg-muted/30 focus-visible:bg-background",
												defaultValue: user?.phone || "+91 9876543210"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5 sm:col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs text-muted-foreground uppercase tracking-wider",
												children: "Address Line"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "bg-muted/30 focus-visible:bg-background",
												defaultValue: user?.address || "221 Baker Street, Apt 4B"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs text-muted-foreground uppercase tracking-wider",
												children: "City"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "bg-muted/30 focus-visible:bg-background",
												defaultValue: user?.city || "Chennai"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs text-muted-foreground uppercase tracking-wider",
												children: "ZIP Code"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "bg-muted/30 focus-visible:bg-background",
												defaultValue: user?.zip || "600001"
											})]
										})
									]
								})
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						variants: FADE_UP,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "overflow-hidden border-border/50 shadow-soft transition-all hover:shadow-md",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-muted/30 px-6 py-4 border-b border-border/50",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-primary" }), " Payment Method"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
								className: "p-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
									value: method,
									onValueChange: (v) => setMethod(v),
									className: "grid gap-4",
									children: methods.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										whileHover: { scale: 1.01 },
										whileTap: { scale: .99 },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: m.id,
											className: `relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${method === m.id ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" : "border-border/60 hover:bg-muted/30 hover:border-border"}`,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
													id: m.id,
													value: m.id,
													className: "mt-0.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 font-medium text-foreground",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(m.i, { className: `h-4 w-4 ${method === m.id ? "text-primary" : "text-muted-foreground"}` }),
																" ",
																m.l
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "mt-1 text-xs text-muted-foreground",
															children: m.d
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: method === m.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
															initial: {
																opacity: 0,
																height: 0
															},
															animate: {
																opacity: 1,
																height: "auto"
															},
															exit: {
																opacity: 0,
																height: 0
															},
															className: "overflow-hidden mt-4 pt-2 border-t border-border/50",
															onClick: (e) => e.preventDefault(),
															children: [
																method === "card" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "grid gap-3 pt-2",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																		placeholder: "Card Number (16 digits)",
																		maxLength: 16,
																		value: card.number,
																		onChange: (e) => setCard({
																			...card,
																			number: e.target.value
																		})
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "grid grid-cols-2 gap-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			placeholder: "MM/YY",
																			maxLength: 5,
																			value: card.expiry,
																			onChange: (e) => setCard({
																				...card,
																				expiry: e.target.value
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			placeholder: "CVV",
																			maxLength: 4,
																			type: "password",
																			value: card.cvv,
																			onChange: (e) => setCard({
																				...card,
																				cvv: e.target.value
																			})
																		})]
																	})]
																}),
																method === "upi" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "pt-2",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																		placeholder: "Enter UPI ID (e.g., name@okbank)",
																		value: upi,
																		onChange: (e) => setUpi(e.target.value)
																	})
																}),
																method === "netbanking" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "pt-2",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																		placeholder: "Enter Bank Name",
																		value: bank,
																		onChange: (e) => setBank(e.target.value)
																	})
																}),
																method === "wallet" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "pt-2",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																		placeholder: "10-digit Mobile Number",
																		maxLength: 10,
																		value: wallet,
																		onChange: (e) => setWallet(e.target.value)
																	})
																}),
																method === "cod" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "pt-2 text-sm text-muted-foreground",
																	children: "You will pay the delivery agent in cash or via UPI when the package arrives."
																})
															]
														}) })
													]
												}),
												method === m.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
													layoutId: "active-method",
													className: "absolute inset-0 rounded-xl border-2 border-primary/20 pointer-events-none"
												})
											]
										})
									}, m.id))
								})
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					variants: FADE_UP,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "sticky top-24 overflow-hidden border-border/50 shadow-elegant",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-primary/5 px-6 py-4 border-b border-primary/10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-semibold",
								children: "Order Summary"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-muted-foreground",
										children: [
											"Subtotal (",
											items.length,
											" items)"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: ["₹", subtotal.toFixed(2)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Taxes (GST 18%)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: ["₹", tax.toFixed(2)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Shipping"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-success",
										children: shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "my-4 border-t border-border/50" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-end justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-base font-medium",
										children: "Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.span, {
										initial: {
											opacity: 0,
											y: -10
										},
										animate: {
											opacity: 1,
											y: 0
										},
										className: "text-3xl font-bold tracking-tight text-primary",
										children: ["₹", total.toFixed(2)]
									}, total)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: pay,
									disabled: processing || subtotal === 0,
									className: "relative mt-6 w-full overflow-hidden bg-primary text-primary-foreground shadow-elegant hover:shadow-lg transition-all h-12 text-base font-semibold group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `flex items-center gap-2 transition-all ${processing ? "opacity-0" : "opacity-100 group-hover:scale-105"}`,
										children: method === "cod" ? `Place Order • ₹${total.toFixed(2)}` : `Pay ₹${total.toFixed(2)}`
									}), processing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
										initial: { opacity: 0 },
										animate: { opacity: 1 },
										className: "absolute inset-0 flex items-center justify-center gap-2 bg-primary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" }), " Processing..."]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1",
									children: "Payments are securely processed."
								})
							]
						})]
					})
				})]
			})]
		}, "checkout-form")
	});
}
//#endregion
export { CheckoutPage as component };
