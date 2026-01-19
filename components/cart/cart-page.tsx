'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { CartItemComponent } from './cart-item';
import { CartSummary } from './cart-summary';
import { Button } from '@/components/ui/button';

export function CartPage() {
  const {
    items,
    getCartSummary,
    updateItemQuantity,
    removeItem,
    isLoading,
    syncWithServer,
  } = useCartStore();

  const summary = getCartSummary();

  useEffect(() => {
    // Sync cart with server when component mounts
    syncWithServer();
  }, [syncWithServer]);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
    } else {
      await updateItemQuantity(itemId, quantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-400 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Button asChild>
            <Link href="/products">
              Continue Shopping
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
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
        <div className="text-sm text-gray-600">
          {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemComponent
                key={item.id}
                item={item}
                onQuantityChange={handleQuantityChange}
                onRemove={removeItem}
                isLoading={isLoading}
              />
            ))}
          </div>

          {/* Cart Actions */}
          <div className="mt-8 flex justify-between items-center">
            <Button variant="outline" asChild>
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>

            <div className="text-sm text-gray-600">
              Prices and availability are subject to change
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <CartSummary summary={summary} />

            <Button
              className="w-full mt-6"
              size="lg"
              asChild
            >
              <Link href="/checkout">
                Proceed to Checkout
              </Link>
            </Button>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                By proceeding to checkout, you agree to our{' '}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}