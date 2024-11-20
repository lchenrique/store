import { Product } from '@prisma/client';
import { AlertTriangle, Package, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Image from 'next/image';

interface InventoryAlertsProps {
  products: Product[];
}

export function InventoryAlerts({ products }: InventoryAlertsProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-center space-y-4">
        <Package className="h-12 w-12 text-muted-foreground" />
        <div>
          <p className="font-medium">Estoque Saudável</p>
          <p className="text-sm text-muted-foreground">Todos os produtos estão com estoque adequado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const stockPercentage = (product.stock / 20) * 100; // Considerando 20 como estoque ideal
        const isVeryLow = product.stock <= 2;

        return (
          <Card
            key={product.id}
            className={`p-4 transition-colors ${
              isVeryLow ? 'border-destructive/50' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-secondary">
                    <Package className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  {isVeryLow && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                  <p className="font-medium line-clamp-1">{product.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={stockPercentage} className="h-2" />
                  <span className="text-sm font-medium">{product.stock}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isVeryLow
                    ? 'Estoque crítico!'
                    : 'Estoque baixo'}
                </p>
              </div>
              <Link href={`/admin/products/${product.id}/edit`}>
                <Button size="sm" variant="outline" className="gap-2">
                  <ArrowUpCircle className="h-4 w-4" />
                  Atualizar
                </Button>
              </Link>
            </div>
          </Card>
        );
      })}
    </div>
  );
}