import { ContractMilestone } from "@/types/interfaces/IContract";
import { IFreelancerContractDetail } from '@/types/interfaces/IFreelancerContractDetail';
import { AlertCircle, Info } from "lucide-react";
import { useEffect } from "react";

type FreelancerMilestone = NonNullable<IFreelancerContractDetail['milestones']>[number];

interface FreelancerCancelledContractAlertProps {
  cancelledBy: "client" | "freelancer";
  status: "cancelled" | "disputed";
  onRaiseDispute?: () => void;
  hasActiveCancellationDisputeWindow?: boolean;
  milestoneData?: ContractMilestone | FreelancerMilestone | null;
}

export const FreelancerCancelledContractAlert = ({
  cancelledBy,
  status,
  onRaiseDispute,
  hasActiveCancellationDisputeWindow,
  milestoneData
}: FreelancerCancelledContractAlertProps) => {

  console.log(milestoneData)
  
  if (cancelledBy === "client" && status === "cancelled") {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-orange-900 mb-1">
              Contract Cancelled by Client
            </h4>
            {hasActiveCancellationDisputeWindow && (
              <>
                <p className="text-sm text-orange-800 mb-3">
                  The client has canceled the contract. If you have any
                  objections to the client's action, you may raise a dispute.
                </p>

                {onRaiseDispute && (
                  <button
                    onClick={() => onRaiseDispute()}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                  >
                    Raise Dispute
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (cancelledBy === "client" && status === "disputed") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Dispute Raised</h4>
            <p className="text-sm text-blue-800">
              You have raised a dispute. The admin will resolve it within 3–5
              business days and notify you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cancelledBy === "freelancer" && status === "cancelled") {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">
              You Cancelled This Contract
            </h4>
            <p className="text-sm text-blue-800">
              You have cancelled this contract.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
