import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { IFreelancerMeetingListItem } from '@/types/interfaces/IFreelancerMeeting';

interface SentRequestsProps {
  meetings: IFreelancerMeetingListItem[];
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
  getMeetingTypeBadge: (meetingType: string) => React.ReactElement;
}

const SentRequests: React.FC<SentRequestsProps> = ({
  meetings,
  formatDate,
  formatTime,
  getStatusBadge,
  getMeetingTypeBadge,
}) => {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Sent Requests</h3>
        <p className="text-gray-600">You haven&apos;t sent any meeting requests yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Meeting Requests You Sent</h3>
        <p className="text-sm text-gray-600 mt-1">Track the status of meeting requests you&apos;ve proposed to clients</p>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.meetingId}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">{meeting.contractTitle}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {meeting.client?.firstName} {meeting.client?.lastName}
                    {meeting.client?.companyName && ` (${meeting.client.companyName})`}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {getStatusBadge(meeting.status)}
                {getMeetingTypeBadge(meeting.meetingType)}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{formatDate(meeting.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>
                  {formatTime(meeting.scheduledAt)} ({meeting.durationMinutes} minutes)
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Agenda:</p>
              <p className="text-sm text-gray-600">{meeting.agenda}</p>
            </div>

            {meeting.status === 'proposed' && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                <Clock className="w-4 h-4" />
                <span>Waiting for client to accept your meeting request</span>
              </div>
            )}

            {meeting.status === 'rejected' && (
              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-md">
                The client has declined this meeting request
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentRequests;
