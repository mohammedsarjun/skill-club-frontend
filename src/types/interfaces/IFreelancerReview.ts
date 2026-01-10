export interface ISubmitReviewRequest {
  rating: number;
}

export interface IReviewStatusResponse {
  hasReviewed: boolean;
  reviewId?: string;
}

export interface ISubmitReviewResponse {
  success: boolean;
  message: string;
  data?: {
    reviewId: string;
    contractId: string;
    reviewerId: string;
    revieweeId: string;
    reviewerRole: 'client' | 'freelancer';
    rating: number;
    createdAt: Date;
  };
}
