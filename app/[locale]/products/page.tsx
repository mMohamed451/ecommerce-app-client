'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/lib/api/product';
import { SearchBar } from '@/components/search/search-bar';
import { FilterSidebar } from '@/components/search/filter-sidebar';
import { ProductGrid } from '@/components/search/product-grid';
import { SortDropdown, SortOption } from '@/components/search/sort-dropdown';
import { ViewToggle } from '@/components/search/view-toggle';
import { Pagination } from '@/components/search/pagination';
import { CategoryNav } from '@/components/search/category-nav';
import { RecentlyViewed } from '@/components/search/recently-viewed';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, X } from 'lucide-react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // URL parameters
  const query = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const minPriceParam = searchParams.get('minPrice');
  const maxPriceParam = searchParams.get('maxPrice');
  const sortParam = (searchParams.get('sort') as SortOption) || 'relevance';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? categoryParam.split(',') : []
  );
  const [priceRange, setPriceRange] = useState({
    min: minPriceParam ? parseFloat(minPriceParam) : 0,
    max: maxPriceParam ? parseFloat(maxPriceParam) : 10000,
  });

  // Load categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories', 'search'],
    queryFn: () => productApi.getCategories({ isActive: true, includeChildren: true }),
  });

  // Build query params
  const getQueryParams = () => {
    const params: any = {
      pageNumber: pageParam,
      pageSize: 24,
      status: 'Published',
      isActive: true,
    };

    // Handle sorting
    if (sortParam === 'relevance') {
      // Relevance is default, no sortBy needed
    } else if (sortParam.startsWith('price')) {
      params.sortBy = 'price';
      params.sortDescending = sortParam === 'price-desc';
    } else if (sortParam.startsWith('name')) {
      params.sortBy = 'name';
      params.sortDescending = sortParam === 'name-desc';
    } else if (sortParam.startsWith('date')) {
      params.sortBy = 'created';
      params.sortDescending = sortParam === 'date-desc';
    } else if (sortParam === 'rating-desc') {
      params.sortBy = 'rating';
      params.sortDescending = true;
    }

    if (query) {
      params.searchTerm = query;
    }

    if (selectedCategories.length > 0) {
      // Backend expects single categoryId for now
      params.categoryId = selectedCategories[0];
    }

    // Note: Price filtering will need to be implemented on backend
    // For now, we'll filter client-side as a fallback
    // if (priceRange.min > 0 || priceRange.max < 10000) {
    //   params.minPrice = priceRange.min;
    //   params.maxPrice = priceRange.max;
    // }

    return params;
  };

  // Load products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', 'search', query, selectedCategories, priceRange, sortParam, pageParam],
    queryFn: () => productApi.getProducts(getQueryParams()),
  });

  // Update URL when filters change
  const updateURL = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change
    if (updates.page === undefined) {
      params.set('page', '1');
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryChange = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
    updateURL({
      category: categoryIds.length > 0 ? categoryIds.join(',') : null,
    });
  };

  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    setPriceRange(range);
    updateURL({
      minPrice: range.min > 0 ? range.min.toString() : null,
      maxPrice: range.max < 10000 ? range.max.toString() : null,
    });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setPriceRange({ min: 0, max: 10000 });
    updateURL({
      category: null,
      minPrice: null,
      maxPrice: null,
    });
  };

  const handleSortChange = (sort: SortOption) => {
    updateURL({ sort });
  };

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (searchQuery: string) => {
    updateURL({ q: searchQuery || null });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          placeholder="Search for products..."
          onSearch={handleSearch}
          className="max-w-2xl mx-auto"
        />
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
        <div className="flex items-center gap-2">
          <SortDropdown value={sortParam} onChange={handleSortChange} />
          <ViewToggle viewMode={viewMode} onChange={setViewMode} />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
          <CategoryNav categories={categories} />
          <FilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={handlePriceRangeChange}
            onClearFilters={handleClearFilters}
            isOpen={true}
          />
          <RecentlyViewed />
        </aside>

        {/* Mobile Filter Sidebar */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsFilterOpen(false)}>
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  categories={categories}
                  selectedCategories={selectedCategories}
                  onCategoryChange={handleCategoryChange}
                  priceRange={priceRange}
                  onPriceRangeChange={handlePriceRangeChange}
                  onClearFilters={handleClearFilters}
                  isOpen={true}
                  onClose={() => setIsFilterOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Toolbar */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <div>
              {productsData && (
                <p className="text-sm text-gray-600">
                  {productsData.totalCount} {productsData.totalCount === 1 ? 'product' : 'products'} found
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <SortDropdown value={sortParam} onChange={handleSortChange} />
              <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Products Grid/List */}
          <ProductGrid
            products={
              // Client-side price filtering (until backend supports it)
              productsData?.products.filter((product) => {
                if (priceRange.min > 0 && product.price < priceRange.min) return false;
                if (priceRange.max < 10000 && product.price > priceRange.max) return false;
                return true;
              }) || []
            }
            viewMode={viewMode}
            isLoading={isLoading}
          />

          {/* Pagination */}
          {productsData && productsData.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={pageParam}
                totalPages={productsData.totalPages}
                totalItems={productsData.totalCount}
                itemsPerPage={24}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
