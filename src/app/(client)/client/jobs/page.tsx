// components/Admin/JobManagementPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Table, { Column, Filter } from "@/components/admin/Table";

import toast from "react-hot-toast";
import { debounce } from "lodash";
import { FaCheck, FaTimes } from "react-icons/fa";
import { IJob, IJobQueryParams } from "@/types/interfaces/IJob";
import { useRouter } from "next/navigation";
import UserDetailModal from "@/components/admin/UserDetailModal";
import { clientActionApi } from "@/api/action/ClientActionApi";

// ===== Main Component =====
const JobManagementPage: React.FC = () => {
  // ===== State =====
  const [jobs, setJobs] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [filters, setFilters] = useState<Pick<IJobQueryParams, "filters">>();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "client" | "freelancer"
  >("overview");
  const [confirmBlock, setConfirmBlock] = useState<string | null>(null);

  // ===== Fetch Users =====
  useEffect(() => {
    async function fetchJobs() {
      try {
        const response = await clientActionApi.getAllJobs(
          search,
          page,
          limit,
          filters!
        );

        if (response.success) {
          // Map the API job shape to a table-friendly flat row so we don't expose raw ids
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
          const total = response.data.total;
          console.log(total);
          if (typeof total === "number") setTotalCount(total);
          else setTotalCount(response.data.data?.length ?? undefined);
        } else toast.error(response.message);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchJobs();
  }, [search, page, filters]);

  // // ===== Fetch Stats =====
  // useEffect(() => {
  //   async function fetchUserStats() {
  //     try {
  //       const response = await AdminActionApi.getUserStats();
  //       if (response.success) {
  //         setTotalUsers(response.data.totalUsers);
  //         setTotalClients(response.data.totalClients);
  //         setTotalFreelancers(response.data.totalFreelancers);
  //       } else toast.error(response.message);
  //     } catch (err: any) {
  //       toast.error(err.message);
  //     }
  //   }
  //   fetchUserStats();
  // }, []);

  // ===== Debounced Search =====
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setSearch(value), 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(localSearch);
    return () => debouncedSetSearch.cancel();
  }, [localSearch, debouncedSetSearch]);

  // ===== Columns =====
  const columns: Column<any>[] = [
    { key: "jobTitle", label: "Job" },
    { key: "category", label: "Category" },
    { key: "budget", label: "Budget" },
    { key: "status", label: "Status" },
  ];

  // ===== Filters =====
  const filtersConfig: Filter[] = [
    {
      key: "status",
      label: "Status",
      options: [
        { id: "pending_verification", name: "Pending" },
        { id: "open", name: "Open" },
        { id: "rejected", name: "Rejected" },
        { id: "suspended", name: "Suspended" },
        {id: "closed", name: "Closed" }
      ],
    },
  ];

  // ===== View / Navigation Handlers =====
  const router = useRouter();

  // When viewing a row from the Jobs table, navigate to the job detail route
  const handleViewModal = (row: any) => {
    console.log(row);
    const id = row?.id;
    if (!id) {
      toast.error("Missing job id");
      return;
    }
    router.push(`/client/jobs/${id}`);
  };

  // ===== Render =====
  return (
    <div className="p-6">
      {/* Page Header */}
      <h2 className="text-2xl font-bold">Job Management</h2>
      <p className="text-sm text-gray-500 mt-1">
        Manage and moderate job postings on the platform
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 my-6"></div>

      {/* Jobs Table */}
      <Table<any>
        title="Jobs"
        columns={columns}
        data={jobs}
        filters={filtersConfig}
        badgeKeys={["status"]}
        badgeColors={{
          pending_verification: "#f59e0bb4",
          open: "#10b981b4",
          rejected: "#ef4444b4",
          suspended: "#6B7280",
          closed: "#374151",
        }}
        handleOpenViewModal={handleViewModal}
        pageSize={limit}
        page={page}
        setPage={setPage}
        search={localSearch}
        totalCount={totalCount}
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
