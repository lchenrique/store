import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const store = await db.store.findFirst();
    return NextResponse.json(store?.palette || null);
  } catch (error) {
    console.error("[GET /api/store/palette]", error);
    return NextResponse.json(null);
  }
}
