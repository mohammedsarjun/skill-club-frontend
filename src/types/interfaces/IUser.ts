export interface IClientProfile {
  companyName: string;
  logo?: string;
  description?: string;
  website?: string;
}


export interface IAddress {
  country: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: number;
}
