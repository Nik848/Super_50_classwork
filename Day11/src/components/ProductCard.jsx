import { useNavigate } from "react-router";
import { Star } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(ROUTES.VIEW_PRODUCT(product.id));
  };

  const discountedPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2);

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/20"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-muted/30">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.discountPercentage > 10 && (
          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 text-white border-none">
            -{Math.round(product.discountPercentage)}%
          </Badge>
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 border-none"
        >
          {product.category}
        </Badge>
      </div>

      {/* Content */}
      <CardHeader className="pb-0 pt-4">
        <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
          {product.title}
        </CardTitle>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {product.description}
        </p>
      </CardHeader>

      <CardContent className="pb-0">
        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.stock} in stock)
          </span>
        </div>
      </CardContent>

      {/* Price */}
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">
            ${discountedPrice}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          View
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProductCard;
