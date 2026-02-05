export interface IWithdrawalRequest {
  amount: number;
  note?: string;
}

export interface IWithdrawalItem {
  id: string;
  amount: number;
  note?: string;
  status: 'requested' | 'approved' | 'rejected';
  createdAt: string;
}

export interface IWithdrawalsResponse {
  items: IWithdrawalItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
