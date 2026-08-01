import type { Role, AuthUser } from "@/lib/auth-store";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Lock, Mail, Loader2, ShieldCheck, Zap, LayoutDashboard, User, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { cognitoLogin } from "@/lib/cognito-auth";
import { signUp, confirmSignUp, resetPassword, confirmResetPassword } from "aws-amplify/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Angadi Hub Commerce" },
      { name: "description", content: "Sign in to the Angadi Hub enterprise commerce platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);
  
  const [mode, setMode] = useState<"login" | "register" | "verify" | "forgot_password" | "reset_password">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify(e: React.FormEvent) {
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
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await resetPassword({ username: email });
      toast.success("Password reset code sent to your email.");
      setMode("reset_password");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !otp || !password) return;
    setLoading(true);
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: otp,
        newPassword: password,
      });
      toast.success("Password reset successfully! Please sign in.");
      setMode("login");
      setPassword("");
      setOtp("");
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "register" && !name)) return;
    setLoading(true);

    try {
      if (mode === "register") {
        await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              email,
              name,
            }
          }
        });
        toast.success("Registration successful! Please check your email for the verification code.");
        setMode("verify");
      } else {
        const result = await cognitoLogin(email, password);
        
        if (!result.session) {
           if (result.nextStep?.signInStep === 'CONFIRM_SIGN_UP') {
               toast.error("Please verify your email address to continue.");
               setMode("verify");
               return;
           }
           toast.success("Please complete your setup.");
           return;
        }

        const idToken = result.session.tokens?.idToken;
        if (!idToken) throw new Error("No ID token returned");

        const payload = idToken.payload as any;
        const groups = payload["cognito:groups"] || [];
        const role = groups.includes("ADMIN") ? "ADMIN" : "CUSTOMER";

        const { fetchUserAttributes } = await import("aws-amplify/auth");
        const attributes = await fetchUserAttributes();

        const user = {
          id: payload.sub as string,
          email: payload.email as string,
          name: (attributes.name || payload.name || payload.email) as string,
          role: role as Role,
        };

        const tokens = {
          accessToken: idToken.toString(), // Using idToken as accessToken so our backend can read claims
          refreshToken: "mock-refresh",
          idToken: idToken.toString(),
          expiresAt: payload.exp ? payload.exp * 1000 : Date.now() + 3600000
        };

        setAuth(user, tokens);
        toast.success("Login successful");
        nav({ to: role === "ADMIN" ? "/admin/dashboard" : "/shop" });
      }
    } catch (err: any) {
      if (err.name === "UserNotConfirmedException" || err.message?.includes("User is not confirmed")) {
        toast.error("Please verify your email address to continue.");
        setMode("verify");
      } else {
        toast.error(err.message || "Authentication error");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSuccess(credentialResponse: any) {
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

  return (
    <GoogleOAuthProvider clientId="100000000000-dummyclientid.apps.googleusercontent.com">
      <div className="grid min-h-screen lg:grid-cols-2 bg-background">
        {/* Brand side */}
        <div className="relative hidden overflow-hidden lg:block bg-[url('/luxury_login_bg.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/30 to-transparent" />
          
          <div className="relative flex h-full flex-col justify-between p-16 text-white z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 1, ease: "easeOut" }}
              className="flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden">
                <img src="/logo.jpg" alt="Angadi Hub Logo" className="w-full h-full object-cover mix-blend-overlay opacity-90" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">Angadi Hub</span>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            >
              <div className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 text-xs font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                The Luxury Collection
              </div>
              <h1 className="text-6xl font-black leading-[1.05] tracking-tight text-white drop-shadow-2xl">
                Elevate your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 font-serif italic pr-4">
                  Lifestyle.
                </span>
              </h1>
              <p className="mt-8 max-w-md text-xl text-white/90 font-medium leading-relaxed drop-shadow-md">
                Discover a curated selection of premium products. Access your personalized concierge dashboard.
              </p>
              
              <div className="mt-14 grid gap-8">
                {[
                  { i: ShieldCheck, t: "Private & Secure", d: "Bank-level encryption for your absolute peace of mind." },
                  { i: Zap, t: "Priority Access", d: "Get early access to exclusive drops and VIP collections." },
                ].map((f, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 + (idx * 0.15) }}
                    key={f.t} 
                    className="flex items-start gap-5 group"
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 group-hover:bg-white/20 transition-all duration-500 group-hover:scale-105 shadow-xl">
                      <f.i className="h-6 w-6 text-amber-300" />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-lg font-bold text-white tracking-wide">{f.t}</h3>
                      <p className="text-sm text-white/70 mt-1 leading-relaxed">{f.d}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <div className="text-sm font-semibold tracking-wider text-white/60 uppercase">© 2026 Angadi Hub Luxury</div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="mb-12 flex items-center justify-center gap-3 lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-2xl overflow-hidden">
                <img src="/logo.jpg" alt="Angadi Hub Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-3xl font-extrabold tracking-tight">Angadi Hub</span>
            </div>

            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold tracking-tight text-foreground font-serif">
                {mode === "login" ? "Welcome Back" : 
                 mode === "register" ? "Join the Club" : 
                 mode === "forgot_password" ? "Reset Password" : "Check Your Email"}
              </h2>
              <p className="mt-3 text-base text-muted-foreground font-medium">
                {mode === "login" 
                  ? "Sign in to access your exclusive benefits."
                  : mode === "register" 
                    ? "Create an account to begin your premium journey."
                    : mode === "forgot_password"
                      ? "Enter your email to receive a password reset code."
                      : "Follow the instructions sent to your email."}
              </p>
            </div>

            <div className="bg-card/40 backdrop-blur-2xl border border-border shadow-2xl rounded-[2rem] p-10 relative overflow-hidden">
              {/* Card subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.div 
                  key={mode} 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -15 }} 
                  transition={{ duration: 0.4 }}
                  className="space-y-7 relative z-10"
                >
                  {mode === "login" || mode === "register" ? (
                    <>
                      <div className="flex justify-center">
                        <div className="transform hover:scale-[1.02] transition-transform duration-300 w-full flex justify-center">
                          <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google login failed")}
                            useOneTap
                            shape="pill"
                            theme="outline"
                            size="large"
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                        <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
                          <span className="bg-card/80 backdrop-blur-xl px-4 text-muted-foreground">Or</span>
                        </div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-5">
                        {mode === "register" && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                              <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base" autoComplete="name" />
                            </div>
                          </motion.div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base" autoComplete="email" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between ml-1">
                            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</Label>
                            {mode === "login" && (
                              <button type="button" className="text-xs font-bold tracking-wide text-primary hover:underline" onClick={() => setMode("forgot_password")}>Forgot password?</button>
                            )}
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base" autoComplete={mode === "login" ? "current-password" : "new-password"} />
                          </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4">
                          {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                          {mode === "login" ? "Sign In Securely" : "Create Account"}
                        </Button>
                        
                        <div className="text-center text-sm font-medium text-muted-foreground pt-6">
                          {mode === "login" ? (
                            <>
                              New to Angadi Hub?{" "}
                              <button type="button" onClick={() => setMode("register")} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
                                Request an Invite
                              </button>
                            </>
                          ) : (
                            <>
                              Already a member?{" "}
                              <button type="button" onClick={() => setMode("login")} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
                                Sign In
                              </button>
                            </>
                          )}
                        </div>
                      </form>
                    </>
                  ) : mode === "verify" ? (
                    <form onSubmit={handleVerify} className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                          <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold font-serif text-foreground">Verify Your Account</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                          We've sent a verification code to <span className="font-semibold text-foreground">{email || "your email"}</span>.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="otp" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Verification Code</Label>
                        <div className="relative group">
                          <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base text-center tracking-widest" autoComplete="one-time-code" />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading || !otp} className="w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4">
                        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                        Verify Account
                      </Button>
                      
                      <div className="text-center text-sm font-medium text-muted-foreground pt-4">
                        <button type="button" onClick={() => setMode("login")} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  ) : mode === "forgot_password" ? (
                    <form onSubmit={handleForgotPassword} className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                          <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="forgot-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base" />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading || !email} className="w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4">
                        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                        Send Reset Code
                      </Button>
                      
                      <div className="text-center text-sm font-medium text-muted-foreground pt-4">
                        <button type="button" onClick={() => setMode("login")} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                          <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          Enter the code sent to <span className="font-semibold text-foreground">{email}</span> and your new password.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="reset-otp" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Verification Code</Label>
                        <div className="relative group">
                          <KeyRound className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input id="reset-otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base tracking-widest text-center" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="new-password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">New Password</Label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                          <Input id="new-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-12 h-14 bg-background/50 border-border focus-visible:ring-primary/50 rounded-2xl transition-all shadow-sm text-base" />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading || !otp || !password} className="w-full h-14 rounded-2xl bg-gradient-brand shadow-glow hover:shadow-elegant text-lg font-bold tracking-wide transition-all duration-300 hover:-translate-y-1 mt-4">
                        {loading ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : null}
                        Reset Password
                      </Button>
                      
                      <div className="text-center text-sm font-medium text-muted-foreground pt-4">
                        <button type="button" onClick={() => setMode("login")} className="font-bold text-foreground hover:text-primary transition-colors hover:underline">
                          Back to Sign In
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
