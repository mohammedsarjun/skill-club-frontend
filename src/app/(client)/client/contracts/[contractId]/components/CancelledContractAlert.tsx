import { AlertCircle, Info } from "lucide-react";

interface CancelledContractAlertProps {
  cancelledBy: 'client' | 'freelancer';
  status: 'cancelled' | 'disputed';
  hasActiveCancellationDisputeWindow?: boolean;
}

export const CancelledContractAlert = ({ cancelledBy, status,hasActiveCancellationDisputeWindow }: CancelledContractAlertProps) => {
  if (cancelledBy === 'client' && status === 'cancelled') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Contract Cancelled</h4>
            <p className="text-sm text-blue-800">
              You have canceled the contract. {hasActiveCancellationDisputeWindow ? `The contract is now in a 5-day dispute window. 
              If the freelancer raises a dispute during this period, the admin will decide how 
              the funds are handled. Otherwise, the full amount will be refunded.` : ''}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cancelledBy === 'client' && status === 'disputed') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">Dispute Raised</h4>
            <p className="text-sm text-yellow-800">
              The freelancer has raised a dispute. The admin will resolve it within 3–5 business 
              days and notify you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cancelledBy === 'freelancer' && status === 'cancelled') {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-1">Freelancer Cancelled Contract</h4>
            <p className="text-sm text-orange-800">
              The freelancer has cancelled this contract.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export const CancelledContractAlertWithoutFunded = ({ cancelledBy, status }: CancelledContractAlertProps) => {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Contract Cancelled</h4>
            <p className="text-sm text-blue-800">
              You have canceled the contract. The contract is now in a 5-day dispute window. 
              If the freelancer raises a dispute during this period, the admin will decide how 
              the funds are handled. Otherwise, the full amount will be refunded.
            </p>
          </div>
        </div>
      </div>
    );
  }


