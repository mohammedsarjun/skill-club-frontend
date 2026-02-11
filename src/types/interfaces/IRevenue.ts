export interface IRevenueTransactionClientFreelancer {
  id: string;
  name: string;
  email: string;
}

export interface IRevenueTransaction {
  id: string;
  transactionId: string;
  contractId: string;
  clientId: IRevenueTransactionClientFreelancer;
  freelancerId: IRevenueTransactionClientFreelancer;
  amount: number;
  purpose: string;
  status: string;
  description: string;
  createdAt: Date | string;
  metadata?: {
    projectName?: string;
    category?: string;
  };
}

export interface IRevenueStats {
  totalRevenue: number;
  totalCommissions: number;
  totalTransactions: number;
  averageCommission: number;
  growth: number;
}

export interface IRevenueChartDataPoint {
  month: string;
  revenue: number;
  transactions: number;
}

export interface IRevenueCategoryData {
  name: string;
  value: number;
  percentage: number;
}

export interface IAdminRevenueResponse {
  stats: IRevenueStats;
  chartData: IRevenueChartDataPoint[];
  categoryData: IRevenueCategoryData[];
  transactions: IRevenueTransaction[];
}
