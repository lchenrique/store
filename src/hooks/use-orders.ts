import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient from '@/services/api';
import type { Order, OrderInput } from '@/services/types';

export function useOrders() {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  const query = useQuery({
    queryKey: ['orders'],
    queryFn: () => apiClient.getOrders(),
  });

  const createOrder = useMutation({
    mutationFn: (orderData: OrderInput) => apiClient.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("Pedido criado com sucesso!");
    },
  });

  const cancelOrder = useMutation({
    mutationFn: (orderId: string) => apiClient.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success("Pedido cancelado com sucesso!");
    },
  });

  useEffect(() => {
    setIsLoading(query.isLoading);
  }, [query.isLoading]);

  return {
    orders: query.data || [],
    isLoading,
    createOrder: createOrder.mutate,
    cancelOrder: cancelOrder.mutate,
  };
}
