"use client";

import React from "react";
import { IFreelancerWithdrawalDetail } from "@/types/interfaces/IFreelancerWithdrawal";

interface Props {
  withdrawal: IFreelancerWithdrawalDetail | null;
  onClose: () => void;
}

export default function WithdrawalDetailModal({ withdrawal, onClose }: Props) {
  if (!withdrawal) return null;

  const statusColors: Record<string, string> = {
    withdrawal_approved: "bg-green-100 text-green-800",
    withdrawal_requested: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-800",
  };

  const statusLabels: Record<string, string> = {
    withdrawal_approved: "Approved",
    withdrawal_requested: "Pending",
    rejected: "Rejected",
  };

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-[#14A800] to-[#0d7a00] text-white px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Withdrawal Details</h2>
              <p className="text-green-100 mt-1">{withdrawal.transactionId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Transaction Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{withdrawal.amount.toLocaleString("en-IN")}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    statusColors[withdrawal.status] ||
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusLabels[withdrawal.status] || withdrawal.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Requested On</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(withdrawal.createdAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(withdrawal.updatedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-base text-gray-900">
                  {withdrawal.description}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 mr-2 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Bank Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Holder</p>
                <p className="text-base font-medium text-gray-900">
                  {withdrawal.bankDetails.accountHolderName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="text-base font-medium text-gray-900">
                  {withdrawal.bankDetails.bankName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="text-base font-mono text-gray-900">
                  {withdrawal.bankDetails.accountNumberMasked}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="text-base font-mono text-gray-900">
                  {withdrawal.bankDetails.ifscCode}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-base font-medium text-gray-900 capitalize">
                  {withdrawal.bankDetails.accountType}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verification Status</p>
                {withdrawal.bankDetails.verified ? (
                  <div className="flex items-center gap-1 mt-1">
                    <svg
                      className="w-4 h-4 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-green-600">
                      Verified
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mt-1">
                    <svg
                      className="w-4 h-4 text-amber-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-amber-600">
                      Not Verified
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
