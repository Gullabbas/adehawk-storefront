import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  productIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  totalItems: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      toggleWishlist: productId => {
        set(state => {
          const exists = state.productIds.includes(productId);
          return {
            productIds: exists
              ? state.productIds.filter(id => id !== productId)
              : [...state.productIds, productId],
          };
        });
      },
      isInWishlist: productId => {
        return get().productIds.includes(productId);
      },
      totalItems: () => {
        return get().productIds.length;
      },
    }),
    {
      name: 'adehawk_wishlist_storage',
    }
  )
);
