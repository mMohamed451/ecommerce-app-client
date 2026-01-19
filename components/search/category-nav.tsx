'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Category } from '@/types/product';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryNavProps {
  categories: Category[];
  className?: string;
}

export function CategoryNav({ categories, className = '' }: CategoryNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const renderCategory = (category: Category, level = 0) => {
    const isActive = searchParams.get('category') === category.id;
    const hasChildren = category.children && category.children.length > 0;

    return (
      <div key={category.id}>
        <Link
          href={`/products?category=${category.id}`}
          className={cn(
            'flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
            'hover:bg-gray-100',
            isActive && 'bg-primary-50 text-primary-700 font-medium',
            !isActive && 'text-gray-700'
          )}
        >
          <span className="text-sm">{category.name}</span>
          {hasChildren && (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
        </Link>
        {hasChildren && (
          <div className="ml-4 mt-1 space-y-1">
            {category.children!.map((child) => renderCategory(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn('space-y-1', className)}>
      <Link
        href="/products"
        className={cn(
          'flex items-center px-3 py-2 rounded-lg transition-colors',
          'hover:bg-gray-100',
          !searchParams.get('category') && 'bg-primary-50 text-primary-700 font-medium',
          searchParams.get('category') && 'text-gray-700'
        )}
      >
        <span className="text-sm font-medium">All Categories</span>
      </Link>
      {categories.map((category) => renderCategory(category))}
    </nav>
  );
}
