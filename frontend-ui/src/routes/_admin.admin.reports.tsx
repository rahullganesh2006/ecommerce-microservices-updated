import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_admin/admin/reports")({
  component: () => (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-semibold tracking-tight">Reports</h1><p className="text-sm text-muted-foreground">Export operational and financial reports</p></div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Revenue report", "Orders export", "Inventory snapshot", "Customer segments", "Payment reconciliation", "Refunds"].map((t) => (
          <Card key={t} className="shadow-soft"><CardContent className="p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
            <div className="mt-4 font-medium">{t}</div>
            <div className="text-xs text-muted-foreground">Generated daily · S3 Athena</div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => toast.success(`${t} downloaded`)}><Download className="mr-1.5 h-3.5 w-3.5" /> Download CSV</Button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  ),
});
