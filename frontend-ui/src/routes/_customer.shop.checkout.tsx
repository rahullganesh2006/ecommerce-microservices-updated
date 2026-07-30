import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-store";
import { api } from "@/lib/api-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Banknote, Smartphone, CheckCircle2, Loader2, Truck, Zap, PackageOpen, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { PAYMENT_METHOD_MAP, type PaymentMethod } from "@/lib/types";

export const Route = createFileRoute("/_customer/shop/checkout")({
  component: CheckoutPage,
});

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const STAGGER = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

function CheckoutPage() {
  const nav = useNavigate();
  const user = useAuth((s) => s.user);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // Payment forms state
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });
  const [upi, setUpi] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");

  const tax = subtotal * 0.18;
  const shipping = subtotal > 500 ? 0 : 15;
  const total = subtotal + tax + shipping;

  function validate() {
    if (method === "card") {
      if (card.number.replace(/\D/g, "").length !== 16) { toast.error("Card number must be 16 digits"); return false; }
      if (!card.expiry.match(/^(0[1-9]|1[0-2])\/\d{2}$/)) { toast.error("Expiry must be in MM/YY format"); return false; }
      if (card.cvv.replace(/\D/g, "").length < 3) { toast.error("CVV must be at least 3 digits"); return false; }
    } else if (method === "upi") {
      if (!upi.includes("@") || upi.length < 5) { toast.error("Enter a valid UPI ID (e.g., name@bank)"); return false; }
    } else if (method === "netbanking") {
      if (!bank.trim()) { toast.error("Please enter your bank name"); return false; }
    } else if (method === "wallet") {
      if (wallet.replace(/\D/g, "").length < 10) { toast.error("Enter a valid 10-digit mobile number"); return false; }
    }
    return true;
  }

  async function pay() {
    if (!user) { toast.error("Please sign in first"); return; }
    if (!validate()) return;
    
    setProcessing(true);
    try {
      await api.cart.checkout(user.email, {
        payment_method: PAYMENT_METHOD_MAP[method],
        shipping_address: "221 Baker Street, Apt 4B, San Francisco, 94103",
        items: items.map(i => ({
          product_id: i.product.product_id || (i.product as any).id,
          product_name: i.product.product_name || (i.product as any).name,
          quantity: i.qty,
          unit_price: i.product.price,
          total_price: i.product.price * i.qty,
          cart_id: i.cart_id
        }))
      });
      
      setProcessing(false);
      setSuccess(true);
      clear();
      toast.success("Order placed successfully");
      setTimeout(() => nav({ to: "/shop/orders" }), 3500);
    } catch (err) {
      setProcessing(false);
      toast.error(err instanceof Error ? err.message : "Payment failed");
    }
  }

  const methods = [
    { id: "card" as PaymentMethod, i: CreditCard, l: "Credit / Debit card", d: "Pay securely with your card" },
    { id: "upi" as PaymentMethod, i: Smartphone, l: "UPI", d: "Google Pay, PhonePe, Paytm" },
    { id: "netbanking" as PaymentMethod, i: Banknote, l: "Net banking", d: "All major banks supported" },
    { id: "wallet" as PaymentMethod, i: Wallet, l: "Wallet", d: "Amazon Pay, Mobikwik" },
    { id: "cod" as PaymentMethod, i: PackageOpen, l: "Cash on Delivery", d: "Pay when you receive the package" },
  ];

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div 
          key="success-screen"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="flex h-[70vh] items-center justify-center"
        >
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="text-center">
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-success/10"
            >
              <CheckCircle2 className="h-12 w-12 text-success" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="text-3xl font-bold tracking-tight">Order Confirmed!</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-2 text-muted-foreground">Your items are being prepared for shipping.</motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-8 flex items-center justify-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to orders...
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          key="checkout-form"
          variants={STAGGER} initial="hidden" animate="show" exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }} 
          className="mx-auto max-w-5xl"
        >
          <motion.div variants={FADE_UP} className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Cloud Cart Checkout</h1>
          </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <motion.div variants={FADE_UP}>
            <Card className="overflow-hidden border-border/50 shadow-soft transition-all hover:shadow-md">
              <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
                <h3 className="font-semibold flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Shipping Address</h3>
              </div>
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Full Name</Label><Input className="bg-muted/30 focus-visible:bg-background" defaultValue={user?.name ?? "Customer"} /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Phone</Label><Input className="bg-muted/30 focus-visible:bg-background" defaultValue="+1 415 555 0132" /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs text-muted-foreground uppercase tracking-wider">Address Line</Label><Input className="bg-muted/30 focus-visible:bg-background" defaultValue="221 Baker Street, Apt 4B" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">City</Label><Input className="bg-muted/30 focus-visible:bg-background" defaultValue="San Francisco" /></div>
                  <div className="space-y-1.5"><Label className="text-xs text-muted-foreground uppercase tracking-wider">ZIP Code</Label><Input className="bg-muted/30 focus-visible:bg-background" defaultValue="94103" /></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={FADE_UP}>
            <Card className="overflow-hidden border-border/50 shadow-soft transition-all hover:shadow-md">
              <div className="bg-muted/30 px-6 py-4 border-b border-border/50">
                <h3 className="font-semibold flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Payment Method</h3>
              </div>
              <CardContent className="p-6">
                <RadioGroup value={method} onValueChange={(v) => setMethod(v as PaymentMethod)} className="grid gap-4">
                  {methods.map((m) => (
                    <motion.div key={m.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Label htmlFor={m.id} className={`relative flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-all duration-300 ${method === m.id ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm" : "border-border/60 hover:bg-muted/30 hover:border-border"}`}>
                        <RadioGroupItem id={m.id} value={m.id} className="mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 font-medium text-foreground">
                            <m.i className={`h-4 w-4 ${method === m.id ? "text-primary" : "text-muted-foreground"}`} /> {m.l}
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{m.d}</div>
                          
                          {/* Render dynamic payment forms */}
                          <AnimatePresence>
                            {method === m.id && (
                              <motion.div 
                                initial={{ opacity: 0, height: 0 }} 
                                animate={{ opacity: 1, height: "auto" }} 
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden mt-4 pt-2 border-t border-border/50"
                                onClick={(e) => e.preventDefault()} 
                              >
                                {method === "card" && (
                                  <div className="grid gap-3 pt-2">
                                    <Input placeholder="Card Number (16 digits)" maxLength={16} value={card.number} onChange={(e) => setCard({...card, number: e.target.value})} />
                                    <div className="grid grid-cols-2 gap-3">
                                      <Input placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => setCard({...card, expiry: e.target.value})} />
                                      <Input placeholder="CVV" maxLength={4} type="password" value={card.cvv} onChange={(e) => setCard({...card, cvv: e.target.value})} />
                                    </div>
                                  </div>
                                )}
                                {method === "upi" && (
                                  <div className="pt-2"><Input placeholder="Enter UPI ID (e.g., name@okbank)" value={upi} onChange={(e) => setUpi(e.target.value)} /></div>
                                )}
                                {method === "netbanking" && (
                                  <div className="pt-2"><Input placeholder="Enter Bank Name" value={bank} onChange={(e) => setBank(e.target.value)} /></div>
                                )}
                                {method === "wallet" && (
                                  <div className="pt-2"><Input placeholder="10-digit Mobile Number" maxLength={10} value={wallet} onChange={(e) => setWallet(e.target.value)} /></div>
                                )}
                                {method === "cod" && (
                                  <div className="pt-2 text-sm text-muted-foreground">You will pay the delivery agent in cash or via UPI when the package arrives.</div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                        {method === m.id && (
                          <motion.div layoutId="active-method" className="absolute inset-0 rounded-xl border-2 border-primary/20 pointer-events-none" />
                        )}
                      </Label>
                    </motion.div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={FADE_UP}>
          <Card className="sticky top-24 overflow-hidden border-border/50 shadow-elegant">
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10">
              <h2 className="font-semibold">Order Summary</h2>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Taxes (GST 18%)</span>
                <span className="font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium text-success">{shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}</span>
              </div>
              
              <div className="my-4 border-t border-border/50" />
              
              <div className="flex items-end justify-between">
                <span className="text-base font-medium">Total</span>
                <motion.span 
                  key={total}
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold tracking-tight text-primary"
                >
                  ₹{total.toFixed(2)}
                </motion.span>
              </div>

              <Button 
                onClick={pay} 
                disabled={processing || subtotal === 0} 
                className="relative mt-6 w-full overflow-hidden bg-primary text-primary-foreground shadow-elegant hover:shadow-lg transition-all h-12 text-base font-semibold group"
              >
                <span className={`flex items-center gap-2 transition-all ${processing ? 'opacity-0' : 'opacity-100 group-hover:scale-105'}`}>
                  {method === "cod" ? `Place Order • ₹${total.toFixed(2)}` : `Pay ₹${total.toFixed(2)}`}
                </span>
                
                {processing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                    className="absolute inset-0 flex items-center justify-center gap-2 bg-primary"
                  >
                    <Loader2 className="h-5 w-5 animate-spin" /> Processing...
                  </motion.div>
                )}
              </Button>
              <div className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                Payments are securely processed.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
    )}
  </AnimatePresence>
  );
}
