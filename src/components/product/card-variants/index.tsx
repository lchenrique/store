import { ProductCardLayoutType } from "@/config/layouts";
import { MinimalCard } from "./minimal-card";
import { Product } from "@/services/types";

interface ProductCardProps {
  variant: ProductCardLayoutType;
  product: Product;
  className?: string;
}

export function DynamicProductCard({ variant, product, className }: ProductCardProps) {
  // Por enquanto, vamos usar o MinimalCard como padrão para todos os variants
  // Depois implementaremos os outros estilos
  return <MinimalCard product={product} className={className} />;
}
