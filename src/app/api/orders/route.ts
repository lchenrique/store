import { NextRequest, NextResponse } from "next/server";
import { getUserSSR } from "@/services/get-user-ssr";
import db from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserSSR(req);
    console.log("[GET /api/orders] User:", user ? "Found" : "Not found");
    
    if (!user || typeof user !== 'object' || !('id' in user)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Busca os pedidos do usuário com os produtos
    const orders = await db.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Converte para snake_case e garante formato ISO das datas
    const formattedOrders = orders.map(order => ({
      id: order.id,
      user_id: order.userId,
      store_id: order.storeId,
      status: order.status,
      total: order.total,
      created_at: order.createdAt.toISOString(),
      updated_at: order.updatedAt.toISOString(),
      items: order.items.map(item => ({
        id: item.id,
        order_id: item.orderId,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
        created_at: item.createdAt.toISOString(),
        updated_at: item.updatedAt.toISOString(),
        product: {
          id: item.product.id,
          name: item.product.name,
          description: item.product.description,
          price: item.product.price,
          images: item.product.images,
          stock: item.product.stock
        }
      }))
    }));

    console.log("Found orders:", formattedOrders.length);

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error in GET /api/orders:', error);
    if (error instanceof Error) {
      return new NextResponse(`Internal error: ${error.message}`, { status: 500 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}