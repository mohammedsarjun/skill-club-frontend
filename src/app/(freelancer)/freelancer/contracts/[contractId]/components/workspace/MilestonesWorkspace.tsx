"use client";

import React, { useState } from "react";
import { FaUpload, FaTimes, FaFileAlt, FaCheckCircle, FaClock, FaExclamationCircle, FaCalendarAlt, FaPaperPlane } from "react-icons/fa";
import Swal from "sweetalert2";
import { uploadApi } from "@/api/uploadApi";
import { IFreelancerContractDetail } from "@/types/interfaces/IFreelancerContractDetail";
import { Calendar, Clock, DollarSign, Lock } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import MilestoneDetail from "./MilestoneDetail";
import { freelancerActionApi } from "@/api/action/FreelancerActionApi";
import MilestoneExtensionModal from "../../components/MilestoneExtensionModal";

interface MilestonesWorkspaceProps {
  contractId: string;
  milestones: IFreelancerContractDetail["milestones"];
  currency: string;
  onSubmitMilestone: (contractId: string, milestoneId: string, files: string[], message: string) => Promise<void>;
  onRequestExtension: (contractId: string, milestoneId: string, requestedDeadline: string, reason: string) => Promise<void>;
  contractStatus?: string;
}

export const MilestonesWorkspace: React.FC<MilestonesWorkspaceProps> = ({
  contractId,
  milestones,
  currency,
  onSubmitMilestone,
  onRequestExtension,
  contractStatus,
}) => {
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const isUploadDisabled = contractStatus === 'cancelled' || contractStatus === 'disputed' || contractStatus === 'cancellation_requested';
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [extensionMilestoneId, setExtensionMilestoneId] = useState<string | null>(null);
  const [selectedMilestoneDetail, setSelectedMilestoneDetail] = useState<NonNullable<IFreelancerContractDetail["milestones"]>[number] | null>(null);

  const extensionMilestone = milestones?.find((m) => m.milestoneId === extensionMilestoneId);

  const canSubmitDeliverable = (milestone?: NonNullable<typeof selectedMilestoneDetail>): boolean => {
  
    if (!milestone) return false;
    if (milestone.status === "submitted" || milestone.status === "approved" || milestone.status === "paid") return false;

    if (milestone.status !== "funded" && milestone.status !== "changes_requested") return false;
    
    const deliverables = milestone.deliverables || [];
    const latestDeliverable = deliverables[deliverables.length - 1];
    if (!latestDeliverable) return true;
    
    return latestDeliverable.status === "changes_requested";
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-gray-100 text-gray-700",
      funded: "bg-blue-100 text-blue-700",
      submitted: "bg-yellow-100 text-yellow-700",
      under_review: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      paid: "bg-emerald-100 text-emerald-700",
      changes_requested: "bg-orange-100 text-orange-700",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"}`}>
        {status.replace("_", " ").toUpperCase()}
      </span>
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async (): Promise<string[]> => {
    if (files.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Files",
        text: "Please select files to upload",
      });
      return [];
    }

    setUploading(true);
    try {
      const uploadedFileUrls = await Promise.all(
        files.map(async (file) => {
          const response = await uploadApi.uploadFile(file, {
            folder: `contracts/${contractId}/milestones`,
            resourceType: "auto",
          });
          return response.url;
        })
      );

      setUploadedUrls(uploadedFileUrls);
      
      Swal.fire({
        icon: "success",
        title: "Files Uploaded",
        text: "Files uploaded successfully. Add a message and submit.",
        timer: 2000,
      });
      return uploadedFileUrls;
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Failed to upload files. Please try again.",
      });
    } finally {
      setUploading(false);
    }
    return [];
  };





  const handleExtensionClick = (milestoneId: string) => {
    setExtensionMilestoneId(milestoneId);
    setIsExtensionModalOpen(true);
  };

  const handleExtensionSubmit = async (requestedDeadline: string, reason: string) => {
    if (!extensionMilestoneId) return;
    await onRequestExtension(contractId, extensionMilestoneId, requestedDeadline, reason);
    setIsExtensionModalOpen(false);
    setExtensionMilestoneId(null);
  };

  async function showMilestoneDetail(milestoneId: string | undefined) {
    if (!milestoneId) return;
    
    const milestone = milestones?.find((m) => m.milestoneId === milestoneId);
    if (milestone) {
      setSelectedMilestoneDetail(milestone);
      setSelectedMilestoneId(milestoneId);
    }
  }

  const getDeliverableStatusIcon = (status: string) => {
    switch (status) {
      case "submitted":
        return <FaClock className="text-yellow-500" />;
      case "approved":
        return <FaCheckCircle className="text-green-500" />;
      case "changes_requested":
        return <FaExclamationCircle className="text-orange-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

   async function handleMilestoneUpload() {
    console.log("button clicked to upload files");
    if (files.length === 0) {
      Swal.fire({ icon: 'warning', title: 'No Files', text: 'Please select files to upload' });
      return;
    }

    if (message.trim() === "") {
      Swal.fire({ icon: 'warning', title: 'Message Required', text: 'Please add a message describing your deliverable' });
      return;
    }
    setUploading(true);
    try {
      const uploadedFileUrls = await Promise.all(
        files.map(async (file) => {
          const response = await uploadApi.uploadFile(file, {
            folder: `contracts/${contractId}/milestones`,
            resourceType: 'auto',
          });
          return response.url;
        })
      );

      setUploadedUrls(uploadedFileUrls);

      // Use the provided callback so the parent (page.tsx) can format filenames
      // into { fileName, fileUrl } objects. This keeps filename and url separate.
      if (onSubmitMilestone && selectedMilestoneId) {
        await onSubmitMilestone(contractId, selectedMilestoneId, uploadedFileUrls, message);
        setFiles([]);
        setUploadedUrls([]);
        setMessage("");
        setSelectedMilestoneId(null);
        setSelectedMilestoneDetail(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Failed to upload files. Please try again.' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Milestones</h2>

      {isUploadDisabled && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-800 text-center">
            {contractStatus === 'cancelled' 
              ? 'This contract has been cancelled. No new deliverables can be submitted.' 
              : 'This contract is under dispute. No new deliverables can be submitted.'}
          </p>
        </div>
      )}

      <div className={selectedMilestoneDetail ? 'grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'}>
        {/* Left: milestones list (narrow when a milestone is selected) */}
        <div className={selectedMilestoneDetail ? 'lg:col-span-1' : 'lg:col-span-3'}>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className="text-xl font-bold text-gray-900 mb-4">Contract Milestones</h1>
            {/* Milestones List */}
   
            <div className="grid gap-4 mb-8"> 
              {(milestones || []).map((milestone,i) => (
                
             <div
  key={i}
  onClick={() => {
    if (milestone.status === "pending_funding") return;
    showMilestoneDetail(milestone.milestoneId);
  }}
  className={`relative rounded-xl border p-6 transition-all bg-white ${
    milestone.status === "pending_funding"
      ? "cursor-not-allowed opacity-50"
      : "cursor-pointer hover:shadow-md"
  }`}
>
  {/* Lock overlay */}
  {milestone.status === "pending_funding" && (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70">
      <Lock className="h-10 w-10 text-gray-500" />
    </div>
  )}

  {/* Header */}
  <div className="mb-4 flex items-start justify-between">
    <h3 className="text-xl font-semibold text-gray-900">
      {milestone.title}
    </h3>
  </div>

  {/* Details */}
  <div className="grid grid-cols-3 gap-4">
    <div className="flex items-center gap-2">
      <DollarSign className="h-5 w-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">Amount</p>
        <p className="text-sm font-semibold text-gray-900">
          ${milestone.amount.toLocaleString()}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">Expected Delivery</p>
        <p className="text-sm font-semibold text-gray-900">
          {formatDate(milestone.expectedDelivery)}
        </p>
      </div>
    </div>

    <div className="text-sm font-medium text-gray-700">
      Revisions Allowed: {milestone.revisionsAllowed}
    </div>
  </div>
</div>
              ))}
            </div>
          </div>
        </div>

       

        {selectedMilestoneDetail && (

          <MilestoneDetail
            milestone={selectedMilestoneDetail}
            onClose={() => {
              setSelectedMilestoneId(null);
              setSelectedMilestoneDetail(null);
            }}
            files={files}
            onFileUpload={handleFileChange}
            removeFile={(idx) => handleRemoveFile(idx)}
            message={message}
            setMessage={(val) => setMessage(val)}
            canSubmit={canSubmitDeliverable(selectedMilestoneDetail)}
            onSubmit={handleMilestoneUpload}
            onRequestExtension={
              selectedMilestoneDetail.status === 'funded' &&
              (!selectedMilestoneDetail.extensionRequest || selectedMilestoneDetail.extensionRequest.status !== 'pending')
                ? () => handleExtensionClick(selectedMilestoneDetail.milestoneId)
                : undefined
            }
            isUploadDisabled={isUploadDisabled}
          />
        )}
      </div>

      {isExtensionModalOpen && extensionMilestone && (
        <MilestoneExtensionModal
          isOpen={isExtensionModalOpen}
          onClose={() => {
            setIsExtensionModalOpen(false);
            setExtensionMilestoneId(null);
          }}
          milestoneDeadline={extensionMilestone.expectedDelivery}
          onSubmit={handleExtensionSubmit}
        />
      )}
    </div>
  );
};
