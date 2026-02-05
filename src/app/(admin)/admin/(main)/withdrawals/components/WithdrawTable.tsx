"use client";

import React from "react";
import { IWithdrawalItem } from "@/types/interfaces/IWithdrawals";

type Props = {
  items: IWithdrawalItem[];
  onView: (item: IWithdrawalItem) => void;
};

export default function WithdrawTable({ items, onView }: Props) {
  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested At</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((it) => (
            <tr key={it.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${it.amount.toFixed(2)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{it.status}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(it.createdAt).toLocaleString()}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button onClick={() => onView(it)} className="text-indigo-600 hover:text-indigo-900">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
