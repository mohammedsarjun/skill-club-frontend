export interface IDispute {
  disputeId: string;
  contractId: string;
  contractType: 'hourly' | 'fixed' | 'fixed_with_milestones';
  raisedBy: 'client' | 'freelancer' | 'system';
  scope: 'contract' | 'milestone' | 'worklog';
  scopeId: string | null;
  reasonCode: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  resolution?: {
    outcome: 'refund_client' | 'pay_freelancer' | 'split';
    clientAmount: number;
    freelancerAmount: number;
    decidedBy: 'admin' | 'system';
    decidedAt?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICreateDisputeRequest {
  contractId: string;
  reasonCode: string;
  description: string;
  scope?: 'contract' | 'milestone' | 'worklog';
  scopeId?: string;
}

export interface ICancelContractWithDisputeRequest {
  reasonCode: string;
  description: string;
}

export const DISPUTE_REASON_LABELS: Record<string, string> = {
  WORK_NOT_DELIVERED: 'Work Not Delivered',
  WORK_LOW_QUALITY: 'Work Quality Issues',
  DEADLINE_MISSED: 'Deadline Missed',
  CLIENT_UNRESPONSIVE: 'Client Unresponsive',
  FREELANCER_UNRESPONSIVE: 'Freelancer Unresponsive',
  SCOPE_MISMATCH: 'Scope Mismatch',
  PAYMENT_ISSUE: 'Payment Issue',
  MUTUAL_CANCEL: 'Mutual Cancellation',
  OTHER: 'Other',
};

export const CLIENT_DISPUTE_REASONS = [
  { value: 'WORK_NOT_DELIVERED', label: DISPUTE_REASON_LABELS.WORK_NOT_DELIVERED },
  { value: 'WORK_LOW_QUALITY', label: DISPUTE_REASON_LABELS.WORK_LOW_QUALITY },
  { value: 'DEADLINE_MISSED', label: DISPUTE_REASON_LABELS.DEADLINE_MISSED },
  { value: 'FREELANCER_UNRESPONSIVE', label: DISPUTE_REASON_LABELS.FREELANCER_UNRESPONSIVE },
  { value: 'SCOPE_MISMATCH', label: DISPUTE_REASON_LABELS.SCOPE_MISMATCH },
  { value: 'MUTUAL_CANCEL', label: DISPUTE_REASON_LABELS.MUTUAL_CANCEL },
  { value: 'OTHER', label: DISPUTE_REASON_LABELS.OTHER },
];

export const FREELANCER_DISPUTE_REASONS = [
  { value: 'CLIENT_UNRESPONSIVE', label: DISPUTE_REASON_LABELS.CLIENT_UNRESPONSIVE },
  { value: 'SCOPE_MISMATCH', label: DISPUTE_REASON_LABELS.SCOPE_MISMATCH },
  { value: 'PAYMENT_ISSUE', label: DISPUTE_REASON_LABELS.PAYMENT_ISSUE },
  { value: 'MUTUAL_CANCEL', label: DISPUTE_REASON_LABELS.MUTUAL_CANCEL },
  { value: 'OTHER', label: DISPUTE_REASON_LABELS.OTHER },
];
