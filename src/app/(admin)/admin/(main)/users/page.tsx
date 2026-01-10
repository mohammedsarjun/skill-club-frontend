// components/Admin/UserManagementPage.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import Table, { Column, Filter } from "@/components/admin/Table";
import AdminActionApi from "@/api/action/AdminActionApi";
import toast from "react-hot-toast";
import { debounce } from "lodash";
import { FaCheck, FaTimes } from "react-icons/fa";

// ===== User and Detail Interfaces =====
export interface FreelancerDetailDto {
  freelancerLogo: string;
  professionalRole: string;
  hourlyRate: string;
  languages: string[];
}

export interface ClientDetailDto {
  companyName: string;
  companyLogo: string;
  website: string;
  companyDescription: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: number;
  roles: string[];
  isFreelancerBlocked: boolean;
  isClientBlocked: boolean;
  freelancerDetail?: FreelancerDetailDto;
  clientDetail?: ClientDetailDto;
}

// ===== Main Component =====
const UserManagementPage: React.FC = () => {
  // ===== State =====
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [totalCount, setTotalCount] = useState<number | undefined>(undefined);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalFreelancers, setTotalFreelancers] = useState(0);
  const [totalClients, setTotalClients] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "client" | "freelancer"
  >("overview");
  const [confirmBlock, setConfirmBlock] = useState<string | null>(null);

  // ===== Fetch Users =====
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await AdminActionApi.getUsers(
          search,
          page,
          limit,
          filters
        );
        if (response.success) {
          setUsers(response.data.data);
          const total = response.data.total ?? response.data.count ?? response.data.totalCount ?? response.data.meta?.total ?? response.data.pagination?.total;
          if (typeof total === "number") setTotalCount(total);
          else setTotalCount(response.data.data?.length ?? undefined);
        }
        else toast.error(response.message);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchUsers();
  }, [search, page, filters]);

  // ===== Fetch Stats =====
  useEffect(() => {
    async function fetchUserStats() {
      try {
        const response = await AdminActionApi.getUserStats();
        if (response.success) {
          setTotalUsers(response.data.totalUsers);
          setTotalClients(response.data.totalClients);
          setTotalFreelancers(response.data.totalFreelancers);
        } else toast.error(response.message);
      } catch (err: any) {
        toast.error(err.message);
      }
    }
    fetchUserStats();
  }, []);

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
  const columns: Column<User>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "roles", label: "Roles" },
    { key: "status", label: "Status" },
  ];

  // ===== Filters =====
  const filtersConfig: Filter[] = [
    {
      key: "role",
      label: "Role",
      options: [
        { id: "freelancer", name: "Freelancer" },
        { id: "client", name: "Client" },
      ],
    },
  ];

  // ===== Modal Handlers =====
  const handleViewModal = async (user: User) => {
    try {
      const response = await AdminActionApi.getUserDetail(user.id);
      if (response.success) {
        setViewUser(response.data);
        setActiveTab("overview");
        setIsModalOpen(true);
      } else {
        toast.error(response.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleBlockClient = async (userId: string) => {
    if (!viewUser) return;
    const status = viewUser.isClientBlocked ? "unblock" : "block";
    try {
      await AdminActionApi.updateUserStatus(userId, "client", status);
      toast.success(`Client ${status}ed successfully`);
      setViewUser({ ...viewUser, isClientBlocked: !viewUser.isClientBlocked });
      setConfirmBlock(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update client status");
    }
  };

  const handleBlockFreelancer = async (userId: string) => {
    if (!viewUser) return;
    const status = viewUser.isFreelancerBlocked ? "unblock" : "block";
    try {
      await AdminActionApi.updateUserStatus(userId, "freelancer", status);
      toast.success(`Freelancer ${status}ed successfully`);
      setViewUser({
        ...viewUser,
        isFreelancerBlocked: !viewUser.isFreelancerBlocked,
      });
      setConfirmBlock(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to update freelancer status");
    }
  };

  // ===== Render =====
  return (
    <div className="p-6">
      {/* Page Header */}
      <h2 className="text-2xl font-bold">Users Management</h2>
      <p className="text-sm text-gray-500 mt-1">
        Manage all users, freelancers, and clients on the platform
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 my-6">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-2xl font-bold">{totalUsers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Freelancers</h3>
          <p className="text-2xl font-bold">{totalFreelancers}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h3 className="text-lg font-semibold">Clients</h3>
          <p className="text-2xl font-bold">{totalClients}</p>
        </div>
      </div>

      {/* Users Table */}
      <Table<User>
        title="Users"
        columns={columns}
        data={users}
        filters={filtersConfig}

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

      {/* View Modal */}
      {isModalOpen && viewUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl relative max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6 bg-gray-50">
              <button
                className={`px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "overview"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>

              {viewUser.clientDetail && (
                <button
                  className={`px-6 py-3 font-medium transition-colors relative ${
                    activeTab === "client"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("client")}
                >
                  Client
                </button>
              )}

              {viewUser.freelancerDetail && (
                <button
                  className={`px-6 py-3 font-medium transition-colors relative ${
                    activeTab === "freelancer"
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("freelancer")}
                >
                  Freelancer
                </button>
              )}
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {/* Overview */}
              {activeTab === "overview" && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Name
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.name}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Email
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.email}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Phone
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.phone || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Roles
                    </label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {viewUser.roles.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Client Tab */}
              {activeTab === "client" && viewUser.clientDetail && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Company Name
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.clientDetail.companyName || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Logo
                    </label>
                    <div className="mt-2">
                      {viewUser.clientDetail.companyLogo ? (
                        <img
                          src={viewUser.clientDetail.companyLogo}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                          alt="Company logo"
                        />
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Website
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.clientDetail.website || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Description
                    </label>
                    <p className="text-gray-900 mt-1 leading-relaxed">
                      {viewUser.clientDetail.companyDescription || "N/A"}
                    </p>
                  </div>

                  {/* Block/Unblock */}
                  <div className="pt-4 border-t border-gray-200">
                    {confirmBlock === `client-${viewUser.id}` ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-3 font-medium">
                          Are you sure you want to{" "}
                          {viewUser.isClientBlocked ? "unblock" : "block"} this
                          client?
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleBlockClient(viewUser.id)}
                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            <FaCheck className="mr-2" /> Confirm
                          </button>
                          <button
                            onClick={() => setConfirmBlock(null)}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <FaTimes className="mr-2" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmBlock(`client-${viewUser.id}`)}
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                          viewUser.isClientBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {viewUser.isClientBlocked
                          ? "Unblock Client"
                          : "Block Client"}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Freelancer Tab */}
              {activeTab === "freelancer" && viewUser.freelancerDetail && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Professional Role
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.freelancerDetail.professionalRole || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Hourly Rate
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.freelancerDetail.hourlyRate || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Languages
                    </label>
                    <p className="text-lg text-gray-900 mt-1">
                      {viewUser.freelancerDetail.languages.join(", ") || "N/A"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Logo
                    </label>
                    <div className="mt-2">
                      {viewUser.freelancerDetail.freelancerLogo ? (
                        <img
                          src={viewUser.freelancerDetail.freelancerLogo}
                          className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                          alt="Freelancer logo"
                        />
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>

                  {/* Block/Unblock */}
                  <div className="pt-4 border-t border-gray-200">
                    {confirmBlock === `freelancer-${viewUser.id}` ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-gray-700 mb-3 font-medium">
                          Are you sure you want to{" "}
                          {viewUser.isFreelancerBlocked ? "unblock" : "block"}{" "}
                          this freelancer?
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleBlockFreelancer(viewUser.id)}
                            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                          >
                            <FaCheck className="mr-2" /> Confirm
                          </button>
                          <button
                            onClick={() => setConfirmBlock(null)}
                            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <FaTimes className="mr-2" /> Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmBlock(`freelancer-${viewUser.id}`)
                        }
                        className={`px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                          viewUser.isFreelancerBlocked
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {viewUser.isFreelancerBlocked
                          ? "Unblock Freelancer"
                          : "Block Freelancer"}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
