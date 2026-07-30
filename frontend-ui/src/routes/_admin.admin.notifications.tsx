import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, AlertTriangle, Package } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/notifications")({
  component: () => {
    const items = [
      { i: CheckCircle2, tone: "text-success bg-success/10", t: "Payment received", d: "ORD-8842 · $428.00", time: "2m ago" },
      { i: AlertTriangle, tone: "text-warning bg-warning/10", t: "Low stock alert", d: "Zenith Ergonomic Mouse (8 left)", time: "12m ago" },
      { i: Package, tone: "text-primary bg-primary/10", t: "New order", d: "ORD-8843 by Ada Osei", time: "24m ago" },
      { i: Bell, tone: "text-muted-foreground bg-muted", t: "System deploy", d: "Order Service v2.4.1 rolled out to us-east-1", time: "1h ago" },
    ];
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Notifications</h1></div>
        <Card className="shadow-soft"><CardContent className="p-0">
          <div className="divide-y divide-border">
            {items.map((n, i) => (
              <div key={i} className="flex items-start gap-4 p-4">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${n.tone}`}><n.i className="h-4 w-4" /></div>
                <div className="flex-1"><div className="font-medium">{n.t}</div><div className="text-sm text-muted-foreground">{n.d}</div></div>
                <div className="text-xs text-muted-foreground">{n.time}</div>
              </div>
            ))}
          </div>
        </CardContent></Card>
      </div>
    );
  },
});
