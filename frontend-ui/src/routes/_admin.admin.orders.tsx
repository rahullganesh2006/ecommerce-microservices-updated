import { createFileRoute } from "@tanstack/react-router";
import { orders } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_admin/admin/orders")({
  component: AdminOrders,
});

function OrderTable({ list }: { list: typeof orders }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead>
          <TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((o) => (
          <TableRow key={o.id}>
            <TableCell className="font-medium">{o.id}</TableCell>
            <TableCell>{o.customer}<div className="text-xs text-muted-foreground">{o.email}</div></TableCell>
            <TableCell>{o.date}</TableCell>
            <TableCell>{o.items}</TableCell>
            <TableCell>${o.total}</TableCell>
            <TableCell><Badge variant={o.status === "Delivered" ? "default" : o.status === "Cancelled" ? "destructive" : "secondary"}>{o.status}</Badge></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminOrders() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Order Service · {orders.length} total</p>
      </div>
      <Card className="shadow-soft">
        <CardContent className="p-5">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Pending">Pending</TabsTrigger>
              <TabsTrigger value="Processing">Processing</TabsTrigger>
              <TabsTrigger value="Delivered">Delivered</TabsTrigger>
              <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4"><OrderTable list={orders} /></TabsContent>
            {(["Pending", "Processing", "Delivered", "Cancelled"] as const).map((s) => (
              <TabsContent key={s} value={s} className="mt-4"><OrderTable list={orders.filter((o) => o.status === s)} /></TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
