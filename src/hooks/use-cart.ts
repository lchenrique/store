"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  quantity: number;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  syncWithDatabase: () => Promise<void>;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            const newItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            );
            // Se usuário estiver logado, sincroniza com o banco
            syncCartWithServer(newItems);
            return { items: newItems };
          }
          const newItems = [...state.items, item];
          // Se usuário estiver logado, sincroniza com o banco
          syncCartWithServer(newItems);
          return { items: newItems };
        }),
      removeItem: (id) =>
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== id);
          // Se usuário estiver logado, sincroniza com o banco
          syncCartWithServer(newItems);
          return { items: newItems };
        }),
      clearCart: () => {
        set({ items: [] });
        // Se usuário estiver logado, limpa o carrinho no banco
        syncCartWithServer([]);
      },
      updateQuantity: (id, quantity) =>
        set((state) => {
          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );
          // Se usuário estiver logado, sincroniza com o banco
          syncCartWithServer(newItems);
          return { items: newItems };
        }),
      syncWithDatabase: async () => {
        try {
          const response = await fetch('/api/cart');
          if (!response.ok) throw new Error();
          const dbCart = await response.json();
          
          // Mescla itens do localStorage com o banco
          set((state) => {
            const mergedItems = mergeCartItems(state.items, dbCart.items);
            return { items: mergedItems };
          });
        } catch (error) {
          console.error('Failed to sync with database:', error);
        }
      },
    }),
    {
      name: 'shopping-cart',
    }
  )
);

// Função auxiliar para sincronizar com o servidor
async function syncCartWithServer(items: CartItem[]) {
  try {
    const response = await fetch('/api/cart', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!response.ok) throw new Error();
  } catch (error) {
    console.error('Failed to sync cart with server:', error);
  }
}

// Função para mesclar carrinhos
function mergeCartItems(localItems: CartItem[], dbItems: CartItem[]): CartItem[] {
  const mergedItems = new Map<string, CartItem>();
  
  // Adiciona itens do localStorage
  localItems.forEach(item => {
    mergedItems.set(item.id, item);
  });
  
  // Mescla com itens do banco
  dbItems.forEach(item => {
    const existingItem = mergedItems.get(item.id);
    if (existingItem) {
      mergedItems.set(item.id, {
        ...item,
        quantity: existingItem.quantity + item.quantity,
      });
    } else {
      mergedItems.set(item.id, item);
    }
  });
  
  return Array.from(mergedItems.values());
}
