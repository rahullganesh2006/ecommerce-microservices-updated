import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { revenueByMonth } from "@/lib/mock-data";

export const Route = createFileRoute("/_admin/admin/analytics")({
  component: AdminAnalytics,
});

const CATEGORIES = [
  { name: "Audio", v: 32 }, { name: "Wearables", v: 21 },
  { name: "Displays", v: 18 }, { name: "Accessories", v: 22 }, { name: "Power", v: 7 },
];
const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function AdminAnalytics() {
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="text-sm text-muted-foreground">Sales insights across the platform</p></div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-soft"><CardContent className="p-5">
          <h3 className="font-semibold">Revenue trend</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="m" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="r" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent></Card>

        <Card className="shadow-soft"><CardContent className="p-5">
          <h3 className="font-semibold">Sales by category</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={CATEGORIES} dataKey="v" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {CATEGORIES.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent></Card>
      </div>
    </div>
  );
}
