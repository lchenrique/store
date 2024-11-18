import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function DELETE(
  request: Request,
  { params }: { params: { customerId: string } }
) {
  try {
    const { customerId } = params;

    // Verifica se o cliente existe
    const customer = await db.user.findUnique({
      where: { id: customerId, role: "CUSTOMER" },
    });

    if (!customer) {
      return new NextResponse("Cliente não encontrado", { status: 404 });
    }

    // Deleta o cliente
    await db.user.delete({
      where: { id: customerId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CUSTOMER_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
