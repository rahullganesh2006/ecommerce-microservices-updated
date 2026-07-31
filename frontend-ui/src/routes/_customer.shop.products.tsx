import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

export const Route = createFileRoute("/_customer/shop/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const search = useSearch({ strict: false }) as any;
  const initialCategory = search?.category || "all";

  const [q, setQ] = useState("");
  const [cat, setCat] = useState(initialCategory);
  const [sort, setSort] = useState("featured");
  
  const { data: response, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => api.products.list(),
  });

  const products = response?.data || [];
  const uniqueCategories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const categories = ["all", ...uniqueCategories];

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.product_name.toLowerCase().includes(q.toLowerCase()));
    if (cat !== "all") list = list.filter((p) => p.category === cat);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    // Mock rating for sorting
    if (sort === "rating") list = [...list].sort((a, b) => 4.5 - 4.5);
    return list;
  }, [q, cat, sort, products]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">All products</h1>
        <p className="text-sm text-muted-foreground">Browse our full catalog of {products.length} items</p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="pl-9" />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: low to high</SelectItem>
            <SelectItem value="price-desc">Price: high to low</SelectItem>
            <SelectItem value="rating">Highest rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">Loading products...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">No products found</div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6">
          {filtered.map((p) => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
    </div>
  );
}
