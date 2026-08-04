import type { Role, AuthUser } from "@/lib/auth-store";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Lock, Mail, Loader2, ShieldCheck, Zap, LayoutDashboard, User, KeyRound, ShoppingBag, Truck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { cognitoLogin } from "@/lib/cognito-auth";
import { signUp, confirmSignUp, resetPassword, confirmResetPassword } from "aws-amplify/auth";
import { API } from "@/api/config";

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
      const authApi = API.AUTH || "http://localhost:8005";
      const res = await fetch(`${authApi}/auth/google`, {
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

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "100000000000-dummyclientid.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <div className="min-h-screen flex bg-[#FAFAF9] font-sans">
        
        {/* Left Side: E-Commerce Branding Showcase */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 overflow-hidden">
          {/* Fashion / E-commerce Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
              alt="Luxury Fashion" 
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            {/* Amber gradient overlay for brand colors */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 via-zinc-900/80 to-zinc-900/90" />
          </div>

          <div className="relative z-10 w-full p-12 flex flex-col justify-between h-full">
            {/* Top Branding */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-white rounded-lg p-1">
                  <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <span className="text-xl font-serif font-bold text-white tracking-wide">Angadi Hub</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-8">
                <ShoppingBag className="w-3 h-3" />
                <span>Premium E-Commerce</span>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="max-w-md">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                Curated Luxury for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-500">Modern Shopper</span>
              </h1>
              
              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Exclusive Collections</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Access limited-edition drops and member-only fashion lines before anyone else.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                    <Truck className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Complimentary Shipping</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">Enjoy free premium global shipping and returns on all luxury orders.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Categories Ticker */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest mb-4">Shop By Category</p>
              <div className="flex flex-wrap gap-3">
                {['Men\'s Wear', 'Women\'s Fashion', 'Accessories', 'Luxury Watches', 'Footwear'].map((cat) => (
                  <span key={cat} className="text-xs text-zinc-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/30 transition-colors cursor-pointer">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
          
          {/* Subtle Mobile Background Accents */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none lg:hidden" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-[420px]"
          >
            <div className="lg:hidden flex items-center justify-center mb-10">
               <div className="h-14 w-14 bg-white rounded-xl shadow-md border border-amber-100 p-1">
                 <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
               </div>
            </div>

            <div className="text-center lg:text-left mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 font-serif mb-2">
                {mode === "login" ? "Welcome Back" : 
                 mode === "register" ? "Create an Account" : 
                 mode === "forgot_password" ? "Reset Password" : "Check Your Email"}
              </h2>
              <p className="text-sm text-zinc-500">
                {mode === "login" 
                  ? "Sign in to view your cart and wishlists."
                  : mode === "register" 
                    ? "Join to unlock member pricing and fast checkout."
                    : mode === "forgot_password"
                      ? "Enter your email to receive a password reset code."
                      : "Follow the instructions sent to your email."}
              </p>
            </div>

            <AnimatePresence mode="wait">
              <motion.div 
                key={mode} 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }} 
                transition={{ duration: 0.3 }}
                className="w-full bg-white rounded-[1.5rem] border border-zinc-100 shadow-xl p-8"
              >
                {mode === "login" || mode === "register" ? (
                  <>
                    <div className="w-full flex justify-center mb-6">
                      <div className="w-full flex justify-center hover:opacity-90 transition-opacity">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={() => toast.error("Google login failed")}
                          useOneTap
                          shape="rectangular"
                          theme="outline"
                          size="large"
                        />
                      </div>
                    </div>
                    
                    <div className="relative mb-6">
                      <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-200" /></div>
                      <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                        <span className="bg-white px-4 text-zinc-400">Or continue with</span>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      {mode === "register" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5">
                          <Label htmlFor="name" className="text-xs font-semibold text-zinc-700 ml-1">Full Name</Label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                            <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900" autoComplete="name" />
                          </div>
                        </motion.div>
                      )}
                      
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold text-zinc-700 ml-1">Email Address</Label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900" autoComplete="email" />
                        </div>
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between ml-1">
                          <Label htmlFor="password" className="text-xs font-semibold text-zinc-700">Password</Label>
                          {mode === "login" && (
                            <button type="button" className="text-xs font-medium text-amber-600 hover:text-amber-700 hover:underline transition-colors" onClick={() => setMode("forgot_password")}>Forgot password?</button>
                          )}
                        </div>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900" autoComplete={mode === "login" ? "current-password" : "new-password"} />
                        </div>
                      </div>

                      <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md hover:shadow-lg border border-transparent text-sm font-semibold tracking-wide transition-all mt-6">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {mode === "login" ? "Sign In to Shop" : "Create Account"}
                      </Button>
                      
                      <div className="text-center text-sm font-medium text-zinc-500 pt-5">
                        {mode === "login" ? (
                          <>
                            New to Angadi Hub?{" "}
                            <button type="button" onClick={() => setMode("register")} className="font-semibold text-zinc-900 hover:text-amber-600 transition-colors hover:underline">
                              Create an Account
                            </button>
                          </>
                        ) : (
                          <>
                            Already a member?{" "}
                            <button type="button" onClick={() => setMode("login")} className="font-semibold text-zinc-900 hover:text-amber-600 transition-colors hover:underline">
                              Sign In
                            </button>
                          </>
                        )}
                      </div>
                    </form>
                  </>
                ) : mode === "verify" ? (
                  <form onSubmit={handleVerify} className="space-y-5 w-full">
                    <div className="space-y-1.5">
                      <Label htmlFor="otp" className="text-xs font-semibold text-zinc-700 ml-1">Verification Code</Label>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                        <Input id="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit code" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900 text-center tracking-widest text-lg" autoComplete="one-time-code" />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading || !otp} className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md text-sm font-semibold transition-all mt-2">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Verify Account
                    </Button>
                    
                    <div className="text-center text-sm pt-4">
                      <button type="button" onClick={() => setMode("login")} className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                ) : mode === "forgot_password" ? (
                  <form onSubmit={handleForgotPassword} className="space-y-5 w-full">
                    <div className="space-y-1.5">
                      <Label htmlFor="forgot-email" className="text-xs font-semibold text-zinc-700 ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                        <Input id="forgot-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900" />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading || !email} className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md text-sm font-semibold transition-all mt-2">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Send Reset Code
                    </Button>
                    
                    <div className="text-center text-sm pt-4">
                      <button type="button" onClick={() => setMode("login")} className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-5 w-full">
                    <div className="space-y-1.5">
                      <Label htmlFor="reset-otp" className="text-xs font-semibold text-zinc-700 ml-1">Verification Code</Label>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                        <Input id="reset-otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900 tracking-widest text-center" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="new-password" className="text-xs font-semibold text-zinc-700 ml-1">New Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-amber-500" />
                        <Input id="new-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10 h-12 bg-zinc-50/50 border-zinc-200 focus-visible:ring-amber-500 focus-visible:border-amber-500 rounded-xl transition-all shadow-sm text-zinc-900" />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading || !otp || !password} className="w-full h-12 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md text-sm font-semibold transition-all mt-2">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Confirm Reset
                    </Button>
                    
                    <div className="text-center text-sm pt-4">
                      <button type="button" onClick={() => setMode("login")} className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors">
                        Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
