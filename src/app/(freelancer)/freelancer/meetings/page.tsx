"use client";
import { useState, useEffect, useCallback, useMemo } from 'react';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import { IFreelancerMeetingListItem, IFreelancerMeetingDetail } from '@/types/interfaces/IFreelancerMeeting';
import { MeetingsTable } from './components/MeetingsTable';
import { MeetingDetailModal } from './components/MeetingDetailModal';
import toast from 'react-hot-toast';

type TabType = 'needs_acceptance' | 'upcoming' | 'reschedule_requested' | 'ended';

export default function FreelancerMeetingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('needs_acceptance');
  const [meetings, setMeetings] = useState<IFreelancerMeetingListItem[]>([]);
  const [selectedMeeting, setSelectedMeeting] = useState<IFreelancerMeetingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});

  const statusMapping: Record<TabType, string | undefined> = {
    needs_acceptance: 'proposed',
    upcoming: 'accepted',
    reschedule_requested: 'reschedule_requested',
    ended: 'completed',
  };

  const loadMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const status = statusMapping[activeTab];
      const response = await freelancerActionApi.getMeetings({
        page,
        limit: 10,
        status: status as 'proposed' | 'accepted' | 'completed' | 'missed' | 'partial_missed' | 'reschedule_requested',
      });

      if (response?.success) {
        setMeetings(response.data.items || []);
        setTotalPages(response.data.pages || 1);
        setTotalCount(response.data.total || 0);
      } else {
        toast.error(response?.message || 'Failed to load meetings');
      }
    } catch (error) {
      toast.error('Failed to load meetings');
    } finally {
      setLoading(false);
    }
  }, [activeTab, page]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  const handleViewMeeting = useCallback(async (meetingId: string) => {
    try {
      const response = await freelancerActionApi.getMeetingDetail(meetingId);
      if (response?.success) {
        setSelectedMeeting(response.data);
      } else {
        toast.error(response?.message || 'Failed to load meeting details');
      }
    } catch (error) {
      toast.error('Failed to load meeting details');
    }
  }, []);

  const handleAcceptMeeting = useCallback(async (meetingId: string) => {
    try {
      const response = await freelancerActionApi.acceptMeeting({ meetingId });
      if (response?.success) {
        toast.success('Meeting accepted successfully');
        loadMeetings();
      } else {
        toast.error(response?.message || 'Failed to accept meeting');
      }
    } catch (error) {
      toast.error('Failed to accept meeting');
    }
  }, [loadMeetings]);

  const handleRequestReschedule = useCallback(async (meetingId: string, proposedTime: string) => {
    try {
      const response = await freelancerActionApi.requestMeetingReschedule({
        meetingId,
        proposedTime,
      });
      if (response?.success) {
        toast.success('Reschedule request sent successfully');
        loadMeetings();
      } else {
        toast.error(response?.message || 'Failed to request reschedule');
      }
    } catch (error) {
      toast.error('Failed to request reschedule');
    }
  }, [loadMeetings]);

  const badgeColors = useMemo(
    () => ({
      proposed: '#f59e0b',
      accepted: '#10b981',
      completed: '#3b82f6',
      missed: '#ef4444',
      reschedule_requested: '#8b5cf6',
    }),
    [],
  );

  const getTabCount = (tab: TabType) => {
    return meetings.length;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-800">My Meetings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your meetings with clients
            </p>
          </div>

          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('needs_acceptance');
                setPage(1);
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'needs_acceptance'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Needs Acceptance
              {activeTab === 'needs_acceptance' && totalCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('upcoming');
                setPage(1);
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Upcoming Meetings
            </button>

            <button
              onClick={() => {
                setActiveTab('reschedule_requested');
                setPage(1);
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'reschedule_requested'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Reschedule Requested
            </button>

            <button
              onClick={() => {
                setActiveTab('ended');
                setPage(1);
              }}
              className={`flex-shrink-0 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'ended'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ended Meetings
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <MeetingsTable
            items={meetings}
            onView={handleViewMeeting}
            search={search}
            setSearch={setSearch}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            totalCount={totalCount}
            activeFilters={filters}
            setFilters={setFilters}
            badgeColors={badgeColors}
          />
        )}

        {selectedMeeting && (
          <MeetingDetailModal
            meeting={selectedMeeting}
            onClose={() => setSelectedMeeting(null)}
            onAccept={handleAcceptMeeting}
            onReschedule={handleRequestReschedule}
          />
        )}
      </div>
    </div>
  );
}
