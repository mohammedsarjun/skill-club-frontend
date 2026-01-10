export interface MeetingProposalRequest {
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
  milestoneId?: string;
  deliverableId?: string;
}

export interface MeetingProposalResponse {
  success: boolean;
  data: {
    meetingId: string;
    contractId: string;
    scheduledAt: string;
    durationMinutes: number;
    agenda: string;

    status: string;
    createdAt: string;
  };
  message: string;
}
