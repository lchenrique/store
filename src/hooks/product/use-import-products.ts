import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "../use-query";
import { toast } from "../use-toast";

export const useImportProducts = () => {
  const queryClient = useQueryClient();

  return useMutation(async (file: File) => {
    try {
      const fileContent = await file.text();
      const products = JSON.parse(fileContent);

      const response = await fetch('/api/admin/products/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ products }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao importar produtos');
      }

      return response.json();
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error('Arquivo JSON inválido');
      }
      throw error;
    }
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "Sucesso!",
        description: "Produtos importados com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao importar produtos",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
