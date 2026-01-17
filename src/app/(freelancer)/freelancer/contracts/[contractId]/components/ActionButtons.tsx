import { Star, Video } from "lucide-react";

interface ActionButtonsProps {
  status: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded' | 'disputed';
  onRateClient?: () => void;
  onCancelContract?: () => void;
  onScheduleMeeting?: () => void;
  hasReviewed?: boolean;
  canCancel?: boolean;
  isProcessing?: boolean;
}

export const ActionButtons = ({ status, onRateClient, onCancelContract, onScheduleMeeting, hasReviewed, canCancel, isProcessing }: ActionButtonsProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
        {status === 'active' && onScheduleMeeting && (
          <button
            onClick={onScheduleMeeting}
            className="w-full px-4 py-3 rounded-lg transition-colors font-medium bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center gap-2"
          >
            <Video className="w-4 h-4" />
            Schedule Meeting
          </button>
        )}
        {canCancel && onCancelContract && (
          <button
            onClick={onCancelContract}
            disabled={isProcessing}
            className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
              isProcessing
                ? 'bg-red-400 text-white cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isProcessing ? 'Cancelling...' : 'Cancel Contract'}
          </button>
        )}
        {(status === 'completed' || status === 'cancelled') && onRateClient && (
          <button
            onClick={onRateClient}
            disabled={hasReviewed}
            className={`w-full px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2 ${
              hasReviewed
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            <Star className="w-4 h-4" />
            {hasReviewed ? 'Already Reviewed' : 'Rate Client'}
          </button>
        )}
      </div>
    </div>
  );
};
