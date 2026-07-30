import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, AlertTriangle, Package, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/_admin/admin/notifications")({
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data: productsRes, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: () => api.products.list()
  });

  const { data: ordersRes, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: () => api.orders.list()
  });

  if (isLoadingProducts || isLoadingOrders) {
    return (
      <div className="mx-auto max-w-3xl flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Fetching latest updates...
      </div>
    );
  }

  const products = productsRes?.data || [];
  const orders = ordersRes?.data || [];

  const notifications = [];

  // 1. Low Stock Alerts
  for (const p of products) {
    if (p.stock < 20) {
      notifications.push({
        id: `low-stock-${p.product_id}`,
        i: AlertTriangle,
        tone: "text-warning bg-warning/10",
        t: "Low stock alert",
        d: `${p.product_name} (${p.stock} left)`,
        ts: Date.now() - Math.random() * 86400000, // Random time in last 24h as fallback
        time: "Recent"
      });
    }
  }

  // 2. Recent Orders
  for (const o of orders) {
    // Extract timestamp from ORD-TIMESTAMP-RAND
    const parts = o.order_id.split("-");
    let ts = Date.now() - Math.random() * 86400000;
    if (parts.length > 1) {
      const parsed = parseInt(parts[1], 10);
      if (!isNaN(parsed)) ts = parsed;
    }
    
    // Calculate how long ago
    const diffMin = Math.floor((Date.now() - ts) / 60000);
    let timeStr = "";
    if (diffMin < 60) timeStr = `${Math.max(1, diffMin)}m ago`;
    else if (diffMin < 1440) timeStr = `${Math.floor(diffMin/60)}h ago`;
    else timeStr = `${Math.floor(diffMin/1440)}d ago`;

    notifications.push({
      id: `new-order-${o.order_id}`,
      i: Package,
      tone: "text-primary bg-primary/10",
      t: "New order received",
      d: `${o.order_id} for $${o.total_amount.toFixed(2)}`,
      ts: ts,
      time: timeStr
    });
    
    if (o.order_status === "Delivered") {
      notifications.push({
        id: `delivered-${o.order_id}`,
        i: CheckCircle2,
        tone: "text-success bg-success/10",
        t: "Order delivered",
        d: `${o.order_id} has been delivered to customer`,
        ts: ts + 86400000, // Fake future offset for delivery
        time: timeStr
      });
    }
  }

  // 3. System Update (Static)
  notifications.push({
    id: "system-1",
    i: Bell,
    tone: "text-muted-foreground bg-muted",
    t: "System deploy",
    d: "CloudCart Architecture updated to use Microservices",
    ts: 0, // Always at bottom
    time: "System"
  });

  // Sort by timestamp descending
  notifications.sort((a, b) => b.ts - a.ts);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Notifications</h1></div>
      <Card className="shadow-soft"><CardContent className="p-0">
        <div className="divide-y divide-border">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-4 p-4">
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${n.tone}`}><n.i className="h-4 w-4" /></div>
              <div className="flex-1"><div className="font-medium">{n.t}</div><div className="text-sm text-muted-foreground">{n.d}</div></div>
              <div className="text-xs text-muted-foreground">{n.time}</div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">You have no notifications.</div>
          )}
        </div>
      </CardContent></Card>
    </div>
  );
}
