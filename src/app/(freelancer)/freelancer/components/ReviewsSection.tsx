import React from 'react';
import { Star } from 'lucide-react';
import { IFreelancerReviewStats } from '@/types/interfaces/IFreelancerDashboard';

interface ReviewsSectionProps {
  reviewStats: IFreelancerReviewStats;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviewStats }) => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-800">Ratings & Reviews</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-gray-800">
                  {reviewStats.average.toFixed(1)}
                </span>
                <div className="flex">{renderStars(5)}</div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{reviewStats.total} reviews</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        {reviewStats.recent.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews yet</div>
        ) : (
          <div className="space-y-4">
            {reviewStats.recent.map((review) => (
              <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-800">{review.client}</p>
                    <p className="text-sm text-gray-500">{review.project}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1">{renderStars(review.rating)}</div>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(review.date)}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 italic">&quot;{review.comment}&quot;</p>
              </div>
            ))}
          </div>
        )}
        <button className="w-full mt-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Reviews
        </button>
      </div>
    </div>
  );
};
