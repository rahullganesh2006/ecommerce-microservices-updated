import { createFileRoute } from "@tanstack/react-router";
import { customers } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/_admin/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">{customers.length} Cognito users</p>
      </div>
      <Card className="shadow-soft"><CardContent className="p-5">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Customer</TableHead><TableHead>Orders</TableHead><TableHead>Lifetime spend</TableHead><TableHead>Joined</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8"><AvatarFallback className="bg-gradient-brand text-xs text-primary-foreground">{c.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                    <div><div className="font-medium">{c.name}</div><div className="text-xs text-muted-foreground">{c.email}</div></div>
                  </div>
                </TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell>${c.spent.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{c.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </div>
  );
}
