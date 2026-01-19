'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { ImageIcon, X } from 'lucide-react';
import { productApi } from '@/lib/api/product';
import { useQuery } from '@tanstack/react-query';

const RECENTLY_VIEWED_KEY = 'recently_viewed_products';
const MAX_RECENT_ITEMS = 10;

export function RecentlyViewed() {
  const [recentProductIds, setRecentProductIds] = useState<string[]>([]);

  useEffect(() => {
    // Load recently viewed from localStorage
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        setRecentProductIds(ids.slice(0, MAX_RECENT_ITEMS));
      } catch (e) {
        console.error('Failed to parse recently viewed products', e);
      }
    }
  }, []);

  // Fetch product details for recently viewed IDs
  const { data: products = [] } = useQuery({
    queryKey: ['recently-viewed-products', recentProductIds],
    queryFn: async () => {
      if (recentProductIds.length === 0) return [];
      
      // Fetch products in parallel
      const productPromises = recentProductIds.map((id) =>
        productApi.getProduct(id).catch(() => null)
      );
      const results = await Promise.all(productPromises);
      return results.filter((p): p is Product => p !== null);
    },
    enabled: recentProductIds.length > 0,
  });

  const removeFromRecent = (productId: string) => {
    const updated = recentProductIds.filter((id) => id !== productId);
    setRecentProductIds(updated);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recently Viewed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="flex items-center gap-3 group">
              <Link
                href={`/products/${product.slug}`}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {product.images.length > 0 ? (
                    <Image
                      src={product.images[0].fileUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                  </p>
                  <p className="text-sm font-semibold text-primary-600">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
              <button
                type="button"
                onClick={() => removeFromRecent(product.id)}
                className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove from recently viewed"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to add product to recently viewed
export function addToRecentlyViewed(productId: string) {
  const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
  let recentIds: string[] = [];
  
  if (stored) {
    try {
      recentIds = JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse recently viewed products', e);
    }
  }

  // Remove if already exists, then add to front
  recentIds = recentIds.filter((id) => id !== productId);
  recentIds.unshift(productId);
  
  // Keep only the most recent items
  recentIds = recentIds.slice(0, MAX_RECENT_ITEMS);
  
  localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentIds));
}
