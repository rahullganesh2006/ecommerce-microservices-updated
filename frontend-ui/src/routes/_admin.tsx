import { cognitoLogout } from "@/lib/cognito-auth";
import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import {
  LayoutDashboard, Package, Warehouse, ShoppingBag, CreditCard, Users, BarChart3,
  FileText, Bell, Settings, Cloud, LogOut, Search, Menu, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const { isAuthenticated, user } = useAuth.getState();
    if (!isAuthenticated || !user) throw redirect({ to: "/login", search: { redirect: location.href } as never });
    if (user.role !== "ADMIN") throw redirect({ to: "/unauthorized" });
  },
  component: AdminLayout,
});

const NAV = [
  { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/inventory", icon: Warehouse, label: "Inventory" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/payments", icon: CreditCard, label: "Payments" },
  { to: "/admin/customers", icon: Users, label: "Customers" },
  { to: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
] as const;

function SidebarInner({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-glow overflow-hidden">
          <img src="/logo.jpg" alt="Angadi Hub Logo" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-tight">Angadi Hub</div>
          <div className="text-[10px] uppercase tracking-wider text-sidebar-foreground/60">Admin Console</div>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((n) => {
          const active = pathname.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />}
              <n.icon className="h-4 w-4" />
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function AdminLayout() {
  const nav = useNavigate();
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
  try {
    // Sign out from Cognito
    await cognitoLogout();

    // Clear Zustand auth state
    logout();

    toast.success("Signed out successfully");

    nav({ to: "/login" });
  } catch (error) {
    console.error(error);
    toast.error("Failed to sign out");
  }
}

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-64">
          <SidebarInner pathname={pathname} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarInner pathname={pathname} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="hidden flex-1 items-center gap-2 text-sm sm:flex ml-2">
              <span className="text-muted-foreground">Admin Console</span>
              <span className="text-muted-foreground/50">/</span>
              <span className="font-medium text-foreground capitalize">
                {pathname.split("/").filter(Boolean).pop()?.replace("-", " ") || "Dashboard"}
              </span>
            </div>
            
            <div className="ml-auto flex items-center gap-3">


              <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={() => nav({ to: "/admin/notifications" })}>
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-gradient-brand text-xs text-primary-foreground">
                        {user?.name?.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left text-xs sm:block">
                      <div className="font-medium leading-tight">{user?.name}</div>
                      <div className="text-muted-foreground">Administrator</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => nav({ to: "/admin/settings" })}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 p-4 sm:p-6 lg:p-8"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
