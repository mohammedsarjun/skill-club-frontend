import React from 'react';
import { Calendar, Clock, User, CheckCircle2 } from 'lucide-react';
import { IFreelancerMeetingListItem } from '@/types/interfaces/IFreelancerMeeting';

interface CompletedMeetingsProps {
  meetings: IFreelancerMeetingListItem[];
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
  getMeetingTypeBadge: (meetingType: string) => React.ReactElement;
}

const CompletedMeetings: React.FC<CompletedMeetingsProps> = ({
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
          <CheckCircle2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No Completed Meetings</h3>
        <p className="text-gray-600">You don&apos;t have any completed meetings yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Completed Meetings</h3>
        <p className="text-sm text-gray-600 mt-1">Review your past meetings with clients</p>
      </div>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.meetingId}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  {meeting.contractTitle || 'Pre-Contract Meeting'}
                </h4>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>
                    {meeting.client?.companyName || `${meeting.client?.firstName} ${meeting.client?.lastName}`}
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

            {meeting.attendance && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 rounded-md p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Your Attendance</p>
                  <p className="text-sm text-gray-900">
                    {meeting.attendance.freelancerJoined ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Attended
                      </span>
                    ) : (
                      <span className="text-red-600">Not Attended</span>
                    )}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-md p-3">
                  <p className="text-xs font-medium text-gray-700 mb-1">Client Attendance</p>
                  <p className="text-sm text-gray-900">
                    {meeting.attendance.clientJoined ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Attended
                      </span>
                    ) : (
                      <span className="text-red-600">Not Attended</span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {meeting.notes?.freelancerNotes && (
              <div className="bg-indigo-50 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700 mb-1">Your Notes:</p>
                <p className="text-sm text-gray-600">{meeting.notes.freelancerNotes}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedMeetings;
