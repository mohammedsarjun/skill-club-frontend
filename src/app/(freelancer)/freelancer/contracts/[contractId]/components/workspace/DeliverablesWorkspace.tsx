"use client";
import { useState, useCallback } from "react";
import {
  FaUpload,
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaFile,
  FaTrash,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";
import { IDeliverable } from "@/types/interfaces/IContractWorkspace";
import { uploadApi } from "@/api/uploadApi";
import VideoPlayer from "@/components/common/VideoPlayer";
import ImageViewerModal from "@/components/common/ImageViewer";
import getMediaType from "@/utils/getMediaType";
import toast from "react-hot-toast";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import { formatDateTime } from "@/utils/formatDate";

interface DeliverablesWorkspaceProps {
  contractId: string;
  currentDeliverables: IDeliverable[];
  onSubmitDeliverable: (
    files: { fileName: string; fileUrl: string }[],
    message: string
  ) => Promise<void>;
  onResubmitDeliverable: (
    deliverableId: string,
    files: { fileName: string; fileUrl: string }[],
    message: string
  ) => Promise<void>;
  contractStatus?: string;
}

export const DeliverablesWorkspace = ({
  contractId,
  currentDeliverables,
  onSubmitDeliverable,
  onResubmitDeliverable,
  contractStatus,
}: DeliverablesWorkspaceProps) => {
  console.log(currentDeliverables);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isDeliverablesVideoModalOpen, setIsDeliverablesVideoModalOpen] =
    useState(false);
  const [isDeliverablesImageModalOpen, setIsDeliverablesImageModalOpen] =
    useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const isUploadDisabled =
    contractStatus === "cancelled" || contractStatus === "disputed" || contractStatus === "cancellation_requested";
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const handleDeliverablePreview = (mediaUrl: string) => {
    const type = getMediaType({ url: mediaUrl });
    if (type === "video") {
      setVideoPreviewUrl(mediaUrl);
      setIsDeliverablesVideoModalOpen(true);
    } else if (type === "image") {
      setImagePreviewUrl(mediaUrl);
      setIsDeliverablesImageModalOpen(true);
    }
  };

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        setFiles((prev) => [...prev, ...newFiles]);
      }
    },
    []
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploadedFiles = await Promise.all(
        files.map((file) =>
          uploadApi.uploadFile(file, {
            folder: `contracts/${contractId}/deliverables`,
            resourceType: "auto",
          })
        )
      );
      const fileData = uploadedFiles.map((uploaded, idx) => ({
        fileName: files[idx].name,
        fileUrl: uploaded.url,
      }));

      await onSubmitDeliverable(fileData, message);
      setFiles([]);
      setMessage("");
    } catch (error) {
      console.error("Failed to submit deliverable", error);
    } finally {
      setUploading(false);
    }
  }, [files, message, contractId, onSubmitDeliverable]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FaClock className="text-xs" />
            Submitted
          </span>
        );
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <FaCheckCircle className="text-xs" />
            Approved
          </span>
        );
      case "changes_requested":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
            <FaExclamationCircle className="text-xs" />
            Needs Revision
          </span>
        );

      case "change_request_approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-black-800">
            <FaExclamationCircle className="text-xs" />
            Request Approved
          </span>
        );
      default:
        return null;
    }
  };

  async function approveDeliverableChanges(
    contractId: string,
    deliverableId: string
  ) {
    try {
      console.log(deliverableId);

      const response = await freelancerActionApi.approveDeliverableChanges(
        contractId,
        deliverableId
      );

      if (response.success) {
        toast.success("Revision approved");
      } else {
        toast.error("not approved");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const latestDeliverable =
    currentDeliverables.length > 0
      ? currentDeliverables[currentDeliverables.length - 1]
      : null;
  const showUploadSection =
    !isUploadDisabled &&
    (!latestDeliverable ||
      latestDeliverable.status === "change_request_approved");

  return (
    <div className="space-y-6">
      {isUploadDisabled && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-center">
            {contractStatus === "cancelled"
              ? "This contract has been cancelled. No new deliverables can be submitted."
              : "This contract is under dispute. No new deliverables can be submitted."}
          </p>
        </div>
      )}

      {currentDeliverables.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Submitted Deliverables
          </h3>
          <div className="space-y-4">
            {currentDeliverables.map((deliverable, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(deliverable.status)}
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        v{index + 1}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDateTime(deliverable.submittedAt)}
                      </span>
                    </div>
                    {deliverable.message && (
                      <p className="text-gray-700 text-sm mt-2">
                        {deliverable.message}
                      </p>
                    )}
                    {deliverable.revisionNote &&
                      deliverable.status === "changes_requested" && (
                        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm text-orange-800">
                            <strong>Revision Note:</strong>{" "}
                            {deliverable.revisionNote}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {deliverable.files.map((file, idx) => (
                    <a
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm transition-colors cursor-pointer"
                      onClick={() => handleDeliverablePreview(file.fileUrl)}
                    >
                      <FaFile className="text-gray-500" />
                      <span className="text-gray-700">{file.fileName}</span>
                    </a>
                  ))}
                </div>
                {deliverable.status == "changes_requested" && (
                  <div className="flex gap-4 mt-3">
                    {/* Accept Button */}
                    <button
                      className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white
                   shadow-md transition-all duration-300 hover:bg-emerald-700 hover:shadow-lg active:scale-95"
                      onClick={() =>
                        approveDeliverableChanges(
                          contractId,
                          deliverable.deliverableId!
                        )
                      }
                    >
                      <FaCheck className="h-5 w-5" />
                      Accept
                    </button>

                    {/* Raise Dispute Button */}
                    <button
                      className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white
                   shadow-md transition-all duration-300 hover:bg-red-700 hover:shadow-lg active:scale-95"
                    >
                      <FaExclamationTriangle className="h-5 w-5" />
                      Raise Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showUploadSection && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {latestDeliverable?.status === "changes_requested"
              ? "Submit Revision"
              : "Submit Deliverable"}
          </h3>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FaUpload className="mx-auto text-4xl text-gray-400 mb-3" />
            <p className="text-gray-600 mb-2">
              Drag and drop files here, or click to select
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose Files
            </label>
          </div>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <FaFile className="text-gray-500" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(file.size / 1024).toFixed(2)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a note about your deliverable..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={files.length === 0 || uploading}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {uploading ? "Uploading..." : "Submit Deliverable"}
          </button>
        </div>
      )}

      {latestDeliverable?.status === "approved" && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <FaCheckCircle className="mx-auto text-5xl text-green-600 mb-3" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Contract Completed!
          </h3>
          <p className="text-green-700">
            Your deliverable has been approved by the client.
          </p>
        </div>
      )}

      {isDeliverablesImageModalOpen && (
        <ImageViewerModal
          imageUrl={imagePreviewUrl}
          onClose={() => setIsDeliverablesImageModalOpen(false)}
          isOpen={isDeliverablesImageModalOpen}
        />
      )}

      {isDeliverablesVideoModalOpen && (
        <VideoPlayer
          videoUrl={videoPreviewUrl}
          onClose={() => setIsDeliverablesVideoModalOpen(false)}
        />
      )}
    </div>
  );
};
