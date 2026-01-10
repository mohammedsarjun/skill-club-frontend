export interface IJob {
  jobId: string;
  jobTitle: string;
  companyName: string;
  category: {
    categoryName: string;
    categoryId: string;
  };
  budget: {
    rateType: string;
    min: number;
    max: number;
  };
  totalProposal: number;
  status: string;
}

export interface IJobQueryParams {
  search: string;
  page: number;
  limit: number;
  filters: {
    category?: string;
    status?:
      | "pending_verification"
      | "rejected"
      | "open"
      | "closed"
      | "archived"
      | "suspended";
  };
}

export interface JobDetailResponseDTO {
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  category: {
    categoryName: string;
    categoryId: string;
  };
  specialities: {
    specialityId: string;
    specialityName: string;
  }[];
  skills: {
    skillId: string;
    skillName: string;
  }[];
  budget: {
    rateType: "hourly" | "fixed";
    min: number;
    max: number;
    hoursPerWeek?: number;
    estimatedDuration?: "1 To 3 Months" | "3 To 6 Months";
  };
  totalProposal: number;
  status:
    | "pending_verification"
    | "rejected"
    | "open"
    | "closed"
    | "archived"
    | "suspended";
  clientDetail: {
    clientId: string;
    companyName: string;
    companyLogo: string;
  };
  verifiedBy?: string;
  rejectedReason?: string;
  suspendedReason?: string;
}

export interface FreelancerJobFilters {
  searchQuery: string;
  selectedCategory: string;
  selectedSpecialty: string;
  selectedSkills: string[];
  rateType: string;
  minHourlyRate: string;
  maxHourlyRate: string;
  minFixedRate: string;
  maxFixedRate: string;
  selectedProposalRanges: string[];
  selectedCountry: string;
  selectedRating: string;
  page: number;
  limit: number;
}

export interface FreelancerJobDetailResponse {
  jobId: string;
  title: string;
  description: string;
  category: string;
  specialities: string[];
  skills: string[];
  rateType: "hourly" | "fixed";
  hourlyRate?: {
    min: number;
    max: number;
    hoursPerWeek: number;
    estimatedDuration: "1 To 3 Months" | "3 To 6 Months";
  } | null;
  fixedRate?: {
    min: number;
    max: number;
  } | null;
  // Optional FX fields returned from backend
  currency?: string;
  conversionRate?: number; // USD per 1 unit of `currency`
  hourlyRateBaseUSD?: { min?: number; max?: number };
  fixedRateBaseUSD?: { min?: number; max?: number };
  proposalReceived: number;
  postedAt: string; // ISO date string
  client: {
    companyName: string;
    country: string;
    rating: number;
    totalJobsPosted: number;
  };
  status:string
}

export interface FreelancerJobResponse {
  jobId: string;
  jobTitle: string;
  description: string;
  category: string;
  specialities: string[];
  skills: string[];
  jobRateType: "hourly" | "fixed";
  minHourlyRate: number;
  maxHourlyRate: number;
  minFixedRate: number;
  maxFixedRate: number;
  totalProposalReceived: number;
  postedAt: string;
  client: {
    companyName: string;
    country: string;
    rating: number;
  };
}
