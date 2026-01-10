export interface IFreelancerReviewItem {
  reviewId: string;
  reviewerName: string;
  reviewerCompanyName?: string;
  reviewerLogo?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface IReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface IFreelancerReviewsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IFreelancerReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: IFreelancerReviewItem[];
    stats: IReviewStats;
    pagination: IFreelancerReviewsPagination;
  };
}
