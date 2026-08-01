import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { i as updatePassword } from "./_libs/@aws-amplify/auth+[...].mjs";
import { E as Plus, M as Monitor, Z as CreditCard, g as Smartphone, lt as Bell, p as Trash2, y as Shield, z as LoaderCircle } from "./_libs/lucide-react.mjs";
import { _ as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as motion } from "./_libs/framer-motion.mjs";
import { a as CardHeader, i as CardFooter, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as Label } from "./_ssr/label-BPuF5-mq.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./_ssr/dialog-Y9HmOov6.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./_ssr/tabs-BgKcOzjx.mjs";
import { t as Switch } from "./_ssr/switch-C_mzcXif.mjs";
import { t as Separator } from "./_ssr/separator-CUD9g08h.mjs";
import { t as useBilling } from "./_ssr/billing-store-UiWAZg61.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.settings-CgRNGi9o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useTheme() {
	const [dark, setDark] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const v = localStorage.getItem("cc.theme") === "dark";
		setDark(v);
		document.documentElement.classList.toggle("dark", v);
	}, []);
	return {
		dark,
		setDark: (v) => {
			setDark(v);
			document.documentElement.classList.toggle("dark", v);
			localStorage.setItem("cc.theme", v ? "dark" : "light");
		}
	};
}
function SettingsPage() {
	const { dark, setDark } = useTheme();
	const nav = useNavigate();
	const logout = useAuth((s) => s.logout);
	const user = useAuth((s) => s.user);
	const updateUser = useAuth((s) => s.updateUser);
	const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefault } = useBilling();
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [isAddingCard, setIsAddingCard] = (0, import_react.useState)(false);
	const [newCard, setNewCard] = (0, import_react.useState)({
		name: "",
		number: "",
		expiry: "",
		cvc: ""
	});
	const handleSave = () => {
		toast.success("Settings saved successfully!");
	};
	const handleUpdatePassword = async () => {
		if (!currentPassword || !newPassword) {
			toast.error("Please fill in both current and new passwords.");
			return;
		}
		setLoading(true);
		try {
			await updatePassword({
				oldPassword: currentPassword,
				newPassword
			});
			toast.success("Password updated successfully! Please log in again.");
			logout();
			nav({ to: "/login" });
		} catch (err) {
			toast.error(err.message || "Failed to update password");
		} finally {
			setLoading(false);
		}
	};
	const handleExpiryChange = (e) => {
		let val = e.target.value;
		if (newCard.expiry.length === 3 && val.length === 2 && newCard.expiry.endsWith("/")) val = val.slice(0, 1);
		else {
			val = val.replace(/\D/g, "");
			if (val.length >= 2) val = val.substring(0, 2) + "/" + val.substring(2, 4);
		}
		setNewCard({
			...newCard,
			expiry: val
		});
	};
	const handleAddCard = (e) => {
		e.preventDefault();
		if (!newCard.name || !newCard.number || !newCard.expiry) {
			toast.error("Please fill in all card details.");
			return;
		}
		const last4 = newCard.number.slice(-4) || "0000";
		addPaymentMethod({
			name: newCard.name,
			type: newCard.number.startsWith("4") ? "VISA" : "MASTERCARD",
			last4,
			expiry: newCard.expiry
		});
		toast.success("Payment method added successfully!");
		setIsAddingCard(false);
		setNewCard({
			name: "",
			number: "",
			expiry: "",
			cvc: ""
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Account Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-2",
				children: "Manage your preferences, security, and notification settings."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "appearance",
			className: "w-full flex flex-col md:flex-row gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "flex md:flex-col h-auto w-full md:w-64 bg-transparent p-0 gap-2 items-start justify-start",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "appearance",
						className: "w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-4 w-4" }), " Appearance"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "notifications",
						className: "w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), " Notifications"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "security",
						className: "w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }), " Security"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
						value: "billing",
						className: "w-full justify-start gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-xl px-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" }), " Billing"]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "appearance",
						className: "mt-0 outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .3 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-elegant border-border/50 rounded-2xl overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "bg-muted/30 border-b border-border/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Theme Preferences" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Customize how the application looks on your device." })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
									className: "p-6 space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-base font-medium",
													children: "Dark Mode"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Toggle between light and dark themes"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
												checked: dark,
												onCheckedChange: setDark,
												className: "data-[state=checked]:bg-primary"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between opacity-50 pointer-events-none",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-base font-medium",
													children: "High Contrast"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-muted-foreground",
													children: "Improve readability with high contrast colors"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {})]
										})
									]
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "notifications",
						className: "mt-0 outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .3 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-elegant border-border/50 rounded-2xl overflow-hidden",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "bg-muted/30 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Notification Channels" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Choose how you want to be kept in the loop." })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-6 space-y-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-base font-medium",
														children: "Email Alerts"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: "Receive weekly digests and important account updates"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													checked: user?.emailNotifications ?? true,
													onCheckedChange: (checked) => updateUser({ emailNotifications: checked }),
													className: "data-[state=checked]:bg-primary"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
														className: "text-base font-medium flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" }), " Push Notifications"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: "Get real-time alerts on your mobile device"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
													defaultChecked: true,
													className: "data-[state=checked]:bg-primary"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-base font-medium",
														children: "Marketing & Promos"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm text-muted-foreground",
														children: "Exclusive deals, flash sales, and early access"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { className: "data-[state=checked]:bg-primary" })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
										className: "bg-muted/10 border-t border-border/50 px-6 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: handleSave,
											className: "bg-gradient-brand shadow-soft w-full sm:w-auto",
											children: "Save Preferences"
										})
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "security",
						className: "mt-0 outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .3 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-elegant border-border/50 rounded-2xl overflow-hidden mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "bg-muted/30 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Ensure your account is using a long, random password to stay secure." })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "p-6 space-y-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												placeholder: "••••••••",
												className: "bg-muted/30 focus-visible:bg-background",
												value: currentPassword,
												onChange: (e) => setCurrentPassword(e.target.value)
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "password",
												placeholder: "••••••••",
												className: "bg-muted/30 focus-visible:bg-background",
												value: newPassword,
												onChange: (e) => setNewPassword(e.target.value)
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, {
										className: "bg-muted/10 border-t border-border/50 px-6 py-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: handleUpdatePassword,
											disabled: loading,
											variant: "default",
											className: "shadow-soft w-full sm:w-auto",
											children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Update Password"]
										})
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "billing",
						className: "mt-0 outline-none",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
							initial: {
								opacity: 0,
								y: 10
							},
							animate: {
								opacity: 1,
								y: 0
							},
							transition: { duration: .3 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "shadow-elegant border-border/50 rounded-2xl overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
									className: "bg-muted/30 border-b border-border/50 flex flex-row items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Payment Methods" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Manage your saved cards and payment methods." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
										open: isAddingCard,
										onOpenChange: setIsAddingCard,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "bg-gradient-brand shadow-soft",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1" }), " Add New"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
											className: "sm:max-w-md bg-background border-border",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add Payment Method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enter your card details to save for future checkouts." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
												onSubmit: handleAddCard,
												className: "space-y-4 mt-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name on Card" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: newCard.name,
															onChange: (e) => setNewCard({
																...newCard,
																name: e.target.value
															}),
															placeholder: "Rahull Ganesh",
															required: true
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Card Number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															value: newCard.number,
															onChange: (e) => setNewCard({
																...newCard,
																number: e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ")
															}),
															placeholder: "4242 4242 4242 4242",
															required: true,
															maxLength: 19
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-2 gap-4",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expiry" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																value: newCard.expiry,
																onChange: handleExpiryChange,
																placeholder: "MM/YY",
																required: true,
																maxLength: 5
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "CVC" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																value: newCard.cvc,
																onChange: (e) => setNewCard({
																	...newCard,
																	cvc: e.target.value.replace(/\D/g, "")
																}),
																placeholder: "123",
																type: "password",
																required: true,
																maxLength: 4
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "pt-4 flex justify-end",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															type: "submit",
															className: "bg-gradient-brand",
															children: "Save Card"
														})
													})
												]
											})]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "p-0",
									children: paymentMethods.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-12 text-center text-muted-foreground flex flex-col items-center justify-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-12 w-12 mb-4 opacity-20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "You have no saved payment methods." })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "divide-y divide-border/50",
										children: paymentMethods.map((method) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-6 flex items-center justify-between group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-12 w-16 bg-white rounded-md border flex items-center justify-center text-xs font-bold text-muted-foreground overflow-hidden",
													children: method.type === "MASTERCARD" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center -space-x-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 rounded-full bg-red-500/80 mix-blend-multiply" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 rounded-full bg-yellow-500/80 mix-blend-multiply" })]
													}) : method.type === "VISA" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-bold text-blue-700 italic tracking-tighter text-xl leading-none",
														children: "VISA"
													}) : method.type
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-medium flex items-center gap-2",
													children: [
														method.type,
														" ending in ",
														method.last4,
														method.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "bg-primary/10 text-primary text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold",
															children: "Default"
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-sm text-muted-foreground",
													children: ["Expires ", method.expiry]
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
												children: [!method.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "sm",
													onClick: () => setDefault(method.id),
													children: "Set Default"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "ghost",
													size: "icon",
													className: "text-destructive hover:text-destructive hover:bg-destructive/10",
													onClick: () => removePaymentMethod(method.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})]
											})]
										}, method.id))
									})
								})]
							})
						})
					})
				]
			})]
		})]
	});
}
//#endregion
export { SettingsPage as component };
