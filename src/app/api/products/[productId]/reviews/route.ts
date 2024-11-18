import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";

export async function POST(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { rating, comment } = body;

    if (!rating || rating < 1 || rating > 5) {
      return new NextResponse("Rating inválido", { status: 400 });
    }

    // Verifica se o produto existe
    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    if (!product) {
      return new NextResponse("Produto não encontrado", { status: 404 });
    }

    // Verifica se as avaliações estão habilitadas
    const store = await db.store.findFirst({
      select: {
        settings: true,
      },
    });

    const settings = store?.settings as { enableReviews?: boolean } | null;
    
    if (!settings?.enableReviews) {
      return new NextResponse("Avaliações desabilitadas", { status: 403 });
    }

    // Verifica se o usuário já avaliou este produto
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: params.productId,
        },
      },
    });

    if (existingReview) {
      return new NextResponse("Você já avaliou este produto", { status: 400 });
    }

    // Se for admin, pode avaliar sem comprar
    if (user.user_metadata.role === "ADMIN") {
      const review = await db.review.create({
        data: {
          rating,
          comment,
          userId: user.id,
          productId: params.productId,
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      });

      await updateProductRating(params.productId);
      return NextResponse.json(review);
    }

    // Para usuários normais, verifica se comprou o produto
    const hasPurchased = await db.orderItem.findFirst({
      where: {
        productId: params.productId,
        order: {
          userId: user.id,
          status: "DELIVERED",
        },
      },
    });

    if (!hasPurchased) {
      return new NextResponse(
        "Você precisa comprar o produto para avaliá-lo",
        { status: 403 }
      );
    }

    // Cria a avaliação
    const review = await db.review.create({
      data: {
        rating,
        comment,
        userId: user.id,
        productId: params.productId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    await updateProductRating(params.productId);
    return NextResponse.json(review);
  } catch (error) {
    console.log("[REVIEW_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

async function updateProductRating(productId: string) {
  const reviews = await db.review.findMany({
    where: {
      productId: productId,
    },
    select: {
      rating: true,
    },
  });

  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

  await db.product.update({
    where: {
      id: productId,
    },
    data: {
      rating: averageRating,
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const reviews = await db.review.findMany({
      where: {
        productId: params.productId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.log("[REVIEWS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
