import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
  };
}

interface ReviewData {
  rating: number;
  comment: string;
}

export function useProductReviews(productId: string, user: User | null, initialReviews: Review[] = []) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para verificar se pode avaliar
  const { data: canReview = false } = useQuery({
    queryKey: ["canReview", productId],
    queryFn: async () => {
      if (!user) return false;
      console.log("[canReview] Checking if user can review...");
      const response = await fetch(`/api/products/${productId}/can-review`);
      if (!response.ok) throw new Error("Failed to check review permission");
      const data = await response.json();
      console.log("[canReview] Result:", data);
      return data.canReview;
    },
    enabled: !!user,
  });

  // Query para buscar as reviews
  const { data: reviews = initialReviews } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      console.log("[reviews] Fetching reviews...");
      const response = await fetch(`/api/products/${productId}/reviews`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      console.log("[reviews] Fetched reviews:", data);
      return data;
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
      const response = await fetch(`/api/products/${productId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[submitReview] Request failed:", error);
        throw new Error(error);
      }

      const result = await response.json();
      console.log("[submitReview] Success:", result);
      return result;
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
      const optimisticReview = {
        id: Date.now().toString(),
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: new Date().toISOString(),
        user: {
          name: user?.user_metadata?.name || "Usuário",
        },
      };

      queryClient.setQueryData(["reviews", productId], (old: Review[] = []) => {
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
