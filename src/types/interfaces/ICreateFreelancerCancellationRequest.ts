export interface ICreateFreelancerCancellationRequest {
  reason: string;
  clientSplitPercentage: number;
  freelancerSplitPercentage: number;
}

export interface IFreelancerCancellationRequestResponse {
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
  createdAt: string;
}
