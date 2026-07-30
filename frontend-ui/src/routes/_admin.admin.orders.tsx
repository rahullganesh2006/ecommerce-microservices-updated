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
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_admin/admin/orders")({
  component: AdminOrders,
});

function getOrderDateObj(order_id: string): Date | null {
  const parts = order_id.split("-");
  if (parts.length > 1) {
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts)) return new Date(ts);
  }
  return null;
}

function formatOrderDate(order_id: string) {
  const d = getOrderDateObj(order_id);
  return d ? d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Unknown date";
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
            <TableCell>
              <div className="flex flex-col gap-1 py-1">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="text-xs whitespace-nowrap">
                    <span className="font-semibold text-foreground">{item.quantity}x</span> <span className="text-muted-foreground">{item.product_name || item.product_id}</span>
                  </div>
                ))}
              </div>
            </TableCell>
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

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const allOrders = response?.data || [];
  
  const orders = allOrders.filter(o => {
    if (!startDate && !endDate) return true;
    
    const oDate = getOrderDateObj(o.order_id);
    if (!oDate) return false;
    
    // Normalize time to midnight for accurate comparisons
    const orderTime = new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate()).getTime();
    
    let pass = true;
    if (startDate) {
      const s = new Date(startDate);
      const startTime = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
      if (orderTime < startTime) pass = false;
    }
    
    if (endDate) {
      const e = new Date(endDate);
      const endTime = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
      if (orderTime > endTime) pass = false;
    }
    
    return pass;
  });

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Order Service · {isLoading ? "..." : orders.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              type="date" 
              className="pl-9 w-[140px] cursor-pointer" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              onClick={(e) => 'showPicker' in HTMLInputElement.prototype && (e.currentTarget as any).showPicker()}
              title="Start Date"
            />
          </div>
          <span className="text-muted-foreground text-sm">to</span>
          <div className="relative">
            <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input 
              type="date" 
              className="pl-9 w-[140px] cursor-pointer" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              onClick={(e) => 'showPicker' in HTMLInputElement.prototype && (e.currentTarget as any).showPicker()}
              title="End Date"
            />
          </div>
          {(startDate || endDate) && (
            <Button variant="ghost" size="icon" onClick={() => { setStartDate(""); setEndDate(""); }} title="Clear filter">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
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
