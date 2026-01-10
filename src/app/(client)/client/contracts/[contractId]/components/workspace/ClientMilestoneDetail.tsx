"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import Swal from "sweetalert2";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

import { IClientContractDetail } from "@/types/interfaces/IClientContractDetail";
import { FaDownload } from "react-icons/fa";
import getMediaType from "@/utils/getMediaType";
import VideoPlayer from "@/components/common/VideoPlayer";
import ImageViewerModal from "@/components/common/ImageViewer";
import { clientActionApi } from "@/api/action/ClientActionApi";
interface ClientMilestoneDetailProps {
  contractId: string;
  milestone: NonNullable<IClientContractDetail["milestones"]>[number];
  onClose: () => void;
  onApprove: (deliverableId: string) => Promise<void>;
  onRequestChanges: (deliverableId: string, feedback: string) => Promise<void>;
  onSuccess: () => void;
  onRespondToExtension?: (approved: boolean, responseMessage?: string) => Promise<void>;
}

const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending_funding: "bg-gray-100 text-gray-700",
    funded: "bg-blue-100 text-blue-700",
    under_review: "bg-yellow-100 text-yellow-700",
    submitted: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    paid: "bg-emerald-100 text-emerald-700",
    changes_requested: "bg-orange-100 text-orange-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status.replace(/_/g, " ").toUpperCase()}
    </span>
  );
};

async function handleDownload(contractId:string, milestoneId: string,data: {deliverableId: string} ) {
     try {

      console.log(contractId,milestoneId,data)
       const response = await clientActionApi.downloadMilestoneDeliverableFiles(contractId,  milestoneId, data);
 
       if (response instanceof Blob) {
         const url = window.URL.createObjectURL(response);
         const link = document.createElement("a");
         link.href = url;
         link.download = `deliverable-files.zip`;
         document.body.appendChild(link);
         link.click();
         link.remove();
         window.URL.revokeObjectURL(url);
       }
     } catch (error) {
       Swal.fire("Error", "Failed to download files", "error");
     }
}

export default function ClientMilestoneDetail({
  contractId,
  milestone,
  onClose,
  onApprove,
  onRequestChanges,
  onSuccess,
  onRespondToExtension,
}: ClientMilestoneDetailProps) {
  const [activeTab, setActiveTab] = useState<
    "approved" | "changes_requested" | "submitted"
  >("submitted");
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(
    null
  );
  const [feedback, setFeedback] = useState("");
  const [isApproving, setIsApproving] = useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isDeliverablesVideoModalOpen, setIsDeliverablesVideoModalOpen] =
    useState(false);
  const [isDeliverablesImageModalOpen, setIsDeliverablesImageModalOpen] =
    useState(false);
  const [extensionResponseMessage, setExtensionResponseMessage] = useState("");
  const [isRespondingToExtension, setIsRespondingToExtension] = useState(false);

  const approvedDeliverables = useMemo(
    () =>
      (milestone.deliverables || []).filter(
        (d: { status: string }) => d.status === "approved"
      ),
    [milestone]
  );

  const changesRequestedDeliverables = useMemo(
    () =>
      (milestone.deliverables || []).filter(
        (d: { status: string }) => d.status === "changes_requested"
      ),
    [milestone]
  );

  const submittedDeliverables = useMemo(
    () =>
      (milestone.deliverables || []).filter(
        (d: {
          status: string;
          revisionsRequested?: number;
          revisionsAllowed?: number;
        }) => d.status === "submitted"
      ),
    [milestone]
  );

  const handleApprove = async (deliverableId: string) => {
    const result = await Swal.fire({
      title: "Approve Deliverable?",
      text: "This will release the milestone payment to the freelancer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10B981",
    });

    if (result.isConfirmed) {
      setIsApproving(true);
      try {
        await onApprove(deliverableId);
        await Swal.fire(
          "Approved!",
          "Deliverable approved and payment released.",
          "success"
        );
        onSuccess();
        onClose();
      } catch (error) {
        await Swal.fire("Error", "Failed to approve deliverable", "error");
      } finally {
        setIsApproving(false);
      }
    }
  };

  const handleRequestChanges = (deliverableId: string) => {
    setSelectedDeliverable(deliverableId);
    setFeedbackModalOpen(true);
  };

  const submitFeedback = async () => {
    if (selectedDeliverable && feedback.trim()) {
      try {
        await onRequestChanges(selectedDeliverable, feedback);
        await Swal.fire(
          "Success",
          "Change request sent to freelancer",
          "success"
        );
        setFeedbackModalOpen(false);
        setFeedback("");
        setSelectedDeliverable(null);
        onSuccess();
        onClose();
      } catch (error) {
        await Swal.fire("Error", "Failed to request changes", "error");
      }
    }
  };

  const handleDelieverablesPreview = (mediaUrl: string) => {
    console.log(mediaUrl);
    const type = getMediaType({ url: mediaUrl });
    if (type === "video") {
      setVideoPreviewUrl(mediaUrl);
      setIsDeliverablesVideoModalOpen(true);
    } else if (type === "image") {
      console.log("gonna set true");
      setImagePreviewUrl(mediaUrl);
      setIsDeliverablesImageModalOpen(true);
      console.log(isDeliverablesImageModalOpen);
    }
  };

  const handleExtensionResponse = async (approved: boolean) => {
    if (!onRespondToExtension) return;

    const result = await Swal.fire({
      title: approved ? "Approve Extension?" : "Reject Extension?",
      text: approved
        ? `This will extend the milestone deadline to ${formatDate(milestone.extensionRequest?.requestedDeadline || "")}`
        : "Are you sure you want to reject this extension request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: approved ? "Approve" : "Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: approved ? "#10B981" : "#EF4444",
      input: !approved ? "textarea" : undefined,
      inputPlaceholder: !approved ? "Reason for rejection (optional)" : undefined,
    });

    if (result.isConfirmed) {
      setIsRespondingToExtension(true);
      try {
        await onRespondToExtension(approved, result.value || "");
        await Swal.fire(
          approved ? "Approved!" : "Rejected",
          approved
            ? "Extension request approved successfully"
            : "Extension request rejected",
          "success"
        );
        onSuccess();
        onClose();
      } catch (error) {
        await Swal.fire("Error", "Failed to respond to extension request", "error");
      } finally {
        setIsRespondingToExtension(false);
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {milestone.title}
                </h2>
                {getStatusBadge(milestone.status)}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  ₹{milestone.amount.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Due: {formatDate(milestone.expectedDelivery)}
                </span>
                {typeof milestone.revisionsAllowed !== "undefined" && (
                  <span>Revisions Allowed: {milestone.revisionsAllowed}</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {milestone.extensionRequest && milestone.extensionRequest.status === 'pending' && onRespondToExtension && (
            <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-900">Extension Request Pending</h3>
                  </div>
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Requested Deadline:</strong> {formatDate(milestone.extensionRequest.requestedDeadline)}
                  </p>
                  <p className="text-sm text-blue-800">
                    <strong>Reason:</strong> {milestone.extensionRequest.reason}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleExtensionResponse(true)}
                    disabled={isRespondingToExtension}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleExtensionResponse(false)}
                    disabled={isRespondingToExtension}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-colors font-medium"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}

          {milestone.extensionRequest && milestone.extensionRequest.status === 'approved' && (
            <div className="px-6 py-3 bg-green-50 border-b border-green-200">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-green-800 font-medium">
                  Extension approved: New deadline is {formatDate(milestone.extensionRequest.requestedDeadline)}
                </span>
              </div>
            </div>
          )}

          {milestone.extensionRequest && milestone.extensionRequest.status === 'rejected' && (
            <div className="px-6 py-3 bg-red-50 border-b border-red-200">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-red-800 font-medium">
                  Extension request rejected
                  {milestone.extensionRequest.responseMessage && `: ${milestone.extensionRequest.responseMessage}`}
                </span>
              </div>
            </div>
          )}

          <div className="flex border-b border-gray-200 px-6">
            <button
              onClick={() => setActiveTab("submitted")}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "submitted"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Under Review ({submittedDeliverables.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("changes_requested")}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "changes_requested"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Changes Requested ({changesRequestedDeliverables.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("approved")}
              className={`px-6 py-4 font-semibold border-b-2 transition-colors ${
                activeTab === "approved"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Approved ({approvedDeliverables.length})
              </div>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "submitted" && (
              <div className="space-y-4">
                {submittedDeliverables.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No deliverables under review
                  </div>
                ) : (
                  submittedDeliverables.map(
                    (deliverable: {
                      id: string;
                      version: number;
                      status: string;
                      submittedAt: string;
                      revisionsLeft?: number;
                      revisionsRequested?: number;
                      revisionsAllowed?: number;
                      message?: string;
                      files: { fileName: string; fileUrl: string }[];
                    }) => {
                      const isRevisionLimitReached =
                        (deliverable.revisionsLeft !== undefined &&
                          deliverable.revisionsLeft <= 0) ||
                        (deliverable.revisionsRequested !== undefined &&
                          deliverable.revisionsAllowed !== undefined &&
                          deliverable.revisionsRequested >=
                            deliverable.revisionsAllowed);

                      return (
                        <div
                          key={deliverable.id}
                          className="bg-white border-2 border-yellow-500 rounded-xl p-6 shadow-sm"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Clock className="w-5 h-5 text-yellow-600" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <h3 className="text-lg font-bold text-gray-900">
                                    Version {deliverable.version}
                                  </h3>
                                  {getStatusBadge(deliverable.status)}
                                </div>
                                <p className="text-sm text-gray-500">
                                  Submitted:{" "}
                                  {formatDate(deliverable.submittedAt)}
                                  {deliverable.revisionsLeft !== undefined && (
                                    <>
                                      {" "}
                                      • Revisions Left:{" "}
                                      {deliverable.revisionsLeft}
                                    </>
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>

                          {deliverable.message && (
                            <div className="mb-4">
                              <p className="text-gray-700">
                                {deliverable.message}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mb-4">
                            {deliverable.files.map(
                              (
                                file: { fileName: string; fileUrl: string },
                                fileIdx: number
                              ) => (
                                <div
                                  key={fileIdx}
                                  className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                                  onClick={() =>
                                    handleDelieverablesPreview(file.fileUrl)
                                  }
                                >
                                  <FileText className="w-4 h-4 text-gray-500" />
                                  <span className="text-sm text-gray-700">
                                    {file.fileName}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                          <button
                            onClick={() => {
                              handleDownload(contractId, milestone.id!,{deliverableId: deliverable.id})
                            }}
                            className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                          >
                            <FaDownload />
                            Download All
                          </button>

                          {isRevisionLimitReached && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <p className="text-sm text-red-800">
                                Revision limit reached. You can only approve or
                                reject this deliverable.
                              </p>
                            </div>
                          )}

                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleApprove(deliverable.id)}
                              className="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                              <ThumbsUp className="w-4 h-4" />
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleRequestChanges(deliverable.id)
                              }
                              disabled={isRevisionLimitReached}
                              className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
                              title={
                                isRevisionLimitReached
                                  ? "Revision limit reached"
                                  : ""
                              }
                            >
                              <MessageSquare className="w-4 h-4" />
                              Request Changes
                            </button>
                          </div>
                        </div>
                      );
                    }
                  )
                )}
              </div>
            )}

            {activeTab === "changes_requested" && (
              <div className="space-y-4">
                {changesRequestedDeliverables.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No deliverables requiring changes
                  </div>
                ) : (
                  changesRequestedDeliverables.map(
                    (deliverable: {
                      id: string;
                      version: number;
                      status: string;
                      submittedAt: string;
                      revisionsRequested?: number;
                      message?: string;
                      files: { fileName: string; fileUrl: string }[];
                    }) => (
                      <div
                        key={deliverable.id}
                        className="bg-white border-2 border-orange-500 rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <AlertCircle className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                  Version {deliverable.version}
                                </h3>
                                {getStatusBadge(deliverable.status)}
                              </div>
                              <p className="text-sm text-gray-500">
                                Submitted: {formatDate(deliverable.submittedAt)}
                                {deliverable.revisionsRequested !==
                                  undefined && (
                                  <>
                                    {" "}
                                    • Revisions:{" "}
                                    {deliverable.revisionsRequested}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {deliverable.message && (
                          <div className="mb-4">
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                              <p className="text-sm font-semibold text-orange-900 mb-2">
                                Your Feedback:
                              </p>
                              <p className="text-sm text-orange-800">
                                {deliverable.message}
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {deliverable.files.map(
                            (
                              file: { fileName: string; fileUrl: string },
                              fileIdx: number
                            ) => (
                              <div
                                key={fileIdx}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                                onClick={() =>
                                  handleDelieverablesPreview(file.fileUrl)
                                }
                              >
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">
                                  {file.fileName}
                                </span>
                              </div>
                            )
                          )}
                        </div>

                        <button
                        onClick={() => {
                              handleDownload(contractId, milestone.id!,{deliverableId: deliverable.id})
                            }}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <FaDownload />
                          Download All
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            )}

            {activeTab === "approved" && (
              <div className="space-y-4">
                {approvedDeliverables.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No approved deliverables yet
                  </div>
                ) : (
                  approvedDeliverables.map(
                    (deliverable: {
                      id: string;
                      version: number;
                      status: string;
                      submittedAt: string;
                      approvedAt?: string;
                      message?: string;
                      files: { fileName: string; fileUrl: string }[];
                    }) => (
                      <div
                        key={deliverable.id}
                        className="bg-white border-2 border-[#108A00] rounded-xl p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-[#108A00] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-5 h-5 text-[#108A00]" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-bold text-gray-900">
                                  Version {deliverable.version}
                                </h3>
                                {getStatusBadge(deliverable.status)}
                              </div>
                              <p className="text-sm text-gray-500">
                                Submitted: {formatDate(deliverable.submittedAt)}
                                {deliverable.approvedAt && (
                                  <>
                                    {" "}
                                    • Approved:{" "}
                                    {formatDate(deliverable.approvedAt)}
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {deliverable.message && (
                          <div className="mb-4">
                            <p className="text-gray-700">
                              {deliverable.message}
                            </p>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2">
                          {deliverable.files.map(
                            (
                              file: { fileName: string; fileUrl: string },
                              fileIdx: number
                            ) => (
                              <div
                                key={fileIdx}
                                className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg"
                                onClick={() =>
                                  handleDelieverablesPreview(file.fileUrl)
                                }
                              >
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-700">
                                  {file.fileName}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                            <button
                        onClick={() => {
                              handleDownload(contractId, milestone.id!,{deliverableId: deliverable.id})
                            }}
                          className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                        >
                          <FaDownload />
                          Download All
                        </button>
                      </div>
                    )
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                Request Changes
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Provide feedback on what needs to be revised
              </p>
            </div>

            <div className="p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Feedback for Freelancer
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Please describe what changes are needed and why..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                rows={6}
              />
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setFeedbackModalOpen(false);
                  setFeedback("");
                  setSelectedDeliverable(null);
                }}
                className="flex-1 px-4 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                disabled={!feedback.trim()}
                className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {videoPreviewUrl && isDeliverablesVideoModalOpen && (
        <VideoPlayer
          videoUrl={videoPreviewUrl}
          onClose={() => setIsDeliverablesVideoModalOpen(false)}
        />
      )}

      {imagePreviewUrl && isDeliverablesImageModalOpen && (
        <ImageViewerModal
          isOpen={isDeliverablesImageModalOpen}
          imageUrl={imagePreviewUrl}
          onClose={() => setIsDeliverablesImageModalOpen(false)}
        />
      )}
    </>
  );
}
