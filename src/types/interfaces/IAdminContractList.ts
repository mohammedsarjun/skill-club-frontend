export interface IAdminContractQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  status?: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded';
}

export interface IAdminContractListItem {
  id: string;
  contractId: string;
  title: string;
  paymentType: 'fixed' | 'fixed_with_milestones' | 'hourly';
  budget?: number;
  hourlyRate?: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'JPY';
  status: string;
  createdAt: Date;
  client?: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    logo?: string;
  };
  freelancer?: {
    freelancerId: string;
    firstName?: string;
    lastName?: string;
    logo?: string;
  };
}

export interface IAdminContractListResult {
  items: IAdminContractListItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
