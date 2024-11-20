import Image from "next/image";
import { Product } from "@/types";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface MinimalCardProps {
  product: Product;
  className?: string;
}

export function MinimalCard({ product, className }: MinimalCardProps) {
  const router = useRouter();
  const cart = useCart();

  const onAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    cart.addItem(product);
  };

  return (
    <Card
      onClick={() => router.push(\`/product/\${product.id}\`)}
      className={cn(
        "group cursor-pointer space-y-4 rounded-xl p-3 transition-all hover:bg-accent",
        className
      )}
    >
      <div className="relative aspect-square rounded-xl bg-gray-100">
        <Image
          src={product.images?.[0]?.url}
          alt={product.name}
          fill
          className="aspect-square rounded-md object-cover"
        />
      </div>

      <div>
        <p className="text-lg font-semibold">{product.name}</p>
        <p className="text-sm text-muted-foreground">
          {product.category?.name}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(product.price)}
        </p>
        <Button
          onClick={onAddToCart}
          variant="secondary"
          size="icon"
        >
          <ShoppingCart className="h-5 w-5" />
        </Button>
      </div>
    </Card>
  );
}
