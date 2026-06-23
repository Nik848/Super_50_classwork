import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Star,
  ArrowLeft,
  Package,
  Truck,
  Shield,
  Tag,
  BarChart3,
  Info,
} from "lucide-react";
import { getProductById } from "@/api";
import { ROUTES } from "@/constants";
import { errorToast, successToast } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(id);
      setProduct(data);
      successToast("Product loaded successfully!");
    } catch (error) {
      errorToast(
        error?.response?.data?.message || "Failed to fetch product details"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="h-9 w-24 bg-muted/50 animate-pulse rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="aspect-square rounded-2xl bg-muted/50 animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 bg-muted/50 animate-pulse rounded" />
            <div className="h-4 w-1/4 bg-muted/50 animate-pulse rounded" />
            <div className="h-20 w-full bg-muted/50 animate-pulse rounded" />
            <div className="h-10 w-1/3 bg-muted/50 animate-pulse rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Package className="size-16 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Product not found</h2>
        <Button onClick={() => navigate(ROUTES.HOME)}>
          <ArrowLeft className="size-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  const discountedPrice = (
    product.price -
    (product.price * product.discountPercentage) / 100
  ).toFixed(2);

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="gap-2 -ml-2"
      >
        <ArrowLeft className="size-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Images Section */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-2xl bg-muted/30 border aspect-square">
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
              className="h-full w-full object-contain p-4"
            />
            {product.discountPercentage > 10 && (
              <Badge className="absolute top-4 left-4 bg-red-500 text-white border-none text-sm px-3 py-1">
                -{Math.round(product.discountPercentage)}% OFF
              </Badge>
            )}
          </div>
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`shrink-0 size-20 rounded-lg border-2 overflow-hidden transition-all ${
                    selectedImage === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-muted hover:border-primary/40"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Title & Brand */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{product.category}</Badge>
              {product.brand && (
                <Badge variant="outline">{product.brand}</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.title}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`size-5 ${
                    i < Math.round(product.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 py-2">
            <span className="text-4xl font-bold text-primary">
              ${discountedPrice}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-xl text-muted-foreground line-through">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <Card className="py-4">
              <CardContent className="flex items-center gap-3 py-0">
                <Package className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Stock</p>
                  <p className="font-medium text-sm">{product.stock} units</p>
                </div>
              </CardContent>
            </Card>
            <Card className="py-4">
              <CardContent className="flex items-center gap-3 py-0">
                <Tag className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">SKU</p>
                  <p className="font-medium text-sm">{product.sku || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="py-4">
              <CardContent className="flex items-center gap-3 py-0">
                <Truck className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Shipping</p>
                  <p className="font-medium text-sm">
                    {product.shippingInformation || "Standard"}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="py-4">
              <CardContent className="flex items-center gap-3 py-0">
                <Shield className="size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Warranty</p>
                  <p className="font-medium text-sm">
                    {product.warrantyInformation || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Details */}
          {product.tags && product.tags.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <section className="space-y-6 pt-8 border-t">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-6 text-primary" />
            <h2 className="text-2xl font-bold tracking-tight">
              Customer Reviews
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.reviews.map((review, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {review.reviewerName}
                    </CardTitle>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">
                    {review.comment}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-3">
                    {new Date(review.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ViewPage;
