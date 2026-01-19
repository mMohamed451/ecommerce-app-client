'use client';

import { Select } from '@/components/ui/select';

export type SortOption = 
  | 'relevance'
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'date-desc'
  | 'date-asc'
  | 'rating-desc';

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'rating-desc', label: 'Highest Rated' },
];

export function SortDropdown({ value, onChange, className = '' }: SortDropdownProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        options={sortOptions}
        className="min-w-[180px]"
      />
    </div>
  );
}
