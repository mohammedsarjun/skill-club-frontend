import { FC } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

interface FreelancerCancellationRequestAlertProps {
  onViewDetails: () => void;
}

export const FreelancerCancellationRequestAlert: FC<FreelancerCancellationRequestAlertProps> = ({ onViewDetails }) => {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Cancellation Request Received
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            The client has initiated a cancellation process for this contract and has proposed a cancellation request. 
            You can either accept their decision or raise a dispute.
          </p>
          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
          >
            View Cancellation Request
          </button>
        </div>
      </div>
    </div>
  );
};
