"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clientActionApi } from '@/api/action/ClientActionApi';
import Pagination from '@/components/common/Pagination';
import { FaArrowLeft, FaHeart, FaMapMarkerAlt, FaMoneyBillWave, FaSpinner, FaUserTie } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { formatCurrency } from '@/utils/currency';

interface SavedFreelancerItemDTO {
	id: string;
	freelancerId: string;
	firstName?: string;
	lastName?: string;
	logo?: string;
	professionalRole?: string;
	country?: string;
	hourlyRate?: number;
	skills: string[];
	savedAt: string;
}

export default function SavedFreelancerPage() {
	const router = useRouter();
	const [items, setItems] = useState<SavedFreelancerItemDTO[]>([]);
	const [page, setPage] = useState(1);
	const [limit] = useState(9);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [removingId, setRemovingId] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		async function fetchSaved() {
			setLoading(true);
			const resp = await clientActionApi.getSavedFreelancers({ page, limit });
			if (!active) return;
			if (resp?.success && resp?.data) {
				const data = resp.data as { items: SavedFreelancerItemDTO[]; page: number; pages: number };
				setItems(data.items);
				setTotalPages(data.pages);
			}
			setLoading(false);
		}
		fetchSaved();
		return () => {
			active = false;
		};
	}, [page, limit]);

	const handleViewProfile = (freelancerId: string) => {
		router.push(`/client/freelancers/${freelancerId}/profile`);
	};

	const handleUnsave = async (freelancerId: string) => {
		setRemovingId(freelancerId);
		const resp = await clientActionApi.toggleSaveFreelancer(freelancerId);
		if (resp?.success && resp?.data?.saved === false) {
			setItems((prev) => prev.filter((i) => i.freelancerId !== freelancerId));
		}
		setRemovingId(null);
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<FaSpinner className="animate-spin text-4xl text-[#108A00]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="bg-white shadow-sm border-b border-gray-200">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<button
						onClick={() => window.history.back()}
						className="flex items-center gap-2 text-gray-600 hover:text-[#108A00] transition-colors mb-4"
					>
						<FaArrowLeft />
						<span className="font-medium">Back</span>
					</button>
					<h1 className="text-3xl font-bold text-gray-900">Saved Freelancers</h1>
					<p className="text-gray-600 mt-2">
						{items.length} {items.length === 1 ? 'freelancer' : 'freelancers'} saved
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 py-8">
				{items.length === 0 ? (
					<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
						<FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
						<h2 className="text-2xl font-bold text-gray-900 mb-2">No saved freelancers yet</h2>
						<p className="text-gray-600 mb-6">Browse and save freelancers to view them here</p>
						<button
							onClick={() => (window.location.href = '/client/freelancers')}
							className="bg-[#108A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors"
						>
							Browse Freelancers
						</button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{items.map((f) => (
							<div key={f.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow flex flex-col">
								<div className="flex items-center gap-4 mb-4">
									{f.logo ? (
										// eslint-disable-next-line @next/next/no-img-element
										<img src={f.logo} alt={`${f.firstName || ''} ${f.lastName || ''}`} className="w-12 h-12 rounded-full object-cover border" />
									) : (
										<div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border">
											<FaUserTie className="text-gray-400" />
										</div>
									)}
									<div className="min-w-0">
										<div className="text-lg font-bold text-gray-900 truncate">
											{(f.firstName || '') + ' ' + (f.lastName || '')}
										</div>
										<div className="text-sm text-gray-600 truncate">{f.professionalRole || '-'}</div>
									</div>
								</div>

								<div className="space-y-2 text-sm mb-4">
									<div className="flex items-center gap-2 text-gray-600">
										<FaMapMarkerAlt className="text-gray-400" />
										<span>{f.country || '-'}</span>
									</div>
									<div className="flex items-center gap-2 text-gray-600">
										<FaMoneyBillWave className="text-gray-400" />
										<span>{typeof f.hourlyRate === 'number' ? `${formatCurrency(Number(f.hourlyRate || 0))}/hr` : '-'}</span>
									</div>
								</div>

								<div className="mb-4">
									<h3 className="text-xs font-semibold text-gray-600 mb-2">Top Skills</h3>
									<div className="flex flex-wrap gap-1">
										{f.skills.slice(0, 4).map((s, idx) => (
											<span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
												{s}
											</span>
										))}
										{f.skills.length > 4 && (
											<span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">+{f.skills.length - 4}</span>
										)}
									</div>
								</div>

								<div className="flex flex-col gap-2 pt-4 border-t border-gray-100 mt-auto">
									<button
										onClick={() => handleViewProfile(f.freelancerId)}
										className="bg-[#108A00] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors text-sm text-center"
									>
										View Profile
									</button>
									<button
										onClick={() => handleUnsave(f.freelancerId)}
										disabled={removingId === f.freelancerId}
										className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors border border-red-200 text-sm"
									>
										{removingId === f.freelancerId ? (
											<>
												<FaSpinner className="animate-spin" />
												<span>Removing</span>
											</>
										) : (
											<>
												<FaHeart className="fill-current" />
												<span>Unsave</span>
											</>
										)}
									</button>
								</div>
							</div>
						))}
					</div>
				)}
				<Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} className="mt-6" />
			</div>
		</div>
	);
}
