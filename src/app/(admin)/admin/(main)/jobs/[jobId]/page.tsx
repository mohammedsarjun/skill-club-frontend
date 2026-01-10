"use client";
import AdminActionApi from "@/api/action/AdminActionApi";
import GlobalSpinner from "@/components/common/Spinner";
import { useSwal } from "@/custom-hooks/useSwal";
import { JobDetailResponseDTO } from "@/types/interfaces/IJob";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaBuilding,
  FaClock,
  FaDollarSign,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimes,
  FaFileAlt,
  FaUsers,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaBan,
  FaUserTie,
  FaIdCard,
  FaGlobe,
} from "react-icons/fa";

function AdminJobDetailPage() {
  const [job, setJob] = useState<JobDetailResponseDTO>({
    jobId: "",
    jobTitle: "",
    jobDescription: "",
    category: {
      categoryName: "",
      categoryId: "",
    },
    specialities: [
      {
        specialityId: "",
        specialityName: "",
      },
    ],
    skills: [
      {
        skillId: "",
        skillName: "",
      },
    ],
    budget: {
      rateType: "hourly",
      min: 0,
      max: 0,
      hoursPerWeek: 0,
      estimatedDuration: "1 To 3 Months",
    },
    totalProposal: 0,
    status: "pending_verification",
    clientDetail: {
      clientId: "",
      companyName: "",
      companyLogo: "",
    },
    verifiedBy: "",
    rejectedReason: "",
    suspendedReason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { jobAction, suspendJob } = useSwal();
  const params = useParams();
  const jobIdParam = (params as any)?.jobId as string | undefined;

  const handleReviewJob = async () => {
    const result = await jobAction(job?.jobTitle as string);

    if (result === "approved") {
      setIsLoading(true);
      try {
        const response = await AdminActionApi.approveJob(job?.jobId as string);
        if (response.success) {
          setJob((prev) => ({
            ...prev,
            status: "open",
          }));
          toast.success("Job approved successfully!");
        }
      } catch (error) {
        console.error("Failed to approve job", error);
        toast.error("Failed to approve job");
      } finally {
        setIsLoading(false);
      }
    } else if (typeof result === "object" && result.action === "rejected") {
      setIsLoading(true);
      try {
        const response: any = await AdminActionApi.rejectJob(
          job.jobId,
          result.reason
        );
        if (response.success) {
          setJob((prev) => ({
            ...prev,
            status: "rejected",
            rejectedReason: result.reason,
          }));
          toast.success("Job rejected");
        }
      } catch (error) {
        console.error("Failed to reject job", error);
        toast.error("Failed to reject job");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSuspendJob = async () => {
    const result = await suspendJob(job?.jobTitle as string);

    if (typeof result === "object" && result?.action === "suspended") {
      setIsLoading(true);
      try {
        const response = await AdminActionApi.suspendJob(
          job?.jobId,
          result.reason
        );
        if (response.success) {
          setJob((prev) => ({
            ...prev,
            status: "suspended",
            suspendedReason: result.reason,
          }));
          toast.success("Job suspended");
        }
      } catch (error) {
        toast.error("Failed to suspend job");
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchJobDetail = async () => {
      setIsLoading(true);
      try {
        const jobResponse = await AdminActionApi.getJobDetail(
          jobIdParam as string
        );

        if (jobResponse.success) {
          setJob(jobResponse.data);
        }
      } catch (err) {
        console.error("Failed to fetch job details", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobIdParam]);

  const getStatusBadge = () => {
    const statusConfig = {
      pending_verification: {
        bg: "bg-amber-100",
        text: "text-amber-700",
        border: "border-amber-300",
        label: "Pending Review",
        icon: <FaClock className="w-3 h-3" />,
      },
      open: {
        bg: "bg-green-100",
        text: "text-green-700",
        border: "border-green-300",
        label: "Open",
        icon: <FaCheckCircle className="w-3 h-3" />,
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        border: "border-red-300",
        label: "Rejected",
        icon: <FaTimes className="w-3 h-3" />,
        reason: job?.rejectedReason,
      },
      suspended: {
        bg: "bg-orange-100",
        text: "text-orange-700",
        border: "border-orange-300",
        label: "Suspended",
        icon: <FaBan className="w-3 h-3" />,
        reason: job?.suspendedReason,
      },
      closed: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        label: "Closed",
        icon: <FaTimes className="w-3 h-3" />,
      },
      archived: {
        bg: "bg-gray-100",
        text: "text-gray-700",
        border: "border-gray-300",
        label: "Archived",
        icon: <FaFileAlt className="w-3 h-3" />,
      },
    };

    const config = statusConfig[job?.status!];

    return (
      <span
        className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border ${config?.bg} ${config?.text} ${config?.border}`}
      >
        {config?.icon}
        {config?.label}
      </span>
    );
  };

  if (isLoading) {
    return <GlobalSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Page Title Section (not a global header) */}
      <section className="mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-bold text-gray-900">
              Job Review - Admin Panel
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex items-start gap-4 w-full">
              <img
                src={job?.clientDetail.companyLogo}
                alt={job?.clientDetail.companyName}
                className="w-20 h-20 rounded-xl object-cover border-2 border-gray-200 bg-white shadow-md"
              />
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    {job?.category.categoryName}
                  </span>
                  {getStatusBadge()}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {job?.jobTitle}
                </h2>
                <div className="flex flex-wrap items-center text-gray-600 text-sm gap-3">
                  <div className="flex items-center gap-1.5">
                    <FaBuilding className="w-4 h-4" />
                    <span className="font-medium">
                      {job?.clientDetail.companyName}
                    </span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500">Job ID: {job?.jobId}</span>
                  <span className="text-gray-300">•</span>
                  <div className="flex items-center gap-1.5">
                    <FaUsers className="w-4 h-4" />
                    <span>{job?.totalProposal} Proposals</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Status Banner */}
        {job?.status === "open" && job?.verifiedBy && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <FaCheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-900">
                  Job Approved
                </p>
                <p className="text-sm text-green-700">
                  This job has been reviewed and approved by{" "}
                  <span className="font-medium">{job.verifiedBy}</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {job?.status === "rejected" && job?.rejectedReason && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FaTimes className="w-6 h-6 text-red-600 mt-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-900 mb-1">
                  Job Rejected
                </p>
                <p className="text-sm text-red-700">
                  <span className="font-medium">Reason:</span>{" "}
                  {job.rejectedReason}
                </p>
              </div>
            </div>
          </div>
        )}

        {job?.status === "suspended" && job?.suspendedReason && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <FaBan className="w-6 h-6 text-orange-600 mt-0.5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-orange-900 mb-1">
                  Job Suspended
                </p>
                <p className="text-sm text-orange-700">
                  <span className="font-medium">Reason:</span>{" "}
                  {job.suspendedReason}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <FaFileAlt className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Job Description
                </h3>
              </div>
              <p
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job?.jobDescription }}
              ></p>
            </div>

            {/* Skills & Specialities */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                Required Skills & Specialities
              </h3>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Specialities
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job?.specialities.map((spec) => (
                    <span
                      key={spec.specialityId}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium border border-purple-200"
                    >
                      {spec.specialityName}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job?.skills.map((skill) => (
                    <span
                      key={skill.skillId}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium border border-blue-200"
                    >
                      {skill.skillName}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Budget Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <FaDollarSign className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Budget Details
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Rate Type</p>
                  <p className="text-lg font-semibold text-gray-900 capitalize">
                    {job?.budget.rateType}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Budget Range</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ${job?.budget.min} - ${job?.budget.max}
                    {job?.budget.rateType === "hourly" ? "/hr" : ""}
                  </p>
                </div>

                {job?.budget.hoursPerWeek && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Hours/Week</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {job.budget.hoursPerWeek} hrs
                    </p>
                  </div>
                )}

                {job?.budget.estimatedDuration && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-600 mb-1">Duration</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {job.budget.estimatedDuration}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Admin Actions
              </h3>
              <div className="flex flex-wrap gap-3">
                {job?.status === "pending_verification" && (
                  <button
                    onClick={handleReviewJob}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaCheckCircle className="w-4 h-4" />
                    Review Job
                  </button>
                )}

                {job?.status === "open" && (
                  <button
                    onClick={handleSuspendJob}
                    className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white font-medium rounded-lg shadow-md hover:from-orange-700 hover:to-red-700 transition-all duration-200 flex items-center gap-2"
                  >
                    <FaBan className="w-4 h-4" />
                    Suspend Job
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Client Details Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
                <FaUserTie className="w-5 h-5 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">
                  Client Details
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={job?.clientDetail.companyLogo}
                    alt={job?.clientDetail.companyName}
                    className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {job?.clientDetail.companyName}
                    </h4>
                    {/* <div className="flex items-center gap-1 mt-1">
                      <FaStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {job?.clientDetail.rating}
                      </span>
                    </div> */}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-start gap-3">
                    <FaIdCard className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Client ID</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job?.clientDetail.clientId}
                      </p>
                    </div>
                  </div>
                  {/* 
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.clientDetail.contactEmail}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaPhone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.clientDetail.contactPhone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.clientDetail.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaCalendarAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(
                          job.clientDetail.memberSince
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <FaFileAlt className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Total Jobs Posted</p>
                      <p className="text-sm font-medium text-gray-900">
                        {job.clientDetail.totalJobsPosted} jobs
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminJobDetailPage;
