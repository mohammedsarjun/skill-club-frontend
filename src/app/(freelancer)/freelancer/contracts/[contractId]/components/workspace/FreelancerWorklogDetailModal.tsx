"use client";
import { X, Download, Clock, Calendar, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { IFreelancerWorklogDetail } from '@/types/interfaces/IFreelancerWorklog';
import { formatDateTime } from '@/utils/formatDate';

interface FreelancerWorklogDetailModalProps {
  worklog: IFreelancerWorklogDetail;
  onClose: () => void;
  onRaiseDispute: (worklogId: string) => void;
}

const FreelancerWorklogDetailModal = ({ worklog, onClose, onRaiseDispute }: FreelancerWorklogDetailModalProps) => {
  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => formatDateTime(dateString);

  const canRaiseDispute = () => {
    if (worklog.status !== 'rejected') return false;
    if (worklog.disputeRaisedBy) return false;
    if (!worklog.disputeWindowEndsAt) return false;
    const windowEndDate = new Date(worklog.disputeWindowEndsAt);
    return new Date() <= windowEndDate;
  };

  const getStatusBadge = () => {
    const statusConfig = {
      submitted: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle },
    };

    const config = statusConfig[worklog.status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg} ${config.text} text-sm font-medium`}>
        <Icon className="w-4 h-4" />
        {worklog.status.charAt(0).toUpperCase() + worklog.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">Worklog Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <div className="mt-1">{getStatusBadge()}</div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-2xl font-bold text-blue-600">{formatDuration(worklog.duration)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Start Time</span>
              </div>
              <p className="text-gray-800 font-medium">{formatDate(worklog.startTime)}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">End Time</span>
              </div>
              <p className="text-gray-800 font-medium">{formatDate(worklog.endTime)}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Clock className="w-5 h-5" />
              <span className="text-sm font-medium">Submitted At</span>
            </div>
            <p className="text-gray-800 font-medium">{formatDate(worklog.submittedAt)}</p>
          </div>

          {worklog.description && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Description</span>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{worklog.description}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-3">
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">Proof of Work Files ({worklog.files.length})</span>
            </div>
            <div className="space-y-2">
              {worklog.files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm text-gray-700 truncate">{file.fileName}</span>
                  </div>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </a>
                </div>
              ))}
            </div>
          </div>

          {worklog.reviewedAt && (
            <div className={`rounded-lg p-4 ${
              worklog.status === 'approved' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {worklog.status === 'approved' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                )}
                <span className={`text-sm font-medium ${
                  worklog.status === 'approved' ? 'text-green-800' : 'text-red-800'
                }`}>
                  Review Feedback
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                Reviewed on {formatDate(worklog.reviewedAt)}
              </p>
              {worklog.reviewMessage && (
                <p className={`text-sm ${
                  worklog.status === 'approved' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {worklog.reviewMessage}
                </p>
              )}
            </div>
          )}

          {worklog.disputeRaisedBy && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Dispute Status</span>
              </div>
              <p className="text-sm text-yellow-700">
                A dispute has been raised by {worklog.disputeRaisedBy} for this worklog.
              </p>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          {canRaiseDispute() && (
            <button
              onClick={() => onRaiseDispute(worklog.worklogId)}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors mb-3"
            >
              Raise Dispute
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export { FreelancerWorklogDetailModal };
