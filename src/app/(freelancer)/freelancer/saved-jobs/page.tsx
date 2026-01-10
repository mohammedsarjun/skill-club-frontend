"use client"
import { useEffect, useState } from 'react';
import {
  FaArrowLeft,
  FaCalendar,
  FaMapMarkerAlt,
  FaBriefcase,
  FaHeart,
  FaSpinner,
} from 'react-icons/fa';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import Pagination from '@/components/common/Pagination';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/utils/currency';

interface SavedJobItemDTO {
  id: string;
  jobId: string;
  title: string;
  description: string;
  category?: string | null;
  specialities: string[];
  skills: string[];
  rateType: 'hourly' | 'fixed';
  hourlyRate?: { min: number; max: number; hoursPerWeek: number; estimatedDuration: '1 To 3 Months' | '3 To 6 Months' } | null;
  fixedRate?: { min: number; max: number } | null;
  client: { companyName?: string; country?: string; rating: number };
  status: string;
  postedAt: string;
  savedAt: string;
}

function SavedJobs() {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<SavedJobItemDTO[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [removingJobId, setRemovingJobId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function fetchSavedJobs() {
      setLoading(true);
      const resp = await freelancerActionApi.getSavedJobs({ page, limit });

      if (!active) return;
      if (resp?.success && resp?.data) {
        const data = resp.data as { items: SavedJobItemDTO[]; page: number; pages: number };
        setSavedJobs(data.items);
        setTotalPages(data.pages);
      }
      setLoading(false);
    }
    fetchSavedJobs();
    return () => { active = false };
  }, [page, limit]);

  const handleUnsaveJob = async (jobId: string) => {
    setRemovingJobId(jobId);
    const resp = await freelancerActionApi.toggleSaveJob(jobId);
    if (resp?.success && resp?.data?.saved === false) {
      setSavedJobs((prev) => prev.filter((s) => s.jobId !== jobId));
    }
    setRemovingJobId(null);
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/freelancer/jobs/${jobId}`);
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const posted = new Date(date);
    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
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
          <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
          <p className="text-gray-600 mt-2">
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No saved jobs yet
            </h2>
            <p className="text-gray-600 mb-6">
              Start saving jobs you're interested in to view them here
            </p>
            <button
              onClick={() => (window.location.href = '/jobs')}
              className="bg-[#108A00] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0d7000] transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedJobs.map((savedJob) => {
              const isDisabled = ['suspended', 'closed'].includes(savedJob.status);
              const cardClass = `bg-white rounded-lg shadow-sm border p-6 transition-shadow flex flex-col ${
                savedJob.status === 'suspended'
                  ? 'ring-2 ring-amber-200 bg-amber-50 border-amber-200'
                  : savedJob.status === 'closed'
                  ? 'ring-2 ring-slate-200 bg-slate-50 border-slate-200'
                  : 'border-gray-200 hover:shadow-lg'
              }`;

              return (
                <div key={savedJob.id} className={cardClass}>
                  {/* Highlight banner for suspended/closed */}
                  {savedJob.status === 'suspended' && (
                    <div className="mb-3 px-3 py-2 bg-amber-100 text-amber-800 rounded text-sm font-medium">
                      This job has been suspended by the admin. Applications are paused.
                    </div>
                  )}
                  {savedJob.status === 'closed' && (
                    <div className="mb-3 px-3 py-2 bg-slate-100 text-slate-800 rounded text-sm font-medium">
                      This job is closed — no longer accepting applicants.
                    </div>
                  )}
                <div className="flex-1 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {savedJob.title}
                  </h2>

                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaCalendar className="text-gray-400 flex-shrink-0" />
                      <span>Posted {formatDate(savedJob.postedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" />
                      <span>{savedJob.client.country || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FaBriefcase className="text-gray-400 flex-shrink-0" />
                      <span>{savedJob.category || '-'}</span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#108A00]/10 to-green-50 rounded-lg p-3 border border-[#108A00]/20 mb-4">
                    <div className="text-xs font-medium text-gray-600 mb-1">
                      {savedJob.rateType === 'hourly'
                        ? 'Hourly Rate'
                        : 'Fixed Budget'}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {savedJob.rateType === 'hourly' ? (
                        <>
                          <span>{formatCurrency(Number(savedJob.hourlyRate?.min || 0))}</span>
                          <span className="text-gray-600"> - </span>
                          <span>{formatCurrency(Number(savedJob.hourlyRate?.max || 0))}</span>
                          <span className="text-sm">/hr</span>
                        </>
                      ) : (
                        <>
                          <span>{formatCurrency(Number(savedJob.fixedRate?.min || 0))}</span>
                          <span className="text-gray-600"> - </span>
                          <span>{formatCurrency(Number(savedJob.fixedRate?.max || 0))}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-600 mb-2">
                      Specialties
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {savedJob.specialities
                        .slice(0, 2)
                        .map((specialty, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium"
                          >
                            {specialty}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold text-gray-600 mb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {savedJob.skills.slice(0, 3).map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {savedJob.skills.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                          +{savedJob.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => {
                      if (!isDisabled) handleViewJob(savedJob.jobId);
                    }}
                    disabled={isDisabled}
                    aria-disabled={isDisabled}
                    title={isDisabled ? (savedJob.status === 'suspended' ? 'This job has been suspended by admin' : 'This job is closed') : 'View Job'}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm text-center ${
                      isDisabled
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-200'
                        : 'bg-[#108A00] text-white hover:bg-[#0d7000]'
                    }`}
                  >
                    {isDisabled ? (savedJob.status === 'suspended' ? 'Suspended' : 'Closed') : 'View Job'}
                  </button>
                  <button
                    onClick={() => handleUnsaveJob(savedJob.jobId)}
                    disabled={removingJobId === savedJob.jobId}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-red-100 transition-colors border border-red-200 text-sm"
                  >
                    {removingJobId === savedJob.jobId ? (
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
            );
            })}
          </div>
        )}
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          className="mt-6"
        />
      </div>
    </div>
  );
}

export default SavedJobs;
