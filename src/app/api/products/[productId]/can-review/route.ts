import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import db from "@/lib/db";

type Params = Promise<{ productId: string }>;

export async function GET(req: Request,segmentData: { params: Params }) {
  try {
    const { productId } = await segmentData.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || !user.id) {
      return NextResponse.json({ canReview: false });
    }

    // Verifica se o produto existe
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      return NextResponse.json({ canReview: false });
    }

    // Verifica se as avaliações estão habilitadas
    const store = await db.store.findFirst({
      select: {
        settings: true,
      },
    });

    const settings = store?.settings as { enableReviews?: boolean } | null;
    
    if (!settings?.enableReviews) {
      return NextResponse.json({ canReview: false });
    }

    // Verifica se o usuário já avaliou este produto
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId,
        },
      },
    });

    if (existingReview) {
      return NextResponse.json({ canReview: false });
    }

    // Se for admin, pode avaliar sem comprar
    if (user.user_metadata.role === "ADMIN") {
      return NextResponse.json({ canReview: true });
    }

    // Para usuários normais, verifica se comprou o produto
    const hasPurchased = await db.orderItem.findFirst({
      where: {
        productId: productId,
        order: {
          userId: user.id,
          status: "DELIVERED",
        },
      },
    });

    return NextResponse.json({ canReview: !!hasPurchased });
  } catch (error) {
    console.log("[CAN_REVIEW]", error);
    return NextResponse.json({ canReview: false });
  }
}
