"use client";

import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import { IFreelancerProposal } from "@/types/interfaces/IProposal";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProposalTable from "./components/ProposalTable";
import ProposalDetailModal from "./components/ProposalDetailModal";

export default function FreelancerProposalPage() {
  const [proposals, setProposals] = useState<IFreelancerProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<IFreelancerProposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const loadProposals = async () => {
      setLoading(true);
      const response = await freelancerActionApi.getMyProposals({
        page,
        limit: 10,
        status: statusFilter || undefined,
      });
      if (response?.success && Array.isArray(response.data)) {
        setProposals(response.data as IFreelancerProposal[]);
      } else {
        setProposals([]);
      }
      setLoading(false);
    };

    loadProposals();
  }, [page, statusFilter]);

  function openModal(proposal: IFreelancerProposal) {
    setSelected(proposal);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelected(null);
  }

  function viewJob(jobId: string) {
    router.push(`/freelancer/jobs/${jobId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Proposals</h1>
          <p className="text-sm text-gray-500 mt-1">
            Proposals you have submitted to job posts
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Filter by status:</label>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All</option>
            <option value="pending_verification">Pending</option>
            <option value="offer_sent">Offer Sent</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-sm text-gray-500">
            Loading proposals...
          </div>
        ) : proposals.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-sm">No proposals found</p>
          </div>
        ) : (
          <ProposalTable proposals={proposals} onView={openModal} />
        )}

        {proposals.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={proposals.length < 10}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ProposalDetailModal
        proposal={selected}
        isOpen={isModalOpen}
        onClose={closeModal}
        onViewJob={viewJob}
      />
    </div>
  );
}
