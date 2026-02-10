"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle, DollarSign } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { adminActionApi } from '@/api/adminActionApi';
import { IAdminDisputeDetail } from '@/types/interfaces/IAdminDisputeDetail';
import { DisputeOverview } from './components/DisputeOverview';
import { ContractDetails } from './components/ContractDetails';
import { DeliverablesTab } from './components/DeliverablesTab';
import { MilestonesTab } from './components/MilestonesTab';
import { AdminSplitFundsModal } from './components/AdminSplitFundsModal';
import { WorklogCard } from './components/WorkLogCard';
import { ContractTimeline } from '@/components/common/ContractTimeline';
const DisputeDetailsPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dispute, setDispute] = useState<IAdminDisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSplitModal, setShowSplitModal] = useState(false);
  
  const params = useParams();
  const router = useRouter();
  const disputeId = params.disputeId as string;

  useEffect(() => {
    const loadDisputeDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await adminActionApi.getDisputeDetail(disputeId);
        console.log('Dispute detail response:', response);
        if (response.success && response.data) {
          setDispute(response.data);
        } else {
          setError(response.message || 'Failed to load dispute details');
        }
      } catch (err) {
        setError('An error occurred while loading dispute details');
      } finally {
        setLoading(false);
      }
    };

    if (disputeId) {
      loadDisputeDetail();
    }
  }, [disputeId]);

  const handleSplitFunds = async (clientPercentage: number, freelancerPercentage: number) => {
    try {
      const response = await adminActionApi.splitDisputeFunds(disputeId, {
        clientPercentage,
        freelancerPercentage
      });
      
      if (response.success) {
        toast.success(response.message || 'Funds split successfully');
        setShowSplitModal(false);
        const updatedResponse = await adminActionApi.getDisputeDetail(disputeId);
        if (updatedResponse.success && updatedResponse.data) {
          setDispute(updatedResponse.data);
        }
      } else {
        toast.error(response.message || 'Failed to split funds');
      }
    } catch (err) {
      toast.error('An error occurred while splitting funds');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-blue-100 text-blue-800',
      resolved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-600">Loading dispute details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !dispute) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-600">{error || 'Dispute not found'}</p>
            <button
              onClick={() => router.push('/admin/disputes')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Disputes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const tabs = ['overview', 'contract'];
  if (dispute.contract.paymentType === 'fixed' && dispute.deliverables) {
    tabs.push('deliverables');
  }
  if (dispute.contract.paymentType === 'fixed_with_milestones' && dispute.milestones) {
    tabs.push('milestones');
  }

    if (dispute.contract.paymentType === 'hourly') {
    tabs.push('worklog');
  }
  
  tabs.push('timeline');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Dispute {dispute.disputeId}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(dispute.status)}`}>
                  {dispute.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              <p className="text-gray-600">Contract: {dispute.contract.contractId} - {dispute.contract.title}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Raised by</p>
              <p className="font-semibold text-gray-900 capitalize">{dispute.raisedBy}</p>
            </div>
          </div>
        </div>

        {dispute.holdTransaction && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-orange-600 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-900 mb-1">Amount on Hold</h3>
              <p className="text-orange-800 text-sm mb-2">{dispute.holdTransaction.description}</p>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-orange-600" />
                <span className="text-2xl font-bold text-orange-900">
                  ${dispute.holdTransaction.amount.toLocaleString()}
                </span>
                <span className="text-sm text-orange-700">
                  held since {new Date(dispute.holdTransaction.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            {dispute.contract.paymentType === 'fixed_with_milestones' && 
             (dispute.status === 'open' || dispute.status === 'under_review') && (
              <button
                onClick={() => setShowSplitModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Split Money
              </button>
            )}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <div className="flex gap-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <DisputeOverview dispute={dispute} contract={dispute.contract} />}
            {activeTab === 'contract' && <ContractDetails contract={dispute.contract} />}
            {activeTab === 'deliverables' && dispute.deliverables && (
              <DeliverablesTab deliverables={dispute.deliverables} />
            )}
            {activeTab === 'milestones' && dispute.milestones && (
              <MilestonesTab milestones={dispute.milestones} scopeId={dispute.scopeId || undefined} />
            )}
            {activeTab === 'worklog' && dispute.workLog && <WorklogCard data={dispute.workLog} disputeId={dispute.disputeId} />}
            {activeTab === 'timeline' && (
              <ContractTimeline 
                contractId={dispute.contract.contractId} 
                role="admin"
              />
            )}
          </div>
        </div>

        {dispute.holdTransaction && (
          <AdminSplitFundsModal
            isOpen={showSplitModal}
            onClose={() => setShowSplitModal(false)}
            heldAmount={dispute.holdTransaction.amount}
            onSubmit={handleSplitFunds}
          />
        )}
      </div>
    </div>
  );
};

export default DisputeDetailsPage;