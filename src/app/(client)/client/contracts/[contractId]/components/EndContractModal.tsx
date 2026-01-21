"use client";

import React, { useState } from "react";

interface EndContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isProcessing: boolean;
}

export const EndContractModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing,
}: EndContractModalProps) => {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
    } finally {
      setIsConfirming(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-lg shadow-xl p-6 z-10 max-w-sm w-full mx-4"
      >
        <h4 className="text-lg font-semibold mb-2">End Contract</h4>

        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to end this contract? This action will complete
          the contract and release any remaining funds.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming || isProcessing}
            className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isConfirming || isProcessing}
            className={`px-4 py-2 rounded-md text-white ${
              isConfirming || isProcessing
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isConfirming || isProcessing ? "Ending..." : "Yes, End Contract"}
          </button>
        </div>
      </div>
    </div>
  );
};
