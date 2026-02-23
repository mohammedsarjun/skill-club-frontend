"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { FaFile, FaFileImage, FaFileVideo, FaFilePdf, FaFileWord, FaFileExcel, FaFileArchive, FaDownload, FaUpload, FaTrash, FaEye, FaCloudUploadAlt } from 'react-icons/fa';
import ImageViewerModal from '@/components/common/ImageViewer';
import VideoPlayer from '@/components/common/VideoPlayer';
import { IWorkspaceFile } from '@/types/interfaces/IContractWorkspace';
import { uploadApi } from '@/api/uploadApi';
import { formatDateGroupLabel, formatTimeShort } from '@/utils/formatDate';

interface FilesTabProps {
  contractId: string;
  files: IWorkspaceFile[];
  currentUserId: string;
  userRole: 'client' | 'freelancer';
  onUploadFile: (file: { fileName: string; fileUrl: string; fileSize: number; fileType: string }) => Promise<void>;
  onDeleteFile?: (fileId: string) => Promise<void>;
  contractStatus?: string;
}

// Group files by date
function groupFilesByDate(files: IWorkspaceFile[]): { date: string; files: IWorkspaceFile[] }[] {
  const sorted = [...files].sort(
    (a, b) => new Date(a.uploadedAt).getTime() - new Date(b.uploadedAt).getTime()
  );

  const groups: { date: string; files: IWorkspaceFile[] }[] = [];
  let currentDate = '';

  for (const file of sorted) {
    const fileDate = formatDateGroupLabel(file.uploadedAt);
    if (fileDate !== currentDate) {
      currentDate = fileDate;
      groups.push({ date: currentDate, files: [] });
    }
    groups[groups.length - 1].files.push(file);
  }

  return groups;
}

export const FilesTab = ({
  contractId,
  files,
  currentUserId,
  userRole,
  onUploadFile,
  onDeleteFile,
  contractStatus,
}: FilesTabProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: 'image' | 'video' | null; name: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const otherRoleLabel = userRole === 'client' ? 'Freelancer' : 'Client';
  const isUploadDisabled = contractStatus === 'cancelled' || contractStatus === 'disputed';
  console.log(files)

  const fileGroups = useMemo(() => groupFilesByDate(files), [files]);

  // Auto-scroll to bottom when new files appear
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [files.length]);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (!fileList || (fileList as FileList).length === 0) return;
      setUploading(true);
      try {
        const filesArray = Array.from(fileList);
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

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      await processFiles(e.target.files);
      e.target.value = '';
    },
    [processFiles]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (isUploadDisabled) return;
      if (e.dataTransfer.files) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles, isUploadDisabled]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatTime = (dateStr: string) => {
    return formatTimeShort(dateStr);
  };

  const getFileIcon = (fileType?: string, fileName?: string) => {
    const type = fileType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';
    if (type.startsWith('image/') || name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/))
      return <FaFileImage className="text-blue-400" />;
    if (type.startsWith('video/') || name.match(/\.(mp4|webm|ogg|mov|avi)$/))
      return <FaFileVideo className="text-purple-400" />;
    if (type === 'application/pdf' || name.endsWith('.pdf'))
      return <FaFilePdf className="text-red-400" />;
    if (type.includes('word') || name.match(/\.(doc|docx)$/))
      return <FaFileWord className="text-blue-500" />;
    if (type.includes('sheet') || type.includes('excel') || name.match(/\.(xls|xlsx|csv)$/))
      return <FaFileExcel className="text-green-500" />;
    if (type.includes('zip') || type.includes('rar') || type.includes('tar') || name.match(/\.(zip|rar|7z|tar|gz)$/))
      return <FaFileArchive className="text-yellow-500" />;
    return <FaFile className="text-gray-400" />;
  };

  const isImage = (fileType?: string, fileName?: string) => {
    const type = fileType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';
    return type.startsWith('image/') || !!name.match(/\.(jpg|jpeg|png|gif|webp)$/);
  };

  const isVideo = (fileType?: string, fileName?: string) => {
    const type = fileType?.toLowerCase() || '';
    const name = fileName?.toLowerCase() || '';
    return type.startsWith('video/') || !!name.match(/\.(mp4|webm|ogg|mov)$/);
  };

  const handlePreview = (file: IWorkspaceFile) => {
    if (isImage(file.fileType, file.fileName)) {
      setPreviewMedia({ url: file.fileUrl, type: 'image', name: file.fileName });
    } else if (isVideo(file.fileType, file.fileName)) {
      setPreviewMedia({ url: file.fileUrl, type: 'video', name: file.fileName });
    } else {
      window.open(file.fileUrl, '_blank');
    }
  };

  const isPreviewable = (fileType?: string, fileName?: string) =>
    isImage(fileType, fileName) || isVideo(fileType, fileName);

  const renderFileCard = (file: IWorkspaceFile, isMine: boolean) => {
    const showThumbnail = isImage(file.fileType, file.fileName);
    const showVideoThumb = isVideo(file.fileType, file.fileName);

    return (
      <div
        className={`max-w-[380px] w-full rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
          isMine
            ? 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200/60'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* Thumbnail area */}
        {showThumbnail && (
          <div
            className="relative w-full h-44 bg-gray-100 cursor-pointer group"
            onClick={() => handlePreview(file)}
          >
            <img
              src={file.fileUrl}
              alt={file.fileName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <FaEye className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </div>
        )}
        {showVideoThumb && (
          <div
            className="relative w-full h-44 bg-gray-900 cursor-pointer group flex items-center justify-center"
            onClick={() => handlePreview(file)}
          >
            <video
              src={file.fileUrl}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors z-10">
              <FaFileVideo className="text-white text-3xl drop-shadow-lg" />
            </div>
          </div>
        )}

        {/* File info */}
        <div className="p-3.5">
          <div className="flex items-start gap-2.5">
            <div className="text-xl mt-0.5 flex-shrink-0">
              {getFileIcon(file.fileType, file.fileName)}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-medium text-gray-900 truncate"
                title={file.fileName}
              >
                {file.fileName}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {file.fileSize ? formatFileSize(file.fileSize) : 'Unknown size'}
                <span className="mx-1.5">·</span>
                {formatTime(file.uploadedAt)}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-gray-100">
            {isPreviewable(file.fileType, file.fileName) && (
              <button
                onClick={() => handlePreview(file)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <FaEye className="text-[11px]" />
                Preview
              </button>
            )}
            <a
              href={file.fileUrl}
              download={file.fileName}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FaDownload className="text-[11px]" />
              Download
            </a>
            {onDeleteFile && isMine && (
              <button
                onClick={() => file.fileId && onDeleteFile(file.fileId)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-auto"
              >
                <FaTrash className="text-[11px]" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-280px)] min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Shared Files</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {files.length} file{files.length !== 1 ? 's' : ''} shared
          </p>
        </div>
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
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isUploadDisabled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98]'
            }`}
          >
            <FaUpload className="text-xs" />
            {uploading ? 'Uploading...' : 'Upload Files'}
          </label>
        </div>
      </div>

      {isUploadDisabled && (
        <div className="mx-6 mt-3 bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          <p className="text-amber-800 text-xs text-center">
            {contractStatus === 'cancelled'
              ? 'This contract has been cancelled. File uploads are disabled.'
              : 'This contract is under dispute. File uploads are disabled.'}
          </p>
        </div>
      )}

      {/* Files area — chat-style scrollable */}
      <div
        ref={scrollRef}
        className={`flex-1 overflow-y-auto px-6 py-4 space-y-1 ${dragOver ? 'bg-blue-50/40' : ''}`}
        onDragOver={(e) => { e.preventDefault(); if (!isUploadDisabled) setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <FaCloudUploadAlt className="text-3xl text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No files shared yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Upload files or drag and drop them here
            </p>
          </div>
        ) : (
          fileGroups.map((group, groupIdx) => (
            <div key={groupIdx}>
              {/* Date separator */}
              <div className="flex items-center justify-center my-5">
                <div className="flex-1 border-t border-gray-200" />
                <span className="mx-4 text-xs font-medium text-gray-400 bg-white px-2 whitespace-nowrap">
                  {group.date}
                </span>
                <div className="flex-1 border-t border-gray-200" />
              </div>

              {/* Files in this date group */}
              <div className="space-y-4">
                {group.files.map((file, fileIdx) => {
                  const isMine = file.uploadedBy === currentUserId;

                  return (
                    <div
                      key={file.fileId || fileIdx}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender label */}
                      <span
                        className={`text-[11px] font-medium mb-1.5 px-1 ${
                          isMine ? 'text-blue-500' : 'text-gray-500'
                        }`}
                      >
                        {isMine ? 'You' : otherRoleLabel}
                      </span>

                      {renderFileCard(file, isMine)}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Uploading indicator */}
        {uploading && (
          <div className="flex justify-end mt-3">
            <div className="max-w-[380px] w-full rounded-2xl bg-blue-50 border border-blue-200/60 p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-200/50 flex items-center justify-center">
                  <FaUpload className="text-blue-500 text-sm animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">Uploading...</p>
                  <p className="text-xs text-blue-500">Please wait</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
            <div className="bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-2xl p-10 text-center backdrop-blur-sm">
              <FaCloudUploadAlt className="text-5xl text-blue-500 mx-auto mb-3" />
              <p className="text-blue-700 font-semibold text-lg">Drop files here</p>
            </div>
          </div>
        )}
      </div>

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
