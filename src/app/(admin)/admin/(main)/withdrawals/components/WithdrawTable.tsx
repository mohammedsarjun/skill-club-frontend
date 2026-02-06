"use client";

import React, { useEffect, useState } from "react";
import GenericTable, { Column, Filter } from "../../../../../../components/admin/Table";
import AdminActionApi from "@/api/action/AdminActionApi";
import { IWithdrawalItem, IWithdrawalsResponse } from '@/types/interfaces/IWithdrawals';
import toast from "react-hot-toast";

type Props = {
  roleFilter?: string | undefined;
  statusFilter?: string | undefined;
  onWithdrawalUpdate?: () => void;
};

type WithdrawalDetailsModalProps = {
  withdrawal: IWithdrawalItem | null;
  onClose: () => void;
  onApprove: (withdrawalId: string) => void;
  onReject: (withdrawalId: string, reason: string) => void;
};

const WithdrawalDetailsModal = ({
  withdrawal,
  onClose,
  onApprove,
  onReject,
}: WithdrawalDetailsModalProps) => {
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

  if (!withdrawal) return null;

  const statusColors: Record<string, string> = {
    "withdrawal_approved": "bg-green-100 text-green-800",
    "withdrawal_requested": "bg-amber-100 text-amber-800",
    "rejected": "bg-red-100 text-red-800"
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    onReject(withdrawal.id, rejectReason);
    setRejectReason("");
    setShowRejectInput(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold">Withdrawal Details</h2>
              <p className="text-blue-100 mt-1">{withdrawal.transaction.transactionId}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Transaction Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{withdrawal.transaction.amount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${statusColors[withdrawal.transaction.status] || 'bg-gray-100 text-gray-800'}`}>
                  {withdrawal.transaction.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Purpose</p>
                <p className="text-base font-medium text-gray-900 capitalize">{withdrawal.transaction.purpose}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="text-base font-medium text-gray-900">
                  {new Date(withdrawal.transaction.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p className="text-base text-gray-900">{withdrawal.transaction.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {withdrawal.role === 'freelancer' ? 'Freelancer' : 'Client'} Details
            </h3>
            <div className="flex items-start gap-4 mb-4">
              <img 
                src={withdrawal.user.avatar} 
                alt={withdrawal.user.name}
                className="w-16 h-16 rounded-full border-2 border-purple-200"
                onError={(e) => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(withdrawal.user.name)}&background=random`;
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-semibold text-gray-900">{withdrawal.user.name}</h4>
                  {withdrawal.user.isVerified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600">{withdrawal.user.profile.professionalRole}</p>
                <p className="text-sm text-purple-600 font-medium">{withdrawal.user.profile.workCategory}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-sm font-medium text-gray-900">{withdrawal.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-sm font-medium text-gray-900">{withdrawal.user.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hourly Rate</p>
                <p className="text-sm font-medium text-gray-900">₹{withdrawal.user.profile.hourlyRate}/hr</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <div className="flex gap-2 mt-1">
                  {withdrawal.user.isBlocked ? (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Blocked</span>
                  ) : (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Bank Account Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Account Holder</p>
                <p className="text-base font-medium text-gray-900">{withdrawal.bankDetails.accountHolderName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Bank Name</p>
                <p className="text-base font-medium text-gray-900">{withdrawal.bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Number</p>
                <p className="text-base font-mono text-gray-900">{withdrawal.bankDetails.accountNumberMasked}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">IFSC Code</p>
                <p className="text-base font-mono text-gray-900">{withdrawal.bankDetails.ifscCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <p className="text-base font-medium text-gray-900 capitalize">{withdrawal.bankDetails.accountType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Verification Status</p>
                {withdrawal.bankDetails.verified ? (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-600">Verified</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-amber-600">Not Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Close
            </button>
            {withdrawal.transaction.status === "withdrawal_requested" ? (
              <>
                <button 
                  onClick={() => onApprove(withdrawal.id)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Approve
                </button>
                {!showRejectInput ? (
                  <button 
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Reject
                  </button>
                ) : (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Rejection reason..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      onClick={handleReject}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WithdrawalListingPage({ roleFilter, statusFilter, onWithdrawalUpdate }: Props) {
  const [withdrawals, setWithdrawals] = useState<IWithdrawalItem[]>([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<IWithdrawalItem | null>(null);
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchList();
  }, [page, roleFilter, statusFilter]);

  async function fetchList() {
    try {
      setLoading(true);
      const res = await AdminActionApi.getWithdrawals(page, limit, { role: roleFilter, status: statusFilter });
      if (res?.success) {
        const data = res.data as IWithdrawalsResponse;
        setWithdrawals(data.items || []);
        setTotal(data.total || 0);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(withdrawalId: string) {
    try {
      const res = await AdminActionApi.approveWithdrawal(withdrawalId);
      if (res?.success) {
        toast.success('Withdrawal approved successfully');
        setSelectedWithdrawal(null);
        fetchList();
        onWithdrawalUpdate?.();
      } else {
        toast.error(res?.message || 'Failed to approve withdrawal');
      }
    } catch (error) {
      toast.error('Failed to approve withdrawal');
    }
  }

  async function handleReject(withdrawalId: string, reason: string) {
    try {
      const res = await AdminActionApi.rejectWithdrawal(withdrawalId, reason);
      if (res?.success) {
        toast.success('Withdrawal rejected successfully');
        setSelectedWithdrawal(null);
        fetchList();
        onWithdrawalUpdate?.();
      } else {
        toast.error(res?.message || 'Failed to reject withdrawal');
      }
    } catch (error) {
      toast.error('Failed to reject withdrawal');
    }
  }

  async function handleView(row: { id: string }) {
    try {
      const res = await AdminActionApi.getWithdrawalDetail(row.id);
      if (res?.success) {
        setSelectedWithdrawal(res.data);
      } else {
        toast.error('Failed to load withdrawal details');
      }
    } catch (error) {
      toast.error('Failed to load withdrawal details');
    }
  }

  const tableData = withdrawals.map((w) => ({
    id: w.id,
    transactionId: w.transaction.transactionId,
    name: w.user.name,
    amount: w.transaction.amount,
    status: w.transaction.status,
    role: w.role,
    createdAt: new Date(w.transaction.createdAt).toLocaleDateString('en-IN'),
  }));

  type TableRow = {
    id: string;
    transactionId: string;
    name: string;
    amount: number;
    status: string;
    role: string;
    createdAt: string;
  };

  const columns: Column<TableRow>[] = [
    { key: "transactionId", label: "Transaction ID" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount (₹)" },
    { key: "status", label: "Status" },
    { key: "role", label: "User Type" },
    { key: "createdAt", label: "Date" }
  ];

  const filters: Filter[] = [
    {
      key: "role",
      label: "Filter by User Type",
      options: [
        { id: "client", name: "Client" },
        { id: "freelancer", name: "Freelancer" }
      ]
    },
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { id: "withdrawal_approved", name: "Approved" },
        { id: "withdrawal_requested", name: "Requested" },
        { id: "rejected", name: "Rejected" }
      ]
    }
  ];

  const badgeColors: Record<string, string> = {
    "withdrawal_approved": "#10b981",
    "withdrawal_requested": "#f59e0b",
    "rejected": "#ef4444",
    "client": "#8b5cf6",
    "freelancer": "#06b6d4"
  };

  return (
    <>
      <GenericTable<TableRow>
        title="Withdrawal Requests"
        columns={columns}
        data={tableData}
        filters={filters}
        pageSize={limit}
        searchKeys={["transactionId", "name"]}
        badgeKeys={["status", "role"]}
        badgeColors={badgeColors}
        onView={handleView}
        viewOnly={true}
      />

      <WithdrawalDetailsModal 
        withdrawal={selectedWithdrawal} 
        onClose={() => setSelectedWithdrawal(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <div className="mt-2 text-sm text-gray-600">Total: {total}</div>
    </>
  );
}