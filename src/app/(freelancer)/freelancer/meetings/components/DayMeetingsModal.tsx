import React, { useMemo } from 'react';
import { IFreelancerMeetingListItem } from '@/types/interfaces/IFreelancerMeeting';
import { X } from 'lucide-react';

interface DayMeetingsModalProps {
  isOpen: boolean;
  selectedDate: string | null;
  meetings: IFreelancerMeetingListItem[];
  currentUserRole: string;
  onClose: () => void;
  onAccept: (meetingId: string) => void;
  onReject: (meetingId: string) => void;
  onJoin: (meetingId: string) => void;
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string) => string;
  getStatusBadge: (status: string) => React.ReactElement;
  getMeetingTypeBadge: (meetingType: string) => React.ReactElement;
}

const DayMeetingsModal: React.FC<DayMeetingsModalProps> = ({
  isOpen,
  selectedDate,
  meetings,
  currentUserRole,
  onClose,
  onAccept,
  onReject,
  onJoin,
  formatDate,
  formatTime,
  getStatusBadge,
  getMeetingTypeBadge,
}) => {
  const dayMeetings = useMemo(() => {
    if (!selectedDate) return [];
    return meetings.filter((meeting) => {
      const date = new Date(meeting.scheduledAt);
      const meetingDateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      return meetingDateKey === selectedDate;
    });
  }, [selectedDate, meetings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">
            {selectedDate ? formatDate(selectedDate) : ''}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-88px)]">
          {dayMeetings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-calendar-times text-4xl mb-2 text-gray-300"></i>
              <p>No meetings scheduled for this day</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayMeetings.map((meeting) => {
                const client = meeting.client;
                const displayName = client
                  ? client.companyName || `${client.firstName || ''} ${client.lastName || ''}`.trim()
                  : 'Unknown';
                const avatarUrl = client?.logo || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=3b82f6&color=fff`;

                return (
                  <div
                    key={meeting.meetingId}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarUrl}
                          alt={displayName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{displayName}</h4>
                          <p className="text-sm text-gray-500">{meeting.contractTitle}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(meeting.status)}
                        {getMeetingTypeBadge(meeting.meetingType)}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-700">
                        <i className="fas fa-clock w-4"></i>
                        <span>
                          {formatTime(meeting.scheduledAt)} - {meeting.durationMinutes} minutes
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-gray-700">
                        <i className="fas fa-align-left w-4 mt-1"></i>
                        <span>{meeting.agenda}</span>
                      </div>
                    </div>
                    {meeting.status === 'ongoing' && (
                      <button
                        onClick={() => {
                          onJoin(meeting.meetingId);
                          onClose();
                        }}
                        className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        <i className="fas fa-video mr-2"></i>Join Meeting
                      </button>
                    )}
                    {meeting.status === 'proposed' && meeting.isProposedByFreelancer === false && (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => {
                            onAccept(meeting.meetingId);
                            onClose();
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => {
                            onReject(meeting.meetingId);
                            onClose();
                          }}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {meeting.status === 'proposed' && meeting.isProposedByFreelancer === true && (
                      <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-md mt-4">
                        <i className="fas fa-clock"></i>
                        <span>Waiting for client to respond</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayMeetingsModal;
