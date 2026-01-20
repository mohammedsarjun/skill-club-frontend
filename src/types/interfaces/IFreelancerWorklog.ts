export interface IWorklogFile {
  fileName: string;
  fileUrl: string;
}

export interface IFreelancerWorklogListItem {
  worklogId: string;
  startTime: string;
  endTime: string;
  duration: number;
  filesCount: number;
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  disputeWindowEndsAt?: string;
}

export interface IFreelancerWorklogDetail {
  worklogId: string;
  contractId: string;
  milestoneId?: string;
  freelancerId: string;
  startTime: string;
  endTime: string;
  duration: number;
  files: IWorklogFile[];
  description?: string;
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewMessage?: string;
  disputeWindowEndsAt?: string;
  disputeRaisedBy?: string;
}

export interface IFreelancerWorklogListResponse {
  items: IFreelancerWorklogListItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}
