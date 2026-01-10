export interface IAdminReviewItem {
  reviewId: string;
  reviewerName: string;
  revieweeName: string;
  reviewerRole: 'client' | 'freelancer';
  rating: number;
  comment?: string;
  isHideByAdmin: boolean;
  createdAt: string;
}

export interface IAdminReviewPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IAdminReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: IAdminReviewItem[];
    pagination: IAdminReviewPagination;
  };
}

export interface IToggleHideReviewResponse {
  success: boolean;
  message: string;
  data: {
    reviewId: string;
    isHideByAdmin: boolean;
  };
}
