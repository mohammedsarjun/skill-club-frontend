import React from 'react';
import { IFreelancerMeetingDetail } from '@/types/interfaces/IFreelancerMeeting';
import { FaTimes, FaVideo, FaCalendar, FaClock, FaBuilding, FaFileAlt } from 'react-icons/fa';

interface Props {
  meeting: IFreelancerMeetingDetail | null;
  onClose: () => void;
  onAccept: (meetingId: string) => void;
  onReschedule: (meetingId: string, proposedTime: string) => void;
}

export function MeetingDetailModal({ meeting, onClose, onAccept, onReschedule }: Props) {
  const [proposedTime, setProposedTime] = React.useState('');
  const [showRescheduleForm, setShowRescheduleForm] = React.useState(false);

  if (!meeting) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'proposed':
        return 'bg-amber-100 text-amber-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'reschedule_requested':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAcceptClick = () => {
    onAccept(meeting.meetingId);
    onClose();
  };

  const handleRescheduleSubmit = () => {
    if (proposedTime) {
      onReschedule(meeting.meetingId, proposedTime);
      setShowRescheduleForm(false);
      setProposedTime('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Meeting Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{meeting.contractTitle}</h3>
              <p className="text-sm text-gray-500 mt-1">Contract ID: {meeting.contractId}</p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(meeting.status)}`}>
              {meeting.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FaCalendar className="text-blue-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-600">Scheduled At</p>
                <p className="text-gray-800 font-semibold">
                  {new Date(meeting.scheduledAt).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FaClock className="text-green-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-600">Duration</p>
                <p className="text-gray-800 font-semibold">{meeting.durationMinutes} minutes</p>
              </div>
            </div>

            {meeting.client && (
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <FaBuilding className="text-purple-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Client</p>
                  <p className="text-gray-800 font-semibold">
                    {meeting.client.companyName || `${meeting.client.firstName} ${meeting.client.lastName}`}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <FaFileAlt className="text-orange-600 mt-1" />
              <div>
                <p className="text-sm font-medium text-gray-600">Type</p>
                <p className="text-gray-800 font-semibold capitalize">{meeting.type}</p>
              </div>
            </div>
          </div>

          {meeting.meetingLink && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaVideo className="text-blue-600" />
                <p className="font-medium text-gray-800">Meeting Link</p>
              </div>
              <a
                href={meeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline break-all"
              >
                {meeting.meetingLink}
              </a>
            </div>
          )}

          {meeting.milestoneId && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="font-medium text-gray-800 mb-1">Milestone</p>
              <p className="text-gray-700">{meeting.milestoneTitle}</p>
              {meeting.milestoneAmount && (
                <p className="text-sm text-gray-600 mt-1">Amount: ${meeting.milestoneAmount}</p>
              )}
            </div>
          )}

          {meeting.deliverableId && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="font-medium text-gray-800 mb-1">Deliverable</p>
              <p className="text-gray-700">Version {meeting.deliverableVersion || 1}</p>
            </div>
          )}

          {meeting.rescheduleProposedTime && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="font-medium text-gray-800 mb-1">Reschedule Proposed Time</p>
              <p className="text-gray-700">
                {new Date(meeting.rescheduleProposedTime).toLocaleString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}

          {meeting.notes?.clientNotes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">Client Notes</p>
              <p className="text-gray-700">{meeting.notes.clientNotes}</p>
            </div>
          )}

          {meeting.notes?.freelancerNotes && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-gray-800 mb-2">Your Notes</p>
              <p className="text-gray-700">{meeting.notes.freelancerNotes}</p>
            </div>
          )}

          {showRescheduleForm && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-3">
              <p className="font-medium text-gray-800">Propose New Time</p>
              <input
                type="datetime-local"
                value={proposedTime}
                onChange={(e) => setProposedTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleRescheduleSubmit}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Submit Reschedule
                </button>
                <button
                  onClick={() => {
                    setShowRescheduleForm(false);
                    setProposedTime('');
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {meeting.status === 'proposed' && (
              <button
                onClick={handleAcceptClick}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Accept Meeting
              </button>
            )}
            {(meeting.status === 'proposed' || meeting.status === 'accepted') && (
              <button
                onClick={() => setShowRescheduleForm(!showRescheduleForm)}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Request Reschedule
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
