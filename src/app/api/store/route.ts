import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { uploadImage } from "@/services/s3";
import { getUserSSR } from "@/services/get-user-ssr";
import { getAccessToken } from "@/services/get-acess-token";

export async function PATCH(request: NextRequest) {
  try {
    console.log("[PATCH /api/store] Request cookies:", request.cookies.getAll().map(c => c.name));
    console.log("[PATCH /api/store] Request headers:", Object.fromEntries(request.headers.entries()));
    
    const token = getAccessToken(request);
    console.log("[PATCH /api/store] Token found:", !!token);
    
    const user = await getUserSSR(request);
    console.log("[PATCH /api/store] User found:", !!user);
    
    if (!user || typeof user !== 'object' || !('id' in user) || user.user_metadata.role !== 'ADMIN') {
      console.error("[PATCH /api/store] Unauthorized user:", user);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const formData = await request.formData();
    const data = JSON.parse(formData.get("data") as string);
    const logoFile = formData.get("logo") as File | null;

    // Buscar a loja
    const store = await db.store.findFirst();

    if (!store) {
      console.error("[PATCH /api/store] Store not found");
      return new NextResponse("Store not found", { status: 404 });
    }

    // Upload do logo se fornecido
    let logo = data.logo;
    if (logoFile) {
      const fileName = `logo-${Date.now()}-${logoFile.name}`;
      logo = await uploadImage(logoFile, "store", fileName);
    }

    // Atualizar a loja
    const updatedStore = await db.store.update({
      where: {
        id: store.id
      },
      data: {
        name: data.name,
        description: data.description,
        logo: logo,
        palette: data.palette,
        settings: data.settings && {
          email: data.settings.email,
          phone: data.settings.phone,
          address: data.settings.address,
          enableReviews: data.settings.enableReviews,
          enableWishlist: data.settings.enableWishlist,
          showOutOfStock: data.settings.showOutOfStock,
          allowBackorders: data.settings.allowBackorders,
        },
      },
    });

    console.log("[PATCH /api/store] Store updated:", updatedStore);
    return NextResponse.json(updatedStore);
  } catch (error) {
    console.error("[PATCH /api/store] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("[GET /api/store] Request cookies:", request.cookies.getAll().map(c => c.name));
    console.log("[GET /api/store] Request headers:", Object.fromEntries(request.headers.entries()));
    
    // Buscar a loja
    const store = await db.store.findFirst();

    if (!store) {
      console.error("[GET /api/store] Store not found");
      return new NextResponse("Store not found", { status: 404 });
    }

    // Adicionar headers de cache
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    headers.set('Vary', 'Authorization');

    return NextResponse.json(store, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("[GET /api/store] Error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
