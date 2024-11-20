import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { OrderStatus } from "@prisma/client";

// Mapeamento de status do Mercado Pago para nossos status
const STATUS_MAP: Record<string, OrderStatus> = {
  approved: "PAID",
  pending: "PENDING",
  in_process: "PENDING",
  rejected: "CANCELLED",
  cancelled: "CANCELLED",
  refunded: "CANCELLED",
  charged_back: "CANCELLED"
} as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    console.log("[ORDER_UPDATE] Iniciando atualização do pedido", params.orderId);
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: "Status não fornecido" },
        { status: 400 }
      );
    }

    const mappedStatus = STATUS_MAP[status];
    if (!mappedStatus) {
      return NextResponse.json(
        { error: "Status inválido" },
        { status: 400 }
      );
    }

    const order = await db.order.update({
      where: {
        id: params.orderId,
      },
      data: {
        status: mappedStatus
      }
    });

    console.log("[ORDER_UPDATE] Pedido atualizado com sucesso:", order);
    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_UPDATE] Erro ao atualizar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar pedido" },
      { status: 500 }
    );
  }
}
