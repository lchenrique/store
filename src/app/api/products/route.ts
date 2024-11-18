import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";

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
    console.error("[GET /api/products] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
