export interface IFreelancerContractStats {
  active: number;
  pending: number;
  completed: number;
}

export interface IFreelancerEarnings {
  total: number;
  available: number;
  commission: number;
  pending: number;
}

export interface IFreelancerMeeting {
  id: string;
  client: string;
  project: string;
  date: Date;
  time: string;
  status: string;
  channelName: string;
}

export interface IFreelancerReview {
  id: string;
  client: string;
  rating: number;
  comment: string;
  project: string;
  date: Date;
}

export interface IFreelancerReviewStats {
  average: number;
  total: number;
  recent: IFreelancerReview[];
}
