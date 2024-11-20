"use client";

import { Card, CardContent } from "@/components/ui/card";
import { OrdersSkeleton } from "./skeletons/orders-skeleton";
import { useOrders } from "@/hooks/use-orders";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const orderStatus: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Pendente", color: "text-yellow-600" },
  PAID: { label: "Pago", color: "text-green-600" },
  SHIPPED: { label: "Enviado", color: "text-blue-600" },
  DELIVERED: { label: "Entregue", color: "text-green-600" },
  CANCELLED: { label: "Cancelado", color: "text-red-600" },
};

export function OrdersCard() {
  const { orders, isLoading } = useOrders();

  if (isLoading) {
    return <OrdersSkeleton />;
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Pedidos Recentes</h2>
        {orders.length === 0 ? (
          <div className="text-gray-500">
            Nenhum pedido realizado ainda.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Pedido realizado em {format(new Date(order.created_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </p>
                    <p className={`text-sm font-medium ${orderStatus[order.status].color}`}>
                      {orderStatus[order.status].label}
                    </p>
                  </div>
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">Sem imagem</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantidade: {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
