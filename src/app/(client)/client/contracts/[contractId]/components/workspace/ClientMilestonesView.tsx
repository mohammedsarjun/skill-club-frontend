"use client";
import { useState } from "react";
import { FaCheckCircle, FaClock, FaWallet, FaFile } from "react-icons/fa";
import { IMilestoneDeliverable } from "@/types/interfaces/IContractWorkspace";
import { formatCurrency } from "@/utils/currency";
import { clientActionApi } from "@/api/action/ClientActionApi";
import { set } from "lodash";
import ClientMilestoneDetail from "./ClientMilestoneDetail";
import { IClientContractDetail } from "@/types/interfaces/IClientContractDetail";

interface Milestone {
  milestoneId?: string;
  title: string;
  description: string;
  expectedDelivery?: string;
  amount: number;
  status: "pending" | "funded" | "submitted" | "approved" | "paid";
  deliverable?: IMilestoneDeliverable;
}

interface ClientMilestonesViewProps {
  contractId: string;
  milestones: Milestone[];
  currencySymbol: string;
  onApproveMilestoneDeliverable: (
    milestoneId: string,
    deliverableId: string
  ) => Promise<void>;
  onRequestMilestoneChanges: (
    milestoneId: string,
    deliverableId: string,
    feedback: string
  ) => Promise<void>;
  onRespondToMilestoneExtension?: (
    milestoneId: string,
    approved: boolean,
    responseMessage?: string
  ) => Promise<void>;
  onSuccess: () => void;
  formatDate: (dateString: string) => string;
}

export const ClientMilestonesView = ({
  contractId,
  milestones,
  currencySymbol,
  onApproveMilestoneDeliverable,
  onRequestMilestoneChanges,
  onRespondToMilestoneExtension,
  onSuccess,
  formatDate,
}: ClientMilestonesViewProps) => {
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(
    null
  );
  const [selectedMilestoneDetail, setSelectedMilestoneDetail] =
    useState<NonNullable<IClientContractDetail["milestones"]>[number] | null>(null);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const handleApproveDeliverable = async (deliverableId: string) => {

    console.log(selectedMilestoneDetail)
    if (selectedMilestoneDetail?.id) {
      await onApproveMilestoneDeliverable(
        selectedMilestoneDetail.id,
        deliverableId
      );
    }
  };

  const handleRequestChanges = async (deliverableId: string, feedback: string) => {
    if (selectedMilestoneDetail?.id) {
      await onRequestMilestoneChanges(
        selectedMilestoneDetail.id,
        deliverableId,
        feedback
      );
    }
  };

  const handleRespondToExtension = async (approved: boolean, responseMessage?: string) => {
    if (selectedMilestoneDetail?.id && onRespondToMilestoneExtension) {
      await onRespondToMilestoneExtension(
        selectedMilestoneDetail.id,
        approved,
        responseMessage
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            Pending
          </span>
        );
      case "funded":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            Funded
          </span>
        );
      case "submitted":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            Awaiting Review
          </span>
        );
      case "approved":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Approved
          </span>
        );
      case "paid":
        return (
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
            Paid
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "cancelled":
        return "border-red-200 text-red-700 bg-red-100";
      case "funded":
        return "border-blue-200 text-blue-700 bg-blue-50";
      case "submitted":
        return "border-orange-200 text-orange-700 bg-orange-50";
      case "approved":
        return "border-green-200 text-green-700 bg-green-50";
      case "paid":
        return "border-emerald-200 text-emerald-700 bg-emerald-50";
      case "changes_requested":
        return "border-yellow-200 text-yellow-700 bg-yellow-50";
      default:
        return "border-gray-200 text-gray-700 bg-gray-100";
    }
  };

  async function fetchMilestoneDetail(
    contractId: string,
    milestoneId: string | undefined
  ) {
    if (!milestoneId) return;
    // Fetch milestone detail from API
    try {
      const response = await clientActionApi.getMilestoneDetail(
        contractId,
        milestoneId
      );
      return response.data;
      // setSelectedMilestoneDetail(data);
    } catch (error) {
      console.error("Error fetching milestone detail:", error);
    }
  }

  async function showMilestoneDetail(milestoneId: string | undefined) {
   const milestoneRespone = await fetchMilestoneDetail(contractId, milestoneId);
   setSelectedMilestoneDetail(milestoneRespone);
    setIsMilestoneModalOpen(true);
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Milestones</h2>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            onClick={() => showMilestoneDetail(milestone.milestoneId)}
            key={milestone.milestoneId}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {index + 1}. {milestone.title}
                </h3>
              </div>
              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                  milestone.status
                )}`}
              >
                {milestone.status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Due:{" "}
                <span className="font-medium text-gray-900">
                  {formatDate(milestone.expectedDelivery as string)}
                </span>
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(milestone.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
       {isMilestoneModalOpen && selectedMilestoneDetail && (
        <ClientMilestoneDetail
          contractId={contractId}
          milestone={selectedMilestoneDetail}
          onClose={() => setIsMilestoneModalOpen(false)}
          onApprove={handleApproveDeliverable}
          onRequestChanges={handleRequestChanges}
          onSuccess={onSuccess}
          onRespondToExtension={handleRespondToExtension}
        />
      )}
    </div>

   
  );
};
