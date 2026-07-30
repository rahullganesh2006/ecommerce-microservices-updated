import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useMemo } from "react";
import { IndianRupee, ShoppingBag, Package, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/_admin/admin/analytics")({
  component: AdminAnalytics,
});

const COLORS = [
  "var(--color-chart-1)", 
  "var(--color-chart-2)", 
  "var(--color-chart-3)", 
  "var(--color-chart-4)", 
  "var(--color-chart-5)"
];

function formatOrderDate(order_id: string) {
  const parts = order_id.split("-");
  if (parts.length > 1) {
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts)) return new Date(ts);
  }
  return new Date();
}

function AdminAnalytics() {
  const { data: ordersResponse, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list(),
  });

  const orders = ordersResponse?.data || [];

  const analytics = useMemo(() => {
    let totalRevenue = 0;
    let totalItemsSold = 0;
    
    // Order Status Distribution
    const statusMap: Record<string, number> = {};
    
    // Top Selling Products
    const productMap: Record<string, { name: string, qty: number, revenue: number }> = {};
    
    // Revenue Trend by Month
    const monthlyRev: Record<string, number> = {};

    orders.forEach(o => {
      // Only count non-cancelled for revenue
      if (o.order_status !== "Cancelled") {
        totalRevenue += o.total_amount;
        
        // Month grouping
        const date = formatOrderDate(o.order_id);
        const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        monthlyRev[month] = (monthlyRev[month] || 0) + o.total_amount;
      }

      statusMap[o.order_status] = (statusMap[o.order_status] || 0) + 1;

      o.items?.forEach(i => {
        if (o.order_status !== "Cancelled") {
          totalItemsSold += i.quantity;
        }
        
        if (!productMap[i.product_id]) {
          productMap[i.product_id] = { name: i.product_name, qty: 0, revenue: 0 };
        }
        productMap[i.product_id].qty += i.quantity;
        productMap[i.product_id].revenue += (i.unit_price * i.quantity);
      });
    });

    const statusData = Object.entries(statusMap).map(([name, v]) => ({ name, v }));
    
    const topProducts = Object.values(productMap)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);

    // Sort months chronologically if possible, or just keep insertion order since it's dynamic
    const revenueTrend = Object.entries(monthlyRev).map(([m, r]) => ({ m, r }));

    const aov = orders.length > 0 ? (totalRevenue / orders.filter(o => o.order_status !== "Cancelled").length) || 0 : 0;

    return { totalRevenue, totalItemsSold, aov, statusData, topProducts, revenueTrend };
  }, [orders]);

  const KPIS = [
    { l: "Total Revenue", v: `₹${analytics.totalRevenue.toLocaleString()}`, i: IndianRupee },
    { l: "Total Orders", v: orders.length.toLocaleString(), i: ShoppingBag },
    { l: "Average Order Value", v: `₹${analytics.aov.toFixed(2)}`, i: TrendingUp },
    { l: "Items Sold", v: analytics.totalItemsSold.toLocaleString(), i: Package },
  ];

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl mt-4">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics Dashboard</h1>
        <p className="text-sm text-muted-foreground">Deep dive into sales and platform performance</p>
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
            <h3 className="font-semibold">Revenue Trend</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.revenueTrend}>
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
                  <Area type="monotone" dataKey="r" name="Revenue" stroke="var(--color-primary)" strokeWidth={3} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-5">
            <h3 className="font-semibold">Order Status Distribution</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={analytics.statusData} dataKey="v" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={4} stroke="none">
                    {analytics.statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                  <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft">
          <CardContent className="p-5">
            <h3 className="font-semibold">Top Selling Products</h3>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topProducts} layout="vertical" margin={{ left: 30, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                  <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} tickLine={false} axisLine={false} width={120} />
                  <Tooltip cursor={{ fill: "var(--color-muted)" }} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                  <Bar dataKey="qty" name="Quantity Sold" fill="var(--color-chart-2)" radius={[0, 4, 4, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
