"use client";

import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { CANCELLATION_CODES } from "@/constants/cancellation_codes.constants";
interface ActionButtonsProps {
  contractType: "fixed" | "hourly" | "fixed_with_milestones";
  status:
    | "pending_funding"
    | "held"
    | "active"
    | "completed"
    | "cancelled"
    | "refunded"
    | "disputed";
  onFundContract: () => void;
  onCancelContract: (cancelContractReason: string) => void;
  onScheduleMeeting?: () => void;
  onReviewFreelancer?: () => void;
  isProcessing?: boolean;
  canCancel?: boolean;
  hasReviewed?: boolean;
}

export const ActionButtons = ({
  contractType,
  status,
  onFundContract,
  onCancelContract,
  onScheduleMeeting,
  onReviewFreelancer,
  isProcessing,
  canCancel,
  hasReviewed,
}: ActionButtonsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const handleConfirm = async (selectedReason:string) => {
    try {
      setIsConfirming(true);
      await Promise.resolve(onCancelContract(selectedReason));
    } finally {
      setIsConfirming(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
      <div className="space-y-3">
        {(status === "pending_funding" ||
          status === "held" ||
          contractType === "fixed_with_milestones" ||
          (contractType === "hourly" &&
            status !== "cancelled" &&
            status !== "completed")) && (
          <button
            onClick={onFundContract}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            Fund Contract
          </button>
        )}

        {status === "active" && onScheduleMeeting && (
          <button
            onClick={onScheduleMeeting}
            className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Schedule Meeting
          </button>
        )}
        {canCancel && (
          <>
            <button
              onClick={openConfirm}
              disabled={isProcessing || isConfirming}
              className={`w-full px-4 py-3 text-white rounded-lg transition-colors font-medium ${
                isProcessing || isConfirming
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {isProcessing || isConfirming
                ? "Cancelling..."
                : "Cancel Contract"}
            </button>

            {showConfirm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="fixed inset-0 bg-black/40"
                  onClick={closeConfirm}
                />

                <div
                  role="dialog"
                  aria-modal="true"
                  className="bg-white rounded-lg shadow-xl p-6 z-10 max-w-sm w-full"
                >
                  <h4 className="text-lg font-semibold mb-2">Are you sure?</h4>

                  <p className="text-sm text-gray-600 mb-4">
                    Do you want to cancel this contract?
                  </p>

                  {/* Reason Dropdown */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for cancellation
                    </label>

                    <select
                      value={selectedReason}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="">Select a reason</option>

                      {Object.values(CANCELLATION_CODES).map((reason) => (
                        <option key={reason.code} value={reason.code}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={closeConfirm}
                      className="px-4 py-2 rounded-md bg-gray-200"
                    >
                      No
                    </button>

                    <button
                      type="button"
                      onClick={() => handleConfirm(selectedReason)}
                      disabled={isConfirming || !selectedReason}
                      className={`px-4 py-2 rounded-md text-white
            ${
              isConfirming || !selectedReason
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
                    >
                      {isConfirming ? "Cancelling..." : "Yes, Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        {(status === "completed" || status === "cancelled") &&
          onReviewFreelancer && (
            <button
              onClick={onReviewFreelancer}
              disabled={hasReviewed}
              className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                hasReviewed
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              {hasReviewed ? "Already Reviewed" : "Review Freelancer"}
            </button>
          )}
      </div>
    </div>
  );
};
