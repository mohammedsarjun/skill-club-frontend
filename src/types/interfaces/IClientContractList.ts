export interface IClientContractListItemDTO {
  id: string;
  contractId: string;
  title: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'JPY';
  status: string;
  createdAt: string;
  freelancer?: {
    freelancerId: string;
    firstName?: string;
    lastName?: string;
    logo?: string;
  };
}

export interface IClientContractListResultDTO {
  items: IClientContractListItemDTO[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IClientContractQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  filters?: {
    status?: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded';
  };
}
