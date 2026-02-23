"use client";

import { IFreelancerProposal } from "@/types/interfaces/IProposal";
import { formatCurrency } from "@/utils/currency";

interface ProposalTableProps {
  proposals: IFreelancerProposal[];
  onView: (proposal: IFreelancerProposal) => void;
}

const statusLabelMap: Record<IFreelancerProposal["status"], string> = {
  pending_verification: "Pending",
  offer_sent: "Offer Sent",
  rejected: "Rejected",
};

const statusColorMap: Record<IFreelancerProposal["status"], string> = {
  pending_verification: "bg-yellow-100 text-yellow-800",
  offer_sent: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

export default function ProposalTable({ proposals, onView }: ProposalTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Job Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rate / Budget
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Proposed Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {proposals.map((proposal) => (
            <tr key={proposal.proposalId} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-medium text-gray-900 truncate max-w-[250px]">
                  {proposal.jobDetail.title}
                </p>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {proposal.hourlyRate
                  ? `${formatCurrency(proposal.hourlyRate)}/hr`
                  : proposal.proposedBudget
                  ? `${formatCurrency(proposal.proposedBudget)} (Fixed)`
                  : "—"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {new Date(proposal.proposedAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColorMap[proposal.status]}`}
                >
                  {statusLabelMap[proposal.status]}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onView(proposal)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
