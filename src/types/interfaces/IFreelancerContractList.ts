export interface IFreelancerContractListItemDTO {
  id: string;
  contractId: string;
  title: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'JPY';
  status: string;
  createdAt: string;
  client?: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    logo?: string;
  };
}

export interface IFreelancerContractListResultDTO {
  items: IFreelancerContractListItemDTO[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IFreelancerContractQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  filters?: {
    status?: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded';
  };
}
