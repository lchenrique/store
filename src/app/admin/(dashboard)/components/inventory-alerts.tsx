import { Product } from '@prisma/client';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface InventoryAlertsProps {
  products: Product[];
}

export function InventoryAlerts({ products }: InventoryAlertsProps) {
  if (!products.length) {
    return <p className="text-sm text-muted-foreground">Nenhum alerta de estoque baixo</p>;
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-4">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                Apenas {product.stock} {product.stock === 1 ? 'item' : 'itens'} em estoque
              </p>
            </div>
          </div>
          <Link href={`/admin/products/${product.id}/edit`}>
            <Button variant="outline" size="sm">
              Atualizar Estoque
            </Button>
          </Link>
        </div>
      ))}
    </div>
  );
}