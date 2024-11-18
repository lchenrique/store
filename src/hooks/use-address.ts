"use client";

import { useState } from "react";
import apiClient from '@/services/api';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from "./use-toast";
import type { Address, AddressInput } from '@/services/types';

export const useAddress = () => {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiClient.getAddresses(),
  });

  const addAddress = useMutation({
    mutationFn: (address: AddressInput) => apiClient.createAddress(address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Endereço adicionado",
        description: "O endereço foi adicionado com sucesso!",
      });
    },
  });

  const updateAddress = useMutation({
    mutationFn: ({ id, address }: { id: string; address: AddressInput }) => 
      apiClient.updateAddress(id, address),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Endereço atualizado",
        description: "O endereço foi atualizado com sucesso!",
      });
    },
  });

  const removeAddress = useMutation({
    mutationFn: (id: string) => apiClient.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast({
        title: "Endereço removido",
        description: "O endereço foi removido com sucesso!",
      });
    },
  });

  const fetchAddressByCep = async (cep: string): Promise<Address | null> => {
    try {
      setIsLoading(true);
      const data = await apiClient.getAddressByCep(cep);
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "CEP não encontrado",
        });
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching address:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar endereço",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchAddressByCep,
    isLoading,
    query,
    addAddress,
    updateAddress,
    removeAddress,
  };
};
