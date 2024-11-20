import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { getUserSSR } from "@/services/get-user-ssr";
import { uploadImage } from "@/services/s3";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserSSR(request);
    
    if (!user || typeof user !== 'object' || !('id' in user) || user.user_metadata.role !== 'ADMIN') {
      console.error("[PATCH /api/store] Unauthorized user:", user);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let data;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      data = JSON.parse(formData.get("data") as string);
      const logoFile = formData.get("logo") as File | null;

      if (logoFile) {
        const fileName = `logo-${Date.now()}-${logoFile.name}`;
        data.logo = await uploadImage(logoFile, "store", fileName);
      }
    } else {
      data = await request.json();
    }

    // Buscar a loja
    const store = await db.store.findFirst();

    if (!store) {
      console.error("[PATCH /api/store] Store not found");
      return new NextResponse("Store not found", { status: 404 });
    }

    // Atualizar a loja
    const updatedStore = await db.store.update({
      where: {
        id: store.id
      },
      data: {
        name: data.name,
        description: data.description,
        logo: data.logo,
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
