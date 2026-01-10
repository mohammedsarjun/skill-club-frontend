export interface Skill {
  skillId?: string;
  skillName?: string;
}

export interface Speciality {
  specialityId?: string;
  specialityName?: string;
}

export interface Budget {
  rateType?: string;
  min?: number;
  max?: number;
  hoursPerWeek?: number;
  estimatedDuration?: string;
}

export interface ClientDetail {
  clientId?: string;
  companyName?: string;
  companyLogo?: string;
}

export interface Proposal {
  proposalId?: string;
  freelancerName?: string;
  freelancerAvatar?: string;
  freelancerEmail?: string;
  freelancerPhone?: string;
  freelancerLocation?: string;
  rating?: number;
  totalJobs?: number;
  bidAmount?: number;
  estimatedDuration?: string;
  coverLetter?: string;
}
