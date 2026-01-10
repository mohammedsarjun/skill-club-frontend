export interface IClientFinanceStats {
  totalSpent: number;
  totalRefunded: number;
  availableBalance: number;
}

export interface IClientTransaction {
  transactionId: string;
  amount: number;
  purpose: string;
  description: string;
  createdAt: string;
  freelancerName: string;
  contractId: string;
}

export interface IClientFinance {
  stats: IClientFinanceStats;
  spentTransactions: IClientTransaction[];
  refundTransactions: IClientTransaction[];
}
