import { useState } from 'react';
import apiClient from '@/services/api';

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export function useCEP() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async (cep: string) => {
    // Remove qualquer caractere que não seja número
    const cleanCEP = cep.replace(/\D/g, '');

    // Verifica se o CEP tem 8 dígitos
    if (cleanCEP.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await apiClient.getAddressByCEP(cleanCEP);

      if (data.erro) {
        setError('CEP não encontrado');
        return null;
      }

      return {
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf,
      };
    } catch (err) {
      setError('Erro ao buscar CEP');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchAddress,
    loading,
    error,
  };
}
