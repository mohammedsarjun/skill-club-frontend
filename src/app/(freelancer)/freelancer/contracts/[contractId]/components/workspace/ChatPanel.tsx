"use client";
import { useState, useCallback, useRef, useEffect } from 'react';
import { FaPaperPlane, FaPaperclip, FaFile, FaFileImage, FaFileVideo } from 'react-icons/fa';
import { IChatMessage, ISocketNewMessagePayload, ISocketMessagesReadPayload } from '@/types/interfaces/IContractWorkspace';
import { uploadApi } from '@/api/uploadApi';
import { useSocket } from '@/hooks/useSocket';
import { freelancerActionApi } from '@/api/action/FreelancerActionApi';
import ImageViewerModal from '@/components/common/ImageViewer';
import VideoPlayer from '@/components/common/VideoPlayer';

interface ChatPanelProps {
  contractId: string;
  currentUserId: string;
  contractStatus?: string;
}

export const ChatPanel = ({
  contractId,
  currentUserId,
  contractStatus,
}: ChatPanelProps) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: 'image' | 'video' | null; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
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
        const response = await freelancerActionApi.getChatMessages(contractId, 100, 0);
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

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }, []);

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

      await freelancerActionApi.sendChatMessage({
        contractId,
        message: newMessage.trim(),
        attachments: uploadedAttachments.length > 0 ? uploadedAttachments : undefined,
      });

      setNewMessage('');
      setAttachments([]);
      // clear native file input value if present
      try {
        if (fileInputRef.current) fileInputRef.current.value = '';
        else {
          const el = document.getElementById('chat-file-upload') as HTMLInputElement | null;
          if (el) el.value = '';
        }
      } catch (e) {
        // ignore
      }
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSending(false);
    }
  }, [newMessage, attachments, contractId]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[600px]">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Chat</h3>
      </div>

      {contractStatus === 'completed' && (
        <div className="mx-4 mt-4 p-3 bg-gray-100 border border-gray-300 rounded-lg text-center text-sm text-gray-700">
          Contract is completed. Chat is no longer available.
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-center text-sm text-gray-500 py-12">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-12">No messages yet</div>
        ) : (
          messages.map((msg, index) => {
          const isOwnMessage = msg.senderId === currentUserId;
          return (
            <div key={index} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                {!isOwnMessage && (
                  <div className="flex items-center gap-2 mb-1">
                    {msg.senderAvatar && (
                      <img src={msg.senderAvatar} alt={msg.senderName} className="w-6 h-6 rounded-full" />
                    )}
                    <span className="text-xs font-medium text-gray-600">{msg.senderName}</span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-3 ${
                    isOwnMessage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {msg.attachments.map((att, idx) => {
                          const name = att.fileName?.toLowerCase() || '';
                          const isImage = name.match(/\.(jpg|jpeg|png|gif|webp)$/);
                          const isVideo = name.match(/\.(mp4|webm|ogg|mov)$/);
                          
                          return (
                            <div
                              key={idx}
                              onClick={() => {
                                if (isImage) setPreviewMedia({ url: att.fileUrl, type: 'image', name: att.fileName });
                                else if (isVideo) setPreviewMedia({ url: att.fileUrl, type: 'video', name: att.fileName });
                                else window.open(att.fileUrl, '_blank');
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
                              <span className="truncate max-w-[200px]" title={att.fileName}>{att.fileName}</span>
                            </div>
                          );
                        })}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm">
                <FaFile className="text-gray-500 text-xs" />
                <span className="text-gray-700">{file.name}</span>
                <button onClick={() => removeAttachment(index)} className="text-red-500 hover:text-red-700 text-xs">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
            id="chat-file-upload"
            disabled={isChatDisabled}
          />
          <label
            htmlFor="chat-file-upload"
            className={`px-3 py-2 rounded-lg transition-colors ${isChatDisabled ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 cursor-pointer'}`}
          >
            <FaPaperclip />
          </label>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isChatDisabled ? 'Chat disabled for cancelled contracts' : 'Type a message...'}
            disabled={isChatDisabled}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={sending || (!newMessage.trim() && attachments.length === 0) || isChatDisabled}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
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
