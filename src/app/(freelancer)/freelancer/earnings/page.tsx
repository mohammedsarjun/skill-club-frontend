"use client";

import React, { useState, useEffect } from "react";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import EarningsOverview from "./components/EarningsOverview";
import TransactionsTable from "./components/TransactionsTable";
import PeriodFilter from "./components/PeriodFilter";
import WithdrawModal from "./components/WithdrawModal";
import WithdrawalDetailModal from "./components/WithdrawalDetailModal";
import Pagination from "@/components/common/Pagination";
import {
  IFreelancerEarningsOverview,
  IFreelancerTransaction,
} from "@/types/interfaces/IFreelancerEarnings";
import {
  IFreelancerWithdrawalListItem,
  IFreelancerWithdrawalDetail,
  IFreelancerWithdrawalsResponse,
} from "@/types/interfaces/IFreelancerWithdrawal";
import toast from "react-hot-toast";

const FreelancerEarnings = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [earningsOverview, setEarningsOverview] =
    useState<IFreelancerEarningsOverview>({
      available: 0,
      pending: 0,
      totalEarnings: 0,
    });
  const [transactions, setTransactions] = useState<IFreelancerTransaction[]>(
    [],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawals, setWithdrawals] = useState<IFreelancerWithdrawalListItem[]>([]);
  const [withdrawPage, setWithdrawPage] = useState(1);
  const [withdrawTotalPages, setWithdrawTotalPages] = useState(1);
  const [withdrawStatusFilter, setWithdrawStatusFilter] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year" | "custom" | null
  >(null);
  const [customDateRange, setCustomDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<IFreelancerWithdrawalDetail | null>(null);
  const [showWithdrawalDetail, setShowWithdrawalDetail] = useState(false);

  useEffect(() => {
    fetchEarningsOverview();
  }, []);

  useEffect(() => {
    if (activeTab === "withdrawals") fetchWithdrawals();
  }, [activeTab, withdrawPage, withdrawStatusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, selectedPeriod, customDateRange]);

  const fetchEarningsOverview = async () => {
    try {
      const response = await freelancerActionApi.getEarningsOverview();
      if (response?.success && response?.data) {
        setEarningsOverview(response.data);
      }
    } catch (error) {
      console.error("Error fetching earnings overview:", error);
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const query: {
        page: number;
        limit: number;
        period?: string;
        startDate?: string;
        endDate?: string;
      } = {
        page: currentPage,
        limit: 10,
      };

      if (
        selectedPeriod === "custom" &&
        customDateRange.startDate &&
        customDateRange.endDate
      ) {
        query.startDate = customDateRange.startDate.toISOString();
        query.endDate = customDateRange.endDate.toISOString();
      } else if (selectedPeriod && selectedPeriod !== "custom") {
        query.period = selectedPeriod;
      }

      const response = await freelancerActionApi.getTransactions(query);
      if (response?.success && response?.data) {
        setTransactions(response.data.items || []);
        setTotalPages(response.data.pages || 1);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const status = withdrawStatusFilter === "all" ? undefined : withdrawStatusFilter;
      const res = await freelancerActionApi.getWithdrawals(withdrawPage, 10, status);
      if (res?.success && res?.data) {
        const data = res.data as IFreelancerWithdrawalsResponse;
        setWithdrawals(data.items || []);
        setWithdrawTotalPages(data.pages || 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewWithdrawal = async (withdrawalId: string) => {
    try {
      const res = await freelancerActionApi.getWithdrawalDetail(withdrawalId);
      if (res?.success && res?.data) {
        setSelectedWithdrawal(res.data);
        setShowWithdrawalDetail(true);
      } else {
        toast.error("Failed to load withdrawal details");
      }
    } catch (err) {
      toast.error("Failed to load withdrawal details");
    }
  };

  const handlePeriodChange = (period: "week" | "month" | "year" | "custom") => {
    setSelectedPeriod(period);
    setCurrentPage(1);
    if (period !== "custom") {
      setCustomDateRange({ startDate: null, endDate: null });
    }
  };

  const handleCustomDateChange = (
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    setCustomDateRange({ startDate, endDate });
    if (startDate && endDate) {
      setSelectedPeriod("custom");
      setCurrentPage(1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const statusColors: Record<string, string> = {
    withdrawal_approved: "bg-green-100 text-green-700",
    withdrawal_requested: "bg-amber-100 text-amber-700",
    rejected: "bg-red-100 text-red-700",
  };

  const statusLabels: Record<string, string> = {
    withdrawal_approved: "Approved",
    withdrawal_requested: "Pending",
    rejected: "Rejected",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Earnings</h1>

        <EarningsOverview
          data={earningsOverview}
          onWithdraw={() => setShowWithdrawModal(true)}
        />

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("transactions")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "transactions"
                    ? "border-[#14A800] text-[#14A800]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Transactions
              </button>
              <button
                onClick={() => setActiveTab("withdrawals")}
                className={`px-6 py-4 text-sm font-medium border-b-2 ${
                  activeTab === "withdrawals"
                    ? "border-[#14A800] text-[#14A800]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Withdrawal History
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "transactions" && (
              <>
                <PeriodFilter
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={handlePeriodChange}
                  customDateRange={customDateRange}
                  onCustomDateChange={handleCustomDateChange}
                />

                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#14A800]"></div>
                  </div>
                ) : (
                  <>
                    <TransactionsTable transactions={transactions} />
                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-6"
                      />
                    )}
                  </>
                )}
              </>
            )}

            {activeTab === "withdrawals" && (
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <button
                    onClick={() => setWithdrawStatusFilter("all")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      withdrawStatusFilter === "all"
                        ? "bg-[#14A800] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setWithdrawStatusFilter("withdrawal_requested")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      withdrawStatusFilter === "withdrawal_requested"
                        ? "bg-[#14A800] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setWithdrawStatusFilter("withdrawal_approved")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      withdrawStatusFilter === "withdrawal_approved"
                        ? "bg-[#14A800] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setWithdrawStatusFilter("rejected")}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      withdrawStatusFilter === "rejected"
                        ? "bg-[#14A800] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Rejected
                  </button>
                </div>

                {withdrawals.length === 0 ? (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-2 text-gray-500">No withdrawal requests</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {withdrawals.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => handleViewWithdrawal(w.id)}
                        className="p-5 bg-white border border-gray-200 rounded-lg hover:border-[#14A800] hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="text-2xl font-bold text-gray-900">
                                ₹{w.amount.toLocaleString("en-IN")}
                              </p>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  statusColors[w.status] ||
                                  "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {statusLabels[w.status] || w.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {w.description}
                            </p>
                            {w.note && (
                              <p className="text-sm text-gray-500 italic">
                                Note: {w.note}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">
                              {new Date(w.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(w.createdAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {withdrawTotalPages > 1 && (
                  <Pagination
                    currentPage={withdrawPage}
                    totalPages={withdrawTotalPages}
                    onPageChange={setWithdrawPage}
                    className="mt-6"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showWithdrawModal && (
        <WithdrawModal
          available={earningsOverview.available}
          onClose={() => setShowWithdrawModal(false)}
          onSuccess={() => {
            fetchEarningsOverview();
            if (activeTab === "withdrawals") {
              fetchWithdrawals();
            }
          }}
        />
      )}

      {showWithdrawalDetail && (
        <WithdrawalDetailModal
          withdrawal={selectedWithdrawal}
          onClose={() => {
            setShowWithdrawalDetail(false);
            setSelectedWithdrawal(null);
          }}
        />
      )}
    </div>
  );
};

export default FreelancerEarnings;
