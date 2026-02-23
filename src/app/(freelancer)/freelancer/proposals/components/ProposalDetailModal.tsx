"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IFreelancerProposal } from "@/types/interfaces/IProposal";
import { formatCurrency } from "@/utils/currency";

interface ProposalDetailModalProps {
  proposal: IFreelancerProposal | null;
  isOpen: boolean;
  onClose: () => void;
  onViewJob: (jobId: string) => void;
}

const statusLabelMap: Record<IFreelancerProposal["status"], string> = {
  pending_verification: "Pending Review",
  offer_sent: "Offer Sent",
  rejected: "Rejected",
};

const statusColorMap: Record<IFreelancerProposal["status"], string> = {
  pending_verification: "text-yellow-700 bg-yellow-50 border border-yellow-200",
  offer_sent: "text-green-700 bg-green-50 border border-green-200",
  rejected: "text-red-700 bg-red-50 border border-red-200",
};

export default function ProposalDetailModal({
  proposal,
  isOpen,
  onClose,
  onViewJob,
}: ProposalDetailModalProps) {
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
          {proposal && (
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {proposal.jobDetail.title}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Submitted on {new Date(proposal.proposedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[proposal.status]}`}>
                  {statusLabelMap[proposal.status]}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {proposal.proposedBudget ? (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Fixed Budget</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(proposal.proposedBudget)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Deadline</p>
                      <p className="font-semibold text-gray-900">
                        {proposal.deadline
                          ? new Date(proposal.deadline).toLocaleDateString()
                          : "—"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
                      <p className="font-semibold text-gray-900">
                        {proposal.hourlyRate
                          ? `${formatCurrency(proposal.hourlyRate)}/hr`
                          : "—"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Available Hours / Week</p>
                      <p className="font-semibold text-gray-900">
                        {proposal.availableHoursPerWeek ?? "—"} hrs
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm whitespace-pre-wrap">
                  {proposal.coverLetter}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => onViewJob(proposal.jobDetail._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  View Job Post
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
