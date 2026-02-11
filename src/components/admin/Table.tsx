import React, { useState, useMemo, Dispatch, SetStateAction } from "react";

// ===== Icons (inline SVG) =====
const EditIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

// ===== Utility to Render Table Cell =====
const renderCell = (value: unknown): React.ReactNode => {
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span
        key={index}
        className="inline-block px-2 py-1 mx-1 rounded-lg bg-blue-500 text-white text-xs"
      >
        {typeof item === "string"
          ? item
          : (item as { name?: string })?.name ?? JSON.stringify(item)}
      </span>
    ));
  }

  if (typeof value === "object" && value !== null) {
    return (value as { name?: string })?.name ?? JSON.stringify(value);
  }

  return String(value ?? "");
};

// ===== Type Definitions =====
export interface Column<T> {
  // allow string keys too so pages can pass unions or untyped columns
  key: keyof T | string;
  label: string;
}

interface FilterOption {
  id: string | number;
  name: string;
}

export interface Filter {
  key: string;
  label: string;
  options: FilterOption[];
}

interface TableProps<T extends object> {
  // Display
  title: string;
  columns: Column<T>[];
  data: any[];
  filters?: Filter[];
  addButtonLabel?: string;

  // Action handlers (support both old and new prop names for compatibility)
  onAdd?: () => void;
  handleOpenModal?: () => void;
  onEdit?: (row: any) => void;
  handleEditModal?: (row: any) => void;
  onDelete?: (row: any) => void;
  handleDelete?: (row: any) => void;
  onView?: (row: any) => void;
  handleOpenViewModal?: (row: any) => void;
  // Custom edit button label (can be a string or function that returns string based on row)
  editButtonLabel?: string | ((row: any) => string);
  editButtonClass?: string | ((row: any) => string);

  // Controls: allow parent to control pagination/search/filters if desired
  canDelete?: boolean;
  viewOnly?: boolean;
  // Controlled pagination/search: if provided, these override internal state
  page?: number;
  // Accept a React-style setState so pages can pass `setPage(prev => prev + 1)`
  setPage?: Dispatch<SetStateAction<number>>;
  search?: string;
  setSearch?: (s: string) => void;
  // If your data is server-paginated, parent can provide total counts/pages
  totalCount?: number;
  totalPages?: number;
  // Allow parent to receive filter changes (accept any shape used by pages)
  setFilters?: (filters: any) => void;
  activeFilters?: any;
  // Optional form fields (pages pass this through to control forms/modals)
  formFields?: any;

  // Misc
  pageSize?: number;
  searchKeys?: (keyof T)[];
  // Optional: render certain column values as colored capsules (badges).
  // badgeKeys: list of column keys that should render as badges
  badgeKeys?: (keyof T | string)[];
  // badgeColors: map from cell value (string) to CSS color (any valid CSS color)
  badgeColors?: Record<string, string>;
}

// ===== Main Table Component =====
function GenericTable<T extends Record<string, any> = any>(props: TableProps<T>) {
  const {
    title,
    columns,
    data,
    filters = [],
    addButtonLabel,

    // actions (either name may be used by pages)
    onAdd,
    handleOpenModal,
    onEdit,
    handleEditModal,
    onDelete,
    handleDelete,
    onView,
    handleOpenViewModal,
    editButtonLabel,
    editButtonClass,

    // controlled values
    canDelete = false,
    viewOnly = false,
    page: controlledPage,
    setPage: controlledSetPage,
    search: controlledSearch,
    setSearch: controlledSetSearch,
    setFilters: controlledSetFilters,
    activeFilters: controlledActiveFilters,
  totalCount: controlledTotalCount,
  totalPages: controlledTotalPages,

    pageSize = 10,
    searchKeys = [],
    badgeKeys = [],
    badgeColors = {},
  } = props;

  // Fallback badge color mapping for common statuses
  const defaultBadgeColor = (val: string) => {
    const v = String(val).toLowerCase();
    if (!v) return "#6b7280"; // gray-500
    if (v.includes("pending")) return "#f59e0b"; // amber-500
    if (v.includes("active") || v.includes("approved") || v.includes("verified")) return "#10b981"; // green-500
    if (v.includes("inactive") || v.includes("draft")) return "#6b7280"; // gray-500
    if (v.includes("rejected") || v.includes("deleted") || v.includes("blocked")) return "#ef4444"; // red-500
    return "#3b82f6"; // blue-500 default
  };

  console.log(data)
  // Internal state only used when parent doesn't supply controlled props
  const [internalPage, setInternalPage] = useState(1);
  const [internalSearch, setInternalSearch] = useState("");
  const [internalActiveFilters, setInternalActiveFilters] = useState<Record<string, string>>({});

  const page = controlledPage ?? internalPage;
  const setPage = controlledSetPage ?? setInternalPage;
  const search = controlledSearch ?? internalSearch;
  const setSearch = controlledSetSearch ?? setInternalSearch;
  const activeFilters = controlledActiveFilters ?? internalActiveFilters;


  const dataSnapshot = JSON.stringify(
    data?.map((d) => ({ id: (d as any).id ?? (d as any).jobId ?? (d as any).job_id ?? d })) ?? []
  );

  const filteredData = useMemo(() => {
    let result = Array.isArray(data) ? [...data] : [];


    if (String(search).trim()) {
      const searchLower = String(search).toLowerCase();
      result = result.filter((row) => {

        if (searchKeys.length > 0) {
          return searchKeys.some((key) => {
            const value = (row as any)[key];
            return String(value ?? "").toLowerCase().includes(searchLower);
          });
        }

        return columns.some((col) => {
          const value = (row as any)[col.key];
          return String(value ?? "").toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply filters
    Object.entries(activeFilters ?? {}).forEach(([key, value]) => {
      if (value) {
        result = result.filter((row) => {
          const rowValue = (row as any)[key];
          return String(rowValue) === String(value);
        });
      }
    });

    return result;
  }, [dataSnapshot, search, activeFilters, columns, searchKeys]);

  // Pagination
  // If parent provides server-side pagination info (totalCount or totalPages)
  // we should treat the incoming `data` as already paginated and display it
  // directly. This prevents flicker where the component would slice the old
  // array while the page change triggers a backend fetch.
  const isServerPaginated =
    typeof controlledTotalCount === "number" || typeof controlledTotalPages === "number";

  const paginatedData = useMemo(() => {
    if (isServerPaginated) return Array.isArray(data) ? data : [];

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [isServerPaginated, data, filteredData, page, pageSize]);

  // Memoized table row to avoid re-rendering unchanged rows when table-level
  // state (search, filters, page) changes. It relies on the row object
  // reference identity remaining stable when the underlying data hasn't
  // changed (server or parent should keep object references stable).
  const TableRow = React.useMemo(() => {
    type RowProps = { row: T };
    const RowComponent = ({ row }: RowProps) => {
      return (
        <tr className="hover:bg-gray-50 transition-colors">
          {columns.map((col) => {
            const cellValue = (row as any)[col.key];
            const shouldBadge = badgeKeys.some((k) => String(k) === String(col.key));
            const cellText =
              Array.isArray(cellValue)
                ? cellValue.map((it: any) => (typeof it === "string" ? it : it?.name ?? JSON.stringify(it))).join(", ")
                : typeof cellValue === "object" && cellValue !== null
                ? (cellValue as any).name ?? JSON.stringify(cellValue)
                : String(cellValue ?? "");

            return (
              <td key={String(col.key)} className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {shouldBadge ? (
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ background: badgeColors[cellText] ?? badgeColors[String(cellValue)] ?? defaultBadgeColor(cellText) }}
                    >
                      {cellText}
                    </span>
                  ) : (
                    renderCell(cellValue)
                  )}
                </div>
              </td>
            );
          })}

          {(onEdit || handleEditModal || onDelete || handleDelete || onView || handleOpenViewModal) && (
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center gap-3">
                {viewOnly && (handleOpenViewModal || onView) ? (
                  <button
                    className="text-green-600 hover:text-green-800 transition-colors"
                    onClick={() => {
                      if (handleOpenViewModal) handleOpenViewModal(row);
                      else if (onView) (onView as any)(row);
                    }}
                  >
                    View
                  </button>
                ) : (
                  <>
                    {(handleEditModal || onEdit) && (
                      <button
                        className={
                          editButtonClass
                            ? typeof editButtonClass === 'function'
                              ? editButtonClass(row)
                              : editButtonClass
                            : "text-blue-600 hover:text-blue-800 transition-colors"
                        }
                        onClick={() => {
                          if (handleEditModal) handleEditModal(row);
                          else if (onEdit) (onEdit as any)(row);
                        }}
                        title="Edit"
                      >
                        {editButtonLabel ? (
                          typeof editButtonLabel === 'function' ? editButtonLabel(row) : editButtonLabel
                        ) : (
                          <EditIcon />
                        )}
                      </button>
                    )}

                    {canDelete && (handleDelete || onDelete) && (
                      <button
                        className="text-red-600 hover:text-red-800 transition-colors"
                        onClick={() => {
                          if (handleDelete) handleDelete(row);
                          else if (onDelete) (onDelete as any)(row);
                        }}
                        title="Delete"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </>
                )}
              </div>
            </td>
          )}
        </tr>
      );
    };

    return React.memo(RowComponent, (prev, next) => prev.row === next.row);
  }, [columns, badgeKeys, badgeColors, viewOnly, handleOpenViewModal, onView, handleEditModal, onEdit, canDelete, handleDelete, onDelete]);

  // Derive total pages safely from provided metadata. Avoid computing from a
  // possibly-undefined `controlledTotalCount` with a forced non-null assertion
  // which could produce NaN. If we don't have totals, derivedTotalPages will
  // be undefined and the component falls back to client-side heuristics.
  const derivedTotalPages: number | undefined =
    typeof controlledTotalPages === "number"
      ? controlledTotalPages
      : typeof controlledTotalCount === "number"
      ? Math.max(1, Math.ceil(controlledTotalCount / pageSize))
      : undefined;

  // Determine if a next page exists. Prefer explicit totals when available.
  // If server pagination is active but totals are not provided, use an
  // optimistic heuristic: if the returned data length equals pageSize, there
  // may be another page; otherwise there is no next page.
  const hasNext = (() => {
    if (typeof derivedTotalPages === "number") return page < derivedTotalPages;
    if (isServerPaginated) return Array.isArray(data) ? data.length === pageSize : false;
    return filteredData.length > page * pageSize;
  })();

  // Helper to update page whether parent controls it or internal state is used
  const updatePage = (next: number | ((prev: number) => number)) => {
    if (controlledSetPage) {
      // controlledSetPage is a React Dispatch<SetStateAction<number>> so it accepts
      // either a number or an updater function. Forward the value/updater directly.
      (controlledSetPage as Dispatch<SetStateAction<number>>)(next as any);
    } else {
      // internal setter (from useState) also accepts number or updater
      setInternalPage(next as any);
    }
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    const next = {
      ...(activeFilters || {}),
      [filterKey]: value,
    } as Record<string, string>;

    // If parent supplied a setFilters, call it so parent can react
    if (controlledSetFilters) {
      controlledSetFilters(next);
    } else {
      setInternalActiveFilters(next);
    }

    // Reset to first page when filters change
    const parentSetPage = controlledSetPage;
    if (parentSetPage) parentSetPage(1);
    else setInternalPage(1);
  };

  return (
    <div className="w-full">
      {/* Search + Filters + Add Button */}
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              // call parent setter if provided
              if (controlledSetSearch) controlledSetSearch(v);
              else setInternalSearch(v);

              // Reset page on search change
              if (controlledSetPage) controlledSetPage(1);
              else setInternalPage(1);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filters.map((filter) => (
            <select
              key={filter.key}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={(activeFilters && activeFilters[filter.key]) || ""}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          ))}
        </div>

        {addButtonLabel && (onAdd || handleOpenModal) && (
          <button
            onClick={() => {
              if (onAdd) onAdd();
              else if (handleOpenModal) handleOpenModal();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {addButtonLabel}
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={String(col.key)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col.label}
                  </th>
                ))}
                {(onEdit || handleEditModal || onDelete || handleDelete || onView || handleOpenViewModal) && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((row: T, _idx: number) => {
                  const rowKey = (row as any).id ?? (row as any).jobId ?? (row as any).job_id ?? (row as any).key ?? _idx;
                  const MemoRow = TableRow as React.ComponentType<{ row: T }>;
                  return <MemoRow key={String(rowKey)} row={row} />;
                })
              ) : (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="text-center py-8 text-gray-500"
                  >
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination (always show controls now to match old behavior) */}
      <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, (controlledTotalCount ?? filteredData.length))} of{" "}
            {controlledTotalCount ?? filteredData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => updatePage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm font-medium">
              Page {page} of {typeof derivedTotalPages === "number" ? derivedTotalPages : Math.max(1, Math.ceil(filteredData.length / pageSize))}
            </span>
            <button
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              onClick={() => updatePage((prev) => (typeof prev === "number" ? prev + 1 : page + 1))}
              disabled={!hasNext}
            >
              Next
            </button>
          </div>
        </div>
    </div>
  );
}

// ===== Demo Usage =====
// Keep a demo export for local testing, but export the generic table as the module default
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  tags: string[];
}

export function TableDemo() {
  const sampleData: User[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "active", tags: ["Premium", "Verified"] },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", status: "active", tags: ["Basic"] },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User", status: "inactive", tags: ["Trial"] },
    { id: 4, name: "Alice Williams", email: "alice@example.com", role: "Manager", status: "active", tags: ["Premium"] },
    { id: 5, name: "Charlie Brown", email: "charlie@example.com", role: "User", status: "active", tags: ["Basic", "New"] },
  ];

  const columns: Column<User>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "status", label: "Status" },
    { key: "tags", label: "Tags" },
  ];

  const filters: Filter[] = [
    {
      key: "role",
      label: "Filter by Role",
      options: [
        { id: "Admin", name: "Admin" },
        { id: "Manager", name: "Manager" },
        { id: "User", name: "User" },
      ],
    },
    {
      key: "status",
      label: "Filter by Status",
      options: [
        { id: "active", name: "Active" },
        { id: "inactive", name: "Inactive" },
      ],
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <GenericTable
        title="User Management"
        columns={columns}
        data={sampleData}
        filters={filters}
        addButtonLabel="Add User"
        onAdd={() => alert("Add user clicked")}
        onEdit={(user) => alert(`Edit user: ${user.name}`)}
        onDelete={(user) => alert(`Delete user: ${user.name}`)}
        canDelete={true}
        pageSize={5}
        searchKeys={["name", "email"]}
      />
    </div>
  );
}

export default GenericTable;