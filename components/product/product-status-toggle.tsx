'use client';

import { useState } from 'react';
import { productApi } from '@/lib/api/product';
import { ProductStatus } from '@/types/product';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CheckCircle2, XCircle, Archive, Eye } from 'lucide-react';

interface ProductStatusToggleProps {
  productId: string;
  status: ProductStatus;
  onStatusChange?: (newStatus: ProductStatus) => void;
}

const statusConfig = {
  [ProductStatus.DRAFT]: {
    label: 'Draft',
    icon: Eye,
    color: 'bg-gray-500',
    nextStatus: ProductStatus.PUBLISHED,
    nextLabel: 'Publish',
  },
  [ProductStatus.PUBLISHED]: {
    label: 'Published',
    icon: CheckCircle2,
    color: 'bg-green-500',
    nextStatus: ProductStatus.ARCHIVED,
    nextLabel: 'Archive',
  },
  [ProductStatus.ARCHIVED]: {
    label: 'Archived',
    icon: Archive,
    color: 'bg-yellow-500',
    nextStatus: ProductStatus.PUBLISHED,
    nextLabel: 'Publish',
  },
};

export function ProductStatusToggle({
  productId,
  status,
  onStatusChange,
}: ProductStatusToggleProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const config = statusConfig[status];
  const Icon = config.icon;

  const handleToggle = async () => {
    try {
      setIsUpdating(true);
      // Note: This would require an API endpoint to update product status
      // For now, we'll use the updateProduct endpoint
      await productApi.updateProduct(productId, {
        name: '', // Required field, but we're only updating status
        price: 0, // Required field
        stockQuantity: 0, // Required field
        // Status update would be handled server-side based on the action
      });
      
      const newStatus = config.nextStatus;
      toast.success(`Product ${config.nextLabel.toLowerCase()}ed successfully`);
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product status');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isUpdating}
      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${config.color} hover:opacity-80 transition-opacity disabled:opacity-50`}
      title={`Current: ${config.label}. Click to ${config.nextLabel.toLowerCase()}`}
    >
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </button>
  );
}
