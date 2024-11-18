import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const store = await db.store.findFirst();

  // Redireciona para a página da loja caso a loja exista
  return NextResponse.json({
    hasStore: !!store,
  });
}
