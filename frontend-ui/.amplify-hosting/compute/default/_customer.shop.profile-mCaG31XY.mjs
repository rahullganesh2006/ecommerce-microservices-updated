import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { n as AvatarFallback, t as Avatar } from "./_ssr/avatar-CcHbQ4nc.mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { r as updateUserAttributes } from "./_libs/@aws-amplify/auth+[...].mjs";
import { z as LoaderCircle } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { n as CardContent, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as Label } from "./_ssr/label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_customer.shop.profile-mCaG31XY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const user = useAuth((s) => s.user);
	const updateUser = useAuth((s) => s.updateUser);
	const [name, setName] = (0, import_react.useState)(user?.name || "");
	const [phone, setPhone] = (0, import_react.useState)(user?.phone || "+91 9876543210");
	const [country, setCountry] = (0, import_react.useState)(user?.country || "India");
	const [address, setAddress] = (0, import_react.useState)(user?.address || "");
	const [city, setCity] = (0, import_react.useState)(user?.city || "");
	const [zip, setZip] = (0, import_react.useState)(user?.zip || "");
	const [loading, setLoading] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (user) {
			if (user.name) setName(user.name);
			if (user.phone) setPhone(user.phone);
			if (user.country) setCountry(user.country);
			if (user.address) setAddress(user.address);
			if (user.city) setCity(user.city);
			if (user.zip) setZip(user.zip);
		}
	}, [user]);
	const handleSave = async () => {
		setLoading(true);
		try {
			await updateUserAttributes({ userAttributes: {
				name,
				phone_number: phone.startsWith("+") ? phone : `+91${phone}`
			} });
			updateUser({
				name,
				phone,
				country,
				address,
				city,
				zip
			});
			toast.success("Profile updated successfully");
		} catch (err) {
			toast.error(err.message || "Failed to update profile");
			updateUser({
				name,
				phone,
				country,
				address,
				city,
				zip
			});
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "mb-6 text-2xl font-semibold tracking-tight",
			children: "Profile"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "shadow-soft",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
							className: "h-16 w-16",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
								className: "bg-gradient-brand text-lg text-primary-foreground",
								children: user?.name?.split(" ").map((n) => n[0]).join("")
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold",
							children: user?.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: user?.email
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-6 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: name,
									onChange: (e) => setName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: user?.email || "",
									disabled: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone Number" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: phone,
									onChange: (e) => setPhone(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Country" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: country,
									onChange: (e) => setCountry(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Street Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: address,
									onChange: (e) => setAddress(e.target.value),
									placeholder: "123 Main St, Apt 4B"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: city,
									onChange: (e) => setCity(e.target.value),
									placeholder: "Chennai"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ZIP Code" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "bg-muted/30 focus-visible:bg-background",
									value: zip,
									onChange: (e) => setZip(e.target.value),
									placeholder: "600001"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleSave,
							disabled: loading,
							className: "bg-gradient-brand shadow-soft px-8",
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save Changes"]
						})
					})
				]
			})
		})]
	});
}
//#endregion
export { ProfilePage as component };
