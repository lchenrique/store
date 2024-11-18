import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import apiClient from '@/services/api';
import { User } from "@/types";
import type { Review as ApiReview } from '@/services/types';

// Review com dados do usuário
interface ReviewWithUser extends ApiReview {
  user: {
    name: string | null;
  };
}

interface ReviewData {
  rating: number;
  comment: string;
}

export function useProductReviews(productId: string, user: User | null, initialReviews: ReviewWithUser[] = []) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para verificar se pode avaliar
  const { data: canReview = false } = useQuery({
    queryKey: ["canReview", productId],
    queryFn: async () => {
      if (!user) return false;
      console.log("[canReview] Checking if user can review...");
      const { canReview } = await apiClient.canReviewProduct(productId);
      console.log("[canReview] Result:", canReview);
      return canReview;
    },
    enabled: !!user,
  });

  // Query para buscar as reviews
  const { data: reviews = initialReviews } = useQuery<ReviewWithUser[], Error, ReviewWithUser[], [string, string]>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      console.log("[reviews] Fetching reviews...");
      const apiReviews = await apiClient.getProductReviews(productId);
      console.log("[reviews] Fetched reviews:", apiReviews);
      
      // Mapear as reviews para incluir os dados do usuário
      return apiReviews.map((review): ReviewWithUser => ({
        ...review,
        user: {
          name: "Usuário" // TODO: Buscar nome do usuário da API
        }
      }));
    },
    initialData: initialReviews,
    enabled: initialReviews.length === 0,
  });

  // Mutation para criar review
  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (data: ReviewData) => {
      console.log("[submitReview] Starting review submission...");
      console.log("[submitReview] User:", user);
      console.log("[submitReview] Data:", data);

      if (!user) {
        console.error("[submitReview] No user found");
        throw new Error("User not authenticated");
      }
      if (data.rating === 0) {
        console.error("[submitReview] Invalid rating");
        throw new Error("Selecione uma avaliação");
      }

      console.log("[submitReview] Making POST request...");
      const apiReview = await apiClient.createReview({
        ...data,
        productId,
      });
      console.log("[submitReview] Success:", apiReview);
      
      // Adiciona os dados do usuário à review
      return {
        ...apiReview,
        user: {
          name: user.user_metadata?.name || "Usuário"
        }
      } satisfies ReviewWithUser;
    },
    onMutate: async (newReview) => {
      console.log("[onMutate] Starting optimistic update...");
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["reviews", productId] });
      await queryClient.cancelQueries({ queryKey: ["canReview", productId] });

      // Snapshot the previous value
      const previousReviews = queryClient.getQueryData(["reviews", productId]);
      const previousCanReview = queryClient.getQueryData(["canReview", productId]);

      // Optimistically update to the new value
      const optimisticReview: ReviewWithUser = {
        id: Date.now().toString(),
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        userId: user?.id || '',
        productId,
        user: {
          name: user?.user_metadata?.name || "Usuário"
        }
      };

      queryClient.setQueryData(["reviews", productId], (old: ReviewWithUser[] = []) => {
        return [optimisticReview, ...old];
      });

      queryClient.setQueryData(["canReview", productId], false);

      console.log("[onMutate] Optimistic update complete");
      // Return a context object with the snapshotted value
      return { previousReviews, previousCanReview };
    },
    onError: (err, newReview, context) => {
      console.error("[onError] Error occurred:", err);
      queryClient.setQueryData(["reviews", productId], context?.previousReviews);
      queryClient.setQueryData(["canReview", productId], context?.previousCanReview);
      toast({
        variant: "destructive",
        title: "Erro ao enviar avaliação",
        description: err instanceof Error ? err.message : "Tente novamente mais tarde",
      });
    },
    onSuccess: () => {
      console.log("[onSuccess] Review submitted successfully");
      toast({
        title: "Avaliação enviada",
        description: "Obrigado por avaliar o produto!",
      });
    },
    onSettled: () => {
      console.log("[onSettled] Refreshing queries...");
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      queryClient.invalidateQueries({ queryKey: ["canReview", productId] });
    },
  });

  return {
    reviews,
    canReview,
    isPending,
    submitReview,
  };
}
