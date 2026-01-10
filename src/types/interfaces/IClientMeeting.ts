export interface IClientMeetingListItem {
  meetingId: string;
  contractId: string;
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
  type: 'recurring' | 'milestone' | 'fixed';
  status: 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested' | 'cancelled' | 'rejected' | 'ongoing' | 'rescheduled_requested';
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
  isProposedByClient:boolean
  createdAt: string;
}

export interface IClientMeetingListResponse {
  success: boolean;
  data: IClientMeetingListItem[];
  message: string;
}
