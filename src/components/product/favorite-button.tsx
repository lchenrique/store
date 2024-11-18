'use client';

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";

interface FavoriteButtonProps {
  productId: string;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(favorites.some(fav => fav.id === productId));
  }, [favorites, productId]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      const favorite = favorites.find(fav => fav.id === productId);
      if (favorite) {
        await removeFavorite.mutateAsync(favorite.favoriteId);
      }
    } else {
      await addFavorite.mutateAsync(productId);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggleFavorite}
      disabled={addFavorite.isPending || removeFavorite.isPending}
      className={isFavorite ? "text-red-500 hover:text-red-600" : "text-gray-500 hover:text-gray-600"}
    >
      <Heart className="h-5 w-5" fill={isFavorite ? "currentColor" : "none"} />
    </Button>
  );
}
