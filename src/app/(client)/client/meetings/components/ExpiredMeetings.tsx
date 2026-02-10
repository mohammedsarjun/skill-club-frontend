import React from 'react';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';
import { IClientMeetingListItem } from '@/types/interfaces/IClientMeeting';

interface ExpiredMeetingsProps {
  meetings: IClientMeetingListItem[];
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
  getMeetingTypeBadge: (meetingType: string) => React.ReactElement;
}

const ExpiredMeetings: React.FC<ExpiredMeetingsProps> = ({
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
          <AlertCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Expired Meetings</h3>
        <p className="text-gray-600">You don&apos;t have any expired meeting requests.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Expired Meeting Requests</h3>
        <p className="text-sm text-gray-600 mt-1">
          Meeting requests that expired without a response from the opposite party
        </p>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.meetingId}
            className="bg-white border border-red-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {meeting.contractTitle || 'Pre-Contract Meeting'}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {meeting.freelancer?.firstName} {meeting.freelancer?.lastName}
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
                <Calendar className="w-4 h-4 text-red-600" />
                <span className="font-medium">{formatDate(meeting.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-red-600" />
                <span>
                  {formatTime(meeting.scheduledAt)} ({meeting.durationMinutes} minutes)
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Agenda:</p>
              <p className="text-sm text-gray-600">{meeting.agenda}</p>
            </div>

            <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 px-3 py-2 rounded-md">
              <AlertCircle className="w-4 h-4" />
              <span>
                {meeting.isProposedByClient
                  ? 'This meeting request expired without a response from the freelancer'
                  : 'This meeting request from the freelancer expired without your response'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiredMeetings;
