"use client";
import { useState } from "react";
import { FaTimes, FaFlag } from "react-icons/fa";

interface ReportJobModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
  jobTitle: string;
}

export default function ReportJobModal({
  onClose,
  onSubmit,
  jobTitle,
}: ReportJobModalProps) {
  const [reason, setReason] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(reason);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <FaFlag className="text-red-600 text-xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Report Job</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-gray-700 mb-2">
              You are reporting the following job:
            </p>
            <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {jobTitle}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reason for Reporting <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please provide a detailed reason for reporting this job..."
              rows={6}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                Please be specific about why you are reporting this job.
              </p>
              <p className="text-sm text-gray-400">{reason.length}/500</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> False reports may result in account
              restrictions. Please ensure your report is legitimate and
              accurate.
            </p>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || isSubmitting}
            className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FaFlag />
                Submit Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
