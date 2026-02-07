export interface IPreContractMeetingRequest {
  scheduledAt: string;
  durationMinutes: number;
  agenda: string;
}

export interface IPreContractMeetingResponse {
  success: boolean;
  data: {
    meetingId: string;
    freelancerId: string;
    scheduledAt: string;
    durationMinutes: number;
    agenda: string;
    meetingType: 'pre-contract';
    status: string;
    createdAt: string;
  };
  message: string;
}
