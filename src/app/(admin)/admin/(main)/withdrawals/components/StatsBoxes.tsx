"use client";

import React from "react";

type Props = {
  pendingRequests: number;
  totalPendingAmount: number;
  approvedToday: number;
};

export default function StatsBoxes({ pendingRequests, totalPendingAmount, approvedToday }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Pending Requests</div>
        <div className="mt-2 text-2xl font-semibold text-gray-900">{pendingRequests}</div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Total Pending Amount</div>
        <div className="mt-2 text-2xl font-semibold text-gray-900">${totalPendingAmount.toFixed(2)}</div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Approved Today</div>
        <div className="mt-2 text-2xl font-semibold text-gray-900">{approvedToday}</div>
      </div>
    </div>
  );
}
