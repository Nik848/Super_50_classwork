import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Search, Home, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

function Navbar() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchText.trim())}`);
      setSearchText("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo / Home */}
        <Link
          to={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-lg tracking-tight transition-colors hover:text-primary/80"
        >
          <ShoppingBag className="size-5 text-primary" />
          <span className="hidden sm:inline bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            ShopVista
          </span>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="flex flex-1 max-w-lg items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-9 bg-muted/50 border-muted focus:bg-background"
            />
          </div>
          <Button type="submit" size="sm" className="shrink-0">
            <Search className="size-4" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </form>

        {/* Home Button */}
        <Link to={ROUTES.HOME}>
          <Button variant="ghost" size="icon" className="shrink-0">
            <Home className="size-5" />
          </Button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
