'use client';

import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/product';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductGrid } from './product-grid';
import { Loader2 } from 'lucide-react';

interface RecommendedProductsProps {
  productId?: string;
  categoryId?: string;
  limit?: number;
  title?: string;
}

export function RecommendedProducts({
  productId,
  categoryId,
  limit = 8,
  title = 'Recommended for You',
}: RecommendedProductsProps) {
  const { data: products, isLoading } = useQuery({
    queryKey: ['recommended-products', productId, categoryId, limit],
    queryFn: () =>
      productApi.getProducts({
        categoryId,
        pageSize: limit,
        isActive: true,
        status: 'Published',
        sortBy: 'rating',
        sortDescending: true,
      }),
    enabled: !!categoryId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!products || products.products.length === 0) {
    return null;
  }

  // Filter out the current product if productId is provided
  const filteredProducts = productId
    ? products.products.filter((p) => p.id !== productId)
    : products.products;

  if (filteredProducts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <ProductGrid products={filteredProducts.slice(0, limit)} viewMode="grid" />
    </div>
  );
}
