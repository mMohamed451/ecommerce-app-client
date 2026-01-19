// Cart and Wishlist related types

export interface CartItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    sku?: string;
    images: Array<{
      id: string;
      fileUrl: string;
      altText?: string;
      isPrimary: boolean;
    }>;
    vendorName: string;
    stockQuantity: number;
    trackInventory: boolean;
  };
  quantity: number;
  selectedVariation?: {
    id: string;
    name: string;
    price?: number;
    sku?: string;
    attributes: Array<{
      name: string;
      value: string;
    }>;
  };
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  id?: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  totalAmount: number;
  currency: string;
}

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    images: Array<{
      id: string;
      fileUrl: string;
      altText?: string;
      isPrimary: boolean;
    }>;
    vendorName: string;
    rating: number;
    reviewCount: number;
  };
  addedAt: string;
}

// Request/Response types
export interface AddToCartRequest {
  productId: string;
  quantity: number;
  variationId?: string;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface AddToWishlistRequest {
  productId: string;
}

export interface CartState {
  items: CartItem[];
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  error: string | null;
}

export interface CartActions {
  // Cart actions
  addItem: (productId: string, quantity: number, variationId?: string) => Promise<void>;
  updateItemQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  syncWithServer: () => Promise<void>;

  // Wishlist actions
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;

  // Utility actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getCartSummary: () => CartSummary;
  isInCart: (productId: string, variationId?: string) => boolean;
  isInWishlist: (productId: string) => boolean;
}