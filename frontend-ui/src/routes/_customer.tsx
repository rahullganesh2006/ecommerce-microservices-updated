import { cognitoLogout } from "@/lib/cognito-auth";
import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { Cloud, ShoppingCart, Heart, User, Bell, LogOut, Home, Package, Receipt, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const Route = createFileRoute("/_customer")({
  beforeLoad: ({ location }) => {
    if (typeof window === "undefined") return;
    const { isAuthenticated, user } = useAuth.getState();
    if (!isAuthenticated || !user) throw redirect({ to: "/login", search: { redirect: location.href } as never });
    if (user.role !== "CUSTOMER") throw redirect({ to: "/unauthorized" });
  },
  component: CustomerLayout,
});

const NAV = [
  { to: "/shop", icon: Home, label: "Home" },
  { to: "/shop/products", icon: Package, label: "Products" },
  { to: "/shop/orders", icon: Receipt, label: "Orders" },
  { to: "/shop/wishlist", icon: Heart, label: "Wishlist" },
] as const;

function CustomerLayout() {
  const nav = useNavigate();
  const logout = useAuth((s) => s.logout);
  const user = useAuth((s) => s.user);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.qty, 0));
  const wishCount = useCart((s) => s.wishlist.length);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link to="/shop" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-elegant">
              <Cloud className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-base font-semibold tracking-tight">CloudCart</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-1 md:flex">
            {NAV.map((n) => {
              const active = pathname === n.to || (n.to !== "/shop" && pathname.startsWith(n.to));
              return (
                <Link key={n.to} to={n.to}
                  className={`rounded-lg px-3 py-1.5 text-sm transition ${active ? "bg-muted font-medium text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >{n.label}</Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <Button variant="ghost" size="icon" className="relative" onClick={() => nav({ to: "/shop/wishlist" })}>
              <Heart className="h-4 w-4" />
              {wishCount > 0 && <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full px-1 text-[10px]">{wishCount}</Badge>}
            </Button>
            <Button variant="ghost" size="icon" className="relative" onClick={() => nav({ to: "/shop/cart" })}>
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && <Badge className="absolute -right-1 -top-1 h-4 min-w-4 rounded-full bg-gradient-brand px-1 text-[10px]">{cartCount}</Badge>}
            </Button>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-1 flex items-center rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-brand text-xs text-primary-foreground">
                      {user?.name?.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user?.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => nav({ to: "/shop/profile" })}><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => nav({ to: "/shop/settings" })}><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild><Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-4 w-4" /></Button></SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetTitle>Menu</SheetTitle>
                <div className="mt-6 space-y-1">
                  {NAV.map((n) => (
                    <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted">
                      <n.icon className="h-4 w-4" /> {n.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <motion.main key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </motion.main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        © 2026 CloudCart Commerce · Powered by AWS Serverless Microservices
      </footer>
    </div>
  );
}
