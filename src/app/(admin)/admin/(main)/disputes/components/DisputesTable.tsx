"use client";
import React, { Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import { IAdminDisputeListItem } from '@/types/interfaces/IAdminDisputeList';
import GenericTable, { Column, Filter } from '@/components/admin/Table';
import { DISPUTE_REASON_LABELS } from '@/constants/dispute.constants';

interface Props {
  items: IAdminDisputeListItem[];
  onView: (id: string) => void;
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

function DisputesTableComponent({
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
  const columns: Column<IAdminDisputeListItem>[] = useMemo(
    () => [
      { key: 'disputeId', label: 'Dispute ID' },
      { key: 'contractTitle', label: 'Contract Title' },
      { key: 'raisedByDisplay', label: 'Raised By' },
      { key: 'reasonCodeDisplay', label: 'Dispute Type' },
      { key: 'createdAt', label: 'Date Raised' },
      { key: 'status', label: 'Status' },
    ],
    [],
  );

  const filters: Filter[] = useMemo(
    () => [
      {
        key: 'reasonCode',
        label: 'All Dispute Types',
        options: Object.entries(DISPUTE_REASON_LABELS).map(([code, label]) => ({
          id: code,
          name: label,
        })),
      },
    ],
    [],
  );

  const processedItems = useMemo(() => {
    return items.map((item) => {
      const contractTitle = item.contractTitle.length > 50 
        ? `${item.contractTitle.substring(0, 50)}...` 
        : item.contractTitle;

      return {
        ...item,
        contractTitle,
        raisedByDisplay: `${item.raisedBy.name} (${item.raisedBy.role.toUpperCase()})`,
        reasonCodeDisplay: DISPUTE_REASON_LABELS[item.reasonCode] || item.reasonCode,
      };
    });
  }, [items]);

  const handleViewModal = useCallback(
    (row: IAdminDisputeListItem) => {
      onView(row.id);
    },
    [onView],
  );

  const searchKeys = useMemo(
    () => ['disputeId', 'contractTitle'] as (keyof IAdminDisputeListItem)[],
    [],
  );

  const badgeKeysList = useMemo(
    () => ['status'] as (keyof IAdminDisputeListItem)[],
    [],
  );

  return (
    <GenericTable<IAdminDisputeListItem>
      title="Disputes"
      columns={columns}
      data={processedItems}
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
      editButtonLabel="Review"
    />
  );
}

export const DisputesTable = React.memo(DisputesTableComponent);
