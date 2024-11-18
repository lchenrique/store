'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@prisma/client';
import { Minus, Plus, ShoppingBag, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useQuery } from '@/hooks/use-query';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/hooks/use-cart';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export default function CartPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const cart = useCart((state) => state.items);
  const removeItem = useCart((state) => state.removeItem);
  const updateQuantity = useCart((state) => state.updateQuantity);

  useEffect(() => {
    // Simular um pequeno delay para mostrar o skeleton
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  async function handleCheckout() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
      });

      if (!response.ok) throw new Error();

      const { url } = await response.json();
      window.location.href = url;
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível iniciar o checkout.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="bg-muted/40">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-32 mt-1" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
            
            <div className="grid gap-8 lg:grid-cols-12">
              {/* Lista de Produtos Skeleton */}
              <div className="lg:col-span-8 space-y-6">
                {[1, 2].map((item) => (
                  <Card key={item} className="overflow-hidden border-delicate">
                    <div className="flex gap-6 p-6">
                      <Skeleton className="aspect-square w-32 rounded-xl" />
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-24" />
                          </div>
                          <Skeleton className="h-8 w-8" />
                        </div>
                        <div className="flex items-end justify-between mt-auto">
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-8 w-24" />
                          </div>
                          <Skeleton className="h-6 w-24" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Resumo do Pedido Skeleton */}
              <div className="lg:col-span-4">
                <div className="sticky top-24">
                  <Card className="border-delicate">
                    <CardHeader>
                      <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Skeleton className="h-12 w-full" />
                    </CardFooter>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
        <div className="mb-6">
          <ShoppingBag className="h-24 w-24 text-muted-foreground/60" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Parece que você ainda não adicionou nenhum item ao seu carrinho. 
          Que tal explorar nossos produtos?
        </p>
        <Button size="lg" asChild>
          <Link href="/products" className="gap-2">
            <ShoppingBag className="h-4 w-4" />
            Explorar Produtos
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-muted/40">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Carrinho de Compras</h1>
              <p className="text-muted-foreground mt-1">
                {cart.length} {cart.length === 1 ? 'item' : 'itens'} no seu carrinho
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continuar Comprando
              </Link>
            </Button>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Lista de Produtos */}
            <div className="lg:col-span-8 space-y-6">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden border-delicate">
                  <div className="flex gap-6 p-6">
                    <div className="relative aspect-square w-32 overflow-hidden rounded-xl bg-muted/50">
                      <Image
                        src={item.image || '/placeholder.png'}
                        alt={item.name || 'Product'}
                        fill
                        className="object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <Link 
                            href={`/products/${item.id}`}
                            className="text-lg font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-base font-medium text-primary">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="mt-4 flex items-end justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="h-8 w-14 text-center rounded-lg"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-lg"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="font-medium text-lg">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <Card className="border-delicate">
                  <CardHeader>
                    <CardTitle>Resumo do Pedido</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatPrice(total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Frete</span>
                        <span className="text-muted-foreground">Calculado no checkout</span>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-medium">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      className="w-full h-12" 
                      size="lg"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="mr-2 h-4 w-4" />
                          Finalizar Compra
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-center text-muted-foreground px-4">
                      Ao finalizar sua compra, você será redirecionado para nossa página de pagamento segura
                    </p>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(price);
}