'use client';

import { useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent } from '@/components/ui/card';
import { ImageGallery } from './image-gallery';
import { ProductVariationSelector } from './product-variation-selector';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

interface ProductPreviewProps {
  product: Product;
  onAddToCart?: (variationId?: string) => void;
  onAddToWishlist?: () => void;
}

export function ProductPreview({ product, onAddToCart, onAddToWishlist }: ProductPreviewProps) {
  const [selectedVariation, setSelectedVariation] = useState<Product['variations'][0] | undefined>(
    product.variations.length > 0 ? product.variations[0] : undefined
  );

  const displayPrice = selectedVariation?.price || product.price;
  const displayStock = selectedVariation?.stockQuantity || product.stockQuantity;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Images */}
      <div>
        <ImageGallery images={product.images} productName={product.name} />
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          {product.shortDescription && (
            <p className="text-gray-600 text-lg">{product.shortDescription}</p>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary-600">
            ${displayPrice.toFixed(2)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > displayPrice && (
            <>
              <span className="text-xl text-gray-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
              <span className="text-sm text-green-600 font-medium">
                {Math.round(((product.compareAtPrice - displayPrice) / product.compareAtPrice) * 100)}% OFF
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
          </div>
        )}

        {/* Variations */}
        {product.variations.length > 0 && (
          <ProductVariationSelector
            variations={product.variations}
            selectedVariation={selectedVariation}
            onSelect={setSelectedVariation}
          />
        )}

        {/* Attributes */}
        {product.attributes.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Specifications</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.attributes.map((attr) => (
                <div key={attr.id} className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">{attr.name}:</span>
                  <span className="font-medium">{attr.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div>
          {displayStock > 0 ? (
            <p className="text-green-600 font-medium">
              ✓ In Stock ({displayStock} available)
            </p>
          ) : (
            <p className="text-red-600 font-medium">✗ Out of Stock</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={() => onAddToCart?.(selectedVariation?.id)}
            disabled={displayStock <= 0}
            className="flex-1"
            size="lg"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={onAddToWishlist}
            size="lg"
          >
            <Heart className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Vendor Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              {product.vendorName && (
                <>
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {product.vendorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">Sold by {product.vendorName}</p>
                    <p className="text-sm text-gray-600">Verified Vendor</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
