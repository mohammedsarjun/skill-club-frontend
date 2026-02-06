export interface IReportJobRequest {
  reason: string;
}

export interface IReportJobResponse {
  reported: boolean;
  message: string;
}

export interface IIsJobReportedResponse {
  reported: boolean;
}

export interface IAdminReportedJob {
  reportId: string;
  jobId: string;
  jobTitle: string;
  jobStatus: string;
  freelancerId: string;
  freelancerName: string;
  freelancerEmail: string;
  freelancerPicture: string;
  reason: string;
  reportedAt: Date;
}

export interface IAdminReportedJobsResponse {
  data: IAdminReportedJob[];
  total: number;
  page: number;
  limit: number;
}

export interface IJobReportsResponse {
  reports: IAdminReportedJob[];
  totalReports: number;
}
