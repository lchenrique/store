import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { getUserSSR } from "@/services/get-user-ssr";
import { getAccessToken } from "@/services/get-acess-token";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserSSR(request);
    
    if (!user || user.user_metadata.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, stock, images } = body;

    const product = await db.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        images,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Product creation error:', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const products = await db.product.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("[GET /api/admin/products] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
