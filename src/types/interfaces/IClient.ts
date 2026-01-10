export interface ClientProfileData {
  companyName: string;
  description: string;
  website: string;
  logo: string;
}

export interface JobData {
  title?: string;
  description?: string;
  category?: string;
  specialities?: string[];
  skills?: string[];
  rateType?: "fixed" | "hourly";
  currency?: "USD" | "EUR" | "GBP" | "INR" | "AUD" | "CAD" | "SGD" | "JPY";
  hourlyRate?: {
    min: number;
    max: number;
    hoursPerWeek: number;
    estimatedDuration: "1 To 3 Months" | "3 To 6 Months";
  };
  fixedRate?: {
    min: number;
    max: number;
  };

}
