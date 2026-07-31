import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle2, XCircle, RefreshCcw, ChevronDown, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import React, { useMemo, useState } from "react";
import type { Payment } from "@/lib/types";

export const Route = createFileRoute("/_admin/admin/payments")({
  component: AdminPayments,
});

function formatPaymentDate(payment_id: string, payment_time?: string) {
  if (payment_time) {
    try {
      const d = new Date(payment_time);
      if (!isNaN(d.getTime())) return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {}
  }
  const parts = payment_id.split("-");
  if (parts.length > 1) {
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts)) {
      return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  }
  return "Unknown date";
}

function AdminPayments() {
  const { data: response, isLoading: loadingPayments } = useQuery({
    queryKey: ["payments"],
    queryFn: () => api.payments.list(),
  });

  const { data: ordersResponse, isLoading: loadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: () => api.orders.list(),
  });

  const isLoading = loadingPayments || loadingOrders;
  const orders = ordersResponse?.data || [];

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleRow = (id: string) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const payments = useMemo(() => {
    const raw: Payment[] = response?.data || [];
    return [...raw].sort((a, b) => {
      // Sort by payment_time or payment_id descending
      const timeA = a.payment_time ? new Date(a.payment_time).getTime() : 0;
      const timeB = b.payment_time ? new Date(b.payment_time).getTime() : 0;
      if (timeA && timeB && timeA !== timeB) return timeB - timeA;
      return b.payment_id.localeCompare(a.payment_id);
    });
  }, [response]);

  const success = payments.filter((p) => {
    const s = p.payment_status?.toUpperCase();
    return s === "SUCCESS" || s === "COMPLETED";
  });
  const failed = payments.filter((p) => p.payment_status?.toUpperCase() === "FAILED");
  const revenue = success.reduce((n, p) => n + Number(p.amount || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Payment Service · transaction ledger</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Revenue", v: `₹${revenue.toFixed(2)}`, i: CreditCard, tone: "text-primary bg-primary/10" },
          { l: "Successful", v: isLoading ? "..." : success.length, i: CheckCircle2, tone: "text-success bg-success/10" },
          { l: "Failed", v: isLoading ? "..." : failed.length, i: XCircle, tone: "text-destructive bg-destructive/10" },
        ].map((k) => (
          <Card key={k.l} className="shadow-soft"><CardContent className="p-5">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${k.tone}`}><k.i className="h-4 w-4" /></div>
            <div className="mt-4 text-2xl font-bold">{k.v}</div>
            <div className="text-xs text-muted-foreground">{k.l}</div>
          </CardContent></Card>
        ))}
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-5">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Payment ID</TableHead><TableHead>Order</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground border-dashed border">Loading payments...</TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground border-dashed border">No payments found</TableCell>
                </TableRow>
              ) : payments.map((p) => {
                const isExpanded = expanded[p.payment_id];
                const order = orders.find((o) => o.order_id === p.order_id);
                const hasItems = order && order.items && order.items.length > 0;
                
                return (
                  <React.Fragment key={p.payment_id}>
                    <TableRow 
                      className={hasItems ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""} 
                      onClick={() => hasItems && toggleRow(p.payment_id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {hasItems ? (
                            isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <div className="h-4 w-4" />
                          )}
                          <span className="font-medium text-sm">{p.payment_id}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{p.order_id}</TableCell>
                      <TableCell>{p.payment_method}</TableCell>
                      <TableCell>₹{p.amount}</TableCell>
                      <TableCell>{formatPaymentDate(p.payment_id, p.payment_time)}</TableCell>
                      <TableCell>
                        <Badge variant={p.payment_status?.toUpperCase() === "SUCCESS" || p.payment_status?.toUpperCase() === "COMPLETED" ? "default" : p.payment_status?.toUpperCase() === "FAILED" ? "destructive" : "secondary"}>
                          {p.payment_status?.toUpperCase() === "REFUNDED" && <RefreshCcw className="mr-1 h-3 w-3" />}
                          {p.payment_status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    
                    {isExpanded && hasItems && (
                      <TableRow className="bg-muted/10 hover:bg-muted/10">
                        <TableCell colSpan={6} className="p-0 border-b">
                          <div className="px-10 py-5 border-l-2 border-primary ml-4 my-2">
                            <div className="w-full max-w-2xl">
                              <div className="grid grid-cols-[1fr_80px_100px] gap-4 mb-3 pb-2 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                <div>Item</div>
                                <div className="text-center">Qty</div>
                                <div className="text-right">Total</div>
                              </div>
                              <div className="space-y-3">
                                {order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="grid grid-cols-[1fr_80px_100px] gap-4 text-sm items-center">
                                    <div className="font-medium text-foreground">{item.product_name}</div>
                                    <div className="text-center text-muted-foreground">{item.quantity}</div>
                                    <div className="text-right tabular-nums text-muted-foreground">₹{(item.unit_price * item.quantity).toFixed(2)}</div>
                                  </div>
                                ))}
                              </div>
                              <div className="grid grid-cols-[1fr_100px] gap-4 mt-5 pt-3 border-t">
                                <div className="text-right text-muted-foreground font-medium uppercase tracking-wider text-[10px] flex items-center justify-end">Transaction Total</div>
                                <div className="text-right font-bold tabular-nums text-base">₹{p.amount}</div>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
