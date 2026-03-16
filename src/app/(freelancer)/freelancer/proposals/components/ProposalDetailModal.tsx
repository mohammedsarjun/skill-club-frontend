"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { IFreelancerProposal } from "@/types/interfaces/IProposal";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/formatDate";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";

interface ProposalDetailModalProps {
  proposal: IFreelancerProposal | null;
  allProposals: IFreelancerProposal[];
  isOpen: boolean;
  onClose: () => void;
  onViewJob: (jobId: string) => void;
  setProposals: React.Dispatch<React.SetStateAction<IFreelancerProposal[]>>;
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
  allProposals,
  isOpen,
  onClose,
  onViewJob,
  setProposals,
}: ProposalDetailModalProps) {
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rate, setRate] = useState<number | "">("");
  const [updating, setUpdating] = useState(false);
  const [currentProposalId, setCurrentProposalId] = useState<string | null>(null);
  const rateInputRef = useRef<HTMLInputElement>(null);

  // Fix #2: Re-sync formProposals whenever the proposal prop changes
  const [formProposals, setFormProposals] = useState<IFreelancerProposal | null>(proposal);

  useEffect(() => {
    if (proposal) {
      setFormProposals(proposal);
    }
  }, [proposal]);

  // Fix #4: Sync rate/budget from allProposals, with correct dependencies
  useEffect(() => {
    if (!formProposals) return;
    const current = allProposals.find((p) => p.proposalId === formProposals.proposalId);
    if (!current) return;

    setFormProposals((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        hourlyRate: prev.hourlyRate !== undefined ? current.hourlyRate : prev.hourlyRate,
        proposedBudget: prev.proposedBudget !== undefined ? current.proposedBudget : prev.proposedBudget,
      };
    });
  }, [allProposals, formProposals?.proposalId]);

  // Focus rate input when rate modal opens
  useEffect(() => {
    if (isRateModalOpen && rateInputRef.current) {
      rateInputRef.current.focus();
    }
  }, [isRateModalOpen]);

  function handleEditProposal(proposalId: string, currentRate?: number) {
    setCurrentProposalId(proposalId);
    setRate(currentRate ?? "");
    setIsRateModalOpen(true);
  }

  async function handleRateUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!currentProposalId || rate === "" || isNaN(Number(rate))) {
      toast.error("Please enter a valid rate");
      return;
    }
    setUpdating(true);
    try {
      const response = await freelancerActionApi.updateProposal(
        currentProposalId,
        Number(rate)
      );
      if (response.success) {
        toast.success("Rate updated successfully");

        const newRate = Number(rate);

        // Update parent proposals list
        setProposals((prev) =>
          prev.map((p) =>
            p.proposalId === currentProposalId
              ? {
                  ...p,
                  hourlyRate: p.hourlyRate !== undefined ? newRate : p.hourlyRate,
                  proposedBudget: p.proposedBudget !== undefined ? newRate : p.proposedBudget,
                }
              : p
          )
        );

        // Fix #3: Also update local formProposals so the modal reflects the new rate immediately
        setFormProposals((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            hourlyRate: prev.hourlyRate !== undefined ? newRate : prev.hourlyRate,
            proposedBudget: prev.proposedBudget !== undefined ? newRate : prev.proposedBudget,
          };
        });

        setIsRateModalOpen(false);
      } else {
        toast.error(response.message || "Failed to update rate");
      }
    } catch {
      toast.error("Error updating rate");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      {/* Fix #1: Rate Edit Modal is a sibling Dialog.Root, NOT nested inside the outer one */}
      <DialogPrimitive.Root open={isRateModalOpen} onOpenChange={setIsRateModalOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-black/40" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-[101] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg focus:outline-none">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setIsRateModalOpen(false)}
              disabled={updating}
              aria-label="Close modal"
            >
              &times;
            </button>
            <DialogPrimitive.Title asChild>
              <h3 className="text-lg font-semibold mb-4">Edit Proposal Rate</h3>
            </DialogPrimitive.Title>
            <DialogPrimitive.Description asChild>
              <p className="text-sm text-gray-500 mb-2">
                Update your proposal rate below.
              </p>
            </DialogPrimitive.Description>
            <form onSubmit={handleRateUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">New Rate</label>
                <input
                  ref={rateInputRef}
                  type="number"
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
                  value={rate}
                  min={1}
                  step={1}
                  onChange={(e) =>
                    setRate(e.target.value === "" ? "" : Number(e.target.value))
                  }
                  disabled={updating}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded text-gray-700 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setIsRateModalOpen(false)}
                  disabled={updating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                  disabled={updating}
                >
                  {updating ? "Updating..." : "Update Rate"}
                </button>
              </div>
            </form>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>

      {/* Main Proposal Detail Dialog */}
      <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-40" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-6 shadow-lg">
            {formProposals && (
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <DialogPrimitive.Title asChild>
                      <h2 className="text-xl font-bold text-gray-900">
                        {formProposals.jobDetail.title}
                      </h2>
                    </DialogPrimitive.Title>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted on {formatDate(formProposals.proposedAt)}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColorMap[formProposals.status]}`}
                  >
                    {statusLabelMap[formProposals.status]}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {formProposals.proposedBudget ? (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Fixed Budget</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(formProposals.proposedBudget)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Deadline</p>
                        <p className="font-semibold text-gray-900">
                          {formProposals.deadline ? formatDate(formProposals.deadline) : "—"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">Hourly Rate</p>
                        <p className="font-semibold text-gray-900">
                          {formProposals.hourlyRate
                            ? `${formatCurrency(formProposals.hourlyRate)}/hr`
                            : "—"}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">
                          Available Hours / Week
                        </p>
                        <p className="font-semibold text-gray-900">
                          {formProposals.availableHoursPerWeek ?? "—"} hrs
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                  <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm whitespace-pre-wrap">
                    {formProposals.coverLetter}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onViewJob(formProposals.jobDetail._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    View Job Post
                  </button>
                  {formProposals.status=="pending_verification"? <button
                    onClick={() =>
                      handleEditProposal(
                        formProposals.proposalId,
                        formProposals.hourlyRate || formProposals.proposedBudget
                      )
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Edit Proposal
                  </button>:<></>}
                 
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
    </>
  );
}