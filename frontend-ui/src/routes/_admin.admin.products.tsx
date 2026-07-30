import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_admin/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const [q, setQ] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  const products = response?.data || [];
  const list = products.filter((p) => p.product_name.toLowerCase().includes(q.toLowerCase()) || p.product_id.toLowerCase().includes(q.toLowerCase()));

  const [formData, setFormData] = useState({
    product_id: `P${Math.floor(Math.random() * 10000)}`,
    product_name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    image: "",
  });

  const createProductMutation = useMutation({
    mutationFn: async () => {
      const priceNum = parseFloat(formData.price);
      const stockNum = parseInt(formData.stock, 10);
      
      // 1. Create in Product Service
      await api.products.create({
        product_id: formData.product_id,
        product_name: formData.product_name,
        description: formData.description,
        category: formData.category,
        price: priceNum,
        stock: stockNum,
        image: formData.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
      });

      // 2. Initialize in Inventory Service
      await api.inventory.create({
        inventory_id: `inv_${formData.product_id}`,
        product_id: formData.product_id,
        available_stock: stockNum,
        reserved_stock: 0,
      });
    },
    onSuccess: () => {
      toast.success("Product created successfully!");
      setIsDialogOpen(false);
      setFormData({
        product_id: `P${Math.floor(Math.random() * 10000)}`,
        product_name: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        image: "",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate();
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your catalog via Product Service</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-brand"><Plus className="mr-1.5 h-4 w-4" /> New product</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Create a new product in the catalog. It will automatically be registered in the live inventory system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <Label>Product ID (SKU)</Label>
                <Input value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <Label>Name</Label>
                <Input value={formData.product_name} onChange={e => setFormData({...formData, product_name: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Input value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <Label>Price</Label>
                  <Input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Initial Stock</Label>
                <Input type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <Input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="space-y-1">
                <Label>Image URL (Optional)</Label>
                <Input value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://example.com/image.jpg" />
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createProductMutation.isPending}>
                  {createProductMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Product
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-soft">
        <CardContent className="p-5">
          <div className="relative mb-4 max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Master Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading products...</TableCell>
                </TableRow>
              ) : list.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No products found.</TableCell>
                </TableRow>
              ) : (
                list.map((p) => (
                  <TableRow key={p.product_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={p.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <div className="font-medium">{p.product_name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.product_id}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>
                      {p.stock === 0
                        ? <Badge variant="destructive">Out</Badge>
                        : p.stock < 20
                          ? <Badge className="bg-warning/10 text-warning border-0">{p.stock} left</Badge>
                          : <span>{p.stock}</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => toast.success("Edit coming soon")}><Pencil className="h-3.5 w-3.5" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => toast.success("Delete coming soon")}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
