import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { 
  downloadInventoryReport, 
  downloadOrdersReport, 
  downloadRevenueReport,
  downloadCustomerSegmentsReport,
  downloadRefundsReport,
  downloadPaymentReconciliationReport
} from "@/lib/reports";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, X } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/reports")({
  component: ReportsPage,
});

function extractDateObj(id: string): Date | null {
  const parts = id.split("-");
  if (parts.length > 1) {
    const ts = parseInt(parts[1], 10);
    if (!isNaN(ts)) return new Date(ts);
  }
  return null;
}

function ReportsPage() {
  const { data: productsRes } = useQuery({ queryKey: ["admin-products"], queryFn: () => api.products.list() });
  const { data: ordersRes } = useQuery({ queryKey: ["admin-orders"], queryFn: () => api.orders.list() });
  const { data: paymentsRes } = useQuery({ queryKey: ["admin-payments"], queryFn: () => api.payments.list() });

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const handleDownload = async (type: string) => {
    try {
      let filteredOrders = ordersRes?.data || [];
      let filteredPayments = paymentsRes?.data || [];

      if (startDate || endDate) {
        const matchDate = (id: string) => {
          const d = extractDateObj(id);
          if (!d) return false;
          
          const itemTime = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
          let pass = true;
          
          if (startDate) {
            const s = new Date(startDate);
            const startTime = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
            if (itemTime < startTime) pass = false;
          }
          
          if (endDate) {
            const e = new Date(endDate);
            const endTime = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
            if (itemTime > endTime) pass = false;
          }
          
          return pass;
        };
        filteredOrders = filteredOrders.filter(o => matchDate(o.order_id));
        filteredPayments = filteredPayments.filter(p => matchDate(p.payment_id));
      }

      if (type === "Revenue report") {
        if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
        await downloadRevenueReport(filteredOrders);
      } else if (type === "Orders export") {
        if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
        await downloadOrdersReport(filteredOrders);
      } else if (type === "Inventory snapshot") {
        if (!productsRes?.data) throw new Error("Data still loading, please wait...");
        // Inventory is a point-in-time snapshot, date filter does not apply
        await downloadInventoryReport(productsRes.data);
      } else if (type === "Customer segments") {
        if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
        await downloadCustomerSegmentsReport(filteredOrders);
      } else if (type === "Refunds") {
        if (!ordersRes?.data) throw new Error("Data still loading, please wait...");
        await downloadRefundsReport(filteredOrders);
      } else if (type === "Payment reconciliation") {
        if (!paymentsRes?.data) throw new Error("Data still loading, please wait...");
        await downloadPaymentReconciliationReport(filteredPayments);
      } else {
        toast.info(`${type} generation is not supported yet.`);
        return;
      }
      toast.success(`${type} downloaded successfully`);
    } catch (e: any) {
      toast.error(e.message || "Failed to download report");
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
          <p className="text-sm text-muted-foreground">Export operational and financial reports</p>
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Revenue report", "Orders export", "Inventory snapshot", "Customer segments", "Payment reconciliation", "Refunds"].map((t) => (
          <Card key={t} className="shadow-soft">
            <CardContent className="p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
              <div className="mt-4 font-medium">{t}</div>
              <div className="text-xs text-muted-foreground">Generated dynamically · PDF Format</div>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => handleDownload(t)}>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download PDF
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
