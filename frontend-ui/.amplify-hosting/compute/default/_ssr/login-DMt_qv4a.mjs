import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as useAuth } from "./auth-store-C1LOKWKa.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-BprOe8gQ.mjs";
import { a as confirmSignUp, c as signUp, o as confirmResetPassword, s as resetPassword } from "../_libs/@aws-amplify/auth+[...].mjs";
import { t as cognitoLogin } from "./cognito-auth-BqXre1jH.mjs";
import { H as KeyRound, I as Mail, R as Lock, b as ShieldCheck, c as User, t as Zap, z as LoaderCircle } from "../_libs/lucide-react.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Input } from "./input-CITjGSX3.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as GoogleOAuthProvider, t as GoogleLogin } from "../_libs/react-oauth__google.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DMt_qv4a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const nav = useNavigate();
	const setAuth = useAuth((s) => s.setAuth);
	const [mode, setMode] = (0, import_react.useState)("login");
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	async function handleVerify(e) {
		e.preventDefault();
		if (!email || !otp) return;
		setLoading(true);
		try {
			await confirmSignUp({
				username: email,
				confirmationCode: otp
			});
			toast.success("Account verified successfully! Please sign in.");
			setMode("login");
		} catch (err) {
			toast.error(err.message || "Verification failed");
		} finally {
			setLoading(false);
		}
	}
	async function handleForgotPassword(e) {
		e.preventDefault();
		if (!email) return;
		setLoading(true);
		try {
			await resetPassword({ username: email });
			toast.success("Password reset code sent to your email.");
			setMode("reset_password");
		} catch (err) {
			toast.error(err.message || "Failed to send reset code");
		} finally {
			setLoading(false);
		}
	}
	async function handleResetPassword(e) {
		e.preventDefault();
		if (!email || !otp || !password) return;
		setLoading(true);
		try {
			await confirmResetPassword({
				username: email,
				confirmationCode: otp,
				newPassword: password
			});
			toast.success("Password reset successfully! Please sign in.");
			setMode("login");
			setPassword("");
			setOtp("");
		} catch (err) {
			toast.error(err.message || "Failed to reset password");
		} finally {
			setLoading(false);
		}
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!email || !password || mode === "register" && !name) return;
		setLoading(true);
		try {
			if (mode === "register") {
				await signUp({
					username: email,
					password,
					options: { userAttributes: {
						email,
						name
					} }
				});
				toast.success("Registration successful! Please check your email for the verification code.");
				setMode("verify");
			} else {
				const result = await cognitoLogin(email, password);
				if (!result.session) {
					if (result.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
						toast.error("Please verify your email address to continue.");
						setMode("verify");
						return;
					}
					toast.success("Please complete your setup.");
					return;
				}
				const idToken = result.session.tokens?.idToken;
				if (!idToken) throw new Error("No ID token returned");
				const payload = idToken.payload;
				const role = (payload["cognito:groups"] || []).includes("ADMIN") ? "ADMIN" : "CUSTOMER";
				const { fetchUserAttributes } = await import("../_libs/aws-amplify.mjs").then((n) => n.t);
				const attributes = await fetchUserAttributes();
				const user = {
					id: payload.sub,
					email: payload.email,
					name: attributes.name || payload.name || payload.email,
					role
				};
				const tokens = {
					accessToken: idToken.toString(),
					refreshToken: "mock-refresh",
					idToken: idToken.toString(),
					expiresAt: payload.exp ? payload.exp * 1e3 : Date.now() + 36e5
				};
				setAuth(user, tokens);
				toast.success("Login successful");
				nav({ to: role === "ADMIN" ? "/admin/dashboard" : "/shop" });
			}
		} catch (err) {
			if (err.name === "UserNotConfirmedException" || err.message?.includes("User is not confirmed")) {
				toast.error("Please verify your email address to continue.");
				setMode("verify");
			} else toast.error(err.message || "Authentication error");
		} finally {
			setLoading(false);
		}
	}
	async function handleGoogleSuccess(credentialResponse) {
		setLoading(true);
		try {
			const res = await fetch("http://localhost:8005/auth/google", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token: credentialResponse.credential })
			});
			if (!res.ok) throw new Error(await res.text());
			const data = await res.json();
			setAuth(data.user, data.tokens);
			toast.success("Login successful");
			nav({ to: data.user.role === "ADMIN" ? "/admin/dashboard" : "/shop" });
		} catch (err) {
			toast.error("Google login failed");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleOAuthProvider, {
		clientId: "100000000000-dummyclientid.apps.googleusercontent.com",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid min-h-screen lg:grid-cols-2 bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative hidden overflow-hidden lg:block bg-[url('/luxury_login_bg.jpg')] bg-cover bg-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-black/20 backdrop-blur-[2px]" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-full flex-col justify-between p-16 text-white z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									x: -20
								},
								animate: {
									opacity: 1,
									x: 0
								},
								transition: {
									duration: 1,
									ease: "easeOut"
								},
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/logo.jpg",
										alt: "Angadi Hub Logo",
										className: "w-full h-full object-cover mix-blend-overlay opacity-90"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold tracking-tight text-white drop-shadow-md",
									children: "Angadi Hub"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
								initial: {
									opacity: 0,
									y: 40
								},
								animate: {
									opacity: 1,
									y: 0
								},
								transition: {
									duration: 1,
									delay: .3,
									ease: "easeOut"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg",
										children: "The Luxury Collection"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "text-6xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl",
										children: [
											"Elevate your ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-serif italic pr-4",
												children: "Lifestyle."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-8 max-w-md text-xl text-white/90 font-medium leading-relaxed drop-shadow-md",
										children: "Discover a curated selection of premium products. Access your personalized concierge dashboard."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-14 grid gap-8",
										children: [{
											i: ShieldCheck,
											t: "Private & Secure",
											d: "Bank-level encryption for your absolute peace of mind."
										}, {
											i: Zap,
											t: "Priority Access",
											d: "Get early access to exclusive drops and VIP collections."
										}].map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
											initial: {
												opacity: 0,
												x: -20
											},
											animate: {
												opacity: 1,
												x: 0
											},
											transition: {
												duration: .7,
												delay: .6 + idx * .15
											},
											className: "flex items-start gap-5 group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-105 shadow-xl",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.i, { className: "h-6 w-6 text-amber-300" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-lg font-bold text-white tracking-wide",
													children: f.t
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm text-white/70 mt-1 leading-relaxed",
													children: f.d
												})]
											})]
										}, f.t))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-semibold tracking-wider text-white/60 uppercase",
								children: "© 2026 Angadi Hub Luxury"
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
						initial: {
							opacity: 0,
							scale: .95
						},
						animate: {
							opacity: 1,
							scale: 1
						},
						transition: {
							duration: .8,
							type: "spring",
							bounce: .3
						},
						className: "w-full max-w-md relative z-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-12 flex items-center justify-center gap-3 lg:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-2xl overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: "/logo.jpg",
										alt: "Angadi Hub Logo",
										className: "w-full h-full object-cover"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-extrabold tracking-tight",
									children: "Angadi Hub"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-4xl font-bold tracking-tight text-foreground font-serif",
									children: mode === "login" ? "Welcome Back" : mode === "register" ? "Join the Club" : mode === "forgot_password" ? "Reset Password" : "Check Your Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-base text-muted-foreground font-medium",
									children: mode === "login" ? "Sign in to access your exclusive benefits." : mode === "register" ? "Create an account to begin your premium journey." : mode === "forgot_password" ? "Enter your email to receive a password reset code." : "Follow the instructions sent to your email."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card/40 backdrop-blur-2xl border border-border shadow-2xl rounded-[2rem] p-10 relative overflow-hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
									mode: "wait",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
										initial: {
											opacity: 0,
											y: 15
										},
										animate: {
											opacity: 1,
											y: 0
										},
										exit: {
											opacity: 0,
											y: -15
										},
										transition: { duration: .4 },
										className: "space-y-7 relative z-10",
										children: mode === "login" || mode === "register" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex justify-center",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "transform hover:scale-[1.02] transition-transform duration-300 w-full flex justify-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleLogin, {
														onSuccess: handleGoogleSuccess,
														onError: () => toast.error("Google login failed"),
														useOneTap: true,
														shape: "pill",
														theme: "outline",
														size: "large"
													})
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute inset-0 flex items-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-full border-t border-border" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative flex justify-center text-xs uppercase font-bold tracking-widest",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "bg-card/80 backdrop-blur-xl px-4 text-muted-foreground",
														children: "Or"
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
												onSubmit: handleSubmit,
												className: "space-y-5",
												children: [
													mode === "register" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
														initial: {
															opacity: 0,
															height: 0
														},
														animate: {
															opacity: 1,
															height: "auto"
														},
														className: "space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "name",
															className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1",
															children: "Full Name"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "relative group",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "name",
																type: "text",
																required: true,
																value: name,
																onChange: (e) => setName(e.target.value),
																placeholder: "John Doe",
																className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base",
																autoComplete: "name"
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															htmlFor: "email",
															className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1",
															children: "Email Address"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "relative group",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "email",
																type: "email",
																required: true,
																value: email,
																onChange: (e) => setEmail(e.target.value),
																placeholder: "you@company.com",
																className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base",
																autoComplete: "email"
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between ml-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
																htmlFor: "password",
																className: "text-xs font-bold uppercase tracking-widest text-muted-foreground",
																children: "Password"
															}), mode === "login" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																className: "text-xs font-bold tracking-wide text-primary hover:underline",
																onClick: () => setMode("forgot_password"),
																children: "Forgot password?"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "relative group",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																id: "password",
																type: "password",
																required: true,
																value: password,
																onChange: (e) => setPassword(e.target.value),
																placeholder: "••••••••",
																className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base",
																autoComplete: mode === "login" ? "current-password" : "new-password"
															})]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														type: "submit",
														disabled: loading,
														className: "w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4",
														children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-6 w-6 animate-spin" }) : null, mode === "login" ? "Sign In Securely" : "Create Account"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-center text-sm font-medium text-muted-foreground pt-6",
														children: mode === "login" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															"New to Angadi Hub?",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setMode("register"),
																className: "font-bold text-foreground hover:text-primary transition-colors hover:underline",
																children: "Request an Invite"
															})
														] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															"Already a member?",
															" ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => setMode("login"),
																className: "font-bold text-foreground hover:text-primary transition-colors hover:underline",
																children: "Sign In"
															})
														] })
													})
												]
											})
										] }) : mode === "verify" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: handleVerify,
											className: "space-y-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-center mb-6",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-8 w-8 text-primary" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "text-2xl font-bold font-serif text-foreground",
															children: "Verify Your Account"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "mt-2 text-sm text-muted-foreground",
															children: [
																"We've sent a verification code to ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "font-semibold text-foreground",
																	children: email || "your email"
																}),
																"."
															]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "otp",
														className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1",
														children: "Verification Code"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative group",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "otp",
															type: "text",
															required: true,
															value: otp,
															onChange: (e) => setOtp(e.target.value),
															placeholder: "Enter 6-digit code",
															className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base text-center tracking-widest",
															autoComplete: "one-time-code"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "submit",
													disabled: loading || !otp,
													className: "w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4",
													children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-6 w-6 animate-spin" }) : null, "Verify Account"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center text-sm font-medium text-muted-foreground pt-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("login"),
														className: "font-bold text-foreground hover:text-primary transition-colors hover:underline",
														children: "Back to Sign In"
													})
												})
											]
										}) : mode === "forgot_password" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: handleForgotPassword,
											className: "space-y-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center mb-6",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-8 w-8 text-primary" })
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "forgot-email",
														className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1",
														children: "Email Address"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative group",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "forgot-email",
															type: "email",
															required: true,
															value: email,
															onChange: (e) => setEmail(e.target.value),
															placeholder: "you@company.com",
															className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "submit",
													disabled: loading || !email,
													className: "w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4",
													children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-6 w-6 animate-spin" }) : null, "Send Reset Code"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center text-sm font-medium text-muted-foreground pt-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("login"),
														className: "font-bold text-foreground hover:text-primary transition-colors hover:underline",
														children: "Back to Sign In"
													})
												})
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: handleResetPassword,
											className: "space-y-5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-center mb-6",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-8 w-8 text-primary" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-2 text-sm text-muted-foreground",
														children: [
															"Enter the code sent to ",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-foreground",
																children: email
															}),
															" and your new password."
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "reset-otp",
														className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1",
														children: "Verification Code"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative group",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "reset-otp",
															type: "text",
															required: true,
															value: otp,
															onChange: (e) => setOtp(e.target.value),
															placeholder: "6-digit code",
															className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base tracking-widest text-center"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "new-password",
														className: "text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1",
														children: "New Password"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative group",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															id: "new-password",
															type: "password",
															required: true,
															value: password,
															onChange: (e) => setPassword(e.target.value),
															placeholder: "••••••••",
															className: "pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base"
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													type: "submit",
													disabled: loading || !otp || !password,
													className: "w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4",
													children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-6 w-6 animate-spin" }) : null, "Reset Password"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center text-sm font-medium text-muted-foreground pt-4",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => setMode("login"),
														className: "font-bold text-foreground hover:text-primary transition-colors hover:underline",
														children: "Back to Sign In"
													})
												})
											]
										})
									}, mode)
								})]
							})
						]
					})
				]
			})]
		})
	});
}
//#endregion
export { LoginPage as component };
