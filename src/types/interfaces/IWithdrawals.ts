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

export interface IFreelancerProfile {
  professionalRole: string;
  hourlyRate: number;
  workCategory: string;
}

export interface IFreelancer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  isVerified: boolean;
  isBlocked: boolean;
  profile: IFreelancerProfile;
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
  id?: string;
  transaction: IWithdrawalTransaction;
  freelancer: IFreelancer;
  bankDetails: IBankDetails;
  role: string;
}

export interface IWithdrawalsResponse {
  items: IWithdrawalItem[];
  page?: number;
  limit?: number;
  total: number;
}
