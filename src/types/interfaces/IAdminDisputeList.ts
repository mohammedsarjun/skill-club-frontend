export interface IAdminDisputeQueryParams {
  search?: string;
  page?: number;
  limit?: number;
  reasonCode?: string;
}

export interface IAdminDisputeListItem {
  id: string;
  disputeId: string;
  contractTitle: string;
  raisedBy: {
    name: string;
    role: 'client' | 'freelancer' | 'system';
  };
  reasonCode: string;
  status: string;
  createdAt: Date;
}

export interface IAdminDisputeListResult {
  items: IAdminDisputeListItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
