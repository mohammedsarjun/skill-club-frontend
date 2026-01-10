"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaClock,
  FaFile,
  FaCamera,
  FaVideo,
  FaDownload,
} from "react-icons/fa";
import { IDeliverable } from "@/types/interfaces/IContractWorkspace";
import VideoPlayer from "@/components/common/VideoPlayer";
import { set } from "lodash";
import getMediaType from "@/utils/getMediaType";
import ImageViewer from "@/components/common/ImageViewer";
import ImageViewerModal from "@/components/common/ImageViewer";
import { clientActionApi } from "@/api/action/ClientActionApi";
interface ClientDeliverablesViewProps {
  contractId: string;
  deliverables: IDeliverable[];
  onApproveDeliverable: (
    deliverableId: string,
    message?: string
  ) => Promise<void>;
  onRequestChanges: (deliverableId: string, note: string) => Promise<void>;
  onProposeMeeting: () => void;
  contractStatus?: string;
}

export const ClientDeliverablesView = ({
  contractId,
  deliverables,
  onApproveDeliverable,
  onRequestChanges,
  onProposeMeeting,
  contractStatus,
}: ClientDeliverablesViewProps) => {
  const [revisionNote, setRevisionNote] = useState("");
  const [selectedDeliverableId, setSelectedDeliverableId] = useState<
    string | null
  >(null);

  const [isDeliverablesVideoModalOpen, setIsDeliverablesVideoModalOpen] =
    useState(false);
  const [isDeliverablesImageModalOpen, setIsDeliverablesImageModalOpen] =
    useState(false);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");

  const isActionsDisabled = contractStatus === 'cancelled' || contractStatus === 'disputed';

  console.log("Deliverables:", deliverables);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <FaClock className="text-xs" />
            Awaiting Review
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
            Changes Requested
          </span>
        );
      default:
        return null;
    }
  };

  const handleDelieverablesPreview = (mediaUrl: string) => {
    const type = getMediaType({ url: mediaUrl });
    if (type === "video") {
      setVideoPreviewUrl(mediaUrl);
      setIsDeliverablesVideoModalOpen(true);
    } else if (type === "image") {
      setImagePreviewUrl(mediaUrl);
      setIsDeliverablesImageModalOpen(true);
    }
  };

  const handleDownloadAllFiles = async (deliverableId: string) => {
    try {
      const response = await clientActionApi.downloadDeliverableFiles(contractId, {
        deliverableId,
      });

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
  };

  return (
    <div className="space-y-6">
      {deliverables.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <FaFile className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500">No deliverables submitted yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {deliverables.map((deliverable, index) => {
            const resolvedId =
              (deliverable as any).deliverableId ||
              (deliverable as any).id ||
              null;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusBadge(deliverable.status)}
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      v{deliverable.version}
                    </span>
                    {typeof (deliverable as any).revisionsLeft === "number" && (
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                        Revisions left: {(deliverable as any).revisionsLeft}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Submitted on{" "}
                      {new Date(deliverable.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    {deliverable.approvedAt && (
                      <p className="text-sm text-green-600 mt-1">
                        Approved on{" "}
                        {new Date(deliverable.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {deliverable.message && (
                  <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Freelancer Note:
                    </p>
                    <p className="text-gray-800">{deliverable.message}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Files:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {deliverable.files.map((file, idx) => (
                      <a
                        key={idx}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm transition-colors cursor-pointer"
                        onClick={() => handleDelieverablesPreview(file.fileUrl)}
                      >
                        <FaFile className="text-blue-600" />
                        <span className="text-blue-800">{file.fileName}</span>
                      </a>
                    ))}
                  </div>
                  {deliverable.files.length > 0 && (
                    <button
                      onClick={() => handleDownloadAllFiles(resolvedId || "")}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      <FaDownload />
                      Download All
                    </button>
                  )}
                </div>

                {deliverable.status === "submitted" && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {selectedDeliverableId === resolvedId ? (
                      <div className="space-y-3">
                        <textarea
                          value={revisionNote}
                          onChange={(e) => setRevisionNote(e.target.value)}
                          placeholder="Explain what changes are needed..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={async () => {
                              if (resolvedId && revisionNote.trim()) {
                                await onRequestChanges(
                                  resolvedId,
                                  revisionNote
                                );
                                setRevisionNote("");
                                setSelectedDeliverableId(null);
                              }
                            }}
                            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                          >
                            Submit Request
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDeliverableId(null);
                              setRevisionNote("");
                            }}
                            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={async () => {
                            console.log(
                              "Approve button clicked for",
                              resolvedId
                            );
                            if (!resolvedId) return;
                            try {
                              const swalRes = await Swal.fire<string>({
                                title: "Approve and Pay",
                                html: `<textarea id="approval-note" class="swal2-textarea" placeholder="Optional message to freelancer"></textarea>`,
                                showCancelButton: true,
                                confirmButtonText: "Approve and Pay",
                                cancelButtonText: "Cancel",
                                focusConfirm: false,
                                preConfirm: () => {
                                  const el = document.getElementById(
                                    "approval-note"
                                  ) as HTMLTextAreaElement | null;
                                  return el?.value || "";
                                },
                              });
                              if (swalRes.isConfirmed) {
                                const note = swalRes.value || undefined;
                                console.log("Approval note:", note);
                                await onApproveDeliverable(resolvedId, note);
                              }
                            } catch (err) {
                              console.error("Error during approve flow", err);
                              Swal.fire(
                                "Error",
                                "Failed to approve deliverable",
                                "error"
                              );
                            }
                          }}
                          disabled={isActionsDisabled}
                          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                            isActionsDisabled
                              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700 transition-colors'
                          }`}
                        >
                          <FaCheckCircle />
                          Approve and Pay
                        </button>

                        <button
                          onClick={() =>
                            setSelectedDeliverableId(resolvedId || null)
                          }
                          disabled={
                            isActionsDisabled ||
                            (typeof (deliverable as any).revisionsLeft ===
                              "number" &&
                            (deliverable as any).revisionsLeft <= 0)
                          }
                          className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 ${
                            isActionsDisabled ||
                            (typeof (deliverable as any).revisionsLeft ===
                              "number" &&
                            (deliverable as any).revisionsLeft <= 0)
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                          }`}
                        >
                          <FaExclamationCircle />
                          Request Changes
                        </button>

                        {deliverable.isMeetingAlreadyProposed ? (
                          <button
                            disabled
                            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed"
                          >
                            <FaVideo />
                            Meeting proposal already sent
                          </button>
                        ) : (
                          <button
                            onClick={onProposeMeeting}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                          >
                            <FaVideo />
                            Propose Meeting
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
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
          onClose={()=>setIsDeliverablesVideoModalOpen(false)}
        />
      )}
    </div>
  );
};
