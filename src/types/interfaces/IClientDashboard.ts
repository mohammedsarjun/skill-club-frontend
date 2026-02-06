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

export interface IRecentActiveContract {
  _id: string;
  title: string;
  freelancer: {
    _id: string;
    name: string;
    logo?: string;
    country?: string;
  };
  status: string;
  contractType: string;
  startDate: string;
  budget: number;
  currency?: string;
}

export interface ISavedFreelancer {
  _id: string;
  freelancer: {
    _id: string;
    name: string;
    logo?: string;
    professionalRole?: string;
    country?: string;
    hourlyRate?: number;
    skills: string[];
  };
  savedAt: string;
}

export interface IClientDashboard {
  stats: IClientDashboardStats;
  recentJobs: IRecentJob[];
  recentMessages: IRecentMessage[];
  recentActiveContracts: IRecentActiveContract[];
  savedFreelancers: ISavedFreelancer[];
}
