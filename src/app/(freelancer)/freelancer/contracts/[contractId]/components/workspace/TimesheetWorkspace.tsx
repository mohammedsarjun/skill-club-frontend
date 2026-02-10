"use client";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import Swal from 'sweetalert2';
import Table from '@/components/admin/Table';
import { IFreelancerWorklogListItem, IFreelancerWorklogDetail } from '@/types/interfaces/IFreelancerWorklog';
import { FaClock } from 'react-icons/fa';

const FreelancerWorklogDetailModal = dynamic<{ worklog: IFreelancerWorklogDetail; onClose: () => void; onRaiseDispute: (worklogId: string) => void }>(
  () => import('./FreelancerWorklogDetailModal').then(mod => ({ default: mod.FreelancerWorklogDetailModal })),
  { ssr: false }
);

const RaiseWorklogDisputeModal = dynamic(
  () => import('./RaiseWorklogDisputeModal').then(mod => ({ default: mod.RaiseWorklogDisputeModal })),
  { ssr: false }
);

interface TimesheetWorkspaceProps {
  contractId: string;
}

export const TimesheetWorkspace = ({ contractId }: TimesheetWorkspaceProps) => {
  const [worklogs, setWorklogs] = useState<IFreelancerWorklogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedWorklog, setSelectedWorklog] = useState<IFreelancerWorklogDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeWorklogId, setDisputeWorklogId] = useState<string>('');

  const loadWorklogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: { page: number; limit: number; status?: string } = {
        page,
        limit: 10,
      };
      if (activeFilters.status) {
        params.status = activeFilters.status;
      }

      const response = await freelancerActionApi.getContractWorklogsList(contractId, params);
      if (response?.success && response.data) {
        setWorklogs(response.data.items || []);
        setTotalPages(response.data.pages || 1);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error loading worklogs:', error);
    } finally {
      setLoading(false);
    }
  }, [contractId, page, activeFilters]);

  useEffect(() => {
    loadWorklogs();
  }, [loadWorklogs]);

  const handleViewWorklog = async (worklog: IFreelancerWorklogListItem) => {
    try {
      const response = await freelancerActionApi.getWorklogDetail(contractId, worklog.worklogId);
      if (response?.success && response.data) {
        setSelectedWorklog(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load worklog details', 'error');
    }
  };

  const handleRaiseDispute = (worklogId: string) => {
    setDisputeWorklogId(worklogId);
    setShowDetailModal(false);
    setShowDisputeModal(true);
  };

  const handleSubmitDispute = async (worklogId: string, description: string) => {
    try {
      const response = await freelancerActionApi.raiseWorklogDispute(contractId, {
        worklogId,
        description,
      });
      if (response?.success) {
        Swal.fire('Success', 'Dispute raised successfully', 'success');
        loadWorklogs();
      } else {
        Swal.fire('Error', response.message || 'Failed to raise dispute', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to raise dispute', 'error');
    }
  };

  const formatDuration = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const tableData = worklogs.map((w) => ({
    ...w,
    startTime: formatDate(w.startTime),
    endTime: formatDate(w.endTime),
    duration: formatDuration(w.duration),
    submittedAt: formatDate(w.submittedAt),
  }));

  const columns = [
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'duration', label: 'Duration' },
    { key: 'filesCount', label: 'Files' },
    { key: 'status', label: 'Status' },
    { key: 'submittedAt', label: 'Submitted At' },
  ];

  const filters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { id: '', name: 'All' },
        { id: 'submitted', name: 'Submitted' },
        { id: 'approved', name: 'Approved' },
        { id: 'rejected', name: 'Rejected' },
      ],
    },
  ];

  return (
    <>
      {tableData.length === 0 && !loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FaClock className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500">No timesheets submitted yet</p>
        </div>
      ) : (
        <Table
          title="My Worklogs"
          columns={columns}
          data={tableData}
          filters={filters}
          onView={handleViewWorklog}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          totalCount={totalCount}
          viewOnly={true}
          setFilters={setActiveFilters}
          activeFilters={activeFilters}
          badgeKeys={['status']}
          badgeColors={{
            submitted: '#f59e0b',
            approved: '#10b981',
            rejected: '#ef4444',
          }}
        />
      )}

      {showDetailModal && selectedWorklog && (
        <FreelancerWorklogDetailModal
          worklog={selectedWorklog}
          onClose={() => setShowDetailModal(false)}
          onRaiseDispute={handleRaiseDispute}
        />
      )}

      {showDisputeModal && (
        <RaiseWorklogDisputeModal
          worklogId={disputeWorklogId}
          onClose={() => setShowDisputeModal(false)}
          onSubmit={handleSubmitDispute}
        />
      )}
    </>
  );
};
