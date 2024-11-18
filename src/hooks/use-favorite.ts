import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useFavorite(productId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isFavorite = false } = useQuery({
    queryKey: ["favorite", productId],
    queryFn: async () => {
      const response = await fetch(`/api/favorites?productId=${productId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch favorite status");
      }
      const data = await response.json();
      return data.isFavorite;
    },
    staleTime: 0,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle favorite");
      }

      return response.json();
    },
    onMutate: async () => {
      // Cancela qualquer refetch em andamento
      await queryClient.cancelQueries({ queryKey: ["favorite", productId] });
      
      // Invalida a query de favoritos
      await queryClient.invalidateQueries({ queryKey: ["favorites"] });

      // Guarda o valor anterior
      const previousFavorite = queryClient.getQueryData(["favorite", productId]);

      // Atualiza o status do favorito otimisticamente
      queryClient.setQueryData(["favorite", productId], !isFavorite);

      return { previousFavorite };
    },
    onError: (error, _, context) => {
      // Em caso de erro, reverte para o valor anterior
      if (context?.previousFavorite !== undefined) {
        queryClient.setQueryData(["favorite", productId], context.previousFavorite);
      }

      console.error("Error toggling favorite:", error);
      toast({
        title: "Erro",
        description: "Falha ao atualizar favoritos.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      // Atualiza com o valor real retornado pela API
      queryClient.setQueryData(["favorite", productId], data.isFavorite);
      

      toast({
        title: "Sucesso",
        description: isFavorite 
          ? "O item foi removido dos seus favoritos."
          : "O item foi adicionado aos seus favoritos.",
      });
    },
  });

  return {
    isFavorite,
    toggleFavorite,
  };
}
