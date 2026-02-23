"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { FaPaperPlane, FaPaperclip, FaFile, FaFileImage, FaFileVideo } from 'react-icons/fa';
import { IChatMessage, ISocketNewMessagePayload, ISocketMessagesReadPayload } from '@/types/interfaces/IContractWorkspace';
import { uploadApi } from '@/api/uploadApi';
import { useSocket } from '@/hooks/useSocket';
import { clientActionApi } from '@/api/action/ClientActionApi';
import ImageViewerModal from '@/components/common/ImageViewer';
import VideoPlayer from '@/components/common/VideoPlayer';

interface ChatPanelProps {
  contractId: string;
  currentUserId: string;
  contractStatus?: string;
}

export const ChatPanel = ({ contractId, currentUserId, contractStatus }: ChatPanelProps) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: 'image' | 'video' | null; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { socket, isConnected } = useSocket();

  const isChatDisabled = contractStatus === 'cancelled';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await clientActionApi.getChatMessages(contractId, 100, 0);



        if (response?.success && response.data) {
          setMessages(response.data);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
  }, [contractId]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.emit('join_contract', { contractId });

    const handleNewMessage = (payload: ISocketNewMessagePayload) => {
      if (payload.contractId === contractId) {
        setMessages((prev) => [...prev, {
          messageId: payload.messageId,
          contractId: payload.contractId,
          senderId: payload.senderId,
          senderRole: payload.senderRole,
          senderName: payload.senderName || 'Unknown',
          senderAvatar: payload.senderAvatar,
          message: payload.message,
          attachments: payload.attachments?.map((a) => ({ fileName: a.fileName, fileUrl: a.fileUrl })),
          sentAt: payload.sentAt,
          isRead: false,
        }]);
      }
    };

    const handleMessagesRead = (payload: ISocketMessagesReadPayload) => {
      if (payload.contractId === contractId && payload.readBy !== currentUserId) {
        setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.emit('leave_contract', { contractId });
      socket.off('new_message', handleNewMessage);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, isConnected, contractId, currentUserId]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      setAttachments((prev) => [...prev, ...Array.from(files)]);
    }
  }, []);

  const handleRemoveAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const uploadAttachments = useCallback(async (): Promise<{ fileName: string; fileUrl: string }[]> => {
    const uploaded: { fileName: string; fileUrl: string }[] = [];
    for (const file of attachments) {
      const res = await uploadApi.uploadFile(file, {
        folder: `contracts/${contractId}/chat`,
        resourceType: 'auto',
      });
      const fileUrl = (res as any).secureUrl || (res as any).secure_url || (res as any).url || (res as any).secureURL;
      if (res && fileUrl) {
        uploaded.push({ fileName: file.name, fileUrl });
      }
    }
    return uploaded;
  }, [attachments, contractId]);

  const handleSend = useCallback(async () => {

    if (!newMessage.trim() && attachments.length === 0) return;
    setSending(true);
    try {
      const uploadedAttachments: { fileName: string; fileUrl: string; fileSize: number; fileType: string }[] = [];
      if (attachments.length > 0) {

        for (const file of attachments) {
          const res = await uploadApi.uploadFile(file, {
            folder: `contracts/${contractId}/chat`,
            resourceType: 'auto',
          });
          if (res?.secureUrl) {
            uploadedAttachments.push({
              fileName: file.name,
              fileUrl: res.secureUrl,
              fileSize: file.size,
              fileType: file.type || 'application/octet-stream',
            });
          }
        }
      }

     
      await clientActionApi.sendChatMessage({
        contractId,
        message: newMessage.trim(),
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      });

      setNewMessage('');
      setAttachments([]);
      // clear native file input value if present
      try {
        if (fileInputRef.current) fileInputRef.current.value = '';
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  }, [newMessage, attachments, contractId]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {contractStatus === 'completed' && (
        <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-center text-sm text-gray-700">
          Contract is completed. Chat is no longer available.
        </div>
      )}
      <div className="max-h-[420px] overflow-y-auto space-y-4 mb-4">
        {loading ? (
          <div className="text-center text-sm text-gray-500 py-12">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-12">No messages yet</div>
        ) : (
          messages.map((m) => {
            const isOwnMessage = m.senderId === currentUserId;
            return (
              <div key={m.messageId} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                  {!isOwnMessage && (
                    <div className="flex items-center gap-2 mb-1">
                      {m.senderAvatar && (
                        <img src={m.senderAvatar} alt={m.senderName} className="w-6 h-6 rounded-full" />
                      )}
                      <span className="text-xs font-medium text-gray-600">{m.senderName}</span>
                    </div>
                  )}
                  <div
                    className={`rounded-lg p-3 ${
                      isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.attachments.map((a, idx) => {
                          const name = a.fileName?.toLowerCase() || '';
                          const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/);
                          const isVideo = name.match(/\.(mp4|webm|ogg|mov)$/);
                          
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (isImage) setPreviewMedia({ url: a.fileUrl, type: 'image', name: a.fileName });
                                else if (isVideo) setPreviewMedia({ url: a.fileUrl, type: 'video', name: a.fileName });
                                else window.open(a.fileUrl, '_blank');
                              }}
                              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                                isOwnMessage ? 'bg-blue-700 hover:bg-blue-800 text-white' : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                              } text-xs`}
                            >
                              {isImage ? (
                                <FaFileImage className={isOwnMessage ? 'text-blue-200' : 'text-blue-400'} />
                              ) : isVideo ? (
                                <FaFileVideo className={isOwnMessage ? 'text-purple-200' : 'text-purple-400'} />
                              ) : (
                                <FaFile className={isOwnMessage ? 'text-gray-300' : 'text-gray-400'} />
                              )}
                              <span className="truncate max-w-[200px]" title={a.fileName}>{a.fileName}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {new Date(m.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="space-y-2">
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {attachments.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded">
                <FaFile />
                <span className="text-sm">{f.name}</span>
                <button onClick={() => handleRemoveAttachment(i)} className="ml-2 text-xs text-red-600">Remove</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className={`p-2 rounded ${isChatDisabled ? 'bg-gray-200 cursor-not-allowed' : 'cursor-pointer bg-gray-100 hover:bg-gray-200'}`}>
            <FaPaperclip />
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} disabled={isChatDisabled} />
          </label>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={isChatDisabled ? 'Chat disabled for cancelled contracts' : 'Write a message...'}
            rows={2}
            disabled={isChatDisabled}
            className="flex-1 px-4 py-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button onClick={() => void handleSend()} disabled={sending || isChatDisabled} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed">
            <FaPaperPlane />
          </button>
        </div>
      </div>

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
