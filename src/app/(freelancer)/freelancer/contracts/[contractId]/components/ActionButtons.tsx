"use client";

import React, { useState } from "react";
import { Star, Video } from "lucide-react";
import { FREELANCER_CANCELLATION_CODES } from "@/constants/freelancer-cancellation-codes.constants";

interface ActionButtonsProps {
  status: 'pending_funding' | 'active' | 'completed' | 'cancelled' | 'refunded' | 'disputed' | 'cancellation_requested';
  onRateClient?: () => void;
  onCancelContract?: (cancelContractReason: string) => void;
  onScheduleMeeting?: () => void;
  hasReviewed?: boolean;
  canCancel?: boolean;
  isProcessing?: boolean;
}

export const ActionButtons = ({ status, onRateClient, onCancelContract, onScheduleMeeting, hasReviewed, canCancel, isProcessing }: ActionButtonsProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const openConfirm = () => setShowConfirm(true);
  const closeConfirm = () => setShowConfirm(false);

  const handleConfirm = async (selectedReason: string) => {
    if (!onCancelContract) return;
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
          <>
            <button
              onClick={openConfirm}
              disabled={isProcessing || isConfirming}
              className={`w-full px-4 py-3 rounded-lg transition-colors font-medium ${
                isProcessing || isConfirming
                  ? 'bg-red-400 text-white cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isProcessing || isConfirming ? 'Cancelling...' : 'Cancel Contract'}
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

                      {Object.values(FREELANCER_CANCELLATION_CODES).map((reason) => (
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
                      className={`px-4 py-2 rounded-md text-white ${
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
