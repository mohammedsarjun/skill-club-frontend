"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ContractsTable } from "./components/ContractsTable";
import AdminActionApi from "@/api/action/AdminActionApi";
import { IAdminContractListItem } from "@/types/interfaces/IAdminContractList";
import Swal from "sweetalert2";

export default function ContractsPage() {
	const router = useRouter();
	const [contracts, setContracts] = useState<IAdminContractListItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [filters, setFilters] = useState<Record<string, string>>({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const limit = 10;

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
		}, 500);

		return () => clearTimeout(timer);
	}, [search]);

	useEffect(() => {
		setCurrentPage(1);
	}, [debouncedSearch, filters]);

	const fetchContracts = useCallback(async () => {
		setLoading(true);
		try {
			const response = await AdminActionApi.getContracts({
				search: debouncedSearch,
				page: currentPage,
				limit,
				status: filters.status,
			});

			if (response?.success && response.data) {
				setContracts(response.data.items || []);
				setTotalPages(response.data.pages || 1);
				setTotal(response.data.total || 0);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: response?.message || "Failed to fetch contracts",
				});
			}
		} catch (error) {
			Swal.fire({
				icon: "error",
				title: "Error",
				text: "An unexpected error occurred",
			});
		} finally {
			setLoading(false);
		}
	}, [debouncedSearch, currentPage, filters]);

	useEffect(() => {
		fetchContracts();
	}, [fetchContracts]);

	const handleView = useCallback(
		(contractId: string) => {
			router.push(`/admin/contracts/${contractId}`);
		},
		[router]
	);

	const statusBadgeColors = useMemo(() => ({
		pending_funding: "#f59e0b",
		active: "#10b981",
		completed: "#3b82f6",
		cancelled: "#ef4444",
		refunded: "#8b5cf6",
	}), []);

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			<div className="relative">
				<ContractsTable
					items={contracts}
					onView={handleView}
					search={search}
					setSearch={setSearch}
					page={currentPage}
					setPage={setCurrentPage}
					totalPages={totalPages}
					totalCount={total}
					activeFilters={filters}
					setFilters={setFilters}
					badgeColors={statusBadgeColors}
				/>
			</div>
		</div>
	);
}
