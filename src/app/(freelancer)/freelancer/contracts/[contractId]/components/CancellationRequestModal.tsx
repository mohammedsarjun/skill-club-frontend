import { FC, useState } from 'react';
import { FaTimes, FaCheckCircle, FaGavel } from 'react-icons/fa';
import { IFreelancerCancellationRequest } from '@/types/interfaces/IFreelancerCancellationRequest';
import { formatCurrency } from '@/utils/currency';

interface CancellationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  cancellationRequest: IFreelancerCancellationRequest;
  onAccept: (responseMessage?: string) => Promise<void>;
  onRaiseDispute: (notes: string) => Promise<void>;
  isProcessing: boolean;
}

export const CancellationRequestModal: FC<CancellationRequestModalProps> = ({
  isOpen,
  onClose,
  cancellationRequest,
  onAccept,
  onRaiseDispute,
  isProcessing,
}) => {
  const [activeAction, setActiveAction] = useState<'accept' | 'dispute' | null>(null);
  const [responseMessage, setResponseMessage] = useState('');
  const [disputeNotes, setDisputeNotes] = useState('');

  if (!isOpen) return null;

  const handleAccept = async () => {
    await onAccept(responseMessage || undefined);
    handleClose();
  };

  const handleRaiseDispute = async () => {
    if (!disputeNotes.trim()) return;
    await onRaiseDispute(disputeNotes);
    handleClose();
  };

  const handleClose = () => {
    setActiveAction(null);
    setResponseMessage('');
    setDisputeNotes('');
    onClose();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Cancellation Request</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Request ID:</strong> {cancellationRequest.cancellationRequestId}
            </p>
            <p className="text-sm text-yellow-800 mt-1">
              <strong>Initiated:</strong> {formatDate(cancellationRequest.createdAt)}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reason for Cancellation</h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{cancellationRequest.reason}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Client Refund</h4>
                <p className="text-2xl font-bold text-blue-700">
                  {formatCurrency(cancellationRequest.clientAmount)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {cancellationRequest.clientSplitPercentage}% of held amount
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-sm font-semibold text-green-900 mb-2">Your Payment</h4>
                <p className="text-2xl font-bold text-green-700">
                  {formatCurrency(cancellationRequest.freelancerAmount)}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {cancellationRequest.freelancerSplitPercentage}% of held amount
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Total Held Amount</h4>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(cancellationRequest.totalHeldAmount)}
              </p>
            </div>
          </div>

          {activeAction === null && (
            <div className="space-y-3 pt-4">
              <button
                onClick={() => setActiveAction('accept')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
              >
                <FaCheckCircle />
                Accept Cancellation Proposal
              </button>
              <button
                onClick={() => setActiveAction('dispute')}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400"
              >
                <FaGavel />
                Raise Dispute
              </button>
            </div>
          )}

          {activeAction === 'accept' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Accept Cancellation</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Response Message (Optional)
                </label>
                <textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Add a message to the client (optional)"
                  disabled={isProcessing}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAccept}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Acceptance'}
                </button>
                <button
                  onClick={() => setActiveAction(null)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeAction === 'dispute' && (
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Raise Dispute</h3>
              <p className="text-sm text-gray-600">
                Provide detailed notes explaining why you disagree with this cancellation proposal. An admin will review your dispute.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dispute Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Explain why you disagree with this cancellation proposal..."
                  disabled={isProcessing}
                  required
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleRaiseDispute}
                  disabled={isProcessing || !disputeNotes.trim()}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:bg-gray-400"
                >
                  {isProcessing ? 'Processing...' : 'Raise Dispute'}
                </button>
                <button
                  onClick={() => setActiveAction(null)}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
