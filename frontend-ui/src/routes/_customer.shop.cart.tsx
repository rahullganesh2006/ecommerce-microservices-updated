import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/_customer/shop/cart")({
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  const gst = subtotal * 0.18;
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 15;
  const total = subtotal + gst + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <ShoppingBag className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-1 text-sm text-muted-foreground">Add products to see them here.</p>
        <Button asChild className="mt-6 bg-gradient-brand"><Link to="/shop/products">Browse products</Link></Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Shopping cart</h1>
        <div className="space-y-3">
          <AnimatePresence>
            {items.map((i) => (
              <motion.div key={i.product.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}>
                <Card className="shadow-soft">
                  <CardContent className="flex gap-4 p-4">
                    <img src={i.product.image} alt={i.product.name} className="h-24 w-24 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground">{i.product.category}</div>
                      <div className="font-medium">{i.product.name}</div>
                      <div className="mt-1 text-sm font-semibold">${i.product.price}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center rounded-lg border border-border">
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(i.product.id, i.qty - 1)}><Minus className="h-3 w-3" /></Button>
                          <div className="w-8 text-center text-sm">{i.qty}</div>
                          <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setQty(i.product.id, i.qty + 1)}><Plus className="h-3 w-3" /></Button>
                        </div>
                        <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => remove(i.product.id)}>
                          <Trash2 className="mr-1 h-3.5 w-3.5" /> Remove
                        </Button>
                      </div>
                    </div>
                    <div className="text-right font-semibold">${(i.product.price * i.qty).toFixed(2)}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Card className="h-fit shadow-soft lg:sticky lg:top-24">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">GST (18%)</span><span>${gst.toFixed(2)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span></div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between text-base font-semibold"><span>Total</span><span>${total.toFixed(2)}</span></div>
          <Button asChild className="mt-6 w-full bg-gradient-brand shadow-soft hover:shadow-elegant">
            <Link to="/shop/checkout">Checkout <ArrowRight className="ml-1.5 h-4 w-4" /></Link>
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">Secure payment via AWS Payment Service</p>
        </CardContent>
      </Card>
    </div>
  );
}
