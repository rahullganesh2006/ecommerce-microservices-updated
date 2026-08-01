import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle, Warehouse, Pencil, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [adjustData, setAdjustData] = useState({ product_id: "", name: "", available_stock: 0, new_stock: 0 });

  const updateStockMutation = useMutation({
    mutationFn: async () => {
      await api.inventory.update(`inv_${adjustData.product_id}`, {
        available_stock: adjustData.new_stock,
      });
      await api.products.update(adjustData.product_id, {
        stock: adjustData.new_stock,
      });
    },
    onSuccess: () => {
      toast.success("Stock level adjusted successfully!");
      setIsAdjustOpen(false);
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to adjust stock");
    },
  });

  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStockMutation.mutate();
  };

  const openAdjustDialog = (item: any) => {
    setAdjustData({ ...item, new_stock: item.available_stock });
    setIsAdjustOpen(true);
  };

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
                        <span className="tabular-nums font-semibold w-16 text-right">{item.available_stock} units</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6 ml-2" onClick={() => openAdjustDialog(item)}>
                          <Pencil className="h-3 w-3" />
                        </Button>
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
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Manually override the inventory level for {adjustData.name} ({adjustData.product_id}).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjustSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label>Current Stock</Label>
              <Input value={adjustData.available_stock} disabled className="bg-muted text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <Label>New Stock Level</Label>
              <Input type="number" min="0" value={adjustData.new_stock} onChange={e => setAdjustData({...adjustData, new_stock: parseInt(e.target.value) || 0})} required />
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsAdjustOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={updateStockMutation.isPending}>
                {updateStockMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
