import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { ArrowLeft, ShoppingCart, Heart, Star, Truck, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_customer/shop/products_/$productId")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const nav = useNavigate();
  const add = useCart((s) => s.add);
  const wishlisted = useCart((s) => s.wishlist.includes(productId));
  const toggleWish = useCart((s) => s.toggleWishlist);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => api.products.get(productId),
  });

  if (isLoading) return <div className="py-24 text-center text-muted-foreground">Loading product details...</div>;
  if (error || !product) return <div className="py-24 text-center text-destructive">Product not found.</div>;

  const oos = product.stock === 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <motion.div variants={itemVariants}>
        <Button variant="ghost" size="sm" onClick={() => nav({ to: "/shop/products" })} className="mb-6 -ml-3 text-muted-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
        </Button>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Image Section */}
        <motion.div variants={itemVariants} className="relative aspect-square overflow-hidden rounded-3xl bg-muted/20 border border-border">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={product.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"} 
            alt={product.product_name} 
            className="w-full h-full object-cover"
          />
          {oos && <Badge variant="destructive" className="absolute left-4 top-4 text-sm px-3 py-1 shadow-lg">Out of stock</Badge>}
        </motion.div>

        {/* Details Section */}
        <div className="flex flex-col justify-center">
          <motion.div variants={itemVariants} className="text-sm font-medium text-primary mb-2 uppercase tracking-wider">{product.category}</motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight">{product.product_name}</motion.h1>
          
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1 text-warning font-medium">
              <Star className="h-5 w-5 fill-current" /> 4.8 <span className="text-muted-foreground font-normal">(124 reviews)</span>
            </div>
            <div className="text-sm text-muted-foreground">• SKU: {product.product_id}</div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-4xl font-bold tracking-tight mb-6 text-foreground/90">₹{product.price}</motion.div>

          <motion.p variants={itemVariants} className="text-muted-foreground text-lg leading-relaxed mb-8">
            {product.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
            <Button 
              size="lg" 
              className="flex-1 bg-gradient-brand shadow-soft hover:shadow-elegant hover:-translate-y-1 transition-all text-lg h-14 rounded-2xl"
              disabled={oos}
              onClick={() => { 
                add(product); 
                toast.success(`${product.product_name} added to cart`);
                nav({ to: "/shop/cart" });
              }}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> {oos ? "Out of Stock" : "Add to Cart"}
            </Button>
            <Button 
              size="icon" 
              variant="outline" 
              className={cn("h-14 w-14 rounded-2xl border-border hover:bg-muted/50 transition-colors shadow-sm", wishlisted && "border-destructive text-destructive bg-destructive/5")}
              onClick={() => toggleWish(product.product_id)}
            >
              <Heart className={cn("h-6 w-6 transition-transform hover:scale-110", wishlisted && "fill-current")} />
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 pt-8 border-t border-border/50">
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
              <div className="bg-primary/10 p-2 rounded-lg"><Truck className="h-4 w-4 text-primary" /></div> Free Lightning Delivery
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-3 rounded-xl">
              <div className="bg-primary/10 p-2 rounded-lg"><ShieldCheck className="h-4 w-4 text-primary" /></div> 1 Year Warranty
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
