import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Star, Truck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const wishlisted = useCart((s) => s.wishlist.includes(product.product_id));
  const toggleWish = useCart((s) => s.toggleWishlist);
  const oos = product.stock === 0;
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}
        className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-elegant">
        <DialogTrigger asChild>
          <div className="relative aspect-[4/3] overflow-hidden bg-muted cursor-pointer block">
            <img src={product.image_url || product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"} alt={product.product_name} loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            {oos && <Badge variant="destructive" className="absolute left-3 top-3">Out of stock</Badge>}
            {!oos && product.stock < 20 && <Badge className="absolute left-3 top-3 bg-warning text-warning-foreground">Low stock</Badge>}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
               <Badge className="bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-1.5 shadow-lg">Quick View</Badge>
            </div>
          </div>
        </DialogTrigger>
      <button
        onClick={(e) => { e.preventDefault(); toggleWish(product.product_id); }}
        className={cn("absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background z-10",
          wishlisted && "text-destructive")}
        aria-label="Wishlist"
      >
        <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
      </button>
      <div className="p-4">
        <div className="text-xs text-muted-foreground">{product.category}</div>
        <h3 className="mt-1 line-clamp-1 font-medium">{product.product_name}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" /> 4.5
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-semibold">₹{product.price}</div>
          <Button size="sm" disabled={oos} onClick={() => { add(product); toast.success(`${product.product_name} added to cart`); }}
            className="bg-gradient-brand shadow-soft hover:shadow-elegant">
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
      </motion.div>
      <DialogContent className="max-w-4xl w-[95vw] md:w-full p-0 overflow-hidden bg-background border-border sm:rounded-2xl">
        {open && <QuickViewContent productId={product.product_id} close={() => setOpen(false)} />}
      </DialogContent>
    </Dialog>
  );
}

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

function QuickViewContent({ productId, close }: { productId: string, close: () => void }) {
  const { data: detailedProduct, isLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.products.get(productId),
  });
  
  const add = useCart((s) => s.add);
  const wishlisted = useCart((s) => s.wishlist.includes(productId));
  const toggleWish = useCart((s) => s.toggleWishlist);
  const nav = useNavigate();

  if (isLoading) {
    return <div className="h-[500px] flex items-center justify-center text-muted-foreground">Loading live details...</div>;
  }
  
  if (!detailedProduct) return null;
  const oos = detailedProduct.stock === 0;

  return (
    <div className="grid md:grid-cols-2 h-full max-h-[85vh] overflow-y-auto">
      <div className="relative aspect-square md:aspect-auto md:h-full bg-muted/20">
        <motion.img 
          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}
          src={detailedProduct.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} 
          alt={detailedProduct.product_name} 
          className="w-full h-full object-cover"
        />
        {oos && <Badge variant="destructive" className="absolute left-4 top-4 text-sm px-3 py-1 shadow-lg">Out of stock</Badge>}
      </div>
      <div className="p-6 sm:p-10 flex flex-col justify-center bg-background">
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">{detailedProduct.category}</motion.div>
        <motion.h2 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="text-3xl font-bold tracking-tight mb-2 leading-tight">{detailedProduct.product_name}</motion.h2>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1 text-warning font-medium">
            <Star className="h-5 w-5 fill-current" /> 4.8 <span className="text-muted-foreground font-normal">(124 reviews)</span>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }} className="text-3xl font-bold tracking-tight mb-6 text-foreground/90">₹{detailedProduct.price}</motion.div>
        <motion.p initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="text-muted-foreground text-base leading-relaxed mb-8">
          {detailedProduct.description}
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex items-center gap-3 mb-6 mt-auto">
          <Button 
            size="lg" className="flex-1 bg-gradient-brand shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all rounded-xl h-12"
            disabled={oos}
            onClick={() => { add(detailedProduct); toast.success(`${detailedProduct.product_name} added to cart`); close(); }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          <Button size="icon" variant="outline" className={cn("h-12 w-12 rounded-xl transition-colors shadow-sm", wishlisted && "border-destructive text-destructive bg-destructive/5")} onClick={() => toggleWish(detailedProduct.product_id)}>
            <Heart className={cn("h-5 w-5 transition-transform hover:scale-110", wishlisted && "fill-current")} />
          </Button>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex items-center justify-between pt-6 border-t border-border/50 text-sm">
           <Button variant="link" className="px-0 text-primary" onClick={() => { close(); nav({ to: `/shop/products/${detailedProduct.product_id}` }); }}>View Full Details &rarr;</Button>
        </motion.div>
      </div>
    </div>
  );
}
