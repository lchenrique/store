import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";

interface Order {
  id: string;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      images: string[];
    };
  }[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setOrders([]);
          setIsLoading(false);
          return;
        }

        const { data: orders, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items (
              id,
              quantity,
              price,
              product:products (
                id,
                name,
                images
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setOrders(orders || []);
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadOrders();
  }, []);

  return {
    orders,
    isLoading
  };
}
