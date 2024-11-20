"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorite } from "@/hooks/use-favorite";

interface FavoriteButtonProps {
  productId: string;
}

export function FavoriteButton({ productId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorite(productId);
 

  return (
    <Button
      onClick={() => toggleFavorite()}
      variant="ghost"
      size="icon"
      className="hover:bg-muted/50"
    >
      <Heart
        className={`h-6 w-6 ${
          isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    </Button>
  );
}
