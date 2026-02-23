"use client";
import { useState, useCallback } from 'react';
import { FaFile, FaFileImage, FaFileVideo, FaDownload, FaUpload, FaTrash, FaEye } from 'react-icons/fa';
import ImageViewerModal from '@/components/common/ImageViewer';
import VideoPlayer from '@/components/common/VideoPlayer';
import { IWorkspaceFile } from '@/types/interfaces/IContractWorkspace';
import { uploadApi } from '@/api/uploadApi';

interface FilesTabProps {
  contractId: string;
  files: IWorkspaceFile[];
  currentUserId: string;
  onUploadFile: (file: { fileName: string; fileUrl: string; fileSize: number; fileType: string }) => Promise<void>;
  onDeleteFile?: (fileId: string) => Promise<void>;
  contractStatus?: string;
}

export const FilesTab = ({
  contractId,
  files,
  currentUserId,
  onUploadFile,
  onDeleteFile,
  contractStatus,
}: FilesTabProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: 'image' | 'video' | null; name: string } | null>(null);

  const isUploadDisabled = contractStatus === 'cancelled' || contractStatus === 'disputed';

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      setUploading(true);
      try {
        const filesArray = Array.from(e.target.files);
        await Promise.all(
          filesArray.map(async (file) => {
            const uploaded = await uploadApi.uploadFile(file, {
              folder: `contracts/${contractId}/files`,
              resourceType: 'auto',
            });
            await onUploadFile({
              fileName: file.name,
              fileUrl: (uploaded as any).secureUrl || (uploaded as any).secure_url || (uploaded as any).url || uploaded.url,
              fileSize: file.size,
              fileType: file.type || 'application/octet-stream',
            });
          })
        );
      } catch (error) {
        console.error('Failed to upload files', error);
      } finally {
        setUploading(false);
      }
    },
    [contractId, onUploadFile]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getFileIcon = (fileType?: string, fileName?: string) => {
    const type = fileType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';
    if (type.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return <FaFileImage className="text-blue-400 text-2xl" />;
    }
    if (type.startsWith('video/') || name.match(/\.(mp4|webm|ogg|mov)$/)) {
      return <FaFileVideo className="text-purple-400 text-2xl" />;
    }
    return <FaFile className="text-gray-400 text-2xl" />;
  };

  const handlePreview = (file: IWorkspaceFile) => {
    const type = file.fileType?.toLowerCase() || '';
    const name = file.fileName?.toLowerCase() || '';
    
    if (type.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      setPreviewMedia({ url: file.fileUrl, type: 'image', name: file.fileName });
    } else if (type.startsWith('video/') || name.match(/\.(mp4|webm|ogg|mov)$/)) {
      setPreviewMedia({ url: file.fileUrl, type: 'video', name: file.fileName });
    } else {
      // not previewable, download or open in new tab
      window.open(file.fileUrl, '_blank');
    }
  };

  const isPreviewable = (fileType?: string, fileName?: string) => {
    const type = fileType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';
    return type.startsWith('image/') || type.startsWith('video/') || name.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {isUploadDisabled && (
        <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-amber-800 text-sm text-center">
            {contractStatus === 'cancelled' 
              ? 'This contract has been cancelled. File uploads are disabled.' 
              : 'This contract is under dispute. File uploads are disabled.'}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Shared Files</h3>
        <div>
          <input
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="files-tab-upload"
            disabled={isUploadDisabled}
          />
          <label
            htmlFor="files-tab-upload"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isUploadDisabled
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
            }`}
          >
            <FaUpload />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </label>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-12">
          <FaFile className="mx-auto text-5xl text-gray-300 mb-3" />
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors group relative cursor-pointer"
              onClick={() => handlePreview(file)}
            >
              <div className="flex items-start justify-between mb-2">
                {getFileIcon(file.fileType, file.fileName)}
                <div className="flex gap-2 relative z-10" onClick={e => e.stopPropagation()}>
                  {isPreviewable(file.fileType, file.fileName) && (
                     <button
                       onClick={(e) => { e.stopPropagation(); handlePreview(file); }}
                       className="text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                       title="Preview"
                     >
                       <FaEye className="text-sm" />
                     </button>
                  )}
                  <a
                    href={file.fileUrl}
                    download={file.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Download/Open"
                  >
                    <FaDownload className="text-sm" />
                  </a>
                  {onDeleteFile && file.uploadedBy === currentUserId && (
                    <button
                      onClick={(e) => { e.stopPropagation(); file.fileId && onDeleteFile(file.fileId); }}
                      className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
              <h4 className="text-sm font-medium text-gray-900 mb-1 truncate mt-2" title={file.fileName}>
                {file.fileName}
              </h4>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <span>{file.fileSize ? formatFileSize(file.fileSize) : 'Unknown size'}</span>
                <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Previews */}
      {previewMedia?.type === 'image' && (
        <ImageViewerModal
          isOpen={true}
          onClose={() => setPreviewMedia(null)}
          imageUrl={previewMedia.url}
          title={previewMedia.name}
        />
      )}
      
      {previewMedia?.type === 'video' && (
        <VideoPlayer
          onClose={() => setPreviewMedia(null)}
          videoUrl={previewMedia.url}
          title={previewMedia.name}
        />
      )}
    </div>
  );
};
