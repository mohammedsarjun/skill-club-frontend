import React from 'react';
import { IClientMeetingListItem } from '@/types/interfaces/IClientMeeting';

interface TodayMeetingsProps {
  meetings: IClientMeetingListItem[];
  ongoingMeetings: IClientMeetingListItem[];
  currentUserRole: string;
  onJoin: (meetingId: string) => void;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
  getMeetingTypeBadge: (meetingType: string) => React.ReactElement;
}

const TodayMeetings: React.FC<TodayMeetingsProps> = ({
  meetings,
  ongoingMeetings,
  currentUserRole,
  onJoin,
  formatTime,
  getStatusBadge,
  getMeetingTypeBadge,
}) => {
  const getOtherParty = (meeting: IClientMeetingListItem) => {
    return currentUserRole === 'client' ? meeting.freelancer : null;
  };

  return (
    <div>
      {ongoingMeetings.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ongoing Now</h3>
          {ongoingMeetings.map((meeting) => {
            const otherParty = getOtherParty(meeting);
            const displayName = otherParty
              ? `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim()
              : 'Unknown';
            const avatarUrl = otherParty?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

            return (
              <div
                key={meeting.meetingId}
                className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <span className="w-3 h-3 bg-green-500 rounded-full inline-block animate-pulse"></span>
                    </div>
                    <img src={avatarUrl} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{meeting.agenda}</h4>
                      <p className="text-sm text-gray-600">with {displayName}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onJoin(meeting.meetingId)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
                  >
                    <i className="fas fa-video"></i>
                    Join Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today&apos;s Schedule</h3>
      {meetings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-calendar-day text-5xl mb-3 text-gray-300"></i>
          <p className="text-lg">No meetings scheduled for today</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                  {currentUserRole === 'client' ? 'Freelancer' : 'Client'}
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Project</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Agenda</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((meeting) => {
                const otherParty = getOtherParty(meeting);
                const displayName = otherParty
                  ? `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim()
                  : 'Unknown';
                const avatarUrl = otherParty?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

                return (
                  <tr key={meeting.meetingId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="py-4 px-4">
                      <div className="text-sm font-medium text-gray-900">{formatTime(meeting.scheduledAt)}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                        <span className="text-sm text-gray-900">{displayName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{meeting.contractTitle}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{meeting.agenda}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{meeting.durationMinutes} min</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        {getStatusBadge(meeting.status)}
                        {getMeetingTypeBadge(meeting.meetingType)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TodayMeetings;
