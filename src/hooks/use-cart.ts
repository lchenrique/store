import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from '@/services/api';
import { Product } from "@/services/types";

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
  name: string;
  images: string[];
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  syncWithDatabase: () => Promise<void>;
}

// Função auxiliar para mesclar carrinhos
function mergeCartItems(localItems: CartItem[], dbItems: { id: string; product: Product; quantity: number }[]) {
  const mergedItems = [...localItems];
  
  dbItems.forEach((dbItem) => {
    const existingItemIndex = mergedItems.findIndex(item => item.id === dbItem.product.id);
    
    if (existingItemIndex === -1) {
      mergedItems.push({
        id: dbItem.product.id,
        quantity: dbItem.quantity,
        price: dbItem.product.price,
        name: dbItem.product.name,
        images: dbItem.product.images,
      });
    }
  });
  
  return mergedItems;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          let newItems;

          if (existingItem) {
            newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
          } else {
            newItems = [...state.items, item];
          }

          // syncCartWithServer(newItems);
          return { items: newItems };
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          // syncCartWithServer(newItems);
          return { items: newItems };
        }),
      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          // syncCartWithServer(newItems);
          return { items: newItems };
        }),
      clearCart: () => set({ items: [] }),
      syncWithDatabase: async () => {
        try {
          const { items: dbItems } = await apiClient.getCart();
          
          // Mescla itens do localStorage com o banco
          set((state) => {
            const mergedItems = mergeCartItems(state.items, dbItems);
            return { items: mergedItems };
          });
        } catch (error) {
          console.error('Failed to sync with database:', error);
        }
      },
    }),
    {
      name: "cart-storage",
    }
  )
);

// Função auxiliar para sincronizar com o servidor
// async function syncCartWithServer(items: CartItem[]) {
//   try {
//     await apiClient.updateCart(items as any);
//   } catch (error) {
//     console.error('Failed to sync cart with server:', error);
//   }
// }
