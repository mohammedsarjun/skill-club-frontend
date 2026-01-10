'use client';

import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { clientActionApi } from '@/api/action/ClientActionApi';
import { IFreelancerReviewsResponse, IFreelancerReviewItem } from '@/types/interfaces/IFreelancerReviews';
import Pagination from '@/components/common/Pagination';

export default function FreelancerReviewsDisplay() {
  const params = useParams();
  const freelancerId = params?.freelancerId as string;

  const [reviewsData, setReviewsData] = useState<IFreelancerReviewsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const limit = 10;

  useEffect(() => {
    if (freelancerId) {
      fetchReviews(currentPage);
    }
  }, [freelancerId, currentPage]);

  const fetchReviews = async (page: number) => {
    try {
      setLoading(true);
      setError('');
      const data = await clientActionApi.getFreelancerReviews(freelancerId, page, limit);
      setReviewsData(data);
    } catch (err) {
      setError('Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderStars = (rating: number) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={16}
        className={`${
          star <= rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#14A800]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const reviews = reviewsData?.data?.reviews || [];
  const stats = reviewsData?.data?.stats;
  const pagination = reviewsData?.data?.pagination;

  return (
    <div className="w-full">
  <div className="w-full mb-6">
    <h2 className="text-2xl font-bold mb-4">Reviews & Ratings</h2>
    <div className="flex items-center gap-4 mb-6">
      <span className="text-4xl font-bold">{stats?.averageRating?.toFixed(1) || '0.0'}</span>
      {renderStars(Math.round(stats?.averageRating || 0))}
      <span className="text-gray-600">{stats?.totalReviews || 0} {stats?.totalReviews === 1 ? 'review' : 'reviews'}</span>
    </div>
  </div>

  <div className="w-full space-y-6">
    {reviews.map((review,i) => (
      <div key={i} className="w-full border rounded-lg p-6">
        <div className="flex items-start gap-4">
          {review.reviewerLogo ? (
            <img src={review.reviewerLogo} alt={review.reviewerName} className="w-12 h-12 rounded-full" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {getInitials(review.reviewerName)}
            </div>
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{review.reviewerName}</h3>
            {review.reviewerCompanyName && (
              <p className="text-gray-600 text-sm">{review.reviewerCompanyName}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {renderStars(review.rating)}
              <span className="text-gray-500 text-sm">{formatDate(review.createdAt)}</span>
            </div>
            <p className="mt-3 text-gray-700">{review.comment}</p>
          </div>
        </div>
      </div>
    ))}
    {reviews.length === 0 && (
      <div className="w-full text-center py-12 text-gray-500">No reviews yet</div>
    )}
  </div>
{pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
</div>
  );
}
      