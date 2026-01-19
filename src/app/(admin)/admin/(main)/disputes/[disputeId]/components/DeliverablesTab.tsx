import React, { useState } from 'react';
import { FileText, Calendar, CheckCircle, Eye } from 'lucide-react';
import { IAdminDisputeDeliverable } from '@/types/interfaces/IAdminDisputeDetail';
import ImageViewer from '@/components/common/ImageViewer';

interface DeliverablesTabProps {
  deliverables: IAdminDisputeDeliverable[];
}

export const DeliverablesTab: React.FC<DeliverablesTabProps> = ({ deliverables }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      submitted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      revision_requested: 'bg-orange-100 text-orange-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const isImageFile = (fileName: string): boolean => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
    return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  if (deliverables.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText size={48} className="mx-auto mb-3 opacity-50" />
        <p>No deliverables submitted yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contract Deliverables</h2>
      {deliverables.map((deliverable, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-5 bg-white">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-gray-900">Deliverable #{index + 1}</h3>
              <p className="text-sm text-gray-500">Submitted by {deliverable.submittedBy}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(deliverable.status)}`}>
              {deliverable.status.replace(/_/g, ' ').toUpperCase()}
            </span>
          </div>

          {deliverable.message && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Message:</p>
              <p className="text-gray-700">{deliverable.message}</p>
            </div>
          )}

          {deliverable.files && deliverable.files.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Files ({deliverable.files.length}):</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {deliverable.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded hover:bg-gray-100 transition-colors">
                    {isImageFile(file.fileName) ? (
                      <button
                        onClick={() => setSelectedImage(file.fileUrl)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        <Eye size={16} className="text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">{file.fileName}</span>
                      </button>
                    ) : (
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 w-full"
                      >
                        <FileText size={16} className="text-gray-600 flex-shrink-0" />
                        <span className="text-sm text-gray-900 truncate">{file.fileName}</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-6 text-sm text-gray-600">
            {deliverable.submittedAt && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Submitted: {new Date(deliverable.submittedAt).toLocaleDateString()}</span>
              </div>
            )}
            {deliverable.approvedAt && (
              <div className="flex items-center gap-1">
                <CheckCircle size={14} className="text-green-600" />
                <span>Approved: {new Date(deliverable.approvedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      ))}

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
