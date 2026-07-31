import type { Role, AuthUser } from "@/lib/auth-store";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Lock, Mail, Loader2, ShieldCheck, Zap, LayoutDashboard, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-store";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { cognitoLogin } from "@/lib/cognito-auth";
import { signUp } from "aws-amplify/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — CloudCart Commerce" },
      { name: "description", content: "Sign in to the CloudCart enterprise commerce platform." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const setAuth = useAuth((s) => s.setAuth);
  
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
        toast.success("Registration successful! Please check your email to verify your account.");
        setMode("login");
      } else {
        const result = await cognitoLogin(email, password);
        
        if (!result.session) {
           toast.success("Please complete your setup.");
           return;
        }

        const idToken = result.session.tokens?.idToken;
        if (!idToken) throw new Error("No ID token returned");

        const payload = idToken.payload as any;
        const groups = payload["cognito:groups"] || [];
        const role = groups.includes("ADMIN") ? "ADMIN" : "CUSTOMER";

        const user = {
          id: payload.sub as string,
          email: payload.email as string,
          name: (payload.name || payload.email) as string,
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
      toast.error(err.message || "Authentication error");
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
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand side */}
        <div className="relative hidden overflow-hidden bg-gradient-hero lg:block">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0.5px, transparent 1px), radial-gradient(circle at 70% 60%, white 0.5px, transparent 1px)", backgroundSize: "60px 60px, 90px 90px" }} />
          <div className="relative flex h-full flex-col justify-between p-12 text-primary-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                <Cloud className="h-5 w-5" />
              </div>
              <span className="text-lg font-semibold tracking-tight">CloudCart</span>
            </div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl font-bold leading-tight tracking-tight">
                Enterprise Serverless<br />E-Commerce, redefined.
              </h1>
              <p className="mt-4 max-w-md text-white/80">
                Sign in seamlessly using Google Authentication or traditional Email & Password.
              </p>
              <div className="mt-10 grid gap-4">
                {[
                  { i: ShieldCheck, t: "Secure Password Authentication" },
                  { i: Zap, t: "One-click Google Login" },
                  { i: LayoutDashboard, t: "Role-based control plane" },
                ].map((f) => (
                  <div key={f.t} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur">
                      <f.i className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-white/90">{f.t}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="text-xs text-white/60">© 2026 CloudCart Commerce Platform</div>
          </div>
        </div>

        {/* Form side */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <div className="mb-8 flex items-center gap-2 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand">
                <Cloud className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-semibold">CloudCart</span>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login" 
                ? "Sign in using Google or enter your credentials."
                : "Sign up to start shopping with us."}
            </p>

            <div className="mt-8">
              <AnimatePresence mode="wait">
                <motion.div key={mode} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                  <div className="flex justify-center mb-6">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => toast.error("Google login failed")}
                      useOneTap
                      shape="pill"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with email</span></div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {mode === "register" && (
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="pl-9" autoComplete="name" />
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-9" autoComplete="email" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" autoComplete={mode === "login" ? "current-password" : "new-password"} />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full bg-gradient-brand shadow-soft hover:shadow-elegant">
                      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      {mode === "login" ? "Sign In" : "Sign Up"}
                    </Button>
                    
                    <div className="text-center text-sm text-muted-foreground mt-4">
                      {mode === "login" ? (
                        <>
                          Don't have an account?{" "}
                          <button type="button" onClick={() => setMode("register")} className="font-semibold text-primary hover:underline">
                            Sign up
                          </button>
                        </>
                      ) : (
                        <>
                          Already have an account?{" "}
                          <button type="button" onClick={() => setMode("login")} className="font-semibold text-primary hover:underline">
                            Sign in
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
