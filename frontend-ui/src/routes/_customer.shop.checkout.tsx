import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Banknote, Smartphone, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { PAYMENT_METHOD_MAP, type PaymentMethod } from "@/lib/types";

export const Route = createFileRoute("/_customer/shop/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const nav = useNavigate();
  const user = useAuth((s) => s.user);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = subtotal + subtotal * 0.18 + (subtotal > 500 ? 0 : 15);

  async function pay() {
    if (!user) { toast.error("Please sign in first"); return; }
    setProcessing(true);
    try {
      
      // Call the backend checkout orchestrator
      await api.cart.checkout(user.email, {
        payment_method: PAYMENT_METHOD_MAP[method],
        shipping_address: "221 Baker Street, Apt 4B, San Francisco, 94103",
        items: useCart.getState().items.map(i => ({
          product_id: i.product.product_id,
          product_name: i.product.product_name,
          quantity: i.qty,
          unit_price: i.product.price,
          total_price: i.product.price * i.qty,
          cart_id: i.cart_id
        }))
      });
      
      setProcessing(false);
      setSuccess(true);
      clear();
      toast.success("Payment successful");
      setTimeout(() => nav({ to: "/shop/orders" }), 1600);
    } catch (err) {
      setProcessing(false);
      toast.error(err instanceof Error ? err.message : "Payment failed");
    }
  }

  if (success) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="mx-auto max-w-md py-16 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-2xl font-semibold">Payment successful</h2>
        <p className="mt-1 text-sm text-muted-foreground">Redirecting to your orders…</p>
      </motion.div>
    );
  }

  const methods = [
    { id: "card" as PaymentMethod, i: CreditCard, l: "Credit / Debit card" },
    { id: "upi" as PaymentMethod, i: Smartphone, l: "UPI" },
    { id: "netbanking" as PaymentMethod, i: Banknote, l: "Net banking" },
    { id: "wallet" as PaymentMethod, i: Wallet, l: "Wallet" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="mb-6 text-2xl font-semibold tracking-tight">Checkout</h1>
        <Card className="shadow-soft">
          <CardContent className="space-y-6 p-6">
            <div>
              <h3 className="mb-3 font-semibold">Shipping address</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1"><Label>Full name</Label><Input defaultValue={user?.name ?? "Customer"} /></div>
                <div className="space-y-1"><Label>Phone</Label><Input defaultValue="+1 415 555 0132" /></div>
                <div className="space-y-1 sm:col-span-2"><Label>Address</Label><Input defaultValue="221 Baker Street, Apt 4B" /></div>
                <div className="space-y-1"><Label>City</Label><Input defaultValue="San Francisco" /></div>
                <div className="space-y-1"><Label>ZIP</Label><Input defaultValue="94103" /></div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 font-semibold">Payment method</h3>
              <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-2 sm:grid-cols-2">
                {methods.map((m) => (
                  <Label key={m.id} htmlFor={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${method === m.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"}`}>
                    <RadioGroupItem id={m.id} value={m.id} />
                    <m.i className="h-5 w-5" />
                    <span className="text-sm font-medium">{m.l}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit shadow-soft lg:sticky lg:top-24">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold">Payment summary</h2>
          <div className="mt-3 text-sm text-muted-foreground">Subtotal ${subtotal.toFixed(2)} + GST + Shipping</div>
          <div className="mt-4 text-3xl font-bold tracking-tight">${total.toFixed(2)}</div>
          <Button onClick={pay} disabled={processing || subtotal === 0} className="mt-6 w-full bg-gradient-brand shadow-soft hover:shadow-elegant">
            {processing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</> : "Pay now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
