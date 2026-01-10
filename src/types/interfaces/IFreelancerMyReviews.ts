export interface IFreelancerMyReviewItem {
  reviewId: string;
  clientName: string;
  clientCompanyName?: string;
  clientLogo?: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface IFreelancerReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface IFreelancerMyReviewsPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IFreelancerMyReviewsResponse {
  success: boolean;
  message: string;
  data: {
    reviews: IFreelancerMyReviewItem[];
    stats: IFreelancerReviewStats;
    pagination: IFreelancerMyReviewsPagination;
  };
}
