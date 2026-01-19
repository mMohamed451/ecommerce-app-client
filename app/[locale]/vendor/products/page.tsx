'use client';

import { useAuth } from '@/hooks/use-auth';
import { ProductList } from '@/components/product/product-list';
import { BulkUpload } from '@/components/product/bulk-upload';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { vendorApi } from '@/lib/api/vendor';

export default function VendorProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  const { data: vendor } = useQuery({
    queryKey: ['vendor-profile'],
    queryFn: () => vendorApi.getProfile(),
    enabled: isAuthenticated,
  });

  if (!user || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Products</h1>
          <p className="text-gray-600">Manage your product listings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowBulkUpload(!showBulkUpload)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => router.push('/vendor/products/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {showBulkUpload && (
        <div className="mb-6">
          <BulkUpload />
        </div>
      )}

      <ProductList vendorId={vendor?.id} />
    </div>
  );
}
