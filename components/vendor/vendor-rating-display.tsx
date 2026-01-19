'use client';

import { VendorRating, VendorReviewSummary } from '@/types/vendor';
import { Star, User } from 'lucide-react';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

interface VendorRatingDisplayProps {
  summary: VendorReviewSummary;
  ratings?: VendorRating[];
  showAll?: boolean;
}

export function VendorRatingDisplay({
  summary,
  ratings = [],
  showAll = false,
}: VendorRatingDisplayProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ));
  };

  const getRatingPercentage = (count: number) => {
    if (summary.totalReviews === 0) return 0;
    return Math.round((count / summary.totalReviews) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-start gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {summary.averageRating.toFixed(1)}
            </div>
            <div className="flex items-center justify-center gap-1 mt-2">
              {renderStars(Math.round(summary.averageRating))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Based on {summary.totalReviews} reviews
            </p>
          </div>
          <div className="flex-1">
            <div className="space-y-2">
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
                const percentage = getRatingPercentage(count);
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 w-8">
                      {rating}
                    </span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {ratings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            Customer Reviews
          </h3>
          {ratings.map((rating) => (
            <div
              key={rating.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {rating.userAvatar ? (
                    <img
                      src={rating.userAvatar}
                      alt={rating.userName}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">
                        {rating.userName}
                      </p>
                      {rating.isVerifiedPurchase && (
                        <span className="text-xs text-green-600 font-medium">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(rating.rating)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(rating.createdAt)}
                  </p>
                  {rating.comment && (
                    <p className="text-gray-700 mb-3">{rating.comment}</p>
                  )}
                  {rating.helpfulCount > 0 && (
                    <p className="text-xs text-gray-500">
                      {rating.helpfulCount} people found this helpful
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
