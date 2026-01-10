"use client";

import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import React, { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import GenericTable, { Column, Filter } from "@/components/admin/Table";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatCurrency } from '@/utils/currency';

// Backend DTO shape
export interface FreelancerProposalResponseDTO {
  proposalId: string;
  jobDetail: {
    _id: string;
    title: string;
    description: string;
    clientId: string;
  };
  hourlyRate?: number;
  proposedBudget?: number;
  availableHoursPerWeek: number;
  deadline?: string | Date;
  coverLetter: string;
  status: "pending_verification" | "accepted" | "rejected";
  proposedAt: Date | string;
}

const DUMMY_PROPOSALS: FreelancerProposalResponseDTO[] = [
  {
    proposalId: "p_001",
    jobDetail: {
      _id: "j_1001",
      title: "Full Stack Web Application Development",
      description:
        "Build a scalable web application with React + Node. Work includes payments and integrations.",
      clientId: "c_200",
    },
    hourlyRate: 60,
    availableHoursPerWeek: 30,
    coverLetter:
      "I have 6 years of experience building full-stack apps with React and Node. I can start in 2 weeks.",
    status: "pending_verification",
    proposedAt: new Date().toISOString(),
  },
  {
    proposalId: "p_002",
    jobDetail: {
      _id: "j_1002",
      title: "Mobile App UI/UX Design",
      description: "Design modern mobile app UI/UX for iOS and Android.",
      clientId: "c_201",
    },
    hourlyRate: 45,
    availableHoursPerWeek: 20,
    coverLetter:
      "Experienced designer with a strong mobile portfolio. Prefer fixed milestones.",
    status: "accepted",
    proposedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    proposalId: "p_003",
    jobDetail: {
      _id: "j_1003",
      title: "Landing Page Design (Fixed)",
      description:
        "Design a marketing landing page. Fixed-price work with 2 revisions.",
      clientId: "c_202",
    },
    proposedBudget: 1500,
    availableHoursPerWeek: 0,
    coverLetter:
      "I can deliver a modern landing page for your campaign. Fixed price preferred.",
    status: "pending_verification",
    proposedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
];

export default function FreelancerProposalPage() {
  const [proposals, setProposals] =
    useState<FreelancerProposalResponseDTO[]>(DUMMY_PROPOSALS);
  const [selected, setSelected] =
    useState<FreelancerProposalResponseDTO | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {}
  );
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const pageSize = 10;

  useEffect(() => {
    (async () => {
      // For demo purposes we use the first proposal's job id if available.
      const jobId = proposals?.[0]?.jobDetail?._id;
      if (!jobId) {
        console.warn("No jobId available to call getMyProposals demo");
        return;
      }

      const query = {
        search: search || "",
        page: Number(page) > 0 ? Number(page) : 1,
        limit: Number(pageSize) > 0 ? Number(pageSize) : 10,
        filters: {
          status: (activeFilters && activeFilters.status) || undefined,
        },
      };

      try {
        const resp = await freelancerActionApi.getMyProposals(
          jobId,
          query as any
        );
        // Log entire response for inspection
        console.log("freelancerActionApi.getMyProposals ->", resp);

        // If response contains data array, use it to replace proposals for demo
        const payload = resp?.data ?? resp;
        const items: any[] = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.proposals)
          ? payload.proposals
          : Array.isArray(payload?.data)
          ? payload.data
          : [];
        if (items.length > 0) {
          // Map simple shape into our local DTO where possible
          const mapped = items.map(
            (raw: any) =>
              ({
                proposalId: raw._id?.toString() ?? raw.proposalId,
                jobDetail: {
                  _id: raw.jobDetail?._id ?? raw.jobId ?? raw.job?._id ?? "",
                  title:
                    raw.jobDetail?.title ?? raw.jobTitle ?? raw.title ?? "",
                  description:
                    raw.jobDetail?.description ?? raw.description ?? "",
                  clientId: raw.jobDetail?.clientId ?? raw.clientId ?? "",
                },
                hourlyRate: raw.hourlyRate ?? raw.hourly_rate ?? undefined,
                proposedBudget:
                  raw.proposedBudget ??
                  raw.fixedRate ??
                  raw.proposed_budget ??
                  undefined,
                deadline:
                  raw.deadline ??
                  raw.deadlineAt ??
                  raw.deadline_date ??
                  undefined,
                availableHoursPerWeek:
                  raw.availableHoursPerWeek ??
                  raw.available_hours_per_week ??
                  0,
                coverLetter:
                  raw.coverLetter ?? raw.cover_letter ?? raw.message ?? "",
                status: raw.status ?? "pending_verification",
                proposedAt:
                  raw.proposedAt ?? raw.createdAt ?? new Date().toISOString(),
              } as FreelancerProposalResponseDTO)
          );

          setProposals(mapped);
        }
      } catch (err) {
        console.error("Error calling getMyProposals:", err);
      }
    })();
  }, [proposals.length, activeFilters, page, search]);

  function openModal(item: FreelancerProposalResponseDTO) {
    setSelected(item);
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelected(null);
  }

  function viewJob(jobId: string) {
    // Redirect to client job detail (adjust path if your route differs)
    router.push(`/freelancer/jobs/${jobId}`);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold">My Proposals</h1>
          <p className="text-sm text-gray-600 mt-1">
            Proposals you've sent to job posts
          </p>
        </div>

        <div className="space-y-4">
          {proposals.length === 0 && (
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
              No proposals found
            </div>
          )}

          {/* Use GenericTable to render proposals in same layout as client page */}
          {proposals.length > 0 &&
            (() => {
              type Row = {
                id: string;
                jobTitle: string;
                proposedDate: string;
                rate: string;
                status: string;
                original: FreelancerProposalResponseDTO;
              };

              const columns: Column<Row>[] = [
                { key: "jobTitle", label: "Job Title" },
                { key: "proposedDate", label: "Proposed Date" },
                { key: "rate", label: "Rate" },
                { key: "status", label: "Status" },
              ];

              // Table filters (status)
              const filters: Filter[] = [
                {
                  key: "status",
                  label: "Filter by Status",
                  options: [
                    { id: "", name: "All" },
                    { id: "pending_verification", name: "Pending" },
                    { id: "rejected", name: "Rejected" },
                    { id: "offer_sent", name: "Offer Sent" },
                  ],
                },
              ];

              const rows: Row[] = proposals.map((p) => ({
                id: p.proposalId,
                jobTitle: p.jobDetail.title,
                proposedDate: new Date(p.proposedAt).toLocaleDateString(),
                rate: p.hourlyRate
                  ? `${formatCurrency(Number(p.hourlyRate || 0))}/hr`
                  : p.proposedBudget
                  ? `${formatCurrency(Number(p.proposedBudget || 0))} (Fixed)`
                  : "-",
                status: p.status,
                original: p,
              }));

              return (
                <GenericTable
                  title="My Proposals"
                  columns={columns}
                  data={rows}
                  viewOnly={true}
                  filters={filters}
                  activeFilters={activeFilters}
                  setFilters={setActiveFilters}
                  onView={(row) => {
                    // row is the table row object; original holds the full proposal
                    const r = (row as any).original as
                      | FreelancerProposalResponseDTO
                      | undefined;
                    if (r) openModal(r);
                  }}
                  badgeKeys={["status"]}
                  pageSize={10}
                />
              );
            })()}
        </div>
      </div>

      {/* Modal */}
      <DialogPrimitive.Root
        open={isOpen}
        onOpenChange={(o) => !o && closeModal()}
      >
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 bg-black/60 z-40" />
          <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg">
            {selected && (
              <div>
                <h2 className="text-xl font-bold mb-2">
                  Proposal to: {selected.jobDetail.title}
                </h2>
      

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {selected.proposedBudget ? (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Fixed Budget</p>
                        <p className="font-medium">{formatCurrency(Number(selected.proposedBudget || 0))}</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Deadline</p>
                        <p className="font-medium">
                          {selected.deadline
                            ? new Date(selected.deadline).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Hourly Rate</p>
                        <p className="font-medium">{formatCurrency(Number(selected.hourlyRate || 0))}/hr</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-500">Available Hours</p>
                        <p className="font-medium">
                          {selected.availableHoursPerWeek} hrs/week
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">
                    Cover Letter
                  </p>
                  <div className="bg-gray-50 p-4 rounded mt-2 text-gray-700 whitespace-pre-wrap">
                    {selected.coverLetter}
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => viewJob(selected.jobDetail._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    View Job Post
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
