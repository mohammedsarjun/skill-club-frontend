"use client";

import React, { useEffect, useState } from "react";
import StatsBoxes from "./components/StatsBoxes";

import WithdrawalListingPage from "./components/WithdrawTable";
import adminActionApi from "@/api/action/AdminActionApi";
import { IWithdrawalStats } from "@/types/interfaces/IWithdrawals";

export default function AdminWithdrawPage() {
	const [stats, setStats] = useState<IWithdrawalStats>({ 
		pendingRequests: 0, 
		totalPendingAmount: 0, 
		totalWithdrawn: 0 
	});
	const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
	const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

	useEffect(() => {
		fetchStats();
	}, []);

	async function fetchStats() {
		const res = await adminActionApi.getWithdrawStats();
		if (res?.success) setStats(res.data);
	}

	function handleFilterChange(k: string, v: string | undefined) {
		if (k === 'role') setRoleFilter(v);
		if (k === 'status') setStatusFilter(v);
	}

	return (
		<div>
			<h1 className="text-2xl font-semibold mb-4">Withdrawals</h1>

			<StatsBoxes 
				pendingRequests={stats.pendingRequests} 
				totalPendingAmount={stats.totalPendingAmount} 
				totalWithdrawn={stats.totalWithdrawn} 
			/>

	

			<WithdrawalListingPage 
				roleFilter={roleFilter} 
				statusFilter={statusFilter}
				onWithdrawalUpdate={fetchStats}
			/>
		</div>
	);
}
