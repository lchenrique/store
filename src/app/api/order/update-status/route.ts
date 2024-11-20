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

export async function POST(req: NextRequest) {
  try {
    console.log("[ORDER_UPDATE] Iniciando atualização do pedido");
    
    const { orderId, status, paymentId } = await req.json();
    console.log("[ORDER_UPDATE] Dados recebidos:", { orderId, status, paymentId });

    // Primeiro verifica se o pedido existe
    const existingOrder = await db.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      console.log("[ORDER_UPDATE] Pedido não encontrado:", orderId);
      return new NextResponse("Order not found", { status: 404 });
    }

    console.log("[ORDER_UPDATE] Pedido encontrado:", existingOrder);

    // Mapeia o status do Mercado Pago para nosso status
    const mappedStatus = STATUS_MAP[status.toLowerCase()] || "PENDING";
    console.log("[ORDER_UPDATE] Status mapeado:", { original: status, mapped: mappedStatus });

    // Atualiza o pedido
    const order = await db.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: mappedStatus,
      
      }
    });

    console.log("[ORDER_UPDATE] Pedido atualizado com sucesso:", order);
    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_UPDATE] Erro ao atualizar pedido:", error);
    return new NextResponse("Error updating order status", { status: 500 });
  }
}
