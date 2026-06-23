import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { SearchX, PackageSearch } from "lucide-react";
import { searchProducts } from "@/api";
import { errorToast } from "@/utils";
import ProductCard from "@/components/ProductCard";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const data = await searchProducts(query);
      setProducts(data.products);
      setTotal(data.total);
    } catch (error) {
      errorToast(
        error?.response?.data?.message || "Failed to search products"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <PackageSearch className="size-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Search Results</h1>
        </div>
        {query && (
          <p className="text-muted-foreground">
            Showing results for{" "}
            <span className="font-semibold text-foreground">"{query}"</span>
            {!loading && (
              <span className="ml-1">
                — {total} product{total !== 1 ? "s" : ""} found
              </span>
            )}
          </p>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="rounded-full bg-muted p-6">
            <SearchX className="size-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">No products found</h2>
            <p className="text-muted-foreground max-w-md">
              We couldn't find any products matching "{query}". Try a different
              search term or browse our featured products.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
