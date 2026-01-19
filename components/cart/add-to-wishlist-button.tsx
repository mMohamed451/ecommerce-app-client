'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/product';

interface AddToWishlistButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function AddToWishlistButton({
  product,
  variant = 'ghost',
  size = 'default',
  className = '',
  disabled = false,
}: AddToWishlistButtonProps) {
  const [isAdding, setIsAdding] = useState(false);

  const { addToWishlist, removeFromWishlist, isInWishlist } = useCartStore();

  const isInWishlistStatus = isInWishlist(product.id);

  const handleToggleWishlist = async () => {
    if (disabled) return;

    setIsAdding(true);
    try {
      if (isInWishlistStatus) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`${isInWishlistStatus ? 'text-red-500 hover:text-red-600' : ''} ${className}`}
      onClick={handleToggleWishlist}
      disabled={disabled || isAdding}
    >
      <Heart
        className={`h-4 w-4 ${
          isInWishlistStatus ? 'fill-current' : ''
        } ${isAdding ? 'animate-pulse' : ''}`}
      />
      <span className="sr-only">
        {isInWishlistStatus ? 'Remove from wishlist' : 'Add to wishlist'}
      </span>
    </Button>
  );
}