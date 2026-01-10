export interface ISubmitReviewRequest {
  rating: number;
  comment?: string;
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
    rating: number;
    comment?: string;
  };
}
