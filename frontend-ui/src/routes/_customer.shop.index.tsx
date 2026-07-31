import React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Truck, Sparkles, Percent } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useAuth } from "@/lib/auth-store";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/_customer/shop/")({
  component: CustomerHome,
});

function CustomerHome() {
  const user = useAuth((s) => s.user);
  
  // Use a ref for the Autoplay plugin to prevent infinite re-renders
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  const products = response?.data || [];
  
  const recommended = products.slice(0, 4);
  const latest = products.slice(4, 8);

  return (
    <div className="space-y-10">
      {/* Hero Carousel */}
      <Carousel
        plugins={[autoplayPlugin.current]}
        className="w-full"
        onMouseEnter={autoplayPlugin.current.stop}
        onMouseLeave={autoplayPlugin.current.reset}
      >
        <CarouselContent>
          {/* Slide 1 */}
          <CarouselItem>
            <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-elegant h-[400px] flex items-center"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: "url('/images/banners/carousel_banner_1_1785478567235.jpg')" }} 
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative max-w-2xl z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10">
                  <Sparkles className="h-3 w-3 text-blue-300" /> Premium Collection
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-md">Next-Gen Tech, <br/><span className="text-blue-300">Unleashed.</span></h1>
                <p className="mt-3 max-w-lg text-white/90 drop-shadow-sm text-lg">Experience the future with our curated selection of high-performance devices.</p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-500/30">
                    <Link to="/shop/products">Shop Now <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </motion.section>
          </CarouselItem>

          {/* Slide 2 */}
          <CarouselItem>
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-elegant h-[400px] flex items-center"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: "url('/images/banners/carousel_banner_2_1785478579139.jpg')" }} 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="relative max-w-2xl z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10">
                  <Truck className="h-3 w-3 text-purple-300" /> Lightning Fast
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-md">Ultra-Fast <br/><span className="text-purple-300">Delivery.</span></h1>
                <p className="mt-3 max-w-lg text-white/90 drop-shadow-sm text-lg">Order today, receive it tomorrow. Our serverless fulfillment gets it to you faster.</p>
                <div className="mt-8 flex gap-3">
                  <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg shadow-purple-500/30">
                    <Link to="/shop/orders">Track Orders</Link>
                  </Button>
                </div>
              </div>
            </motion.section>
          </CarouselItem>

          {/* Slide 3 */}
          <CarouselItem>
            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-white shadow-elegant h-[400px] flex items-center"
            >
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: "url('/images/banners/carousel_banner_3_1785478591370.jpg')" }} 
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative max-w-2xl z-10">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10">
                  <Percent className="h-3 w-3 text-pink-300" /> Special Offer
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-md">Big Savings <br/><span className="text-pink-300">Every Day.</span></h1>
                <p className="mt-3 max-w-lg text-white/90 drop-shadow-sm text-lg">Explore massive discounts on top-tier electronics. Don't miss out.</p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-500 text-white rounded-full shadow-lg shadow-pink-500/30">
                    <Link to="/shop/products">View Deals <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
                  </Button>
                </div>
              </div>
            </motion.section>
          </CarouselItem>
        </CarouselContent>
      </Carousel>

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
