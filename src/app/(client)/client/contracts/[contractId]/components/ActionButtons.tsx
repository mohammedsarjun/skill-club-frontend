import { Calendar } from "lucide-react";

interface ActionButtonsProps {
  contractType: 'fixed' | 'hourly' | 'fixed_with_milestones';
  status: 'pending_funding' | 'held' | 'active' | 'completed' | 'cancelled' | 'refunded';
  onFundContract: () => void;
  onCancelContract: () => void;
  onScheduleMeeting?: () => void;
  onReviewFreelancer?: () => void;
  isProcessing?: boolean;
  canCancel?: boolean;
  hasReviewed?: boolean;
}

export const ActionButtons = ({ contractType,status, onFundContract, onCancelContract, onScheduleMeeting, onReviewFreelancer, isProcessing, canCancel, hasReviewed }: ActionButtonsProps) => {


  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
      {(
  status === 'pending_funding' ||
  status === 'held' ||
  contractType === 'fixed_with_milestones' ||
  (
    contractType === 'hourly' &&
    status !== 'cancelled' &&
    status !== 'completed'
  )
) && (
  <button
    onClick={onFundContract}
    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
  >
    Fund Contract
  </button>
)}

        
        {(status === 'active') && onScheduleMeeting && (
          <button
            onClick={onScheduleMeeting}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </button>
        )}
        {canCancel && (
        <button
          onClick={onCancelContract}
          disabled={isProcessing}
          className={`w-full px-4 py-3 text-white rounded-lg transition-colors font-medium ${isProcessing ? 'bg-red-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'}`}
        >
          {isProcessing ? 'Cancelling...' : 'Cancel Contract'}
        </button>)}
        {(status === 'completed' || status === 'cancelled') && onReviewFreelancer && (
          <button
            onClick={onReviewFreelancer}
            disabled={hasReviewed}
            className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
              hasReviewed
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {hasReviewed ? 'Already Reviewed' : 'Review Freelancer'}
          </button>
        )}
      </div>
    </div>
  );
};
