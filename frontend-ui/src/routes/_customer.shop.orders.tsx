import { createFileRoute } from "@tanstack/react-router";
import { orders } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Package, Truck, Clock, Download } from "lucide-react";

export const Route = createFileRoute("/_customer/shop/orders")({
  component: OrdersPage,
});

const STATUS_ICON = {
  Pending: Clock, Processing: Package, Delivered: CheckCircle2, Cancelled: Clock,
} as const;

function OrdersPage() {
  const my = orders.slice(0, 4);
  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Your orders</h1>
      <div className="space-y-4">
        {my.map((o) => {
          const Icon = STATUS_ICON[o.status];
          return (
            <Card key={o.id} className="shadow-soft transition hover:shadow-elegant">
              <CardContent className="flex flex-wrap items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{o.id}</div>
                  <div className="text-xs text-muted-foreground">{o.date} · {o.items} item(s)</div>
                </div>
                <Badge variant={o.status === "Delivered" ? "default" : o.status === "Cancelled" ? "destructive" : "secondary"}>
                  {o.status}
                </Badge>
                <div className="text-right">
                  <div className="text-sm font-semibold">${o.total}</div>
                </div>
                <Button size="sm" variant="outline"><Download className="mr-1.5 h-3.5 w-3.5" /> Invoice</Button>
              </CardContent>
              {o.status === "Processing" && (
                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-center gap-2 text-xs">
                    {["Ordered", "Packed", "Shipped", "Delivered"].map((s, i) => (
                      <div key={s} className="flex flex-1 items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${i <= 1 ? "bg-primary" : "bg-muted"}`} />
                        <span className={i <= 1 ? "text-foreground" : "text-muted-foreground"}>{s}</span>
                        {i < 3 && <div className={`h-px flex-1 ${i < 1 ? "bg-primary" : "bg-muted"}`} />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
                    <Truck className="h-3.5 w-3.5" /> Expected delivery: 2 days
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
