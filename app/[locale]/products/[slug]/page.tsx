'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/product';
import { ProductPreview } from '@/components/product/product-preview';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productApi.getProductBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Product not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductPreview
        product={product}
        onAddToCart={(variationId) => {
          // TODO: Implement add to cart
          toast.info('Add to cart functionality coming soon');
        }}
        onAddToWishlist={() => {
          // TODO: Implement add to wishlist
          toast.info('Add to wishlist functionality coming soon');
        }}
      />
    </div>
  );
}
