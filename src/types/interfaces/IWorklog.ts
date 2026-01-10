export interface IWorklogFile {
  fileName: string;
  fileUrl: string;
}

export interface ISubmitWorklogRequest {
  contractId: string;
  milestoneId?: string;
  duration: number;
  files: IWorklogFile[];
  description?: string;
}

export interface IWorklogResponse {
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
  createdAt: string;
}
