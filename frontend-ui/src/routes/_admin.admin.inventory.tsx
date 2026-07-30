import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Warehouse } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useMemo } from "react";

export const Route = createFileRoute("/_admin/admin/inventory")({
  component: AdminInventory,
});

function AdminInventory() {
  const { data: productsRes, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  const { data: inventoryRes, isLoading: loadingInventory } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => api.inventory.list(),
  });

  const isLoading = loadingProducts || loadingInventory;

  const mergedData = useMemo(() => {
    const products = productsRes?.data || [];
    const inventory = inventoryRes?.data || [];

    // Only include products that exist in the product catalog
    return products.map(product => {
      // Find matching inventory row by product_id
      const invRow = inventory.find(i => i.product_id === product.product_id);
      
      return {
        product_id: product.product_id,
        name: product.product_name,
        available_stock: invRow ? invRow.available_stock : product.stock,
      };
    });
  }, [productsRes, inventoryRes]);

  const outOfStockCount = mergedData.filter(d => d.available_stock === 0).length;
  const lowStockCount = mergedData.filter(d => d.available_stock > 0 && d.available_stock < 20).length;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
        <p className="text-sm text-muted-foreground">Real-time stock levels from Inventory Service</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="shadow-soft"><CardContent className="p-5">
          <div className="flex items-center gap-3"><Warehouse className="h-5 w-5 text-primary" /><div className="text-sm text-muted-foreground">Total SKUs</div></div>
          <div className="mt-3 text-2xl font-bold">{isLoading ? "..." : mergedData.length}</div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-5">
          <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-warning" /><div className="text-sm text-muted-foreground">Low stock</div></div>
          <div className="mt-3 text-2xl font-bold">{isLoading ? "..." : lowStockCount}</div>
        </CardContent></Card>
        <Card className="shadow-soft"><CardContent className="p-5">
          <div className="flex items-center gap-3"><AlertTriangle className="h-5 w-5 text-destructive" /><div className="text-sm text-muted-foreground">Out of stock</div></div>
          <div className="mt-3 text-2xl font-bold">{isLoading ? "..." : outOfStockCount}</div>
        </CardContent></Card>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-5">
          <h3 className="mb-4 font-semibold">Stock levels</h3>
          {isLoading ? (
            <div className="py-8 text-center text-muted-foreground">Loading live inventory...</div>
          ) : mergedData.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No active products found in catalog.</div>
          ) : (
            <div className="space-y-4">
              {mergedData.map((item) => {
                const pct = Math.min(100, (item.available_stock / 200) * 100);
                return (
                  <div key={item.product_id}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-muted-foreground">{item.product_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.available_stock === 0 && <Badge variant="destructive">Out</Badge>}
                        {item.available_stock > 0 && item.available_stock < 20 && <Badge className="bg-warning/10 text-warning border-0">Low</Badge>}
                        <span className="tabular-nums">{item.available_stock} units</span>
                      </div>
                    </div>
                    <Progress value={pct} className="h-2" />
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
