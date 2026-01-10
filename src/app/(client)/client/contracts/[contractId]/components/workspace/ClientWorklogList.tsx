"use client";
import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { clientActionApi } from '@/api/action/ClientActionApi';
import Swal from 'sweetalert2';
import Table from '@/components/admin/Table';
import { IWorklogListItem, IWorklogDetail } from '@/types/interfaces/IClientWorklog';
import { FaClock } from 'react-icons/fa';

const WorklogDetailModal = dynamic(() => 
  import('./WorklogDetailModal').then(mod => ({ default: mod.WorklogDetailModal })),
  { ssr: false }
);

interface ClientWorklogListProps {
  contractId: string;
}

export const ClientWorklogList = ({ contractId }: ClientWorklogListProps) => {
  const [worklogs, setWorklogs] = useState<IWorklogListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedWorklog, setSelectedWorklog] = useState<IWorklogDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

      const response = await clientActionApi.getContractWorklogs(contractId, params);
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

  const handleViewWorklog = async (worklog: IWorklogListItem) => {
    try {
      const response = await clientActionApi.getWorklogDetail(contractId, worklog.worklogId);
      if (response?.success && response.data) {
        setSelectedWorklog(response.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to load worklog details', 'error');
    }
  };

  const handleApprove = async (worklogId: string, message?: string) => {
    try {
      const response = await clientActionApi.approveWorklog(contractId, { worklogId, message });
      if (response?.success) {
        Swal.fire('Success', 'Worklog approved successfully', 'success');
        setShowDetailModal(false);
        loadWorklogs();
      } else {
        Swal.fire('Error', response.message || 'Failed to approve worklog', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to approve worklog', 'error');
    }
  };

  const handleReject = async (worklogId: string, message: string) => {
    try {
      const response = await clientActionApi.rejectWorklog(contractId, { worklogId, message });
      if (response?.success) {
        Swal.fire('Success', 'Worklog rejected', 'success');
        setShowDetailModal(false);
        loadWorklogs();
      } else {
        Swal.fire('Error', response.message || 'Failed to reject worklog', 'error');
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to reject worklog', 'error');
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
      {tableData.length === 0 ? (
             <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
               <FaClock className="mx-auto text-5xl text-gray-300 mb-3" />
               <p className="text-gray-500">No timesheets submitted yet</p>
             </div>
      ) : (
        <Table
          title="Freelancer Worklogs"
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
        <WorklogDetailModal
          worklog={selectedWorklog}
          onClose={() => setShowDetailModal(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </>
  );
};
