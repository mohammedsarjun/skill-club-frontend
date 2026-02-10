export interface IWorklogFile {
  fileName: string;
  fileUrl: string;
}

export interface IWorklogListItem {
  worklogId: string;
  startTime: string;
  endTime: string;
  duration: number;
  filesCount: number;
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface IWorklogDetail {
  worklogId: string;
  contractId: string;
  milestoneId?: string;
  freelancerId: string;
  freelancerName: string;
  startTime: string;
  endTime: string;
  duration: number;
  files: IWorklogFile[];
  description?: string;
  status: 'submitted' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewMessage?: string;
  disputeRaisedBy?: string;
}

export interface IWorklogListResponse {
  items: IWorklogListItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IApproveWorklogRequest {
  worklogId: string;
  message?: string;
}

export interface IRejectWorklogRequest {
  worklogId: string;
  message: string;
}
