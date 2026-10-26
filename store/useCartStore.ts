import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '@/lib/commerce/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { id?: string; quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set(state => ({ isOpen: !state.isOpen })),

      addItem: newItem => {
        set(state => {
          const qty = newItem.quantity || 1;
          const existing = state.items.find(
            item =>
              item.productId === newItem.productId &&
              item.colorName === newItem.colorName
          );

          if (existing) {
            return {
              items: state.items.map(item =>
                item.id === existing.id
                  ? { ...item, quantity: item.quantity + qty }
                  : item
              ),
              isOpen: true,
            };
          }

          const id = `${newItem.productId}-${newItem.colorName || 'default'}-${Date.now()}`;
          return {
            items: [...state.items, { ...newItem, id, quantity: qty }],
            isOpen: true,
          };
        });
      },

      removeItem: id => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set(state => {
          if (quantity <= 0) {
            return { items: state.items.filter(item => item.id !== id) };
          }
          return {
            items: state.items.map(item =>
              item.id === id ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      subtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'adehawk_cart_storage',
      partialize: state => ({ items: state.items }),
    }
  )
);
