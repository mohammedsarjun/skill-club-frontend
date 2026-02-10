import React from 'react';
import { Calendar, Clock, User, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { IFreelancerMeetingListItem } from '@/types/interfaces/IFreelancerMeeting';

interface RescheduledRequestsProps {
  meetings: IFreelancerMeetingListItem[];
  onApprove: (meetingId: string) => void;
  onDecline: (meetingId: string) => void;
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
  getMeetingTypeBadge: (meetingType: string) => React.ReactElement;
}

const RescheduledRequests: React.FC<RescheduledRequestsProps> = ({
  meetings,
  onApprove,
  onDecline,
  formatDate,
  formatTime,
  getStatusBadge,
  getMeetingTypeBadge,
}) => {
  if (meetings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <RefreshCw className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Reschedule Requests</h3>
        <p className="text-gray-600">There are no pending reschedule requests for your meetings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Reschedule Requests</h3>
        <p className="text-sm text-gray-600 mt-1">Review meeting reschedule requests from clients</p>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => {
          const isRequestedByClient = meeting.rescheduleRequestedBy === 'client';

          return (
            <div
              key={meeting.meetingId}
              className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{meeting.contractTitle}</h4>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      <RefreshCw className="w-3 h-3" />
                      Reschedule Request
                    </span>
                  </div>
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
                <p className="text-sm font-medium text-red-900 mb-2">Original Schedule:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-red-700">
                    <Calendar className="w-4 h-4" />
                    <span className="line-through">{formatDate(meeting.scheduledAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-red-700">
                    <Clock className="w-4 h-4" />
                    <span className="line-through">{formatTime(meeting.scheduledAt)}</span>
                  </div>
                </div>
              </div>

              {meeting.rescheduleProposedTime && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
                  <p className="text-sm font-medium text-green-900 mb-2">Proposed New Schedule:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{formatDate(meeting.rescheduleProposedTime)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatTime(meeting.rescheduleProposedTime)} ({meeting.durationMinutes} minutes)
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Agenda:</p>
                <p className="text-sm text-gray-600">{meeting.agenda}</p>
              </div>

              {isRequestedByClient && meeting.status === 'rescheduled_requested' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => onApprove(meeting.meetingId)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept New Time
                  </button>
                  <button
                    onClick={() => onDecline(meeting.meetingId)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Decline
                  </button>
                </div>
              )}

              {!isRequestedByClient && (
                <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md">
                  <Clock className="w-4 h-4" />
                  <span>Waiting for client to respond to your reschedule request</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RescheduledRequests;
