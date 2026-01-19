'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CartDropdownProps {
  className?: string;
}

export function CartDropdown({ className }: CartDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    items,
    getCartSummary,
    updateItemQuantity,
    removeItem,
    isLoading,
  } = useCartStore();

  const summary = getCartSummary();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateItemQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Cart Button */}
      <Button
        variant="ghost"
        size="sm"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <ShoppingCart className="h-5 w-5" />
        {summary.itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {summary.itemCount}
          </span>
        )}
      </Button>

      {/* Cart Dropdown */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <Card className="absolute right-0 top-full mt-2 w-96 max-h-96 overflow-hidden z-50 shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Shopping Cart</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {items.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Button onClick={() => setIsOpen(false)}>
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        {/* Product Image */}
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0].fileUrl}
                              alt={item.product.images[0].altText || item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <ShoppingCart className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-medium hover:underline"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-xs text-gray-500">
                            ${item.unitPrice.toFixed(2)}
                          </p>
                          {item.selectedVariation && (
                            <p className="text-xs text-gray-500">
                              {item.selectedVariation.name}
                            </p>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={isLoading}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isLoading}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Remove Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Cart Summary */}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-bold">${summary.subtotal.toFixed(2)}</span>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                        asChild
                      >
                        <Link href="/cart">View Cart</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setIsOpen(false)}
                        asChild
                      >
                        <Link href="/checkout">Checkout</Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}