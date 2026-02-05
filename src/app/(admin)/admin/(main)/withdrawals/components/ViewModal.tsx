"use client";

import React from "react";
import { IWithdrawalItem } from "@/types/interfaces/IWithdrawals";

type Props = {
  item?: IWithdrawalItem | null;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
};

export default function ViewModal({ item, onClose, onApprove }: Props) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg w-full max-w-xl p-6">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Withdrawal Details</h3>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Request ID</div>
            <div className="font-medium">{item.id}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Amount</div>
            <div className="font-medium">${item.amount.toFixed(2)}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Note</div>
            <div className="font-medium">{item.note || '—'}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded">
            <div className="text-sm text-gray-600">Status</div>
            <div className="font-medium">{item.status}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={() => onApprove(item.id)} className="px-4 py-2 bg-green-600 text-white rounded">Approve</button>
        </div>
      </div>
    </div>
  );
}
