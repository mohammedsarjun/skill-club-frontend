"use client";

import { useState } from "react";
import { X, AlertTriangle, Info } from "lucide-react";

interface RaiseDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (notes: string) => Promise<void>;
  isSubmitting: boolean;
  contractType?: string;
  targetMilestoneTitle?: string;
}

export const RaiseDisputeModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isSubmitting,
  contractType,
  targetMilestoneTitle 
}: RaiseDisputeModalProps) => {
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(notes);
    setNotes("");
  };

  const isHourly = contractType === 'hourly';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Raise Dispute</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-5">
            {isHourly ? (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Not Yet Available</h4>
                    <p className="text-sm text-blue-800">
                      Dispute functionality for hourly contracts is currently under development. 
                      Please contact support for assistance.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-orange-50 border-l-4 border-orange-400 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-1.5"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900 mb-1">Dispute Reason</p>
                      <p className="text-sm text-orange-800 font-semibold">Client Unfair Cancellation</p>
                    </div>
                  </div>
                </div>

                {contractType === 'fixed_with_milestones' && targetMilestoneTitle && (
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-900 mb-2">Targeted Milestone</p>
                        <div className="bg-white/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-yellow-200">
                          <p className="text-sm font-semibold text-yellow-900">{targetMilestoneTitle}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {contractType === 'fixed' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-900 mb-1">Contract Scope</p>
                        <p className="text-sm text-purple-800">This dispute applies to the entire fixed-price contract.</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                    Additional Notes for Admin
                    <span className="text-gray-500 font-normal ml-1">(Optional)</span>
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide detailed context about why you believe this cancellation was unfair..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all duration-200 placeholder:text-gray-400"
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Clear details help the admin make a fair decision on your dispute.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-white hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isHourly}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-xl hover:from-orange-700 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Raise Dispute"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
