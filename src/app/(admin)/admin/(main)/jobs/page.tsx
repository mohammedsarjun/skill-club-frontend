// components/Admin/JobManagementPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Table, { Column, Filter } from "@/components/admin/Table";
import AdminActionApi from "@/api/action/AdminActionApi";
import toast from "react-hot-toast";
import { debounce } from "lodash";

import { IJobQueryParams } from "@/types/interfaces/IJob";
import { useRouter } from "next/navigation";
// ===== Main Component =====
const JobManagementPage: React.FC = () => {
  // ===== State =====
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [filters, setFilters] = useState<Pick<IJobQueryParams, "filters">>();
  const [activeJobs, setActiveJobs] = useState(0);
  const [rejectedJobs, setRejectedJobs] = useState(0);
  const [pendingJobs, setPendingJobs] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "client" | "freelancer"
  >("overview");
  const [confirmBlock, setConfirmBlock] = useState<string | null>(null);

  // ===== Fetch Users =====
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await AdminActionApi.getAllJobs(
          search,
          page,
          limit,
          filters!
        );

        if (response.success) {
          // Map the API job shape to a table-friendly flat row so we don't expose raw ids

          console.log(response.data);
          const mapped = (response.data.data || []).map((j: any) => ({
            id: j.jobId ?? j._id ?? j.id,
            jobTitle: j.jobTitle ?? "-",
            category: j.category?.categoryName ?? j.category ?? "-",
            budget: j.budget
              ? `${j.budget.rateType ?? ""} ${j.budget.min ?? ""} - ${
                  j.budget.max ?? ""
                }`.trim()
              : "-",
            totalProposal: j.totalProposal ?? 0,
            status: j.status ?? "-",
            raw: j, // keep original object if any action needs it
          }));

          setJobs(mapped);
          const total = response.data.total
          if (typeof total === "number") setTotalCount(total);
          else setTotalCount(response.data.data?.length ?? undefined);

        } else toast.error(response.message);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchJobs();
  }, [search, page, filters]);

  // ===== Fetch Stats =====
  useEffect(() => {
    async function fetchJobStats() {
      try {
        const response = await AdminActionApi.getJobStats();
        if (response.success) {
          setActiveJobs(response.data.activeJobs);
          setRejectedJobs(response.data.rejectedJobs);
          setPendingJobs(response.data.pendingJobs);
        } else toast.error(response.message);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchJobStats();
  }, []);

  // ===== Debounced Search =====
  // localSearch updates immediately from the input. We debounce updates to
  // `search` which is used by the fetch effect to trigger server requests.
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(localSearch);
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [localSearch, debouncedSetSearch]);

  // ===== Columns =====
  const columns: Column<any>[] = useMemo(() => [
    { key: "jobTitle", label: "Job" },
    { key: "category", label: "Category" },
    { key: "budget", label: "Budget" },
    { key: "totalProposal", label: "Total Proposal" },
    { key: "status", label: "Status" },
  ], []);

  // ===== Filters =====
  const filtersConfig: Filter[] = useMemo(() => [
    {
      key: "status",
      label: "Status",
      options: [
        { id: "pending_verification", name: "Pending" },
        { id: "open", name: "Open" },
        { id: "rejected", name: "Rejected" },
        { id: "suspended", name: "Suspended" },
      ],
    },
  ], []);

  // ===== View / Navigation Handlers =====
  const router = useRouter();

  // When viewing a row from the Jobs table, navigate to the job detail route
  const handleViewModal = useMemo(() => {
    return (row: any) => {
      const id = row?.id ?? row?.jobId ?? row?.raw?.jobId ?? row?.raw?._id ?? row?.raw?.id;
      if (!id) {
        toast.error("Missing job id");
        return;
      }
      router.push(`/admin/jobs/${id}`);
    };
  }, [router]);

  const badgeColorMap = useMemo(() => ({
    pending_verification: "#f59e0bb4",
    open: "#10b981b4",
    rejected: "#ef4444b4",
    suspended: "#6B7280",
  }), []);

  // ===== Render =====
  return (
    <div className="p-6">
      {/* Page Header */}
      <h2 className="text-2xl font-bold">Job Management</h2>
      <p className="text-sm text-gray-500 mt-1">
        Manage and moderate job postings on the platform
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 my-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Active Jobs</h3>
          <p className="text-2xl font-bold">{activeJobs}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Rejected Jobs</h3>
          <p className="text-2xl font-bold">{rejectedJobs}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Pending Jobs</h3>
          <p className="text-2xl font-bold">{pendingJobs}</p>
        </div>
      </div>

      {/* Jobs Table */}
      <Table<any>
        title="Jobs"
        columns={columns}
        data={jobs}
        filters={filtersConfig}
        badgeKeys={["status"]}
        badgeColors={badgeColorMap}
        handleOpenViewModal={handleViewModal}
        page={page}
        setPage={setPage}
        pageSize={limit}
        totalCount={totalCount}
  search={localSearch}
  setSearch={setLocalSearch}
        canDelete={true}
        setFilters={setFilters}
        activeFilters={filters}
        viewOnly={true}
      />
    </div>
  );
};

export default JobManagementPage;
