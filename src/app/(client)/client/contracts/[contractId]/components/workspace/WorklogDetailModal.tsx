"use client";
import { useState } from 'react';
import Swal from 'sweetalert2';
import { IWorklogDetail } from '@/types/interfaces/IClientWorklog';

interface WorklogDetailModalProps {
  worklog: IWorklogDetail;
  onClose: () => void;
  onApprove: (worklogId: string, message?: string) => Promise<void>;
  onReject: (worklogId: string, message: string) => Promise<void>;
}

const WorklogDetailModal = ({
  worklog,
  onClose,
  onApprove,
  onReject,
}: WorklogDetailModalProps) => {
  const [rejectMessage, setRejectMessage] = useState('');
  const [approveMessage, setApproveMessage] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [showApproveInput, setShowApproveInput] = useState(false);
  const [processing, setProcessing] = useState(false);

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleApprove = async () => {
    if (showApproveInput) {
      setProcessing(true);
      await onApprove(worklog.worklogId, approveMessage || undefined);
      setProcessing(false);
    } else {
      setShowApproveInput(true);
      setShowRejectInput(false);
    }
  };

  const handleReject = async () => {
    if (showRejectInput) {
      if (!rejectMessage.trim()) {
        Swal.fire('Required', 'Please provide a reason for rejection', 'warning');
        return;
      }
      setProcessing(true);
      await onReject(worklog.worklogId, rejectMessage);
      setProcessing(false);
    } else {
      setShowRejectInput(true);
      setShowApproveInput(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Worklog Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Freelancer</h3>
              <p className="text-base font-semibold text-gray-800">{worklog.freelancerName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeClass(
                  worklog.status
                )}`}
              >
                {worklog.status.charAt(0).toUpperCase() + worklog.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Time Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Start Time</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(worklog.startTime)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">End Time</p>
                <p className="text-sm font-medium text-gray-800">{formatDate(worklog.endTime)}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-500">Total Duration</p>
              <p className="text-lg font-bold text-blue-600">{formatDuration(worklog.duration)}</p>
            </div>
          </div>

          {worklog.description && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{worklog.description}</p>
            </div>
          )}

          {worklog.files.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Attached Files ({worklog.files.length})</h3>
              <div className="grid grid-cols-2 gap-4">
                {worklog.files.map((file, index) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.fileName);
                  
                  return (
                    <div key={index} className="border rounded-lg overflow-hidden">
                      {isImage ? (
                        <img
                          src={file.fileUrl}
                          alt={file.fileName}
                          className="w-full h-40 object-cover cursor-pointer hover:opacity-90"
                          onClick={() => window.open(file.fileUrl, '_blank')}
                        />
                      ) : (
                        <div className="h-40 flex items-center justify-center bg-gray-100">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="p-2 bg-gray-50">
                        <p className="text-xs text-gray-600 truncate" title={file.fileName}>
                          {file.fileName}
                        </p>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {worklog.reviewMessage && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Review Message</h3>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{worklog.reviewMessage}</p>
            </div>
          )}

          {worklog.reviewedAt && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500">Reviewed At</h3>
              <p className="text-sm text-gray-700">{formatDate(worklog.reviewedAt)}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-xs text-gray-500">Submitted At</p>
            <p className="text-sm text-gray-700">{formatDate(worklog.submittedAt)}</p>
          </div>

          {worklog.disputeRaisedBy && (
            <div className="border-t pt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="text-sm font-medium text-yellow-800">Dispute Status</span>
              </div>
              <p className="text-sm text-yellow-700">
                A dispute has been raised by {worklog.disputeRaisedBy} for this worklog.
              </p>
            </div>
          )}

          {worklog.status === 'submitted' && (
            <div className="border-t pt-4 space-y-4">
              {showApproveInput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approval Message (Optional)
                  </label>
                  <textarea
                    value={approveMessage}
                    onChange={(e) => setApproveMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Add a message for the freelancer..."
                  />
                </div>
              )}

              {showRejectInput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectMessage}
                    onChange={(e) => setRejectMessage(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Provide a reason for rejection..."
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showApproveInput ? (processing ? 'Approving...' : 'Confirm Approval') : 'Approve'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={processing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showRejectInput ? (processing ? 'Rejecting...' : 'Confirm Rejection') : 'Reject'}
                </button>
              </div>

              {(showApproveInput || showRejectInput) && (
                <button
                  onClick={() => {
                    setShowApproveInput(false);
                    setShowRejectInput(false);
                    setApproveMessage('');
                    setRejectMessage('');
                  }}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export { WorklogDetailModal };
