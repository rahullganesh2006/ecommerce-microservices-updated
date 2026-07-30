import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart-store";
import { products } from "@/lib/mock-data";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/_customer/shop/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const wishlist = useCart((s) => s.wishlist);
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Your wishlist</h1>
      {items.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
            <Heart className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No items saved yet.</p>
          <Button asChild className="mt-4 bg-gradient-brand"><Link to="/shop/products">Discover products</Link></Button>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
