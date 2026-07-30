import type { Role, AuthUser } from "@/lib/auth-store";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Lock, Mail, Loader2, ShieldCheck, Zap, LayoutDashboard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth-store";
import { cognitoLogin } from "@/lib/cognito-auth";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setLoading(true);

  try {
    const result = await cognitoLogin(email, password);

    console.log(result);

    

    const session = result.session;
    const userData = result.user!;

    if (!session?.tokens) {
      toast.error("Session tokens not found. Please try again.");
      return;
    }

    const accessToken = session.tokens.accessToken?.toString() ?? "";
    const idToken = session.tokens.idToken?.toString() ?? "";

    const groups =
      (session.tokens.idToken?.payload?.["cognito:groups"] as string[]) || [];

    const role: Role =
      groups.includes("ADMIN")
        ? "ADMIN"
        : "CUSTOMER";

    const user: AuthUser = {
      id: userData.userId,
      email,
      name: email.split("@")[0],
      role,
    };

    setAuth(user, {
      accessToken,
      refreshToken: "",
      idToken,
      expiresAt: Date.now() + 3600 * 1000,
    });

    toast.success("Login successful");

    if (role === "ADMIN") {
      nav({
        to: "/admin/dashboard",
      });
    } else {
      nav({
        to: "/shop",
      });
    }
  } catch (err) {
    console.error(err);

    toast.error(
      err instanceof Error
        ? err.message
        : "Login Failed"
    );
  } finally {
    setLoading(false);
  }
}

  function quick(role: "ADMIN" | "CUSTOMER") {
    if (role === "ADMIN") { setEmail("rahullganesh12345@gmail.com"); setPassword("Rahull@2006"); }
    else { setEmail("customer@cloudcart.io"); setPassword("Customer@2006"); }
  }

  return (
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
              Powered by AWS microservices, Amazon Cognito authentication, and a role-based control plane for admins and customers.
            </p>
            <div className="mt-10 grid gap-4">
              {[
                { i: ShieldCheck, t: "Cognito JWT with role-based access" },
                { i: Zap, t: "Lambda-backed microservices" },
                { i: LayoutDashboard, t: "AWS-console-grade admin UX" },
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

          <h2 className="text-2xl font-semibold tracking-tight">Sign in to your workspace</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use your Cognito credentials to continue.
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="pl-9" autoComplete="email" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/login" className="text-xs text-primary hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-9" autoComplete="current-password" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} />
              <Label htmlFor="remember" className="text-sm font-normal">Remember me for 30 days</Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-brand shadow-soft hover:shadow-elegant">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign in
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-dashed border-border bg-muted/40 p-4">
            <p className="text-xs font-medium text-muted-foreground">Demo accounts</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => quick("ADMIN")}>Admin</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => quick("CUSTOMER")}>Customer</Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
