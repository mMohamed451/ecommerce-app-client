'use client';

import { useState } from 'react';
import { ProductVariation } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Check } from 'lucide-react';

interface ProductVariationSelectorProps {
  variations: ProductVariation[];
  selectedVariation?: ProductVariation;
  onSelect: (variation: ProductVariation) => void;
}

export function ProductVariationSelector({
  variations,
  selectedVariation,
  onSelect,
}: ProductVariationSelectorProps) {
  if (variations.length === 0) {
    return null;
  }

  // Group variations by attributes
  const groupedByAttributes = variations.reduce((acc, variation) => {
    const key = variation.attributes
      .map((attr) => `${attr.name}:${attr.value}`)
      .sort()
      .join('|');
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(variation);
    return acc;
  }, {} as Record<string, ProductVariation[]>);

  const attributeGroups = Object.keys(groupedByAttributes).map((key) => {
    const attrs = key.split('|').map((attr) => {
      const [name, value] = attr.split(':');
      return { name, value };
    });
    return {
      attributes: attrs,
      variations: groupedByAttributes[key],
    };
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Select Options</h3>
        <p className="text-sm text-gray-600">Choose your preferred variation</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {attributeGroups.map((group, groupIndex) => {
          const variation = group.variations[0];
          const isSelected = selectedVariation?.id === variation.id;
          const isOutOfStock = variation.stockQuantity <= 0 && !variation.isActive;

          return (
            <Card
              key={groupIndex}
              className={`cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 ring-primary-600 border-primary-600 shadow-md'
                  : 'hover:shadow-md border-gray-200'
              } ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={() => !isOutOfStock && onSelect(variation)}
            >
              <div className="p-4">
                {variation.imageUrl && (
                  <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={variation.imageUrl}
                      alt={variation.name}
                      fill
                      className="object-cover"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary-600 text-white rounded-full p-1.5 shadow-lg">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">Out of Stock</span>
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">{variation.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.attributes.map((attr, idx) => (
                      <span
                        key={idx}
                        className={`text-xs px-2 py-1 rounded ${
                          isSelected
                            ? 'bg-primary-100 text-primary-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">{attr.name}:</span> {attr.value}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <span className="font-semibold text-primary-600 text-lg">
                      {variation.price
                        ? `$${variation.price.toFixed(2)}`
                        : 'Price varies'}
                    </span>
                    {!isOutOfStock && (
                      <span className="text-xs text-gray-600 bg-green-50 px-2 py-1 rounded">
                        {variation.stockQuantity} in stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
