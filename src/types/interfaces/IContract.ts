export interface MilestoneDeliverable {
  id: string;
  submittedBy: string;
  files: { fileName: string; fileUrl: string }[];
  message?: string;
  status: 'submitted' | 'approved' | 'changes_requested';
  version: number;
  submittedAt: string;
  approvedAt?: string;
  revisionsRequested?: number;
  revisionsAllowed?: number;
  revisionsLeft?: number;
}

export interface MilestoneExtensionRequest {
  requestedBy: string;
  requestedDeadline: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  respondedAt?: string;
  responseMessage?: string;
}

export interface ContractMilestone {
  id?: string;
  milestoneId: string;
  title: string;
  amount: number;
  expectedDelivery: string;
  status: 'pending' | 'funded' | 'submitted' | 'approved' | 'paid';
  submittedAt?: string;
  approvedAt?: string;
  revisionsAllowed?: number;
  deliverables?: MilestoneDeliverable[];
  extensionRequest?: MilestoneExtensionRequest;
}

export interface TimelineEntry {
  id?: string;
  action: string;
  performedBy: string;
  milestoneId?: string;
  details?: string;
  timestamp: string;
}

export type ContractStatus = 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded';

export interface IContract {
  contractId: string;
  offerId?: string;
  clientId: string;
  freelancerId: string;
  jobId?: string;
  title: string;
  description: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  budget?: number;
  milestones?: ContractMilestone[];
  timeline?: TimelineEntry[];
  expectedStartDate?: string;
  expectedEndDate?: string;
  status: ContractStatus;
  fundedAmount: number;
  totalPaid: number;
  balance: number;
  createdAt?: string;
}
