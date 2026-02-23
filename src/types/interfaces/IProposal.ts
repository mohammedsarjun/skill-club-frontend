export interface ICreateProposal {
  jobId: string;
  hourlyRate?: number;
  availableHoursPerWeek?: number;
  proposedBudget?: number;
  deadline?: Date;
  coverLetter: string;
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'JPY';
}

export interface IProposalJobDetail {
  _id: string;
  title: string;
  description: string;
  clientId: string;
}

export interface IFreelancerProposal {
  proposalId: string;
  jobDetail: IProposalJobDetail;
  hourlyRate?: number;
  availableHoursPerWeek?: number;
  proposedBudget?: number;
  deadline?: string;
  coverLetter: string;
  status: 'pending_verification' | 'offer_sent' | 'rejected';
  proposedAt: string;
}