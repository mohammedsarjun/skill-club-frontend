import React from 'react';
import { IContract } from '@/types/interfaces/IContract';
import { formatCurrency } from '@/utils/currency';

interface Props {
  contract: IContract;
  onView: (id: string) => void;
}

export function ContractRow({ contract, onView }: Props) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3 text-sm">{contract.contractId}</td>
      <td className="px-4 py-3 text-sm">{contract.title}</td>
      <td className="px-4 py-3 text-sm">{contract.paymentType}</td>
      <td className="px-4 py-3 text-sm">{contract.budget ? formatCurrency(Number(contract.budget)) : '-'}</td>
      <td className="px-4 py-3 text-sm">{new Date(contract.createdAt || '').toLocaleDateString() || '-'}</td>
      <td className="px-4 py-3 text-sm">{contract.status}</td>
      <td className="px-4 py-3 text-sm">
        <button
          onClick={() => onView(contract.contractId)}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          View
        </button>
      </td>
    </tr>
  );
}
