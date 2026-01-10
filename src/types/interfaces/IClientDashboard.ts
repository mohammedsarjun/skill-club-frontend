export interface IClientDashboardStats {
  activeJobs: number;
  postedJobs: number;
  totalSpend: number;
  pendingProposals: number;
}

export interface IRecentJob {
  _id: string;
  title: string;
  budget: string;
  proposals: number;
  postedDate: string;
  status: string;
  rateType: string;
  currency?: string;
}

export interface IRecentMessage {
  _id: string;
  contractId: string;
  sender: {
    _id: string;
    name: string;
  };
  message: string;
  time: string;
  unread: boolean;
  avatar: string;
}

export interface IClientDashboard {
  stats: IClientDashboardStats;
  recentJobs: IRecentJob[];
  recentMessages: IRecentMessage[];
}
