'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { ShoppingBag, Loader2, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { QuantitySelector } from '@/components/quantity-selector';

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCart((state) => state.addItem);

  async function addToCart() {
    try {
      setIsLoading(true);
      
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        images: [product.images[0]],
        quantity: quantity
      });

      toast({
        title: 'Adicionado ao carrinho',
        description: `${product.name} foi adicionado ao seu carrinho.`,
      });
      
      router.refresh();
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o item ao carrinho.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-2 w-full">
      <div className="flex gap-4 w-full">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
          minValue={1}
          maxValue={product.stock}
        />

        <Button
          className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
          onClick={addToCart}
          disabled={isLoading || product.stock === 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adicionando...
            </>
          ) : product.stock === 0 ? (
            <>
              <AlertOctagon className="mr-2 h-4 w-4" />
              Indisponível
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>
      </div>

      <div className="text-sm text-muted-foreground">
        {product.stock} unidades disponíveis
      </div>
    </div>
  );
}