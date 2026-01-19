'use client';

import { ProductListingForm } from '@/components/product/product-listing-form';
import { useRouter } from 'next/navigation';

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Create New Product</h1>
        <p className="text-gray-600">Add a new product to your store</p>
      </div>
      <ProductListingForm
        onSuccess={() => router.push('/vendor/products')}
      />
    </div>
  );
}
