export interface IRaiseWorklogDisputeRequest {
  worklogId: string;
  description: string;
}

export interface IDisputeResponse {
  disputeId: string;
  contractId: string;
  contractType: 'hourly' | 'fixed' | 'fixed_with_milestones';
  raisedBy: 'client' | 'freelancer' | 'system';
  scope: 'contract' | 'milestone' | 'worklog';
  scopeId: string | null;
  reasonCode: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
