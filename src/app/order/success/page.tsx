'use client';

import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/services/api";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    id: searchParams.get('payment_id'),
    status: searchParams.get('status'),
    external_reference: searchParams.get('external_reference')
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function updateOrder() {
      try {
        if (orderDetails.external_reference) {
          await apiClient.admin.updateOrderStatus(
            orderDetails.external_reference,
            orderDetails.status as any
          );
          console.log('Pedido atualizado com sucesso');
        }
      } catch (err: any) {
        console.error('Erro ao atualizar pedido:', err);
        setError(err?.message || 'Erro ao atualizar pedido');
      } finally {
        setLoading(false);
      }
    }

    updateOrder();
  }, [orderDetails]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p>Processando seu pedido...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-16 h-16 text-red-500" />
        <h1 className="text-2xl font-bold">Ops! Algo deu errado</h1>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/orders">
          <Button>Ver Meus Pedidos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <CheckCircle className="w-16 h-16 text-green-500" />
      <h1 className="text-2xl font-bold">Pagamento Confirmado!</h1>
      <p className="text-muted-foreground">
        Seu pedido foi processado com sucesso.
      </p>
      <div className="text-sm text-muted-foreground">
        <p>Número do Pedido: {orderDetails.external_reference}</p>
        <p>Status: {orderDetails.status}</p>
        <p>ID do Pagamento: {orderDetails.id}</p>
      </div>
      <Link href="/minha-conta">
        <Button>Ver Meus Pedidos</Button>
      </Link>
    </div>
  );
}
