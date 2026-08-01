globalThis.__nitro_main__ = import.meta.url;
import { a as toEventHandler, c as toNodeHandler, i as defineLazyEventHandler, n as HTTPError, r as defineHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { Server } from "node:http";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-07-16T10:39:15.984Z",
		"size": 20373,
		"path": "../../static/favicon.ico"
	},
	"/logo.jpg": {
		"type": "image/jpeg",
		"etag": "\"50f52-czQ1FXwMGDhUPK3E/X0vf9zdKuc\"",
		"mtime": "2026-07-31T10:05:28.809Z",
		"size": 331602,
		"path": "../../static/logo.jpg"
	},
	"/assets/api-client-Coul5nXL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b6a-HEqt7tnOCq7LeTTHSCchiuiyjuM\"",
		"mtime": "2026-08-01T17:58:56.001Z",
		"size": 2922,
		"path": "../../static/assets/api-client-Coul5nXL.js"
	},
	"/assets/arrow-left-CBA0mIRP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-Co816rAY8Xul8wEQ+5zkTThwbT4\"",
		"mtime": "2026-08-01T17:58:56.002Z",
		"size": 165,
		"path": "../../static/assets/arrow-left-CBA0mIRP.js"
	},
	"/assets/AnimatePresence-B_WuFs55.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"107b-YP2VftJzmlf7iMAJxLbYjJDLdGI\"",
		"mtime": "2026-08-01T17:58:55.981Z",
		"size": 4219,
		"path": "../../static/assets/AnimatePresence-B_WuFs55.js"
	},
	"/assets/arrow-right-BC7Pa-9k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a5-Av0jYPl8lpMmLBOVR/hPgD8uXQw\"",
		"mtime": "2026-08-01T17:58:56.002Z",
		"size": 165,
		"path": "../../static/assets/arrow-right-BC7Pa-9k.js"
	},
	"/assets/assertValidationError-D8vl2LXz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"fbf-01ezqd9Z3wg71Fxgi+jkU+ZJtP0\"",
		"mtime": "2026-08-01T17:58:56.002Z",
		"size": 4031,
		"path": "../../static/assets/assertValidationError-D8vl2LXz.js"
	},
	"/assets/auth-Dhhj7XmH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8ab9-3uXZ34OKeteWCtAj8608xgGT008\"",
		"mtime": "2026-08-01T17:58:56.004Z",
		"size": 35513,
		"path": "../../static/assets/auth-Dhhj7XmH.js"
	},
	"/assets/avatar-CerPcJUu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"aa9-x7+gk8AwWVkN6fNwvYJVOg4fByY\"",
		"mtime": "2026-08-01T17:58:56.004Z",
		"size": 2729,
		"path": "../../static/assets/avatar-CerPcJUu.js"
	},
	"/assets/badge-CnQRYBaE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"34b-iefqqq8lWlETm+tJb+ZlCmuqOL0\"",
		"mtime": "2026-08-01T17:58:56.004Z",
		"size": 843,
		"path": "../../static/assets/badge-CnQRYBaE.js"
	},
	"/assets/bell-CkC9aY6D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"122-DwC83Is6kFG4HubTOV/rbs1ENGw\"",
		"mtime": "2026-08-01T17:58:56.005Z",
		"size": 290,
		"path": "../../static/assets/bell-CkC9aY6D.js"
	},
	"/assets/billing-store-CnynuTCe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"251-MR1/dc/R5g6Fbq6gqwb+9baLU4E\"",
		"mtime": "2026-08-01T17:58:56.005Z",
		"size": 593,
		"path": "../../static/assets/billing-store-CnynuTCe.js"
	},
	"/assets/button-B_Pp2cTu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"583-atH7LAJSx+uuHjbvNIwi9P1+yaE\"",
		"mtime": "2026-08-01T17:58:56.006Z",
		"size": 1411,
		"path": "../../static/assets/button-B_Pp2cTu.js"
	},
	"/assets/calendar-0C65y1k0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101-afGolkWNlew0IBIgeNW/DnCLFhQ\"",
		"mtime": "2026-08-01T17:58:56.006Z",
		"size": 257,
		"path": "../../static/assets/calendar-0C65y1k0.js"
	},
	"/assets/card-Cw0WHwef.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"456-xpwkxSCsk1DYv4CioclUoZJIKbw\"",
		"mtime": "2026-08-01T17:58:56.008Z",
		"size": 1110,
		"path": "../../static/assets/card-Cw0WHwef.js"
	},
	"/assets/cart-store-Dseu9yGh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"708-gmxxxRbZV7oJB9dvHWgOABR2+Fg\"",
		"mtime": "2026-08-01T17:58:56.008Z",
		"size": 1800,
		"path": "../../static/assets/cart-store-Dseu9yGh.js"
	},
	"/assets/chevron-down-QStO9sdm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"80-fP1GzwSpcIgGDcLA9jKOkSUzm7w\"",
		"mtime": "2026-08-01T17:58:56.008Z",
		"size": 128,
		"path": "../../static/assets/chevron-down-QStO9sdm.js"
	},
	"/assets/chevron-right-5EGWJIB2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-46qs1q/k66PnEWUPDSlofD+gv0s\"",
		"mtime": "2026-08-01T17:58:56.009Z",
		"size": 130,
		"path": "../../static/assets/chevron-right-5EGWJIB2.js"
	},
	"/assets/circle-check-DODl_Bio.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b2-WwFCIsrESzS7vsooiJoEL99i840\"",
		"mtime": "2026-08-01T17:58:56.010Z",
		"size": 178,
		"path": "../../static/assets/circle-check-DODl_Bio.js"
	},
	"/assets/circle-xdfx0x5D.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"82-cvUnO0eiIEFFgx+uXUEIyZh9/GY\"",
		"mtime": "2026-08-01T17:58:56.010Z",
		"size": 130,
		"path": "../../static/assets/circle-xdfx0x5D.js"
	},
	"/assets/createLucideIcon-C3-9FVOn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d7-Z9cNu+/L/cffV/h72vXwAPv3mwE\"",
		"mtime": "2026-08-01T17:58:56.012Z",
		"size": 1239,
		"path": "../../static/assets/createLucideIcon-C3-9FVOn.js"
	},
	"/assets/credit-card-Bl5IJBDT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cf-NpRCTSqs0hn2gZSYkKy3S/ltANE\"",
		"mtime": "2026-08-01T17:58:56.013Z",
		"size": 207,
		"path": "../../static/assets/credit-card-Bl5IJBDT.js"
	},
	"/assets/cognito-auth-085uJ1cF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1213e-+QXd+oHL8x+JkKHPGgUIbtDcr+M\"",
		"mtime": "2026-08-01T17:58:56.011Z",
		"size": 74046,
		"path": "../../static/assets/cognito-auth-085uJ1cF.js"
	},
	"/abstract_login_bg.jpg": {
		"type": "image/jpeg",
		"etag": "\"9ff5a-awkqxW3t7mFO/ArVq1wMSh66xVQ\"",
		"mtime": "2026-07-31T15:54:22.572Z",
		"size": 655194,
		"path": "../../static/abstract_login_bg.jpg"
	},
	"/luxury_login_bg.jpg": {
		"type": "image/jpeg",
		"etag": "\"83695-9/PtjK3J7sAAgsecVJuyFAZ/Fzo\"",
		"mtime": "2026-07-31T17:10:46.971Z",
		"size": 538261,
		"path": "../../static/luxury_login_bg.jpg"
	},
	"/assets/dialog-CLPMA_lq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"87e-M/gI/kUQ8GyCgShfzEa6jfYzQCc\"",
		"mtime": "2026-08-01T17:58:56.013Z",
		"size": 2174,
		"path": "../../static/assets/dialog-CLPMA_lq.js"
	},
	"/assets/dist-0hIRcxQF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1137-YEExxrVl6oD8v/CQYYR8NR3CqcY\"",
		"mtime": "2026-08-01T17:58:56.014Z",
		"size": 4407,
		"path": "../../static/assets/dist-0hIRcxQF.js"
	},
	"/assets/dist-B2q7R2gJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92f-q34TB9rQKOu7MDfPTD1LAfS4JOI\"",
		"mtime": "2026-08-01T17:58:56.014Z",
		"size": 2351,
		"path": "../../static/assets/dist-B2q7R2gJ.js"
	},
	"/assets/dist-B6Qy5xto.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7f-I5FfQ6YZNZROuwy2hsPEYyGeVFo\"",
		"mtime": "2026-08-01T17:58:56.015Z",
		"size": 2687,
		"path": "../../static/assets/dist-B6Qy5xto.js"
	},
	"/assets/dist-B9UJa972.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49d-GPUxQLRH1gFsTiw+mEXdGnSwLu0\"",
		"mtime": "2026-08-01T17:58:56.015Z",
		"size": 1181,
		"path": "../../static/assets/dist-B9UJa972.js"
	},
	"/assets/dist-BBM6GMuc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"faa-wvTeNq5DXhNZh++DfTvp/GPh2NM\"",
		"mtime": "2026-08-01T17:58:56.016Z",
		"size": 4010,
		"path": "../../static/assets/dist-BBM6GMuc.js"
	},
	"/assets/dist-BlEzofZ2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"285-qkmhIi5vBLDdFw65C3P7eCk3B24\"",
		"mtime": "2026-08-01T17:58:56.017Z",
		"size": 645,
		"path": "../../static/assets/dist-BlEzofZ2.js"
	},
	"/assets/dist-BOKjVz1j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"67e6-odB2mNmnDeVRKo5XzkB+YvXAqD4\"",
		"mtime": "2026-08-01T17:58:56.017Z",
		"size": 26598,
		"path": "../../static/assets/dist-BOKjVz1j.js"
	},
	"/assets/dist-C1RJhgYD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"281-K2XQEy4dSuaU+NZeVCiNF1cCMKU\"",
		"mtime": "2026-08-01T17:58:56.017Z",
		"size": 641,
		"path": "../../static/assets/dist-C1RJhgYD.js"
	},
	"/assets/dist-D87vZHDr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f3-CZ3aPBijNlPiP8sn9n5wXhiAzj0\"",
		"mtime": "2026-08-01T17:58:56.017Z",
		"size": 243,
		"path": "../../static/assets/dist-D87vZHDr.js"
	},
	"/assets/dist-DK8dAp6R.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"12d-zj/x8VNy4Gwu904KxTbB/TAk3aA\"",
		"mtime": "2026-08-01T17:58:56.017Z",
		"size": 301,
		"path": "../../static/assets/dist-DK8dAp6R.js"
	},
	"/assets/dist-DnBMlJxR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"570-gAVG4vVGJ3iHB60NTEY441cI/tc\"",
		"mtime": "2026-08-01T17:58:56.017Z",
		"size": 1392,
		"path": "../../static/assets/dist-DnBMlJxR.js"
	},
	"/assets/dist-DnltLtFh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c2-zzDSssszN0iee8YPiIr61JpaZxE\"",
		"mtime": "2026-08-01T17:58:56.021Z",
		"size": 1218,
		"path": "../../static/assets/dist-DnltLtFh.js"
	},
	"/assets/dist-MNo6bWDS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25a-24VUP+UxBsPT+l4ZpRQuASvyqao\"",
		"mtime": "2026-08-01T17:58:56.022Z",
		"size": 602,
		"path": "../../static/assets/dist-MNo6bWDS.js"
	},
	"/assets/download-_mveqGQ6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e8-pWRc6XwWenGmSvTrhdtk9n3J1eY\"",
		"mtime": "2026-08-01T17:58:56.022Z",
		"size": 232,
		"path": "../../static/assets/download-_mveqGQ6.js"
	},
	"/assets/es2015-C3NNBeQz.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"527f-cx69mih0+tBGIyhwJAH5mLrIdLc\"",
		"mtime": "2026-08-01T17:58:56.022Z",
		"size": 21119,
		"path": "../../static/assets/es2015-C3NNBeQz.js"
	},
	"/assets/fetchAuthSession-B_JQEu0_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4d-w05v89BtFlwZrA4tiBWrByo8fEc\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 77,
		"path": "../../static/assets/fetchAuthSession-B_JQEu0_.js"
	},
	"/assets/file-text-BsStovZG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-XQ9CJzwALTRCIhZ+xMYm9Qs0/f8\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 385,
		"path": "../../static/assets/file-text-BsStovZG.js"
	},
	"/assets/heart-8Z00Wc_I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102-MqdP+lJLGZaV/SYpF4/cbAdKgYU\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 258,
		"path": "../../static/assets/heart-8Z00Wc_I.js"
	},
	"/assets/index.es-DCvMcLJC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"24f45-GJz/6EQZwn/GVLHcSaepD1ZxmdE\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 151365,
		"path": "../../static/assets/index.es-DCvMcLJC.js"
	},
	"/assets/input-Bs5_vMmX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"299-V1kIBkTnuQS2gsnMuplw4i7ORA4\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 665,
		"path": "../../static/assets/input-Bs5_vMmX.js"
	},
	"/assets/html2canvas-CshxQvNN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"30b8d-nt1FVLhcCKhaGHjxZjLX/QCcQ60\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 199565,
		"path": "../../static/assets/html2canvas-CshxQvNN.js"
	},
	"/assets/index-oFZqd6_n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"47147-Du08iYseM1RccX7/D34DBQSpY1c\"",
		"mtime": "2026-08-01T17:58:55.981Z",
		"size": 291143,
		"path": "../../static/assets/index-oFZqd6_n.js"
	},
	"/assets/jspdf.es.min-D-XuOXGN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"617f7-RVJGVL8GyD4GaSMNKOInT9eXpmg\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 399351,
		"path": "../../static/assets/jspdf.es.min-D-XuOXGN.js"
	},
	"/assets/jspdf.plugin.autotable-DqrTSeJY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7424-dZZb3tl2R62fSXHpiDVUPerElPU\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 29732,
		"path": "../../static/assets/jspdf.plugin.autotable-DqrTSeJY.js"
	},
	"/assets/jsx-runtime-CaR_m4Xc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1edb-YA3tihQJPH2usBIGDc+C49NkLY4\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 7899,
		"path": "../../static/assets/jsx-runtime-CaR_m4Xc.js"
	},
	"/assets/link-zmP0Vj4l.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"464f-OoyuCBHUiogCXgeouZ6/jblkELk\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 17999,
		"path": "../../static/assets/link-zmP0Vj4l.js"
	},
	"/assets/label-BVnEc3Ed.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bd-Lt1GuUISJ/qLY1mjLzvoROLGyLo\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 701,
		"path": "../../static/assets/label-BVnEc3Ed.js"
	},
	"/assets/loader-circle-CGlvUOEy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"90-K6U2Wg8z39QdxXC3DEUqJ3nZtEk\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 144,
		"path": "../../static/assets/loader-circle-CGlvUOEy.js"
	},
	"/assets/login-DH7xTNBZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6958-EBaYK9WlexcAqg7tnIxIfW/g/3g\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 26968,
		"path": "../../static/assets/login-DH7xTNBZ.js"
	},
	"/assets/lock-CJa_bJkx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ce-fp1qQD18DhrR5/stRPs5hvBu5YU\"",
		"mtime": "2026-08-01T17:58:56.023Z",
		"size": 206,
		"path": "../../static/assets/lock-CJa_bJkx.js"
	},
	"/assets/mail-ByzsXNCg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d5-0kA/b/o07PWeOvdOyIvB4ZYjyUw\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 213,
		"path": "../../static/assets/mail-ByzsXNCg.js"
	},
	"/assets/Match-D6q4FbQ_.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be94-g/02zWoP3i8LU1KpzKoIolbHTxk\"",
		"mtime": "2026-08-01T17:58:55.981Z",
		"size": 48788,
		"path": "../../static/assets/Match-D6q4FbQ_.js"
	},
	"/assets/middleware-BjV00EjE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a26-glHPYkztltHRSU1c5bJNuduvVn4\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 2598,
		"path": "../../static/assets/middleware-BjV00EjE.js"
	},
	"/assets/monitor-BJEX1k5W.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"103-fKzsO0iFA92Nl0pM7R3/47Np6ec\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 259,
		"path": "../../static/assets/monitor-BJEX1k5W.js"
	},
	"/assets/package-dwkOyAaV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"174-sutYlOr6gBxmE1nFIqxkv/6Ls7c\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 372,
		"path": "../../static/assets/package-dwkOyAaV.js"
	},
	"/assets/pencil-58r2ObTm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-L9qszTy/eydsi1eCVVaBwfqhkRU\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 276,
		"path": "../../static/assets/pencil-58r2ObTm.js"
	},
	"/assets/product-card-CTMkFJyk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1977-ksHvO1B2UKsG7IrMEZelC3fOvIg\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 6519,
		"path": "../../static/assets/product-card-CTMkFJyk.js"
	},
	"/assets/QueryClientProvider-XKBrPPUC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3b28-gzRDuDdjWcRv9ZnlUTkusQvoq98\"",
		"mtime": "2026-08-01T17:58:55.981Z",
		"size": 15144,
		"path": "../../static/assets/QueryClientProvider-XKBrPPUC.js"
	},
	"/assets/purify.es-DuRL7t6i.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"68ff-UzqdquwlS23jMr/0lDNWmxy5AL0\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 26879,
		"path": "../../static/assets/purify.es-DuRL7t6i.js"
	},
	"/assets/react-dom-uEpu2rGo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e06-iAd91dqrbuWQTWAeFkOuqKPkQ40\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 3590,
		"path": "../../static/assets/react-dom-uEpu2rGo.js"
	},
	"/assets/redirect-1Dss4sOM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-AhfiXwQqYdLrM+uQAOtPHfIddmI\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 534,
		"path": "../../static/assets/redirect-1Dss4sOM.js"
	},
	"/assets/rolldown-runtime-CNC7AqOf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36f-poL7VEo+W3rlEpE8cNtjWDVI11g\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 879,
		"path": "../../static/assets/rolldown-runtime-CNC7AqOf.js"
	},
	"/assets/search-qDAaxz1c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ae-ZvMRjGfxGljYvar9Uw1RxOFaTPo\"",
		"mtime": "2026-08-01T17:58:56.036Z",
		"size": 174,
		"path": "../../static/assets/search-qDAaxz1c.js"
	},
	"/assets/select-DvOP6O31.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5809-To2EOFPxZytoJfqdft2rjGpnsUU\"",
		"mtime": "2026-08-01T17:58:56.038Z",
		"size": 22537,
		"path": "../../static/assets/select-DvOP6O31.js"
	},
	"/assets/routes-DJ7LAi8J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26-SoFMfAHVJ5oqB5t+mpFRoQvFIoc\"",
		"mtime": "2026-08-01T17:58:56.036Z",
		"size": 38,
		"path": "../../static/assets/routes-DJ7LAi8J.js"
	},
	"/assets/separator-B1bBUuQi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"325-WCLDfGKcSsMOjunDpFU76Co08Ng\"",
		"mtime": "2026-08-01T17:58:56.039Z",
		"size": 805,
		"path": "../../static/assets/separator-B1bBUuQi.js"
	},
	"/assets/sheet-D6FKg3oY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"62b8-j23wnc7WZ8NPKRflkGPu72dxBz8\"",
		"mtime": "2026-08-01T17:58:56.039Z",
		"size": 25272,
		"path": "../../static/assets/sheet-D6FKg3oY.js"
	},
	"/assets/proxy-D2s3CPhQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d862-5s6QQjg//3yZga6bRkyaWQTsB5I\"",
		"mtime": "2026-08-01T17:58:56.031Z",
		"size": 120930,
		"path": "../../static/assets/proxy-D2s3CPhQ.js"
	},
	"/assets/shield-check-BLWxrMul.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"140-4+3KhwHOt67+VcciWusyLlMnRSU\"",
		"mtime": "2026-08-01T17:58:56.039Z",
		"size": 320,
		"path": "../../static/assets/shield-check-BLWxrMul.js"
	},
	"/assets/shopping-bag-DfJ3diX4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"154-8BcXk4UW7gwDBjjJgQ8LSOOpEDA\"",
		"mtime": "2026-08-01T17:58:56.039Z",
		"size": 340,
		"path": "../../static/assets/shopping-bag-DfJ3diX4.js"
	},
	"/assets/shopping-cart-tOOnJkzy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"124-plwy58lc3s+d6/wT+t5IJSkKif8\"",
		"mtime": "2026-08-01T17:58:56.041Z",
		"size": 292,
		"path": "../../static/assets/shopping-cart-tOOnJkzy.js"
	},
	"/assets/smartphone-DTK4NG0m.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c5-yqonUJ1+ptBUqJL1iQ3rT3ox7hM\"",
		"mtime": "2026-08-01T17:58:56.041Z",
		"size": 197,
		"path": "../../static/assets/smartphone-DTK4NG0m.js"
	},
	"/assets/star-DCUBIqew.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d8-RJAZmaaVX6gLwH8FSz225NNJbOg\"",
		"mtime": "2026-08-01T17:58:56.041Z",
		"size": 472,
		"path": "../../static/assets/star-DCUBIqew.js"
	},
	"/assets/switch-JAjN_G8p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1256-Yt3QFLDF12cwCQwhz9VcY5Oc9HE\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 4694,
		"path": "../../static/assets/switch-JAjN_G8p.js"
	},
	"/assets/tabs-uorbgdmA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df5-EJgDbDBWPzh3wNfaqupK+bG9FvY\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 3573,
		"path": "../../static/assets/tabs-uorbgdmA.js"
	},
	"/assets/table-Dkywo88T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"698-HjzQCgJ71EU+Dr9sSVLiHxi5C6g\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 1688,
		"path": "../../static/assets/table-Dkywo88T.js"
	},
	"/assets/trash-2-C_xKEbFv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ac-dQArb+MLs77lQKJ5ypFbsp3BpWI\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 428,
		"path": "../../static/assets/trash-2-C_xKEbFv.js"
	},
	"/assets/styles-DgSWsI1y.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1de7a-Vd6kBJ9KyX9TlKrgpEey/s6RRxw\"",
		"mtime": "2026-08-01T17:58:56.054Z",
		"size": 122490,
		"path": "../../static/assets/styles-DgSWsI1y.css"
	},
	"/assets/truck-C2WuL0xr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"196-0/YC1afp/hVwPOtsGGC6JFv24/g\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 406,
		"path": "../../static/assets/truck-C2WuL0xr.js"
	},
	"/assets/triangle-alert-HDzPy-eo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-xoi0LT9UyBS48NfyNl3jVkErHuM\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 265,
		"path": "../../static/assets/triangle-alert-HDzPy-eo.js"
	},
	"/assets/tslib.es6-xF4D3P3n.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b4-UlfsYqQgDo/8I5H4/tXAY94PXu4\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 2228,
		"path": "../../static/assets/tslib.es6-xF4D3P3n.js"
	},
	"/assets/useMatch-BB6xmZBl.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c3-8UfwOdXGpD+73OQ29xUo5Gikagc\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 707,
		"path": "../../static/assets/useMatch-BB6xmZBl.js"
	},
	"/assets/typeof-B5XbjTb1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10f-yPXEOGyFHb1Ws7OoWyWNEEBz4mQ\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 271,
		"path": "../../static/assets/typeof-B5XbjTb1.js"
	},
	"/assets/unauthorized-Bz00fWDk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a9-T3z9d9VOvjD8pZ8U4IYs+E4JlOI\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 1193,
		"path": "../../static/assets/unauthorized-Bz00fWDk.js"
	},
	"/assets/useQuery-Dcfvsa5P.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2290-ZCDeJzwNyNRozN1lx0Nmi97RLD4\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 8848,
		"path": "../../static/assets/useQuery-Dcfvsa5P.js"
	},
	"/assets/user-BCGsSS5z.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c4-RFWID2TFvc9Yy9KU3LLTAcJEypM\"",
		"mtime": "2026-08-01T17:58:56.051Z",
		"size": 196,
		"path": "../../static/assets/user-BCGsSS5z.js"
	},
	"/assets/useRouter-CzUf6OTR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-rpI+YDuvA1qRXzEb2JQg17tZQFw\"",
		"mtime": "2026-08-01T17:58:56.050Z",
		"size": 195,
		"path": "../../static/assets/useRouter-CzUf6OTR.js"
	},
	"/assets/useMutation-CuwrMOZ5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"925-Leg3O3ZklEv+4hArblS2eqrK5uA\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 2341,
		"path": "../../static/assets/useMutation-CuwrMOZ5.js"
	},
	"/assets/users-BADt_x2t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132-/CkV2/qALgUKzzM9rt5zHrL9k3c\"",
		"mtime": "2026-08-01T17:58:56.051Z",
		"size": 306,
		"path": "../../static/assets/users-BADt_x2t.js"
	},
	"/assets/trending-up-DWU-Qdbp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5d12d-Y0eAoJRS4uSLorhCCGEZY0qXPZ4\"",
		"mtime": "2026-08-01T17:58:56.043Z",
		"size": 381229,
		"path": "../../static/assets/trending-up-DWU-Qdbp.js"
	},
	"/assets/useStore-C23k5geH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1582-ZA9h8f+P768Q06SDRuW17CNwp04\"",
		"mtime": "2026-08-01T17:58:56.050Z",
		"size": 5506,
		"path": "../../static/assets/useStore-C23k5geH.js"
	},
	"/assets/utils-B6KiDbIe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6a7d-iNkBSvaSyIjvZOzWoTvEa49qwcI\"",
		"mtime": "2026-08-01T17:58:56.051Z",
		"size": 27261,
		"path": "../../static/assets/utils-B6KiDbIe.js"
	},
	"/assets/warehouse-CPAnjoGC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"177-27P67ZF0SNg3svd20Ai7/PEfAmA\"",
		"mtime": "2026-08-01T17:58:56.051Z",
		"size": 375,
		"path": "../../static/assets/warehouse-CPAnjoGC.js"
	},
	"/assets/x-CvZwrRXI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-g4hIIpfM5NxQrLUTMp4rAeePuoI\"",
		"mtime": "2026-08-01T17:58:56.051Z",
		"size": 154,
		"path": "../../static/assets/x-CvZwrRXI.js"
	},
	"/assets/_admin-Bj2Orsc3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"17ca-v0FOziQYAR0BjHtceuloQTQmmz0\"",
		"mtime": "2026-08-01T17:58:55.981Z",
		"size": 6090,
		"path": "../../static/assets/_admin-Bj2Orsc3.js"
	},
	"/assets/_admin.admin.analytics-Dx5MTizG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"945b-XlFhjBXLRe6Nnw40E5FBeGqkaWA\"",
		"mtime": "2026-08-01T17:58:55.988Z",
		"size": 37979,
		"path": "../../static/assets/_admin.admin.analytics-Dx5MTizG.js"
	},
	"/assets/_admin.admin.customers-Hxyi42lv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"916-7KF8EQ3mFlwaA/xVcteZVobQSIg\"",
		"mtime": "2026-08-01T17:58:55.988Z",
		"size": 2326,
		"path": "../../static/assets/_admin.admin.customers-Hxyi42lv.js"
	},
	"/assets/zap-BGGqXlJG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"106-ayh/u8sDoOkIULZt8eBRxLDCczs\"",
		"mtime": "2026-08-01T17:58:56.051Z",
		"size": 262,
		"path": "../../static/assets/zap-BGGqXlJG.js"
	},
	"/assets/_admin.admin.notifications-WRM0swt0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b23-ptBcqadv/vWmZczmckjcPZaODJM\"",
		"mtime": "2026-08-01T17:58:55.989Z",
		"size": 2851,
		"path": "../../static/assets/_admin.admin.notifications-WRM0swt0.js"
	},
	"/assets/_admin.admin.dashboard-CYPpfn7g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2377-A62yg47UiJGE6//AxSsC1iXJmgI\"",
		"mtime": "2026-08-01T17:58:55.989Z",
		"size": 9079,
		"path": "../../static/assets/_admin.admin.dashboard-CYPpfn7g.js"
	},
	"/assets/_admin.admin.inventory-hYc8iUyk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e5b-EaQ5acsAfMgCvTm21Bo1lkNbRaU\"",
		"mtime": "2026-08-01T17:58:55.989Z",
		"size": 7771,
		"path": "../../static/assets/_admin.admin.inventory-hYc8iUyk.js"
	},
	"/assets/_admin.admin.payments-DM341rda.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"189b-bzwQnyIFXulFJle7h2pNUEW9vP8\"",
		"mtime": "2026-08-01T17:58:55.991Z",
		"size": 6299,
		"path": "../../static/assets/_admin.admin.payments-DM341rda.js"
	},
	"/assets/_admin.admin.orders-Bi0VID-V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19fe-soQUum6uugWkQ2Glg7+hUQ2W2WU\"",
		"mtime": "2026-08-01T17:58:55.991Z",
		"size": 6654,
		"path": "../../static/assets/_admin.admin.orders-Bi0VID-V.js"
	},
	"/assets/_admin.admin.products-Cdmp8_xm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25e4-DbHnztJ8aWqGQX8Z5cWsDoOWZ/0\"",
		"mtime": "2026-08-01T17:58:55.991Z",
		"size": 9700,
		"path": "../../static/assets/_admin.admin.products-Cdmp8_xm.js"
	},
	"/assets/_admin.admin.reports-CmdO0V7v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b28-7eymQR0IfUKFCYQ6B9CqTDI6q/0\"",
		"mtime": "2026-08-01T17:58:55.991Z",
		"size": 11048,
		"path": "../../static/assets/_admin.admin.reports-CmdO0V7v.js"
	},
	"/assets/_admin.admin.settings-Bv_WXa8B.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"11bd-j+8yrWp2226b2hGWBE9YCrf0FPk\"",
		"mtime": "2026-08-01T17:58:55.993Z",
		"size": 4541,
		"path": "../../static/assets/_admin.admin.settings-Bv_WXa8B.js"
	},
	"/assets/_customer.shop.cart-p7cfnz67.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1186-TJ/HXoXi3BKS6t7OqeJbrvnOf4w\"",
		"mtime": "2026-08-01T17:58:55.995Z",
		"size": 4486,
		"path": "../../static/assets/_customer.shop.cart-p7cfnz67.js"
	},
	"/assets/_customer-CNB-YfOO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31de-KdUXNK61tTb2CUS8Tyf/t0U7UzI\"",
		"mtime": "2026-08-01T17:58:55.993Z",
		"size": 12766,
		"path": "../../static/assets/_customer-CNB-YfOO.js"
	},
	"/assets/_customer.shop.checkout-BGrI_-Ro.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"49bf-kijLViEQYvNUe9V/4Norjhzcm54\"",
		"mtime": "2026-08-01T17:58:55.995Z",
		"size": 18879,
		"path": "../../static/assets/_customer.shop.checkout-BGrI_-Ro.js"
	},
	"/assets/_customer.shop.orders-BmNc_wWF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c22-QDVCtYz6zw5QAqmqf+xKXXe6nMI\"",
		"mtime": "2026-08-01T17:58:55.997Z",
		"size": 7202,
		"path": "../../static/assets/_customer.shop.orders-BmNc_wWF.js"
	},
	"/assets/_customer.shop.index-DgL0J4FV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8e4c-2SJkZE3HbGksJnQnCoHrGUdtWP0\"",
		"mtime": "2026-08-01T17:58:55.995Z",
		"size": 36428,
		"path": "../../static/assets/_customer.shop.index-DgL0J4FV.js"
	},
	"/assets/_customer.shop.products-tEzzApTt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"afe-uK3wcoFn1FyJKCDyel7w7U3jrPU\"",
		"mtime": "2026-08-01T17:58:55.997Z",
		"size": 2814,
		"path": "../../static/assets/_customer.shop.products-tEzzApTt.js"
	},
	"/assets/_customer.shop.profile-Bz2twr9x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1244-xSg0OpJ9bPOfdW50FsghkJhDVOU\"",
		"mtime": "2026-08-01T17:58:55.997Z",
		"size": 4676,
		"path": "../../static/assets/_customer.shop.profile-Bz2twr9x.js"
	},
	"/assets/_customer.shop.products_._productId-BU0Bl6IR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120c-kWdyfn94bJYyj990WCTDJ0nOVNA\"",
		"mtime": "2026-08-01T17:58:55.997Z",
		"size": 4620,
		"path": "../../static/assets/_customer.shop.products_._productId-BU0Bl6IR.js"
	},
	"/assets/_customer.shop.settings-DKJp98Jk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3299-BpvWPzlCJkUrcqLfrZCJDk8Up1E\"",
		"mtime": "2026-08-01T17:58:55.997Z",
		"size": 12953,
		"path": "../../static/assets/_customer.shop.settings-DKJp98Jk.js"
	},
	"/assets/_customer.shop.wishlist-sj_AdX4a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5a9-eCRSy4O5zqr0oLvYkti75ITtxL4\"",
		"mtime": "2026-08-01T17:58:56.001Z",
		"size": 1449,
		"path": "../../static/assets/_customer.shop.wishlist-sj_AdX4a.js"
	},
	"/images/banners/carousel_banner_2_1785478579139.jpg": {
		"type": "image/jpeg",
		"etag": "\"a4fcf-NbLcrNJRwceJlg7INWsUxrBiHl0\"",
		"mtime": "2026-07-31T06:16:19.172Z",
		"size": 675791,
		"path": "../../static/images/banners/carousel_banner_2_1785478579139.jpg"
	},
	"/images/banners/carousel_banner_1_1785478567235.jpg": {
		"type": "image/jpeg",
		"etag": "\"a17cb-H7a0Bva7HJ1PAS+2G6/cI7w+umQ\"",
		"mtime": "2026-07-31T06:16:07.241Z",
		"size": 661451,
		"path": "../../static/images/banners/carousel_banner_1_1785478567235.jpg"
	},
	"/images/banners/carousel_banner_3_1785478591370.jpg": {
		"type": "image/jpeg",
		"etag": "\"9250f-R9HIsWlfvluXhsj/Vs2Iunk7jdI\"",
		"mtime": "2026-07-31T06:16:31.375Z",
		"size": 599311,
		"path": "../../static/images/banners/carousel_banner_3_1785478591370.jpg"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_Sp4BfV = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_Sp4BfV
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/aws-amplify/runtime/aws-amplify.mjs
new Server(toNodeHandler(useNitroApp().fetch)).listen(3e3, (err) => {
	if (err) console.error(err);
	else console.log(`Listening on http://localhost:3000 (AWS Amplify Hosting)`);
});
//#endregion
export {};
