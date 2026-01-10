import React, { Dispatch, SetStateAction, useMemo, useCallback } from 'react';
import { IFreelancerContractListItemDTO } from '@/types/interfaces/IFreelancerContractList';
import GenericTable, { Column, Filter } from '@/components/admin/Table';

interface Props {
  items: IFreelancerContractListItemDTO[];
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

export function ContractsTable({
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
  const columns: Column<IFreelancerContractListItemDTO>[] = useMemo(
    () => [
      { key: 'contractId', label: 'ID' },
      { key: 'title', label: 'Title' },
      { key: 'paymentType', label: 'Type' },
      { key: 'budget', label: 'Budget' },
      { key: 'createdAt', label: 'Created' },
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
          { id: 'pending_funding', name: 'Pending Funding' },
          { id: 'active', name: 'Active' },
          { id: 'completed', name: 'Completed' },
          { id: 'cancelled', name: 'Cancelled' },
          { id: 'refunded', name: 'Refunded' },
        ],
      },
    ],
    [],
  );

  const handleViewModal = useCallback(
    (row: IFreelancerContractListItemDTO) => {
      onView(row.id);
    },
    [onView],
  );

  const searchKeys = useMemo(() => ['title', 'contractId'] as (keyof IFreelancerContractListItemDTO)[], []);
  const badgeKeysList = useMemo(() => ['status'] as (keyof IFreelancerContractListItemDTO)[], []);

  return (
    <GenericTable<IFreelancerContractListItemDTO>
      title="Contracts"
      columns={columns}
      data={items}
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
