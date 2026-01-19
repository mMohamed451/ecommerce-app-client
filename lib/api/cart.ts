import { axiosInstance } from '@/lib/axios';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  WishlistItem,
  AddToWishlistRequest,
} from '@/types/cart';

// Cart API functions
export const cartApi = {
  // Get user's cart
  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (data: AddToCartRequest): Promise<CartItem> => {
    const response = await axiosInstance.post('/cart/items', data);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId: string, data: UpdateCartItemRequest): Promise<CartItem> => {
    const response = await axiosInstance.put(`/cart/items/${cartItemId}`, data);
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (cartItemId: string): Promise<void> => {
    await axiosInstance.delete(`/cart/items/${cartItemId}`);
  },

  // Clear cart
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete('/cart');
  },

  // Merge guest cart with user cart (when logging in)
  mergeCart: async (): Promise<Cart> => {
    const response = await axiosInstance.post('/cart/merge');
    return response.data;
  },
};

// Wishlist API functions
export const wishlistApi = {
  // Get user's wishlist
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await axiosInstance.get('/wishlist');
    return response.data;
  },

  // Add item to wishlist
  addToWishlist: async (data: AddToWishlistRequest): Promise<WishlistItem> => {
    const response = await axiosInstance.post('/wishlist', data);
    return response.data;
  },

  // Remove item from wishlist
  removeFromWishlist: async (productId: string): Promise<void> => {
    await axiosInstance.delete(`/wishlist/${productId}`);
  },

  // Clear wishlist
  clearWishlist: async (): Promise<void> => {
    await axiosInstance.delete('/wishlist');
  },
};