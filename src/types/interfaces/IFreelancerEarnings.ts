export interface IFreelancerEarningsOverview {
  available: number;
  pending: number;
  totalEarnings: number;
}

export interface IFreelancerTransaction {
  id: string;
  transactionId: string;
  contractId: string;
  amount: number;
  purpose: 'funding' | 'release' | 'commission' | 'refund';
  description: string;
  createdAt: string;
  clientName?: string;
}

export interface IFreelancerTransactionsResponse {
  items: IFreelancerTransaction[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IFreelancerTransactionsQuery {
  page?: number;
  limit?: number;
  period?: 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
}
