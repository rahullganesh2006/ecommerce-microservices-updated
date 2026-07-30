import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart-store";
import type { Product } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const wishlisted = useCart((s) => s.wishlist.includes(product.id));
  const toggleWish = useCart((s) => s.toggleWishlist);
  const oos = product.stock === 0;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition hover:shadow-elegant">
      <Link to="/shop/products" className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          {oos && <Badge variant="destructive" className="absolute left-3 top-3">Out of stock</Badge>}
          {!oos && product.stock < 20 && <Badge className="absolute left-3 top-3 bg-warning text-warning-foreground">Low stock</Badge>}
        </div>
      </Link>
      <button
        onClick={(e) => { e.preventDefault(); toggleWish(product.id); }}
        className={cn("absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background",
          wishlisted && "text-destructive")}
        aria-label="Wishlist"
      >
        <Heart className={cn("h-4 w-4", wishlisted && "fill-current")} />
      </button>
      <div className="p-4">
        <div className="text-xs text-muted-foreground">{product.category}</div>
        <h3 className="mt-1 line-clamp-1 font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" /> {product.rating}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="text-lg font-semibold">${product.price}</div>
          <Button size="sm" disabled={oos} onClick={() => { add(product); toast.success(`${product.name} added to cart`); }}
            className="bg-gradient-brand shadow-soft hover:shadow-elegant">
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
