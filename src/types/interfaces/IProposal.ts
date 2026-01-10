export interface ICreateProposal{
  jobId: string
  hourlyRate?: number;                
  availableHoursPerWeek?: number;     
  proposedBudget?: number;            
  deadline?: Date;                    
  coverLetter: string;                
  currency?: 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'JPY';

}