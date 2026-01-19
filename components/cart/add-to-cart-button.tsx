'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
  variationId?: string;
  quantity?: number;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  showQuantity?: boolean;
  disabled?: boolean;
}

export function AddToCartButton({
  product,
  variationId,
  quantity = 1,
  variant = 'default',
  size = 'default',
  className = '',
  showQuantity = false,
  disabled = false,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const { addItem, isInCart } = useCartStore();

  const isProductInCart = isInCart(product.id, variationId);
  const isOutOfStock = product.trackInventory && product.stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (isOutOfStock || disabled) return;

    setIsAdding(true);
    try {
      await addItem(product.id, quantity, variationId);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (isOutOfStock) {
    return (
      <Button
        variant="secondary"
        size={size}
        className={`cursor-not-allowed ${className}`}
        disabled
      >
        Out of Stock
      </Button>
    );
  }

  return (
    <Button
      variant={added ? 'secondary' : variant}
      size={size}
      className={className}
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Adding...
        </>
      ) : added ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added!
        </>
      ) : isProductInCart ? (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          In Cart
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
          {showQuantity && quantity > 1 && (
            <span className="ml-2 text-sm">({quantity})</span>
          )}
        </>
      )}
    </Button>
  );
}