export interface IFreelancerContractDetail {
  contractId: string;
  offerId: string;
  offerType?: 'direct' | 'proposal';
  jobId?: string;
  jobTitle?: string;
  proposalId?: string;
  
  client?: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    logo?: string;
    country?: string;
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
    status: 'pending_funding' | 'funded' | 'changes_requested' | 'submitted' | 'approved' | 'paid';
    submittedAt?: string;
    approvedAt?: string;
    revisionsAllowed?: number;
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

  timesheets?: {
    weekStart: string;
    weekEnd: string;
    totalHours: number;
    totalAmount: number;
    status: 'pending' | 'approved' | 'paid';
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

  status: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded';
  fundedAmount: number;
  totalPaid: number;
  balance: number;
  
  createdAt?: string;
  updatedAt?: string;
}
