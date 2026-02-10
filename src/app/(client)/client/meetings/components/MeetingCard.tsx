import React from 'react';
import { IClientMeetingListItem } from '@/types/interfaces/IClientMeeting';

interface MeetingCardProps {
  meeting: IClientMeetingListItem;
  currentUserRole: string;
  onAccept: (meetingId: string) => void;
  onReject: (meetingId: string) => void;
  onJoin: (meetingId: string) => void;
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
}

const MeetingCard: React.FC<MeetingCardProps> = ({
  meeting,
  currentUserRole,
  onAccept,
  onReject,
  onJoin,
  formatDate,
  formatTime,
  getStatusBadge,
}) => {
  const getOtherParty = () => {
    return currentUserRole === 'client' ? meeting.freelancer : null;
  };

  const otherParty = getOtherParty();
  const displayName = otherParty
    ? `${otherParty.firstName || ''} ${otherParty.lastName || ''}`.trim()
    : 'Unknown';

  const avatarUrl = otherParty?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

  return (
    <div className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-gray-900">{displayName}</h4>
              <span className="text-xs text-gray-500">requested a meeting</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">{meeting.contractTitle}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3 flex-wrap">
              <div className="flex items-center gap-1">
                <i className="fas fa-calendar text-gray-400"></i>
                <span>{formatDate(meeting.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-clock text-gray-400"></i>
                <span>{formatTime(meeting.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-hourglass-half text-gray-400"></i>
                <span>{meeting.durationMinutes} minutes</span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Agenda:</span> {meeting.agenda}
              </p>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <i className="fas fa-info-circle"></i>
              <span>
                {meeting.meetingType === 'pre-contract' ? 'Pre-contract discussion' : 'Project meeting'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
        {meeting.status === 'proposed' && (
          <>
            <button
              onClick={() => onAccept(meeting.meetingId)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-check"></i>
              Accept Meeting
            </button>
            <button
              onClick={() => onReject(meeting.meetingId)}
              className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-4 py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
            >
              <i className="fas fa-times"></i>
              Decline
            </button>
            <button
              className="px-4 py-2.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              title="Propose new time"
            >
              <i className="fas fa-calendar-alt"></i>
            </button>
          </>
        )}
        {meeting.status === 'ongoing' && (
          <button
            onClick={() => onJoin(meeting.meetingId)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            <i className="fas fa-video"></i>
            Join Now
          </button>
        )}
        {meeting.status === 'accepted' && (
          <div className="w-full text-center py-2">
            {getStatusBadge(meeting.status)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
