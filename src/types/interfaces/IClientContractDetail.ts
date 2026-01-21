export interface IClientContractDetail {
  contractId: string;
  offerId: string;
  offerType?: 'direct' | 'proposal';
  jobId?: string;
  jobTitle?: string;
  proposalId?: string;
  
  freelancer?: {
    freelancerId: string;
    firstName?: string;
    lastName?: string;
    logo?: string;
    country?: string;
    rating?: number;
  };

  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  budget?: number;
  budgetBaseUSD?: number;
  hourlyRate?: number;
  hourlyRateBaseUSD?: number;
  conversionRate?: number;
  estimatedHoursPerWeek?: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'JPY';

  milestones?: {
    id?: string;
    milestoneId: string;
    title: string;
    amount: number;
    amountBaseUSD?: number;
    expectedDelivery: string;
    status: 'pending_funding' | 'funded' | 'under_review' | 'submitted' | 'approved' | 'paid';
    submittedAt?: string;
    approvedAt?: string;
    revisionsAllowed?: number;
    disputeEligible?: boolean;
    disputeWindowEndsAt?: string;
    deliverables?: {
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
    }[];
    extensionRequest?: {
      requestedBy: string;
      requestedDeadline: string;
      reason: string;
      status: 'pending' | 'approved' | 'rejected';
      requestedAt: string;
      respondedAt?: string;
      responseMessage?: string;
    };
  }[];

  deliverables?: {
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
    isMeetingAlreadyProposed?: boolean;  
  }[];

  timeline?: {
    id?: string;
    action: string;
    performedBy: string;
    milestoneId?: string;
    details?: string;
    timestamp: string;
  }[];

  title: string;
  description: string;
  expectedStartDate: string;
  expectedEndDate: string;
  referenceFiles: { fileName: string; fileUrl: string }[];
  referenceLinks: { description: string; link: string }[];
  
  extensionRequest?: {
    requestedBy: string;
    requestedDeadline: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected';
    requestedAt: string;
    respondedAt?: string;
    responseMessage?: string;
  };
  
  communication?: {
    preferredMethod: 'chat' | 'video_call' | 'email' | 'mixed';
    meetingFrequency?: 'daily' | 'weekly' | 'monthly';
    meetingDayOfWeek?: string;
    meetingDayOfMonth?: number;
    meetingTimeUtc?: string;
  };
  
  reporting?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    dueTimeUtc: string;
    dueDayOfWeek?: string;
    dueDayOfMonth?: number;
    format: 'text_with_attachments' | 'text_only' | 'video';
  };

  status: 'pending_funding' | 'held' | 'active' | 'completed' | 'cancelled' | 'refunded' | 'disputed';
  totalFunded: number;
  totalPaidToFreelancer: number;
  totalCommissionPaid: number;
  totalAmountHeld: number;
  totalRefund: number;
  availableContractBalance: number;
  cancelledBy?: 'client' | 'freelancer';
  isFunded?: boolean;
  hasActiveCancellationDisputeWindow?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
