export interface IClientMeetingListItem {
  meetingId: string;
  contractId?: string;
  contractTitle?: string;
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
  type?: 'recurring' | 'milestone' | 'fixed';
  meetingType: 'pre-contract' | 'post-contract';
  status: 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested' | 'cancelled' | 'rejected' | 'ongoing' | 'rescheduled_requested';
  freelancer?: {
    freelancerId: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
  };
  agora?: {
    channelName: string;
    createdAt: string;
  };
  attendance: {
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
  isProposedByClient: boolean;
  createdAt: string;
}

export interface IClientMeetingListResult {
  items: IClientMeetingListItem[];
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface IClientMeetingQueryParams {
  page?: number;
  limit?: number;
  status?: 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested' | 'cancelled' | 'rejected' | 'ongoing' | 'rescheduled_requested';
  meetingType?: 'pre-contract' | 'post-contract';
  requestedBy?: 'client' | 'freelancer';
  rescheduleRequestedBy?: 'client' | 'freelancer';
  isExpired?: boolean;
}

export interface IClientMeetingListResponse {
  success: boolean;
  data: IClientMeetingListResult;
  message: string;
}
