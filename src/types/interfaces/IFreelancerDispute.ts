export interface IRaiseDisputeForCancelledContractRequest {
  notes: string;
  milestoneId?: string;
}

export interface IDisputeResolution {
  outcome: 'refund_client' | 'pay_freelancer' | 'split';
  clientAmount: number;
  freelancerAmount: number;
  decidedBy: 'admin' | 'system';
  decidedAt?: string;
}

export interface IFreelancerDispute {
  disputeId: string;
  contractId: string;
  contractType: 'hourly' | 'fixed' | 'fixed_with_milestones';
  raisedBy: 'client' | 'freelancer' | 'system';
  scope: 'contract' | 'milestone' | 'worklog';
  scopeId: string | null;
  reasonCode: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  resolution?: IDisputeResolution;
  createdAt: string;
  updatedAt: string;
}
