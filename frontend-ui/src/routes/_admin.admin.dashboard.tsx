import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, ShoppingBag, Users, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_admin/admin/dashboard")({
  component: AdminDashboard,
});

function formatOrderDate(order_id: string) {
  const parts = order_id.split("-");
  if (parts.length > 1) {
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts)) return new Date(ts);
  }
  return new Date();
}

function AdminDashboard() {
  const { data: ordersRes } = useQuery({ queryKey: ["dashboard-orders"], queryFn: () => api.orders.list() });
  const { data: productsRes } = useQuery({ queryKey: ["dashboard-products"], queryFn: () => api.products.list() });
  const { data: inventoryRes } = useQuery({ queryKey: ["dashboard-inventory"], queryFn: () => api.inventory.list() });
  const { data: paymentsRes } = useQuery({ queryKey: ["dashboard-payments"], queryFn: () => api.payments.list() });

  const orders = ordersRes?.data || [];
  const products = productsRes?.data || [];
  const inventory = inventoryRes?.data || [];
  const payments = paymentsRes?.data || [];
  
  const queryClient = useQueryClient();

  const addStockMutation = useMutation({
    mutationFn: async (product: any) => {
      // 1. Update Product catalog stock
      const newStock = product.stock + 100;
      await api.products.update(product.product_id, { stock: newStock });
      
      // 2. Update Inventory tracking stock
      const invRow = inventory.find((i: any) => i.product_id === product.product_id);
      if (invRow) {
        await api.inventory.update(invRow.inventory_id, { available_stock: invRow.available_stock + 100 });
      }
      return product;
    },
    onSuccess: (product) => {
      toast.success(`Added 100 stock to ${product.product_name}`);
      queryClient.invalidateQueries({ queryKey: ["dashboard-products"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-inventory"] });
    },
    onError: () => {
      toast.error("Failed to replenish stock");
    }
  });

  const dashboardData = useMemo(() => {
    let totalRevenue = 0;
    let todaysOrders = 0;
    const uniqueCustomers = new Set<string>();

    const dailyRev: Record<string, number> = {};
    const dailyOrders: Record<string, number> = {};
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      dailyRev[dayStr] = 0;
      dailyOrders[dayStr] = 0;
    }

    const todayStr = new Date().toLocaleDateString('default', { month: 'short', day: 'numeric' });

    orders.forEach(o => {
      uniqueCustomers.add(o.customer_id);
      const date = formatOrderDate(o.order_id);
      const dayStr = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
      if (dayStr === todayStr) todaysOrders++;
      if (dailyOrders[dayStr] !== undefined) dailyOrders[dayStr]++;
    });

    // Use payments as the source of truth for revenue
    payments.forEach(p => {
      const s = p.payment_status?.toUpperCase();
      if (s === "SUCCESS" || s === "COMPLETED") {
        totalRevenue += Number(p.amount || 0);
        
        // Extract payment date from ID or payment_time
        let date = new Date();
        if (p.payment_time) {
          try {
            const parsed = new Date(p.payment_time);
            if (!isNaN(parsed.getTime())) date = parsed;
          } catch(e) {}
        } else {
           const parts = p.payment_id.split("-");
           if (parts.length > 1) {
             const ts = parseInt(parts[1], 10);
             if (!isNaN(ts)) date = new Date(ts);
           }
        }
        
        const dayStr = date.toLocaleDateString('default', { month: 'short', day: 'numeric' });
        if (dailyRev[dayStr] !== undefined) {
          dailyRev[dayStr] += Number(p.amount || 0);
        } else {
          // Include older dates if they exist
          dailyRev[dayStr] = (dailyRev[dayStr] || 0) + Number(p.amount || 0);
        }
      }
    });

    const revenueByDay = Object.keys(dailyRev)
      .sort((a, b) => new Date(`${a} ${new Date().getFullYear()}`).getTime() - new Date(`${b} ${new Date().getFullYear()}`).getTime())
      .map(m => ({ m, r: dailyRev[m] }));

    const ordersByDay = Object.keys(dailyOrders)
      .sort((a, b) => new Date(`${a} ${new Date().getFullYear()}`).getTime() - new Date(`${b} ${new Date().getFullYear()}`).getTime())
      .map(d => ({ d, o: dailyOrders[d] }));

    return { totalRevenue, todaysOrders, activeCustomers: uniqueCustomers.size, revenueByDay, ordersByDay };
  }, [orders]);

  const KPIS = [
    { l: "Total revenue", v: `₹${dashboardData.totalRevenue.toLocaleString()}`, i: IndianRupee, tone: "text-success" },
    { l: "Total orders", v: orders.length.toLocaleString(), i: ShoppingBag, tone: "text-success" },
    { l: "Today's orders", v: dashboardData.todaysOrders.toString(), i: TrendingUp, tone: "text-success" },
    { l: "Active customers", v: dashboardData.activeCustomers.toLocaleString(), i: Users, tone: "text-success" },
  ];

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
                <p className="text-xs text-muted-foreground">Last 7 days</p>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dashboardData.revenueByDay}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
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
                <BarChart data={dashboardData.ordersByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="o" name="Orders" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
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
              {[...orders].reverse().slice(0, 5).map((o) => (
                <div key={o.order_id} className="flex items-center gap-4 py-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{o.order_id}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_id}</div>
                  </div>
                  <Badge variant={o.order_status === "Delivered" ? "default" : o.order_status === "Cancelled" ? "destructive" : "secondary"}>
                    {o.order_status}
                  </Badge>
                  <div className="text-sm font-semibold">₹{o.total_amount.toFixed(2)}</div>
                </div>
              ))}
              {orders.length === 0 && <div className="text-muted-foreground py-4">No recent orders found.</div>}
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
                <div key={p.product_id} className="flex items-center gap-3 group">
                  <Package className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex-1 truncate text-sm">{p.product_name}</div>
                  <Badge variant="secondary" className="bg-warning/10 text-warning shrink-0">{p.stock}</Badge>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-6 text-[10px] px-2 opacity-0 transition-opacity group-hover:opacity-100 shrink-0"
                    onClick={() => addStockMutation.mutate(p)}
                    disabled={addStockMutation.isPending}
                  >
                    +100
                  </Button>
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
