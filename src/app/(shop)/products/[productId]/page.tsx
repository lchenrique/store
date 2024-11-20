import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Truck, Shield, Package, ChevronLeft, Heart } from "lucide-react";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { AddToCart } from "../components/add-to-cart";
import ProductImage from "../../_components/product-Image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { FavoriteButton } from "../components/favorite-button";
import { ProductReviews } from "@/components/product/product-reviews";
import { mapSupabaseUser } from "@/lib/user";
import { createClient } from "@/lib/supabase/server";
import { MainPage } from "@/components/layout/main-page";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userId: string;
  productId: string;
  user: {
    name: string | null;
  };
}

type Params = Promise<{
  productId: string;
}>

async function getProduct(productId: string) {
  const product = await db.product.findUnique({
    where: { id: productId },
  });

  if (!product) notFound();

  return product;
}

export default async function ProductPage(props: {
  params: Params;
}) {
  const params = await props.params;
  const supabase =  await createClient()
  const user = await supabase.auth.getUser()
  const product = await getProduct(params.productId);

  // Buscar avaliações do produto
  const store = await db.store.findFirst({
    select: {
      settings: true,
    },
  });

  const settings = store?.settings as { enableReviews?: boolean } | null;
  let reviews: Review[] = [];

  if (settings?.enableReviews) {
    const prismaReviews = await db.review.findMany({
      where: {
        productId: params.productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    reviews = prismaReviews.map(review => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment ?? '',
      createdAt: review.createdAt.toISOString(),
      userId: review.userId ?? '',
      productId: review.productId,
      user: {
        name: review.user?.name ?? 'Usuário Anônimo'
      }
    }));
  }

  return (
    <MainPage>
      <Button variant="ghost" className="mb-6 hover:bg-muted/50" asChild>
        <Link href="/products">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar para Produtos
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
        {/* Coluna da Imagem */}
        <div className=" top-24">
          <Card className="overflow-hidden border-delicate">
            <ProductImage images={product.images} />
            {product.stock < 5 && product.stock > 0 && (
              <Badge className="absolute top-4 right-4 bg-red-500/90 hover:bg-red-500/100">
                Últimas {product.stock} unidades
              </Badge>
            )}
          </Card>
        </div>

        {/* Coluna dos Detalhes */}
        <div className="h-fit space-y-8 min-h-[calc(100vh-12rem)]">
          {/* Cabeçalho do Produto */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                {product.name}
              </h1>
              <FavoriteButton productId={product.id} />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </p>
            </div>
          </div>

          <Separator className="bg-muted/60" />

          {/* Descrição */}
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Ações */}
          <div className="flex items-center">
            <AddToCart product={product} />
          </div>

          {/* Benefícios */}
          <Card className="border-delicate bg-card/50">
            <div className="grid grid-cols-3 gap-6 p-6">
              <div className="text-center space-y-2">
                <Truck className="h-6 w-6 mx-auto text-primary" />
                <p className="text-sm font-medium text-foreground">Frete Grátis</p>
                <p className="text-xs text-muted-foreground">Em todo o Brasil</p>
              </div>
              <div className="text-center space-y-2">
                <Shield className="h-6 w-6 mx-auto text-primary" />
                <p className="text-sm font-medium text-foreground">Garantia</p>
                <p className="text-xs text-muted-foreground">12 meses</p>
              </div>
              <div className="text-center space-y-2">
                <Package className="h-6 w-6 mx-auto text-primary" />
                <p className="text-sm font-medium text-foreground">Troca Grátis</p>
                <p className="text-xs text-muted-foreground">Em até 7 dias</p>
              </div>
            </div>
          </Card>

          {/* Características */}
          <Card className="border-delicate">
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Características
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <span className="text-muted-foreground">
                    Material de alta qualidade e durabilidade
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <span className="text-muted-foreground">
                    Design exclusivo e elegante
                  </span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
                  <span className="text-muted-foreground">
                    Acabamento premium
                  </span>
                </li>
              </ul>
            </div>
          </Card>

        
        </div>
      
      </div>
          {/* Avaliações */}
          {settings?.enableReviews && (
            <Card className="border-delicate mt-3">
              <div className="p-6">
                <ProductReviews
                  productId={product.id}
                  user={user.data.user ? mapSupabaseUser(user.data.user) : null}
                  initialReviews={reviews}
                />
              </div>
            </Card>
          )}
    </MainPage>
  );
}
