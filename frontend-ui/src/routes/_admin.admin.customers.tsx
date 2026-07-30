import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useMemo } from "react";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/_admin/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list(),
  });

  const groupedCustomers = useMemo(() => {
    const orders: Order[] = response?.data || [];
    
    const groups = orders.reduce((acc, order) => {
      const email = order.customer_id;
      if (!acc[email]) {
        acc[email] = {
          email,
          name: email.split("@")[0], // Simple mock name extraction from email
          orders: 0,
          spent: 0,
          joined: "Recently", // Without a real user service, we mock joined date
        };
      }
      acc[email].orders += 1;
      acc[email].spent += order.total_amount;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groups).sort((a: any, b: any) => b.spent - a.spent);
  }, [response]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">{isLoading ? "..." : groupedCustomers.length} Active users</p>
      </div>
      <Card className="shadow-soft"><CardContent className="p-5">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Customer</TableHead><TableHead>Total Orders</TableHead><TableHead>Lifetime spend</TableHead><TableHead>Joined</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground border-dashed border">Loading customers...</TableCell>
              </TableRow>
            ) : groupedCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground border-dashed border">No customers found</TableCell>
              </TableRow>
            ) : groupedCustomers.map((c: any) => (
              <TableRow key={c.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-brand text-xs text-primary-foreground">{c.name.substring(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                    <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                  </div>
                </TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>₹{c.spent.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{c.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
