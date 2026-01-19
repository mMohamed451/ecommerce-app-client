'use client';

import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { VendorRatingDisplay } from '@/components/vendor/vendor-rating-display';
import { vendorApi } from '@/lib/api/vendor';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export default function VendorRatingsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/vendor/ratings');
    }
  }, [isAuthenticated, router]);

  const { data: summary } = useQuery({
    queryKey: ['vendor-rating-summary'],
    queryFn: () => vendorApi.getReviewSummary(),
    enabled: isAuthenticated,
  });

  const { data: ratingsData, isLoading } = useQuery({
    queryKey: ['vendor-ratings', page, ratingFilter],
    queryFn: () =>
      vendorApi.getRatings({
        pageNumber: page,
        pageSize: 10,
        rating: ratingFilter,
      }),
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="mt-2 text-gray-600">
            View and manage customer reviews and ratings
          </p>
        </div>

        {/* Rating Filter */}
        {summary && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <Button
              variant={ratingFilter === undefined ? 'default' : 'outline'}
              onClick={() => setRatingFilter(undefined)}
              size="sm"
            >
              All ({summary.totalReviews})
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count =
                rating === 5
                  ? summary.ratingDistribution.five
                  : rating === 4
                  ? summary.ratingDistribution.four
                  : rating === 3
                  ? summary.ratingDistribution.three
                  : rating === 2
                  ? summary.ratingDistribution.two
                  : summary.ratingDistribution.one;
              return (
                <Button
                  key={rating}
                  variant={ratingFilter === rating ? 'default' : 'outline'}
                  onClick={() => setRatingFilter(rating)}
                  size="sm"
                >
                  {rating} Stars ({count})
                </Button>
              );
            })}
          </div>
        )}

        {/* Ratings Display */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
          </div>
        ) : summary && ratingsData ? (
          <>
            <VendorRatingDisplay
              summary={summary}
              ratings={ratingsData.items}
              showAll={true}
            />
            {/* Pagination */}
            {ratingsData.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {page} of {ratingsData.totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() =>
                    setPage((p) => Math.min(ratingsData.totalPages, p + 1))
                  }
                  disabled={page === ratingsData.totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
