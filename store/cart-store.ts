import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CartState, CartActions, CartSummary, WishlistItem } from '@/types/cart';
import { Product } from '@/types/product';

interface CartStore extends CartState, CartActions {}

// Helper functions
const calculateCartSummary = (items: CartItem[]): CartSummary => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    itemCount,
    subtotal,
    totalAmount: subtotal, // Will be calculated with tax/shipping later
    currency: 'USD', // Default currency
  };
};

const createCartItem = (product: Product, quantity: number, variationId?: string): CartItem => {
  const selectedVariation = variationId
    ? product.variations.find(v => v.id === variationId)
    : undefined;

  const unitPrice = selectedVariation?.price ?? product.price;
  const totalPrice = unitPrice * quantity;

  return {
    id: `${product.id}-${variationId || 'default'}-${Date.now()}`, // Temporary ID for local storage
    productId: product.id,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      sku: product.sku,
      images: product.images,
      vendorName: product.vendorName,
      stockQuantity: product.stockQuantity,
      trackInventory: product.trackInventory,
    },
    quantity,
    selectedVariation: selectedVariation ? {
      id: selectedVariation.id,
      name: selectedVariation.name,
      price: selectedVariation.price,
      sku: selectedVariation.sku,
      attributes: selectedVariation.attributes,
    } : undefined,
    unitPrice,
    totalPrice,
    addedAt: new Date().toISOString(),
  };
};

const createWishlistItem = (product: Product): WishlistItem => ({
  id: `${product.id}-${Date.now()}`, // Temporary ID
  productId: product.id,
  product: {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    vendorName: product.vendorName,
    rating: product.rating,
    reviewCount: product.reviewCount,
  },
  addedAt: new Date().toISOString(),
});

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      wishlistItems: [],
      isLoading: false,
      error: null,

      // Cart actions
      addItem: async (productId: string, quantity: number, variationId?: string) => {
        try {
          set({ isLoading: true, error: null });

          // In a real app, you'd fetch the product from the API
          // For now, we'll assume the product data is passed or available
          // This would need to be updated when we have product fetching

          // For demo purposes, we'll create a placeholder
          // In real implementation, this would call an API to get product details

          // Placeholder - in real app this would come from API
          console.log('Adding item to cart:', { productId, quantity, variationId });

          // For now, we'll just log. Real implementation would:
          // 1. Fetch product details from API
          // 2. Create cart item
          // 3. Add to cart
          // 4. Sync with server if authenticated

          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add item to cart'
          });
        }
      },

      updateItemQuantity: async (cartItemId: string, quantity: number) => {
        try {
          set({ isLoading: true, error: null });

          if (quantity <= 0) {
            get().removeItem(cartItemId);
            return;
          }

          set((state) => ({
            items: state.items.map(item =>
              item.id === cartItemId
                ? {
                    ...item,
                    quantity,
                    totalPrice: item.unitPrice * quantity,
                  }
                : item
            ),
            isLoading: false,
          }));

          // TODO: Sync with server
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update item quantity'
          });
        }
      },

      removeItem: async (cartItemId: string) => {
        try {
          set({ isLoading: true, error: null });

          set((state) => ({
            items: state.items.filter(item => item.id !== cartItemId),
            isLoading: false,
          }));

          // TODO: Sync with server
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove item'
          });
        }
      },

      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });

          set({ items: [], isLoading: false });

          // TODO: Sync with server
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to clear cart'
          });
        }
      },

      syncWithServer: async () => {
        try {
          set({ isLoading: true, error: null });

          // TODO: Implement server sync
          // This would sync local cart with server cart for authenticated users

          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to sync cart'
          });
        }
      },

      // Wishlist actions
      addToWishlist: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });

          const state = get();
          if (state.isInWishlist(productId)) {
            set({ isLoading: false });
            return;
          }

          // In real app, fetch product details and add to wishlist
          console.log('Adding to wishlist:', productId);

          // TODO: Implement wishlist API call

          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to add to wishlist'
          });
        }
      },

      removeFromWishlist: async (productId: string) => {
        try {
          set({ isLoading: true, error: null });

          set((state) => ({
            wishlistItems: state.wishlistItems.filter(item => item.productId !== productId),
            isLoading: false,
          }));

          // TODO: Sync with server
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to remove from wishlist'
          });
        }
      },

      clearWishlist: async () => {
        try {
          set({ isLoading: true, error: null });

          set({ wishlistItems: [], isLoading: false });

          // TODO: Sync with server
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to clear wishlist'
          });
        }
      },

      // Utility actions
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setError: (error: string | null) => set({ error }),

      getCartSummary: () => {
        const state = get();
        return calculateCartSummary(state.items);
      },

      isInCart: (productId: string, variationId?: string) => {
        const state = get();
        return state.items.some(item =>
          item.productId === productId &&
          (!variationId || item.selectedVariation?.id === variationId)
        );
      },

      isInWishlist: (productId: string) => {
        const state = get();
        return state.wishlistItems.some(item => item.productId === productId);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        wishlistItems: state.wishlistItems,
      }),
    }
  )
);