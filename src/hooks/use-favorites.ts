"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./use-user";
import { Product } from "@/types";

interface FavoriteProduct extends Product {
  favoriteId: string;
}

export function useFavorites() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const query = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const response = await fetch('/api/favorites');
      if (!response.ok) {
        throw new Error('Failed to fetch favorites');
      }
      const data = await response.json();

      return data.map(({ id, product }) => ({
        ...product,
        favoriteId: id,
      })) as FavoriteProduct[];
    },
    enabled: !!user?.id,
  });

  const addFavorite = useMutation({
    mutationFn: async (productId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add favorite');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (favoriteId: string) => {
      // Encontra o produto pelo favoriteId
      const favorite = query.data?.find(p => p.favoriteId === favoriteId);
      if (!favorite) {
        throw new Error('Favorite not found');
      }

      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: favorite.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove favorite');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  return {
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addFavorite,
    removeFavorite,
  };
}
