export interface IAdminDashboardStats {
  totalFreelancers: number;
  totalClients: number;
  activeJobs: number;
  monthlyRevenue: number;
}

export interface IRevenueDataPoint {
  name: string;
  revenue: number;
}

export interface IUserGrowthDataPoint {
  name: string;
  freelancers: number;
  clients: number;
}

export interface IAdminDashboardRevenue {
  weekly: IRevenueDataPoint[];
  monthly: IRevenueDataPoint[];
  yearly: IRevenueDataPoint[];
}

export interface IAdminDashboardUserGrowth {
  weekly: IUserGrowthDataPoint[];
  monthly: IUserGrowthDataPoint[];
  yearly: IUserGrowthDataPoint[];
}

export interface IRecentContract {
  id: string;
  contractId: string;
  title: string;
  clientName: string;
  freelancerName: string;
  status: string;
  budget: number;
  createdAt: Date;
}

export interface IRecentReview {
  id: string;
  reviewerName: string;
  revieweeName: string;
  rating: number;
  comment: string;
  reviewerRole: string;
  createdAt: Date;
}
