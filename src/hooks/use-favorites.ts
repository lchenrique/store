"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./use-user";
import { Product } from "@/types";
import apiClient from '@/services/api';

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
      
      const data = await apiClient.getFavorites();
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
      await apiClient.addFavorite(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavorite = useMutation({
    mutationFn: async (favoriteId: string) => {
      await apiClient.removeFavorite(favoriteId);
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
