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

const VALID_TRANSITIONS: Record<string, string[]> = {
  "Placed": ["Processing", "Cancelled"],
  "Processing": ["Shipped", "Cancelled"],
  "Shipped": ["Delivered"],
  "Delivered": [],
  "Cancelled": []
};

const STATUS_STYLES: Record<string, string> = {
  "Placed": "bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-600/20 hover:bg-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:ring-slate-500/20",
  "Processing": "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/20",
  "Shipped": "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:ring-indigo-500/20",
  "Delivered": "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20",
  "Cancelled": "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20 hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/20"
};

function OrderTable({ list, isLoading }: { list: Order[], isLoading: boolean }) {
  const queryClient = useQueryClient();
  const updateStatus = useMutation({
    mutationFn: (params: { id: string, status: string }) => api.orders.update(params.id, { order_status: params.status }),
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (err: any) => {
      let msg = err.message || "Failed to update order status";
      try {
        if (msg.includes("API 400:")) {
          const jsonStr = msg.split("API 400: ")[1];
          const parsed = JSON.parse(jsonStr);
          if (parsed.detail) msg = parsed.detail;
        }
      } catch (e) {}
      toast.error(msg);
    }
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
                <SelectTrigger className={`w-[110px] h-7 px-2.5 text-[11px] font-medium ${STATUS_STYLES[o.order_status || "Placed"] || "bg-muted"}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Placed", "Processing", "Shipped", "Delivered", "Cancelled"].map(val => {
                    const currentStatus = o.order_status || "Placed";
                    const allowed = VALID_TRANSITIONS[currentStatus] || [];
                    const isAllowed = val === currentStatus || allowed.includes(val);
                    return (
                      <SelectItem key={val} value={val} disabled={!isAllowed} className="font-medium cursor-pointer">
                        {val}
                      </SelectItem>
                    );
                  })}
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
