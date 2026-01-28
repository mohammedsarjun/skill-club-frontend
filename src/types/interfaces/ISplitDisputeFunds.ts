export interface ISplitDisputeFundsRequest {
  clientPercentage: number;
  freelancerPercentage: number;
}

export interface ISplitDisputeFundsResponse {
  success: boolean;
  message: string;
  data: {
    clientRefundAmount: number;
    freelancerReleaseAmount: number;
  };
}
