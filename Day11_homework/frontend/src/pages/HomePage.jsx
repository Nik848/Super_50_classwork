import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Sparkles, Search, ArrowRight } from "lucide-react";
import { getProducts } from "@/api";
import { ROUTES } from "@/constants";
import { errorToast } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(100);

      // Pick 10 random products from the 100 fetched
      const shuffled = [...data.products].sort(() => 0.5 - Math.random());
      const randomTen = shuffled.slice(0, 10);
      setProducts(randomTen);
    } catch (error) {
      errorToast(
        error?.response?.data?.message || "Failed to fetch products"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/10 to-accent/20 px-6 py-16 sm:px-12 sm:py-20">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 size-72 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 size-72 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="size-4" />
            Discover Amazing Products
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
            Welcome to{" "}
            <span className="text-primary">ShopVista</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Browse through our curated collection of premium products.
            Find exactly what you're looking for with our powerful search.
          </p>

          {/* Hero Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="pl-9 h-11 bg-background/80"
              />
            </div>
            <Button type="submit" size="lg" className="h-11 gap-2">
              Search
              <ArrowRight className="size-4" />
            </Button>
          </form>
        </div>
      </section>

      {/* Products Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Featured Products
            </h2>
            <p className="text-muted-foreground mt-1">
              Hand-picked just for you
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-muted/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
