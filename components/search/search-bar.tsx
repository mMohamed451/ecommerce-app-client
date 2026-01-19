'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { productApi } from '@/lib/api/product';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Product } from '@/types/product';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
}

export function SearchBar({
  placeholder = 'Search for products...',
  className = '',
  onSearch,
  showSuggestions = true,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Autocomplete suggestions
  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['search-suggestions', debouncedQuery],
    queryFn: () => productApi.getProducts({
      searchTerm: debouncedQuery,
      pageSize: 5,
      sortBy: 'relevance',
    }),
    enabled: showSuggestions && debouncedQuery.length >= 2 && isFocused,
  });

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;

    const params = new URLSearchParams();
    params.set('q', searchQuery.trim());
    router.push(`/products?${params.toString()}`);
    setIsFocused(false);
    onSearch?.(searchQuery.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setIsFocused(false);
    }
  };

  const handleSuggestionClick = (product: Product) => {
    router.push(`/products/${product.slug}`);
    setIsFocused(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsFocused(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && isFocused && debouncedQuery.length >= 2 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {isLoadingSuggestions ? (
              <div className="p-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-primary-600" />
              </div>
            ) : suggestions?.products && suggestions.products.length > 0 ? (
              <div className="divide-y">
                {suggestions.products.map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => handleSuggestionClick(product)}
                    className="w-full p-3 hover:bg-gray-50 flex items-center gap-3 text-left transition-colors"
                  >
                    {product.images.length > 0 ? (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={product.images[0].fileUrl}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="w-full p-3 hover:bg-primary-50 text-primary-600 font-medium text-sm text-center"
                >
                  View all results for &quot;{debouncedQuery}&quot;
                </button>
              </div>
            ) : debouncedQuery.length >= 2 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                No products found
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
