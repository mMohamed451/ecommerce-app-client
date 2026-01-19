'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X, SlidersHorizontal } from 'lucide-react';
import { Category } from '@/types/product';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryChange: (categoryIds: string[]) => void;
  priceRange: { min: number; max: number };
  onPriceRangeChange: (range: { min: number; max: number }) => void;
  onClearFilters: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function FilterSidebar({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  isOpen = true,
  onClose,
}: FilterSidebarProps) {
  const [localPriceRange, setLocalPriceRange] = useState(priceRange);

  const handleCategoryToggle = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((id) => id !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handlePriceRangeApply = () => {
    onPriceRangeChange(localPriceRange);
  };

  const flattenCategories = (cats: Category[], level = 0): { category: Category; level: number }[] => {
    const result: { category: Category; level: number }[] = [];
    cats.forEach((cat) => {
      result.push({ category: cat, level });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, level + 1));
      }
    });
    return result;
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceRange.min > 0 || 
    priceRange.max < 10000;

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5" />
          Filters
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="w-full"
        >
          Clear All Filters
        </Button>
      )}

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-96 overflow-y-auto">
          {flattenCategories(categories).map(({ category, level }) => (
            <div
              key={category.id}
              className="flex items-center gap-2"
              style={{ paddingLeft: `${level * 1}rem` }}
            >
              <Checkbox
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
                label={category.name}
              />
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price ($)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={localPriceRange.min || ''}
                onChange={(e) =>
                  setLocalPriceRange({
                    ...localPriceRange,
                    min: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price ($)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={localPriceRange.max || ''}
                onChange={(e) =>
                  setLocalPriceRange({
                    ...localPriceRange,
                    max: parseFloat(e.target.value) || 10000,
                  })
                }
                placeholder="10000"
              />
            </div>
          </div>
          <Button onClick={handlePriceRangeApply} className="w-full" size="sm">
            Apply Price Range
          </Button>
        </CardContent>
      </Card>

      {/* Stock Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="In Stock Only"
          />
          <Checkbox
            checked={false}
            onChange={() => {}}
            label="On Sale"
          />
        </CardContent>
      </Card>
    </div>
  );

  if (!isOpen && onClose) {
    return null;
  }

  return (
    <aside className={`${isOpen ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
      <div className="sticky top-4">
        {content}
      </div>
    </aside>
  );
}
