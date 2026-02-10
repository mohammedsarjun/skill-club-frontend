"use client";

import React, { useEffect, useRef, useState } from "react";
const { startAgora } = await import("@/utils/agoraInitialize");
import { useParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { clientActionApi } from "@/api/action/ClientActionApi";

const VideoMeetingPage = () => {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.meetingId as string;

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const initializeCall = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      try {
        setIsInitializing(true);

        const res = await clientActionApi.joinMeet(meetingId);
        const data = res.data;


        const { isAudioEnabled, isVideoEnabled } = await startAgora({
          ...data,
          localVideoRef: localVideoRef.current,
          remoteVideoRef: remoteVideoRef.current,
        });

        // Sync UI state: isMuted=true means OFF, enabled=true means ON, so invert
        setIsMuted(!isAudioEnabled);
        setIsVideoOff(!isVideoEnabled);

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

  // ✅ FIXED: Mic toggle (single source of truth)
  const handleToggleMute = async () => {
    const { toggleMute } = await import("@/utils/agoraInitialize");
    const isMicOn = toggleMute(); // true = mic enabled in Agora

    console.log(isMicOn)

    setIsMuted(!isMicOn); // isMuted=true means muted, so invert
    toast.success(isMicOn ? "Microphone on" : "Microphone off");
  };

  // ✅ FIXED: Camera toggle (single source of truth)
  const handleToggleVideo = async () => {
    const { toggleVideo } = await import("@/utils/agoraInitialize");
    const isCameraOn = toggleVideo(); // true = camera enabled in Agora

    setIsVideoOff(!isCameraOn); // isVideoOff=true means off, so invert
    toast.success(isCameraOn ? "Camera on" : "Camera off");
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
          {/* Remote Video */}
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

          {/* Local Video */}
          <div className="relative bg-gray-800 rounded-lg overflow-hidden">
            <div
              id="local-player"
              ref={localVideoRef}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-white text-sm font-medium">
            Meeting ID: {meetingId.slice(0, 8)}
          </span>

          <div className="flex items-center gap-3">
            {/* Mic */}
            <button
              onClick={handleToggleMute}
              className={`p-4 rounded-full transition-colors ${isMuted
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

            {/* Camera */}
            <button
              onClick={handleToggleVideo}
              className={`p-4 rounded-full transition-colors ${isVideoOff
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

            {/* Leave */}
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
