import { NextResponse } from "next/server";
import mercadopago from "mercadopago";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-signature");

    // Verificar se é uma notificação válida do Mercado Pago
    if (!signature) {
      return new NextResponse("No signature", { status: 400 });
    }

    const data = await req.json();
    
    if (data.type === "payment") {
      const paymentId = data.data.id;
      const payment = await mercadopago.payment.findById(paymentId);
      
      if (!payment) {
        return new NextResponse("Payment not found", { status: 404 });
      }

      const orderId = payment.body.external_reference;
      
      // Atualizar o status do pedido
      let orderStatus;
      switch (payment.body.status) {
        case "approved":
          orderStatus = "PAID";
          break;
        case "pending":
          orderStatus = "PENDING";
          break;
        default:
          orderStatus = "PENDING";
      }

      await db.order.update({
        where: { id: orderId },
        data: { status: orderStatus }
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
