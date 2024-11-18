import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { Favorite, Product } from "@prisma/client";
import { getUserSSR } from "@/services/get-user-ssr";

type TokenUser = {
  id: string;
  email: string;
  role: string;
};

async function getUserFromToken(): Promise<TokenUser | null> {
  try {
    const cookieStore = cookies();
    const authToken = cookieStore.get('sb-127-auth-token')?.value;
    
    
    if (!authToken) {
      return null;
    }

    const tokenData = JSON.parse(Buffer.from(authToken.replace('base64-', ''), 'base64').toString());
    
    return tokenData?.user || null;
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserSSR(req);
    console.log("[GET /api/favorites] User:", user ? "Found" : "Not found");
    
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { productId } = body;

    if (!productId) {
      return new NextResponse("Product ID is required", { status: 400 });
    }

    // Verifica se já existe o favorito
    const existingFavorite = await db.favorite.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId: productId
        }
      }
    });

    console.log("Existing favorite:", existingFavorite);

    if (existingFavorite) {
      // Se existe, remove
      await db.favorite.delete({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId
          }
        }
      });
      return NextResponse.json({ isFavorite: false });
    } else {
      // Se não existe, cria
      const favorite = await db.favorite.create({
        data: {
          userId: user.id,
          productId: productId
        }
      });
      console.log("Created favorite:", favorite);
      return NextResponse.json({ isFavorite: true });
    }
  } catch (error) {
    console.error('Error in POST /api/favorites:', error);
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSSR(req);
    console.log("[GET /api/favorites] User:", user ? "Found" : "Not found");
    
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }


    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");

    if (productId) {
      // Verifica se o produto existe
      const product = await db.product.findUnique({
        where: {
          id: productId
        }
      });

      console.log("Product found:", product?.id);

      if (!product) {
        return NextResponse.json({ isFavorite: false });
      }

      const favorite = await db.favorite.findUnique({
        where: {
          userId_productId: {
            userId: user.id,
            productId: productId
          }
        }
      });

      console.log("Favorite found:", favorite?.id);

      return NextResponse.json({ isFavorite: !!favorite });
    }

    console.log("Fetching all favorites");
    // Busca todos os favoritos
    const favorites = await db.favorite.findMany({
      where: {
        userId: user.id
      }
    });

    // Busca os produtos dos favoritos
    const productsIds = favorites.map((fav: { productId: any; }) => fav.productId);
    const products = await db.product.findMany({
      where: {
        id: {
          in: productsIds
        }
      }
    });

    // Combina os dados
    const favoritesWithProducts = favorites.map((favorite: Favorite) => {
      const product = products.find((p: Product) => p.id === favorite.productId);
      return {
        id: favorite.id,
        product
      };
    });

    console.log("Found favorites:", favoritesWithProducts.length);

    return NextResponse.json(favoritesWithProducts);
  } catch (error) {
    console.error('Error in GET /api/favorites:', error);
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
