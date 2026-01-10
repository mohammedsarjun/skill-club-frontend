"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Clock, CheckCircle2, AlertCircle, X, Upload, FileText, Trash2, Download } from "lucide-react";
import { formatDate } from "@/utils/formatDate";
import { IFreelancerContractDetail } from "@/types/interfaces/IFreelancerContractDetail";

interface MilestoneDetailProps {
  milestone: NonNullable<IFreelancerContractDetail["milestones"]>[number];
  onClose: () => void;
  files: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (idx: number) => void;
  message: string;
  setMessage: (val: string) => void;
  onSubmit: () => void;
  canSubmit?: boolean;
  onRequestExtension?: () => void;
  isUploadDisabled?: boolean;
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
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}>{status.replace(/_/g, " ").toUpperCase()}</span>
  );
};

const getDeliverableStatusBadge = (status: string) => {
  return getStatusBadge(status);
};

export const MilestoneDetail: React.FC<MilestoneDetailProps> = ({
  milestone,
  onClose,
  files,
  onFileUpload,
  removeFile,
  message,
  setMessage,
  onSubmit,
  canSubmit = true,
  onRequestExtension,
  isUploadDisabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<"approved" | "changes_requested" | "submitted">("approved");

  const approvedDeliverables = useMemo(() => (milestone.deliverables || []).filter(d => d.status === "approved"), [milestone]);
  const changesRequestedDeliverables = useMemo(() => (milestone.deliverables || []).filter(d => d.status === "changes_requested"), [milestone]);
  const submittedDeliverables = useMemo(() => (milestone.deliverables || []).filter(d => d.status === "submitted"), [milestone]);

  const canRequestExtension = 
    milestone.status === 'funded' && 
    (!milestone.extensionRequest || 
     (milestone.extensionRequest.status === 'rejected') || (milestone.extensionRequest.status === 'approved'));
  
  const hasExtensionRequest = milestone.extensionRequest && milestone.extensionRequest.status === 'pending';


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm  flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{milestone.title}</h2>
              {getStatusBadge(milestone.status)}
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">₹{milestone.amount.toLocaleString()}</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Due: {formatDate(milestone.expectedDelivery)}
              </span>
              {typeof milestone.revisionsAllowed !== "undefined" && (
                <span>Revisions Allowed: {milestone.revisionsAllowed}</span>
              )}
            </div>
            {hasExtensionRequest && milestone.extensionRequest && (
              <div className="mt-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Extension Request Pending</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Requested new deadline: <span className="font-medium">{formatDate(milestone.extensionRequest.requestedDeadline)}</span>
                    </p>
                    <p className="text-xs text-blue-600 mt-1">Waiting for client approval</p>
                  </div>
                </div>
              </div>
            )}
            {milestone.extensionRequest && milestone.extensionRequest.status === 'approved' && (
              <div className="mt-3 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Extension Approved</p>
                    <p className="text-sm text-green-700 mt-1">
                      New deadline: <span className="font-medium">{formatDate(milestone.extensionRequest.requestedDeadline)}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
            {milestone.extensionRequest && milestone.extensionRequest.status === 'rejected' && (
              <div className="mt-3 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-900">Extension Request Rejected</p>
                    {milestone.extensionRequest.responseMessage && (
                      <p className="text-sm text-red-700 mt-1">
                        <span className="font-medium">Reason:</span> {milestone.extensionRequest.responseMessage}
                      </p>
                    )}
                    <p className="text-xs text-red-600 mt-1">You can submit a new extension request</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {onRequestExtension && (
          <div className="px-6 py-3 bg-blue-50 border-y border-blue-200">
            <button
              onClick={onRequestExtension}
              disabled={!canRequestExtension}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium text-sm"
            >
              <Clock className="w-4 h-4" />
              {hasExtensionRequest ? 'Extension Request Pending' : 'Request Extension'}
            </button>
            {!canRequestExtension && !hasExtensionRequest && milestone.extensionRequest?.status === 'approved' && (
              <p className="text-xs text-gray-600 mt-2">Extension already approved - new deadline applied</p>
            )}
          </div>
        )}

        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab("approved")}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === "approved" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Approved ({approvedDeliverables.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("changes_requested")}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === "changes_requested" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Changes Requested ({changesRequestedDeliverables.length})
            </div>
          </button>
          <button
            onClick={() => setActiveTab("submitted")}
            className={`px-6 py-4 font-semibold border-b-2 transition-colors ${activeTab === "submitted" ? "border-indigo-600 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Under Review ({submittedDeliverables.length})
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "approved" && (
            <div className="space-y-4">
              {approvedDeliverables.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No approved deliverables yet</div>
              ) : (
                approvedDeliverables.map((deliverable) => (
                  <div key={deliverable.id} className="bg-white border-2 border-[#108A00] rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-[#108A00] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckCircle2 className="w-5 h-5 text-[#108A00]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">Version {deliverable.version}</h3>
                            {getDeliverableStatusBadge(deliverable.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Submitted: {formatDate(deliverable.submittedAt)}
                            {deliverable.approvedAt && <> • Approved: {formatDate(deliverable.approvedAt)}</>}
                          </p>
                        </div>
                      </div>
                    </div>
                    {deliverable.message && (
                      <div className="mb-4">
                        <p className="text-gray-700">{deliverable.message}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {deliverable.files.map((file, fileIdx) => (
                        <a
                          key={fileIdx}
                          href={file.fileUrl}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.fileName}</span>
                          <Download className="w-3 h-3 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "changes_requested" && (
            <div className="space-y-4">
              {changesRequestedDeliverables.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No deliverables requiring changes</div>
              ) : (
                changesRequestedDeliverables.map((deliverable) => (
                  <div key={deliverable.id} className="bg-white border-2 border-orange-500 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AlertCircle className="w-5 h-5 text-orange-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">Version {deliverable.version}</h3>
                            {getDeliverableStatusBadge(deliverable.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Submitted: {formatDate(deliverable.submittedAt)}
                            {deliverable.revisionsRequested !== undefined && deliverable.revisionsAllowed !== undefined && (
                              <> • Revisions: {deliverable.revisionsRequested}/{deliverable.revisionsAllowed}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    {deliverable.message && (
                      <div className="mb-4">
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <p className="text-sm font-semibold text-orange-900 mb-2">Client Feedback:</p>
                          <p className="text-sm text-orange-800">{deliverable.message}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {deliverable.files.map((file, fileIdx) => (
                        <a
                          key={fileIdx}
                          href={file.fileUrl}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.fileName}</span>
                          <Download className="w-3 h-3 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "submitted" && (
            <div className="space-y-4">
              {submittedDeliverables.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No deliverables under review</div>
              ) : (
                submittedDeliverables.map((deliverable) => (
                  <div key={deliverable.id} className="bg-white border-2 border-yellow-500 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-bold text-gray-900">Version {deliverable.version}</h3>
                            {getDeliverableStatusBadge(deliverable.status)}
                          </div>
                          <p className="text-sm text-gray-500">
                            Submitted: {formatDate(deliverable.submittedAt)}
                            {deliverable.revisionsLeft !== undefined && (
                              <> • Revisions Left: {deliverable.revisionsLeft}</>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    {deliverable.message && (
                      <div className="mb-4">
                        <p className="text-gray-700">{deliverable.message}</p>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {deliverable.files.map((file, fileIdx) => (
                        <a
                          key={fileIdx}
                          href={file.fileUrl}
                          download={file.fileName}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{file.fileName}</span>
                          <Download className="w-3 h-3 text-gray-400" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {canSubmit && !isUploadDisabled && (
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Submit New Deliverable</h3>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Files *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-indigo-600 transition-colors">
                <input type="file" multiple onChange={onFileUpload} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-700">Click to upload files</span>
                  <span className="text-xs text-gray-500 mt-1">or drag and drop</span>
                </label>
              </div>
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={() => removeFile(idx)} className="p-1 hover:bg-red-50 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Message</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe what you've delivered, any notes for review, or responses to feedback..." className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none" rows={4} />
            </div>

            <button onClick={onSubmit} disabled={files.length === 0} className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors">
              Submit Deliverable (Version {(milestone.deliverables || []).length + 1})
            </button>
          </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default MilestoneDetail;