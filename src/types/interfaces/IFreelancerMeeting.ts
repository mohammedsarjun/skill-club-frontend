export interface IFreelancerMeetingListItem {
  meetingId: string;
  contractId: string;
  contractTitle: string;
  type: 'recurring' | 'milestone' | 'fixed';
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
  status: 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested' | 'cancelled' | 'rejected' | 'ongoing' | 'rescheduled_requested';
  client?: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    logo?: string;
  };
  milestoneId?: string;
  milestoneTitle?: string;
  deliverableId?: string;
  agora?: {
    channelName: string;
    createdAt: string;
  };
  attendance?: {
    clientJoined: boolean;
    clientLeftAt?: string;
    freelancerJoined: boolean;
    freelancerLeftAt?: string;
  };
  notes?: {
    clientNotes?: string;
    freelancerNotes?: string;
  };
  rescheduleRequestedBy?: string;
  rescheduleProposedTime?: string;
  isProposedByFreelancer?: boolean;
  meetingLink?: string;
  createdAt: string;
}

export interface IFreelancerMeetingListResult {
  items: IFreelancerMeetingListItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IFreelancerMeetingQueryParams {
  page?: number;
  limit?: number;
  status?: 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested' | 'cancelled' | 'rejected' | 'ongoing' | 'rescheduled_requested';
}

export interface IFreelancerMeetingDetail {
  meetingId: string;
  contractId: string;
  contractTitle: string;
  type: 'recurring' | 'milestone' | 'fixed';
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
  status: 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested';
  client?: {
    clientId: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    logo?: string;
  };
  milestoneId?: string;
  milestoneTitle?: string;
  milestoneAmount?: number;
  deliverableId?: string;
  deliverableVersion?: number;
  rescheduleRequestedBy?: string;
  rescheduleProposedTime?: string;
  completedByClient: boolean;
  notes?: {
    clientNotes?: string;
    freelancerNotes?: string;
  };
  isProposedByFreelancer?: boolean;
  meetingLink?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAcceptMeetingRequest {
  meetingId: string;
}

export interface IRequestRescheduleRequest {
  meetingId: string;
  proposedTime: string;
}

export interface IRejectMeetingRequest {
  meetingId: string;
  reason: string;
}

export interface IFreelancerMeetingProposalRequest {
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
  type: 'milestone' | 'fixed';
}

export interface IFreelancerMeetingProposalResponse {
  success: boolean;
  data: {
    meetingId: string;
    contractId: string;
    scheduledAt: string;
    durationMinutes: number;
    agenda: string;
    type: 'milestone' | 'fixed';
    status: string;
    createdAt: string;
  };
  message: string;
}
