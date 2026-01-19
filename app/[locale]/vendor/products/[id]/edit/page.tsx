'use client';

import { ProductListingForm } from '@/components/product/product-listing-form';
import { useRouter, useParams } from 'next/navigation';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Edit Product</h1>
        <p className="text-gray-600">Update your product information</p>
      </div>
      <ProductListingForm
        productId={productId}
        onSuccess={() => router.push('/vendor/products')}
      />
    </div>
  );
}
