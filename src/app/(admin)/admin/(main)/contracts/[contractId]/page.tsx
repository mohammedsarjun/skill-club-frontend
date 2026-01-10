"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminActionApi from '@/api/action/AdminActionApi';
import Swal from 'sweetalert2';
import { IAdminContractDetail } from '@/types/interfaces/IAdminContractDetail';

export default function ContractDetailPage() {
  const [contract, setContract] = useState<IAdminContractDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();
  const contractId = params.contractId as string;

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      try {
        const response = await AdminActionApi.getContractDetail(contractId);
        if (response?.success && response.data) {
          setContract(response.data);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: response?.message || 'Failed to fetch contract details',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An unexpected error occurred',
        });
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      fetchContract();
    }
  }, [contractId]);

  const formatDate = (date: Date | string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number | undefined, currency: string) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_funding: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading contract details...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Contract not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <button
        onClick={() => router.push('/admin/contracts')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Back to Contracts
      </button>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
            <p className="text-gray-600 mt-1">Contract ID: {contract.contractId}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(contract.status)}`}>
            {contract.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          {contract.client ? (
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {contract.client.firstName} {contract.client.lastName}</p>
              {contract.client.companyName && (
                <p><span className="font-medium">Company:</span> {contract.client.companyName}</p>
              )}
              {contract.client.country && (
                <p><span className="font-medium">Country:</span> {contract.client.country}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No client information available</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Freelancer Information</h2>
          {contract.freelancer ? (
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {contract.freelancer.firstName} {contract.freelancer.lastName}</p>
              {contract.freelancer.country && (
                <p><span className="font-medium">Country:</span> {contract.freelancer.country}</p>
              )}
              {contract.freelancer.rating && (
                <p><span className="font-medium">Rating:</span> {contract.freelancer.rating} / 5</p>
              )}
            </div>
          ) : (
            <p className="text-gray-500">No freelancer information available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Payment Type</p>
            <p className="font-medium">{contract.paymentType.replace('_', ' ').toUpperCase()}</p>
          </div>
          {contract.budget && (
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium">{formatCurrency(contract.budget, contract.currency)}</p>
            </div>
          )}
          {contract.hourlyRate && (
            <div>
              <p className="text-sm text-gray-600">Hourly Rate</p>
              <p className="font-medium">{formatCurrency(contract.hourlyRate, contract.currency)}/hr</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">Funded Amount</p>
            <p className="font-medium">{formatCurrency(contract.fundedAmount, contract.currency)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="font-medium">{formatCurrency(contract.totalPaid, contract.currency)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Balance</p>
            <p className="font-medium">{formatCurrency(contract.balance, contract.currency)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Project Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Description</p>
            <p className="mt-1">{contract.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{formatDate(contract.expectedStartDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">End Date</p>
              <p className="font-medium">{formatDate(contract.expectedEndDate)}</p>
            </div>
          </div>
        </div>
      </div>

      {contract.milestones && contract.milestones.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Milestones</h2>
          <div className="space-y-3">
            {contract.milestones.map((milestone, index) => (
              <div key={milestone.milestoneId || index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{milestone.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Due: {formatDate(milestone.expectedDelivery)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(milestone.amount, contract.currency)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(milestone.status)}`}>
                      {milestone.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contract.timesheets && contract.timesheets.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Timesheets</h2>
          <div className="space-y-3">
            {contract.timesheets.map((timesheet, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Week {formatDate(timesheet.weekStart)} - {formatDate(timesheet.weekEnd)}</p>
                    <p className="text-sm text-gray-600">{timesheet.totalHours} hours</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(timesheet.totalAmount, contract.currency)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(timesheet.status)}`}>
                      {timesheet.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contract.communication && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Communication Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Preferred Method</p>
              <p className="font-medium">{contract.communication.preferredMethod?.replace('_', ' ')}</p>
            </div>
            {contract.communication.meetingFrequency && (
              <div>
                <p className="text-sm text-gray-600">Meeting Frequency</p>
                <p className="font-medium">{contract.communication.meetingFrequency}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Metadata</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Created At</p>
            <p className="font-medium">{formatDate(contract.createdAt)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last Updated</p>
            <p className="font-medium">{formatDate(contract.updatedAt)}</p>
          </div>
          {contract.jobId && (
            <div>
              <p className="text-sm text-gray-600">Job ID</p>
              <p className="font-medium">{contract.jobId}</p>
            </div>
          )}
          {contract.offerId && (
            <div>
              <p className="text-sm text-gray-600">Offer ID</p>
              <p className="font-medium">{contract.offerId}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
