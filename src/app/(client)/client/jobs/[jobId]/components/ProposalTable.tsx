
import React, { useEffect, useState } from "react";
import GenericTable, { Column, Filter } from "@/components/admin/Table";
import ViewProposalDialog from "./ProposalDialog";
import toast from 'react-hot-toast';
import { useParams } from "next/navigation";
import { clientActionApi } from "@/api/action/ClientActionApi";

// ===== Type Definitions =====
export interface Proposal {
  id: string;
  proposalId?: string;
  freelancerId?: string;
  jobId?: string;
  freelancer: {
    freelancerId?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    avatar?: string;
    country?: string;
    rating?: number;
    profileUrl?: string;
  };
  hourlyRate?: number;
  availableHoursPerWeek?: number;
  proposedBudget?: number;
  deadline?: string;
  coverLetter?: string;
  createdAt?: string;
  proposedAt?: string;
  status?: string;
  skills?: string[];
}

// ===== Modal Components =====
interface ViewModalProps {
  proposal: Proposal | null;
  onClose: () => void;
}



// ===== Main Component =====
export default function ProposalManagementTable() {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const params = useParams();
  const jobId = params.jobId;

  // Controlled table state so we can forward pagination / filters to the backend
  const [proposalsData, setProposalsData] = useState<Proposal[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  const pageSize = 10;

  useEffect(() => {
    async function fetchProposals() {
      if (!jobId) return;

      // Build query in the format backend expects
      const query = {
        search: typeof search === "string" ? search : "",
        page: Number(page) > 0 ? Number(page) : 1,
        limit: Number(pageSize) > 0 ? Number(pageSize) : 10,
        filters: { status: (activeFilters && activeFilters.status) || undefined },
      };

      try {
        const response = await clientActionApi.getAllJobProposals(jobId as string, query as any);
        // flexible response shapes: response may be { success, data } or direct data
        const payload = response && response.data ? response.data : response;
        console.log(response)

        // Try common shapes
        const items: any[] = Array.isArray(payload?.proposals)
          ? payload.proposals
          : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload)
          ? payload
          : [];

        // Map backend proposal shape into the UI Proposal shape
        const proposalItems: Proposal[] = items.map((raw: any) => ({
          id: raw?.proposalId?.toString() ?? "",
          proposalId: raw?._id?.toString() ?? raw?.id?.toString() ?? "",
          freelancerId: raw?.freelancer?.freelancerId?.toString() ?? raw?.freelancerId,
          jobId: raw?.jobId ?? jobId,
          freelancer: {
            id: raw?.freelancer?._id?.toString() ?? raw?.freelancerId,
            firstName: raw?.freelancer?.firstName,
            lastName: raw?.freelancer?.lastName,
            name: `${raw?.freelancer?.firstName || ""} ${raw?.freelancer?.lastName || ""}`.trim(),
            avatar: raw?.freelancer?.freelancerProfile?.logo || raw?.freelancer?.avatar || "",
            country: raw?.freelancer?.address?.country || raw?.freelancer?.country || "",
            rating: raw?.freelancer?.rating ?? 0,
            profileUrl:  `/client/freelancers/${raw?.freelancer?.freelancerId}/profile`,
          },
          proposedBudget: raw?.proposedBudget ?? raw?.fixedRate ?? undefined,
          deadline: raw?.deadline ?? undefined,
          hourlyRate: raw?.hourlyRate ?? undefined,
          availableHoursPerWeek: raw?.availableHoursPerWeek ?? raw?.available_hours_per_week ?? undefined,
          coverLetter: raw?.coverLetter ?? raw?.cover_letter ?? "",
          createdAt: raw?.createdAt ?? raw?.proposedAt ?? undefined,
          proposedAt: raw?.createdAt ?? raw?.proposedAt ?? undefined,
          status: raw?.status ?? "",
          skills: raw?.skills ?? [],
        }));

        setProposalsData(proposalItems);

        // Try to set totalCount from common fields
        const tc = payload?.totalCount ?? payload?.total ?? payload?.meta?.total ?? undefined;
        if (typeof tc === "number") setTotalCount(tc);
      } catch (err) {
        console.error("Failed to fetch proposals:", err);
        setProposalsData([]);
        setTotalCount(0);
      }
    }

    fetchProposals();
  }, [jobId, page, search, activeFilters]);

  // Define columns with custom rate rendering
  const columns: Column<Proposal>[] = [
    { key: "freelancerName", label: "Freelancer Name" },
    {
      key: "proposalDate",
      label: "Proposal Date",
    },
    {
      key: "rateType",
      label: "Rate",
    },
    { key: "status", label: "Status" },
  ];

  // Define filters
  const filters: Filter[] = [
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { id: "", name: "All" },
        { id: "pending_verification", name: "Pending" },
        { id: "offer_sent", name: "Offer Sent" },
        { id: "rejected", name: "Rejected" },
      ],
    },
  ];

  // Transform data to the flat shape the table expects (keep original in proposalsData)
  const transformedData: any[] = proposalsData.map((p) => ({
    ...p,
    freelancerName: p.freelancer?.name || "",
    rateType: p.hourlyRate ? `₹${p.hourlyRate}/hr` : p.proposedBudget ? `₹${p.proposedBudget?.toLocaleString()} (Fixed)` : "",
    proposalDate: p.createdAt
      ? new Date(p.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "",
  }));

  const handleView = (proposal: Proposal) => {
    // Find the original proposal with all details
    const fullProposal = proposalsData.find((p) => p.id === proposal.id);
    setSelectedProposal(fullProposal || null);
  };

  const handleReject = async (proposal: Proposal) => {
    // allow fallback between proposal.proposalId and proposal.id
    const pid = (proposal && (proposal.proposalId || proposal.id)) as string | undefined;
    console.log('handleReject invoked for', { proposal, pid });
    if (!pid) {
      console.warn('No proposal id available to reject');
      toast.error('Unable to determine proposal id');
      return;
    }

    setRejectingId(pid);
    try {
      const resp = await clientActionApi.rejectProposal(pid);
      const payload = resp && resp.data ? resp.data : resp;
      console.log('reject response', resp, payload);
      if (payload?.rejected) {
        // mark locally as rejected
        setProposalsData((prev) => prev.map((p) => (p.id === proposal.id ? { ...p, status: 'rejected' } : p)));
        toast.success('Proposal rejected');
        setSelectedProposal((prev) => (prev && prev.id === proposal.id ? { ...prev, status: 'rejected' } : prev));
      } else {
        toast.error(resp?.message || 'Failed to reject proposal');
      }
    } catch (err) {
      console.error('Reject failed', err);
      toast.error('Failed to reject proposal');
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <GenericTable<Proposal>
        title="Proposal Management"
        columns={columns}
        data={transformedData}
        filters={filters}
        onView={handleView}
        viewOnly={true}
        pageSize={pageSize}
        page={page}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        setFilters={setActiveFilters}
        activeFilters={activeFilters}
        totalCount={totalCount}
  searchKeys={["freelancer"]}
        badgeKeys={["status"]}
        badgeColors={{
          pending: "#f59e0b",
          approved: "#10b981",
          offer_sent: "#7c3aed",
          rejected: "#ef4444",
          under_review: "#3b82f6",
        }}
      />

      {selectedProposal && (
        <ViewProposalDialog
          proposal={selectedProposal}
          proposalId={selectedProposal.id}
          onClose={() => setSelectedProposal(null)}
          onAccept={() => {}}
          onMessage={() => {}}
          onReject={(p) => handleReject(p)}
          isOpen={!!selectedProposal}
        />
      )}
    </div>
  );
}