"use client";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DisputesTable } from "./components/DisputesTable";
import AdminActionApi from "@/api/action/AdminActionApi";
import { IAdminDisputeListItem } from "@/types/interfaces/IAdminDisputeList";
import Swal from "sweetalert2";

export default function DisputesPage() {
	const router = useRouter();
	const [disputes, setDisputes] = useState<IAdminDisputeListItem[]>([]);
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

	const fetchDisputes = useCallback(async () => {
		setLoading(true);
		try {
			const response = await AdminActionApi.getDisputes({
				search: debouncedSearch,
				page: currentPage,
				limit,
				reasonCode: filters.reasonCode,
			});

			if (response?.success && response.data) {
				setDisputes(response.data.items || []);
				setTotalPages(response.data.pages || 1);
				setTotal(response.data.total || 0);
			} else {
				Swal.fire({
					icon: "error",
					title: "Error",
					text: response?.message || "Failed to fetch disputes",
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
		fetchDisputes();
	}, [fetchDisputes]);

	const handleView = useCallback(
		(disputeId: string) => {
			router.push(`/admin/disputes/${disputeId}`);
		},
		[router]
	);

	const statusBadgeColors = useMemo(() => ({
		open: "#f59e0b",
		under_review: "#3b82f6",
		resolved: "#10b981",
		rejected: "#ef4444",
	}), []);

	return (
		<div className="max-w-7xl mx-auto px-6 py-8">
			<div className="relative">
				<DisputesTable
					items={disputes}
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
