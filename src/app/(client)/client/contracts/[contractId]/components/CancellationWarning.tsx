import { AlertTriangle } from "lucide-react";

interface CancellationWarningProps {
  updatedAt: string;
}

export const CancellationWarning = ({ updatedAt }: CancellationWarningProps) => {
  const calculateDaysRemaining = () => {
    const cancellationDate = new Date(updatedAt);
    const fourDaysLater = new Date(cancellationDate);
    fourDaysLater.setDate(fourDaysLater.getDate() + 4);
    const now = new Date();
    const diffTime = fourDaysLater.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysRemaining = calculateDaysRemaining();

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 mb-2">
            Contract Cancellation in Progress
          </h3>
          <p className="text-amber-800 text-sm mb-3">
            This contract has been cancelled and is in a 4-day dispute window period. 
            The freelancer has the opportunity to raise a dispute during this time.
          </p>
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Refund Processing Timeline
              </span>
              <span className="text-sm font-semibold text-amber-700">
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              {daysRemaining > 0 
                ? `Your refund will be processed automatically after the dispute window ends.`
                : 'Dispute window has ended. Refund will be processed shortly.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
