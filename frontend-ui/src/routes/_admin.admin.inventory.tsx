import { createFileRoute } from "@tanstack/react-router";
import { products } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Warehouse } from "lucide-react";

export const Route = createFileRoute("/_admin/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Real-time stock levels from Inventory Service</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="shadow-soft"><CardContent className="p-5">
          <div className="flex items-center gap-3"><Warehouse className="h-5 w-5 text-primary" /><div className="text-sm text-muted-foreground">Total SKUs</div></div>
          <div className="mt-3 text-2xl font-bold">{products.length}</div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-5">
          <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-warning" /><div className="text-sm text-muted-foreground">Low stock</div></div>
          <div className="mt-3 text-2xl font-bold">{products.filter((p) => p.stock > 0 && p.stock < 20).length}</div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-5">
          <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-destructive" /><div className="text-sm text-muted-foreground">Out of stock</div></div>
          <div className="mt-3 text-2xl font-bold">{products.filter((p) => p.stock === 0).length}</div>
        </CardContent></Card>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold">Stock levels</h3>
          <div className="space-y-4">
            {products.map((p) => {
              const pct = Math.min(100, (p.stock / 200) * 100);
              return (
                <div key={p.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.sku}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {p.stock === 0 && <Badge variant="destructive">Out</Badge>}
                      {p.stock > 0 && p.stock < 20 && <Badge className="bg-warning/10 text-warning border-0">Low</Badge>}
                      <span className="tabular-nums">{p.stock} units</span>
                    </div>
                  </div>
                  <Progress value={pct} className="h-2" />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
