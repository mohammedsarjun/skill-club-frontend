export interface IFreelancerCancellationRequest {
  cancellationRequestId: string;
  contractId: string;
  initiatedBy: 'client' | 'freelancer';
  reason: string;
  clientSplitPercentage: number;
  freelancerSplitPercentage: number;
  totalHeldAmount: number;
  clientAmount: number;
  freelancerAmount: number;
  status: 'pending' | 'accepted' | 'disputed' | 'rejected' | 'cancelled';
  respondedAt?: string;
  responseMessage?: string;
  createdAt: string;
}

export interface IAcceptCancellationRequest {
  responseMessage?: string;
}

export interface IRaiseCancellationDispute {
  notes: string;
}
