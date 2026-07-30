import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Order } from "@/lib/types";

export const Route = createFileRoute("/_admin/admin/orders")({
  component: AdminOrders,
});

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

function OrderTable({ list, isLoading }: { list: Order[], isLoading: boolean }) {
  const queryClient = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: (params: { id: string, status: string }) => api.orders.update(params.id, { order_status: params.status }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Failed to update order status")
  });

  if (isLoading) {
    return <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl mt-4">Loading orders...</div>;
  }
  
  if (list.length === 0) {
    return <div className="py-8 text-center text-muted-foreground border border-dashed rounded-xl mt-4">No orders found</div>;
  }

  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow>
          <TableHead>Order</TableHead><TableHead>Customer</TableHead><TableHead>Date</TableHead>
          <TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {list.map((o) => (
          <TableRow key={o.order_id}>
            <TableCell className="font-medium">{o.order_id}</TableCell>
            <TableCell>{o.customer_id.split("@")[0]}<div className="text-xs text-muted-foreground">{o.customer_id}</div></TableCell>
            <TableCell>{formatOrderDate(o.order_id)}</TableCell>
            <TableCell>{o.items?.reduce((acc, i) => acc + i.quantity, 0) || 0}</TableCell>
            <TableCell>₹{o.total_amount}</TableCell>
            <TableCell>
              <Select defaultValue={o.order_status} onValueChange={(val) => updateStatus.mutate({ id: o.order_id, status: val })}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Placed">Placed</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AdminOrders() {
  const { data: response, isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list(),
  });

  const orders = response?.data || [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Order Service · {isLoading ? "..." : orders.length} total</p>
      </div>
      <Card className="shadow-soft">
        <CardContent className="p-5">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="Placed">Placed</TabsTrigger>
              <TabsTrigger value="Processing">Processing</TabsTrigger>
              <TabsTrigger value="Delivered">Delivered</TabsTrigger>
              <TabsTrigger value="Cancelled">Cancelled</TabsTrigger>
            </TabsList>
            <TabsContent value="all"><OrderTable list={orders} isLoading={isLoading} /></TabsContent>
            {(["Placed", "Processing", "Delivered", "Cancelled"] as const).map((s) => (
              <TabsContent key={s} value={s}><OrderTable list={orders.filter((o) => o.order_status === s)} isLoading={isLoading} /></TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
