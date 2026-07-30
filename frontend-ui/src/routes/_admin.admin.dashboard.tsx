import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { revenueByMonth, ordersByDay, orders, products } from "@/lib/mock-data";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  component: AdminDashboard,
});

const KPIS = [
  { l: "Total revenue", v: "$450,829", d: "+12.4%", i: DollarSign, tone: "text-success" },
  { l: "Total orders", v: "8,247", d: "+8.2%", i: ShoppingBag, tone: "text-success" },
  { l: "Today's orders", v: "127", d: "+4 vs yesterday", i: TrendingUp, tone: "text-success" },
  { l: "Active customers", v: "3,412", d: "+2.1%", i: Users, tone: "text-success" },
];

function AdminDashboard() {
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 20);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Real-time overview of CloudCart operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {KPIS.map((k, i) => (
          <motion.div key={k.l} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="shadow-soft">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <k.i className="h-4 w-4" />
                  </div>
                  <Badge variant="secondary" className={`${k.tone} bg-success/10 border-0`}>{k.d}</Badge>
                </div>
                <div className="mt-4 text-2xl font-bold tracking-tight">{k.v}</div>
                <div className="text-xs text-muted-foreground">{k.l}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Revenue</h3>
                <p className="text-xs text-muted-foreground">Last 7 months</p>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueByMonth}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Area type="monotone" dataKey="r" stroke="var(--color-primary)" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-5">
            <h3 className="font-semibold">Orders this week</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="o" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-soft lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Latest orders</h3>
              <Badge variant="secondary">Live</Badge>
            </div>
            <div className="mt-4 divide-y divide-border">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-center gap-4 py-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{o.id}</div>
                    <div className="text-xs text-muted-foreground">{o.customer}</div>
                  </div>
                  <Badge variant={o.status === "Delivered" ? "default" : o.status === "Cancelled" ? "destructive" : "secondary"}>{o.status}</Badge>
                  <div className="text-sm font-semibold">${o.total}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <h3 className="font-semibold">Low stock alerts</h3>
            </div>
            <div className="mt-4 space-y-3">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 truncate text-sm">{p.name}</div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning">{p.stock}</Badge>
                </div>
              ))}
              {lowStock.length === 0 && <div className="text-sm text-muted-foreground">All good.</div>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
