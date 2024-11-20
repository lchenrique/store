"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "./use-user";
import apiClient  from "@/services/api";
import { AddressInput } from "@/services/types";

export function useUserAddresses() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const query = useQuery({
    queryKey: ['addresses', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      return apiClient.getAddresses();
    },
    enabled: !!user?.id,
  });

  const addAddress = useMutation({
    mutationFn: async (address: Omit<AddressInput, 'id' | 'userId'>) => {
      return apiClient.createAddress(address);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses', user?.id] });
    },
  });

  const deleteAddress = useMutation({
    mutationFn: async (addressId: string) => {
      return apiClient.deleteAddress(addressId);
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
