"use client";

import { useState } from "react";
import { toast } from "./use-toast";

interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export const useAddress = () => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchAddressByCep = async (cep: string): Promise<Address | null> => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/address/cep?cep=${cep}`);
      
      if (!response.ok) {
        const error = await response.text();
        toast({
          variant: "destructive",
          title: "Erro",
          description: error
        });
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao buscar endereço"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchAddressByCep,
    isLoading
  };
};
