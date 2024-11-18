"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./use-user";
import { Address } from "@/types";

export function useUserAddresses() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const query = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const response = await fetch('/api/addresses');
      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }
      return response.json() as Promise<Address[]>;
    },
    enabled: !!user?.id,
  });

  const addAddress = useMutation({
    mutationFn: async (address: Omit<Address, 'id' | 'userId'>) => {
      const response = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error('Failed to add address');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      const response = await fetch(`/api/addresses?id=${addressId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete address');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
    },
  });

  return {
    addresses: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    addAddress: addAddress.mutateAsync,
    isAddingAddress: addAddress.isPending,
    deleteAddress: deleteAddress.mutateAsync,
    isDeletingAddress: deleteAddress.isPending,
  };
}
