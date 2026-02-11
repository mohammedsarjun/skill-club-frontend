"use client";
import { useState, useEffect } from "react";
import AdminActionApi from "@/api/action/AdminActionApi";
import { IAdminReportedJob } from "@/types/interfaces/IReportedJob";
import toast from "react-hot-toast";
import {
  FaExclamationTriangle,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
} from "react-icons/fa";

interface ReportsTabProps {
  jobId: string;
}

export default function ReportsTab({ jobId }: ReportsTabProps) {
  const [reports, setReports] = useState<IAdminReportedJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalReports, setTotalReports] = useState(0);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await AdminActionApi.getJobReports(jobId);
        if (response.success) {
          setReports(response.data.reports);
          setTotalReports(response.data.totalReports);
        } else {
          toast.error(response.message || "Failed to fetch reports");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        toast.error("Failed to fetch reports");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <FaExclamationTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Reports Found
          </h3>
          <p className="text-gray-600">
            This job has not been reported by any freelancers yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Job Reports
          </h3>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {totalReports} {totalReports === 1 ? "Report" : "Reports"}
          </span>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.reportId}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    report.freelancerPicture ||
                    "https://via.placeholder.com/48"
                  }
                  alt={report.freelancerName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {report.freelancerName}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <FaEnvelope className="w-3 h-3" />
                        <span>{report.freelancerEmail}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <FaCalendarAlt className="w-3 h-3" />
                        <span>
                          {new Date(report.reportedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Reason for Report:
                    </p>
                    <p className="text-gray-900">{report.reason}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
