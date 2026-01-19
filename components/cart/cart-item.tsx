'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '@/types/cart';
import { Button } from '@/components/ui/button';

interface CartItemComponentProps {
  item: CartItem;
  onQuantityChange: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isLoading?: boolean;
}

export function CartItemComponent({
  item,
  onQuantityChange,
  onRemove,
  isLoading = false,
}: CartItemComponentProps) {
  const primaryImage = item.product.images.find(img => img.isPrimary) || item.product.images[0];

  return (
    <div className="flex items-center space-x-4 p-4 border rounded-lg">
      {/* Product Image */}
      <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
        {primaryImage ? (
          <Image
            src={primaryImage.fileUrl}
            alt={primaryImage.altText || item.product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.product.slug}`}
          className="text-lg font-medium hover:underline block"
        >
          {item.product.name}
        </Link>

        <p className="text-sm text-gray-600 mb-1">
          Vendor: {item.product.vendorName}
        </p>

        {item.product.sku && (
          <p className="text-sm text-gray-500">
            SKU: {item.product.sku}
          </p>
        )}

        {item.selectedVariation && (
          <div className="mt-2">
            <p className="text-sm font-medium">Selected Options:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {item.selectedVariation.attributes.map((attr, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                >
                  {attr.name}: {attr.value}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing */}
      <div className="text-right">
        <div className="text-lg font-bold">
          ${item.totalPrice.toFixed(2)}
        </div>
        {item.quantity > 1 && (
          <div className="text-sm text-gray-500">
            ${item.unitPrice.toFixed(2)} each
          </div>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-r-none"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={isLoading || item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <span className="px-3 py-1 text-center min-w-[3rem] border-x">
            {item.quantity}
          </span>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-l-none"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            disabled={isLoading || item.quantity >= item.product.stockQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => onRemove(item.id)}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}