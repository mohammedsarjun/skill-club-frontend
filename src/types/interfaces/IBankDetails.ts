export interface IBankDetails {
  userId: string;
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountType: 'savings' | 'current';
  verified: boolean;
}
