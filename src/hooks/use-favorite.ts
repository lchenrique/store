"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/api";
import { useAuthRedirect } from "./use-auth-redirect";
import { useSession } from "@/hooks/use-session";

export function useFavorite(productId: string) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { redirectToLogin } = useAuthRedirect();
  const { session } = useSession();

  const { data: isFavorite = false } = useQuery({
    queryKey: ["favorite", productId],
    queryFn: async () => {
      if (!session) return false;
      const { isFavorite } = await apiClient.getFavoriteStatus(productId);
      return isFavorite;
    },
    staleTime: 0,
  });

  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async () => {
      if (!session) {
        // Redireciona para o login com callback para a página atual
        redirectToLogin(window.location.pathname);
        return;
      }
      return apiClient.toggleFavorite(productId);
    },
    onMutate: async () => {
      if (!session) return;

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

      toast({
        title: "Erro",
        description: "Falha ao atualizar favoritos.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      if (!data) return; // Se não houver dados (caso de redirecionamento), não faz nada
      
      // Atualiza com o valor real retornado pela API
      queryClient.setQueryData(["favorite", productId], data.isFavorite);

      toast({
        title: data.isFavorite ? "Adicionado aos favoritos" : "Removido dos favoritos",
        description: data.isFavorite 
          ? "Produto adicionado à sua lista de favoritos."
          : "Produto removido da sua lista de favoritos.",
      });
    },
  });

  return {
    isFavorite,
    toggleFavorite,
  };
}
