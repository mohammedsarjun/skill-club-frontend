"use client";

import React, { useEffect, useState } from "react";
import StatsBoxes from "./components/StatsBoxes";
import Filters from "./components/Filters";
import WithdrawTable from "./components/WithdrawTable";
import ViewModal from "./components/ViewModal";
import { IWithdrawalItem } from "@/types/interfaces/IWithdrawals";
import adminActionApi from "@/api/action/AdminActionApi";
import toast from "react-hot-toast";
import WithdrawalListingPage from "./components/WithdrawTable";

export default function AdminWithdrawPage() {
	const [stats, setStats] = useState({ pendingRequests: 0, totalPendingAmount: 0, totalWithdrawn: 0 });
	const [items, setItems] = useState<IWithdrawalItem[]>([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(10);
	const [total, setTotal] = useState(0);
	const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
	const [selected, setSelected] = useState<IWithdrawalItem | null>(null);

	useEffect(() => {
		fetchStats();
		fetchList();
	}, []);

	useEffect(() => {
		fetchList();
	}, [page, roleFilter, statusFilter]);

	async function fetchStats() {
		const res = await adminActionApi.getWithdrawStats();
		if (res?.success) setStats(res.data);
	}

	async function fetchList() {
		const res = await adminActionApi.getWithdrawals(page, limit, { role: roleFilter, status: statusFilter });
		console.log(res)
		if (res?.success) {
			setItems(res.data.items || []);
			setTotal(res.data.total || 0);
		}
	}

	function handleFilterChange(k: string, v: string | undefined) {
		if (k === 'role') setRoleFilter(v);
		if (k === 'status') setStatusFilter(v);
		setPage(1);
	}

	async function handleApprove(id: string) {
		const res = await adminActionApi.approveWithdrawal(id);
		if (res?.success) {
			toast.success('Approved');
			setSelected(null);
			fetchStats();
			fetchList();
		} else {
			toast.error(res?.message || 'Failed');
		}
	}

	return (
		<div>
			<h1 className="text-2xl font-semibold mb-4">Withdrawals</h1>

			<StatsBoxes pendingRequests={stats.pendingRequests} totalPendingAmount={stats.totalPendingAmount} totalWithdrawn={stats.totalWithdrawn} />

			<Filters roleFilter={roleFilter} statusFilter={statusFilter} onChange={handleFilterChange} />

			<WithdrawalListingPage roleFilter={roleFilter} statusFilter={statusFilter} />

			<div className="mt-4 flex justify-end">
				<div className="text-sm text-gray-600">Total: {total}</div>
			</div>

			{selected && <ViewModal item={selected} onClose={() => setSelected(null)} onApprove={handleApprove} />}
		</div>
	);
}
