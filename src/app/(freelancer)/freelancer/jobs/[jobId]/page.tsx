"use client";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import { FreelancerJobDetailResponse, JobStatus, StatusConfig } from "@/types/interfaces/IJob";
import { useParams } from "next/navigation";
import React, { JSX, useEffect, useState, useRef } from "react";
import debounce from 'lodash/debounce';
import {
  FaBriefcase,
  FaDollarSign,
  FaMapMarkerAlt,
  FaStar,
  FaClock,
  FaFileAlt,
  FaGlobe,
  FaCalendar,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaHeart,
  FaSpinner,
  FaShare,
  FaFlag,
  FaUser,
  FaChartLine,
} from "react-icons/fa";
import ProposalFormModal from "./components/ProposalModal";
import ReportJobModal from "./components/ReportJobModal";
import { ICreateProposal } from "@/types/interfaces/IProposal";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/currency";



const JobDetailPage: React.FC = () => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isReported, setIsReported] = useState<boolean>(false);
  const [showProposalModal, setShowProposalModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");
  const [deliveryTime, setDeliveryTime] = useState<string>("1-2 weeks");
  const [jobDetail, setJobDetail] = useState<FreelancerJobDetailResponse>();
  const [jobStatus, setJobStatus] = useState<JobStatus | undefined>();
  const [hasProposal, setHasProposal] = useState<boolean>(false);
  const params = useParams();
  const { jobId } = params;
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const [convertedMin, setConvertedMin] = useState<number>(0);
  const [convertedMax, setConvertedMax] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    if (!jobDetail) return;

    try {
      const rawMin = jobDetail?.fixedRate?.min ?? jobDetail?.hourlyRate?.min ?? 0;
      const rawMax = jobDetail?.hourlyRate?.max ?? jobDetail?.fixedRate?.max ?? 0;

      if (!mounted) return;
      setConvertedMin(Number(rawMin || 0));
      setConvertedMax(Number(rawMax || 0));
    } catch (err) {
      if (!mounted) return;
      setConvertedMin(0);
      setConvertedMax(0);
    }

    return () => { mounted = false; };
  }, [jobDetail]);


  const getStatusBadge = (status: JobStatus): JSX.Element => {
    const statusConfig: Record<JobStatus, StatusConfig> = {
      open: { bg: "bg-green-100", text: "text-green-700", label: "Open" },
      closed: { bg: "bg-gray-100", text: "text-gray-700", label: "Closed" },
      pending_verification: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending",
      },
      rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
      archived: { bg: "bg-gray-100", text: "text-gray-700", label: "Archived" },
      suspended: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        label: "Suspended",
      },
    };

    const config = statusConfig[status];
    return (
      <span
        className={`${config.bg} ${config.text} px-4 py-1.5 rounded-full text-sm font-semibold`}
      >
        {config.label}
      </span>
    );
  };

  const handleSubmitProposal = (): void => {
    console.log("Submitting proposal:", {
      bidAmount,
      coverLetter,
      deliveryTime,
    });
    setShowProposalModal(false);
  };

  const handleSaveJob = (): void => {
    const optimistic = !isSaved;
    setIsSaved(optimistic);
    setIsSaving(true);

    debouncedToggle.current(optimistic);
  };

  const handleShareJob = (): void => {
    console.log("Sharing job:", jobDetail?.jobId);
  };

  const handleReportJob = (): void => {
    if (!isReported) {
      setShowReportModal(true);
    }
  };

  const handleReportSubmit = async (reason: string): Promise<void> => {
    try {
      const response = await freelancerActionApi.reportJob(jobId as string, reason);
      if (response.success) {
        toast.success(response.message || "Job reported successfully");
        setIsReported(true);
        setShowReportModal(false);
      } else {
        toast.error(response.message || "Failed to report job");
      }
    } catch (error: unknown) {
      toast.error("Failed to report job");
    }
  };

  const handleViewClientProfile = (): void => {
    console.log("Viewing client profile:", jobDetail?.client.companyName);
  };

  const handleGoBack = (): void => {
    console.log("Going back to job listings");
  };

  useEffect(() => {
    async function fetchJobDetail() {
      const jobDetailResponse = await freelancerActionApi.getJobDetail(
        jobId as string
      );
      const jobDetail = jobDetailResponse.data;
      setJobDetail({
        jobId: jobId as string,
        title: jobDetail.title,
        description: jobDetail.description,
        category: jobDetail.category,
        specialities: jobDetail.specialities,
        skills: jobDetail.skills,
        rateType: jobDetail.rateType,
        hourlyRate:
          jobDetail.rateType == "hourly" ? jobDetail.hourlyRate : null,
        fixedRate: jobDetail.rateType == "fixed" ? jobDetail.fixedRate : null,
        currency: jobDetail.currency,
        conversionRate: jobDetail.conversionRate,
        hourlyRateBaseUSD: jobDetail.hourlyRateBaseUSD,
        fixedRateBaseUSD: jobDetail.fixedRateBaseUSD,
        status: jobDetail.status,
        proposalReceived: jobDetail.proposalReceived,
        postedAt: jobDetail.postedAt,
        client: {
          companyName: jobDetail.client.companyName,
          country: jobDetail.client.country,
          rating: jobDetail.client.rating,
          totalJobsPosted: jobDetail.client.totalJobsPosted,
        },
      });
      setJobStatus(jobDetail.status as JobStatus);
      setHasProposal(jobDetail.isProposalAlreadySent || false);
      console.log(jobDetail);
    }

    if (jobId) {
      fetchJobDetail();
    }
  }, [jobId]);

  // Check saved state on mount
  useEffect(() => {
    let mounted = true;
    async function checkSaved() {
      try {
        const resp = await freelancerActionApi.isJobSaved(jobId as string);
        const savedFlag = resp?.data?.saved as boolean | undefined;
        if (mounted) setIsSaved(!!savedFlag);
      } catch (err) {

      }
    }
    if (jobId) checkSaved();
    return () => {
      mounted = false;
    };
  }, [jobId]);


  useEffect(() => {
    let mounted = true;
    async function checkReported() {
      try {
        const resp = await freelancerActionApi.isJobReported(jobId as string);
        if (mounted && resp?.success && resp?.data) {
          setIsReported(!!resp.data.reported);
        }
      } catch (err) {
      }
    }
    if (jobId) checkReported();
    return () => {
      mounted = false;
    };
  }, [jobId]);

  // Debounced toggle to avoid rapid repeated requests
  const debouncedToggle = useRef(
    debounce(async (optimisticState: boolean) => {
      try {
        const resp = await freelancerActionApi.toggleSaveJob(jobId as string);
        const savedFlag = resp?.data?.saved as boolean | undefined;
        if (typeof savedFlag === 'boolean') {
          setIsSaved(savedFlag);
        }
      } catch (err: any) {
        // revert optimistic state on error
        setIsSaved(!optimisticState);
        const message = err?.response?.data?.message || 'Failed to update saved state';
        try { /* toast might be available */
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (toast as any)?.error?.(message);
        } catch {}
      } finally {
        setIsSaving(false);
      }
    },
    400)
  );


  async function handleProposalSubmit(submittedData:any):Promise<void>{
    submittedData.jobId = jobId;
    // Backend stores currency but app is INR-only; send INR explicitly
    submittedData.currency = 'INR';
    const response = await freelancerActionApi.createProposal(submittedData)
    if(response.success){
      toast.success(response.message)
      setHasProposal(true);
      setShowProposalModal(false);
    }else{
      toast.error(response.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#108A00] transition-colors mb-4"
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Job Listings</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {jobDetail?.title}
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <FaCalendar className="text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Posted</div>
                    <div className="font-semibold text-gray-900">
                      {formatDate(jobDetail?.postedAt!)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaFileAlt className="text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Proposals</div>
                    <div className="font-semibold text-gray-900">
                      {jobDetail?.proposalReceived}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="font-semibold text-gray-900">
                      {jobDetail?.client.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <FaClock className="text-gray-400" />
                  <div>
                    <div className="text-xs text-gray-500">Duration</div>
                    <div className="font-semibold text-gray-900">
                      {jobDetail?.hourlyRate?.estimatedDuration || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Rate Information */}
              <div className="bg-gradient-to-r from-[#108A00]/10 to-green-50 rounded-lg p-6 border border-[#108A00]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      {jobDetail?.rateType === "hourly"
                        ? "Hourly Rate"
                        : "Fixed Budget"}
                    </div>
                    <div className="text-3xl font-bold text-gray-900">
                      {formatCurrency(Number(convertedMin || 0))}
                      {" - "}
                      {formatCurrency(Number(convertedMax || 0))}
                      {jobDetail?.rateType === "hourly" && (
                        <span className="text-lg">/hr</span>
                      )}
                    </div>
                  </div>
                  {jobDetail?.hourlyRate && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">
                        Hours per week
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {jobDetail.hourlyRate.hoursPerWeek}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaBriefcase className="text-[#108A00]" />
                Job Description
              </h2>
              <div className="prose max-w-none text-gray-700 whitespace-pre-line leading-relaxed break-words break-all min-w-0"
              dangerouslySetInnerHTML={{ __html: jobDetail?.description!}}>

              </div>

            
            </div>

            {/* Skills & Specialties */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Required Skills & Expertise
              </h2>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetail?.specialities.map(
                    (specialty: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-3">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobDetail?.skills.map((skill: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#108A00] hover:text-white transition-colors cursor-pointer"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Action Buttons */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {(jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal) && (
                  <div className={`mb-3 px-3 py-2 rounded text-sm font-medium ${
                    jobStatus === 'suspended' ? 'bg-amber-100 text-amber-800' : 
                    jobStatus === 'closed' ? 'bg-slate-100 text-slate-800' :
                    hasProposal ? 'bg-blue-100 text-blue-800' : ''
                  }`}>
                    {jobStatus === 'suspended'
                      ? 'This job has been suspended by the admin. Applications are paused.'
                      : jobStatus === 'closed' 
                      ? 'This job has been closed by the client — no longer accepting applicants.'
                      : hasProposal
                      ? 'You have already submitted a proposal for this job.'
                      : ''}
                  </div>
                )}
                <button
                  onClick={() => {
                    if (!(jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal)) {
                      setShowProposalModal(true);
                    }
                  }}
                  disabled={jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal}
                  title={jobStatus === 'suspended' ? 'This job has been suspended by the admin. Applications are paused.' : jobStatus === 'closed' ? 'This job has been closed by the client — no longer accepting applicants.' : hasProposal ? 'You have already submitted a proposal for this job' : 'Submit Proposal'}
                  className={`w-full px-6 py-4 rounded-lg font-bold text-lg transition-colors mb-3 shadow-lg shadow-[#108A00]/20 ${
                    jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-[#108A00] text-white hover:bg-[#0d7000]'
                  }`}
                >
                  {(jobStatus === 'suspended' && 'Suspended') || (jobStatus === 'closed' && 'Closed') || (hasProposal && 'Proposal Submitted') || 'Submit Proposal'}
                </button>
                <div className="w-full grid  gap-3">
                  <button
                    onClick={handleSaveJob}
                    disabled={isSaving || jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal}
                    aria-pressed={isSaved}
                    aria-label={isSaved ? 'Unsave job' : 'Save job'}
                    title={jobStatus === 'suspended' ? 'Cannot save — job suspended by admin' : jobStatus === 'closed' ? 'Cannot save — job closed by client' : hasProposal ? 'Cannot save — proposal already submitted' : isSaved ? 'Unsave job' : 'Save job'}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                      jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-200'
                        : isSaved
                        ? 'bg-red-50 text-red-600 border-2 border-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } ${isSaving ? 'opacity-80 cursor-wait' : ''}`}
                  >
                    <FaHeart className={isSaved ? "fill-current" : ""} />
                    {isSaving ? (
                      <span className="flex items-center gap-2">
                        <FaSpinner className="animate-spin" />
                        <span className="text-sm">Saving</span>
                      </span>
                    ) : isSaved ? (
                      "Saved"
                    ) : (
                      "Save"
                    )}
                  </button>
                  <button
                    onClick={handleReportJob}
                    disabled={isReported || jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal}
                    title={isReported ? 'You have already reported this job' : jobStatus === 'suspended' ? 'Cannot report — job suspended by admin' : jobStatus === 'closed' ? 'Cannot report — job closed by client' : hasProposal ? 'Cannot report — proposal already submitted' : 'Report this job'}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                      isReported || jobStatus === 'suspended' || jobStatus === 'closed' || hasProposal
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <FaFlag className={isReported ? "text-red-600" : ""} />
                    {isReported ? 'Reported' : 'Report'}
                  </button>
                </div>
          
              </div>

              {/* Client Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUser className="text-[#108A00]" />
                  About the Client
                </h3>

                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Client Name
                    </div>
                    <div className="font-semibold text-gray-900">
                      {jobDetail?.client.companyName}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 py-3 border-y border-gray-100">
                    <div className="flex items-center gap-1">
                      <FaStar className="text-yellow-400" />
                      <span className="font-bold text-gray-900">
                        {jobDetail?.client.rating}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">Client Rating</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">Location</div>
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <FaMapMarkerAlt className="text-gray-400" size={14} />
                      {jobDetail?.client.country}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      Jobs Posted
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <FaChartLine className="text-gray-400" size={14} />
                      {jobDetail?.client.totalJobsPosted} jobs
                    </div>
                  </div>
                </div>


              </div>

              {/* Job Stats */}
              <div className="bg-gradient-to-br from-[#108A00] to-green-700 rounded-xl shadow-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-4">Job Activity</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Proposals Received</span>
                    <span className="font-bold text-xl">
                      {jobDetail?.proposalReceived}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Job Status</span>
                    <span className="font-semibold capitalize">
                      {jobStatus?.replace(/_/g, ' ') || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-green-100">Category</span>
                    <span className="font-semibold">{jobDetail?.category || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proposal Modal */}
      {showProposalModal && (
        <ProposalFormModal jobType={jobDetail?.rateType as "hourly"|"fixed"} onSubmit={handleProposalSubmit} onClose={()=>{setShowProposalModal(false)}} />
      )}

      {showReportModal && (
        <ReportJobModal
          jobTitle={jobDetail?.title || ""}
          onClose={() => setShowReportModal(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default JobDetailPage;
