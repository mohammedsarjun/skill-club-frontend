'use client';

import React, { useState, useEffect } from 'react';
import Table, { Column, Filter } from '@/components/admin/Table';
import AdminActionApi from '@/api/action/AdminActionApi';
import { IAdminReviewItem } from '@/types/interfaces/IAdminReview';
import toast from 'react-hot-toast';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<IAdminReviewItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{
    reviewerRole?: 'client' | 'freelancer';
    isHideByAdmin?: boolean;
  }>({});

  const pageSize = 10;

  useEffect(() => {
    fetchReviews();
  }, [page, filters]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await AdminActionApi.getReviews(
        page,
        pageSize,
        filters.reviewerRole,
        filters.isHideByAdmin
      );

      if (response.success) {
        setReviews(response.data.reviews);
        setTotalPages(response.data.pagination.totalPages);
        setTotalCount(response.data.pagination.totalItems);
      }
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHide = async (row: IAdminReviewItem) => {
    try {
      const response = await AdminActionApi.toggleHideReview(row.reviewId);
      
      if (response.success) {
        toast.success(
          response.data.isHideByAdmin
            ? 'Review hidden successfully'
            : 'Review unhidden successfully'
        );
        fetchReviews();
      }
    } catch (error) {
      toast.error('Failed to toggle review visibility');
    }
  };

  const handleFilterChange = (newFilters: {
    reviewerRole?: string;
    isHideByAdmin?: string;
  }) => {
    const updatedFilters: {
      reviewerRole?: 'client' | 'freelancer';
      isHideByAdmin?: boolean;
    } = {};

    if (newFilters.reviewerRole && newFilters.reviewerRole !== 'all') {
      updatedFilters.reviewerRole = newFilters.reviewerRole as 'client' | 'freelancer';
    }

    if (newFilters.isHideByAdmin && newFilters.isHideByAdmin !== 'all') {
      updatedFilters.isHideByAdmin = newFilters.isHideByAdmin === 'true';
    }

    setFilters(updatedFilters);
    setPage(1);
  };

  const columns: Column<IAdminReviewItem>[] = [
    { key: 'reviewerName', label: 'Reviewer' },
    { key: 'revieweeName', label: 'Reviewee' },
    { key: 'reviewerRole', label: 'Role' },
    { key: 'rating', label: 'Rating' },
    { key: 'comment', label: 'Comment' },
    { key: 'isHideByAdmin', label: 'Status' },
    { key: 'createdAt', label: 'Date' },
  ];

  const tableFilters: Filter[] = [
    {
      key: 'reviewerRole',
      label: 'Reviewer Role',
      options: [
        { id: 'all', name: 'All' },
        { id: 'client', name: 'Client' },
        { id: 'freelancer', name: 'Freelancer' },
      ],
    },
    {
      key: 'isHideByAdmin',
      label: 'Visibility',
      options: [
        { id: 'all', name: 'All' },
        { id: 'false', name: 'Visible' },
        { id: 'true', name: 'Hidden' },
      ],
    },
  ];

  const formattedData = reviews.map((review) => ({
    ...review,
    createdAt: new Date(review.createdAt).toLocaleDateString(),
    isHideByAdmin: review.isHideByAdmin ? 'Hidden' : 'Visible',
  }));

  return (
    <div className="p-6">
      <Table
        title="Reviews Management"
        columns={columns}
        data={formattedData}
        filters={tableFilters}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        viewOnly={true}
        onEdit={handleToggleHide}
        editButtonLabel={(row: any) => row.isHideByAdmin === 'Hidden' ? 'Unhide' : 'Hide'}
        editButtonClass={(row: any) => 
          `px-4 py-2 rounded-md text-white font-medium transition-colors ${
            row.isHideByAdmin === 'Hidden'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`
        }
        setFilters={handleFilterChange}
        badgeKeys={['reviewerRole', 'isHideByAdmin']}
        badgeColors={{
          client: '#3B82F6',
          freelancer: '#10B981',
          Visible: '#10B981',
          Hidden: '#EF4444',
        }}
      />
    </div>
  );
}