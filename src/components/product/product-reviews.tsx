"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useProductReviews } from "@/hooks/use-product-reviews";
import type { Review as ApiReview } from '@/services/types';

interface ReviewWithUser extends ApiReview {
  user: {
    name: string | null;
  };
}

interface ProductReviewsProps {
  productId: string;
  user: User | null;
  initialReviews?: ReviewWithUser[];
}

export function ProductReviews({ productId, user, initialReviews = [] }: ProductReviewsProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { reviews, canReview, isPending, submitReview } = useProductReviews(productId, user, initialReviews);

  const onSubmit = () => {
    if (!user) {
      return router.push("/login");
    }

    submitReview(
      { rating, comment },
      {
        onSuccess: () => {
          setRating(0);
          setComment("");
        },
      }
    );
  };

  const StarRating = ({ value, onChange }: { value: number; onChange?: (rating: number) => void }) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            className={`text-yellow-400 ${onChange ? "cursor-pointer hover:scale-110" : "cursor-default"}`}
          >
            {star <= value ? (
              <Star className="h-6 w-6 fill-current" />
            ) : (
              <Star className="h-6 w-6" />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {!user && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              Faça login para avaliar este produto.
            </p>
          </CardContent>
        </Card>
      )}

      {user && canReview && (
        <Card>
          <CardHeader>
            <CardTitle>Avaliar Produto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sua avaliação</label>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Seu comentário (opcional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                disabled={isPending}
                placeholder="Digite seu comentário..."
              />
            </div>
            <Button onClick={onSubmit} disabled={isPending}>
              {isPending ? "Enviando..." : "Enviar Avaliação"}
            </Button>
          </CardContent>
        </Card>
      )}

      {user && !canReview && reviews.length === 0 && (
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">
              {user.user_metadata.role === "ADMIN" 
                ? "Você já avaliou este produto."
                : "Você precisa comprar este produto para avaliá-lo."}
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Avaliações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma avaliação ainda. Seja o primeiro a avaliar!
            </p>
          ) : (
            reviews.map((review: ReviewWithUser) => (
              <div key={review.id} className="space-y-2 border-b pb-4 last:border-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarRating value={review.rating} />
                    <span className="text-sm font-medium">
                      {review.user.name || "Usuário"}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
