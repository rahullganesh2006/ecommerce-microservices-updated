import { createFileRoute } from "@tanstack/react-router";
import { payments } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/payments")({
  component: AdminPayments,
});

function AdminPayments() {
  const success = payments.filter((p) => p.status === "Success");
  const failed = payments.filter((p) => p.status === "Failed");
  const revenue = success.reduce((n, p) => n + p.amount, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground">Payment Service · transaction ledger</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { l: "Revenue", v: `$${revenue}`, i: CreditCard, tone: "text-primary bg-primary/10" },
          { l: "Successful", v: success.length, i: CheckCircle2, tone: "text-success bg-success/10" },
          { l: "Failed", v: failed.length, i: XCircle, tone: "text-destructive bg-destructive/10" },
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
              <TableHead>Payment ID</TableHead><TableHead>Order</TableHead><TableHead>Method</TableHead>
              <TableHead>Amount</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.id}</TableCell>
                  <TableCell className="text-muted-foreground">{p.order}</TableCell>
                  <TableCell>{p.method}</TableCell>
                  <TableCell>${p.amount}</TableCell>
                  <TableCell>{p.date}</TableCell>
                  <TableCell>
                    <Badge variant={p.status === "Success" ? "default" : p.status === "Failed" ? "destructive" : "secondary"}>
                      {p.status === "Refunded" && <RefreshCcw className="mr-1 h-3 w-3" />}
                      {p.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
