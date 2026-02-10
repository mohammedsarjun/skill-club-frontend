import React, { useState } from 'react';
import { AlertCircle, DollarSign, Calendar, ChevronDown, ChevronUp, FileText, Eye, CheckCircle } from 'lucide-react';
import { IAdminDisputeMilestone } from '@/types/interfaces/IAdminDisputeDetail';
import ImageViewer from '@/components/common/ImageViewer';

interface MilestonesTabProps {
  milestones: IAdminDisputeMilestone[];
  scopeId?: string;
}

export const MilestonesTab: React.FC<MilestonesTabProps> = ({ milestones, scopeId }) => {
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getMilestoneStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending_funding: 'bg-gray-100 text-gray-700',
      funded: 'bg-blue-100 text-blue-700',
      submitted: 'bg-purple-100 text-purple-700',
      approved: 'bg-green-100 text-green-700',
      paid: 'bg-green-100 text-green-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  const toggleMilestone = (milestoneId: string) => {
    setExpandedMilestone(expandedMilestone === milestoneId ? null : milestoneId);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contract Milestones</h2>
      <div className="space-y-4">
        {milestones.map((milestone) => {
          const isDisputed = scopeId === milestone.milestoneId;
          const isExpanded = expandedMilestone === milestone.milestoneId;
          const hasDeliverables = milestone.deliverables && milestone.deliverables.length > 0;

          return (
            <div
              key={milestone.milestoneId}
              className={`border rounded-lg overflow-hidden ${
                isDisputed ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="p-5">
                {isDisputed && (
                  <div className="flex items-center gap-2 mb-3 text-red-700">
                    <AlertCircle size={18} />
                    <span className="font-semibold text-sm">DISPUTED MILESTONE</span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{milestone.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <DollarSign size={14} />
                        ${milestone.amount.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Due: {new Date(milestone.expectedDelivery).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getMilestoneStatusColor(milestone.status)}`}>
                    {milestone.status.replace(/_/g, ' ').toUpperCase()}
                  </span>
                </div>

                {milestone.submittedAt && (
                  <div className="text-sm text-gray-600 flex gap-4 mb-3">
                    <span>Submitted: {new Date(milestone.submittedAt).toLocaleDateString()}</span>
                    {milestone.approvedAt && (
                      <span>Approved: {new Date(milestone.approvedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                )}

                {isDisputed && !milestone.submittedAt && (
                  <div className="mt-3 bg-white border border-red-200 rounded p-3 text-sm text-red-800">
                    <strong>Issue:</strong> This milestone is under dispute
                  </div>
                )}

                {hasDeliverables && (
                  <button
                    onClick={() => toggleMilestone(milestone.milestoneId)}
                    className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    {isExpanded ? 'Hide' : 'Show'} Deliverables ({milestone.deliverables?.length || 0})
                  </button>
                )}
              </div>

              {isExpanded && hasDeliverables && (
                <div className="border-t border-gray-200 p-5 bg-gray-50">
                  <h4 className="font-semibold text-gray-900 mb-3">Deliverables</h4>
                  <div className="space-y-3">
                    {milestone.deliverables?.map((deliverable, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
                        {deliverable.message && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
                            <p className="text-gray-700 text-sm">{deliverable.message}</p>
                          </div>
                        )}

                        {deliverable.files && deliverable.files.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                              Files ({deliverable.files.length}):
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                              {deliverable.files.map((file, fileIdx) => (
                                <div key={fileIdx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition-colors">
                                  {isImageFile(file.fileName) ? (
                                    <button
                                      onClick={() => setSelectedImage(file.fileUrl)}
                                      className="flex items-center gap-2 w-full text-left"
                                    >
                                      <Eye size={14} className="text-blue-600 flex-shrink-0" />
                                      <span className="text-sm text-gray-900 truncate">{file.fileName}</span>
                                    </button>
                                  ) : (
                                    <a
                                      href={file.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-2 w-full"
                                    >
                                      <FileText size={14} className="text-gray-600 flex-shrink-0" />
                                      <span className="text-sm text-gray-900 truncate">{file.fileName}</span>
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-4 text-xs text-gray-600 mt-3">
                          {deliverable.submittedAt && (
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>Submitted: {new Date(deliverable.submittedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                          {deliverable.approvedAt && (
                            <div className="flex items-center gap-1">
                              <CheckCircle size={12} className="text-green-600" />
                              <span>Approved: {new Date(deliverable.approvedAt).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedImage && (
        <ImageViewer
          isOpen={true}
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
};
