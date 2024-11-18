import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { getUserSSR } from "@/services/get-user-ssr";
import { getAccessToken } from "@/services/get-acess-token";

export async function GET(request: NextRequest) {
  try {
    const user = await getUserSSR(request);
    console.log("[GET /api/customers] User:", user);
    
    if (!user || user.user_metadata.role !== 'ADMIN') {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "updatedAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as "asc" | "desc";

    const customers = await db.user.findMany({
      where: {
        role: "CUSTOMER",
        OR: search
          ? [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ]
          : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return NextResponse.json(customers);
  } catch (error) {
    console.error("[CUSTOMERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
