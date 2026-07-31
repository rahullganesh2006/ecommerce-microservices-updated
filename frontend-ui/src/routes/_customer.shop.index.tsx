import React, { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Package, Truck, Sparkles, Percent, Smartphone, Laptop, Headphones, Watch, Camera, Monitor, X } from "lucide-react";
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
  const nav = useNavigate();
  
  // Promotional Ad State
  const [showAd, setShowAd] = useState(false);
  
  // Use a ref for the Autoplay plugin to prevent infinite re-renders
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const { data: response, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  const products = response?.data || [];
  
  const recommended = products.slice(0, 4);
  const latest = products.slice(4, 8);

  // Dynamically extract unique categories and grab a sample image for each
  const categoriesWithImage = Array.from(new Set(products.map(p => p.category).filter(Boolean))).map(c => {
    const sampleProduct = products.find(p => p.category === c && p.image);
    return {
      name: c,
      image: sampleProduct?.image || null
    };
  });

  const CATEGORY_STYLES: Record<string, { i: any, color: string }> = {
    "phones": { i: Smartphone, color: "from-blue-500 to-cyan-400" },
    "laptops": { i: Laptop, color: "from-purple-500 to-pink-400" },
    "audio": { i: Headphones, color: "from-amber-400 to-orange-500" },
    "wearables": { i: Watch, color: "from-emerald-400 to-teal-500" },
    "cameras": { i: Camera, color: "from-rose-400 to-red-500" },
    "accessories": { i: Monitor, color: "from-indigo-400 to-blue-500" }
  };
  const FALLBACK_STYLE = { i: Package, color: "from-slate-500 to-gray-400" };

  useEffect(() => {
    if (products.length > 0 && !sessionStorage.getItem("hasSeenAd")) {
      const timer = setTimeout(() => {
        setShowAd(true);
        sessionStorage.setItem("hasSeenAd", "true");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // Assume the last product in the array is the "latest updated" one
  const latestAdProduct = products.length > 0 ? products[products.length - 1] : null;

  return (
    <div className="space-y-10">
      {/* Hero Carousel */}
      <Carousel
        opts={{ loop: true }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
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

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Shop by Category</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none snap-x">
          {categoriesWithImage.map((c, i) => {
            const style = CATEGORY_STYLES[c.name.toLowerCase()] || FALLBACK_STYLE;
            return (
              <motion.div key={c.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="snap-start shrink-0">
                <Link to={`/shop/products?category=${encodeURIComponent(c.name)}`}>
                  <Card className="shadow-soft transition-all hover:shadow-elegant hover:-translate-y-1 w-28 sm:w-32 cursor-pointer border-transparent hover:border-primary/20">
                    <CardContent className="flex flex-col items-center justify-center gap-3 p-4 sm:p-5">
                      {c.image ? (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full overflow-hidden border-2 border-muted bg-white shadow-sm">
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${style.color} text-white shadow-sm`}>
                          <style.i className="h-7 w-7" />
                        </div>
                      )}
                      <div className="text-xs sm:text-sm font-medium text-center truncate w-full px-1">{c.name}</div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
            {latest.map((p) => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </section>

      {/* Promotional Ad Modal */}
      <AnimatePresence>
        {showAd && latestAdProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-background shadow-2xl"
            >
              <button
                onClick={() => setShowAd(false)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur hover:bg-black/40 transition"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="relative h-64 w-full">
                <img 
                  src={latestAdProduct.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} 
                  alt={latestAdProduct.product_name} 
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-6">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs backdrop-blur border border-white/10 text-white mb-2">
                    <Sparkles className="h-3 w-3 text-pink-300" /> New Arrival
                  </div>
                  <h3 className="text-2xl font-bold text-white shadow-sm">{latestAdProduct.product_name}</h3>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-sm text-muted-foreground line-clamp-2 mb-6">
                  {latestAdProduct.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold tracking-tight">₹{latestAdProduct.price}</div>
                  <Button 
                    onClick={() => {
                      setShowAd(false);
                      nav({ to: `/shop/products/${latestAdProduct.product_id}` });
                    }} 
                    className="bg-gradient-brand shadow-soft hover:shadow-elegant rounded-full px-6"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
