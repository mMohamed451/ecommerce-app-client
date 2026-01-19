'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, X, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { AddToCartButton } from './add-to-cart-button';
import { Button } from '@/components/ui/button';

export function WishlistPage() {
  const { wishlistItems, removeFromWishlist, syncWithServer } = useCartStore();

  useEffect(() => {
    // Sync wishlist with server when component mounts
    syncWithServer();
  }, [syncWithServer]);

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Save items you're interested in for later.
          </p>
          <Button asChild>
            <Link href="/products">
              Start Shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
        </div>
        <div className="text-sm text-gray-600">
          {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
        </div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistItems.map((item) => {
          const primaryImage = item.product.images.find(img => img.isPrimary) || item.product.images[0];

          return (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Remove from Wishlist Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 rounded-full h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromWishlist(item.productId)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <Link href={`/products/${item.product.slug}`}>
                  {primaryImage ? (
                    <Image
                      src={primaryImage.fileUrl}
                      alt={primaryImage.altText || item.product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Heart className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </Link>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-medium text-gray-900 mb-1 hover:underline">
                    {item.product.name}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600 mb-2">
                  by {item.product.vendorName}
                </p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({item.product.reviewCount})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      ${item.product.price.toFixed(2)}
                    </span>
                    {item.product.compareAtPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ${item.product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Cart Button */}
                <AddToCartButton
                  product={{
                    ...item.product,
                    id: item.productId,
                    stockQuantity: 10, // Placeholder - should come from API
                    trackInventory: true,
                    variations: [],
                    attributes: [],
                    status: 'Published',
                    approvalStatus: 'Approved',
                    createdAt: item.addedAt,
                    images: item.product.images,
                  }}
                  variant="outline"
                  className="w-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          Found something you like? Add it to your cart or keep browsing.
        </p>
        <Button asChild>
          <Link href="/products">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
}