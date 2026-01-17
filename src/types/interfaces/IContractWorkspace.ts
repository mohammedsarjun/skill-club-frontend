export interface IDeliverable {
  deliverableId?: string;
  submittedBy: string;
  files: { fileName: string; fileUrl: string }[];
  message?: string;
  status: 'submitted' | 'approved' | 'changes_requested' | 'change_request_approved';
  version: number;
  submittedAt: string;
  approvedAt?: string;
  revisionNote?: string;
  isMeetingAlreadyProposed?: boolean;
}

export interface IMilestoneDeliverable {
  milestoneId: string;
  title: string;
  amount: number;
  expectedDelivery: string;
  status: 'pending' | 'funded' | 'submitted' | 'approved' | 'paid';
  deliverable?: IDeliverable;
}

export interface IHourLog {
  logId?: string;
  date: string;
  hours: number;
  description: string;
  isRunning?: boolean;
  startTime?: string;
}

export interface ITimesheet {
  weekStart: string;
  weekEnd: string;
  totalHours: number;
  totalAmount: number;
  status: 'pending' | 'approved' | 'paid';
  hoursLogged: IHourLog[];
}

export interface IChatMessage {
  messageId?: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  message: string;
  attachments?: { fileName: string; fileUrl: string }[];
  sentAt: string;
  readAt?: string;
}

export interface IWorkspaceFile {
  fileId?: string;
  fileName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  fileSize?: number;
  fileType?: string;
}
