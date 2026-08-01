import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./_ssr/auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./_ssr/button-BprOe8gQ.mjs";
import { i as updatePassword } from "./_libs/@aws-amplify/auth+[...].mjs";
import { M as Monitor, R as Lock, c as User } from "./_libs/lucide-react.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as CardHeader, n as CardContent, o as CardTitle, r as CardDescription, t as Card } from "./_ssr/card-xVPC106M.mjs";
import { t as Input } from "./_ssr/input-CITjGSX3.mjs";
import { t as Label } from "./_ssr/label-BPuF5-mq.mjs";
import { t as Switch } from "./_ssr/switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_admin.admin.settings-BYkXZZlh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminSettings() {
	const user = useAuth((s) => s.user);
	const [dark, setDark] = (0, import_react.useState)(false);
	const [oldPassword, setOldPassword] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [isUpdating, setIsUpdating] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const v = localStorage.getItem("cc.theme") === "dark";
		setDark(v);
		document.documentElement.classList.toggle("dark", v);
	}, []);
	function toggle(v) {
		setDark(v);
		document.documentElement.classList.toggle("dark", v);
		localStorage.setItem("cc.theme", v ? "dark" : "light");
	}
	async function handlePasswordChange(e) {
		e.preventDefault();
		if (newPassword !== confirmPassword) return toast.error("New passwords do not match");
		if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
		setIsUpdating(true);
		try {
			await updatePassword({
				oldPassword,
				newPassword
			});
			toast.success("Password updated successfully!");
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");
		} catch (err) {
			toast.error(err.message || "Failed to update password");
		} finally {
			setIsUpdating(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold tracking-tight",
			children: "Settings"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Manage your account and platform preferences"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-primary" }), " Profile Information"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Your personal account details." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: user?.name || "",
									disabled: true,
									className: "bg-muted/50"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: user?.email || "",
									disabled: true,
									className: "bg-muted/50"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: user?.role || "ADMIN",
									disabled: true,
									className: "bg-muted/50"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Monitor, { className: "h-5 w-5 text-primary" }), " Preferences"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Customize your console experience." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-base",
								children: "Dark mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Console theme"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: dark,
								onCheckedChange: toggle
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-base",
								children: "Slack alerts"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Post low-stock and failed-payment alerts"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, { defaultChecked: true })]
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-soft",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-5 w-5 text-primary" }), " Change Password"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Update your account password securely." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handlePasswordChange,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									required: true,
									value: oldPassword,
									onChange: (e) => setOldPassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									required: true,
									value: newPassword,
									onChange: (e) => setNewPassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Confirm New Password" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									required: true,
									value: confirmPassword,
									onChange: (e) => setConfirmPassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: isUpdating,
								className: "w-full mt-2",
								children: isUpdating ? "Updating..." : "Update Password"
							})
						]
					}) })]
				})
			})]
		})]
	});
}
//#endregion
export { AdminSettings as component };
