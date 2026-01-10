import React, { Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import { IFreelancerMeetingListItem } from '@/types/interfaces/IFreelancerMeeting';
import GenericTable, { Column, Filter } from '@/components/admin/Table';

interface Props {
  items: IFreelancerMeetingListItem[];
  onView: (meetingId: string) => void;
  search?: string;
  setSearch?: Dispatch<SetStateAction<string>>;
  page?: number;
  setPage?: Dispatch<SetStateAction<number>>;
  totalPages?: number;
  totalCount?: number;
  activeFilters?: Record<string, string>;
  setFilters?: (filters: Record<string, string>) => void;
  badgeColors?: Record<string, string>;
}

export function MeetingsTable({
  items,
  onView,
  search,
  setSearch,
  page,
  setPage,
  totalPages,
  totalCount,
  activeFilters,
  setFilters,
  badgeColors,
}: Props) {
  const columns: Column<IFreelancerMeetingListItem>[] = useMemo(
    () => [
      { key: 'contractTitle', label: 'Contract' },
      { key: 'scheduledAt', label: 'Scheduled' },
      { key: 'durationMinutes', label: 'Duration' },
      { key: 'type', label: 'Type' },
      { key: 'status', label: 'Status' },
    ],
    [],
  );

  const filters: Filter[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'All Statuses',
        options: [
          { id: 'proposed', name: 'Proposed' },
          { id: 'accepted', name: 'Accepted' },
          { id: 'completed', name: 'Completed' },
          { id: 'missed', name: 'Missed' },
          { id: 'reschedule_requested', name: 'Reschedule Requested' },
        ],
      },
    ],
    [],
  );

  const handleViewModal = useCallback(
    (row: IFreelancerMeetingListItem) => {
      onView(row.meetingId);
    },
    [onView],
  );

  const searchKeys = useMemo(() => ['contractTitle'] as (keyof IFreelancerMeetingListItem)[], []);
  const badgeKeysList = useMemo(() => ['status'] as (keyof IFreelancerMeetingListItem)[], []);

  const formattedItems = useMemo(() => {
    return items.map((item) => ({
      ...item,
      scheduledAt: new Date(item.scheduledAt).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      durationMinutes: `${item.durationMinutes} min`,
    }));
  }, [items]);

  return (
    <GenericTable<IFreelancerMeetingListItem>
      title="Meetings"
      columns={columns}
      data={formattedItems}
      filters={filters}
      viewOnly={true}
      handleOpenViewModal={handleViewModal}
      badgeKeys={badgeKeysList}
      badgeColors={badgeColors}
      search={search}
      setSearch={setSearch}
      page={page}
      setPage={setPage}
      totalPages={totalPages}
      totalCount={totalCount}
      activeFilters={activeFilters}
      setFilters={setFilters}
      searchKeys={searchKeys}
    />
  );
}
