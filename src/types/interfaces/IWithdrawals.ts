export interface IWithdrawalRequest {
  amount: number;
  note?: string;
}

export interface IWithdrawalTransaction {
  transactionId: string;
  purpose: string;
  status: string;
  amount: number;
  description: string;
  createdAt: string;
}

export interface IUserProfile {
  professionalRole: string;
  hourlyRate: number;
  workCategory: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  profile: IUserProfile;
}

export interface IBankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumberMasked: string;
  ifscCode: string;
  accountType: string;
  verified: boolean;
}

export interface IWithdrawalItem {
  id: string;
  role: string;
  transaction: IWithdrawalTransaction;
  user: IUser;
  bankDetails: IBankDetails;
}

export interface IWithdrawalsResponse {
  items: IWithdrawalItem[];
  page: number;
  limit: number;
  total: number;
}

export interface IWithdrawalStats {
  pendingRequests: number;
  totalPendingAmount: number;
  totalWithdrawn: number;
}
