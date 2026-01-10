export interface IDeliverable {
  id: string;
  submittedBy: string;
  files: { fileName: string; fileUrl: string }[];
  message?: string;
  status: 'submitted' | 'approved' | 'changes_requested';
  version: number;
  submittedAt: string;
  approvedAt?: string;
}

export interface ISubmitDeliverableRequest {
  files: { fileName: string; fileUrl: string }[];
  message?: string;
}

export interface IApproveDeliverableRequest {
  deliverableId: string;
  message?: string;
}

export interface IRequestChangesRequest {
  deliverableId: string;
  message: string;
}

export interface IDownloadDeliverableRequest {
  deliverableId: string;
}
