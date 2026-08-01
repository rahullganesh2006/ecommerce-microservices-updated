import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BprOe8gQ.mjs";
import { x as ShieldAlert } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/unauthorized-B3dOwWwI.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "flex min-h-screen items-center justify-center bg-background px-4",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-md text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-8 w-8 text-destructive" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "403 — Unauthorized"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Your role doesn't have access to this resource."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6 bg-gradient-brand",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					children: "Back to sign in"
				})
			})
		]
	})
});
//#endregion
export { SplitComponent as component };
