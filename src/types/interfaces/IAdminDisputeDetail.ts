export interface IAdminDisputeDetail {
  disputeId: string;
  contractId: string;
  raisedBy: 'client' | 'freelancer' | 'system';
  scope: 'contract' | 'milestone' | 'worklog';
  scopeId: string | null;
  contractType: 'hourly' | 'fixed' | 'fixed_with_milestones';
  reasonCode: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  contract: IAdminDisputeContract;
  holdTransaction?: IAdminDisputeHoldTransaction;
  milestones?: IAdminDisputeMilestone[];
  deliverables?: IAdminDisputeDeliverable[];
}

export interface IAdminDisputeContract {
  contractId: string;
  title: string;
  description: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  status: string;
  expectedStartDate: string;
  expectedEndDate: string;
  fundedAmount: number;
  totalPaid: number;
  balance: number;
  client: {
    clientId: string;
    firstName: string;
    lastName: string;
    companyName?: string;
  };
  freelancer: {
    freelancerId: string;
    firstName: string;
    lastName: string;
  };
}

export interface IAdminDisputeHoldTransaction {
  transactionId: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface IAdminDisputeMilestone {
  id: string;
  milestoneId: string;
  title: string;
  amount: number;
  expectedDelivery: string;
  status: string;
  submittedAt?: string;
  approvedAt?: string;
  deliverables?: IAdminDisputeDeliverable[];
}

export interface IAdminDisputeDeliverable {
  id: string;
  submittedBy: string;
  files: Array<{ fileName: string; fileUrl: string }>;
  message?: string;
  status: string;
  version: number;
  submittedAt: string;
  approvedAt?: string;
}
