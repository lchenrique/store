import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { getAccessToken } from "@/services/get-acess-token";
import { createClient, type User } from "@supabase/supabase-js";
import { env } from "@/env";
import { getUserSSR } from "@/services/get-user-ssr";


export async function GET(request: NextRequest) {
  try {
    const user = await getUserSSR(request);
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }



      if (!user?.id) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const addresses = await db.address.findMany({
        where: {
          userId: user.id
        }
      });

      return NextResponse.json(addresses);

  } catch (error) {
    console.error('Error in GET /api/addresses:', error);
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }

}

export async function POST(req: NextRequest) {
  try {
    const user = await getUserSSR(req);
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { street, number, complement, neighborhood, city, state, zipCode } = body;

    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const address = await db.address.create({
      data: {
        userId: user.id,
        street,
        number,
        complement,
        neighborhood,
        city,
        state: state.toUpperCase(),
        zipCode
      }
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error('Error in POST /api/addresses:', error);
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUserSSR(req);
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

      const { searchParams } = new URL(req.url);
      const addressId = searchParams.get("id");

      if (!addressId) {
        return new NextResponse("Address ID is required", { status: 400 });
      }

      // Verifica se o endereço pertence ao usuário
      const address = await db.address.findUnique({
        where: {
          id: addressId,
          userId: user.id
        }
      });

      if (!address) {
        return new NextResponse("Address not found", { status: 404 });
      }

      await db.address.delete({
        where: {
          id: addressId
        }
      });

      return new NextResponse(null, { status: 204 });
    
  } catch (error) {
    console.error('Error in DELETE /api/addresses:', error);
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}
