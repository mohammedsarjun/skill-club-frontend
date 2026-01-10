"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Monitor,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import toast from "react-hot-toast";
import { clientActionApi } from "@/api/action/ClientActionApi";

const VideoMeetingPage = () => {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    const initializeCall = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        setIsInitializing(true);
        const res = await clientActionApi.joinMeet(meetingId);
        const data = res.data;
        
        const { startAgora } = await import("@/utils/agoraInitialize");
        await startAgora(data);
        toast.success("Connected to meeting");
      } catch (error) {
        console.error("Error initializing video call:", error);
        toast.error("Failed to connect to meeting");
        router.back();
      } finally {
        setIsInitializing(false);
      }
    };

    initializeCall();

    return () => {
      if (hasInitialized.current) {
        import("@/utils/agoraInitialize").then(({ leaveMeeting }) => {
          leaveMeeting().catch(console.error);
        });
      }
    };
  }, [meetingId, router]);

  const handleToggleMute = async () => {
    const { toggleMute } = await import("@/utils/agoraInitialize");
    const enabled = toggleMute();
    setIsMuted(!enabled);
    toast.success(enabled ? "Microphone on" : "Microphone off");
  };

  const handleToggleVideo = async () => {
    const { toggleVideo } = await import("@/utils/agoraInitialize");
    const enabled = toggleVideo();

    if (!enabled) {
      toast.success("Camera on");
      setIsVideoOff(false);
    } else {

      toast.success("Camera off");
      setIsVideoOff(true);
    }
  };

  const handleLeaveMeeting = async () => {
    try {
      const { leaveMeeting } = await import("@/utils/agoraInitialize");
      await leaveMeeting();
      toast.success("Left meeting");
      router.back();
    } catch (error) {
      console.error("Error leaving meeting:", error);
      toast.error("Failed to leave meeting");
      router.back();
    }
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast.error(
      isScreenSharing ? "Screen sharing stopped" : "Screen sharing started"
    );
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {isInitializing && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Connecting to meeting...</p>
          </div>
        </div>
      )}
      <div className="flex-1 relative">
        <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-2 p-4">
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div
              id="remote-player"
              ref={remoteVideoRef}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-400">Waiting for participant...</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-md">
              <p className="text-white text-sm font-medium">Freelancer</p>
            </div>
          </div>

          <div className="relative bg-gray-800 rounded-lg overflow-hidden w-full h-full">
      
              <div
                id="local-player"
                ref={localVideoRef}
                className="w-full h-full"
              />
 
          </div>
        </div>

        {showChat && (
          <div className="absolute right-4 top-4 bottom-24 w-80 bg-white rounded-lg shadow-xl flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Chat</h3>
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="text-center text-gray-400 text-sm">
                No messages yet
              </p>
            </div>
            <div className="p-4 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {showParticipants && (
          <div className="absolute right-4 top-4 w-64 bg-white rounded-lg shadow-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Participants (2)</h3>
              <button
                onClick={() => setShowParticipants(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">You</span>
                </div>
                <span className="text-sm text-gray-900">You (Client)</span>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm text-gray-900">Freelancer</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">
              Meeting ID: {meetingId.slice(0, 8)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleMute}
              className={`p-4 rounded-full transition-colors ${
                isMuted
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <MicOff className="w-5 h-5 text-white" />
              ) : (
                <Mic className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={handleToggleVideo}
              className={`p-4 rounded-full transition-colors ${
                isVideoOff
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? (
                <VideoOff className="w-5 h-5 text-white" />
              ) : (
                <Video className="w-5 h-5 text-white" />
              )}
            </button>

            <button
              onClick={handleScreenShare}
              className={`p-4 rounded-full transition-colors ${
                isScreenSharing
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}
              title="Share screen"
            >
              <Monitor className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Participants"
            >
              <Users className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={() => setShowChat(!showChat)}
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Chat"
            >
              <MessageSquare className="w-5 h-5 text-white" />
            </button>

            <button
              className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={handleLeaveMeeting}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-colors ml-2"
              title="Leave meeting"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Recording</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingPage;
