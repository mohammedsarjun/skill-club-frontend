export interface IInitiatePayment {
  contractId: string;
  milestoneId?: string;
  amount: number;
  purpose: 'contract_funding' | 'milestone_funding' | 'hourly_advance';
  returnUrl: string;
  cancelUrl: string;

}

export interface IPayUConfig {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
}

export interface IPaymentResponse {
  paymentId: string;
  gatewayOrderId: string;
  payuConfig: IPayUConfig;
  payuUrl: string;
}

export interface IPaymentVerification {
  paymentId: string;
  status: 'success' | 'failed';
  gatewayTransactionId: string;
  contractId: string;
}
