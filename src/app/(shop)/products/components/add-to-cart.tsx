'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { Minus, Plus, ShoppingCart, ShoppingBag, Loader2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCart((state) => state.addItem);

  function updateQuantity(value: number) {
    setQuantity(Math.max(1, Math.min(value, product.stock)));
  }

  async function addToCart() {
    try {
      setIsLoading(true);
      
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(quantity - 1)}
              disabled={quantity <= 1}
              className="h-10 w-10 rounded-xl border-delicate"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => updateQuantity(parseInt(e.target.value))}
              className="h-10 w-16 text-center rounded-xl border-delicate [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(quantity + 1)}
              disabled={quantity >= product.stock}
              className="h-10 w-10 rounded-xl border-delicate"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground ml-4">
            {product.stock} unidades disponíveis
          </div>
        </div>

        <div className="flex items-center gap-3">
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
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </>
            )}
          </Button>
          <Button
            variant="outline"
            className="h-12 w-12 rounded-xl border-delicate"
            onClick={() => router.push('/cart')}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {product.stock <= 5 && product.stock > 0 && (
        <div className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-4 py-3 rounded-xl text-sm">
          <p className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Apenas {product.stock} {product.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'}
          </p>
        </div>
      )}

      {product.stock === 0 && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-xl text-sm">
          <p className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4" />
            Produto esgotado
          </p>
        </div>
      )}
    </div>
  );
}