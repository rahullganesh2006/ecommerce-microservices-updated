import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Truck, Sparkles, Percent } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/_customer/shop/")({
  component: CustomerHome,
});

function CustomerHome() {
  const user = useAuth((s) => s.user);
  
  const { data: response, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  const products = response?.data || [];
  
  const recommended = products.slice(0, 4);
  const latest = products.slice(4, 8);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-hero p-8 sm:p-12 text-primary-foreground shadow-elegant">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, white 0.5px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3 w-3" /> Welcome back, {user?.name?.split(" ")[0]}
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Discover premium tech, delivered by AWS.</h1>
          <p className="mt-3 max-w-lg text-white/85">Curated products, low-latency checkout, and real-time order tracking on our serverless platform.</p>
          <div className="mt-6 flex gap-3">
            <Button asChild size="lg" variant="secondary"><Link to="/shop/products">Shop products <ArrowRight className="ml-1.5 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="ghost" className="border border-white/25 text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"><Link to="/shop/orders">Track order</Link></Button>
          </div>
        </div>
      </motion.section>

      {/* Quick stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { i: Package, l: "Current orders", v: "2 active" },
          { i: Truck, l: "Delivery status", v: "Out for delivery" },
          { i: Percent, l: "Offer available", v: "Save up to 20%" },
          { i: Sparkles, l: "Recently viewed", v: "8 items" },
        ].map((s, i) => (
          <motion.div key={s.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-soft transition hover:shadow-elegant">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <s.i className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                  <div className="mt-0.5 font-semibold">{s.v}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Recommended for you</h2>
            <p className="text-sm text-muted-foreground">Based on your recent activity</p>
          </div>
          <Button asChild variant="ghost" size="sm"><Link to="/shop/products">View all</Link></Button>
        </div>
        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">Loading products...</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {recommended.map((p) => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Latest arrivals</h2>
          <Button asChild variant="ghost" size="sm"><Link to="/shop/products">View all</Link></Button>
        </div>
        {isLoading ? (
           <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">Loading products...</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latest.map((p) => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
