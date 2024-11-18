import { NextResponse, type NextRequest } from "next/server";
import db from "@/lib/db";
import { getUserSSR } from "@/services/get-user-ssr";
import { getAccessToken } from "@/services/get-acess-token";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    console.log("[GET /api/user/profile] Request cookies:", request.cookies.getAll().map(c => c.name));
    console.log("[GET /api/user/profile] Request headers:", Object.fromEntries(request.headers.entries()));
    
    const token = getAccessToken(request);
    console.log("[GET /api/user/profile] Token found:", !!token);
    
    const user = await getUserSSR(request);
    console.log("[GET /api/user/profile] User found:", !!user);
    
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Buscar perfil do usuário
    const profile = await db.user.findUnique({
      where: {
        id: user.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    if (!profile) {
      console.error("[GET /api/user/profile] No profile found for user:", {
        id: user.id,
        email: user.email
      });
      return new NextResponse("User profile not found", { status: 404 });
    }

    // Adicionar headers de cache
    const headers = new Headers();
    headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    headers.set('Vary', 'Authorization');

    return NextResponse.json(profile, {
      headers,
      status: 200,
    });

  } catch (error) {
    console.error("[GET /api/user/profile] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("[PUT /api/user/profile] Request cookies:", request.cookies.getAll().map(c => c.name));
    console.log("[PUT /api/user/profile] Request headers:", Object.fromEntries(request.headers.entries()));
    
    const token = getAccessToken(request);
    console.log("[PUT /api/user/profile] Token found:", !!token);
    
    const user = await getUserSSR(request);
    console.log("[PUT /api/user/profile] User found:", !!user);
    
    if (!user || typeof user !== 'object' || !('id' in user)) {
      console.error("[PUT /api/user/profile] Unauthorized user:", user);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    console.log("[PUT /api/user/profile] Request body:", body);

    // Atualizar o perfil no banco de dados
    const updatedProfile = await db.user.update({
      where: {
        id: user.id
      },
      data: {
        name: body.name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    // Atualizar os metadados do usuário no Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { user_metadata: { name: body.name } }
    );

    if (authError) {
      console.error("[PUT /api/user/profile] Error updating Supabase Auth:", authError);
      // Não vamos retornar erro para o cliente, pois o perfil já foi atualizado no banco
    }

    console.log("[PUT /api/user/profile] Updated profile:", updatedProfile);
    return NextResponse.json(updatedProfile);

  } catch (error) {
    console.error("[PUT /api/user/profile] Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
