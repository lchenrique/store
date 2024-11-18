"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useFavorites } from "@/hooks/use-favorites";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { FavoritesSkeleton } from "./skeletons/favorites-skeleton";

export function FavoritesCard() {
  const { favorites, removeFavorite, isLoading } = useFavorites();

  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Produtos Favoritos</h2>
        {favorites.length === 0 ? (
          <div className="text-gray-500">
            Nenhum produto favoritado ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((product) => (
              <div key={product.id} className="flex items-center gap-4 border p-3 rounded-lg">
                {product.images?.[0] && (
                  <div className="relative w-16 h-16">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFavorite.mutate(product.favoriteId)}
                  disabled={removeFavorite.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
