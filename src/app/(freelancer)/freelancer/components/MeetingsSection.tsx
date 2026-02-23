import React from 'react';
import { Video, Calendar } from 'lucide-react';
import { IFreelancerMeeting } from '@/types/interfaces/IFreelancerDashboard';
import { formatDate } from '@/utils/formatDate';

interface MeetingsSectionProps {
  meetings: IFreelancerMeeting[];
  onJoinMeeting: (meetingId: string, channelName: string) => void;
}

export const MeetingsSection: React.FC<MeetingsSectionProps> = ({ meetings, onJoinMeeting }) => {

  return (
    <div className="lg:col-span-2 bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-500" />
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Meetings</h2>
          </div>
          <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
            {meetings.length} scheduled
          </span>
        </div>
      </div>
      <div className="p-6">
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No upcoming meetings</div>
        ) : (
          <div className="space-y-4">
            {meetings.map((meeting) => (
              <div
                key={meeting.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${
                      meeting.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{meeting.project}</p>
                    {/* <p className="text-sm text-gray-600">with {meeting.client}</p> */}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(meeting.date)} at {meeting.time}
                    </p>
                  </div>
                </div>
                {meeting.status === 'ongoing' ? (
                  <button
                    onClick={() => onJoinMeeting(meeting.id, meeting.channelName)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Join Now
                  </button>
                ) : (
                  <span className="text-sm text-gray-500">Upcoming</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
