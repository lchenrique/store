import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/services/api";

export function useFavorite(productId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isFavorite = false } = useQuery({
    queryKey: ["favorite", productId],
    queryFn: async () => {
      const { isFavorite } = await apiClient.getFavoriteStatus(productId);
      return isFavorite;
    },
    staleTime: 0,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      return apiClient.toggleFavorite(productId);
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
