import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Clock, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-store";
import { downloadInvoice } from "@/lib/invoice";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/_customer/shop/orders")({
  component: OrdersPage,
});

const STATUS_ICON = {
  Placed: Clock, Processing: Package, Delivered: CheckCircle2, Cancelled: Clock,
} as Record<string, any>;

function formatOrderDate(order_id: string) {
  const parts = order_id.split("-");
  if (parts.length > 1) {
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts)) {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  }
  return "Unknown date";
}

function OrdersPage() {
  const user = useAuth(s => s.user);
  const { data: response, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list(),
  });

  const allOrders = response?.data || [];
  const myOrders = allOrders.filter(o => o.customer_id === user?.email).sort((a, b) => b.order_id.localeCompare(a.order_id));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Your orders</h1>
      
      {isLoading ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">Loading your orders...</div>
      ) : myOrders.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground border border-dashed rounded-xl">You have no active orders.</div>
      ) : (
        <div className="space-y-4">
          {myOrders.map((o, index) => {
            const Icon = STATUS_ICON[o.order_status] || Package;
            return (
              <motion.div 
                key={o.order_id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
              >
                <Card className="shadow-soft transition hover:shadow-elegant">
                  <CardContent className="flex flex-wrap items-center gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{o.order_id}</div>
                    <div className="text-xs text-muted-foreground">{formatOrderDate(o.order_id)}</div>
                    <div className="mt-2 flex flex-col gap-0.5">
                      {o.items?.map((item, idx) => (
                        <div key={idx} className="text-xs text-foreground/80">
                          <span className="font-semibold">{item.quantity}x</span> {item.product_name || item.product_id}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Badge variant={o.order_status === "Delivered" ? "default" : o.order_status === "Cancelled" ? "destructive" : "secondary"}>
                    {o.order_status}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-semibold">₹{o.total_amount}</div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => downloadInvoice(o, user?.email || "")}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Invoice
                  </Button>
                </CardContent>
                {o.order_status !== "Cancelled" ? (
                  <div className="border-t border-border px-5 py-4">
                    <div className="flex items-center gap-2 text-xs">
                      {["Ordered", "Packed", "Shipped", "Delivered"].map((s, i) => {
                        let currentStep = 0;
                        if (o.order_status === "Processing") currentStep = 1;
                        if (o.order_status === "Shipped") currentStep = 2;
                        if (o.order_status === "Delivered") currentStep = 3;
                        
                        const isCompleted = i <= currentStep;
                        const isPast = i < currentStep;
                        
                        return (
                          <div key={s} className="flex flex-1 items-center gap-2">
                            <div className={`h-2 w-2 rounded-full ${isCompleted ? "bg-primary" : "bg-muted"}`} />
                            <span className={isCompleted ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                            {i < 3 && (
                              <div className="relative h-px flex-1 overflow-hidden bg-muted">
                                {isPast && (
                                  <motion.div
                                    className="absolute inset-0 bg-primary"
                                    initial={{ x: "-100%" }}
                                    animate={{ x: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {o.order_status !== "Delivered" && (
                      <div className="mt-3 flex items-center gap-1.5 text-xs text-primary">
                        <Truck className="h-3.5 w-3.5" /> Expected delivery: 2-3 days
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-t border-border px-5 py-4">
                    <div className="flex items-center gap-2 text-xs text-destructive">
                      <div className="h-2 w-2 rounded-full bg-destructive" />
                      <span>Order Cancelled</span>
                      <div className="h-px flex-1 bg-destructive/20" />
                      <span className="text-muted-foreground">Refund initiated</span>
                    </div>
                  </div>
                )}
              </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
