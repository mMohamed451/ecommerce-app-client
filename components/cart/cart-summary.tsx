'use client';

import { CartSummary as CartSummaryType } from '@/types/cart';

interface CartSummaryProps {
  summary: CartSummaryType;
  className?: string;
}

export function CartSummary({ summary, className = '' }: CartSummaryProps) {
  return (
    <div className={`bg-gray-50 p-6 rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex justify-between">
          <span>Items ({summary.itemCount}):</span>
          <span>${summary.subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping:</span>
          <span className="text-green-600">Free</span>
        </div>

        <div className="flex justify-between">
          <span>Tax:</span>
          <span>$0.00</span>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>${summary.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>✓ Free shipping on orders over $50</p>
        <p>✓ 30-day return policy</p>
        <p>✓ Secure checkout</p>
      </div>
    </div>
  );
}