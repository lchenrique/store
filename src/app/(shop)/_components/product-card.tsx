'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const addItem = useCart((state) => state.addItem);

  // Garante que o ID está no formato UUID
  const formattedId = product.id.replace(/[^0-9a-fA-F-]/g, '');

  async function onAddToCart() {
    try {
      setIsLoading(true);
      
      addItem({
        id: formattedId,
        name: product.name,
        price: product.price,
        images: [product.images[0]],
        quantity: 1
      });

      toast({
        title: 'Adicionado ao carrinho',
        description: `${product.name} foi adicionado ao seu carrinho.`,
      });
      
      router.refresh();
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o item ao carrinho.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  }

  return (
    <Card className="overflow-hidden border-delicate group flex flex-col">
      <Link href={`/products/${formattedId}`}>
        <div className="relative aspect-square bg-muted/50">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D '}
            alt={product.name}
            fill
            className="object-cover transition-all group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4 flex-1">
        <Link href={`/products/${formattedId}`}>
          <h3 className="font-semibold hover:text-primary transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-2 line-clamp-2 h-10">
          {product.description}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2 justify-between w-full">
          <span className="text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            variant="default"
            size="sm"
            onClick={onAddToCart}
            disabled={isLoading || product.stock === 0}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adicionando...
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? 'Esgotado' : 'Adicionar'}
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}