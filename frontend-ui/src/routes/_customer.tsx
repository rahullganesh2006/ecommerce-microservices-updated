import { cognitoLogout } from "@/lib/cognito-auth";
import { createFileRoute, Outlet, redirect, Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";
import { useCart } from "@/lib/cart-store";
import { Cloud, ShoppingCart, Heart, User, Bell, LogOut, Home, Package, Receipt, Settings, Menu, Twitter, Instagram, Facebook, Youtube, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
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
        <div className="mx-auto flex h-16 w-full items-center gap-4 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <Link to="/shop" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-brand shadow-elegant overflow-hidden">
              <img src="/logo.jpg" alt="Angadi Hub Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-base font-semibold tracking-tight">Angadi Hub</span>
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
        className="mx-auto w-full px-4 py-8 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <Outlet />
      </motion.main>

      <footer className="relative overflow-hidden border-t-0 bg-slate-950 pt-24 pb-12 mt-12 text-slate-300 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -top-64 -left-64 h-96 w-96 rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-64 -right-64 h-96 w-96 rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

        <div className="relative mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Brand Section */}
            <div className="space-y-6">
              <Link to="/shop" className="flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand shadow-lg overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:shadow-primary/25">
                  <img src="/logo.jpg" alt="Angadi Hub Logo" className="w-full h-full object-cover" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-white group-hover:text-primary transition-colors">Angadi Hub</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                Your premier destination for next-generation electronics and unbeatable tech deals. Elevating your digital lifestyle to new heights.
              </p>
              <div className="flex gap-4 pt-2">
                {[
                  { Icon: Twitter, color: "hover:bg-sky-500 hover:text-white" },
                  { Icon: Instagram, color: "hover:bg-pink-600 hover:text-white" },
                  { Icon: Facebook, color: "hover:bg-blue-600 hover:text-white" },
                  { Icon: Youtube, color: "hover:bg-red-600 hover:text-white" },
                ].map(({ Icon, color }, i) => (
                  <a key={i} href="#" className={`h-10 w-10 rounded-full bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1 shadow-sm ${color}`}>
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-gradient-brand rounded-full inline-block"></span>
                Quick Links
              </h3>
              <ul className="space-y-4 text-sm font-medium">
                {[{ label: "Home Page", to: "/shop" }, { label: "Shop All Products", to: "/shop/products" }, { label: "Order Tracking", to: "/shop/orders" }, { label: "My Wishlist", to: "/shop/wishlist" }].map((link, i) => (
                  <li key={i}>
                    <Link to={link.to} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                      <span className="h-1 w-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-gradient-brand rounded-full inline-block"></span>
                Contact Us
              </h3>
              <ul className="space-y-5 text-sm font-medium text-slate-400">
                <li className="flex items-start gap-4 group">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <span className="mt-1 group-hover:text-slate-200 transition-colors">Phase 1, Electronic City,<br/>Bengaluru, Karnataka 560100, India</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover:text-slate-200 transition-colors">+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="h-8 w-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/50 transition-colors shrink-0">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span className="group-hover:text-slate-200 transition-colors">support@angadihub.com</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <span className="w-8 h-1 bg-gradient-brand rounded-full inline-block"></span>
                Stay Updated
              </h3>
              <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                Join our elite tech newsletter to receive the latest updates, pre-orders, and exclusive deals.
              </p>
              <form className="relative flex items-center" onSubmit={(e) => { e.preventDefault(); toast.success("Subscribed successfully!"); }}>
                <Input 
                  type="email" 
                  placeholder="Email address..." 
                  className="bg-slate-900/80 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-primary/50 h-12 rounded-2xl pr-32 w-full" 
                  required 
                />
                <Button type="submit" className="absolute right-1 h-10 rounded-xl bg-gradient-brand shadow-lg hover:shadow-primary/25 transition-all">
                  Subscribe
                </Button>
              </form>
            </div>
            
          </div>
          
          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between border-t border-slate-800/60 pt-8 gap-6 text-xs font-medium text-slate-500">
            <p className="text-center md:text-left">© {new Date().getFullYear()} Angadi Hub Commerce. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
